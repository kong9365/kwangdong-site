import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitData, Checklist } from "@/types/visitor";

interface ProgressPageProps {
  visit: VisitData;
  checklist: Checklist;
}

export function ProgressPage({ visit, checklist }: ProgressPageProps) {
  // 체크리스트 완료 여부 확인
  const isChecklistComplete = checklist.security && checklist.safety && checklist.privacy && checklist.upload;

  // 상태에 따른 진행 단계 계산
  const calculateActiveStepIndex = (): number => {
    const status = visit.status?.toUpperCase();

    // 완료 또는 진행중 상태
    if (status === "COMPLETED" || status === "IN_PROGRESS") {
      return 4; // 방문 확정
    }

    // 승인된 상태
    if (status === "APPROVED") {
      if (isChecklistComplete) {
        return 3; // 교육/보안 동의 완료
      }
      return 2; // 방문자 정보 입력 단계
    }

    // 요청 상태
    if (status === "REQUESTED") {
      return 0; // 방문 요청 단계
    }

    // 거부 또는 취소 상태
    if (status === "REJECTED" || status === "CANCELLED") {
      return 0;
    }

    return 0; // 기본값
  };

  const activeStepIndex = calculateActiveStepIndex();

  const steps = [
    "1) 방문 요청",
    "2) 내부 승인",
    "3) 방문자 정보 입력",
    "4) 교육/보안 동의 완료",
    "5) 방문 확정",
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>방문 진행 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  index <= activeStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <span>●</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            현재 단계는{" "}
            <span className="font-semibold text-foreground">
              {steps[activeStepIndex]}
            </span>{" "}
            입니다.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>방문 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">방문 일시</div>
              <div className="text-sm">{visit.visitDate}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">방문 목적</div>
              <div className="text-sm">{visit.purpose}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">방문 부서</div>
              <div className="text-sm">
                {visit.company} · {visit.department}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">요청자</div>
              <div className="text-sm">
                {visit.requesterName} ({visit.requesterPhone})
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>체크리스트 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">보안 서약</div>
              <div className={`text-sm ${checklist.security ? "text-success" : "text-muted-foreground"}`}>
                {checklist.security ? "완료" : "미완료"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">안전 교육</div>
              <div className={`text-sm ${checklist.safety ? "text-success" : "text-muted-foreground"}`}>
                {checklist.safety ? "완료" : "미완료"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">개인정보 동의</div>
              <div className={`text-sm ${checklist.privacy ? "text-success" : "text-muted-foreground"}`}>
                {checklist.privacy ? "완료" : "미완료"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">자료 업로드</div>
              <div className={`text-sm ${checklist.upload ? "text-success" : "text-muted-foreground"}`}>
                {checklist.upload ? "완료" : "미완료"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
