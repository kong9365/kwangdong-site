-- 출입/퇴실 시간 필드 추가
-- visit_requests 테이블에 checked_in_at, checked_out_at 컬럼 추가

-- 1. checked_in_at 컬럼 추가 (출입 시간)
ALTER TABLE visit_requests
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ DEFAULT NULL;

-- 2. checked_out_at 컬럼 추가 (퇴실 시간)
ALTER TABLE visit_requests
ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMPTZ DEFAULT NULL;

-- 3. 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_visit_requests_checked_in_at ON visit_requests(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_visit_requests_checked_out_at ON visit_requests(checked_out_at);

-- 4. 복합 인덱스 추가 (상태별 출입 현황 조회용)
CREATE INDEX IF NOT EXISTS idx_visit_requests_status_checkin ON visit_requests(status, checked_in_at);

-- 5. 코멘트 추가
COMMENT ON COLUMN visit_requests.checked_in_at IS '출입 시간 (QR 체크인)';
COMMENT ON COLUMN visit_requests.checked_out_at IS '퇴실 시간 (QR 체크아웃)';
