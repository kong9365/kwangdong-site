import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Camera, Loader2, QrCode, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { decodeQRCode, checkInVisit, getVisitRequestByQRCodeId } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface QRData {
  reservation_number: string;
  visitor_name: string;
  visit_date: string;
  purpose: string;
  manager_name: string;
  company: string;
  department: string;
}

export default function VisitCheckIn() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [qrCode, setQrCode] = useState<string>("");
  const [visitRequest, setVisitRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<any>(null);

  // URL 파라미터에서 QR 코드 ID 확인 (/qr/:id)
  useEffect(() => {
    const qrCodeId = params.id;
    if (qrCodeId) {
      handleQRCodeId(qrCodeId);
    } else {
      // 기존 방식: 쿼리 파라미터에서 code 확인
      const code = searchParams.get("code");
      if (code) {
        setQrCode(code);
        handleDecodeQR(code);
      }
    }
  }, [params.id, searchParams]);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // 후면 카메라 우선
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        
        // QR 코드 스캔 라이브러리 로드 (동적 import)
        try {
          const { BrowserQRCodeReader } = await import("@zxing/library");
          const codeReader = new BrowserQRCodeReader();
          
          codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
            if (result) {
              const scannedText = result.getText();
              stopCamera();
              handleScannedQR(scannedText);
            }
            if (err && err.name !== "NotFoundException") {
              console.error("QR 코드 스캔 오류:", err);
            }
          });
          
          scannerRef.current = codeReader;
        } catch (importError) {
          console.error("QR 코드 라이브러리 로드 실패:", importError);
          toast({
            title: "QR 코드 스캔 기능을 사용할 수 없습니다",
            description: "수동으로 QR 코드를 입력해주세요.",
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      console.error("카메라 접근 실패:", err);
      toast({
        title: "카메라 접근 실패",
        description: "카메라 권한이 필요합니다.",
        variant: "destructive",
      });
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // QR 코드 ID로 예약 정보 조회 (새로운 방식)
  const handleQRCodeId = async (qrCodeId: string) => {
    if (!qrCodeId.trim()) {
      setError("QR 코드 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { qrData, visitRequest: request } = await getVisitRequestByQRCodeId(qrCodeId);
      setVisitRequest(request);
      setQrCode(qrCodeId);
    } catch (err: any) {
      setError(err.message || "QR 코드 조회 실패");
      setVisitRequest(null);
      toast({
        title: "QR 코드 오류",
        description: err.message || "QR 코드를 확인할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // QR 코드 디코딩 (기존 방식 - 하위 호환성)
  const handleDecodeQR = async (code: string) => {
    if (!code.trim()) {
      setError("QR 코드 데이터를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { qrData, visitRequest: request } = await decodeQRCode(code);
      setVisitRequest(request);
      setQrCode(code);
    } catch (err: any) {
      setError(err.message || "QR 코드 디코딩 실패");
      setVisitRequest(null);
      toast({
        title: "QR 코드 오류",
        description: err.message || "QR 코드를 확인할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // QR 코드 링크에서 ID 추출
  const extractQRCodeIdFromLink = (link: string): string | null => {
    try {
      // /qr/{id} 형식 추출
      const qrMatch = link.match(/\/qr\/([a-f0-9-]{36})/i);
      if (qrMatch) {
        return qrMatch[1];
      }
      
      // 전체 URL에서 도메인 제거 후 추출
      const url = new URL(link.startsWith('http') ? link : `https://${link}`);
      const pathMatch = url.pathname.match(/\/qr\/([a-f0-9-]{36})/i);
      if (pathMatch) {
        return pathMatch[1];
      }
      
      return null;
    } catch {
      // URL이 아닌 경우 UUID 형식인지 확인
      const uuidMatch = link.match(/^[a-f0-9-]{36}$/i);
      if (uuidMatch) {
        return uuidMatch[0];
      }
      return null;
    }
  };

  // 스캔된 QR 코드 처리
  const handleScannedQR = (scannedText: string) => {
    const qrCodeId = extractQRCodeIdFromLink(scannedText);
    if (qrCodeId) {
      handleQRCodeId(qrCodeId);
    } else {
      // 기존 방식 시도
      handleDecodeQR(scannedText);
    }
  };

  // 입력값 처리 (링크 또는 ID)
  const handleInput = () => {
    if (!qrCode.trim()) {
      setError("QR 코드 링크 또는 ID를 입력해주세요.");
      return;
    }

    const qrCodeId = extractQRCodeIdFromLink(qrCode);
    if (qrCodeId) {
      handleQRCodeId(qrCodeId);
    } else {
      // 기존 방식 시도
      handleDecodeQR(qrCode);
    }
  };

  // 체크인 처리
  const handleCheckIn = async () => {
    if (!visitRequest) return;

    setCheckingIn(true);
    try {
      await checkInVisit(visitRequest.reservation_number);
      toast({
        title: "체크인 완료",
        description: "방문 수속이 완료되었습니다.",
      });
      
      // 2초 후 상세 페이지로 이동
      setTimeout(() => {
        navigate(`/progress/view?reservation=${visitRequest.reservation_number}`);
      }, 2000);
    } catch (err: any) {
      toast({
        title: "체크인 실패",
        description: err.message || "체크인 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy년 M월 d일", { locale: ko });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* 제목 */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">방문 수속</h1>
              <p className="text-muted-foreground">QR 코드 링크를 입력하거나 카메라로 스캔해주세요</p>
            </div>

            {/* QR 코드 입력 */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR 코드 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="QR 코드 링크 (예: /qr/xxx-xxx-xxx) 또는 QR 코드 ID를 입력하세요"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleInput();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleInput} disabled={loading || !qrCode.trim()}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Link className="w-4 h-4 mr-2" />
                          확인
                        </>
                      )}
                    </Button>
                  </div>

                  {/* 카메라 스캔 */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      카메라로 QR 코드 이미지를 스캔하려면 아래 버튼을 클릭하세요.
                    </p>
                    <Button
                      variant="outline"
                      onClick={cameraActive ? stopCamera : startCamera}
                      className="w-full"
                    >
                      {cameraActive ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          카메라 중지
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          카메라 시작
                        </>
                      )}
                    </Button>
                    
                    {cameraActive && (
                      <div className="mt-4 relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg border"
                          style={{ maxHeight: "400px" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-primary rounded-lg w-64 h-64" />
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <XCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 예약 정보 확인 */}
            {visitRequest && (
              <Card className="shadow-sm border border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    예약 정보 확인
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">예약번호</div>
                        <div className="font-medium">{visitRequest.reservation_number}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">방문 일시</div>
                        <div className="font-medium">{formatDate(visitRequest.visit_date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">방문자</div>
                        <div className="font-medium">
                          {visitRequest.visitor_info?.[0]?.visitor_name || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">방문 목적</div>
                        <div className="font-medium">{visitRequest.purpose}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">담당자</div>
                        <div className="font-medium">{visitRequest.manager_name || "-"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">상태</div>
                        <Badge variant="secondary">{visitRequest.status}</Badge>
                      </div>
                    </div>

                    {visitRequest.checked_in_at ? (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium">이미 체크인 완료되었습니다.</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          체크인 시간: {format(new Date(visitRequest.checked_in_at), "yyyy-MM-dd HH:mm", { locale: ko })}
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleCheckIn}
                        disabled={checkingIn || visitRequest.status !== "APPROVED"}
                        className="w-full"
                        size="lg"
                      >
                        {checkingIn ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            체크인 중...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            방문 체크인
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
