import { MousePointer, Monitor, Smartphone, Laptop, MapPin, ChevronRight } from "lucide-react";

const PROCEDURE_STEPS = [
  {
    num: "STEP 01",
    icon: MousePointer,
    text: "방문신청",
  },
  {
    num: "STEP 02",
    icon: Monitor,
    text: "내부승인",
  },
  {
    num: "STEP 03",
    icon: Smartphone,
    text: "문자알림",
  },
  {
    num: "STEP 04",
    icon: Laptop,
    text: "방문수속",
  },
  {
    num: "STEP 05",
    icon: MapPin,
    text: "방문",
  },
];

export function ProcedureSection() {
  return (
    <section className="bg-muted py-4 sm:py-6 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          {/* Title - Left */}
          <div className="flex-shrink-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Procedure</p>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              방문절차안내
            </h2>
          </div>

          {/* Steps - Right */}
          <div className="flex-1 flex items-center justify-center lg:justify-end gap-2 sm:gap-4 flex-wrap">
            {PROCEDURE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <p className="text-[10px] sm:text-xs font-semibold text-foreground">
                      {step.num}
                    </p>
                    <div className="flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                      {step.text}
                    </p>
                  </div>
                  {index < PROCEDURE_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mx-1 sm:mx-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
