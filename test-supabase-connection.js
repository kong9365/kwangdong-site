/**
 * Supabase 연결 테스트 스크립트
 * 
 * 사용법: node test-supabase-connection.js
 * 
 * 이 스크립트는 다음을 확인합니다:
 * 1. 환경 변수 로드
 * 2. Supabase 클라이언트 초기화
 * 3. 데이터베이스 연결 테스트
 * 4. 주요 테이블 존재 여부 확인
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 수동 로드 (Vite 환경 변수 형식)
function loadEnv() {
  try {
    const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value.trim();
        }
      }
    });
  } catch (error) {
    console.warn('⚠️  .env 파일을 읽을 수 없습니다. 환경 변수를 수동으로 설정하세요.');
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('='.repeat(60));
console.log('Supabase 연결 테스트 시작');
console.log('='.repeat(60));
console.log('');

// 1. 환경 변수 확인
console.log('1. 환경 변수 확인');
console.log('-'.repeat(60));

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL이 설정되지 않았습니다.');
  console.error('   .env 파일에 VITE_SUPABASE_URL을 추가하세요.');
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_PUBLISHABLE_KEY가 설정되지 않았습니다.');
  console.error('   .env 파일에 VITE_SUPABASE_PUBLISHABLE_KEY를 추가하세요.');
  process.exit(1);
}

console.log('✅ SUPABASE_URL:', SUPABASE_URL);
console.log('✅ SUPABASE_KEY:', SUPABASE_KEY.substring(0, 20) + '...');
console.log('');

// 2. Supabase 클라이언트 초기화
console.log('2. Supabase 클라이언트 초기화');
console.log('-'.repeat(60));

let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabase 클라이언트가 성공적으로 생성되었습니다.');
} catch (error) {
  console.error('❌ Supabase 클라이언트 생성 실패:', error.message);
  process.exit(1);
}
console.log('');

// 3. 데이터베이스 연결 테스트
console.log('3. 데이터베이스 연결 테스트');
console.log('-'.repeat(60));

try {
  const { data, error } = await supabase.from('visit_requests').select('count').limit(1);
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.log('⚠️  visit_requests 테이블이 아직 생성되지 않았습니다.');
      console.log('   SQL Editor에서 스키마를 실행하세요.');
    } else {
      console.error('❌ 데이터베이스 연결 실패:', error.message);
      console.error('   코드:', error.code);
      process.exit(1);
    }
  } else {
    console.log('✅ 데이터베이스 연결 성공');
  }
} catch (error) {
  console.error('❌ 연결 테스트 중 오류 발생:', error.message);
  if (error.message?.includes('fetch failed') || error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
    console.log('');
    console.log('💡 "fetch failed" 오류 해결 방법:');
    console.log('   1. Supabase 프로젝트 일시중지 여부 확인');
    console.log('      → https://supabase.com/dashboard/project/' + (process.env.VITE_SUPABASE_PROJECT_ID || 'esrvexhyrpwwyjpjeuqi'));
    console.log('      → 왼쪽 Settings > General > "Restore project" 클릭');
    console.log('   2. 방화벽/백신 프로그램에서 supabase.co 차단 여부 확인');
    console.log('   3. VPN 사용 중이면 해제 후 재시도');
  }
  process.exit(1);
}
console.log('');

// 4. 주요 테이블 존재 여부 확인
console.log('4. 주요 테이블 존재 여부 확인');
console.log('-'.repeat(60));

const tables = [
  'visit_requests',
  'visitor_info',
  'checklists',
  'profiles',
  'user_roles',
  'notices',
  'faqs',
  'sms_notifications'
];

for (const table of tables) {
  try {
    const { error } = await supabase.from(table).select('count').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`⚠️  ${table}: 테이블이 존재하지 않습니다.`);
      } else {
        console.log(`❌ ${table}: 오류 - ${error.message}`);
      }
    } else {
      console.log(`✅ ${table}: 테이블이 존재합니다.`);
    }
  } catch (error) {
    console.log(`❌ ${table}: 확인 중 오류 - ${error.message}`);
  }
}
console.log('');

// 5. 요약
console.log('='.repeat(60));
console.log('테스트 완료');
console.log('='.repeat(60));
console.log('');
console.log('다음 단계:');
console.log('1. 모든 테이블이 존재하는지 확인하세요.');
console.log('2. 테이블이 없다면 SQL Editor에서 스키마를 실행하세요.');
console.log('3. npm run dev로 개발 서버를 시작하세요.');
console.log('');
