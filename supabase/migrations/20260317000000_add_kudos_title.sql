-- Add `title` column to kudos table
-- Reason: "Danh hiệu" field added in Figma design (node I520:11647;1688:10448)
--         The title is the headline of the Kudos card, required.

alter table public.kudos
  add column title text not null default '';

-- Remove default after backfilling (existing rows get empty string default)
alter table public.kudos
  alter column title drop default;

alter table public.kudos
  add constraint kudos_title_not_empty check (char_length(trim(title)) > 0);

comment on column public.kudos.title is 'Kudo headline — "Danh hiệu" entered by the sender, displayed as card title';
