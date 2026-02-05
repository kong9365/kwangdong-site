import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReservationFlowState, setAgreementCompleted } from "@/lib/reservationFlow";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrivacyPolicyContent } from "@/content/PrivacyPolicyContent";

const AGREEMENT_STEPS = [
  { num: 1, label: "약관동의", active: true },
  { num: 2, label: "방문신청 정보입력", active: false },
  { num: 3, label: "완료", active: false },
];

export default function Agreement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreements, setAgreements] = useState({
    age14: false,
    terms: false,
    privacy: false,
    optionalPrivacy: false,
  });

  // 공장 선택 여부 확인
  useEffect(() => {
    const flowState = getReservationFlowState();
    if (!flowState.factory) {
      toast({
        title: "공장 선택 필요",
        description: "공장 선택 정보가 없습니다. 방문예약 첫 화면으로 이동합니다.",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    }
  }, [navigate, toast]);

  const handleCheckAll = (checked: boolean) => {
    setAgreements({
      age14: checked,
      terms: checked,
      privacy: checked,
      optionalPrivacy: checked,
    });
  };

  const isAllChecked =
    agreements.age14 &&
    agreements.terms &&
    agreements.privacy &&
    agreements.optionalPrivacy;

  const isRequiredChecked =
    agreements.age14 && agreements.terms && agreements.privacy;

  const handleSubmit = () => {
    if (isRequiredChecked) {
      setAgreementCompleted();
      navigate("/reservation/form");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <ul className="flex items-center justify-center gap-4 sm:gap-8">
              {AGREEMENT_STEPS.map((step, index) => (
                <li
                  key={step.num}
                  className={`flex items-center gap-2 ${
                    step.active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      step.active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Agreement Section */}
          <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              광동제약 방문예약시스템
              <br />
              약관에 동의해 주세요.
            </h2>

            <div className="space-y-6">
              {/* Age 14+ Agreement */}
              <div className="border-b border-border pb-6">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="age14"
                    checked={agreements.age14}
                    onCheckedChange={(checked) =>
                      setAgreements({ ...agreements, age14: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="age14"
                      className="text-sm font-medium cursor-pointer"
                    >
                      <span className="text-destructive font-bold">[필수]</span>{" "}
                      만 14세 이상입니다.
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      만 14세 미만은 방문 예약을 할 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="border-b border-border pb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id="terms"
                      checked={agreements.terms}
                      onCheckedChange={(checked) =>
                        setAgreements({ ...agreements, terms: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium cursor-pointer"
                    >
                      <span className="text-destructive font-bold">[필수]</span>{" "}
                      방문 신청 약관
                    </label>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="text-primary">
                        내용보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
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

                          <p>
                            <strong>제6조(사용자에 대한 통지)</strong>
                          </p>
                          <p>
                            1. "회사"가 특정 사용자에 대한 통지를 하는 경우 "사용자"가 방문예약 시 제공한 휴대전화 번호로 연락할 수 있습니다.
                          </p>
                          <p>
                            2. "회사"가 불특정다수 사용자에 대한 통지를 하는 경우 사이트 공지사항에 공지함으로써 개별 통지에 갈음할 수 있습니다.
                          </p>

                          <p>
                            <strong>제7조("회사"의 의무)</strong>
                          </p>
                          <p>
                            1. "회사"는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하기 위해서 노력합니다.
                          </p>
                          <p>
                            2. "회사"는 사용자가 안전하게 인터넷 서비스를 이용할 수 있도록 "사용자"의 개인정보 보호를 위한 보안 시스템을 구축합니다.
                          </p>

                          <p>
                            <strong>제8조(개인정보)</strong>
                          </p>
                          <p>
                            1. "사용자"가 방문 예약 후 회사에 방문하기 전에 방문 예약을 취소한 경우 "사용자"가 입력한 개인정보는 즉시 폐기됩니다.
                          </p>
                          <p>
                            2. "사용자"는 회사에 대한 방문을 마친 후에 자신의 개인정보의 삭제를 요청할 수 있으며 "회사"는 다른 법령에 당해 개인정보가 수집대상으로 명시되어 있는 등 정당한 사유가 없는 한 지체없이 방문예약 관련 사항에 대해 삭제 절차를 밟습니다.
                          </p>
                          <p>
                            3. "회사"는 관련 법령이 정하는 바에 따라서 사용자 입력정보를 포함한 "사용자"의 개인정보를 보호하기 위하여 노력합니다.
                          </p>

                          <p>
                            <strong>제9조(사용자의 의무)</strong>
                          </p>
                          <p>
                            1. "사용자"는 다음 각 호의 행위를 하여서는 안됩니다.
                            <br />
                            ① 방문예약 신청시 허위내용을 등록하는 행위
                            <br />
                            ② "회사"에 게시된 정보를 변경하는 행위
                            <br />
                            ③ "회사" 기타 제3자의 인격권 또는 지적재산권을 침해하거나 업무를 방해하는 행위
                            <br />
                            ④ 다른 사용자의 개인정보를 도용하는 행위
                            <br />
                            ⑤ 기타 "사용자"의 방문예약 신청 정보로 다른 사용자를 "회사"에 출입하게 하는 행위
                          </p>
                          <p>
                            2. "사용자"는 그 귀책사유로 인하여 "회사"나 다른 사용자가 입은 손해를 배상할 책임이 있습니다.
                          </p>

                          <p>
                            <strong>제10조(저작권의 귀속 및 이용제한)</strong>
                          </p>
                          <p>
                            1. 사이트와 관련한 모든 저작권, 상표권, 기술에 대한 정보는 "회사"가 모든 권리를 가지고 있습니다.
                          </p>
                          <p>
                            2. "사용자"는 사이트를 이용함으로써 얻은 정보를 "회사"의 사전승낙 없이 복제, 전송, 출판, 배포, 방송 기타 방법에 의하여 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                          </p>

                          <p>
                            <strong>제11조(면책)</strong>
                          </p>
                          <p>
                            1. "사용자"가 방문예약 관련하여 사이트에 입력한 내용에 관한 신뢰도 또는 정확성에 대하여는 해당 "사용자"가 책임을 부담하며, "회사"는 내용의 부정확 또는 허위로 인해 "사용자" 또는 제3자에게 발생한 손해에 대하여는 어떠한 책임을 부담하지 않습니다.
                          </p>
                          <p>
                            2. "회사"는 서비스 이용과 관련하여 "사용자"의 고의 또는 과실로 인하여 "사용자" 또는 제3자에게 발생한 손해에 대하여는 어떠한 책임을 부담하지 않습니다.
                          </p>

                          <p>
                            <strong>제12조(약관의 개정)</strong>
                          </p>
                          <p>
                            1. "회사"는 약관의 규제 등에 관한 법률, 전자거래기본법 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
                          </p>
                          <p>
                            2. "회사"가 본 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 그 적용일자 7일 이전부터 공지합니다.
                          </p>

                          <p>
                            <strong>제13조(재판관할)</strong>
                          </p>
                          <p>
                            "회사"와 "사용자"간에 발생한 서비스 이용에 관한 분쟁에 대하여는 대한민국 법을 적용하며, 본 분쟁으로 인한 소는 서울중앙지방법원에 제기합니다.
                          </p>

                          <p className="mt-6">
                            <strong>부칙</strong>
                          </p>
                          <p>본 약관은 2025년 1월 1일부터 적용됩니다.</p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Privacy Agreement (Required) */}
              <div className="border-b border-border pb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id="privacy"
                      checked={agreements.privacy}
                      onCheckedChange={(checked) =>
                        setAgreements({
                          ...agreements,
                          privacy: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium cursor-pointer"
                    >
                      <span className="text-destructive font-bold">[필수]</span>{" "}
                      개인정보 수집 및 이용
                    </label>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="text-primary">
                        내용보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>광동제약㈜ 개인정보 처리방침</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] pr-4">
                        <PrivacyPolicyContent />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Privacy Agreement (Optional - for vehicle) */}
              <div className="border-b border-border pb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id="optionalPrivacy"
                      checked={agreements.optionalPrivacy}
                      onCheckedChange={(checked) =>
                        setAgreements({
                          ...agreements,
                          optionalPrivacy: checked as boolean,
                        })
                      }
                    />
                    <div>
                      <label
                        htmlFor="optionalPrivacy"
                        className="text-sm font-medium cursor-pointer"
                      >
                        <span className="font-bold">[선택]</span> 개인정보 수집
                        및 이용
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        <strong>차량 방문</strong>시 "[선택] 개인정보 수집 및
                        이용" 동의를 체크해 주세요.
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="text-primary">
                        내용보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>개인정보 수집 및 이용 (선택)</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] pr-4">
                        <div className="text-sm space-y-4 text-foreground">
                          <p>
                            <strong>[선택] 개인정보 수집 및 이용 동의</strong>
                          </p>
                          <p>
                            차량으로 방문하시는 경우 다음과 같은 개인정보를 추가로 수집합니다.
                          </p>

                          <table className="w-full border-collapse border border-border mt-4">
                            <thead>
                              <tr className="bg-muted">
                                <th className="border border-border p-2 text-left">
                                  서비스
                                </th>
                                <th className="border border-border p-2 text-left">
                                  목적
                                </th>
                                <th className="border border-border p-2 text-left">
                                  수집항목
                                </th>
                                <th className="border border-border p-2 text-left">
                                  보유 및 이용 기간
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-border p-2">
                                  방문자 차량 관리
                                </td>
                                <td className="border border-border p-2">
                                  주차 관리 및 보안
                                </td>
                                <td className="border border-border p-2">차량번호</td>
                                <td className="border border-border p-2">
                                  최근 방문일 기준 방문 종료 후 1년간
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <p className="mt-4">
                            위 개인정보 수집에 동의하지 않으실 수 있으며, 동의하지 않으시는 경우에도 방문예약 신청이 가능합니다. 단, 차량으로 방문하시는 경우 주차 관리를 위해 동의가 필요합니다.
                          </p>

                          <p>
                            <strong>개인정보의 파기</strong>
                          </p>
                          <p>
                            수집된 차량번호 정보는 보유기간 경과 후 즉시 파기됩니다. 전자적 파일은 복구 불가능하도록 기술적 방법으로 파기하며, 종이 문서는 분쇄 또는 소각합니다.
                          </p>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Agree All */}
              <div className="pt-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Checkbox
                    id="agreeAll"
                    checked={isAllChecked}
                    onCheckedChange={handleCheckAll}
                  />
                  <label
                    htmlFor="agreeAll"
                    className="text-sm font-bold cursor-pointer"
                  >
                    모두 동의합니다
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full"
                disabled={!isRequiredChecked}
                onClick={handleSubmit}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
