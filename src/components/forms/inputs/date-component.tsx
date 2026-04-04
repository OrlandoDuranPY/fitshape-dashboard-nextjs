import {useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {CalendarIcon} from "lucide-react";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {cn} from "@/lib/utils";

/* ========================================
   = Props =
========================================= */
interface DateComponentProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export default function DateComponent({
  name,
  label,
  required = false,
  placeholder,
}: DateComponentProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    formState: {errors},
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Label htmlFor={name}>{label}</Label>
        {required && <span className='text-red-500'>*</span>}
      </div>
      <Controller
        name={name}
        control={control}
        render={({field}) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                id={name}
                type='button'
                className={cn(
                  "w-full min-w-0 rounded-lg border border-gray/80 bg-transparent px-4 py-2 text-sm font-heading text-left transition-colors outline-none flex items-center justify-between",
                  "focus-visible:border-brand data-[state=open]:border-brand",
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                  field.value ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {field.value
                  ? (field.value as Date).toLocaleDateString()
                  : placeholder}
                <CalendarIcon className='size-4 text-muted-foreground' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={field.value as Date | undefined}
                defaultMonth={field.value as Date | undefined}
                captionLayout='dropdown'
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
