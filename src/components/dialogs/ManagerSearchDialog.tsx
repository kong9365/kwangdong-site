import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Manager {
  id: string;
  name: string;
  department: string;
  company: string;
  phone: string;
  email?: string;
  position?: string;
}

interface ManagerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (manager: Manager) => void;
}

export function ManagerSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: ManagerSearchDialogProps) {
  const { toast } = useToast();
  const [searchName, setSearchName] = useState("");
  const [searchDept, setSearchDept] = useState("");
  const [searchResults, setSearchResults] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);

  // 다이얼로그가 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setSearchName("");
      setSearchDept("");
      setSearchResults([]);
    }
  }, [open]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("managers")
        .select("*")
        .eq("is_active", true);

      // 이름 검색
      if (searchName.trim()) {
        query = query.ilike("name", `%${searchName.trim()}%`);
      }

      // 부서 검색
      if (searchDept.trim()) {
        query = query.ilike("department", `%${searchDept.trim()}%`);
      }

      const { data, error } = await query.order("name", { ascending: true });

      if (error) throw error;

      setSearchResults(
        (data || []).map((m) => ({
          id: m.id,
          name: m.name,
          department: m.department,
          company: m.company,
          phone: m.phone,
          email: m.email || undefined,
          position: m.position || undefined,
        }))
      );

      if (data && data.length === 0) {
        toast({
          title: "검색 결과 없음",
          description: "검색 조건에 맞는 담당자를 찾을 수 없습니다.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("담당자 검색 오류:", error);
      toast({
        title: "검색 실패",
        description: error.message || "담당자 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (manager: Manager) => {
    onSelect(manager);
    onOpenChange(false);
    setSearchName("");
    setSearchDept("");
    setSearchResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>담당자 검색</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Search Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">담당자명</label>
              <Input
                placeholder="담당자명 입력"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">부서명</label>
              <Input
                placeholder="부서명 입력"
                value={searchDept}
                onChange={(e) => setSearchDept(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSearch} disabled={loading} className="gap-2 w-full sm:w-auto">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              검색
            </Button>
          </div>

          {/* Search Results */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">검색 중...</p>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>담당자명</TableHead>
                      <TableHead>부서</TableHead>
                      <TableHead>회사</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead className="text-center">선택</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((manager) => (
                      <TableRow key={manager.id}>
                        <TableCell className="font-medium">
                          {manager.name}
                          {manager.position && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({manager.position})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{manager.department}</TableCell>
                        <TableCell>{manager.company}</TableCell>
                        <TableCell>{manager.phone}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelect(manager)}
                          >
                            선택
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y">
                {searchResults.map((manager) => (
                  <div key={manager.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          {manager.name}
                          {manager.position && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({manager.position})
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {manager.department} · {manager.company}
                        </div>
                        <div className="text-sm mt-1">{manager.phone}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSelect(manager)}
                        className="ml-2"
                      >
                        선택
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searchResults.length === 0 && (searchName || searchDept) && (
            <div className="text-center py-8 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          )}

          {!loading && !searchName && !searchDept && (
            <div className="text-center py-8 text-muted-foreground">
              담당자명 또는 부서명을 입력하고 검색해주세요.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}