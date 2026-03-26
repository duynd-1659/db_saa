-- =============================================================================
-- SAA 2025 — Initial Database Schema
-- Supabase Auth compatible (extends auth.users via profiles table)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. ENUM types
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('user', 'admin');

-- ---------------------------------------------------------------------------
-- 2. departments
-- ---------------------------------------------------------------------------
create table public.departments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

comment on table  public.departments        is 'Sun* department / team list';
comment on column public.departments.name   is 'Short department code, e.g. CEVC2';

-- ---------------------------------------------------------------------------
-- 3. profiles  (extends auth.users — one row per user)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text,
  email         text not null unique,
  avatar_url    text,
  department_id uuid references public.departments (id) on delete set null,
  role          public.user_role not null default 'user',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.profiles               is 'Public profile data linked to Supabase auth.users';
comment on column public.profiles.id            is 'Matches auth.users.id';
comment on column public.profiles.role          is 'user = regular employee; admin = can access dashboard';

-- Auto-create profile on new user sign-up (Google OAuth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. hashtags
-- ---------------------------------------------------------------------------
create table public.hashtags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,  -- without '#'; e.g. 'Toàn diện'
  created_at timestamptz not null default now()
);

comment on table  public.hashtags      is 'Predefined hashtag list selectable when writing a kudo';
comment on column public.hashtags.name is 'Label without ''#'' prefix';

-- ---------------------------------------------------------------------------
-- 5. kudos
-- ---------------------------------------------------------------------------
create table public.kudos (
  id               uuid primary key default gen_random_uuid(),
  sender_id        uuid references public.profiles (id) on delete set null,
  recipient_id     uuid not null references public.profiles (id) on delete cascade,
  content          text not null,       -- rich-text HTML / markdown
  is_anonymous     boolean not null default false,
  anonymous_name   text,                -- custom display name when is_anonymous = true
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint kudos_content_not_empty check (char_length(trim(content)) > 0),
  constraint kudos_anonymous_name_required
    check (not is_anonymous or anonymous_name is not null)
);

comment on table  public.kudos                is 'Kudo posts — appreciation messages between employees';
comment on column public.kudos.sender_id      is 'Null when is_anonymous = true (identity hidden from public)';
comment on column public.kudos.anonymous_name is 'Display name shown on card when sent anonymously';
comment on column public.kudos.content        is 'Rich-text body; supports bold, italic, links, lists, @mentions';

create trigger kudos_set_updated_at
  before update on public.kudos
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 6. kudo_hashtags  (many-to-many)
-- ---------------------------------------------------------------------------
create table public.kudo_hashtags (
  kudo_id    uuid not null references public.kudos    (id) on delete cascade,
  hashtag_id uuid not null references public.hashtags (id) on delete cascade,
  primary key (kudo_id, hashtag_id)
);

comment on table public.kudo_hashtags is 'Junction: kudos ↔ hashtags (1–5 tags per kudo)';

-- ---------------------------------------------------------------------------
-- 7. kudo_images
-- ---------------------------------------------------------------------------
create table public.kudo_images (
  id          uuid primary key default gen_random_uuid(),
  kudo_id     uuid not null references public.kudos (id) on delete cascade,
  url         text not null,      -- Supabase Storage public URL
  order_index smallint not null default 0,
  created_at  timestamptz not null default now(),

  constraint kudo_images_order_positive check (order_index >= 0)
);

comment on table  public.kudo_images             is 'Up to 5 attached images per kudo';
comment on column public.kudo_images.url         is 'Supabase Storage public URL';
comment on column public.kudo_images.order_index is 'Display order (0-based)';

-- max 5 images per kudo enforced via trigger
create or replace function public.check_kudo_image_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.kudo_images where kudo_id = new.kudo_id) >= 5 then
    raise exception 'A kudo may have at most 5 images';
  end if;
  return new;
end;
$$;

create trigger enforce_kudo_image_limit
  before insert on public.kudo_images
  for each row execute procedure public.check_kudo_image_limit();

-- ---------------------------------------------------------------------------
-- 8. kudo_likes
-- ---------------------------------------------------------------------------
create table public.kudo_likes (
  kudo_id    uuid not null references public.kudos    (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (kudo_id, user_id)
);

comment on table public.kudo_likes is 'Heart/like reactions — one per user per kudo';

-- ---------------------------------------------------------------------------
-- 9. badges
-- ---------------------------------------------------------------------------
create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  image_url   text,
  drop_rate   numeric(5, 4) not null
                check (drop_rate > 0 and drop_rate <= 1),  -- e.g. 0.3000 = 30%
  created_at  timestamptz not null default now()
);

comment on table  public.badges           is 'Collectible badge types obtainable from Secret Boxes';
comment on column public.badges.drop_rate is 'Probability of receiving this badge (0 < rate ≤ 1). Sum of all rates must equal 1.';

-- ---------------------------------------------------------------------------
-- 10. user_secret_boxes
-- ---------------------------------------------------------------------------
create table public.user_secret_boxes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  is_opened   boolean not null default false,
  opened_at   timestamptz,
  badge_id    uuid references public.badges (id) on delete set null,  -- set after opening
  created_at  timestamptz not null default now(),

  constraint secret_box_opened_consistency
    check (
      (is_opened = false and opened_at is null  and badge_id is null)
      or
      (is_opened = true  and opened_at is not null and badge_id is not null)
    )
);

comment on table  public.user_secret_boxes         is 'Secret boxes awarded to users; each box grants one random badge on opening';
comment on column public.user_secret_boxes.badge_id is 'Randomly assigned badge when the box is opened';

-- ---------------------------------------------------------------------------
-- 11. app_config  (key-value store for runtime configuration)
-- ---------------------------------------------------------------------------
create table public.app_config (
  key        text primary key,
  value      text not null,
  note       text,
  updated_at timestamptz not null default now()
);

create trigger app_config_set_updated_at
  before update on public.app_config
  for each row execute procedure public.set_updated_at();

comment on table  public.app_config       is 'Runtime application configuration (key-value)';
comment on column public.app_config.key   is 'e.g. event_start_datetime, countdown_enabled';
comment on column public.app_config.value is 'String value; ISO-8601 for datetimes';

-- ---------------------------------------------------------------------------
-- 12. Indexes  (performance)
-- ---------------------------------------------------------------------------
-- kudos feed (newest first, by recipient, by sender)
create index idx_kudos_recipient_id    on public.kudos (recipient_id, created_at desc);
create index idx_kudos_sender_id       on public.kudos (sender_id,    created_at desc);
create index idx_kudos_created_at      on public.kudos (created_at desc);

-- likes count per kudo (used for highlight/top kudos ranking)
create index idx_kudo_likes_kudo_id    on public.kudo_likes (kudo_id);

-- hashtag filtering on kudos
create index idx_kudo_hashtags_hashtag on public.kudo_hashtags (hashtag_id);

-- secret boxes per user (filter unopened)
create index idx_secret_boxes_user     on public.user_secret_boxes (user_id, is_opened);

-- profiles by department (used for "Phòng ban" filter)
create index idx_profiles_department   on public.profiles (department_id);

-- ---------------------------------------------------------------------------
-- 13. VIEWS  (convenience)
-- ---------------------------------------------------------------------------

-- kudos with like counts (used for highlight ranking and feed display)
create or replace view public.kudos_with_stats as
select
  k.*,
  coalesce(l.like_count, 0) as like_count
from public.kudos k
left join (
  select kudo_id, count(*) as like_count
  from public.kudo_likes
  group by kudo_id
) l on l.kudo_id = k.id;

comment on view public.kudos_with_stats is 'Kudos with aggregated like counts; use for leaderboard and highlight carousel';

-- user stats sidebar (kudos sent, received, likes received, unopened secret boxes)
create or replace view public.user_stats as
select
  p.id                                                       as user_id,
  coalesce(sent.cnt,  0)                                     as kudos_sent,
  coalesce(recv.cnt,  0)                                     as kudos_received,
  coalesce(likes.cnt, 0)                                     as likes_received,
  coalesce(boxes.cnt, 0)                                     as secret_boxes_pending
from public.profiles p
left join (
  select sender_id    as uid, count(*) as cnt from public.kudos    group by sender_id
) sent  on sent.uid  = p.id
left join (
  select recipient_id as uid, count(*) as cnt from public.kudos    group by recipient_id
) recv  on recv.uid  = p.id
left join (
  select kl.user_id   as uid, count(*) as cnt
  from public.kudo_likes kl
  join public.kudos k on k.id = kl.kudo_id
  where k.recipient_id = kl.user_id
  group by kl.user_id
) likes on likes.uid = p.id
left join (
  select user_id      as uid, count(*) as cnt
  from public.user_secret_boxes
  where is_opened = false
  group by user_id
) boxes on boxes.uid = p.id;

comment on view public.user_stats is 'Per-user aggregated stats: kudos sent/received, likes received, unopened secret boxes';

-- ---------------------------------------------------------------------------
-- 14. Row Level Security (RLS)
-- ---------------------------------------------------------------------------

-- --- profiles ---
alter table public.profiles enable row level security;

create policy "profiles: public read"
  on public.profiles for select
  using (true);

create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);

-- --- departments ---
alter table public.departments enable row level security;

create policy "departments: public read"
  on public.departments for select
  using (true);

create policy "departments: admin write"
  on public.departments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- hashtags ---
alter table public.hashtags enable row level security;

create policy "hashtags: public read"
  on public.hashtags for select
  using (true);

create policy "hashtags: admin write"
  on public.hashtags for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- kudos ---
alter table public.kudos enable row level security;

create policy "kudos: public read"
  on public.kudos for select
  using (true);

create policy "kudos: authenticated insert"
  on public.kudos for insert
  with check (
    auth.uid() is not null
    and (
      -- non-anonymous: sender_id must match logged-in user
      (not is_anonymous and sender_id = auth.uid())
      -- anonymous: sender_id must be null
      or (is_anonymous and sender_id is null)
    )
  );

create policy "kudos: owner or admin update/delete"
  on public.kudos for all
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- kudo_hashtags ---
alter table public.kudo_hashtags enable row level security;

create policy "kudo_hashtags: public read"
  on public.kudo_hashtags for select
  using (true);

create policy "kudo_hashtags: kudo owner write"
  on public.kudo_hashtags for all
  using (
    exists (
      select 1 from public.kudos
      where id = kudo_id and (sender_id = auth.uid() or sender_id is null)
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- kudo_images ---
alter table public.kudo_images enable row level security;

create policy "kudo_images: public read"
  on public.kudo_images for select
  using (true);

create policy "kudo_images: kudo owner write"
  on public.kudo_images for all
  using (
    exists (
      select 1 from public.kudos
      where id = kudo_id and (sender_id = auth.uid() or sender_id is null)
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- kudo_likes ---
alter table public.kudo_likes enable row level security;

create policy "kudo_likes: public read"
  on public.kudo_likes for select
  using (true);

create policy "kudo_likes: authenticated toggle"
  on public.kudo_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- --- badges ---
alter table public.badges enable row level security;

create policy "badges: public read"
  on public.badges for select
  using (true);

create policy "badges: admin write"
  on public.badges for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- user_secret_boxes ---
alter table public.user_secret_boxes enable row level security;

create policy "secret_boxes: owner read"
  on public.user_secret_boxes for select
  using (auth.uid() = user_id);

create policy "secret_boxes: owner update (open)"
  on public.user_secret_boxes for update
  using (auth.uid() = user_id);

create policy "secret_boxes: admin all"
  on public.user_secret_boxes for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- --- app_config ---
alter table public.app_config enable row level security;

create policy "app_config: public read"
  on public.app_config for select
  using (true);

create policy "app_config: admin write"
  on public.app_config for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
