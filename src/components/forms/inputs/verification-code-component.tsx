import {useRef, useState} from "react";
import {useFormContext} from "react-hook-form";
import {Label} from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";

/* ========================================
   = Props =
========================================= */
interface VerificationCodeComponentProps {
  name: string;
  label: string;
  required?: boolean;
  digits?: number;
}

export default function VerificationCodeComponent({
  name,
  label,
  required = false,
  digits = 6,
}: VerificationCodeComponentProps) {
  const {
    setValue,
    formState: {errors},
  } = useFormContext();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = useState<string[]>(Array(digits).fill(""));
  const errorMessage = errors[name]?.message as string | undefined;

  function update(next: string[]) {
    setValues(next);
    setValue(name, next.join(""), {shouldValidate: true, shouldDirty: true});
  }

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    update(next);
    if (digit && index < digits - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        update(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, digits);
    const next = Array(digits).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    update(next);
    inputRefs.current[Math.min(pasted.length, digits - 1)]?.focus();
  }

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Label>{label}</Label>
        {required && <span className='text-red-500'>*</span>}
      </div>
      <div className='flex gap-3 justify-center'>
        {Array.from({length: digits}).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={values[index] ?? ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className='w-12 h-14 rounded-lg border border-gray/80 bg-transparent text-center text-xl font-semibold text-foreground transition-colors outline-none focus:border-brand caret-transparent font-heading'
          />
        ))}
      </div>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
