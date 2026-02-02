-- 샘플 담당자 데이터 삽입
-- Supabase SQL Editor에서 실행하세요

-- 기존 샘플 데이터 삭제 (선택사항 - 주석 해제하여 사용)
-- DELETE FROM managers WHERE email LIKE '%@kwangdong.co.kr';

-- 샘플 담당자 데이터 삽입
INSERT INTO managers (name, department, company, phone, email, position, is_active, is_approver, approver_level)
VALUES
  -- 생산부서
  ('김철수', '생산1팀', '광동제약', '010-1234-5678', 'cskim@kwangdong.co.kr', '팀장', true, true, 'manager'),
  ('이영희', '생산2팀', '광동제약', '010-2345-6789', 'yhlee@kwangdong.co.kr', '과장', true, false, null),
  ('박민수', '생산관리팀', '광동제약', '010-3456-7890', 'mspark@kwangdong.co.kr', '부장', true, true, 'department_approver'),

  -- 품질부서
  ('정수진', '품질관리팀', '광동제약', '010-4567-8901', 'sjjung@kwangdong.co.kr', '팀장', true, true, 'manager'),
  ('최동현', '품질보증팀', '광동제약', '010-5678-9012', 'dhchoi@kwangdong.co.kr', '과장', true, false, null),

  -- 연구개발부서
  ('강지은', 'R&D센터', '광동제약', '010-6789-0123', 'jekang@kwangdong.co.kr', '선임연구원', true, false, null),
  ('윤성호', '연구기획팀', '광동제약', '010-7890-1234', 'shyoon@kwangdong.co.kr', '팀장', true, true, 'manager'),

  -- 경영지원부서
  ('임하나', '인사총무팀', '광동제약', '010-8901-2345', 'hnlim@kwangdong.co.kr', '대리', true, false, null),
  ('오재민', '재무회계팀', '광동제약', '010-9012-3456', 'jmoh@kwangdong.co.kr', '과장', true, false, null),
  ('신민정', '총무팀', '광동제약', '010-0123-4567', 'mjshin@kwangdong.co.kr', '팀장', true, true, 'manager'),

  -- 영업/마케팅부서
  ('한상철', '영업1팀', '광동제약', '010-1111-2222', 'schan@kwangdong.co.kr', '부장', true, true, 'department_approver'),
  ('서예진', '마케팅팀', '광동제약', '010-2222-3333', 'yjseo@kwangdong.co.kr', '대리', true, false, null),

  -- 물류/구매부서
  ('문경태', '물류팀', '광동제약', '010-3333-4444', 'ktmoon@kwangdong.co.kr', '팀장', true, true, 'manager'),
  ('배수현', '구매팀', '광동제약', '010-4444-5555', 'shbae@kwangdong.co.kr', '과장', true, false, null),

  -- 안전환경부서
  ('조현우', '안전환경팀', '광동제약', '010-5555-6666', 'hwjo@kwangdong.co.kr', '팀장', true, true, 'manager')
ON CONFLICT DO NOTHING;

-- 삽입된 데이터 확인
SELECT id, name, department, phone, position, is_approver, approver_level
FROM managers
WHERE is_active = true
ORDER BY department, name;
