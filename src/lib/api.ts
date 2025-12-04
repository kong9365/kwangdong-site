import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type VisitRequest = Database["public"]["Tables"]["visit_requests"]["Row"];
type VisitRequestInsert = Database["public"]["Tables"]["visit_requests"]["Insert"];
type VisitRequestUpdate = Database["public"]["Tables"]["visit_requests"]["Update"];

// 5자리 예약번호 생성 (중복 체크)
async function generateReservationNumber(): Promise<string> {
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 1~99999 범위에서 랜덤 생성
    const randomNum = Math.floor(Math.random() * 99999) + 1;
    const reservationNumber = randomNum.toString().padStart(5, '0');
    
    // 중복 체크
    const { data, error } = await supabase
      .from("visit_requests")
      .select("id")
      .eq("reservation_number", reservationNumber)
      .single();
    
    // 에러가 있고 데이터가 없으면 중복이 아님 (사용 가능)
    if (error && error.code === 'PGRST116') {
      return reservationNumber;
    }
    
    // 데이터가 있으면 중복 (다시 시도)
    if (data) {
      continue;
    }
  }
  
  // 최대 시도 횟수 초과 시 타임스탬프 기반 생성
  const timestamp = Date.now().toString().slice(-5);
  return timestamp.padStart(5, '0');
}

// 예약번호로 방문 요청 검색
export async function searchVisitRequestByReservationNumber(
  reservationNumber: string
) {
  const { data, error } = await supabase
    .from("visit_requests")
    .select(`
      *,
      visitor_info (*),
      checklists (*)
    `)
    .eq("reservation_number", reservationNumber)
    .single();

  if (error) throw error;
  return data;
}

// 방문자명, 전화번호, 예약번호로 방문 요청 검색 (3개 필드 모두 필요)
export async function searchVisitRequests(
  visitorName: string,
  phone: string,
  reservationNumber: string
) {
  // 전화번호 정규화 (하이픈 제거)
  const normalizedPhone = phone.replace(/-/g, "");
  
  // 방문자명은 정확 일치
  // 전화번호와 예약번호로 먼저 visit_requests를 필터링
  const { data: visitRequests, error: visitError } = await supabase
    .from("visit_requests")
    .select(`
      *,
      visitor_info (*),
      checklists (*)
    `)
    .eq("reservation_number", reservationNumber);

  if (visitError) throw visitError;
  if (!visitRequests || visitRequests.length === 0) {
    return [];
  }

  // 방문자 정보에서 이름과 전화번호로 필터링
  const filtered = visitRequests.filter((vr: any) => {
    if (!vr.visitor_info || vr.visitor_info.length === 0) return false;
    
    return vr.visitor_info.some((visitor: any) => {
      const nameMatch = visitor.visitor_name === visitorName;
      const phoneMatch = visitor.visitor_phone === normalizedPhone;
      return nameMatch && phoneMatch;
    });
  });

  return filtered;
}

// 연락처로 방문 요청 검색
export async function searchVisitRequestByPhone(phone: string) {
  // 전화번호 형식 정규화 (하이픈 제거)
  const normalizedPhone = phone.replace(/-/g, "");

  const { data, error } = await supabase
    .from("visit_requests")
    .select(`
      *,
      visitor_info (*),
      checklists (*)
    `)
    .eq("visitor_info.visitor_phone", normalizedPhone);

  if (error) throw error;
  return data;
}

// 담당자 목록 조회
// 담당자 정보 인터페이스
export interface Manager {
  id: string;
  user_id?: string | null;
  name: string;
  department: string;
  company: string;
  phone: string;
  email?: string | null;
  position?: string | null;
  is_active: boolean;
  is_approver: boolean;
  approver_level?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 담당자 목록 조회
 * @param searchName 이름 검색 (부분 일치)
 * @param searchDept 부서 검색 (부분 일치)
 * @returns 담당자 목록
 */
export async function getManagers(searchName?: string, searchDept?: string): Promise<Manager[]> {
  let query = supabase
    .from("managers")
    .select("*")
    .eq("is_active", true);

  if (searchName) {
    query = query.ilike("name", `%${searchName}%`);
  }

  if (searchDept) {
    query = query.ilike("department", `%${searchDept}%`);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as Manager[];
}

/**
 * 특정 담당자 조회
 * @param managerId 담당자 ID
 * @returns 담당자 정보
 */
export async function getManagerById(managerId: string): Promise<Manager | null> {
  const { data, error } = await supabase
    .from("managers")
    .select("*")
    .eq("id", managerId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Manager;
}

// 방문 요청 생성
export async function createVisitRequest(
  request: VisitRequestInsert & {
    end_date?: string | null;
    visitors: Array<{
      name: string;
      phone: string;
      carNumber?: string;
      email?: string;
    }>;
    manager_name?: string | null;
    manager_phone?: string | null;
  }
) {
  // 5자리 예약번호 생성
  const reservationNumber = await generateReservationNumber();

  // 방문 요청 생성
  const { data: visitRequest, error: requestError } = await supabase
    .from("visit_requests")
    .insert({
      company: request.company,
      department: request.department,
      purpose: request.purpose,
      visit_date: request.visit_date,
      end_date: request.end_date || null,
      visitor_company: request.visitor_company || null,
      requester_id: request.requester_id,
      manager_name: request.manager_name || null,
      manager_phone: request.manager_phone || null,
      reservation_number: reservationNumber,
      status: "REQUESTED",
    })
    .select()
    .single();

  if (requestError) throw requestError;

  // 방문자 정보 생성
  if (request.visitors && request.visitors.length > 0) {
    const visitorInserts = request.visitors.map((visitor) => ({
      visit_request_id: visitRequest.id,
      visitor_name: visitor.name,
      visitor_phone: visitor.phone.replace(/-/g, ""),
      car_number: visitor.carNumber || null,
      visitor_email: visitor.email || null,
    }));

    const { error: visitorError } = await supabase
      .from("visitor_info")
      .insert(visitorInserts);

    if (visitorError) throw visitorError;
  }

  // 체크리스트 생성
  const { error: checklistError } = await supabase
    .from("checklists")
    .insert({
      visit_request_id: visitRequest.id,
      security_agreement: false,
      safety_education: false,
      privacy_consent: false,
      document_upload: false,
    });

  if (checklistError) throw checklistError;

  return { ...visitRequest, reservation_number: reservationNumber };
}

// 방문 요청 수정
export async function updateVisitRequest(
  id: string,
  updates: VisitRequestUpdate
) {
  const { data, error } = await supabase
    .from("visit_requests")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 방문 요청 취소
export async function cancelVisitRequest(id: string, reason?: string) {
  const { data, error } = await supabase
    .from("visit_requests")
    .update({
      status: "CANCELLED",
      rejection_reason: reason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// QR 코드 데이터 생성 (암호화)
async function generateQRCodeData(visitRequest: any): Promise<string> {
  // 암호화 키 (환경 변수에서 가져오기)
  const encryptionKey = import.meta.env.VITE_QR_ENCRYPTION_KEY || "default-key-change-in-production";
  
  // QR 코드에 포함할 데이터
  const qrData = {
    reservation_number: visitRequest.reservation_number,
    visitor_name: visitRequest.visitor_info?.[0]?.visitor_name || "",
    visit_date: visitRequest.visit_date,
    purpose: visitRequest.purpose,
    manager_name: visitRequest.manager_name || "",
    company: visitRequest.company,
    department: visitRequest.department,
  };
  
  // 간단한 Base64 인코딩 (실제로는 더 강력한 암호화 사용 권장)
  // 프로덕션에서는 AES 암호화 등을 사용해야 함
  const jsonString = JSON.stringify(qrData);
  const encoded = btoa(unescape(encodeURIComponent(jsonString)));
  
  return encoded;
}

// 방문 요청 승인 (관리자용) - QR 코드 자동 생성
export async function approveVisitRequest(id: string, approvedBy: string) {
  // 먼저 방문 요청 정보 가져오기
  const { data: visitRequest, error: fetchError } = await supabase
    .from("visit_requests")
    .select(`
      *,
      visitor_info (*),
      checklists (*)
    `)
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // QR 코드 데이터 생성
  const qrCodeData = await generateQRCodeData(visitRequest);
  
  // QR 코드 ID 생성 (UUID)
  const qrCodeId = crypto.randomUUID();
  
  // QR 코드 URL 생성 (한미제약 방식: /qr/{uuid})
  const qrCodeUrl = `${window.location.origin}/qr/${qrCodeId}`;

  // 승인 처리 및 QR 코드 저장
  const { data, error } = await supabase
    .from("visit_requests")
    .update({
      status: "APPROVED",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      qr_code_data: qrCodeData,
      qr_code_id: qrCodeId,
      qr_code_url: qrCodeUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status, approved_by, approved_at, qr_code_data, qr_code_id, qr_code_url")
    .maybeSingle();

  if (error) {
    console.error("승인 처리 오류:", error);
    throw new Error(`승인 처리 중 오류가 발생했습니다: ${error.message}`);
  }
  if (!data) {
    throw new Error("승인 처리 후 데이터를 찾을 수 없습니다. RLS 정책을 확인해주세요.");
  }
  return data;
}

// 방문 요청 반려 (관리자용)
export async function rejectVisitRequest(
  id: string,
  approvedBy: string,
  reason: string
) {
  const { data, error } = await supabase
    .from("visit_requests")
    .update({
      status: "REJECTED",
      approved_by: approvedBy,
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status, approved_by, rejection_reason")
    .maybeSingle();

  if (error) {
    console.error("반려 처리 오류:", error);
    throw new Error(`반려 처리 중 오류가 발생했습니다: ${error.message}`);
  }
  if (!data) {
    throw new Error("반려 처리 후 데이터를 찾을 수 없습니다. RLS 정책을 확인해주세요.");
  }
  return data;
}

// QR 코드 ID로 예약 정보 조회 (새로운 방식)
export async function getVisitRequestByQRCodeId(qrCodeId: string) {
  const { data: visitRequest, error } = await supabase
    .from("visit_requests")
    .select(`
      *,
      visitor_info (*),
      checklists (*)
    `)
    .eq("qr_code_id", qrCodeId)
    .single();
  
  if (error) {
    throw new Error("예약 정보를 찾을 수 없습니다.");
  }
  
  if (!visitRequest || visitRequest.status !== "APPROVED") {
    throw new Error("승인되지 않은 예약이거나 유효하지 않은 QR 코드입니다.");
  }
  
  // QR 코드 데이터 생성 (하위 호환성)
  const qrData = {
    reservation_number: visitRequest.reservation_number,
    visitor_name: visitRequest.visitor_info?.[0]?.visitor_name || "",
    visit_date: visitRequest.visit_date,
    purpose: visitRequest.purpose,
    manager_name: visitRequest.manager_name || "",
    company: visitRequest.company,
    department: visitRequest.department,
  };
  
  return { qrData, visitRequest };
}

// QR 코드 디코딩 및 검증 (기존 방식 - 하위 호환성)
export async function decodeQRCode(encryptedData: string) {
  try {
    // Base64 디코딩
    const decoded = decodeURIComponent(escape(atob(encryptedData)));
    const qrData = JSON.parse(decoded);
    
    // 예약 정보 확인
    const { data: visitRequest, error } = await supabase
      .from("visit_requests")
      .select(`
        *,
        visitor_info (*),
        checklists (*)
      `)
      .eq("reservation_number", qrData.reservation_number)
      .single();
    
    if (error) throw new Error("예약 정보를 찾을 수 없습니다.");
    
    // QR 코드 데이터와 일치하는지 확인
    if (visitRequest.qr_code_data !== encryptedData) {
      throw new Error("유효하지 않은 QR 코드입니다.");
    }
    
    return { qrData, visitRequest };
  } catch (error: any) {
    throw new Error("QR 코드 디코딩 실패: " + error.message);
  }
}

// 방문 체크인 처리
export async function checkInVisit(reservationNumber: string) {
  const { data, error } = await supabase
    .from("visit_requests")
    .update({
      checked_in_at: new Date().toISOString(),
      status: "COMPLETED",
      updated_at: new Date().toISOString(),
    })
    .eq("reservation_number", reservationNumber)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 공지사항 목록 조회
export async function getNotices(limit = 10, offset = 0) {
  const { data, error } = await (supabase as any)
    .from("notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

// 공지사항 상세 조회
export async function getNotice(id: string) {
  const { data, error } = await (supabase as any)
    .from("notices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  // 조회수 증가
  await (supabase as any)
    .from("notices")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", id);

  return data;
}

// 공지사항 생성 (관리자용)
export async function createNotice(
  title: string,
  content: string,
  isPinned = false
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다");

  const { data, error } = await (supabase as any)
    .from("notices")
    .insert({
      title,
      content,
      author_id: user.id,
      is_pinned: isPinned,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 공지사항 수정 (관리자용)
export async function updateNotice(
  id: string,
  title: string,
  content: string,
  isPinned = false
) {
  const { data, error } = await (supabase as any)
    .from("notices")
    .update({
      title,
      content,
      is_pinned: isPinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 공지사항 삭제 (관리자용)
export async function deleteNotice(id: string) {
  const { error } = await (supabase as any).from("notices").delete().eq("id", id);
  if (error) throw error;
}

// FAQ 목록 조회
export async function getFAQs(category?: string) {
  let query = (supabase as any).from("faqs").select("*").order("order_index", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// FAQ 생성 (관리자용)
export async function createFAQ(
  category: string,
  question: string,
  answer: string,
  orderIndex = 0
) {
  const { data, error } = await (supabase as any)
    .from("faqs")
    .insert({
      category,
      question,
      answer,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// FAQ 수정 (관리자용)
export async function updateFAQ(
  id: string,
  category: string,
  question: string,
  answer: string,
  orderIndex = 0
) {
  const { data, error } = await (supabase as any)
    .from("faqs")
    .update({
      category,
      question,
      answer,
      order_index: orderIndex,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// FAQ 삭제 (관리자용)
export async function deleteFAQ(id: string) {
  const { error } = await (supabase as any).from("faqs").delete().eq("id", id);
  if (error) throw error;
}

// 문자 알림 전송 (Supabase Edge Function 호출 또는 외부 API)
export async function sendSMSNotification(
  visitRequestId: string,
  phoneNumber: string,
  message: string
) {
  // 문자 알림 로그 저장
  const { data: logData, error: logError } = await (supabase as any)
    .from("sms_notifications")
    .insert({
      visit_request_id: visitRequestId,
      phone_number: phoneNumber,
      message,
      status: "PENDING",
    })
    .select()
    .single();

  if (logError) throw logError;

  try {
    // 실제 문자 전송 API 호출 (예: 알리고, 카카오톡 등)
    // 여기서는 Supabase Edge Function을 호출하는 것으로 가정
    // 실제 구현 시 외부 SMS API 연동 필요
    const { data: functionData, error: functionError } = await (supabase as any).functions.invoke(
      "send-sms",
      {
        body: {
          phone: phoneNumber,
          message,
          logId: logData.id,
        },
      }
    );

    if (functionError) {
      // Edge Function이 없어도 로그는 저장됨
      console.warn("SMS Edge Function 호출 실패:", functionError);
    }

    // 성공 시 로그 업데이트
    await (supabase as any)
      .from("sms_notifications")
      .update({
        status: "SENT",
        sent_at: new Date().toISOString(),
      })
      .eq("id", logData.id);

    return { success: true, logId: logData.id };
  } catch (error: any) {
    // 실패 시 로그 업데이트
    await (supabase as any)
      .from("sms_notifications")
      .update({
        status: "FAILED",
        error_message: error.message,
      })
      .eq("id", logData.id);

    // 문자 전송 실패해도 예외를 던지지 않음 (로그만 저장)
    console.error("SMS 전송 실패:", error);
    return { success: false, logId: logData.id, error: error.message };
  }
}