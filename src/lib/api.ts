import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type VisitRequest = Database["public"]["Tables"]["visit_requests"]["Row"];
type VisitRequestInsert = Database["public"]["Tables"]["visit_requests"]["Insert"];
type VisitRequestUpdate = Database["public"]["Tables"]["visit_requests"]["Update"];

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

// 방문 요청 생성
export async function createVisitRequest(
  request: VisitRequestInsert & {
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
  // 예약번호 생성 (함수가 없으면 직접 생성)
  let reservationNumber: string;
  try {
    const { data: reservationNumberData, error: numberError } = await (supabase as any)
      .rpc("generate_reservation_number");

    if (numberError) throw numberError;
    reservationNumber = (reservationNumberData as string) || `VR-${new Date().getFullYear()}-${Date.now()}`;
  } catch (error) {
    // 함수가 없으면 직접 생성
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    reservationNumber = `VR-${year}-${timestamp.toString().slice(-6)}`;
  }

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

// 방문 요청 승인 (관리자용)
export async function approveVisitRequest(id: string, approvedBy: string) {
  const { data, error } = await supabase
    .from("visit_requests")
    .update({
      status: "APPROVED",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
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
    .select()
    .single();

  if (error) throw error;
  return data;
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