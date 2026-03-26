-- Sync avatar_url from auth.users to profiles on every login/session refresh.
-- Google OAuth avatar URLs rotate when the session token refreshes, so the
-- profiles table must be kept up-to-date beyond the initial sign-up insert.

create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set avatar_url = new.raw_user_meta_data ->> 'avatar_url'
  where id = new.id
    and (
      avatar_url is distinct from (new.raw_user_meta_data ->> 'avatar_url')
    );
  return new;
end;
$$;

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_updated();
