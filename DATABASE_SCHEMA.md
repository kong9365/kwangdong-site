# 데이터베이스 스키마 상세 설명

이 문서는 광동제약 방문예약 시스템의 데이터베이스 구조를 상세하게 설명합니다.

## 목차

1. [전체 구조 개요](#전체-구조-개요)
2. [테이블 상세 설명](#테이블-상세-설명)
3. [관계도](#관계도)
4. [인덱스 및 성능 최적화](#인덱스-및-성능-최적화)
5. [RLS 정책 상세](#rls-정책-상세)
6. [함수 및 트리거](#함수-및-트리거)

---

## 전체 구조 개요

### 데이터베이스 계층 구조

```
Supabase 프로젝트 (esrvexhyrpwwyjpjeuqi)
│
├── auth 스키마 (Supabase 기본)
│   └── users (인증 사용자)
│
└── public 스키마 (애플리케이션 데이터)
    ├── profiles (사용자 프로필)
    ├── user_roles (사용자 역할)
    ├── visit_requests (방문 요청) ⭐ 핵심 테이블
    ├── visitor_info (방문자 정보)
    ├── checklists (체크리스트)
    ├── notices (공지사항)
    ├── faqs (FAQ)
    └── sms_notifications (SMS 알림)
```

### 데이터 흐름

```
1. 사용자 회원가입
   └─> auth.users 생성
       └─> profiles 자동 생성 (트리거)

2. 방문 예약 신청
   └─> visit_requests 생성
       ├─> visitor_info 생성 (방문자 정보)
       └─> checklists 생성 (체크리스트)

3. 관리자 승인
   └─> visit_requests.status = 'APPROVED'
       └─> sms_notifications 생성 (알림 전송)
```

---

## 테이블 상세 설명

### 1. profiles (사용자 프로필)

**목적**: Supabase 인증 사용자의 추가 정보를 저장합니다.

**스키마**:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  company TEXT,
  department TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: 프로필 고유 ID
- `user_id`: Supabase 인증 사용자 ID (외래키)
- `full_name`: 전체 이름
- `phone`: 전화번호
- `company`: 회사명
- `department`: 부서명

**제약 조건**:
- `user_id`는 고유값 (한 사용자당 하나의 프로필)
- `auth.users` 삭제 시 자동 삭제 (CASCADE)

**RLS 정책**:
- 사용자는 자신의 프로필만 읽기/쓰기 가능

**사용 예시**:
```sql
-- 프로필 조회
SELECT * FROM profiles WHERE user_id = auth.uid();

-- 프로필 업데이트
UPDATE profiles 
SET full_name = '홍길동', company = '광동제약'
WHERE user_id = auth.uid();
```

---

### 2. user_roles (사용자 역할)

**목적**: 사용자의 권한을 관리합니다.

**스키마**:
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL DEFAULT 'visitor',
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, role)
);
```

**주요 필드**:
- `id`: 역할 레코드 ID
- `user_id`: 사용자 ID
- `role`: 역할 (admin, user, visitor)

**Enum 타입 (app_role)**:
- `admin`: 관리자 (모든 권한)
- `user`: 일반 사용자
- `visitor`: 방문자 (기본값)

**제약 조건**:
- `(user_id, role)` 조합은 고유값 (한 사용자가 같은 역할을 중복 가질 수 없음)

**RLS 정책**:
- 관리자만 읽기/쓰기 가능

**사용 예시**:
```sql
-- 관리자 역할 부여
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');

-- 사용자 역할 확인
SELECT role FROM user_roles WHERE user_id = 'user-uuid-here';

-- 관리자 여부 확인 (함수 사용)
SELECT has_role('user-uuid-here', 'admin');
```

---

### 3. visit_requests (방문 요청) ⭐ 핵심 테이블

**목적**: 방문 예약의 핵심 정보를 저장합니다.

**스키마**:
```sql
CREATE TABLE visit_requests (
  id UUID PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id),
  company TEXT NOT NULL,
  department TEXT NOT NULL,
  purpose TEXT NOT NULL,
  visit_date DATE NOT NULL,
  end_date DATE,
  visitor_company TEXT,
  reservation_number TEXT UNIQUE,
  status visit_status DEFAULT 'REQUESTED',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: 방문 요청 고유 ID
- `requester_id`: 요청자 ID (외래키)
- `company`: 회사명
- `department`: 부서명
- `purpose`: 방문 목적
- `visit_date`: 방문 시작일
- `end_date`: 방문 종료일 (선택)
- `visitor_company`: 방문자 회사명
- `reservation_number`: 예약번호 (고유값, 자동 생성)
- `status`: 예약 상태
- `approved_by`: 승인자 ID
- `approved_at`: 승인 시간
- `rejection_reason`: 반려 사유

**Enum 타입 (visit_status)**:
- `REQUESTED`: 요청됨 (기본값)
- `APPROVED`: 승인됨
- `REJECTED`: 반려됨
- `IN_PROGRESS`: 진행 중
- `COMPLETED`: 완료됨
- `CANCELLED`: 취소됨

**인덱스**:
- `requester_id`: 요청자별 조회 최적화
- `status`: 상태별 조회 최적화
- `visit_date`: 날짜별 조회 최적화
- `reservation_number`: 예약번호 조회 최적화 (UNIQUE)

**RLS 정책**:
- 사용자는 자신이 생성한 요청만 읽기 가능
- 사용자는 자신의 요청을 생성할 수 있음
- 관리자는 모든 요청 읽기/수정 가능

**사용 예시**:
```sql
-- 방문 요청 생성
INSERT INTO visit_requests (
  requester_id, company, department, purpose, visit_date
) VALUES (
  auth.uid(), '광동제약', '영업부', '회의', '2025-01-15'
);

-- 예약번호로 조회
SELECT * FROM visit_requests 
WHERE reservation_number = 'VR-2025-000001';

-- 상태별 조회
SELECT * FROM visit_requests 
WHERE status = 'REQUESTED' 
ORDER BY created_at DESC;
```

---

### 4. visitor_info (방문자 정보)

**목적**: 실제 방문하는 사람들의 상세 정보를 저장합니다.

**스키마**:
```sql
CREATE TABLE visitor_info (
  id UUID PRIMARY KEY,
  visit_request_id UUID REFERENCES visit_requests(id),
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visitor_email TEXT,
  car_number TEXT,
  id_document_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: 방문자 정보 ID
- `visit_request_id`: 방문 요청 ID (외래키)
- `visitor_name`: 방문자 이름
- `visitor_phone`: 방문자 전화번호
- `visitor_email`: 방문자 이메일 (선택)
- `car_number`: 차량 번호 (선택)
- `id_document_url`: 신분증 문서 URL (선택)

**관계**:
- `visit_requests`와 다대일 관계 (한 예약에 여러 방문자 가능)

**인덱스**:
- `visit_request_id`: 방문 요청별 조회 최적화
- `visitor_phone`: 전화번호로 조회 최적화

**RLS 정책**:
- 방문 요청의 소유자만 접근 가능

**사용 예시**:
```sql
-- 방문자 정보 추가
INSERT INTO visitor_info (
  visit_request_id, visitor_name, visitor_phone
) VALUES (
  'visit-request-uuid', '홍길동', '010-1234-5678'
);

-- 방문 요청별 방문자 목록 조회
SELECT * FROM visitor_info 
WHERE visit_request_id = 'visit-request-uuid';
```

---

### 5. checklists (체크리스트)

**목적**: 방문 전 필수 체크리스트 항목을 관리합니다.

**스키마**:
```sql
CREATE TABLE checklists (
  id UUID PRIMARY KEY,
  visit_request_id UUID UNIQUE REFERENCES visit_requests(id),
  security_agreement BOOLEAN DEFAULT FALSE,
  safety_education BOOLEAN DEFAULT FALSE,
  privacy_consent BOOLEAN DEFAULT FALSE,
  document_upload BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: 체크리스트 ID
- `visit_request_id`: 방문 요청 ID (외래키, 고유값)
- `security_agreement`: 보안 동의 여부
- `safety_education`: 안전 교육 이수 여부
- `privacy_consent`: 개인정보 동의 여부
- `document_upload`: 문서 업로드 완료 여부
- `completed_at`: 완료 시간

**제약 조건**:
- `visit_request_id`는 고유값 (한 예약당 하나의 체크리스트)

**관계**:
- `visit_requests`와 일대일 관계

**RLS 정책**:
- 방문 요청의 소유자만 접근 가능

**사용 예시**:
```sql
-- 체크리스트 생성
INSERT INTO checklists (visit_request_id)
VALUES ('visit-request-uuid');

-- 체크리스트 업데이트
UPDATE checklists 
SET security_agreement = TRUE,
    privacy_consent = TRUE,
    completed_at = NOW()
WHERE visit_request_id = 'visit-request-uuid';

-- 완료 여부 확인
SELECT 
  security_agreement AND 
  safety_education AND 
  privacy_consent AND 
  document_upload AS is_completed
FROM checklists
WHERE visit_request_id = 'visit-request-uuid';
```

---

### 6. notices (공지사항)

**목적**: 공지사항을 관리합니다.

**스키마**:
```sql
CREATE TABLE notices (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: 공지사항 ID
- `title`: 제목
- `content`: 내용
- `author_id`: 작성자 ID
- `view_count`: 조회수
- `is_pinned`: 고정 여부

**인덱스**:
- `created_at DESC`: 최신순 조회 최적화
- `is_pinned DESC`: 고정 공지 우선 조회

**RLS 정책**:
- 모든 사용자가 읽기 가능
- 관리자만 쓰기 가능

**사용 예시**:
```sql
-- 공지사항 목록 조회 (고정 공지 우선)
SELECT * FROM notices
ORDER BY is_pinned DESC, created_at DESC
LIMIT 10;

-- 조회수 증가
UPDATE notices 
SET view_count = view_count + 1
WHERE id = 'notice-uuid';
```

---

### 7. faqs (FAQ)

**목적**: 자주 묻는 질문을 관리합니다.

**스키마**:
```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '기타',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: FAQ ID
- `category`: 카테고리
- `question`: 질문
- `answer`: 답변
- `order_index`: 정렬 순서

**인덱스**:
- `category`: 카테고리별 조회 최적화
- `order_index`: 정렬 순서 최적화

**RLS 정책**:
- 모든 사용자가 읽기 가능
- 관리자만 쓰기 가능

**사용 예시**:
```sql
-- 카테고리별 FAQ 조회
SELECT * FROM faqs
WHERE category = '예약'
ORDER BY order_index ASC;

-- 전체 FAQ 조회 (정렬 순서대로)
SELECT * FROM faqs
ORDER BY category, order_index;
```

---

### 8. sms_notifications (SMS 알림)

**목적**: SMS 전송 로그를 저장합니다.

**스키마**:
```sql
CREATE TABLE sms_notifications (
  id UUID PRIMARY KEY,
  visit_request_id UUID REFERENCES visit_requests(id),
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ
);
```

**주요 필드**:
- `id`: 알림 ID
- `visit_request_id`: 방문 요청 ID
- `phone_number`: 전화번호
- `message`: 메시지 내용
- `status`: 전송 상태 (PENDING, SENT, FAILED)
- `sent_at`: 전송 시간
- `error_message`: 오류 메시지

**인덱스**:
- `visit_request_id`: 방문 요청별 조회 최적화

**RLS 정책**:
- 관리자만 읽기/쓰기 가능

**사용 예시**:
```sql
-- SMS 알림 로그 조회
SELECT * FROM sms_notifications
WHERE visit_request_id = 'visit-request-uuid'
ORDER BY created_at DESC;

-- 실패한 알림 조회
SELECT * FROM sms_notifications
WHERE status = 'FAILED';
```

---

## 관계도

### ER 다이어그램 (텍스트 버전)

```
auth.users
    │
    ├──1:1── profiles
    │
    ├──1:N── user_roles
    │
    └──1:N── visit_requests
                │
                ├──1:N── visitor_info
                │
                ├──1:1── checklists
                │
                └──1:N── sms_notifications

notices (독립)
faqs (독립)
```

### 관계 설명

1. **auth.users → profiles**: 일대일
   - 한 사용자당 하나의 프로필

2. **auth.users → user_roles**: 일대다
   - 한 사용자가 여러 역할을 가질 수 있음 (예: admin + user)

3. **auth.users → visit_requests**: 일대다
   - 한 사용자가 여러 방문 요청을 생성할 수 있음

4. **visit_requests → visitor_info**: 일대다
   - 한 방문 요청에 여러 방문자가 포함될 수 있음

5. **visit_requests → checklists**: 일대일
   - 한 방문 요청당 하나의 체크리스트

6. **visit_requests → sms_notifications**: 일대다
   - 한 방문 요청에 여러 SMS 알림이 전송될 수 있음

---

## 인덱스 및 성능 최적화

### 인덱스 목록

```sql
-- 사용자 관련
idx_profiles_user_id ON profiles(user_id)
idx_user_roles_user_id ON user_roles(user_id)

-- 방문 요청 관련
idx_visit_requests_requester_id ON visit_requests(requester_id)
idx_visit_requests_status ON visit_requests(status)
idx_visit_requests_visit_date ON visit_requests(visit_date)
idx_visit_requests_reservation_number ON visit_requests(reservation_number) -- UNIQUE

-- 방문자 정보 관련
idx_visitor_info_visit_request_id ON visitor_info(visit_request_id)
idx_visitor_info_visitor_phone ON visitor_info(visitor_phone)

-- 체크리스트 관련
idx_checklists_visit_request_id ON checklists(visit_request_id)

-- 공지사항 관련
idx_notices_created_at ON notices(created_at DESC)
idx_notices_is_pinned ON notices(is_pinned DESC)

-- FAQ 관련
idx_faqs_category ON faqs(category)
idx_faqs_order_index ON faqs(order_index)

-- SMS 알림 관련
idx_sms_notifications_visit_request_id ON sms_notifications(visit_request_id)
```

### 성능 최적화 팁

1. **자주 조회하는 컬럼에 인덱스 생성**
   - `status`, `visit_date`, `reservation_number` 등

2. **복합 쿼리 최적화**
   ```sql
   -- 예: 상태와 날짜로 조회
   CREATE INDEX idx_visit_requests_status_date 
   ON visit_requests(status, visit_date);
   ```

3. **부분 인덱스 사용**
   ```sql
   -- 예: 승인된 요청만 인덱싱
   CREATE INDEX idx_visit_requests_approved 
   ON visit_requests(visit_date) 
   WHERE status = 'APPROVED';
   ```

---

## RLS 정책 상세

### 정책 목록

#### 1. profiles 정책
```sql
-- 읽기: 자신의 프로필만
CREATE POLICY "사용자는 자신의 프로필 읽기" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

-- 쓰기: 자신의 프로필만
CREATE POLICY "사용자는 자신의 프로필 쓰기" 
ON profiles FOR ALL 
USING (auth.uid() = user_id);
```

#### 2. visit_requests 정책
```sql
-- 읽기: 자신의 요청 또는 관리자
CREATE POLICY "사용자는 자신의 방문 요청 읽기" 
ON visit_requests FOR SELECT 
USING (
  auth.uid() = requester_id OR 
  has_role(auth.uid(), 'admin')
);

-- 생성: 자신의 요청만
CREATE POLICY "사용자는 방문 요청 생성" 
ON visit_requests FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

-- 수정: 관리자만
CREATE POLICY "관리자는 방문 요청 수정" 
ON visit_requests FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));
```

#### 3. notices 정책
```sql
-- 읽기: 모든 사용자
CREATE POLICY "공지사항 공개 읽기" 
ON notices FOR SELECT 
USING (true);

-- 쓰기: 관리자만
CREATE POLICY "관리자는 공지사항 쓰기" 
ON notices FOR ALL 
USING (has_role(auth.uid(), 'admin'));
```

### RLS 테스트 방법

```sql
-- 현재 사용자 확인
SELECT auth.uid();

-- 역할 확인
SELECT has_role(auth.uid(), 'admin');

-- 정책 테스트
-- (자신의 데이터만 보이는지 확인)
SELECT * FROM visit_requests;
```

---

## 함수 및 트리거

### 1. generate_reservation_number()

**목적**: 예약번호를 자동으로 생성합니다.

**형식**: `VR-YYYY-XXXXXX`
- `VR`: Visit Request 약자
- `YYYY`: 연도
- `XXXXXX`: 6자리 시퀀스 번호

**사용 예시**:
```sql
SELECT generate_reservation_number();
-- 결과: VR-2025-000001
```

**구현**:
```sql
CREATE FUNCTION generate_reservation_number()
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
```

### 2. has_role()

**목적**: 사용자가 특정 역할을 가지고 있는지 확인합니다.

**사용 예시**:
```sql
SELECT has_role('user-uuid', 'admin');
-- 결과: true 또는 false
```

**구현**:
```sql
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. update_updated_at_column()

**목적**: `updated_at` 컬럼을 자동으로 업데이트합니다.

**적용 테이블**:
- profiles
- visit_requests
- visitor_info
- checklists
- notices
- faqs

**동작**:
- 레코드가 업데이트될 때마다 `updated_at`이 현재 시간으로 자동 설정됩니다.

---

## 데이터베이스 관리 팁

### 1. 백업

```sql
-- 특정 테이블 백업
CREATE TABLE visit_requests_backup AS 
SELECT * FROM visit_requests;
```

### 2. 데이터 정리

```sql
-- 오래된 취소된 요청 삭제 (예: 1년 이상)
DELETE FROM visit_requests
WHERE status = 'CANCELLED'
AND created_at < NOW() - INTERVAL '1 year';
```

### 3. 통계 조회

```sql
-- 상태별 요청 수
SELECT status, COUNT(*) 
FROM visit_requests 
GROUP BY status;

-- 월별 요청 수
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS count
FROM visit_requests
GROUP BY month
ORDER BY month DESC;
```

---

**마지막 업데이트**: 2025년 1월

