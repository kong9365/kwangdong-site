import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProcedureSection } from "@/components/home/ProcedureSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedFactory, clearReservationFlowState } from "@/lib/reservationFlow";

const FACTORY_OPTIONS = [
  { value: "GMP", label: "GMP공장" },
  { value: "FOOD", label: "식품공장" },
];

export default function Home() {
  const [selectedFactoryState, setSelectedFactoryState] = useState("");

  // 홈 페이지 진입 시 이전 예약 플로우 상태 초기화
  useEffect(() => {
    clearReservationFlowState();
  }, []);

  // 공장 선택 시 상태 저장
  const handleFactoryChange = (value: string) => {
    setSelectedFactoryState(value);
    setSelectedFactory(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Hero Section - 좌우 배치, 배경 이미지 적용 */}
        <section className="relative flex-1 flex items-center min-h-[60vh] sm:min-h-[65vh] bg-background overflow-hidden">
          {/* 배경 이미지 (블러 효과 적용) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/신사옥 이미지.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
              backgroundRepeat: "no-repeat",
              filter: "blur(3px)",
              transform: "scale(1.05)", // 블러로 인한 여백 보정
            }}
          />

          {/* 배경 오버레이 (텍스트 가독성 향상) */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* 왼쪽: 환영 메시지 + 예약현황 버튼 */}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  광동제약 공장 방문예약
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-5 sm:mb-6">
                  방문예약시스템에 오신 것을 환영합니다.
                </p>
                <Link to="/progress">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/70 active:bg-white/30 min-h-[48px] text-base touch-manipulation"
                  >
                    <Search className="w-5 h-5" />
                    예약현황 조회
                  </Button>
                </Link>
              </div>

              {/* 오른쪽: 방문예약 신청 폼 */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-5 sm:p-8">
                <div className="mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    방문예약 신청
                  </h2>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {/* Factory Select */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      방문 공장 선택
                    </label>
                    <Select
                      value={selectedFactoryState}
                      onValueChange={handleFactoryChange}
                    >
                      <SelectTrigger className="w-full h-12 min-h-[48px] bg-white/95 border-white/30 text-foreground text-base touch-manipulation">
                        <SelectValue placeholder="공장을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACTORY_OPTIONS.map((factory) => (
                          <SelectItem
                            key={factory.value}
                            value={factory.value}
                            className="py-3"
                          >
                            {factory.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Link to="/reservation/agreement" className="block">
                    <Button
                      size="lg"
                      className="w-full min-h-[52px] text-base font-semibold touch-manipulation"
                      disabled={!selectedFactoryState}
                    >
                      방문예약 신청하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Procedure Section */}
        <ProcedureSection />
      </main>

      <Footer />
    </div>
  );
}
