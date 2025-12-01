import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, XCircle, Search, Loader2, Calendar, User, Building2, Phone, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchVisitRequestByReservationNumber } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  REQUESTED: { label: "요청", color: "text-blue-600", bgColor: "bg-blue-100" },
  APPROVED: { label: "승인", color: "text-green-600", bgColor: "bg-green-100" },
  REJECTED: { label: "반려", color: "text-red-600", bgColor: "bg-red-100" },
  COMPLETED: { label: "완료", color: "text-purple-600", bgColor: "bg-purple-100" },
  CANCELLED: { label: "취소", color: "text-gray-600", bgColor: "bg-gray-100" },
};

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
  const getProgressSteps = () => {
    if (!visitRequest) return [];

    const status = visitRequest.status;
    const checklist = visitRequest.checklists;
    const hasVisitors = visitRequest.visitor_info && visitRequest.visitor_info.length > 0;
    const allChecklistDone = checklist && 
      checklist.security_agreement && 
      checklist.safety_education && 
      checklist.privacy_consent;

    const steps = [
      {
        label: "방문 요청",
        status: status === "REQUESTED" ? "current" : status !== "REQUESTED" ? "completed" : "pending",
        date: visitRequest.visit_date ? formatDate(visitRequest.visit_date) : "",
      },
      {
        label: "내부 승인",
        status: status === "APPROVED" || status === "COMPLETED" ? "completed" : 
                status === "REJECTED" ? "rejected" : 
                status === "REQUESTED" ? "current" : "pending",
        date: "",
      },
      {
        label: "방문자 정보 입력",
        status: hasVisitors ? "completed" : 
                status === "APPROVED" ? "current" : "pending",
        date: "",
      },
      {
        label: "교육/보안 동의",
        status: allChecklistDone ? "completed" : 
                hasVisitors && status === "APPROVED" ? "current" : "pending",
        date: "",
      },
      {
        label: "방문 확정",
        status: status === "COMPLETED" ? "completed" : 
                allChecklistDone && status === "APPROVED" ? "current" : "pending",
        date: "",
      },
    ];

    return steps;
  };

  const progressSteps = getProgressSteps();
  const checklist = visitRequest?.checklists;
  const statusConfig = visitRequest ? STATUS_CONFIG[visitRequest.status] || STATUS_CONFIG.REQUESTED : null;

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy년 M월 d일", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy년 M월 d일 HH:mm", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/-/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 검색 섹션 */}
          <Card className="mb-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">예약 현황 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="예약번호를 입력하세요"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading} className="min-w-[100px]">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      검색중
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      검색
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {loading && (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">예약 정보를 불러오는 중...</p>
              </CardContent>
            </Card>
          )}

          {!loading && !visitRequest && !error && (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground space-y-2">
                  <p className="text-lg">예약번호를 입력하고 검색해주세요.</p>
                  <p className="text-sm">예약번호는 방문 신청 완료 시 발급된 번호입니다.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {visitRequest && (
            <div className="space-y-6">
              {/* 예약 정보 헤더 */}
              <Card className="shadow-sm border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">예약 정보</h2>
                        {statusConfig && (
                          <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                            {statusConfig.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        예약번호: <span className="font-semibold text-foreground">{visitRequest.reservation_number}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 진행 단계 타임라인 */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">진행 단계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* 타임라인 라인 */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    
                    {/* 단계들 */}
                    <div className="space-y-6">
                      {progressSteps.map((step, index) => (
                        <div key={index} className="relative flex items-start gap-4">
                          {/* 아이콘 */}
                          <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                            step.status === "completed" 
                              ? "bg-green-500 border-green-500 text-white" 
                              : step.status === "current"
                              ? "bg-primary border-primary text-white"
                              : step.status === "rejected"
                              ? "bg-red-500 border-red-500 text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}>
                            {step.status === "completed" ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : step.status === "rejected" ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          
                          {/* 내용 */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-medium ${
                                  step.status === "completed" || step.status === "current"
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}>
                                  {step.label}
                                </p>
                                {step.date && (
                                  <p className="text-sm text-muted-foreground mt-1">{step.date}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 방문 정보 */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    방문 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">방문 일시</div>
                      <div className="font-medium text-lg">
                        {formatDate(visitRequest.visit_date)}
                        {visitRequest.end_date && ` ~ ${formatDate(visitRequest.end_date)}`}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">방문 목적</div>
                      <div className="font-medium">{visitRequest.purpose}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        방문 부서
                      </div>
                      <div className="font-medium">
                        {visitRequest.company} · {visitRequest.department}
                      </div>
                    </div>
                    {visitRequest.visitor_company && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">방문자 회사</div>
                        <div className="font-medium">{visitRequest.visitor_company}</div>
                      </div>
                    )}
                    {visitRequest.manager_name && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="w-4 h-4" />
                          담당자
                        </div>
                        <div className="font-medium">
                          {visitRequest.manager_name}
                          {visitRequest.manager_phone && (
                            <span className="text-muted-foreground ml-2">
                              ({formatPhone(visitRequest.manager_phone)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 방문자 정보 */}
              {visitRequest.visitor_info && visitRequest.visitor_info.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      방문자 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {visitRequest.visitor_info.map((visitor, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg border">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{visitor.visitor_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{formatPhone(visitor.visitor_phone)}</span>
                              </div>
                              {visitor.car_number && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Car className="w-4 h-4" />
                                  <span>차량번호: {visitor.car_number}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 체크리스트 */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">체크리스트</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      checklist?.security_agreement 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}>
                      {checklist?.security_agreement ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">보안 서약</div>
                        <div className={`text-sm ${
                          checklist?.security_agreement ? "text-green-600" : "text-gray-500"
                        }`}>
                          {checklist?.security_agreement ? "완료" : "미완료"}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      checklist?.safety_education 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}>
                      {checklist?.safety_education ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">안전 교육</div>
                        <div className={`text-sm ${
                          checklist?.safety_education ? "text-green-600" : "text-gray-500"
                        }`}>
                          {checklist?.safety_education ? "완료" : "미완료"}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      checklist?.privacy_consent 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}>
                      {checklist?.privacy_consent ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">개인정보 동의</div>
                        <div className={`text-sm ${
                          checklist?.privacy_consent ? "text-green-600" : "text-gray-500"
                        }`}>
                          {checklist?.privacy_consent ? "완료" : "미완료"}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      checklist?.document_upload 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}>
                      {checklist?.document_upload ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">자료 업로드</div>
                        <div className={`text-sm ${
                          checklist?.document_upload ? "text-green-600" : "text-gray-500"
                        }`}>
                          {checklist?.document_upload ? "완료" : "미완료"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}