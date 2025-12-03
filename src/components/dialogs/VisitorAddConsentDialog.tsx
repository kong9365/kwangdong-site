import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface VisitorAddConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function VisitorAddConsentDialog({
  open,
  onOpenChange,
  onConfirm,
}: VisitorAddConsentDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-lg w-[95vw] sm:w-full max-h-[90vh] p-0"
        onInteractOutside={(e) => {
          // 배경 클릭 시 닫히지 않도록 방지
          e.preventDefault();
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-primary-foreground">
              알림
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-primary-foreground hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                원칙적으로 개인정보는 그 개인정보를 보유하고 있는 당사자가 직접 제공해야 합니다.
              </p>
              
              <p>
                방문자를 추가하고자 하는 자(이하 '본인')는 아래의 사항들을 모두 충족한 후에 방문예약사이트에 타인의 개인정보를 기재하여야 하고, 위 타인 대신 각 항목에 동의하여야 합니다.
              </p>

              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-primary mt-0.5">1.</span>
                  <p>본인은 타인이 본인과 함께 방문예약을 할 의사가 있음을 확인함</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-primary mt-0.5">2.</span>
                  <p>본인은 타인에게 방문예약사이트에 타인의 개인정보가 입력되어야 함을 설명하였고, 타인이 개인정보 제공에 동의함</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-semibold text-primary mt-0.5">3.</span>
                  <p>본인은 타인으로부터 동의서에 동의하는 권한을 부여받았음을 확인함</p>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground">
                만약 동의를 거부하시거나, 위 조건에 대해 동의하지 않으신다면 방문예약이 불가능할 수 있습니다.
              </p>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <Button 
              onClick={handleConfirm} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

