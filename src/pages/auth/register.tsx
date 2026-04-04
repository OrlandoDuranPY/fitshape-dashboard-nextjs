import type {ReactElement} from "react";
import Link from "next/link";
import {useForm, FormProvider} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/schemas/registerSchema";
import AuthLayout from "@/components/layouts/AuthLayout";
import {Card} from "@/components/ui/card";
import Title from "@/components/ui/title";
import {ROUTES} from "@/routing/routes";
import RegisterStepper from "@/components/auth/RegisterStepper";
import {useAuth} from "@/hooks/auth/useAuth";

export default function Register() {
  const {register: authRegister} = useAuth();

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onFinish = methods.handleSubmit(async (data) => {
    const apiErrors = await authRegister(data);
    if (apiErrors) {
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
