import {useState} from "react";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

/* ========================================
   = Props =
========================================= */
interface InputComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  // Modo controlado
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  error?: string;
  // Para tipos numéricos fuera de formulario
  onNumericChange?: (value: string) => void;
}

const ONLY_DIGITS = /[^0-9]/g;
const ONLY_DECIMAL = /[^0-9.]/g;

export default function InputComponent({
  name,
  label,
  required = false,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  onNumericChange,
}: InputComponentProps) {
  const isNumeric = type === "number" || type === "decimal";
  const [numericValue, setNumericValue] = useState(value ?? "");

  function handleNumericChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;

    if (type === "number") {
      const filtered = raw.replace(ONLY_DIGITS, "");
      setNumericValue(filtered);
      onNumericChange?.(filtered);
    } else if (type === "decimal") {
      const cleaned = raw.replace(ONLY_DECIMAL, "");
      const parts = cleaned.split(".");
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 2) return;
      setNumericValue(cleaned);
      onNumericChange?.(cleaned);
    }
  }

  return (
    <div className='space-y-2'>
      {label && (
        <div className='flex gap-2'>
          <Label htmlFor={name}>{label}</Label>
          {required && <span className='text-red-500'>*</span>}
        </div>
      )}
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        type={isNumeric ? "text" : type}
        inputMode={
          type === "decimal"
            ? "decimal"
            : type === "number"
              ? "numeric"
              : undefined
        }
        ref={inputRef}
        value={isNumeric ? numericValue : value}
        onChange={isNumeric ? handleNumericChange : onChange}
        onBlur={onBlur}
      />
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}
