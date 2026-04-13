import {useFormContext} from "react-hook-form";
import InputComponent from "./inputs/input-component";
import SelectComponent from "./inputs/select-component";
import DateComponent from "./inputs/date-component";
import VerificationCodeComponent from "./inputs/verification-code-component";
import PasswordComponent from "./inputs/password-component";

/* ========================================
   = Props =
========================================= */
interface InputGroupProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  options?: {value: string; label: string}[];
  clearable?: boolean;
}

export default function InputGroup({
  name,
  label,
  required = false,
  placeholder,
  type = "text",
  options = [],
  clearable,
}: InputGroupProps) {
  const {
    register,
    setValue,
    formState: {errors},
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const {ref, onChange, onBlur} = register(name);

  if (type === "select") {
    return (
      <SelectComponent
        name={name}
        label={label}
        required={required}
        placeholder={placeholder}
        options={options}
        clearable={clearable}
      />
    );
  }

  if (type === "date") {
    return (
      <DateComponent
        name={name}
        label={label}
        required={required}
        placeholder={placeholder}
      />
    );
  }

  if (type === "password") {
    return (
      <PasswordComponent
        name={name}
        label={label}
        required={required}
        placeholder={placeholder}
      />
    );
  }

  if (type === "verification_code") {
    return (
      <VerificationCodeComponent
        name={name}
        label={label}
        required={required}
      />
    );
  }

  return (
    <InputComponent
      name={name}
      label={label}
      required={required}
      placeholder={placeholder}
      type={type}
      inputRef={ref}
      onChange={onChange}
      onBlur={onBlur}
      error={errorMessage}
      onNumericChange={(value) =>
        setValue(name, value, {shouldValidate: true, shouldDirty: true})
      }
    />
  );
}
