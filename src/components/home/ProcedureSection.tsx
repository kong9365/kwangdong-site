import { FileText, CheckCircle, MessageSquare, DoorOpen, Building } from "lucide-react";

const PROCEDURE_STEPS = [
  {
    num: "STEP 01",
    icon: FileText,
    text: "방문신청",
  },
  {
    num: "STEP 02",
    icon: CheckCircle,
    text: "내부승인",
  },
  {
    num: "STEP 03",
    icon: MessageSquare,
    text: "문자알림",
  },
  {
    num: "STEP 04",
    icon: DoorOpen,
    text: "방문수속",
  },
  {
    num: "STEP 05",
    icon: Building,
    text: "방문",
  },
];

export function ProcedureSection() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Procedure</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            방문절차안내
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {PROCEDURE_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <p className="text-xs font-semibold text-primary mb-4">
                  {step.num}
                </p>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
