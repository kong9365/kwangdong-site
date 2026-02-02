import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Copy, QrCode, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { searchVisitRequestByReservationNumber } from "@/lib/api";

export default function ReservationComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const reservationNumber = searchParams.get("reservation");
  const [visitRequest, setVisitRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reservationNumber) {
      loadVisitRequest();
    }
  }, [reservationNumber]);

  const loadVisitRequest = async () => {
    if (!reservationNumber) return;

    setLoading(true);
    try {
      const data = await searchVisitRequestByReservationNumber(reservationNumber);
      if (data) {
        setVisitRequest(data);
      }
    } catch (error) {
      console.error("예약 정보 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReservationNumber = () => {
    if (reservationNumber) {
      navigator.clipboard.writeText(reservationNumber);
      toast({
        title: "복사 완료",
        description: "예약번호가 클립보드에 복사되었습니다.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 sm:py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 sm:p-12">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary/10 p-6">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                방문예약 신청이 완료되었습니다
              </h1>

              {/* Reservation Number */}
              {reservationNumber && (
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
                      예약번호: {reservationNumber}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyReservationNumber}
                      className="h-8 w-8 p-0"
                      title="예약번호 복사"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="text-center text-muted-foreground space-y-2 mb-8">
                <p>
                  담당자 승인 후 문자메시지로 방문 확정 안내를 드리겠습니다.
                </p>
                <p className="text-sm">
                  승인 완료 시 QR코드 링크가 포함된 문자가 발송됩니다.
                </p>
                {reservationNumber && (
                  <p className="text-sm font-medium text-foreground mt-4">
                    예약현황 조회에서 방문자명, 전화번호, 예약번호를 입력하시면
                    예약 상태를 확인할 수 있습니다.
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-muted rounded-lg p-6 space-y-3 mb-8">
                <h3 className="font-semibold text-lg mb-4">다음 단계 안내</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-medium">담당자 승인 대기</p>
                      <p className="text-muted-foreground">
                        담당자가 방문 요청을 검토합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-medium">승인 문자 수신</p>
                      <p className="text-muted-foreground">
                        승인 시 문자의 QR 링크를 클릭하면 QR 코드가 표시됩니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-medium">방문 당일</p>
                      <p className="text-muted-foreground">
                        안내데스크에서 QR 코드를 제시해 주세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Preview (승인된 경우) */}
              {visitRequest && visitRequest.status === "APPROVED" && visitRequest.qr_code_url && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                      <QrCode className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100">
                        QR 코드가 생성되었습니다
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        방문 당일 QR 코드를 제시해주세요.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(visitRequest.qr_code_url, "_blank")}
                    className="w-full gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    QR 코드 보기
                  </Button>
                </div>
              )}

              {/* Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <strong>안내사항:</strong> 방문 전 안전보건지침을 숙지하시고,
                  방문 당일 신분증을 지참해 주세요. 개인 차량 이용 시
                  주차장(경비실)에서 안내받으실 수 있습니다.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      reservationNumber
                        ? `/progress?reservation=${reservationNumber}`
                        : "/progress"
                    )
                  }
                  className="sm:w-48"
                >
                  예약현황 확인
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="sm:w-48"
                >
                  메인으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
