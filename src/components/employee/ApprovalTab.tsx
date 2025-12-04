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
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Loader2,
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
  visitor_info?: Array<{
    visitor_name: string;
    visitor_phone: string;
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 예약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card 
          className={stats.requested > 0 ? "cursor-pointer hover:shadow-md transition-shadow border-blue-200" : ""}
          onClick={() => {
            if (stats.requested > 0) {
              setStatusFilter("REQUESTED");
            }
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              승인 대기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.requested}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              승인 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              반려됨
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
        <Card 
          className={stats.completed > 0 ? "cursor-pointer hover:shadow-md transition-shadow border-purple-200" : ""}
          onClick={() => {
            if (stats.completed > 0) {
              setStatusFilter("COMPLETED");
            }
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              체크인 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="예약번호, 회사명, 부서명, 방문자명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="전체">전체</option>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/approval?id=${request.id}`)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {request.status === "REQUESTED" ? "승인하기" : "상세보기"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredRequests.map((request, index) => (
                <Card key={request.id} className="border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          {request.checked_in_at && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" title="체크인 완료" />
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/approval?id=${request.id}`)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {request.status === "REQUESTED" ? "승인" : "상세"}
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">예약번호: </span>
                        <span className="font-mono font-medium">{request.reservation_number}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">신청일: </span>
                        <span>{formatDate(request.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">소속회사: </span>
                        <span>{request.company}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">방문자명: </span>
                        <span>{formatVisitorNames(request.visitor_info)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">방문기간: </span>
                        <span>
                          {formatDate(request.visit_date)}
                          {request.end_date && ` ~ ${formatDate(request.end_date)}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">방문목적: </span>
                        <span>{request.purpose}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">담당자: </span>
                        <span>{request.manager_name || "-"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">체크인 시간: </span>
                        {request.checked_in_at ? (
                          <span className="text-green-600 font-medium">
                            {formatDateTime(request.checked_in_at)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

