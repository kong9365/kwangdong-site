import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function Notice() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 sm:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">공지사항</h1>
            <p className="text-muted-foreground">
              광동제약 방문예약 시스템 공지사항
            </p>
          </div>

          <Card>
            <CardContent className="p-12 sm:p-16">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="rounded-full bg-primary/10 p-8">
                  <Bell className="w-16 h-16 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">개발 예정</h2>
                  <p className="text-muted-foreground text-lg">
                    공지사항 페이지는 현재 개발 중입니다.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    빠른 시일 내에 서비스를 제공하겠습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
