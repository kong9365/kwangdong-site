-- 담당자(managers) 테이블 및 임직원 권한(employee_permissions) 테이블 생성
-- 이 파일은 Supabase SQL Editor에서 실행하세요

-- 1. managers 테이블 생성 (담당자 정보)
CREATE TABLE IF NOT EXISTS managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 인증 사용자와 연결 (선택)
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '광동제약',
  phone TEXT NOT NULL,
  email TEXT,
  position TEXT, -- 직급/직책
  is_active BOOLEAN DEFAULT true,
  is_approver BOOLEAN DEFAULT false, -- 승인자 여부
  approver_level TEXT, -- 'manager' | 'department_approver' | null
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. employee_permissions 테이블 생성 (임직원모드 접근 권한)
CREATE TABLE IF NOT EXISTS employee_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  manager_id UUID REFERENCES managers(id) ON DELETE SET NULL, -- managers와 연결 (선택)
  can_approve BOOLEAN DEFAULT false, -- 예약승인 권한
  can_checkin BOOLEAN DEFAULT false, -- 방문수속 권한
  can_admin BOOLEAN DEFAULT false, -- 관리자 권한
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_managers_user_id ON managers(user_id);
CREATE INDEX IF NOT EXISTS idx_managers_is_active ON managers(is_active);
CREATE INDEX IF NOT EXISTS idx_managers_department ON managers(department);
CREATE INDEX IF NOT EXISTS idx_managers_is_approver ON managers(is_approver);
CREATE INDEX IF NOT EXISTS idx_employee_permissions_user_id ON employee_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_employee_permissions_manager_id ON employee_permissions(manager_id);

-- updated_at 자동 업데이트 트리거 함수 (이미 있으면 무시)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_managers_updated_at ON managers;
CREATE TRIGGER update_managers_updated_at
  BEFORE UPDATE ON managers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employee_permissions_updated_at ON employee_permissions;
CREATE TRIGGER update_employee_permissions_updated_at
  BEFORE UPDATE ON employee_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 정책 설정
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_permissions ENABLE ROW LEVEL SECURITY;

-- managers 테이블 정책
-- 읽기: 활성화된 담당자는 모든 사용자가 조회 가능 (예약 페이지에서 검색용)
CREATE POLICY "모든 사용자는 활성 담당자 조회 가능"
ON managers FOR SELECT
USING (is_active = true);

-- 쓰기: 관리자만 가능
CREATE POLICY "관리자는 담당자 정보 관리 가능"
ON managers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- employee_permissions 테이블 정책
-- 읽기: 자신의 권한 또는 관리자
CREATE POLICY "사용자는 자신의 권한 조회 가능"
ON employee_permissions FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 쓰기: 관리자만 가능
CREATE POLICY "관리자는 권한 관리 가능"
ON employee_permissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 코멘트 추가
COMMENT ON TABLE managers IS '담당자 정보 및 승인자 정보를 저장하는 테이블';
COMMENT ON TABLE employee_permissions IS '임직원모드 접근 권한을 관리하는 테이블';
COMMENT ON COLUMN managers.is_approver IS '승인자 여부';
COMMENT ON COLUMN managers.approver_level IS '승인 레벨: manager(담당자 승인), department_approver(부서 승인자), null(일반 담당자)';
COMMENT ON COLUMN employee_permissions.can_approve IS '예약승인 탭 접근 권한';
COMMENT ON COLUMN employee_permissions.can_checkin IS '방문수속 탭 접근 권한';
COMMENT ON COLUMN employee_permissions.can_admin IS '관리자 탭 접근 권한';

