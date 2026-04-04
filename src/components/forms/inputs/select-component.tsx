import {Controller, useFormContext} from "react-hook-form";
import {XIcon} from "lucide-react";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ========================================
   = Props =
========================================= */
interface SelectComponentProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  clearable?: boolean;
  options?: {value: string | number; label: string}[];
}

export default function SelectComponent({
  name,
  label,
  required = false,
  placeholder,
  clearable = true,
  options = [],
}: SelectComponentProps) {
  const {
    control,
    setValue,
    formState: {errors},
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Label htmlFor={name}>{label}</Label>{" "}
        {required && <span className='text-red-500'>*</span>}
      </div>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <div className='relative flex items-center'>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className='h-auto! w-full min-w-0 rounded-lg border border-gray/80 bg-transparent px-4 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-brand disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 font-heading'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {clearable && field.value && (
              <button
                type='button'
                onClick={() => setValue(name, "", {shouldValidate: true})}
                className='absolute right-8 text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
              >
                <XIcon className='size-4' />
              </button>
            )}
          </div>
        )}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
