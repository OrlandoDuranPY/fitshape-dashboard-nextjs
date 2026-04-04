import {useState} from "react";
import {useFormContext} from "react-hook-form";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

/* ========================================
   = Props =
========================================= */
interface InputComponentProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder: string;
  type?: string;
}

const ONLY_DIGITS = /[^0-9]/g;
const ONLY_DECIMAL = /[^0-9.]/g;

export default function InputComponent({
  name,
  label,
  required = false,
  placeholder,
  type = "text",
}: InputComponentProps) {
  const {
    register,
    setValue,
    formState: {errors},
  } = useFormContext();

  const isNumeric = type === "number" || type === "decimal";
  const [numericValue, setNumericValue] = useState("");
  const errorMessage = errors[name]?.message as string | undefined;
  const {ref, ...rest} = register(name);

  function handleNumericChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;

    if (type === "number") {
      const filtered = raw.replace(ONLY_DIGITS, "");
      setNumericValue(filtered);
      setValue(name, filtered, {shouldValidate: true, shouldDirty: true});
    } else if (type === "decimal") {
      const cleaned = raw.replace(ONLY_DECIMAL, "");
      const parts = cleaned.split(".");
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 2) return;
      setNumericValue(cleaned);
      setValue(name, cleaned, {shouldValidate: true, shouldDirty: true});
    }
  }

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Label htmlFor={name}>{label}</Label>{" "}
        {required && <span className='text-red-500'>*</span>}
      </div>
      <Input
        id={name}
        placeholder={placeholder}
        type={isNumeric ? "text" : type}
        inputMode={type === "decimal" ? "decimal" : type === "number" ? "numeric" : undefined}
        ref={ref}
        {...(isNumeric
          ? {value: numericValue, onChange: handleNumericChange}
          : rest)}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
