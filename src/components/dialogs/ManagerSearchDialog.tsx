import { useState } from "react";
import { Search } from "lucide-react";
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

interface Manager {
  id: string;
  name: string;
  department: string;
  company: string;
  phone: string;
}

interface ManagerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (manager: Manager) => void;
}

// Mock data for demonstration
const MOCK_MANAGERS: Manager[] = [
  {
    id: "1",
    name: "김철수",
    department: "연구개발부",
    company: "광동사이언스",
    phone: "02-410-9100",
  },
  {
    id: "2",
    name: "이영희",
    department: "생산기술부",
    company: "광동제약",
    phone: "02-410-9200",
  },
  {
    id: "3",
    name: "박민수",
    department: "품질관리부",
    company: "광동제약",
    phone: "02-410-9300",
  },
  {
    id: "4",
    name: "정수진",
    department: "마케팅부",
    company: "광동사이언스",
    phone: "02-410-9400",
  },
  {
    id: "5",
    name: "최동욱",
    department: "경영지원부",
    company: "광동제약",
    phone: "02-410-9500",
  },
];

export function ManagerSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: ManagerSearchDialogProps) {
  const [searchName, setSearchName] = useState("");
  const [searchDept, setSearchDept] = useState("");
  const [searchResults, setSearchResults] = useState<Manager[]>([]);

  const handleSearch = () => {
    const results = MOCK_MANAGERS.filter((manager) => {
      const matchName = searchName
        ? manager.name.includes(searchName)
        : true;
      const matchDept = searchDept
        ? manager.department.includes(searchDept)
        : true;
      return matchName && matchDept;
    });
    setSearchResults(results);
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>담당자 검색</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              검색
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
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
          )}

          {searchResults.length === 0 && searchName && searchDept && (
            <div className="text-center py-8 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
