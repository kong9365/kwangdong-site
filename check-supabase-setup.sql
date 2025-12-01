-- Supabase 설정 확인 쿼리
-- 이 쿼리를 SQL Editor에서 실행하여 모든 테이블과 설정을 확인하세요

-- 1. 모든 테이블 목록 확인
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Enum 타입 확인
SELECT 
  typname as enum_name,
  array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('app_role', 'visit_status')
GROUP BY typname;

-- 3. 함수 확인
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('generate_reservation_number', 'has_role', 'update_updated_at_column')
ORDER BY routine_name;

-- 4. RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. 인덱스 확인
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_roles', 'visit_requests', 'visitor_info', 'checklists', 'notices', 'faqs', 'sms_notifications')
ORDER BY tablename, indexname;

-- 6. 시퀀스 확인
SELECT 
  sequence_name
FROM information_schema.sequences
WHERE sequence_schema = 'public';

