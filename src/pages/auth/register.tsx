import type {ReactElement} from "react";
import Link from "next/link";
import {useForm, FormProvider} from "react-hook-form";
import {format} from "date-fns";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/schemas/auth/registerSchema";
import AuthLayout from "@/components/layouts/auth-layout";
import {Card} from "@/components/ui/card";
import Title from "@/components/ui/title";
import {ROUTES} from "@/routing/routes";
import RegisterStepper from "@/components/auth/register-stepper";
import {useAuth} from "@/hooks/auth/use-auth";
import {useRouter} from "next/router";

export default function Register() {
  /* ========================================
     = Composables =
  ========================================= */
  const router = useRouter();
  const {
    // states
    errors: apiErrors,
    // methods
    register: authRegister,
  } = useAuth();

  /* ========================================
     = Form =
  ========================================= */
  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  /* ========================================
     = Functions =
  ========================================= */
  const onFinish = methods.handleSubmit(async (data) => {
    const payload = {
      ...data,
      birth_date: format(data.birth_date as unknown as Date, "yyyy-MM-dd"),
    };
    const response = await authRegister(payload);

    if (response?.status === "success") {
      // Reset form and navigate to email verification page
      methods.reset();
      router.push(ROUTES.auth.emailVerification);
    } else {
      // Map API validation errors to form fields
      Object.entries(apiErrors).forEach(([field, messages]) => {
        methods.setError(field as keyof RegisterSchema, {
          message: messages[0],
        });
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <section className='flex items-center justify-center min-h-screen w-full p-4'>
        <Card className='px-4 w-full max-w-md space-y-1'>
          <div className='flex flex-col'>
            <Title level={2} title='Completa la información.' />
            <p className='text-foreground/80 font-heading'>
              Es importante para nosotros que proporciones la siguiente
              información.
            </p>
          </div>
          <RegisterStepper onFinish={onFinish} />
          <p className='text-sm font-heading text-foreground/80 text-center'>
            ¿Ya tienes una cuenta?{" "}
            <Link
              href={ROUTES.auth.login}
              className='text-sm text-brand hover:underline'
            >
              Inicia sesión
            </Link>
          </p>
        </Card>
      </section>
    </FormProvider>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
