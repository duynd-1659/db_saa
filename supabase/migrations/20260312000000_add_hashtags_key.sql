-- ---------------------------------------------------------------------------
-- Add `key` column (slug) to public.hashtags for human-readable URL params
-- e.g. ?hashtag=high-performance instead of ?hashtag=<uuid>
-- ---------------------------------------------------------------------------

-- 1. Add column as nullable first (existing rows need population)
alter table public.hashtags
  add column key text;

-- 2. Populate existing rows with slugified names
update public.hashtags set key = 'comprehensive'        where name = 'Toàn diện';
update public.hashtags set key = 'expertise'             where name = 'Giỏi chuyên môn';
update public.hashtags set key = 'high-performance'      where name = 'Hiệu suất cao';
update public.hashtags set key = 'inspiring'             where name = 'Truyền cảm hứng';
update public.hashtags set key = 'dedication'            where name = 'Cống hiến';
update public.hashtags set key = 'aim-high'              where name = 'Aim High';
update public.hashtags set key = 'be-agile'              where name = 'Be Agile';
update public.hashtags set key = 'wasshoi'               where name = 'Wasshoi';
update public.hashtags set key = 'goal-oriented'         where name = 'Hướng mục tiêu';
update public.hashtags set key = 'customer-focused'      where name = 'Hướng khách hàng';
update public.hashtags set key = 'process-excellence'    where name = 'Chuẩn quy trình';
update public.hashtags set key = 'creative-solutions'    where name = 'Giải pháp sáng tạo';
update public.hashtags set key = 'excellent-management'  where name = 'Quản lý xuất sắc';

-- 3. Now enforce NOT NULL and UNIQUE constraints
alter table public.hashtags
  alter column key set not null;

alter table public.hashtags
  add constraint hashtags_key_unique unique (key);

-- 4. Add index for fast lookup by key
create index idx_hashtags_key on public.hashtags (key);

-- 5. Add column comment
comment on column public.hashtags.key is 'URL-friendly slug (e.g. ''high-performance'') used in query params';
