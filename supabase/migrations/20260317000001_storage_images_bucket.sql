-- =============================================================================
-- Storage: create 'images' bucket and RLS policies
-- =============================================================================

-- Create the bucket (idempotent — safe to re-run)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Public read — anyone can view uploaded images
create policy "images: public read"
  on storage.objects for select
  using (bucket_id = 'images');

-- Authenticated upload — any signed-in user can upload under kudos/
create policy "images: authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

-- Owner delete — uploader can delete their own objects
create policy "images: owner delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images' and owner = auth.uid());
