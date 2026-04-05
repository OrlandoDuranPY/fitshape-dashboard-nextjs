import type {ReactElement} from "react";
import {useForm, FormProvider} from "react-hook-form";
import AuthLayout from "@/components/layouts/auth-layout";
import InputGroup from "@/components/forms/input-group";
import {Card} from "@/components/ui/card";
import Title from "@/components/ui/title";
import {Button} from "@/components/ui/button";

export default function EmailVerification() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <section className='flex items-center justify-center min-h-screen w-full p-4'>
        <Card className='px-4 w-full max-w-md space-y-1'>
          <div className='flex flex-col'>
            <Title level={2} title='Verifica tu cuenta.' />
            <p className='text-foreground/80 font-heading'>
              Hemos enviado un código de verificación a tu correo electrónico.
              Por favor, ingresa el código para verificar tu cuenta.
            </p>
          </div>
          <InputGroup
            type='verification_code'
            name='code'
            required
            label='Código de verificación'
          />

          <Button>Verificar cuenta</Button>
        </Card>
      </section>
    </FormProvider>
  );
}

EmailVerification.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
