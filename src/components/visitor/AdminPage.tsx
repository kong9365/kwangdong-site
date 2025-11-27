import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VisitRequest } from "@/types/visitor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminPageProps {
  requestList: VisitRequest[];
  selectedRequest: VisitRequest | undefined;
  onSelectRequest: (id: number) => void;
  onAction: (action: "APPROVE" | "REJECT") => void;
}

export function AdminPage({
  requestList,
  selectedRequest,
  onSelectRequest,
  onAction,
}: AdminPageProps) {
  const getStatusLabel = (status: VisitRequest["status"]) => {
    switch (status) {
      case "WAIT":
        return "대기중";
      case "APPROVED":
        return "승인";
      case "REJECTED":
        return "반려";
      default:
        return status;
    }
  };

  const getStatusVariant = (
    status: VisitRequest["status"]
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "WAIT":
        return "secondary";
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>방문 요청 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-32">이름</TableHead>
                  <TableHead>방문 목적</TableHead>
                  <TableHead className="w-44">방문 일정</TableHead>
                  <TableHead className="w-24">상태</TableHead>
                  <TableHead className="w-20">선택</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestList.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.visitorName}</TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectRequest(request.id)}
                      >
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedRequest && (
        <Card>
          <CardHeader>
            <CardTitle>선택된 요청 상세 (ID: {selectedRequest.id})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-muted-foreground mb-1">방문자</div>
                <div className="text-sm">{selectedRequest.visitorName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">방문 목적</div>
                <div className="text-sm">{selectedRequest.purpose}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">방문 일정</div>
                <div className="text-sm">{selectedRequest.date}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">현재 상태</div>
                <div>
                  <Badge variant={getStatusVariant(selectedRequest.status)}>
                    {getStatusLabel(selectedRequest.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={() => onAction("REJECT")}
              >
                반려
              </Button>
              <Button onClick={() => onAction("APPROVE")}>승인</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
