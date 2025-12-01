import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import safetySlide1 from "@/assets/safety-guidelines/safety-slide-1.png";

interface SafetyGuidelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAFETY_SLIDES = [
  { type: "image" as const, content: safetySlide1 },
  { type: "text" as const, content: null },
];

export function SafetyGuidelineDialog({
  open,
  onOpenChange,
}: SafetyGuidelineDialogProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(new Set([0]));

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const prevSlide = prev > 0 ? prev - 1 : SAFETY_SLIDES.length - 1;
      setVisitedSlides((visited) => new Set(visited).add(prevSlide));
      return prevSlide;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => {
      const nextSlide = prev < SAFETY_SLIDES.length - 1 ? prev + 1 : 0;
      setVisitedSlides((visited) => new Set(visited).add(nextSlide));
      return nextSlide;
    });
  };

  // 모든 슬라이드를 방문했는지 확인
  const viewedAllSlides = visitedSlides.size === SAFETY_SLIDES.length;

  const handleClose = () => {
    onOpenChange(false);
    setCurrentSlide(0);
    setAgreed(false);
    setVisitedSlides(new Set([0]));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-2xl w-[90vw] sm:w-[700px] max-h-[85vh] p-0 left-auto right-[5%] sm:right-[15%] translate-x-0 z-[70]">
        <div className="flex flex-col h-full max-h-[85vh]">
          <div className="border-b p-4 bg-primary text-primary-foreground">
            <h2 className="text-xl font-bold text-center">안전보건지침</h2>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Slider */}
              <div className="relative">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                  {SAFETY_SLIDES[currentSlide].type === "image" ? (
                    <div className="flex items-center justify-center w-full min-h-[50vh]">
                      <img
                        src={SAFETY_SLIDES[currentSlide].content}
                        alt={`안전보건지침 ${currentSlide + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="border border-border rounded-lg p-6 bg-background">
                        <h3 className="text-xl font-bold mb-6 text-center text-primary">
                          환경안전보건 경영방침
                        </h3>
                        
                        <div className="space-y-4 text-sm leading-relaxed">
                          <p>
                            광동제약은 인간존중, 가치창조라는 경영이념 아래 사람을 먼저 생각하기 위한 실천적 실행과 화합, 담대함의 핵심가치의 영향력 지속성을 위해 최고경영자의 환경안전관리 의지를 경영 주요방침으로 합니다.
                          </p>
                          
                          <p>
                            광동제약은 국내외 환경전문 인력과 외부전문 생산지원 기업을 활용하여 고객과의 신뢰에서 중점 임직원 방문자가 기술지속 및 식별하기 위해 근대역전 환경안전관리체계를 구축도로 도지 구축하도록 합니다.
                          </p>
                          
                          <p>
                            근대역전 환경안전관리체계를 구축도로 도지 구축하도록 합니다. 안기니초조직의 안심의 담건자는 사업 등새 특특의 소저이 와는 집단일 예시이되는 광동제약의 모든 임직원은 환경안전관련 결정반한 단면 모발로 수용합니다.
                          </p>

                          <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="font-bold text-primary text-base mt-0.5">1.</span>
                              <p>
                                국내외 환경 보건 안전 관련 법규를 준수하며 법적 안정성을 확보하고, 더 나아가 사회인준대데 발전 및 사회적 책임을 다하는 선도적인 기업이 되도록 지식를 다한다.
                              </p>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <span className="font-bold text-primary text-base mt-0.5">2.</span>
                              <p>
                                사전 위험성를 체계적으로 개선하으로 분석하 형완하고, 일원전 있는 안전 방성발플를 지속이어 사업방전 리스크가 제거돈 인한 근무 환경를 조성하고 기능정지릅 올기가 계 중주하는 수치만를 갖자니다.
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="font-bold text-primary text-base mt-0.5">3.</span>
                              <p>
                                관외하으로는 김중의 틀완의 엄격 보건 안전 사소틀를 극소이여 의미약품 관 관련 알관의회외 안전하의 이긴 보건 안전 개선되들를 칭상 시키테나 도중이여 할 수 있도로 노완의니다.
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="font-bold text-primary text-base mt-0.5">4.</span>
                              <p>
                                안안자 자민와 공트하는 임관적 색임을 디하기 위여에 외겅관경의 최스템를 위한 그외로 틀르틀 설준하고 이해상환를 한천와니다.
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="font-bold text-primary text-base mt-0.5">5.</span>
                              <p>
                                환경 보건 안전 활동를 문명적게 개쾌하고 기여 관계자들의 적극적 의사소툴 관 교육를 통여 EHS 경영 한천을 지속적외정하며 중수한다.
                              </p>
                            </div>

                            <div className="flex items-start gap-3">
                              <span className="font-bold text-primary text-base mt-0.5">6.</span>
                              <p>
                                에너지 설괴 게서 및 중를 칭상 활동를 지속하으로는 추천이터 지애니서시아소소 경영한천를 구축한다.
                              </p>
                            </div>
                          </div>

                          <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground">2024년 2월 7일</p>
                            <p className="text-sm text-muted-foreground mt-2">광동제약</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors"
                    aria-label="이전 슬라이드"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center transition-colors"
                    aria-label="다음 슬라이드"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Pagination */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-white text-sm">
                    {currentSlide + 1} / {SAFETY_SLIDES.length}
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Checkbox
                  id="safety-agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  disabled={!viewedAllSlides}
                  className="h-5 w-5"
                />
                <label 
                  htmlFor="safety-agree" 
                  className={`text-base font-medium ${viewedAllSlides ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                >
                  상기내용을 확인하였으며, 방문신청 약관에 동의합니다.
                </label>
              </div>
              {!viewedAllSlides && (
                <p className="text-sm text-center text-muted-foreground font-medium">
                  * 모든 안전보건지침 ({visitedSlides.size}/{SAFETY_SLIDES.length} 확인)을 확인한 후 동의할 수 있습니다.
                </p>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-6">
            <Button 
              onClick={handleClose} 
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
              disabled={!agreed || !viewedAllSlides}
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
