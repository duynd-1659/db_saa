-- Recreate kudos_with_stats view to include the `title` column added in
-- migration 20260317000000_add_kudos_title.sql.
-- CREATE OR REPLACE VIEW cannot be used here because the column list changed
-- (title was added to kudos after the view was first created).

DROP VIEW IF EXISTS public.kudos_with_stats;

CREATE VIEW public.kudos_with_stats AS
SELECT
  k.*,
  coalesce(l.like_count, 0) AS like_count
FROM public.kudos k
LEFT JOIN (
  SELECT kudo_id, count(*) AS like_count
  FROM public.kudo_likes
  GROUP BY kudo_id
) l ON l.kudo_id = k.id;

COMMENT ON VIEW public.kudos_with_stats IS 'Kudos with aggregated like counts; use for leaderboard and highlight carousel';
