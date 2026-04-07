import {useState} from "react";
import {useFormContext} from "react-hook-form";
import {Eye, EyeOff} from "lucide-react";
import ErrorMessage from "@/components/ui/error-message";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

/* ========================================
   = Props =
========================================= */
interface PasswordComponentProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

export default function PasswordComponent({
  name,
  label,
  required = false,
  placeholder,
}: PasswordComponentProps) {
  const {
    register,
    formState: {errors},
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Label htmlFor={name}>{label}</Label>
        {required && <span className='text-red-500'>*</span>}
      </div>
      <div className='relative'>
        <Input
          id={name}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...register(name)}
        />
        <button
          type='button'
          onClick={() => setShowPassword((prev) => !prev)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
}
