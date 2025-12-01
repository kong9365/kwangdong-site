import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Pin, Eye, ChevronLeft } from "lucide-react";
import { getNotices, getNotice } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Notice {
  id: string;
  title: string;
  content: string;
  view_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export default function Notice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const loadNotices = async (pageNum = 0) => {
    try {
      setLoading(true);
      const data = await getNotices(10, pageNum * 10);
      if (pageNum === 0) {
        setNotices(data);
      } else {
        setNotices((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === 10);
    } catch (error: any) {
      console.error("공지사항 로드 오류:", error);
      toast({
        title: "공지사항을 불러올 수 없습니다",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleNoticeClick = async (notice: Notice) => {
    try {
      const detail = await getNotice(notice.id);
      setSelectedNotice(detail);
    } catch (error: any) {
      toast({
        title: "공지사항을 불러올 수 없습니다",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotices(nextPage);
  };

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

          {loading && notices.length === 0 ? (
            <Card>
              <CardContent className="p-12 sm:p-16">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="rounded-full bg-primary/10 p-8">
                    <Bell className="w-16 h-16 text-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground">로딩 중...</p>
                </div>
              </CardContent>
            </Card>
          ) : notices.length === 0 ? (
            <Card>
              <CardContent className="p-12 sm:p-16">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="rounded-full bg-primary/10 p-8">
                    <Bell className="w-16 h-16 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold">공지사항이 없습니다</h2>
                    <p className="text-muted-foreground text-lg">
                      등록된 공지사항이 없습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <Card
                  key={notice.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleNoticeClick(notice)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {notice.is_pinned && (
                            <Pin className="w-4 h-4 text-primary fill-primary" />
                          )}
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {format(
                              new Date(notice.created_at),
                              "yyyy년 M월 d일",
                              { locale: ko }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {notice.view_count || 0}
                          </span>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? "로딩 중..." : "더 보기"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notice Detail Dialog */}
          <Dialog
            open={!!selectedNotice}
            onOpenChange={() => setSelectedNotice(null)}
          >
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {selectedNotice?.is_pinned && (
                    <Pin className="w-4 h-4 text-primary fill-primary" />
                  )}
                  <DialogTitle>{selectedNotice?.title}</DialogTitle>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {selectedNotice &&
                      format(
                        new Date(selectedNotice.created_at),
                        "yyyy년 M월 d일 HH:mm",
                        { locale: ko }
                      )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedNotice?.view_count || 0}
                  </span>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div
                  className="prose prose-sm max-w-none mt-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedNotice?.content.replace(/\n/g, "<br />") || "",
                  }}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
