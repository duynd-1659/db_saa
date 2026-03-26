-- =============================================================================
-- Dev seed: 1000 mock kudos
-- Guarantee: every user sends ≥1 and receives ≥1 kudo
-- Phase 1 (N kudos): circular send — user[i] → user[i+1] covers all
-- Phase 2 (1000-N kudos): random pairs
-- =============================================================================

-- Helper function (dropped at the end)
CREATE OR REPLACE FUNCTION _seed_insert_kudo(p_sender uuid, p_recip uuid, p_days_ago float, p_force_non_anon boolean DEFAULT false)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  v_kudo_id      uuid    := gen_random_uuid();
  v_is_anon      boolean := CASE WHEN p_force_non_anon THEN false ELSE (random() < 0.15) END;
  v_like_count   int     := floor(random() * 31)::int;
  v_liker_id     uuid;
  hashtag_ids    uuid[];
  total_hashtags int;
  k              int;
  titles         text[]  := ARRAY[
    'Ngôi sao nhóm','Người truyền cảm hứng','Chiến binh không ngại khó',
    'Đồng đội xuất sắc','Người hùng thầm lặng','Cống hiến hết mình',
    'Tinh thần Wasshoi','Sức mạnh tập thể','Luôn vượt kỳ vọng',
    'Trái tim nhiệt huyết','Chuyên gia đáng tin','Ánh sáng của team',
    'Người giải quyết vấn đề','Đồng nghiệp tuyệt vời','Tinh thần Root Further',
    'Bứt phá mọi giới hạn','Hết lòng vì khách hàng','Luôn hỗ trợ đồng đội',
    'Kiên định và bản lĩnh','Sáng tạo không ngừng'
  ];
  contents       text[]  := ARRAY[
    'Cảm ơn bạn đã luôn hỗ trợ và đồng hành cùng team trong những lúc khó khăn nhất.',
    'Bạn đã làm rất tốt trong sprint vừa qua! Cách bạn xử lý những issue phức tạp thật sự ấn tượng.',
    'Cảm ơn bạn đã dành thời gian review code kỹ càng và chia sẻ kiến thức quý báu.',
    'Bạn luôn là người đầu tiên giơ tay nhận task khó và luôn hoàn thành với chất lượng cao.',
    'Trong buổi demo hôm qua, bạn đã thể hiện rất chuyên nghiệp và tự tin. Tuyệt vời!',
    'Cảm ơn bạn đã ở lại muộn để giúp mình fix bug trước deadline.',
    'Bạn đã chủ động cải thiện quy trình deploy và giúp team tiết kiệm rất nhiều thời gian.',
    'Tinh thần học hỏi và cầu tiến của bạn luôn là tấm gương sáng cho cả team.',
    'Cảm ơn bạn đã kiên nhẫn giải thích và hướng dẫn cho thành viên mới.',
    'Bạn đã đề xuất một giải pháp sáng tạo giúp giảm thiểu thời gian xử lý từ 5 phút xuống còn 30 giây.',
    'Cảm ơn bạn vì luôn duy trì tinh thần tích cực và lan tỏa năng lượng tốt đến cả team.',
    'Bạn đã handle rất tốt tình huống khủng hoảng lúc production bị down.',
    'Góc nhìn UX của bạn đã giúp team cải thiện đáng kể trải nghiệm người dùng.',
    'Bạn đã viết documentation rất chi tiết và dễ hiểu.',
    'Kết quả QA của bạn sprint này thật xuất sắc — zero critical bug sau khi release.',
    'Cảm ơn bạn đã nhận task gấp vào cuối tuần mà không một lời phàn nàn.',
    'Những buổi knowledge sharing của bạn luôn rất chất lượng và thực tế.',
    'Bạn đã kết nối và phối hợp rất tốt với team bên client.',
    'Cảm ơn bạn đã luôn review PR nhanh chóng và chi tiết.',
    'Bạn đã hoàn thành tính năng phức tạp này trong thời gian kỷ lục mà vẫn đảm bảo chất lượng.',
    'Tinh thần Be Agile của bạn thật sự truyền cảm hứng cho cả team.',
    'Cảm ơn bạn đã đứng ra nhận trách nhiệm và dẫn dắt team qua giai đoạn khó khăn.',
    'Sự tỉ mỉ và cẩn thận trong từng dòng code của bạn là điều mà cả team đều học hỏi.',
    'Bạn đã tự mình tìm hiểu công nghệ mới và chia sẻ lại cho team.',
    'Cảm ơn bạn đã luôn có mặt kịp thời khi team cần hỗ trợ kỹ thuật.'
  ];
BEGIN
  SELECT array_agg(id) INTO hashtag_ids FROM public.hashtags;
  total_hashtags := array_length(hashtag_ids, 1);

  INSERT INTO public.kudos (
    id, sender_id, recipient_id,
    title, content,
    is_anonymous, anonymous_name,
    created_at, updated_at
  ) VALUES (
    v_kudo_id,
    CASE WHEN v_is_anon THEN NULL ELSE p_sender END,
    p_recip,
    titles[(floor(random() * array_length(titles, 1)) + 1)::int],
    contents[(floor(random() * array_length(contents, 1)) + 1)::int],
    v_is_anon,
    CASE WHEN v_is_anon THEN 'Ẩn danh' ELSE NULL END,
    now() - (p_days_ago * interval '1 day'),
    now()
  );

  -- 1–2 hashtags
  INSERT INTO public.kudo_hashtags (kudo_id, hashtag_id)
  VALUES (v_kudo_id, hashtag_ids[(floor(random() * total_hashtags) + 1)::int])
  ON CONFLICT DO NOTHING;

  IF random() < 0.6 THEN
    INSERT INTO public.kudo_hashtags (kudo_id, hashtag_id)
    VALUES (v_kudo_id, hashtag_ids[(floor(random() * total_hashtags) + 1)::int])
    ON CONFLICT DO NOTHING;
  END IF;

  -- 0–30 likes
  FOR k IN 1..v_like_count LOOP
    SELECT id INTO v_liker_id FROM public.profiles ORDER BY random() LIMIT 1;
    INSERT INTO public.kudo_likes (kudo_id, user_id, created_at)
    VALUES (v_kudo_id, v_liker_id, now() - (random() * interval '60 days'))
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;

DO $$
DECLARE
  profile_ids    uuid[];
  total_profiles int;
  v_sender_id    uuid;
  v_recip_id     uuid;
  i              int;
BEGIN
  SELECT array_agg(id ORDER BY created_at) INTO profile_ids FROM public.profiles;
  total_profiles := array_length(profile_ids, 1);

  -- Phase 1: circular — user[i] → user[i+1 mod N], guarantees every user sends & receives ≥1
  FOR i IN 1..total_profiles LOOP
    PERFORM _seed_insert_kudo(
      profile_ids[i],
      profile_ids[(i % total_profiles) + 1],
      random() * 60,
      true  -- force non-anonymous to guarantee sender coverage
    );
  END LOOP;

  -- Phase 2: random kudos to reach 1000 total
  FOR i IN 1..(1000 - total_profiles) LOOP
    v_sender_id := profile_ids[(floor(random() * total_profiles) + 1)::int];
    LOOP
      v_recip_id := profile_ids[(floor(random() * total_profiles) + 1)::int];
      EXIT WHEN v_recip_id <> v_sender_id;
    END LOOP;
    PERFORM _seed_insert_kudo(v_sender_id, v_recip_id, random() * 60);
  END LOOP;
END $$;

DROP FUNCTION _seed_insert_kudo;
