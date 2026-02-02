-- sms_notifications: PENDING 상태 로그를 SENT/FAILED로 업데이트 허용
-- (공개 사용자도 문자 발송 결과를 DB에 기록할 수 있도록)
CREATE POLICY "SMS 알림 상태 업데이트" ON sms_notifications
  FOR UPDATE USING (status = 'PENDING')
  WITH CHECK (true);
