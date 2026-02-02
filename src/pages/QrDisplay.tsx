/**
 * QR 코드 전용 표시 페이지
 * 방문객이 문자 링크를 클릭하면 이 페이지에서 QR 코드를 보여줌
 * /qr/{qr_code_id} URL로 접근
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getVisitRequestByQRCodeId } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function QrDisplay() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitRequest, setVisitRequest] = useState<{
    reservation_number: string;
    visitor_info?: Array<{ visitor_name: string }>;
    visit_date: string;
    end_date?: string | null;
    manager_name?: string | null;
    purpose?: string;
  } | null>(null);

  const qrCodeUrl =
    typeof window !== "undefined" && id
      ? `${window.location.origin}/qr/${id}`
      : "";

  useEffect(() => {
    if (!id) {
      setError("유효하지 않은 QR 코드입니다.");
      setLoading(false);
      return;
    }

    getVisitRequestByQRCodeId(id)
      .then(({ visitRequest: vr }) => {
        setVisitRequest(vr as any);
      })
      .catch((err) => {
        setError(err.message || "예약 정보를 불러올 수 없습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-pulse text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (error || !visitRequest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center text-destructive">
          <p className="font-medium">{error || "예약 정보를 찾을 수 없습니다."}</p>
          <p className="text-sm text-muted-foreground mt-2">
            승인되지 않은 예약이거나 링크가 만료되었을 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  const visitorNames =
    visitRequest.visitor_info
      ?.map((v) => v.visitor_name)
      .join(", ") || "-";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          광동제약 방문 예약
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          안내데스크에서 QR 코드를 스캔해 주세요
        </p>

        {/* QR 코드 - 스캔 시 이 페이지 URL이 인식됨 */}
        <div className="flex justify-center p-6 bg-white rounded-xl border-2 border-primary">
          <QRCodeSVG
            value={qrCodeUrl}
            size={240}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* 예약 정보 */}
        <div className="mt-6 space-y-2 text-left bg-muted/30 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">예약번호</span>
            <span className="font-mono font-medium">
              {visitRequest.reservation_number}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">방문자</span>
            <span>{visitorNames}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">방문일</span>
            <span>
              {format(new Date(visitRequest.visit_date), "yyyy년 M월 d일", {
                locale: ko,
              })}
              {visitRequest.end_date &&
                visitRequest.end_date !== visitRequest.visit_date &&
                ` ~ ${format(new Date(visitRequest.end_date), "yyyy년 M월 d일", {
                  locale: ko,
                })}`}
            </span>
          </div>
          {visitRequest.manager_name && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">접견자</span>
              <span>{visitRequest.manager_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
