-- =============================================================================
-- Dev seed: 500 mock Vietnamese users (họ + tên đệm + tên, tối thiểu 3 từ)
-- =============================================================================

DO $$
DECLARE
  ho      text[] := ARRAY[
    'Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Phan','Vũ',
    'Võ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương','Lý',
    'Đinh','Trịnh','Cao','Lưu'
  ];
  dem     text[] := ARRAY[
    'Văn','Thị','Đình','Hữu','Ngọc','Minh','Quang','Thành',
    'Bảo','Kim','Thanh','Xuân','Thu','Đức','Anh','Phúc',
    'Gia','Tuấn','Hoàng','Trọng','Công','Thế','Nhật','Như'
  ];
  ten     text[] := ARRAY[
    'An','Anh','Bảo','Bình','Chi','Cường','Dung','Dũng',
    'Đạt','Đức','Giang','Hà','Hải','Hân','Hiếu','Hoa',
    'Hồng','Hùng','Huệ','Hương','Khánh','Khoa','Kiên','Lan',
    'Linh','Loan','Long','Luân','Mai','Minh','Nam','Ngọc',
    'Nghĩa','Nhân','Nhung','Phong','Phúc','Phương','Quân','Quang',
    'Sơn','Tâm','Thảo','Thành','Thiện','Thu','Thủy','Tiến',
    'Toàn','Trang','Trinh','Trung','Tú','Tuấn','Tùng','Uyên',
    'Việt','Vũ','Xuân','Yến'
  ];

  total_ho  int := 20;
  total_dem int := 24;
  total_ten int := 60;

  dept_ids   uuid[];
  v_id       uuid;
  v_email    text;
  v_name     text;
  v_dept_idx int;
  i          int;
BEGIN
  SELECT array_agg(id ORDER BY name) INTO dept_ids FROM public.departments;

  FOR i IN 1..500 LOOP
    -- Cycle through ho → dem → ten deterministically
    v_name := ho[((i-1) % total_ho) + 1]
           || ' ' || dem[(((i-1) / total_ho) % total_dem) + 1]
           || ' ' || ten[(((i-1) / (total_ho * total_dem)) % total_ten) + 1];

    v_email    := 'user' || lpad(i::text, 4, '0') || '@sunasterisk.com';
    v_id       := gen_random_uuid();
    v_dept_idx := ((i-1) % array_length(dept_ids, 1)) + 1;

    INSERT INTO auth.users (
      id, aud, role,
      email, encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at, updated_at
    ) VALUES (
      v_id, 'authenticated', 'authenticated',
      v_email, NULL,
      now(),
      jsonb_build_object('full_name', v_name),
      now() - (random() * interval '365 days'),
      now()
    );

    UPDATE public.profiles
    SET    department_id = dept_ids[v_dept_idx]
    WHERE  id = v_id;
  END LOOP;
END $$;
