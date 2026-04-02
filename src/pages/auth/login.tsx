import AuthLayout from "./layouts/AuthLayout";
import type {ReactElement} from "react";
import InputGroup from "@/components/forms/input-group";
import {Card} from "@/components/ui/card";
import Title from "@/components/ui/title";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {ROUTES} from "@/routing/routes";

export default function login() {
  return (
    <section className='flex items-center justify-center min-h-screen w-full p-4'>
      <Card className='px-4 w-full max-w-md space-y-1'>
        <div className='flex flex-col'>
          <Title level={2} title='Bienvenido de nuevo' />
          <p className='text-foreground/80 font-heading'>
            Tu disciplina te llevará más lejos de lo que imaginas.
          </p>
        </div>
        <InputGroup
          type='text'
          name='email'
          required
          label='Correo electrónico'
          placeholder='Escribe tu correo electrónico'
        />
        <InputGroup
          type='password'
          name='password'
          required
          label='Contraseña'
          placeholder='Escribe tu contraseña'
        />

        <div className='flex flex-col md:flex-row md:justify-between'>
          <div className='flex gap-2 items-center'>
            <Checkbox id='remember' />
            <Label className='cursor-pointer' htmlFor='remember'>
              Recuérdame
            </Label>
          </div>
          <Link
            href={ROUTES.auth.forgotPassword}
            className='text-sm text-brand hover:underline font-heading'
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button>Iniciar sesión</Button>
        <p className='text-sm font-heading text-foreground/80 text-center'>
          ¿Aún no tienes una cuenta?{" "}
          <Link
            href={ROUTES.auth.register}
            className='text-sm text-brand hover:underline'
          >
            Regístrate
          </Link>
        </p>
      </Card>
    </section>
  );
}

login.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
