import {useCallback, useEffect, useRef, useState} from "react";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

interface TextAreaComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  error?: string;
  maxLength?: number;
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export default function TextAreaComponent({
  name,
  label,
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  maxLength,
}: TextAreaComponentProps) {
  const [charCount, setCharCount] = useState(value?.length ?? 0);
  const innerRef = useRef<HTMLTextAreaElement>(null);

  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof inputRef === "function") inputRef(el);
    },
    [inputRef],
  );

  useEffect(() => {
    if (innerRef.current) autoResize(innerRef.current);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    autoResize(e.target);
    setCharCount(e.target.value.length);
    onChange?.(e);
  }

  return (
    <div className='space-y-2'>
      {label && (
        <div className='flex gap-2'>
          <Label htmlFor={name}>{label}</Label>
          {required && <span className='text-red-500'>*</span>}
        </div>
      )}
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        ref={setRefs}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        maxLength={maxLength}
        rows={1}
        className='resize-none overflow-hidden border-gray/80 px-4 font-heading focus-visible:border-brand focus-visible:ring-0'
      />
      {maxLength && (
        <p className='text-right text-xs text-muted-foreground'>
          {charCount}/{maxLength}
        </p>
      )}
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}
