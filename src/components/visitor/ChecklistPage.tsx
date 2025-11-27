import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Checklist } from "@/types/visitor";

interface ChecklistPageProps {
  checklist: Checklist;
  onToggle: (field: keyof Checklist) => void;
  onSubmit: () => void;
}

export function ChecklistPage({ checklist, onToggle, onSubmit }: ChecklistPageProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>체크리스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">1. 보안 서약</h3>
            <p className="text-xs text-muted-foreground mb-3">
              광동제약 방문 시 회사 내부 정보 및 설비, 시스템에 대해 촬영·복제·외부 공유를 하지 않을 것을 서약합니다.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="security"
                checked={checklist.security}
                onCheckedChange={() => onToggle("security")}
              />
              <label
                htmlFor="security"
                className="text-sm cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                보안 서약에 동의합니다.
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">2. 안전 교육</h3>
            <p className="text-xs text-muted-foreground mb-3">
              사전에 제공된 안전 수칙 안내(영상/자료)를 숙지하였으며, 시험실·생산시설 내 안내 사항을 준수하겠습니다.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="safety"
                checked={checklist.safety}
                onCheckedChange={() => onToggle("safety")}
              />
              <label
                htmlFor="safety"
                className="text-sm cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                안전 교육 내용을 숙지하였습니다.
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">3. 개인정보 제공 동의</h3>
            <p className="text-xs text-muted-foreground mb-3">
              방문 기록 관리 및 보안 관리를 위해 방문자의 성명, 연락처 등 개인정보를 수집·이용하는 것에 동의합니다.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="privacy"
                checked={checklist.privacy}
                onCheckedChange={() => onToggle("privacy")}
              />
              <label
                htmlFor="privacy"
                className="text-sm cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                개인정보 제공에 동의합니다.
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">4. 관련 자료 제출</h3>
            <p className="text-xs text-muted-foreground mb-3">
              사전에 안내된 필요 자료(계약서 초안, 교육 이수증 등)를 담당자에게 제출하겠습니다.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="upload"
                checked={checklist.upload}
                onCheckedChange={() => onToggle("upload")}
              />
              <label
                htmlFor="upload"
                className="text-sm cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                필요 자료 제출을 완료했습니다.
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSubmit}>체크리스트 완료 처리</Button>
      </div>
    </div>
  );
}
