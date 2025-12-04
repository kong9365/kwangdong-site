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
                1. 본 약관은 광동사이언스 주식회사(이하 "회사"라 합니다)가 방문예약 신청 홈페이지를 통하여 제공하는 방문예약 관련 서비스 (이하 "서비스"라 합니다)를 사용자가 이용함에 있어 사용자와 "회사"의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
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
            <DialogTitle>개인정보 처리방침</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="text-sm space-y-4 text-foreground">
              <p>
                <strong>1. 개인정보 처리 목적 및 수집 항목</strong>
              </p>
              <p>
                광동사이언스 주식회사는 방문예약 서비스의 운영을 위해 필요한 최소한의 범위 내에서 다음과 같이 개인정보를 처리합니다.
              </p>

              <table className="w-full border-collapse border border-border mt-4">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">서비스</th>
                    <th className="border border-border p-2 text-left">목적</th>
                    <th className="border border-border p-2 text-left">수집항목</th>
                    <th className="border border-border p-2 text-left">보유 및 이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">방문자 예약정보시스템</td>
                    <td className="border border-border p-2">서비스 운영 및 제공</td>
                    <td className="border border-border p-2">
                      성명, 연락처, 소속사명, 방문 이력(방문날짜, 장소 등)
                    </td>
                    <td className="border border-border p-2">
                      최근 방문일 기준 방문 종료 후 1년간
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-4">
                <strong>2. 개인정보의 보유 및 이용기간</strong>
              </p>
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <p>
                출입 기록 관리 및 내부정책에 따라 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간(최근 방문일 기준 방문 종료 후 1년간) 내에서 개인정보를 처리·보유합니다.
              </p>

              <p>
                <strong>3. 개인정보의 제3자 제공</strong>
              </p>
              <p>
                회사는 정보주체의 개인정보를 개인정보의 처리 목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>

              <p>
                <strong>4. 개인정보의 파기</strong>
              </p>
              <p>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>
              <p>
                전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
              </p>

              <p>
                <strong>5. 정보주체의 권리·의무</strong>
              </p>
              <p>
                정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지요구 등의 권리를 행사할 수 있습니다.
              </p>
              <p>
                권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
              </p>

              <p>
                <strong>6. 개인정보 안전성 확보조치</strong>
              </p>
              <p>
                회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <p>
                • 관리적 조치: 내부관리계획 수립·시행, 전담조직 운영, 정기적 직원 교육
                <br />
                • 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 개인정보의 암호화, 보안프로그램 설치 및 갱신
                <br />
                • 물리적 조치: 전산실, 자료보관실 등의 접근통제
              </p>

              <p>
                <strong>7. 개인정보 보호책임자</strong>
              </p>
              <p>
                개인정보 보호책임자: 정보보호팀장
                <br />
                연락처: 02-410-9181
                <br />
                이메일: security@kwangdong.co.kr
              </p>

              <p className="mt-6">
                정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
              </p>
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setPrivacyOpen(false)}>닫기</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
