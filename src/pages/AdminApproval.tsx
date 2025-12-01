import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  approveVisitRequest,
  rejectVisitRequest,
  sendSMSNotification,
} from "@/lib/api";
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
  end_date?: string;
  status: string;
  visitor_info?: Array<{
    visitor_name: string;
    visitor_phone: string;
  }>;
}

export default function AdminApproval() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VisitRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("REQUESTED");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVisitRequests();
  }, []);

  // URL 파라미터로 예약 ID가 있으면 자동 선택
  useEffect(() => {
    const requestId = searchParams.get("id");
    if (requestId && visitRequests.length > 0) {
      const request = visitRequests.find((r) => r.id === requestId);
      if (request) {
        setSelectedRequest(request);
        setDetailDialogOpen(true);
        // URL에서 id 파라미터 제거
        navigate("/admin/approval", { replace: true });
      }
    }
  }, [visitRequests, searchParams, navigate]);

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
      setVisitRequests(data || []);
      setFilteredRequests(data || []);
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
          req.purpose.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = async (request: VisitRequest) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          variant: "destructive",
        });
        return;
      }

      await approveVisitRequest(request.id, user.id);

      // 승인 완료 문자 전송
      if (request.visitor_info && request.visitor_info.length > 0) {
        const phone = request.visitor_info[0].visitor_phone;
        const message = `[광동제약] 방문예약이 승인되었습니다. 예약번호: ${request.reservation_number}. 방문일: ${format(new Date(request.visit_date), "yyyy년 M월 d일", { locale: ko })}`;

        try {
          await sendSMSNotification(request.id, phone, message);
        } catch (smsError) {
          console.error("문자 전송 오류:", smsError);
          // 문자 전송 실패해도 승인은 완료
        }
      }

      toast({
        title: "승인 완료",
        description: "방문 요청이 승인되었습니다.",
      });

      await loadVisitRequests();
      setSelectedRequest(null);
      setDetailDialogOpen(false);
    } catch (error: any) {
      console.error("승인 오류:", error);
      toast({
        title: "승인 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) {
      toast({
        title: "반려 사유를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          variant: "destructive",
        });
        return;
      }

      await rejectVisitRequest(selectedRequest.id, user.id, rejectReason);

      // 반려 완료 문자 전송
      if (
        selectedRequest.visitor_info &&
        selectedRequest.visitor_info.length > 0
      ) {
        const phone = selectedRequest.visitor_info[0].visitor_phone;
        const message = `[광동제약] 방문예약이 반려되었습니다. 예약번호: ${selectedRequest.reservation_number}. 사유: ${rejectReason}`;

        try {
          await sendSMSNotification(
            selectedRequest.id,
            phone,
            message
          );
        } catch (smsError) {
          console.error("문자 전송 오류:", smsError);
        }
      }

      toast({
        title: "반려 완료",
        description: "방문 요청이 반려되었습니다.",
      });

      await loadVisitRequests();
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
      setDetailDialogOpen(false);
    } catch (error: any) {
      console.error("반려 오류:", error);
      toast({
        title: "반려 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      REQUESTED: "secondary",
      APPROVED: "default",
      REJECTED: "destructive",
      IN_PROGRESS: "default",
      COMPLETED: "default",
      CANCELLED: "destructive",
    };

    const labels: Record<string, string> = {
      REQUESTED: "대기중",
      APPROVED: "승인됨",
      REJECTED: "반려됨",
      IN_PROGRESS: "진행중",
      COMPLETED: "완료",
      CANCELLED: "취소됨",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/employee")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                임직원모드로 돌아가기
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">관리자 승인</h1>
            <p className="text-muted-foreground">
              방문 예약 요청을 승인하거나 반려할 수 있습니다.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="예약번호, 회사명, 부서명으로 검색..."
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
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="COMPLETED">완료</option>
                  <option value="CANCELLED">취소됨</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Visit Requests List */}
          {loading ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-muted-foreground">
                  로딩 중...
                </div>
              </CardContent>
            </Card>
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    방문 요청이 없습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedRequest(request);
                    setDetailDialogOpen(true);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {request.company} · {request.department}
                          </CardTitle>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>예약번호: {request.reservation_number}</p>
                          <p>
                            방문일:{" "}
                            {format(
                              new Date(request.visit_date),
                              "yyyy년 M월 d일",
                              { locale: ko }
                            )}
                            {request.end_date &&
                              ` ~ ${format(
                                new Date(request.end_date),
                                "yyyy년 M월 d일",
                                { locale: ko }
                              )}`}
                          </p>
                          <p>목적: {request.purpose}</p>
                          {request.visitor_info &&
                            request.visitor_info.length > 0 && (
                              <p>
                                방문자: {request.visitor_info[0].visitor_name} (
                                {request.visitor_info[0].visitor_phone})
                              </p>
                            )}
                        </div>
                      </div>
                      {request.status === "REQUESTED" && (
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request)}
                            className="gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedRequest(request);
                              setRejectDialogOpen(true);
                            }}
                            className="gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            반려
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Detail Dialog */}
          <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>방문 예약 상세 정보</DialogTitle>
              </DialogHeader>
              {selectedRequest && (
                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        예약번호
                      </p>
                      <p className="font-mono font-semibold">
                        {selectedRequest.reservation_number}
                      </p>
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
                      <p>{selectedRequest.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        부서
                      </p>
                      <p>{selectedRequest.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        방문일
                      </p>
                      <p>
                        {format(
                          new Date(selectedRequest.visit_date),
                          "yyyy년 M월 d일",
                          { locale: ko }
                        )}
                        {selectedRequest.end_date &&
                          ` ~ ${format(
                            new Date(selectedRequest.end_date),
                            "yyyy년 M월 d일",
                            { locale: ko }
                          )}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        방문목적
                      </p>
                      <p>{selectedRequest.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        신청일
                      </p>
                      <p>
                        {format(
                          new Date(selectedRequest.created_at || new Date()),
                          "yyyy년 M월 d일 HH:mm",
                          { locale: ko }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* 방문자 정보 */}
                  {selectedRequest.visitor_info &&
                    selectedRequest.visitor_info.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          방문자 정보
                        </p>
                        <div className="space-y-2">
                          {selectedRequest.visitor_info.map((visitor, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-muted rounded-md"
                            >
                              <p className="font-medium">{visitor.visitor_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {visitor.visitor_phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 승인/반려 버튼 */}
                  {selectedRequest.status === "REQUESTED" && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleApprove(selectedRequest)}
                        className="flex-1 gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        승인
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setDetailDialogOpen(false);
                          setRejectDialogOpen(true);
                        }}
                        className="flex-1 gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        반려
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Reject Dialog */}
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>방문 요청 반려</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  반려 사유를 입력해주세요.
                </p>
                <Textarea
                  placeholder="반려 사유를 입력하세요..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRejectDialogOpen(false);
                    setRejectReason("");
                    setDetailDialogOpen(true);
                  }}
                >
                  취소
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  반려
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}