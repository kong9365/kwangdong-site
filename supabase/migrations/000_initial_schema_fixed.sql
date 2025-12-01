-- 광동제약 방문예약 시스템 데이터베이스 스키마 (수정 버전)
-- 이 파일은 Supabase SQL Editor에서 실행하세요

-- Enum 타입 생성 (이미 있으면 오류 무시)
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'user', 'visitor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE visit_status AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 역할 테이블
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'visitor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 방문 요청 테이블
CREATE TABLE IF NOT EXISTS visit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  department TEXT NOT NULL,
  purpose TEXT NOT NULL,
  visit_date DATE NOT NULL,
  end_date DATE,
  visitor_company TEXT,
  reservation_number TEXT UNIQUE,
  status visit_status NOT NULL DEFAULT 'REQUESTED',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 방문자 정보 테이블
CREATE TABLE IF NOT EXISTS visitor_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_request_id UUID NOT NULL REFERENCES visit_requests(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visitor_email TEXT,
  car_number TEXT,
  id_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 체크리스트 테이블
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_request_id UUID NOT NULL UNIQUE REFERENCES visit_requests(id) ON DELETE CASCADE,
  security_agreement BOOLEAN NOT NULL DEFAULT FALSE,
  safety_education BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
  document_upload BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ 테이블
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT '기타',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS 알림 로그 테이블
CREATE TABLE IF NOT EXISTS sms_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_request_id UUID REFERENCES visit_requests(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_requester_id ON visit_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_status ON visit_requests(status);
CREATE INDEX IF NOT EXISTS idx_visit_requests_visit_date ON visit_requests(visit_date);
CREATE INDEX IF NOT EXISTS idx_visit_requests_reservation_number ON visit_requests(reservation_number);
CREATE INDEX IF NOT EXISTS idx_visitor_info_visit_request_id ON visitor_info(visit_request_id);
CREATE INDEX IF NOT EXISTS idx_visitor_info_visitor_phone ON visitor_info(visitor_phone);
CREATE INDEX IF NOT EXISTS idx_checklists_visit_request_id ON checklists(visit_request_id);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_is_pinned ON notices(is_pinned DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order_index ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_sms_notifications_visit_request_id ON sms_notifications(visit_request_id);

-- 예약번호 생성을 위한 시퀀스
CREATE SEQUENCE IF NOT EXISTS reservation_number_seq START 1;

-- 예약번호 생성 함수
CREATE OR REPLACE FUNCTION generate_reservation_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  seq_num INTEGER;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  seq_num := nextval('reservation_number_seq');
  new_number := 'VR-' || year_part || '-' || LPAD(seq_num::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- 역할 확인 함수
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  -- NULL 체크
  IF _user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id::uuid = _user_id::uuid AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS (Row Level Security) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_notifications ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있으면)
DROP POLICY IF EXISTS "사용자는 자신의 프로필 읽기" ON profiles;
DROP POLICY IF EXISTS "사용자는 자신의 프로필 쓰기" ON profiles;
DROP POLICY IF EXISTS "관리자는 모든 역할 읽기" ON user_roles;
DROP POLICY IF EXISTS "관리자는 역할 쓰기" ON user_roles;
DROP POLICY IF EXISTS "사용자는 자신의 방문 요청 읽기" ON visit_requests;
DROP POLICY IF EXISTS "사용자는 방문 요청 생성" ON visit_requests;
DROP POLICY IF EXISTS "관리자는 방문 요청 수정" ON visit_requests;
DROP POLICY IF EXISTS "방문자 정보 읽기" ON visitor_info;
DROP POLICY IF EXISTS "방문자 정보 쓰기" ON visitor_info;
DROP POLICY IF EXISTS "체크리스트 읽기" ON checklists;
DROP POLICY IF EXISTS "체크리스트 쓰기" ON checklists;
DROP POLICY IF EXISTS "공지사항 공개 읽기" ON notices;
DROP POLICY IF EXISTS "관리자는 공지사항 쓰기" ON notices;
DROP POLICY IF EXISTS "FAQ 공개 읽기" ON faqs;
DROP POLICY IF EXISTS "관리자는 FAQ 쓰기" ON faqs;
DROP POLICY IF EXISTS "관리자는 SMS 알림 읽기" ON sms_notifications;
DROP POLICY IF EXISTS "관리자는 SMS 알림 쓰기" ON sms_notifications;

-- RLS 정책 설정

-- Profiles: 사용자는 자신의 프로필만 읽기/쓰기 가능
CREATE POLICY "사용자는 자신의 프로필 읽기" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid()::uuid = user_id::uuid);

CREATE POLICY "사용자는 자신의 프로필 쓰기" ON profiles
  FOR ALL USING (auth.uid() IS NOT NULL AND auth.uid()::uuid = user_id::uuid);

-- User Roles: 관리자만 읽기/쓰기 가능
CREATE POLICY "관리자는 모든 역할 읽기" ON user_roles
  FOR SELECT USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

CREATE POLICY "관리자는 역할 쓰기" ON user_roles
  FOR ALL USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

-- Visit Requests: 사용자는 자신의 요청만 읽기/쓰기 가능, 관리자는 모든 요청 읽기/쓰기 가능
CREATE POLICY "사용자는 자신의 방문 요청 읽기" ON visit_requests
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND auth.uid()::uuid = requester_id::uuid) 
    OR (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'))
  );

CREATE POLICY "사용자는 방문 요청 생성" ON visit_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::uuid = requester_id::uuid);

CREATE POLICY "관리자는 방문 요청 수정" ON visit_requests
  FOR UPDATE USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

-- Visitor Info: 방문 요청과 동일한 정책
CREATE POLICY "방문자 정보 읽기" ON visitor_info
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM visit_requests
      WHERE visit_requests.id = visitor_info.visit_request_id
      AND (
        visit_requests.requester_id::uuid = auth.uid()::uuid 
        OR has_role(auth.uid()::uuid, 'admin')
      )
    )
  );

CREATE POLICY "방문자 정보 쓰기" ON visitor_info
  FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM visit_requests
      WHERE visit_requests.id = visitor_info.visit_request_id
      AND (
        visit_requests.requester_id::uuid = auth.uid()::uuid 
        OR has_role(auth.uid()::uuid, 'admin')
      )
    )
  );

-- Checklists: 방문 요청과 동일한 정책
CREATE POLICY "체크리스트 읽기" ON checklists
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM visit_requests
      WHERE visit_requests.id = checklists.visit_request_id
      AND (
        visit_requests.requester_id::uuid = auth.uid()::uuid 
        OR has_role(auth.uid()::uuid, 'admin')
      )
    )
  );

CREATE POLICY "체크리스트 쓰기" ON checklists
  FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM visit_requests
      WHERE visit_requests.id = checklists.visit_request_id
      AND (
        visit_requests.requester_id::uuid = auth.uid()::uuid 
        OR has_role(auth.uid()::uuid, 'admin')
      )
    )
  );

-- Notices: 모든 사용자가 읽기 가능, 관리자만 쓰기 가능
CREATE POLICY "공지사항 공개 읽기" ON notices
  FOR SELECT USING (true);

CREATE POLICY "관리자는 공지사항 쓰기" ON notices
  FOR ALL USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

-- FAQs: 모든 사용자가 읽기 가능, 관리자만 쓰기 가능
CREATE POLICY "FAQ 공개 읽기" ON faqs
  FOR SELECT USING (true);

CREATE POLICY "관리자는 FAQ 쓰기" ON faqs
  FOR ALL USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

-- SMS Notifications: 관리자만 읽기 가능
CREATE POLICY "관리자는 SMS 알림 읽기" ON sms_notifications
  FOR SELECT USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

CREATE POLICY "관리자는 SMS 알림 쓰기" ON sms_notifications
  FOR ALL USING (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'));

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visit_requests_updated_at ON visit_requests;
CREATE TRIGGER update_visit_requests_updated_at BEFORE UPDATE ON visit_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visitor_info_updated_at ON visitor_info;
CREATE TRIGGER update_visitor_info_updated_at BEFORE UPDATE ON visitor_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_checklists_updated_at ON checklists;
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

