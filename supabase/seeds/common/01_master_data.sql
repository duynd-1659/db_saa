-- =============================================================================
-- SAA 2025 — Common seed data (all environments)
-- Departments, hashtags, badges, and default app_config
-- =============================================================================

-- ---------------------------------------------------------------------------
-- departments  (from Figma: Dropdown Phòng ban)
-- ---------------------------------------------------------------------------
insert into public.departments (name) values
  ('BDV'),
  ('CEVC1'),
  ('CEVC2'),
  ('CEVC3'),
  ('CEVC4'),
  ('CEVEC'),
  ('CPV'),
  ('CTO'),
  ('FCOV'),
  ('GEU'),
  ('IAV'),
  ('OPDC'),
  ('PAO'),
  ('SPD'),
  ('STVC')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- hashtags  (from Figma: Dropdown list hashtag — A.1 description)
-- ---------------------------------------------------------------------------
insert into public.hashtags (name, key) values
  ('Toàn diện',           'comprehensive'),
  ('Giỏi chuyên môn',    'expertise'),
  ('Hiệu suất cao',      'high-performance'),
  ('Truyền cảm hứng',    'inspiring'),
  ('Cống hiến',           'dedication'),
  ('Aim High',            'aim-high'),
  ('Be Agile',            'be-agile'),
  ('Wasshoi',             'wasshoi'),
  ('Hướng mục tiêu',     'goal-oriented'),
  ('Hướng khách hàng',   'customer-focused'),
  ('Chuẩn quy trình',    'process-excellence'),
  ('Giải pháp sáng tạo', 'creative-solutions'),
  ('Quản lý xuất sắc',   'excellent-management')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- badges  (from Figma: Open Secret Box — Box image description)
-- Drop rates sum to 1.00 (100 %)
-- ---------------------------------------------------------------------------
insert into public.badges (name, description, drop_rate) values
  ('Stay Gold',           'Bền vững và kiên trì, luôn tỏa sáng',                           0.3000),
  ('Touch of Light',      'Mang lại ánh sáng và nguồn cảm hứng cho mọi người xung quanh', 0.2000),
  ('Flow to Horizon',     'Không ngừng vươn tới những chân trời mới',                      0.2500),
  ('Revival',             'Bứt phá và hồi sinh mạnh mẽ',                                   0.1000),
  ('Beyond the Boundary', 'Vượt qua mọi giới hạn bản thân',                               0.1000),
  ('Root Further',        'Bén rễ sâu, vươn xa hơn — hiếm nhất',                          0.0500)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- app_config  (initial values)
-- ---------------------------------------------------------------------------
insert into public.app_config (key, value, note) values
  (
    'event_start_datetime',
    '2025-12-01T18:30:00+07:00',
    'ISO-8601 datetime of the SAA 2025 ceremony. Used by countdown timer.'
  ),
  (
    'event_venue',
    'Nhà hát nghệ thuật quân đội',
    'Venue displayed on the homepage hero section.'
  ),
  (
    'event_time_display',
    '18h30',
    'Human-readable event start time displayed on hero.'
  ),
  (
    'kudos_enabled',
    'true',
    'Master switch. Set to false to disable new kudo submissions.'
  )
on conflict (key) do nothing;
