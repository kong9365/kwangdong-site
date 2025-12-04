import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2 } from "lucide-react";
import { ApprovalTab } from "@/components/employee/ApprovalTab";
import { CheckInTab } from "@/components/employee/CheckInTab";
import { AdminTab } from "@/components/employee/AdminTab";
import { getCurrentUserPermissions } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";

type TabValue = "approval" | "checkin" | "admin";

export default function EmployeeDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<TabValue>("approval");
  const [permissions, setPermissions] = useState<{
    can_approve: boolean;
    can_checkin: boolean;
    can_admin: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // URL 쿼리 파라미터에서 탭 읽기
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabValue;
    if (tabParam && ["approval", "checkin", "admin"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // 권한 확인
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      setLoading(true);
      const perms = await getCurrentUserPermissions();
      
      if (!perms) {
        // 권한이 없으면 기본 권한 부여 (개발 단계)
        setPermissions({
          can_approve: true,
          can_checkin: true,
          can_admin: true,
        });
      } else {
        setPermissions(perms);
      }
    } catch (error: any) {
      console.error("권한 확인 오류:", error);
      // 오류 발생 시 기본 권한 부여 (개발 단계)
      setPermissions({
        can_approve: true,
        can_checkin: true,
        can_admin: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    const tabValue = value as TabValue;
    setActiveTab(tabValue);
    // URL 쿼리 파라미터 업데이트
    setSearchParams({ tab: tabValue });
  };

  // 권한 체크 함수
  const hasPermission = (permission: "approve" | "checkin" | "admin"): boolean => {
    if (!permissions) return false;
    return permissions[`can_${permission}`] || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">권한 확인 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">임직원모드</h1>
            <p className="text-muted-foreground">
              방문 예약 승인, 방문 수속, 관리자 기능을 사용할 수 있습니다.
            </p>
          </div>

          {/* 탭 */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="approval" disabled={!hasPermission("approve")}>
                예약승인
              </TabsTrigger>
              <TabsTrigger value="checkin" disabled={!hasPermission("checkin")}>
                방문수속
              </TabsTrigger>
              <TabsTrigger value="admin" disabled={!hasPermission("admin")}>
                관리자
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approval" className="mt-6">
              {hasPermission("approve") ? (
                <ApprovalTab />
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">예약승인 권한이 없습니다.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="checkin" className="mt-6">
              {hasPermission("checkin") ? (
                <CheckInTab />
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">방문수속 권한이 없습니다.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              {hasPermission("admin") ? (
                <AdminTab />
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">관리자 권한이 없습니다.</p>
                </div>
          )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
