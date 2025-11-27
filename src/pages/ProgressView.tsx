import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

// Mock data
const MOCK_VISIT = {
  id: "VR-2025-001",
  company: "광동제약",
  department: "연구개발부",
  purpose: "회의",
  visitDate: "2025년 1월 15일 14:00",
  requesterName: "김철수",
  requesterPhone: "010-1234-5678",
  status: "IN_PROGRESS",
  currentStep: 3,
};

const MOCK_CHECKLIST = {
  security: true,
  safety: true,
  privacy: false,
  upload: false,
};

const STEPS = [
  "1) 방문 요청",
  "2) 내부 승인",
  "3) 방문자 정보 입력",
  "4) 교육/보안 동의 완료",
  "5) 방문 확정",
];

export default function ProgressView() {
  const activeStepIndex = MOCK_VISIT.currentStep - 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Badge variant="secondary">예약번호: {MOCK_VISIT.id}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      방문 일시
                    </div>
                    <div className="font-medium">{MOCK_VISIT.visitDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      방문 목적
                    </div>
                    <div className="font-medium">{MOCK_VISIT.purpose}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      방문 부서
                    </div>
                    <div className="font-medium">
                      {MOCK_VISIT.company} · {MOCK_VISIT.department}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      요청자
                    </div>
                    <div className="font-medium">
                      {MOCK_VISIT.requesterName} ({MOCK_VISIT.requesterPhone})
                    </div>
                  </div>
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
                    {MOCK_CHECKLIST.security ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="text-sm font-medium">보안 서약</div>
                      <div
                        className={`text-sm ${
                          MOCK_CHECKLIST.security
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {MOCK_CHECKLIST.security ? "완료" : "미완료"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    {MOCK_CHECKLIST.safety ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="text-sm font-medium">안전 교육</div>
                      <div
                        className={`text-sm ${
                          MOCK_CHECKLIST.safety
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {MOCK_CHECKLIST.safety ? "완료" : "미완료"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    {MOCK_CHECKLIST.privacy ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="text-sm font-medium">개인정보 동의</div>
                      <div
                        className={`text-sm ${
                          MOCK_CHECKLIST.privacy
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {MOCK_CHECKLIST.privacy ? "완료" : "미완료"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    {MOCK_CHECKLIST.upload ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="text-sm font-medium">자료 업로드</div>
                      <div
                        className={`text-sm ${
                          MOCK_CHECKLIST.upload
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {MOCK_CHECKLIST.upload ? "완료" : "미완료"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
