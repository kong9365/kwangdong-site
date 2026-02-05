import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { SafetyGuidelineDialog } from "@/components/dialogs/SafetyGuidelineDialog";
import { VisitorGuidelinesDialog } from "@/components/dialogs/VisitorGuidelinesDialog";
import { ManagerSearchDialog } from "@/components/dialogs/ManagerSearchDialog";
import { VisitorAddConsentDialog } from "@/components/dialogs/VisitorAddConsentDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  validateReservationFlow,
  setFormStarted,
  clearReservationFlowState,
  getReservationFlowState,
} from "@/lib/reservationFlow";
import { createVisitRequest, sendSMSNotification } from "@/lib/api";
import {
  buildReservationReceivedMessage,
  formatVisitDate,
} from "@/lib/smsMessages";

const AGREEMENT_STEPS = [
  { num: 1, label: "약관동의", active: false },
  { num: 2, label: "방문신청 정보입력", active: true },
  { num: 3, label: "완료", active: false },
];

const PURPOSE_OPTIONS = [
  { value: "00", label: "회의" },
  { value: "01", label: "공사" },
  { value: "02", label: "납품" },
  { value: "03", label: "면접" },
  { value: "04", label: "장비점검/유지보수" },
  { value: "99", label: "기타" },
];

interface Visitor {
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  carNumber: string;
  privacyAgreed: boolean;
  safetyAgreed: boolean;
}

interface Manager {
  id: string;
  name: string;
  department: string;
  company: string;
  phone: string;
}

const formSchema = z.object({
  purpose: z.string().min(1, "방문목적을 선택해주세요"),
  otherPurpose: z.string().optional(),
  manager: z.string().optional(),
  department: z.string().optional(),
  visitorCompany: z.string().min(1, "회사명을 입력해주세요"),
  startDate: z.date({ 
    required_error: "시작일을 선택해주세요",
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "오늘 이후의 날짜를 선택해주세요",
  }),
  endDate: z.date({ required_error: "종료일을 선택해주세요" }),
}).refine((data) => {
  if (data.purpose === "99" && !data.otherPurpose) {
    return false;
  }
  return true;
}, {
  message: "기타 목적을 입력해주세요",
  path: ["otherPurpose"],
}).refine((data) => {
  if (data.endDate && data.startDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "종료일은 시작일 이후여야 합니다",
  path: ["endDate"],
});

export default function ReservationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      name: "",
      phone1: "010",
      phone2: "",
      phone3: "",
      carNumber: "",
      privacyAgreed: false,
      safetyAgreed: false,
    },
  ]);

  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [visitorGuidelinesOpen, setVisitorGuidelinesOpen] = useState(false);
  const [safetyDialogOpen, setSafetyDialogOpen] = useState(false);
  const [managerSearchOpen, setManagerSearchOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visitorAddConsentOpen, setVisitorAddConsentOpen] = useState(false);
  const [hasShownVisitorAddConsent, setHasShownVisitorAddConsent] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // 방문공장 정보 (플로우에서 가져옴)
  const [factoryCode, setFactoryCode] = useState<string | null>(null);
  const [factoryLabel, setFactoryLabel] = useState<string | null>(null);

  // 플로우 유효성 검사 - 공장 선택 및 약관 동의 확인
  useEffect(() => {
    const validation = validateReservationFlow();
    if (!validation.isValid && validation.redirectTo) {
      toast({
        title: "접근 불가",
        description: validation.message || "예약 절차를 처음부터 진행해주세요.",
        variant: "destructive",
      });
      navigate(validation.redirectTo, { replace: true });
    } else {
      setFormStarted();
      // 공장 정보 가져오기
      const flowState = getReservationFlowState();
      setFactoryCode(flowState.factory);
      setFactoryLabel(flowState.factoryLabel);
    }
  }, [navigate, toast]);

  // 페이지 이탈 경고 (beforeunload)
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isFormDirty && !submitting) {
        e.preventDefault();
        e.returnValue = "작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?";
        return e.returnValue;
      }
    },
    [isFormDirty, submitting]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // 폼 변경 감지
  useEffect(() => {
    const hasVisitorData = visitors.some(
      (v) => v.name.trim() || v.phone2.trim() || v.phone3.trim() || v.carNumber.trim()
    );
    setIsFormDirty(hasVisitorData);
  }, [visitors]);

  // Show both dialogs on first load
  useEffect(() => {
    setVisitorGuidelinesOpen(true);
    setSafetyDialogOpen(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      otherPurpose: "",
      manager: "",
      department: "",
      visitorCompany: "",
    },
  });

  const selectedPurpose = form.watch("purpose");

  const handleManagerSelect = (manager: Manager) => {
    setSelectedManager(manager);
    form.setValue("manager", manager.name);
    form.setValue("department", manager.department);
  };

  const addVisitor = () => {
    if (visitors.length >= 20) {
      toast({
        title: "최대 인원 초과",
        description: "최대 20명까지만 추가할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    // 최초 1회만 동의 팝업 표시
    if (!hasShownVisitorAddConsent) {
      setVisitorAddConsentOpen(true);
      return;
    }

    // 동의 후 방문자 추가
    handleAddVisitorAfterConsent();
  };

  const handleAddVisitorAfterConsent = () => {
    setVisitors([
      ...visitors,
      {
        name: "",
        phone1: "010",
        phone2: "",
        phone3: "",
        carNumber: "",
        privacyAgreed: false,
        safetyAgreed: false,
      },
    ]);
  };

  const handleVisitorAddConsent = () => {
    setHasShownVisitorAddConsent(true);
    handleAddVisitorAfterConsent();
  };

  const removeVisitor = (index: number) => {
    if (visitors.length === 1) {
      toast({
        title: "삭제 불가",
        description: "최소 1명의 방문자가 필요합니다.",
        variant: "destructive",
      });
      return;
    }
    setVisitors(visitors.filter((_, i) => i !== index));
  };

  const updateVisitor = (index: number, field: keyof Visitor, value: any) => {
    const newVisitors = [...visitors];
    newVisitors[index] = { ...newVisitors[index], [field]: value };
    setVisitors(newVisitors);
  };

  const validatePhoneNumber = (phone1: string, phone2: string, phone3: string): boolean => {
    const phone = phone1 + phone2 + phone3;
    // 전화번호 형식 검증 (010-0000-0000 형식)
    const phoneRegex = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/;
    return phoneRegex.test(phone);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Validate visitors
    const invalidVisitors: number[] = [];
    visitors.forEach((v, index) => {
      if (!v.name.trim()) {
        invalidVisitors.push(index + 1);
        return;
      }
      if (!v.phone2.trim() || !v.phone3.trim()) {
        invalidVisitors.push(index + 1);
        return;
      }
      if (!validatePhoneNumber(v.phone1, v.phone2, v.phone3)) {
        invalidVisitors.push(index + 1);
        return;
      }
      if (!v.safetyAgreed) {
        invalidVisitors.push(index + 1);
        return;
      }
    });

    if (invalidVisitors.length > 0) {
      toast({
        title: "방문자 정보 오류",
        description: `방문자 ${invalidVisitors.join(", ")}번의 정보를 정확히 입력해주세요. (이름, 전화번호, 안전보건 지침 동의 필수)`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const visitRequest = await createVisitRequest({
        company: values.visitorCompany,
        department: values.department || "",
        purpose: values.purpose === "99" ? values.otherPurpose || "" : PURPOSE_OPTIONS.find(p => p.value === values.purpose)?.label || values.purpose,
        visit_date: format(values.startDate, "yyyy-MM-dd"),
        end_date: values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
        visitor_company: values.visitorCompany,
        requester_id: null, // 비로그인 공개 예약 (로그인 구현 시 supabase.auth.getUser()로 설정)
        manager_name: selectedManager?.name || values.manager || null,
        manager_phone: selectedManager?.phone || null,
        factory: factoryCode, // 방문공장 (통계용)
        visitors: visitors.map((v) => ({
          name: v.name,
          phone: v.phone1 + v.phone2 + v.phone3,
          carNumber: v.carNumber || undefined,
        })),
      } as any);

      toast({
        title: "방문예약 신청 완료",
        description: `예약번호: ${visitRequest.reservation_number}. 담당자 승인 후 문자메시지로 안내드리겠습니다.`,
      });

      // 예약 접수 완료 문자 발송 (첫 번째 방문자에게)
      if (visitors.length > 0) {
        const firstPhone = visitors[0].phone1 + visitors[0].phone2 + visitors[0].phone3;
        const message = buildReservationReceivedMessage({
          managerName: selectedManager?.name || values.manager || "-",
          visitDate: formatVisitDate(values.startDate),
          endDate: values.endDate ? formatVisitDate(values.endDate) : null,
          reservationNumber: visitRequest.reservation_number || "",
        });
        try {
          const smsResult = await sendSMSNotification(visitRequest.id, firstPhone, message);
          if (!smsResult.success) {
            toast({
              title: "문자 발송 실패",
              description: smsResult.error || "예약 접수 문자를 보내지 못했습니다.",
              variant: "destructive",
            });
          }
        } catch (smsError) {
          console.error("예약 접수 문자 발송 오류:", smsError);
          toast({
            title: "문자 발송 오류",
            description: smsError instanceof Error ? smsError.message : "문자 발송 중 오류가 발생했습니다.",
            variant: "destructive",
          });
        }
      }

      // 예약 플로우 상태 초기화 및 완료 페이지로 이동
      setIsFormDirty(false);
      clearReservationFlowState();
      navigate(`/reservation/complete?reservation=${visitRequest.reservation_number}`);
    } catch (error: any) {
      console.error("예약 신청 오류:", error);
      toast({
        title: "예약 신청 실패",
        description: error.message || "예약 신청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <ul className="flex items-center justify-center gap-4 sm:gap-8">
              {AGREEMENT_STEPS.map((step) => (
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Visit Purpose Section */}
              <div className="bg-card rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-6">방문 목적</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>방문목적</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PURPOSE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedPurpose === "99" && (
                    <FormField
                      control={form.control}
                      name="otherPurpose"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>기타목적 입력</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="기타목적 입력"
                              maxLength={50}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Manager Information Section */}
              <div className="bg-card rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-6">담당자 정보</h3>
                <div className="space-y-4">
                  {/* 방문공장 (읽기전용 - 홈에서 선택한 값 표시) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">방문공장</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={factoryLabel || ""}
                        placeholder="공장 정보 없음"
                        className="max-w-md bg-muted"
                        readOnly
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>담당자</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="담당자 정보 입력"
                              className="max-w-md"
                              readOnly
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setManagerSearchOpen(true)}
                          >
                            검색
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>방문 부서</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="방문 부서 입력"
                            className="max-w-md"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Visitor Company & Date Section */}
              <div className="bg-card rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-6">방문자 정보</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="visitorCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>회사명</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="회사명 입력"
                            maxLength={25}
                            className="max-w-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>방문 시작일</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ko })
                                  ) : (
                                    <span>날짜 선택</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>방문 종료일</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ko })
                                  ) : (
                                    <span>날짜 선택</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  const startDate = form.watch("startDate");
                                  if (startDate) {
                                    const start = new Date(startDate);
                                    start.setHours(0, 0, 0, 0);
                                    return date < start || date < today;
                                  }
                                  return date < today;
                                }}
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Visitors Table Section */}
              <div className="bg-card rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">방문자 정보</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        ※ 단체 방문을 원하실 경우 [추가] 버튼을 눌러주세요. (최대
                        20명)
                      </p>
                      <p>※ 연락처는 본인의 핸드폰 번호를 입력해주세요.</p>
                      <p>
                        ※ 차량 방문시 차량번호를 입력해 주세요. ([선택]개인정보
                        수집 및 동의가 필요합니다.)
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVisitorGuidelinesOpen(true);
                      setSafetyDialogOpen(true);
                    }}
                  >
                    안전보건지침
                  </Button>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-3 text-left text-sm font-medium">
                          방문자 성함
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          연락처
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          차량번호
                        </th>
                        <th className="p-3 text-center text-sm font-medium whitespace-nowrap">
                          개인정보 수집 동의
                        </th>
                        <th className="p-3 text-center text-sm font-medium whitespace-nowrap">
                          안전보건 지침 동의
                        </th>
                        <th className="p-3 text-center text-sm font-medium">
                          삭제
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="p-3">
                            <Input
                              value={visitor.name}
                              onChange={(e) =>
                                updateVisitor(index, "name", e.target.value)
                              }
                              placeholder="성함"
                              className="w-full"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Select
                                value={visitor.phone1}
                                onValueChange={(value) =>
                                  updateVisitor(index, "phone1", value)
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="010">010</SelectItem>
                                  <SelectItem value="011">011</SelectItem>
                                  <SelectItem value="016">016</SelectItem>
                                </SelectContent>
                              </Select>
                              <span>-</span>
                              <Input
                                value={visitor.phone2}
                                onChange={(e) =>
                                  updateVisitor(
                                    index,
                                    "phone2",
                                    e.target.value.replace(/\D/g, "")
                                  )
                                }
                                maxLength={4}
                                placeholder="0000"
                                className="w-20"
                              />
                              <span>-</span>
                              <Input
                                value={visitor.phone3}
                                onChange={(e) =>
                                  updateVisitor(
                                    index,
                                    "phone3",
                                    e.target.value.replace(/\D/g, "")
                                  )
                                }
                                maxLength={4}
                                placeholder="0000"
                                className="w-20"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <Input
                              value={visitor.carNumber}
                              onChange={(e) =>
                                updateVisitor(index, "carNumber", e.target.value)
                              }
                              maxLength={10}
                              placeholder="차량번호"
                              className="w-full"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <Checkbox
                              checked={visitor.privacyAgreed}
                              onCheckedChange={(checked) =>
                                updateVisitor(index, "privacyAgreed", checked)
                              }
                            />
                          </td>
                          <td className="p-3 text-center">
                            <Checkbox
                              checked={visitor.safetyAgreed}
                              onCheckedChange={(checked) =>
                                updateVisitor(index, "safetyAgreed", checked)
                              }
                            />
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVisitor(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {visitors.map((visitor, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-xl p-4 space-y-4 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-primary">
                          방문자 {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVisitor(index)}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* 이름 입력 */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">이름 *</label>
                        <Input
                          value={visitor.name}
                          onChange={(e) =>
                            updateVisitor(index, "name", e.target.value)
                          }
                          placeholder="방문자 성함을 입력하세요"
                          className="text-base"
                        />
                      </div>

                      {/* 연락처 입력 */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">연락처 *</label>
                        <div className="flex items-center gap-2">
                          <Select
                            value={visitor.phone1}
                            onValueChange={(value) =>
                              updateVisitor(index, "phone1", value)
                            }
                          >
                            <SelectTrigger className="w-[80px] h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="010">010</SelectItem>
                              <SelectItem value="011">011</SelectItem>
                              <SelectItem value="016">016</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-muted-foreground">-</span>
                          <Input
                            value={visitor.phone2}
                            onChange={(e) =>
                              updateVisitor(
                                index,
                                "phone2",
                                e.target.value.replace(/\D/g, "")
                              )
                            }
                            maxLength={4}
                            placeholder="0000"
                            inputMode="numeric"
                            className="flex-1 text-center"
                          />
                          <span className="text-muted-foreground">-</span>
                          <Input
                            value={visitor.phone3}
                            onChange={(e) =>
                              updateVisitor(
                                index,
                                "phone3",
                                e.target.value.replace(/\D/g, "")
                              )
                            }
                            maxLength={4}
                            placeholder="0000"
                            inputMode="numeric"
                            className="flex-1 text-center"
                          />
                        </div>
                      </div>

                      {/* 차량번호 입력 */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">차량번호 (선택)</label>
                        <Input
                          value={visitor.carNumber}
                          onChange={(e) =>
                            updateVisitor(index, "carNumber", e.target.value)
                          }
                          maxLength={10}
                          placeholder="예: 12가3456"
                          className="text-base"
                        />
                      </div>

                      {/* 동의 체크박스 */}
                      <div className="space-y-3 pt-2 border-t border-border">
                        <label className="flex items-center gap-3 p-3 -mx-3 rounded-lg tap-highlight cursor-pointer">
                          <Checkbox
                            checked={visitor.privacyAgreed}
                            onCheckedChange={(checked) =>
                              updateVisitor(index, "privacyAgreed", checked)
                            }
                            className="h-5 w-5"
                          />
                          <span className="text-sm flex-1 whitespace-nowrap">개인정보 수집 동의 (선택)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 -mx-3 rounded-lg tap-highlight cursor-pointer">
                          <Checkbox
                            checked={visitor.safetyAgreed}
                            onCheckedChange={(checked) =>
                              updateVisitor(index, "safetyAgreed", checked)
                            }
                            className="h-5 w-5"
                          />
                          <span className="text-sm flex-1 whitespace-nowrap">
                            안전보건 지침 동의 <span className="text-destructive">*</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVisitor}
                    className="gap-2 w-full sm:w-auto"
                    size="lg"
                  >
                    <Plus className="w-5 h-5" />
                    방문자 추가
                  </Button>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <div className="hidden sm:flex justify-center pb-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-64"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      신청 중...
                    </>
                  ) : (
                    "신청하기"
                  )}
                </Button>
              </div>

              {/* Mobile bottom spacer */}
              <div className="sm:hidden h-24" />
            </form>
          </Form>

          {/* Submit Button - Mobile Sticky */}
          <div className="sm:hidden sticky-bottom-action">
            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold"
              disabled={submitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  신청 중...
                </>
              ) : (
                "신청하기"
              )}
            </Button>
          </div>

      {/* Dialogs */}
      <VisitorGuidelinesDialog
        open={visitorGuidelinesOpen}
        onOpenChange={setVisitorGuidelinesOpen}
      />
      <SafetyGuidelineDialog
        open={safetyDialogOpen}
        onOpenChange={setSafetyDialogOpen}
      />
      <ManagerSearchDialog
        open={managerSearchOpen}
        onOpenChange={setManagerSearchOpen}
        onSelect={handleManagerSelect}
      />
      <VisitorAddConsentDialog
        open={visitorAddConsentOpen}
        onOpenChange={setVisitorAddConsentOpen}
        onConfirm={handleVisitorAddConsent}
      />
        </div>
      </main>

      <Footer />
    </div>
  );
}