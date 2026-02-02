/**
 * 광동제약 방문예약 SMS 메시지 템플릿
 */
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const SITE_NAME = "광동제약";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return import.meta.env.VITE_APP_URL || "https://kwangdong-site.vercel.app";
}

/** 예약 접수 완료 시 발송 (예: ReservationForm 제출 직후) */
export function buildReservationReceivedMessage(params: {
  managerName: string;
  visitDate: string;
  endDate?: string | null;
  reservationNumber: string;
}): string {
  const { managerName, visitDate, endDate, reservationNumber } = params;
  const baseUrl = getBaseUrl();
  const period =
    endDate && endDate !== visitDate
      ? `${visitDate}~${endDate}`
      : visitDate;

  return `[${SITE_NAME} 방문 예약]
[Web발신]
[${SITE_NAME} 방문 예약]
방문 예약이 정상적으로 접수되었습니다.
담당자 승인 후 안내 문자메시지를 발송해드리겠습니다.
접견자: ${managerName || "-"}
출입기간: ${period}
예약번호: ${reservationNumber}
방문 예약 현황은 아래 링크를 통해 확인하실 수 있습니다.
URL: ${baseUrl}/progress/view`;
}

/** 승인 완료 시 발송 (AdminApproval 승인 시) */
export function buildApprovalCompleteMessage(params: {
  managerName: string;
  visitDate: string;
  endDate?: string | null;
  reservationNumber: string;
  qrCodeUrl: string;
}): string {
  const { managerName, visitDate, endDate, reservationNumber, qrCodeUrl } = params;
  const baseUrl = getBaseUrl();
  const period =
    endDate && endDate !== visitDate
      ? `${visitDate}~${endDate}`
      : visitDate;

  return `[${SITE_NAME} 방문 승인 완료]
[Web발신]
[${SITE_NAME} 방문 승인 완료]
접견자: ${managerName || "-"}
출입기간: ${period}
예약번호: ${reservationNumber}
[방문객 주의사항 안내]
 1. 광동제약은 개인정보 보호를 위해 QR 인증을 통한 신원 확인을 하고 있습니다.
 2. 개인 차량을 이용하시는 경우 주차장(경비실)에서 안내해드리겠습니다.
 3. 모든 방문객은 안내데스크에서 QR 인증을 진행해주시길 바랍니다.
QR 링크: ${qrCodeUrl}
 4. 예약번호는 방문 예약 현황 조회 시 필요하며, 조회가 필요하시면 방문 신청 현황 보기를 이용해 주세요.
방문 예약 현황은 아래 링크를 통해 확인하실 수 있습니다.
URL: ${baseUrl}/progress/view`;
}

/** 반려 시 발송 */
export function buildRejectionMessage(params: {
  reservationNumber: string;
  reason: string;
}): string {
  const { reservationNumber, reason } = params;
  const baseUrl = getBaseUrl();

  return `[${SITE_NAME} 방문 예약 반려]
[Web발신]
[${SITE_NAME} 방문 예약 반려]
예약번호: ${reservationNumber}
사유: ${reason}
문의가 필요하시면 담당자에게 연락해 주세요.
방문 예약 현황: ${baseUrl}/progress/view`;
}

/** visit_date를 YYYY-MM-DD 형식 문자열로 변환 */
export function formatVisitDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy-MM-dd", { locale: ko });
}
