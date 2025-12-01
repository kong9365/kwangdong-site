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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                광동제약 공장 방문예약
              </h1>
              <p className="text-lg text-muted-foreground">
                방문예약시스템에 오신 것을 환영합니다.
              </p>
            </div>

            {/* Quick Link */}
            <div className="flex justify-center mb-12">
              <Link to="/progress">
                <Button variant="outline" size="lg" className="gap-2">
                  <Search className="w-4 h-4" />
                  예약현황
                </Button>
              </Link>
            </div>

            {/* Reservation Form */}
            <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary mb-2">
                  Current
                </p>
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
        </section>

        {/* Procedure Section */}
        <ProcedureSection />
      </main>

      <Footer />
    </div>
  );
}
