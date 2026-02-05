import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PrivacyPolicyContent } from "@/content/PrivacyPolicyContent";

export function Footer() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#1a1a1a] border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full">
            {/* Address - 2줄 */}
            <div className="flex flex-col gap-1 text-[10px] sm:text-xs text-white/70 flex-1">
              <address className="not-italic">
                광동제약 송탄공장 : 경기도 평택시 경기대로 1081 (장당동) 광동제약㈜, T 031-8030-1777
              </address>
              <address className="not-italic">
                광동제약 GMP공장 : 경기도 평택시 산단로 114 광동제약㈜, T 031) 612-1111
              </address>
            </div>

            {/* Links - 3개 + Copyright */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2 md:gap-4 text-xs sm:text-sm">
                <button
                  onClick={() => setTermsOpen(true)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  방문신청약관
                </button>
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  개인정보처리방침
                </button>
                <Link
                  to="/faq"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </div>
              {/* Copyright */}
              <div className="text-[10px] sm:text-xs text-white/60">
                COPYRIGHT(C) KWANG DONG PHARMACEUTICAL CO., LTD. ALL RIGHTS RESERVED
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 방문신청약관 다이얼로그 */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-full max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>방문 신청 약관</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="text-sm space-y-4 text-foreground">
              <p>
                <strong>제1조(목적 등)</strong>
              </p>
              <p>
                1. 본 약관은 광동제약(이하 "회사"라 합니다)가 방문예약 신청 홈페이지를 통하여 제공하는 방문예약 관련 서비스 (이하 "서비스"라 합니다)를 사용자가 이용함에 있어 사용자와 "회사"의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
              <p>
                2. 본 약관에 정하는 이외의 "사용자"와 "회사"의 권리, 의무 및 책임사항에 관해서는 개인정보보호법 및 개인정보보호에 관한 제반 법령, 산업안전보호법 및 기타 관련 법령에 따릅니다.
              </p>

              <p>
                <strong>제2조(사용자의 정의)</strong>
              </p>
              <p>
                "사용자"란 "사이트"에 접속하여 "회사"가 제공하는 서비스를 이용하는 자를 말하며 회원가입 없이 사이트를 이용하는 자를 말합니다.
              </p>

              <p>
                <strong>제3조(서비스의 제공 및 변경)</strong>
              </p>
              <p>
                1. "회사"는 "사용자"에게 아래와 같은 서비스를 제공합니다.
                <br />
                ① 방문예약관련 정책 안내
                <br />
                ② 방문예약 신청 접수
                <br />
                ③ 기타 "회사"가 방문관련 "사용자"들에게 제공하는 일체의 서비스 안내
              </p>
              <p>
                2. 제1항의 서비스는 "사용자"에게 공지사항 등을 이용하여 제공됩니다.
              </p>
              <p>
                3. "회사"는 제1항 서비스의 내용이 변경되는 경우 변경될 서비스의 내용 및 제공일자를 서비스 제공 최소 7일 전에 사이트 공지사항 등을 통해 게시후 변경된 서비스를 제공합니다.
              </p>

              <p>
                <strong>제4조(서비스의 중단)</strong>
              </p>
              <p>
                1. "회사"는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있으며, 새로운 서비스로의 교체, 기타 "회사"가 적절하다고 판단하는 사유에 의하여 현재 제공되는 서비스를 완전히 중단할 수 있습니다.
              </p>
              <p>
                2. 제1항에 의한 서비스 중단의 경우에는 "회사"는 공지사항 등에 게시하여 "사용자"에게 공지합니다. 다만, "회사"가 통제할 수 없는 사유로 인한 서비스의 중단으로 인하여 사전 통지가 불가능한 경우에는 그러하지 아니합니다.
              </p>

              <p>
                <strong>제5조(사용자 자격 상실 등)</strong>
              </p>
              <p>
                1. "사용자"가 다음 각 호의 사유에 해당하는 경우, "회사"는 출입증 발급 및 입문을 거부할 수 있습니다.
                <br />
                ① 방문예약 신청 시에 허위 내용을 등록한 경우
                <br />
                ② "회사"의 보안정책을 위반한 경우
                <br />
                ③ 서비스를 이용하여 법령과 본 약관이 금지하는 행위 또는 공공의 질서와 선량한 풍속에 반하는 행위를 하거나 할 우려가 있는 경우
                <br />
                ④ "회사"가 내부 지침/규정 등에 의거 입문이 어려운 사용자라고 판단한 경우
                <br />
                ⑤ "회사" 내/외부 사정 등으로 인하여 사용자의 입문이 어려운 상황이 발생하는 경우
                <br />
                ⑥ "사용자"가 본 약관을 위배한 경우
              </p>
              <p>
                2. "회사"는 출입증 발급 및 입문을 거부하기 전 사용자에게 소명할 기회를 부여합니다.
              </p>

              <p className="mt-6">
                <strong>부칙</strong>
              </p>
              <p>본 약관은 2025년 1월 1일부터 적용됩니다.</p>
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setTermsOpen(false)}>닫기</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 개인정보처리방침 다이얼로그 */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-full max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>광동제약㈜ 개인정보 처리방침</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <PrivacyPolicyContent />
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setPrivacyOpen(false)}>닫기</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
