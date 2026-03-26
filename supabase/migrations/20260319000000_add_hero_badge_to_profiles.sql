-- Add hero_badge column to profiles
ALTER TABLE profiles
  ADD COLUMN hero_badge TEXT
  CHECK (hero_badge IN ('New Hero', 'Rising Hero', 'Super Hero', 'Legend Hero'));

-- Function: compute and store hero badge for a given recipient
CREATE OR REPLACE FUNCTION update_hero_badge()
RETURNS TRIGGER AS $$
DECLARE
  sender_count INT;
  new_badge    TEXT;
  target_id    UUID;
BEGIN
  target_id := COALESCE(NEW.recipient_id, OLD.recipient_id);

  SELECT COUNT(DISTINCT sender_id)
  INTO sender_count
  FROM kudos
  WHERE recipient_id = target_id AND sender_id IS NOT NULL;

  new_badge := CASE
    WHEN sender_count >= 20 THEN 'Legend Hero'
    WHEN sender_count >= 10 THEN 'Super Hero'
    WHEN sender_count >= 5  THEN 'Rising Hero'
    WHEN sender_count >= 1  THEN 'New Hero'
    ELSE NULL
  END;

  UPDATE profiles SET hero_badge = new_badge WHERE id = target_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires after any kudo is inserted or deleted
CREATE TRIGGER trg_update_hero_badge
AFTER INSERT OR DELETE ON kudos
FOR EACH ROW EXECUTE FUNCTION update_hero_badge();

-- Backfill: compute hero badge for all existing recipients
UPDATE profiles p
SET hero_badge = CASE
  WHEN sender_count >= 20 THEN 'Legend Hero'
  WHEN sender_count >= 10 THEN 'Super Hero'
  WHEN sender_count >= 5  THEN 'Rising Hero'
  WHEN sender_count >= 1  THEN 'New Hero'
  ELSE NULL
END
FROM (
  SELECT recipient_id, COUNT(DISTINCT sender_id) AS sender_count
  FROM kudos
  WHERE sender_id IS NOT NULL
  GROUP BY recipient_id
) AS stats
WHERE p.id = stats.recipient_id;
