import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, XCircle, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchVisitRequestByReservationNumber } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const STEPS = [
  "1) 방문 요청",
  "2) 내부 승인",
  "3) 방문자 정보 입력",
  "4) 교육/보안 동의 완료",
  "5) 방문 확정",
];

interface VisitRequest {
  id: string;
  reservation_number: string;
  company: string;
  department: string;
  purpose: string;
  visit_date: string;
  end_date?: string | null;
  visitor_company?: string | null;
  status: string;
  manager_name?: string | null;
  manager_phone?: string | null;
  visitor_info?: Array<{
    visitor_name: string;
    visitor_phone: string;
    car_number?: string | null;
  }>;
  checklists?: {
    security_agreement: boolean;
    safety_education: boolean;
    privacy_consent: boolean;
    document_upload: boolean;
  } | null;
}

export default function ProgressView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [reservationNumber, setReservationNumber] = useState(
    searchParams.get("reservation") || ""
  );
  const [visitRequest, setVisitRequest] = useState<VisitRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL에서 예약번호가 있으면 자동으로 조회
  useEffect(() => {
    const reservation = searchParams.get("reservation");
    if (reservation) {
      setReservationNumber(reservation);
      fetchVisitRequest(reservation);
    }
  }, [searchParams]);

  const fetchVisitRequest = async (number: string) => {
    if (!number.trim()) {
      setError("예약번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchVisitRequestByReservationNumber(number);
      setVisitRequest(data as any);
    } catch (err: any) {
      setError(err.message || "예약 정보를 찾을 수 없습니다.");
      setVisitRequest(null);
      toast({
        title: "조회 실패",
        description: err.message || "예약 정보를 찾을 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!reservationNumber.trim()) {
      setError("예약번호를 입력해주세요.");
      return;
    }
    setSearchParams({ reservation: reservationNumber });
    fetchVisitRequest(reservationNumber);
  };

  // 상태에 따른 진행 단계 계산
  const getCurrentStep = () => {
    if (!visitRequest) return 0;

    const status = visitRequest.status;
    const checklist = visitRequest.checklists;

    // 1단계: 방문 요청 (REQUESTED)
    if (status === "REQUESTED") return 0;

    // 2단계: 내부 승인 (APPROVED)
    if (status === "APPROVED") {
      // 체크리스트가 하나라도 완료되지 않았으면 2단계
      if (!checklist || !checklist.security_agreement || !checklist.safety_education || !checklist.privacy_consent) {
        return 1;
      }
      // 모두 완료되었으면 3단계
      return 2;
    }

    // 3단계: 방문자 정보 입력 완료
    if (visitRequest.visitor_info && visitRequest.visitor_info.length > 0) {
      // 체크리스트가 모두 완료되었으면 4단계
      if (checklist && checklist.security_agreement && checklist.safety_education && checklist.privacy_consent) {
        return 3;
      }
      return 2;
    }

    // 4단계: 교육/보안 동의 완료
    if (checklist && checklist.security_agreement && checklist.safety_education && checklist.privacy_consent) {
      return 3;
    }

    // 5단계: 방문 확정 (COMPLETED)
    if (status === "COMPLETED") return 4;

    return 0;
  };

  const activeStepIndex = visitRequest ? getCurrentStep() : -1;
  const checklist = visitRequest?.checklists;

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy년 M월 d일", { locale: ko });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* 예약번호 검색 */}
            <Card>
              <CardHeader>
                <CardTitle>예약 현황 조회</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="예약번호를 입력하세요 (예: VR-2025-123456)"
                    value={reservationNumber}
                    onChange={(e) => setReservationNumber(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    검색
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </CardContent>
            </Card>

            {loading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">예약 정보를 불러오는 중...</p>
                </CardContent>
              </Card>
            )}

            {!loading && !visitRequest && !error && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    예약번호를 입력하고 검색해주세요.
                  </p>
                </CardContent>
              </Card>
            )}

            {visitRequest && (
              <>
                {/* Progress Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>방문 진행 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {STEPS.map((label, index) => (
                        <div
                          key={label}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            index <= activeStepIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current" />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      현재 단계는{" "}
                      <span className="font-semibold text-foreground">
                        {STEPS[activeStepIndex]}
                      </span>{" "}
                      입니다.
                    </p>
                  </CardContent>
                </Card>

                {/* Visit Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>방문 정보</CardTitle>
                      <Badge variant="secondary">
                        예약번호: {visitRequest.reservation_number}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          방문 일시
                        </div>
                        <div className="font-medium">
                          {formatDate(visitRequest.visit_date)}
                          {visitRequest.end_date && ` ~ ${formatDate(visitRequest.end_date)}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          방문 목적
                        </div>
                        <div className="font-medium">{visitRequest.purpose}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          방문 부서
                        </div>
                        <div className="font-medium">
                          {visitRequest.company} · {visitRequest.department}
                        </div>
                      </div>
                      {visitRequest.visitor_company && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            방문자 회사
                          </div>
                          <div className="font-medium">
                            {visitRequest.visitor_company}
                          </div>
                        </div>
                      )}
                      {visitRequest.manager_name && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            담당자
                          </div>
                          <div className="font-medium">
                            {visitRequest.manager_name}
                            {visitRequest.manager_phone && ` (${visitRequest.manager_phone})`}
                          </div>
                        </div>
                      )}
                      {visitRequest.visitor_info && visitRequest.visitor_info.length > 0 && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            방문자
                          </div>
                          <div className="font-medium">
                            {visitRequest.visitor_info.map((v, i) => (
                              <div key={i}>
                                {v.visitor_name} ({v.visitor_phone})
                                {v.car_number && ` - 차량: ${v.car_number}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Checklist Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>체크리스트 요약</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist?.security_agreement ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">보안 서약</div>
                          <div
                            className={`text-sm ${
                              checklist?.security_agreement
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist?.security_agreement ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist?.safety_education ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">안전 교육</div>
                          <div
                            className={`text-sm ${
                              checklist?.safety_education
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist?.safety_education ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist?.privacy_consent ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">개인정보 동의</div>
                          <div
                            className={`text-sm ${
                              checklist?.privacy_consent
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist?.privacy_consent ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist?.document_upload ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">자료 업로드</div>
                          <div
                            className={`text-sm ${
                              checklist?.document_upload
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist?.document_upload ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}