import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressPage } from "@/components/visitor/ProgressPage";
import { VisitorInfoPage } from "@/components/visitor/VisitorInfoPage";
import { ChecklistPage } from "@/components/visitor/ChecklistPage";
import { AdminPage } from "@/components/visitor/AdminPage";
import { VisitData, VisitorForm, Checklist, VisitRequest } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";
import kwangdongLogo from "@/assets/kwangdong-primary-signature.png";

const PAGES = {
  PROGRESS: "PROGRESS",
  VISITOR_INFO: "VISITOR_INFO",
  CHECKLIST: "CHECKLIST",
  ADMIN: "ADMIN",
} as const;

type PageType = (typeof PAGES)[keyof typeof PAGES];

const initialVisitData: VisitData = {
  id: 1,
  company: "광동제약",
  department: "품질관리팀",
  purpose: "기술 교류 및 QC 디지털 전환 미팅",
  visitDate: "2025-01-12 14:00",
  requesterName: "박재홍",
  requesterPhone: "010-0000-0000",
  status: "IN_PROGRESS",
};

const Index = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<PageType>(PAGES.PROGRESS);

  const [visitorForm, setVisitorForm] = useState<VisitorForm>({
    name: "",
    phone: "",
    email: "",
    carNumber: "",
    idFileName: "",
  });

  const [checklist, setChecklist] = useState<Checklist>({
    security: false,
    safety: false,
    privacy: false,
    upload: false,
  });

  const [requestList, setRequestList] = useState<VisitRequest[]>([
    {
      id: 1,
      visitorName: "김철수",
      purpose: "기술 미팅",
      date: "2025-01-12 14:00",
      status: "WAIT",
    },
    {
      id: 2,
      visitorName: "이영희",
      purpose: "공장 견학",
      date: "2025-01-20 10:00",
      status: "APPROVED",
    },
  ]);

  const [selectedRequestId, setSelectedRequestId] = useState(1);
  const selectedRequest = requestList.find((r) => r.id === selectedRequestId);

  const handleVisitorChange = (field: keyof VisitorForm, value: string) => {
    setVisitorForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChecklistChange = (field: keyof Checklist) => {
    setChecklist((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleMockSubmitVisitor = () => {
    toast({
      title: "방문자 정보 저장",
      description: `${visitorForm.name}님의 정보가 임시로 저장되었습니다.`,
    });
  };

  const handleMockChecklistSubmit = () => {
    if (!checklist.security || !checklist.safety || !checklist.privacy) {
      toast({
        title: "필수 항목 미완료",
        description: "보안 서약, 안전 교육, 개인정보 동의 항목은 필수입니다.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "체크리스트 완료",
      description: "체크리스트 정보가 임시로 저장되었습니다.",
    });
  };

  const handleAdminAction = (action: "APPROVE" | "REJECT") => {
    if (!selectedRequest) return;
    
    setRequestList((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: action === "APPROVE" ? "APPROVED" : "REJECTED",
            }
          : r
      )
    );

    toast({
      title: action === "APPROVE" ? "승인 완료" : "반려 완료",
      description: `${selectedRequest.visitorName}님의 방문 요청이 ${
        action === "APPROVE" ? "승인" : "반려"
      }되었습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <header className="bg-card rounded-xl shadow-sm p-4 sm:p-5 mb-4 border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex-shrink-0">
                <img 
                  src={kwangdongLogo} 
                  alt="광동제약" 
                  className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary">
                  Kwangdong 방문 관리 시스템
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  방문 일정·방문자 정보·체크리스트·승인 현황을 한 화면에서 관리
                </p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-right">
              <div className="font-medium">품질관리팀 · 관리자 계정</div>
              <div className="text-muted-foreground text-xs">
                로그인 사용자: 박재홍 팀장
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={currentPage === PAGES.PROGRESS ? "default" : "outline"}
            onClick={() => setCurrentPage(PAGES.PROGRESS)}
            className="rounded-full"
          >
            방문 진행 조회
          </Button>
          <Button
            variant={currentPage === PAGES.VISITOR_INFO ? "default" : "outline"}
            onClick={() => setCurrentPage(PAGES.VISITOR_INFO)}
            className="rounded-full"
          >
            방문자 정보 입력
          </Button>
          <Button
            variant={currentPage === PAGES.CHECKLIST ? "default" : "outline"}
            onClick={() => setCurrentPage(PAGES.CHECKLIST)}
            className="rounded-full"
          >
            체크리스트
          </Button>
          <Button
            variant={currentPage === PAGES.ADMIN ? "default" : "outline"}
            onClick={() => setCurrentPage(PAGES.ADMIN)}
            className="rounded-full"
          >
            관리자 승인
          </Button>
        </nav>

        {/* Page Content */}
        {currentPage === PAGES.PROGRESS && (
          <ProgressPage visit={initialVisitData} checklist={checklist} />
        )}
        {currentPage === PAGES.VISITOR_INFO && (
          <VisitorInfoPage
            form={visitorForm}
            onChange={handleVisitorChange}
            onSubmit={handleMockSubmitVisitor}
          />
        )}
        {currentPage === PAGES.CHECKLIST && (
          <ChecklistPage
            checklist={checklist}
            onToggle={handleChecklistChange}
            onSubmit={handleMockChecklistSubmit}
          />
        )}
        {currentPage === PAGES.ADMIN && (
          <AdminPage
            requestList={requestList}
            selectedRequest={selectedRequest}
            onSelectRequest={setSelectedRequestId}
            onAction={handleAdminAction}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
