import ErrorMessage from "../ui/error-message";
import {Input} from "../ui/input";
import {Label} from "../ui/label";

/* ========================================
   = Props =
========================================= */
interface InputGroupProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder: string;
  type?: string;
  errorMessage?: string;
}

export default function InputGroup({
  name,
  label,
  required = false,
  placeholder,
  type = "text",
  errorMessage,
}: InputGroupProps) {
  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Label htmlFor={name}>{label}</Label>{" "}
        {required && <span className='text-red-500'>*</span>}
      </div>
      <Input id={name} placeholder={placeholder} type={type} />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
