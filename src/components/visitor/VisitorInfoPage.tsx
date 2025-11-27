import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VisitorForm } from "@/types/visitor";

interface VisitorInfoPageProps {
  form: VisitorForm;
  onChange: (field: keyof VisitorForm, value: string) => void;
  onSubmit: () => void;
}

export function VisitorInfoPage({ form, onChange, onSubmit }: VisitorInfoPageProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>방문자 기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">성명</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="홍길동"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="example@kdpharm.co.kr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carNumber">차량번호 (필요 시)</Label>
              <Input
                id="carNumber"
                value={form.carNumber}
                onChange={(e) => onChange("carNumber", e.target.value)}
                placeholder="00가 0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>신분증/관련 자료 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="idFile">신분증 사본 (또는 신원확인용 자료)</Label>
            <Input
              id="idFile"
              value={form.idFileName}
              onChange={(e) => onChange("idFileName", e.target.value)}
              placeholder="파일명(또는 업로드 결과)을 여기에 연결하도록 개발"
            />
            <p className="text-xs text-muted-foreground">
              실제 시스템에서는 파일 업로드 컴포넌트와 연동 필요.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSubmit}>방문자 정보 임시 저장</Button>
      </div>
    </div>
  );
}
