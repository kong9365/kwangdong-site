<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
=======
import { useState } from "react";
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
<<<<<<< HEAD
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, XCircle, Search, AlertCircle, Trash2 } from "lucide-react";
import {
  searchVisitRequestByReservationNumber,
  searchVisitRequestByPhone,
  cancelVisitRequest,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const STEPS = [
  "1) 방문 요청",
  "2) 내부 승인",
  "3) 방문자 정보 입력",
  "4) 교육/보안 동의 완료",
  "5) 방문 확정",
];

const STATUS_MAP: Record<string, number> = {
  REQUESTED: 0,
  APPROVED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 4,
  REJECTED: -1,
  CANCELLED: -1,
};

export default function ProgressView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<"number" | "phone">("number");
  const [searchValue, setSearchValue] = useState("");
  const [visitRequest, setVisitRequest] = useState<any>(null);
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { toast } = useToast();

  // URL 파라미터에서 검색값 가져오기
  useEffect(() => {
    const reservationNumber = searchParams.get("reservation");
    const phone = searchParams.get("phone");
    
    if (reservationNumber) {
      setSearchType("number");
      setSearchValue(reservationNumber);
      handleSearch("number", reservationNumber);
    } else if (phone) {
      setSearchType("phone");
      setSearchValue(phone);
      handleSearch("phone", phone);
    }
  }, [searchParams]);

  const handleSearch = async (type: "number" | "phone", value: string) => {
    if (!value.trim()) {
      toast({
        title: "검색어를 입력해주세요",
        variant: "destructive",
      });
=======
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Loader2, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchVisitRequests, cancelVisitRequest } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
  created_at: string;
  visitor_info?: Array<{
    visitor_name: string;
    visitor_phone: string;
    car_number?: string | null;
  }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  REQUESTED: { label: "요청", color: "text-blue-600", bgColor: "bg-blue-100" },
  APPROVED: { label: "승인", color: "text-green-600", bgColor: "bg-green-100" },
  REJECTED: { label: "반려", color: "text-red-600", bgColor: "bg-red-100" },
  COMPLETED: { label: "완료", color: "text-purple-600", bgColor: "bg-purple-100" },
  CANCELLED: { label: "취소", color: "text-gray-600", bgColor: "bg-gray-100" },
};

export default function ProgressView() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 검색 필드
  const [visitorName, setVisitorName] = useState("");
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");
  
  // 조회 결과
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    // 검증
    if (!visitorName.trim()) {
      setError("방문자명을 입력해주세요.");
      return;
    }
    if (!phone2.trim() || !phone3.trim()) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (!reservationNumber.trim()) {
      setError("예약번호를 입력해주세요.");
      return;
    }
    
    if (reservationNumber.length !== 5 || !/^\d+$/.test(reservationNumber)) {
      setError("예약번호는 5자리 숫자여야 합니다.");
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
      return;
    }

    setLoading(true);
<<<<<<< HEAD
    try {
      let data;
      if (type === "number") {
        data = await searchVisitRequestByReservationNumber(value.trim());
        setVisitRequest(data);
        setChecklist(data.checklists?.[0] || null);
      } else {
        const results = await searchVisitRequestByPhone(value.trim());
        if (results && results.length > 0) {
          // 첫 번째 결과 사용 (여러 개일 경우 목록 표시 가능)
          const firstResult = results[0];
          setVisitRequest(firstResult);
          setChecklist(firstResult.checklists?.[0] || null);
        } else {
          setVisitRequest(null);
          setChecklist(null);
          toast({
            title: "검색 결과가 없습니다",
            description: "예약번호 또는 연락처를 확인해주세요.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("검색 오류:", error);
      setVisitRequest(null);
      setChecklist(null);
      toast({
        title: "검색 실패",
        description: error.message || "예약 정보를 찾을 수 없습니다.",
=======
    setError(null);

    try {
      const phone = `${phone1}${phone2}${phone3}`;
      const data = await searchVisitRequests(visitorName.trim(), phone, reservationNumber.trim());
      setVisitRequests(data as VisitRequest[]);
      
      if (data.length === 0) {
        toast({
          title: "조회 결과 없음",
          description: "검색 조건에 맞는 예약 정보를 찾을 수 없습니다.",
          variant: "default",
        });
      }
    } catch (err: any) {
      setError(err.message || "예약 정보 조회 중 오류가 발생했습니다.");
      setVisitRequests([]);
      toast({
        title: "조회 실패",
        description: err.message || "예약 정보 조회 중 오류가 발생했습니다.",
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchType, searchValue);
  };

  const handleCancel = async () => {
    if (!visitRequest || !cancelReason.trim()) {
      toast({
        title: "취소 사유를 입력해주세요",
=======
  const handleCancel = async (id: string, visitDate: string) => {
    // 방문기간 이후인지 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDateObj = new Date(visitDate);
    visitDateObj.setHours(0, 0, 0, 0);
    
    if (visitDateObj < today) {
      toast({
        title: "취소 불가",
        description: "방문기간이 지난 예약은 취소할 수 없습니다.",
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
        variant: "destructive",
      });
      return;
    }

<<<<<<< HEAD
    try {
      await cancelVisitRequest(visitRequest.id, cancelReason);
      toast({
        title: "예약 취소 완료",
        description: "예약이 취소되었습니다.",
      });
      setCancelDialogOpen(false);
      setCancelReason("");
      await handleSearch(searchType, searchValue);
    } catch (error: any) {
      console.error("취소 오류:", error);
      toast({
        title: "취소 실패",
        description: error.message,
=======
    if (!confirm("정말로 방문을 취소하시겠습니까?")) {
      return;
    }

    try {
      await cancelVisitRequest(id);
      toast({
        title: "취소 완료",
        description: "방문 예약이 취소되었습니다.",
      });
      // 목록 새로고침
      handleSearch();
    } catch (err: any) {
      toast({
        title: "취소 실패",
        description: err.message || "방문 취소 중 오류가 발생했습니다.",
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
        variant: "destructive",
      });
    }
  };

<<<<<<< HEAD
  const activeStepIndex = visitRequest
    ? STATUS_MAP[visitRequest.status] || 0
    : -1;
=======
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const formatVisitorNames = (visitors: Array<{ visitor_name: string }> | undefined) => {
    if (!visitors || visitors.length === 0) return "-";
    if (visitors.length === 1) return visitors[0].visitor_name;
    return `${visitors[0].visitor_name} 외 ${visitors.length - 1}명`;
  };

  const canCancel = (visitDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDateObj = new Date(visitDate);
    visitDateObj.setHours(0, 0, 0, 0);
    return visitDateObj >= today;
  };
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

<<<<<<< HEAD
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>예약현황 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex gap-2 flex-1">
                    <select
                      value={searchType}
                      onChange={(e) =>
                        setSearchType(e.target.value as "number" | "phone")
                      }
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="number">예약번호</option>
                      <option value="phone">연락처</option>
                    </select>
                    <Input
                      type="text"
                      placeholder={
                        searchType === "number"
                          ? "예약번호를 입력하세요 (예: VR-2025-000001)"
                          : "연락처를 입력하세요 (예: 01012345678)"
                      }
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "검색 중..." : "검색"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {!visitRequest && !loading && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    예약번호 또는 연락처로 검색해주세요.
                  </p>
=======
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 검색 섹션 */}
          <Card className="mb-6 shadow-sm border">
            <CardHeader>
              <CardTitle className="text-xl">방문자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 방문자명 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">방문자명</label>
                  <Input
                    placeholder="방문자명 입력"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>

                {/* 전화번호 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">전화번호</label>
                  <div className="flex items-center gap-2">
                    <Select value={phone1} onValueChange={setPhone1}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="010">010</SelectItem>
                        <SelectItem value="011">011</SelectItem>
                        <SelectItem value="016">016</SelectItem>
                        <SelectItem value="017">017</SelectItem>
                        <SelectItem value="018">018</SelectItem>
                        <SelectItem value="019">019</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>-</span>
                    <Input
                      placeholder="0000"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <span>-</span>
                    <Input
                      placeholder="0000"
                      value={phone3}
                      onChange={(e) => setPhone3(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 예약번호 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">예약번호</label>
                  <Input
                    placeholder="예약번호 입력"
                    value={reservationNumber}
                    onChange={(e) => setReservationNumber(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    maxLength={5}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>

                {/* 검색 버튼 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium opacity-0">검색</label>
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading} 
                    className="w-full"
                  >
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
              </div>
              
              {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 조회 결과 테이블 */}
          {visitRequests.length > 0 && (
            <Card className="shadow-sm border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">방문예약현황</CardTitle>
                  <Badge variant="secondary">전체({visitRequests.length})</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">NO</TableHead>
                        <TableHead>신청일</TableHead>
                        <TableHead>소속회사</TableHead>
                        <TableHead>방문자명</TableHead>
                        <TableHead>방문기간</TableHead>
                        <TableHead>방문목적</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="text-center">방문취소</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitRequests.map((request, index) => {
                        const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.REQUESTED;
                        const canCancelVisit = canCancel(request.visit_date);
                        
                        return (
                          <TableRow key={request.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{formatDate(request.created_at)}</TableCell>
                            <TableCell>{request.visitor_company || "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {formatVisitorNames(request.visitor_info)}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/progress/view?reservation=${request.reservation_number}`)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(request.visit_date)}
                              {request.end_date && ` ~ ${formatDate(request.end_date)}`}
                            </TableCell>
                            <TableCell>{request.purpose}</TableCell>
                            <TableCell>
                              {request.manager_name || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancel(request.id, request.visit_date)}
                                disabled={!canCancelVisit || request.status === "CANCELLED" || request.status === "COMPLETED"}
                                className="text-xs"
                              >
                                취소
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
                </div>
              </CardContent>
            </Card>
          )}

<<<<<<< HEAD
          {visitRequest && (
            <div className="space-y-6">
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
                          index <= activeStepIndex && activeStepIndex >= 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  {activeStepIndex >= 0 && (
                    <p className="text-sm text-muted-foreground">
                      현재 단계는{" "}
                      <span className="font-semibold text-foreground">
                        {STEPS[activeStepIndex]}
                      </span>{" "}
                      입니다.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Visit Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>방문 정보</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          visitRequest.status === "APPROVED" ||
                          visitRequest.status === "IN_PROGRESS"
                            ? "default"
                            : visitRequest.status === "REJECTED" ||
                              visitRequest.status === "CANCELLED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        예약번호: {visitRequest.reservation_number}
                      </Badge>
                      {(visitRequest.status === "REQUESTED" ||
                        visitRequest.status === "APPROVED") && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setCancelDialogOpen(true)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          취소
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        방문 일시
                      </div>
                      <div className="font-medium">
                        {format(
                          new Date(visitRequest.visit_date),
                          "yyyy년 M월 d일",
                          { locale: ko }
                        )}
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
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        상태
                      </div>
                      <div className="font-medium">
                        {visitRequest.status === "REQUESTED" && "요청됨"}
                        {visitRequest.status === "APPROVED" && "승인됨"}
                        {visitRequest.status === "REJECTED" && "반려됨"}
                        {visitRequest.status === "IN_PROGRESS" && "진행중"}
                        {visitRequest.status === "COMPLETED" && "완료"}
                        {visitRequest.status === "CANCELLED" && "취소됨"}
                      </div>
                    </div>
                  </div>
                  {visitRequest.visitor_info && visitRequest.visitor_info.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="text-sm text-muted-foreground mb-2">
                        방문자 정보
                      </div>
                      <div className="space-y-2">
                        {visitRequest.visitor_info.map((visitor: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            {visitor.visitor_name} ({visitor.visitor_phone})
                            {visitor.car_number && ` - 차량: ${visitor.car_number}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Checklist Summary */}
              {checklist && (
                <Card>
                  <CardHeader>
                    <CardTitle>체크리스트 요약</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist.security_agreement ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">보안 서약</div>
                          <div
                            className={`text-sm ${
                              checklist.security_agreement
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist.security_agreement ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist.safety_education ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">안전 교육</div>
                          <div
                            className={`text-sm ${
                              checklist.safety_education
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist.safety_education ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist.privacy_consent ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">개인정보 동의</div>
                          <div
                            className={`text-sm ${
                              checklist.privacy_consent
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist.privacy_consent ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        {checklist.document_upload ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">자료 업로드</div>
                          <div
                            className={`text-sm ${
                              checklist.document_upload
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {checklist.document_upload ? "완료" : "미완료"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Cancel Dialog */}
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>예약 취소</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
                </p>
                <Textarea
                  placeholder="취소 사유를 입력하세요..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCancelDialogOpen(false);
                    setCancelReason("");
                  }}
                >
                  닫기
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  취소하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
=======
          {!loading && visitRequests.length === 0 && !error && (
            <Card className="shadow-sm border">
              <CardContent className="py-12 text-center">
                <div className="text-muted-foreground space-y-2">
                  <p className="text-lg">방문자명, 전화번호, 예약번호를 모두 입력하고 검색해주세요.</p>
                  <p className="text-sm">예약번호는 5자리 숫자입니다.</p>
                </div>
              </CardContent>
            </Card>
          )}
>>>>>>> af33fb953dced0320827a0fa328f843d846f7ecc
        </div>
      </main>

      <Footer />
    </div>
  );
}