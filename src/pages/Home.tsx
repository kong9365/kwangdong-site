import { useState } from "react";
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

const FACTORY_OPTIONS = [
  { value: "GMP", label: "GMP공장" },
  { value: "FOOD", label: "식품공장" },
];

export default function Home() {
  const [selectedFactory, setSelectedFactory] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Hero Section - 좌우 배치, 배경 이미지 준비 */}
        <section 
          className="relative flex-1 flex items-center min-h-[60vh] sm:min-h-[65vh] bg-background"
          style={{
            // 나중에 배경 이미지 적용 시 사용
            // backgroundImage: "url('/path/to/background-image.jpg')",
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            // backgroundRepeat: "no-repeat",
          }}
        >
          {/* 배경 오버레이 (배경 이미지 적용 시 텍스트 가독성 향상) */}
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* 왼쪽: 환영 메시지 + 예약현황 버튼 */}
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  광동제약 공장 방문예약
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-6">
                  방문예약시스템에 오신 것을 환영합니다.
                </p>
                <Link to="/progress">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Search className="w-4 h-4" />
                    예약현황
                  </Button>
                </Link>
              </div>

              {/* 오른쪽: 방문예약 신청 폼 */}
              <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    방문예약 신청
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Factory Select */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      광동제약
                    </label>
                    <Select
                      value={selectedFactory}
                      onValueChange={setSelectedFactory}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="공장을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACTORY_OPTIONS.map((factory) => (
                          <SelectItem key={factory.value} value={factory.value}>
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
                      className="w-full"
                      disabled={!selectedFactory}
                    >
                      신청하기
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
