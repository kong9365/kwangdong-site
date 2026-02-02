import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Loader2,
  FileEdit,
  Copy,
  QrCode,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  status: string;
  manager_name?: string | null;
  manager_phone?: string | null;
  created_at: string;
  checked_in_at?: string | null;
  qr_code_url?: string | null;
  visitor_info?: Array<{
    visitor_name: string;
    visitor_phone: string;
    car_number?: string | null;
  }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  REQUESTED: { label: "대기중", color: "text-blue-600", bgColor: "bg-blue-100" },
  APPROVED: { label: "승인됨", color: "text-green-600", bgColor: "bg-green-100" },
  REJECTED: { label: "반려됨", color: "text-red-600", bgColor: "bg-red-100" },
  COMPLETED: { label: "완료", color: "text-purple-600", bgColor: "bg-purple-100" },
  CANCELLED: { label: "취소됨", color: "text-gray-600", bgColor: "bg-gray-100" },
};

export function ApprovalTab() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // 통계
  const [stats, setStats] = useState({
    total: 0,
    requested: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  });

  useEffect(() => {
    loadVisitRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [visitRequests, searchQuery, statusFilter]);

  const loadVisitRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("visit_requests")
        .select(`
          *,
          visitor_info (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const requests = (data || []) as VisitRequest[];
      setVisitRequests(requests);
      
      // 통계 계산
      const statsData = {
        total: requests.length,
        requested: requests.filter((r) => r.status === "REQUESTED").length,
        approved: requests.filter((r) => r.status === "APPROVED").length,
        rejected: requests.filter((r) => r.status === "REJECTED").length,
        completed: requests.filter((r) => r.status === "COMPLETED" || r.checked_in_at).length,
      };
      setStats(statsData);
    } catch (error: any) {
      console.error("방문 요청 로드 오류:", error);
      toast({
        title: "방문 요청을 불러올 수 없습니다",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = visitRequests;

    // 상태 필터
    if (statusFilter !== "전체") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.reservation_number?.toLowerCase().includes(query) ||
          req.company.toLowerCase().includes(query) ||
          req.department.toLowerCase().includes(query) ||
          req.purpose.toLowerCase().includes(query) ||
          req.manager_name?.toLowerCase().includes(query) ||
          req.visitor_info?.some((v) => 
            v.visitor_name.toLowerCase().includes(query) ||
            v.visitor_phone.includes(query)
          )
      );
    }

    setFilteredRequests(filtered);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd HH:mm", { locale: ko });
    } catch {
      return dateString;
    }
  };

  const formatVisitorNames = (visitors: Array<{ visitor_name: string }> | undefined) => {
    if (!visitors || visitors.length === 0) return "-";
    if (visitors.length === 1) return visitors[0].visitor_name;
    return `${visitors[0].visitor_name} 외 ${visitors.length - 1}명`;
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.REQUESTED;
    return (
      <Badge className={`${config.bgColor} ${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-muted-foreground mb-1">전체 예약</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card
          className={`touch-manipulation transition-all ${
            stats.requested > 0
              ? "cursor-pointer active:scale-[0.98] border-blue-200 bg-blue-50/50"
              : ""
          }`}
          onClick={() => {
            if (stats.requested > 0) {
              setStatusFilter("REQUESTED");
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
              승인 대기
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.requested}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              승인 완료
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
              <XCircle className="w-3.5 h-3.5" />
              반려됨
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card
          className={`touch-manipulation transition-all ${
            stats.completed > 0
              ? "cursor-pointer active:scale-[0.98] border-purple-200 bg-purple-50/50"
              : ""
          }`}
          onClick={() => {
            if (stats.completed > 0) {
              setStatusFilter("COMPLETED");
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              체크인
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="예약번호, 회사명, 방문자명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 min-h-[44px] px-3 py-2 border border-input rounded-md bg-background text-base touch-manipulation"
            >
              <option value="전체">전체 상태</option>
              <option value="REQUESTED">대기중</option>
              <option value="APPROVED">승인됨</option>
              <option value="REJECTED">반려됨</option>
              <option value="COMPLETED">완료</option>
              <option value="CANCELLED">취소됨</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 예약 목록 테이블 */}
      {loading ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "전체"
                  ? "검색 조건에 맞는 예약이 없습니다."
                  : "방문 예약이 없습니다."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>방문 예약 현황</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">NO</TableHead>
                    <TableHead>예약번호</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>소속회사</TableHead>
                    <TableHead>방문자명</TableHead>
                    <TableHead>방문기간</TableHead>
                    <TableHead>방문목적</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>체크인 시간</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request, index) => (
                    <TableRow key={request.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {request.reservation_number}
                      </TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell>{request.company}</TableCell>
                      <TableCell>
                        {formatVisitorNames(request.visitor_info)}
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
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          {request.checked_in_at && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" title="체크인 완료" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.checked_in_at ? (
                          <span className="text-sm text-green-600 font-medium">
                            {formatDateTime(request.checked_in_at)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setDetailDialogOpen(true);
                            }}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            상세
                          </Button>
                          {request.status === "REQUESTED" && (
                            <Button
                              size="sm"
                              onClick={() => navigate(`/admin/approval?id=${request.id}`)}
                              className="gap-1"
                            >
                              <FileEdit className="w-4 h-4" />
                              승인처리
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredRequests.map((request, index) => (
                <Card
                  key={request.id}
                  className="border overflow-hidden"
                  onClick={() => {
                    setSelectedRequest(request);
                    setDetailDialogOpen(true);
                  }}
                >
                  <CardContent className="p-0">
                    {/* Header with status */}
                    <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        {getStatusBadge(request.status)}
                        {request.checked_in_at && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" title="체크인 완료" />
                        )}
                      </div>
                      <span className="font-mono text-sm font-medium text-muted-foreground">
                        {request.reservation_number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-base">{request.company}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {formatVisitorNames(request.visitor_info)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">방문기간</span>
                          <p className="font-medium">
                            {formatDate(request.visit_date)}
                            {request.end_date && (
                              <>
                                <br />
                                ~ {formatDate(request.end_date)}
                              </>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">방문목적</span>
                          <p className="font-medium">{request.purpose}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">담당자</span>
                          <p className="font-medium">{request.manager_name || "-"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">체크인</span>
                          {request.checked_in_at ? (
                            <p className="text-green-600 font-medium text-xs">
                              {formatDateTime(request.checked_in_at)}
                            </p>
                          ) : (
                            <p className="text-muted-foreground">-</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex border-t divide-x">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setDetailDialogOpen(true);
                        }}
                        className="flex-1 py-3 px-4 text-sm font-medium text-center hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation"
                      >
                        <Eye className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                        상세보기
                      </button>
                      {request.status === "REQUESTED" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/approval?id=${request.id}`);
                          }}
                          className="flex-1 py-3 px-4 text-sm font-medium text-center text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors touch-manipulation"
                        >
                          <FileEdit className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                          승인처리
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 상세보기 다이얼로그 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>방문 예약 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      예약번호
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold">
                        {selectedRequest.reservation_number}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedRequest.reservation_number);
                          toast({
                            title: "복사 완료",
                            description: "예약번호가 클립보드에 복사되었습니다.",
                          });
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      상태
                    </p>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      소속회사
                    </p>
                    <p>{selectedRequest.company || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      부서
                    </p>
                    <p>{selectedRequest.department || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      방문 목적
                    </p>
                    <p>{selectedRequest.purpose || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      담당자
                    </p>
                    <p>{selectedRequest.manager_name || "-"}</p>
                    {selectedRequest.manager_phone && (
                      <p className="text-sm text-muted-foreground">{selectedRequest.manager_phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      방문 기간
                    </p>
                    <p>
                      {formatDate(selectedRequest.visit_date)}
                      {selectedRequest.end_date && ` ~ ${formatDate(selectedRequest.end_date)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      신청일
                    </p>
                    <p>{formatDate(selectedRequest.created_at)}</p>
                  </div>
                  {selectedRequest.checked_in_at && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        체크인 시간
                      </p>
                      <p className="text-green-600 font-medium">
                        {formatDateTime(selectedRequest.checked_in_at)}
                      </p>
                    </div>
                  )}
                </div>

                {/* 방문자 정보 */}
                {selectedRequest.visitor_info && selectedRequest.visitor_info.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      방문자 정보 ({selectedRequest.visitor_info.length}명)
                    </p>
                    <div className="space-y-2">
                      {selectedRequest.visitor_info.map((visitor, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">이름</p>
                              <p className="font-medium">{visitor.visitor_name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">연락처</p>
                              <p>{visitor.visitor_phone}</p>
                            </div>
                            {visitor.car_number && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">차량번호</p>
                                <p>{visitor.car_number}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QR 코드 및 승인 버튼 */}
                <div className="border-t pt-4 flex flex-wrap gap-2">
                  {selectedRequest.status === "APPROVED" && selectedRequest.qr_code_url && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.open(selectedRequest.qr_code_url!, "_blank");
                      }}
                      className="gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      QR 코드 보기
                    </Button>
                  )}
                  {selectedRequest.status === "REQUESTED" && (
                    <Button
                      onClick={() => {
                        setDetailDialogOpen(false);
                        navigate(`/admin/approval?id=${selectedRequest.id}`);
                      }}
                      className="gap-2"
                    >
                      <FileEdit className="w-4 h-4" />
                      승인/반려 처리
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

