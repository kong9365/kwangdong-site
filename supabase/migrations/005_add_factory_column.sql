-- 방문공장 필드 추가 (통계 기능 확장성 고려)
-- visit_requests 테이블에 factory 컬럼 추가

-- 1. factory 컬럼 추가
ALTER TABLE visit_requests
ADD COLUMN IF NOT EXISTS factory VARCHAR(50) DEFAULT NULL;

-- 2. factory 컬럼에 인덱스 추가 (통계 조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_visit_requests_factory ON visit_requests(factory);

-- 3. 복합 인덱스 추가 (공장별 + 부서별 + 담당자별 통계용)
CREATE INDEX IF NOT EXISTS idx_visit_requests_factory_department ON visit_requests(factory, department);
CREATE INDEX IF NOT EXISTS idx_visit_requests_factory_manager ON visit_requests(factory, manager_name);
CREATE INDEX IF NOT EXISTS idx_visit_requests_stats ON visit_requests(factory, department, manager_name, status, visit_date);

-- 4. 코멘트 추가
COMMENT ON COLUMN visit_requests.factory IS '방문공장 (GMP, FOOD 등) - 통계 분석용';
