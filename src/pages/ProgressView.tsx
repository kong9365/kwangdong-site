import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
      return;
    }

    setLoading(true);
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
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        variant: "destructive",
      });
      return;
    }

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
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

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
                </div>
              </CardContent>
            </Card>
          )}

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
        </div>
      </main>

      <Footer />
    </div>
  );
}