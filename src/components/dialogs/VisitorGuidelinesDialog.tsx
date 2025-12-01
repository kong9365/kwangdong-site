import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VisitorGuidelinesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitorGuidelinesDialog({
  open,
  onOpenChange,
}: VisitorGuidelinesDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent 
        className="max-w-md max-h-[90vh] p-0 left-[5%] translate-x-0 z-[60]"
        onInteractOutside={(e) => {
          // 배경 클릭 시 닫히지 않도록 방지
          e.preventDefault();
        }}
      >
        <div className="flex flex-col h-full">
          <div className="border-b p-4 bg-primary text-primary-foreground">
            <h2 className="text-xl font-bold text-center">방문자 준수사항</h2>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 text-sm leading-relaxed">
              {/* 안내 사항 */}
              <div>
                <h4 className="text-base font-semibold mb-4 text-foreground">안내 사항</h4>
                <ul className="space-y-3 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>담당 직원의 승인 후 문자메세지로 QR코드를 안내 드리겠습니다.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>광동제약 공장 방문 시 외빈께서는 정문 경비실에서 QR인증 절차를 반드시 진행해주시길 바랍니다.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>교부해드리는 임시출입증은 반드시 반납해주시길 바랍니다.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>광동제약 사업장은 화학물질관리법을 준수하며, 동법 56조 및 시행규칙 50조에 의거 모든 출입자는 출입 기록을 남겨야만 합니다.</p>
                  </li>
                </ul>
              </div>

              {/* 방문자 공통 준수사항 */}
              <div>
                <h4 className="text-base font-semibold mb-4 text-foreground">방문자 공통 준수사항</h4>
                <ul className="space-y-3 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>공장의 모든 구역은 의약품 제조/품질관리 기준(GMP) 및 식품안전관리 기준(HACCP)에 의해 엄격하게 관리되고 있습니다. 직원 동행 없이 방문구역 이외 지역에 무단으로 출입해서는 안됩니다.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>사진 및 동영상 임의 촬영을 금하며, 습득한 자료의 반출을 금합니다.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <p>현장의 설비나 자재, 원료 등을 허가 없이 접촉해서는 안됩니다.</p>
                  </li>
                </ul>
              </div>

              {/* 주차장 안내 이미지 영역 */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-center mb-3">
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-semibold">
                    주차장
                  </span>
                </div>
                <div className="bg-white rounded p-3 mb-3">
                  {/* 주차장 다이어그램 텍스트 표현 */}
                  <div className="text-center space-y-2 text-xs">
                    <div className="flex justify-around items-center">
                      <div className="bg-green-100 px-3 py-2 rounded">물류관리동</div>
                      <div className="bg-blue-100 px-3 py-2 rounded">주차장</div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-red-100 px-4 py-2 rounded">← 출입관리소</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-100 px-3 py-2 rounded text-center">1공장</div>
                      <div className="bg-gray-100 px-3 py-2 rounded text-center">2공장</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 주차 및 출입관련 문의 */}
              <div className="space-y-2">
                <p className="text-xs">
                  * 주차 및 출입관련 문의 : 종무팀구제 (031-8053-1148)
                </p>
                <p className="text-xs">
                  - 평택사업장 내 모든 도로에서는 <span className="text-red-600 font-semibold">30km/h 이하로 서행</span>해주시기 바랍니다.
                </p>
                <p className="text-xs">
                  - 임산부전용구역에 임산부 외 주차를 절대 금지합니다.
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
