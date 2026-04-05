import AuthLayout from "@/components/layouts/auth-layout";
import type {ReactElement} from "react";
import {useForm, FormProvider} from "react-hook-form";
import InputGroup from "@/components/forms/input-group";
import {Card} from "@/components/ui/card";
import Title from "@/components/ui/title";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ROUTES} from "@/routing/routes";

export default function ForgotPassword() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <section className='flex items-center justify-center min-h-screen w-full p-4'>
        <Card className='px-4 w-full max-w-md space-y-1'>
          <div className='flex flex-col'>
            <Title level={2} title='¿Olvidaste tu contraseña?' />
            <p className='text-foreground/80 font-heading'>
              Te enviaremos un código de recuperación a tu correo electrónico
              para que puedas restablecer tu contraseña.
            </p>
          </div>
          <InputGroup
            type='text'
            name='email'
            required
            label='Correo electrónico'
            placeholder='Escribe tu correo electrónico'
          />

          <Button>Enviar código</Button>

          <p className='text-center font-heading text-sm text-foreground/80'>
            ¿Recordaste tu contraseña?{" "}
            <Link
              href={ROUTES.auth.login}
              className='text-brand hover:underline font-medium'
            >
              Iniciar sesión
            </Link>
          </p>
        </Card>
      </section>
    </FormProvider>
  );
}

ForgotPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
