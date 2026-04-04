import InputComponent from "./inputs/input-component";
import SelectComponent from "./inputs/select-component";
import DateComponent from "./inputs/date-component";

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
  options?: {value: string; label: string}[];
}

export default function InputGroup({
  name,
  label,
  required = false,
  placeholder,
  type = "text",
  errorMessage,
  options = [],
}: InputGroupProps) {
  if (type === "select") {
    return (
      <SelectComponent
        name={name}
        label={label}
        required={required}
        placeholder={placeholder}
        errorMessage={errorMessage}
        options={options}
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
        errorMessage={errorMessage}
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
      errorMessage={errorMessage}
    />
  );
}
