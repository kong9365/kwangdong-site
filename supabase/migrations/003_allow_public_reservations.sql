-- 공개 예약 폼 허용: 비로그인 사용자도 방문 예약·문자 로그 생성 가능하도록 RLS 수정
-- 1. requester_id nullable로 변경 (비로그인 시 null 허용)
ALTER TABLE visit_requests ALTER COLUMN requester_id DROP NOT NULL;
-- FK는 유지: NULL이면 auth.users 검사 생략

-- 2. 기존 INSERT 정책은 로그인 사용자용으로 유지, 공개 INSERT 정책 추가
CREATE POLICY "공개 방문 요청 생성" ON visit_requests
  FOR INSERT WITH CHECK (true);

-- 3. visitor_info: 방문 요청 생성 직후 삽입 허용 (공개 폼용)
CREATE POLICY "공개 방문자 정보 생성" ON visitor_info
  FOR INSERT WITH CHECK (true);

-- 4. checklists: 방문 요청 생성 직후 삽입 허용 (공개 폼용)
CREATE POLICY "공개 체크리스트 생성" ON checklists
  FOR INSERT WITH CHECK (true);

-- 5. sms_notifications: 문자 발송 시 로그 삽입 허용 (공개/관리자 모두)
CREATE POLICY "SMS 알림 로그 생성" ON sms_notifications
  FOR INSERT WITH CHECK (true);

-- 5b. visitor_info, checklists: 공개 예약(requester_id null)의 경우 조회 허용
CREATE POLICY "공개 예약 방문자 정보 조회" ON visitor_info
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM visit_requests vr
      WHERE vr.id = visitor_info.visit_request_id AND vr.requester_id IS NULL
    )
  );

CREATE POLICY "공개 예약 체크리스트 조회" ON checklists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM visit_requests vr
      WHERE vr.id = checklists.visit_request_id AND vr.requester_id IS NULL
    )
  );

-- 6. visit_requests SELECT: 기존 정책이 requester_id=null을 처리 못함. 정책 추가
-- ProgressView에서 예약번호+이름+전화번호로 조회 가능하도록
-- (공개 예약, 본인 예약, 관리자 모두 조회 가능)
CREATE POLICY "공개 예약 또는 본인 예약 조회" ON visit_requests
  FOR SELECT USING (
    requester_id IS NULL
    OR (auth.uid() IS NOT NULL AND auth.uid()::uuid = requester_id::uuid)
    OR (auth.uid() IS NOT NULL AND has_role(auth.uid()::uuid, 'admin'))
  );
