import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function AdminTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">관리자</h2>
        <p className="text-muted-foreground">웹페이지 관리 및 권한 설정</p>
      </div>

      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              관리자 기능은 추후 구현 예정입니다.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              권한 관리, 사용자 관리, 웹페이지 설정 등의 기능이 포함됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

