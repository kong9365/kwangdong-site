import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { SafetyGuidelineDialog } from "@/components/dialogs/SafetyGuidelineDialog";
import { VisitorGuidelinesDialog } from "@/components/dialogs/VisitorGuidelinesDialog";
import { ManagerSearchDialog } from "@/components/dialogs/ManagerSearchDialog";
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

const formSchema = z.object({
  purpose: z.string().min(1, "방문목적을 선택해주세요"),
  otherPurpose: z.string().optional(),
  manager: z.string().optional(),
  department: z.string().optional(),
  visitorCompany: z.string().min(1, "회사명을 입력해주세요"),
  startDate: z.date({ required_error: "시작일을 선택해주세요" }),
  endDate: z.date({ required_error: "종료일을 선택해주세요" }),
}).refine((data) => {
  if (data.purpose === "99" && !data.otherPurpose) {
    return false;
  }
  return true;
}, {
  message: "기타 목적을 입력해주세요",
  path: ["otherPurpose"],
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

  const [visitorGuidelinesOpen, setVisitorGuidelinesOpen] = useState(false);
  const [safetyDialogOpen, setSafetyDialogOpen] = useState(false);
  const [managerSearchOpen, setManagerSearchOpen] = useState(false);

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

  const handleManagerSelect = (manager: any) => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Validate visitors
    const hasInvalidVisitor = visitors.some(
      (v) => !v.name || !v.phone2 || !v.phone3 || !v.safetyAgreed
    );

    if (hasInvalidVisitor) {
      toast({
        title: "방문자 정보 오류",
        description: "모든 방문자의 정보를 정확히 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Supabase에 저장
      const { createVisitRequest } = await import("@/lib/api");
      
      const phone = visitors[0].phone1 + visitors[0].phone2 + visitors[0].phone3;
      
      const visitRequest = await createVisitRequest({
        company: values.visitorCompany,
        department: values.department || "",
        purpose: values.purpose === "99" ? values.otherPurpose || "" : values.purpose,
        visit_date: format(values.startDate, "yyyy-MM-dd"),
        end_date: values.endDate ? format(values.endDate, "yyyy-MM-dd") : undefined,
        requester_id: "anonymous", // 로그인 구현 시 실제 사용자 ID 사용
        visitors: visitors.map((v) => ({
          name: v.name,
          phone: v.phone1 + v.phone2 + v.phone3,
          carNumber: v.carNumber || undefined,
        })),
      });

      toast({
        title: "방문예약 신청 완료",
        description: `예약번호: ${visitRequest.reservation_number}. 담당자 승인 후 문자메시지로 안내드리겠습니다.`,
      });

      // Navigate to completion page with reservation number
      navigate(`/reservation/complete?reservation=${visitRequest.reservation_number}`);
    } catch (error: any) {
      console.error("예약 신청 오류:", error);
      toast({
        title: "예약 신청 실패",
        description: error.message || "예약 신청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
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
                        <th className="p-3 text-center text-sm font-medium">
                          개인정보 수집 동의
                        </th>
                        <th className="p-3 text-center text-sm font-medium">
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
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          방문자 {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVisitor(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={visitor.name}
                        onChange={(e) =>
                          updateVisitor(index, "name", e.target.value)
                        }
                        placeholder="성함"
                      />
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
                          className="flex-1"
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
                          className="flex-1"
                        />
                      </div>
                      <Input
                        value={visitor.carNumber}
                        onChange={(e) =>
                          updateVisitor(index, "carNumber", e.target.value)
                        }
                        maxLength={10}
                        placeholder="차량번호"
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={visitor.privacyAgreed}
                            onCheckedChange={(checked) =>
                              updateVisitor(index, "privacyAgreed", checked)
                            }
                          />
                          개인정보 수집 동의
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={visitor.safetyAgreed}
                            onCheckedChange={(checked) =>
                              updateVisitor(index, "safetyAgreed", checked)
                            }
                          />
                          안전보건 지침 동의
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
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    방문자 추가
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button type="submit" size="lg" className="w-full sm:w-64">
                  신청하기
                </Button>
              </div>
            </form>
          </Form>

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
