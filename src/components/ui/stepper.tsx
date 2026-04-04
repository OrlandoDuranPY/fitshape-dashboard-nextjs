import * as React from "react";
import {defineStepper} from "@stepperize/react";
import {cn} from "@/lib/utils";
import {Button} from "./button";

/* ========================================
   = Types =
========================================= */
type StepDef = {id: string; label: string; [key: string]: unknown};

type StepIndicatorProps = {
  steps: StepDef[];
  currentIndex: number;
  className?: string;
};

type StepLabelProps = {
  steps: StepDef[];
  currentIndex: number;
  className?: string;
};

type StepperActionsProps = {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinish?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  className?: string;
};

/* ========================================
   = StepIndicator =
========================================= */
function StepIndicator({steps, currentIndex, className}: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div
                className={cn(
                  "flex-1 h-px transition-colors",
                  index <= currentIndex ? "bg-brand" : "bg-muted-foreground/30",
                )}
              />
            )}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2 transition-colors",
                isCompleted || isCurrent
                  ? "bg-brand border-brand text-white"
                  : "bg-transparent border-muted-foreground/40 text-muted-foreground",
              )}
            >
              {index + 1}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ========================================
   = StepLabel =
========================================= */
function StepLabel({steps, currentIndex, className}: StepLabelProps) {
  return (
    <p className={cn("text-sm text-foreground/60 font-heading", className)}>
      Paso {currentIndex + 1} de {steps.length}: {steps[currentIndex]?.label}
    </p>
  );
}

/* ========================================
   = StepperActions =
========================================= */
function StepperActions({
  isFirst,
  isLast,
  onPrev,
  onNext,
  onFinish,
  prevLabel = "Atrás",
  nextLabel = "Siguiente",
  finishLabel = "Finalizar",
  className,
}: StepperActionsProps) {
  return (
    <div className={cn("flex gap-2 pt-2", className)}>
      {!isFirst && (
        <Button onClick={onPrev} variant='secondary' className='flex-1'>
          {prevLabel}
        </Button>
      )}
      <Button onClick={isLast ? () => onFinish?.() : onNext} className='flex-1'>
        {isLast ? finishLabel : nextLabel}
      </Button>
    </div>
  );
}

/* ========================================
   = Exports =
========================================= */
export {StepIndicator, StepLabel, StepperActions, defineStepper};
export type {StepDef, StepIndicatorProps, StepLabelProps, StepperActionsProps};
