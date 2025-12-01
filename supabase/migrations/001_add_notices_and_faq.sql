-- 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ 테이블 생성
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT '기타',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예약번호 생성을 위한 시퀀스 (옵션)
CREATE SEQUENCE IF NOT EXISTS reservation_number_seq START 1;

-- visit_requests 테이블에 예약번호 필드 추가 (이미 있으면 스킵)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visit_requests' AND column_name = 'reservation_number'
  ) THEN
    ALTER TABLE visit_requests ADD COLUMN reservation_number TEXT;
  END IF;
END $$;

-- visit_requests 테이블에 종료일 필드 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visit_requests' AND column_name = 'end_date'
  ) THEN
    ALTER TABLE visit_requests ADD COLUMN end_date DATE;
  END IF;
END $$;

-- visit_requests 테이블에 방문자 회사명 필드 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visit_requests' AND column_name = 'visitor_company'
  ) THEN
    ALTER TABLE visit_requests ADD COLUMN visitor_company TEXT;
  END IF;
END $$;

-- 문자 알림 로그 테이블 생성
CREATE TABLE IF NOT EXISTS sms_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_request_id UUID REFERENCES visit_requests(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, SENT, FAILED
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_is_pinned ON notices(is_pinned DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order_index ON faqs(order_index);
CREATE INDEX IF NOT EXISTS idx_visit_requests_reservation_number ON visit_requests(reservation_number);
CREATE INDEX IF NOT EXISTS idx_sms_notifications_visit_request_id ON sms_notifications(visit_request_id);

-- RLS 정책 설정 (공개 읽기, 관리자만 쓰기)
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_notifications ENABLE ROW LEVEL SECURITY;

-- 공지사항: 모든 사용자가 읽기 가능
CREATE POLICY "공지사항 공개 읽기" ON notices FOR SELECT USING (true);

-- FAQ: 모든 사용자가 읽기 가능
CREATE POLICY "FAQ 공개 읽기" ON faqs FOR SELECT USING (true);

-- 문자 알림: 관리자만 읽기 가능 (필요시 수정)
CREATE POLICY "문자 알림 관리자 읽기" ON sms_notifications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

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

