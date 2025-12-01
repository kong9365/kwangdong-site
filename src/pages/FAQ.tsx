import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getFAQs } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order_index: number;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchQuery, selectedCategory]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await getFAQs();
      setFaqs(data);
      setFilteredFaqs(data);
    } catch (error: any) {
      console.error("FAQ 로드 오류:", error);
      toast({
        title: "FAQ를 불러올 수 없습니다",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    setFilteredFaqs(filtered);
  };

  const categories = [
    "전체",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const groupedFAQs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 sm:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">FAQ</h1>
            <p className="text-muted-foreground">자주 묻는 질문</p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="p-12 sm:p-16">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="rounded-full bg-primary/10 p-8">
                    <HelpCircle className="w-16 h-16 text-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground">로딩 중...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="p-12 sm:p-16">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="rounded-full bg-primary/10 p-8">
                    <HelpCircle className="w-16 h-16 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold">검색 결과가 없습니다</h2>
                    <p className="text-muted-foreground text-lg">
                      다른 검색어로 시도해보세요.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {selectedCategory === "전체" ? (
                Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="secondary">{category}</Badge>
                        <span>{categoryFaqs.length}개</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {categoryFaqs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              <div
                                className="whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                  __html: faq.answer.replace(/\n/g, "<br />"),
                                }}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedCategory}</Badge>
                      <span>{filteredFaqs.length}개</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            <div
                              className="whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: faq.answer.replace(/\n/g, "<br />"),
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
