import { useRef, useEffect, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollyStep {
  id: string;
  content: ReactNode;
}

interface ScrollySectionProps {
  steps: ScrollyStep[];
  visual: (activeStep: string) => ReactNode;
  onStepEnter?: (stepId: string) => void;
}

export function ScrollySection({ steps, visual, onStepEnter }: ScrollySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [activeStep, setActiveStep] = useState(steps[0]?.id ?? '');

  useEffect(() => {
    if (!sectionRef.current || !visualRef.current) return;

    const triggers: ScrollTrigger[] = [];

    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: visualRef.current,
      pinSpacing: false,
    });
    triggers.push(pinTrigger);

    steps.forEach((step) => {
      const el = stepRefs.current.get(step.id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setActiveStep(step.id);
          onStepEnter?.(step.id);
        },
        onEnterBack: () => {
          setActiveStep(step.id);
          onStepEnter?.(step.id);
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [steps]);

  return (
    <div ref={sectionRef} className="full-bleed relative border-y border-rule-light">
      <div className="max-w-[var(--measure-full)] mx-auto flex flex-col lg:flex-row">
        {/* Fixed visual — left side on desktop */}
        <div
          ref={visualRef}
          className="lg:w-1/2 h-[50vh] lg:h-screen flex items-center justify-center p-6 lg:p-12 bg-paper-warm"
        >
          <div className="w-full max-w-[560px]">
            {visual(activeStep)}
          </div>
        </div>

        {/* Steps — right side on desktop */}
        <div className="lg:w-1/2">
          {steps.map((step) => (
            <div
              key={step.id}
              ref={(el) => {
                if (el) stepRefs.current.set(step.id, el);
              }}
              className={`min-h-[60vh] lg:min-h-screen flex items-center p-6 lg:p-12 transition-opacity duration-700 ${
                activeStep === step.id ? 'opacity-100' : 'opacity-25'
              }`}
            >
              <div className="max-w-md font-serif text-[1.0625rem] font-light leading-[1.75]">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
