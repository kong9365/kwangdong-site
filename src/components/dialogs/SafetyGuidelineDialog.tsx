import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SafetyGuidelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SafetyGuidelineDialog({
  open,
  onOpenChange,
}: SafetyGuidelineDialogProps) {
  const [agreed, setAgreed] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setAgreed(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="max-w-[650px] w-[96vw] sm:w-[650px] max-h-[90vh] p-0 left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%] z-[70] [&>button]:hidden"
        onInteractOutside={(e) => {
          // 배경 클릭 시 닫히지 않도록 방지
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // ESC 키로 닫히지 않도록 방지
          e.preventDefault();
        }}
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          <ScrollArea className="flex-1">
            <div className="max-w-[650px] mx-auto">
              {/* ESG 섹션 */}
              <div className="border-[3px] border-primary border-b-0 py-[35px] px-[45px] bg-white">
                <h1 className="text-[28px] font-bold text-primary mb-[22px] leading-[1.4]">
                  더 나은 내일, 지속가능한 미래를<br/>만들어 나가겠습니다.
                </h1>
                
                <div className="text-[14.5px] leading-[1.8] mb-4 text-justify text-foreground">
                  광동제약은 <strong>『건강을 위한 혁신, 지속가능한 미래』</strong>라는 비전을 바탕으로, ESG 원칙을 준수하고 있습니다. 우리는 지속 가능한 혁신적인 제품과 서비스를 창출하며, 모든 이해관계자와 함께 미래를 만들어 나가겠습니다.
                </div>
                
                <div className="text-[14.5px] leading-[1.8] mb-4 text-justify text-foreground">
                  건강을 위한 혁신을 통해 고품질 제품을 제공하고, 지속 가능한 미래를 위해 기후변화에 대응하는 친환경 경영을 실천하며, 사회적 책임을 다하는 기업으로서 지역사회와의 협력과 다양한 사회공헌 활동을 통해 사회적 가치를 창출하고 공정한 사업 환경을 위해 공급망 관리를 통한 상생경영을 실천하겠습니다.
                </div>
                
                <div className="text-[14.5px] leading-[1.8] mb-4 text-justify text-foreground">
                  광동제약은 지속가능한 경영을 통해 더 나은 내일을 위한 초석을 다지며, 모두의 건강한 미래를 향해 나아가겠습니다.
                </div>
              </div>

              {/* 안전보건 섹션 */}
              <div className="border-[3px] border-primary border-t-0 py-[35px] px-[45px] bg-white">
                <h1 className="text-[28px] font-bold text-primary mb-[22px] leading-[1.4]">
                  안전보건경영 방침
                </h1>
                
                <div className="text-[14.5px] leading-[1.8] mb-4 text-justify text-foreground">
                  광동제약(주)은 인간존중의 철학과 고객의 건강한 삶에 기여한다는 경영이념에 따라 안전·보건 관리가 지속가능경영의 필수요소임을 인식하고, 모든 임직원이 안전하고 쾌적한 근무환경을 누릴 수 있도록 다음과 같은 안전보건활동을 지속한다.
                </div>
                
                <div className="mt-5">
                  {[
                    "모든 활동영역에서 안전보건을 최우선 가치로 인식하고, 안전보건 경영체계를 확립한다.",
                    "안전보건 관련 법과 규정 및 기타 요구사항을 준수한다.",
                    "사업장 유해위험요인을 제거하고, 지속적 예방활동을 통해 안전한 근무환경을 구축한다.",
                    "모든 구성원이 안전보건활동에 대한 책임자임을 인식하며, 체계적 교육·훈련을 통해 성숙한 안전문화 정착을 추구한다.",
                    "당사와의 협력관계에 있는 모든 공급자와 계약자가 상호존중을 바탕으로 안전보건협력 체계를 유지한다.",
                  ].map((text, index) => (
                    <div key={index} className="mb-[14px] pl-7 relative text-[14px] leading-[1.7] text-foreground">
                      <div className="absolute left-0 top-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-7 text-right text-[15px] font-semibold text-foreground">
                  광동제약㈜ 대표이사 회장 최 성 원
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4 bg-muted/50">
            <div className="flex items-center justify-center gap-3">
              <Checkbox
                id="safety-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="h-5 w-5"
              />
              <label 
                htmlFor="safety-agree" 
                className={`text-sm sm:text-base font-medium ${agreed ? "text-foreground" : "text-foreground/80"}`}
              >
                상기 안전보건경영 방침을 확인하였으며, 방문신청 약관에 동의합니다.
              </label>
            </div>
          </div>

          <div className="border-t p-6">
            <Button 
              onClick={handleClose} 
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
              disabled={!agreed}
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
