import {useFormContext} from "react-hook-form";
import {defineStepper} from "@stepperize/react";
import Link from "next/link";
import InputGroup from "@/components/forms/input-group";
import {StepIndicator, StepLabel, StepperActions} from "@/components/ui/stepper";
import {ROUTES} from "@/routing/routes";

const {Scoped, Stepper, useStepper, steps} = defineStepper(
  {id: "credentials", label: "Credenciales", fields: ["email", "password", "password_confirmation"]},
  {id: "profile", label: "Datos de perfil", fields: ["name", "first_last_name"]},
  {id: "preferences", label: "Preferencias", fields: ["gender_id", "metric_system"]},
  {id: "measurements", label: "Medidas iniciales", fields: ["weight", "height", "birth_date"]},
);

const genderOptions = [
  {value: "male", label: "Masculino"},
  {value: "female", label: "Femenino"},
  {value: "other", label: "Otro"},
];

const metricSystemOptions = [
  {value: "metric", label: "Métrico (kg, cm)"},
  {value: "imperial", label: "Imperial (lbs, in)"},
];

function RegisterStepperContent({onFinish}: {onFinish?: () => void}) {
  const stepper = useStepper();
  const currentIndex = stepper.state.current.index;
  const {trigger} = useFormContext();

  const handleNext = async () => {
    const fields = stepper.state.current.data.fields as unknown as string[];
    const valid = await trigger(fields);
    if (valid) stepper.navigation.next();
  };

  return (
    <div className='space-y-4'>
      <StepIndicator steps={steps} currentIndex={currentIndex} />
      <StepLabel steps={steps} currentIndex={currentIndex} />

      <Stepper.Content step='credentials'>
        <div className='space-y-5'>
          <InputGroup
            name='email'
            label='Correo electrónico'
            placeholder='Escribe tu correo electrónico'
            required
          />
          <InputGroup
            type='password'
            name='password'
            label='Contraseña'
            placeholder='Escribe tu contraseña'
            required
          />
          <InputGroup
            type='password'
            name='password_confirmation'
            label='Confirmar contraseña'
            placeholder='Escribe tu contraseña nuevamente'
            required
          />
          <p className='text-sm font-heading text-foreground/80 text-center'>
            Al continuar, aceptas los{" "}
            <Link href={ROUTES.auth.termsAndConditions} className='text-brand hover:underline'>
              Términos y condiciones
            </Link>{" "}
            y{" "}
            <Link href={ROUTES.auth.privacyPolicy} className='text-brand hover:underline'>
              Política de privacidad
            </Link>
          </p>
        </div>
      </Stepper.Content>

      <Stepper.Content step='profile'>
        <div className='space-y-5'>
          <InputGroup
            name='name'
            label='Nombre(s)'
            placeholder='Ingresa tu nombre'
            required
          />
          <InputGroup
            name='first_last_name'
            label='Primer apellido'
            placeholder='Ingresa tu primer apellido'
            required
          />
          <InputGroup
            name='second_last_name'
            label='Segundo apellido'
            placeholder='Ingresa tu segundo apellido'
          />
        </div>
      </Stepper.Content>

      <Stepper.Content step='preferences'>
        <div className='space-y-5'>
          <InputGroup
            name='gender_id'
            label='Género'
            placeholder='Selecciona tu género'
            options={genderOptions}
            type='select'
            required
          />
          <InputGroup
            name='metric_system'
            label='Sistema métrico'
            placeholder='Selecciona un sistema métrico'
            options={metricSystemOptions}
            type='select'
            required
          />
        </div>
      </Stepper.Content>

      <Stepper.Content step='measurements'>
        <div className='space-y-5'>
          <InputGroup
            name='weight'
            label='Peso'
            placeholder='Ingresa tu peso'
            type='decimal'
            required
          />
          <InputGroup
            name='height'
            label='Altura'
            placeholder='Ingresa tu altura'
            type='decimal'
            required
          />
          <InputGroup
            name='birth_date'
            label='Fecha de nacimiento'
            placeholder='Ingresa tu fecha de nacimiento'
            type='date'
            required
          />
        </div>
      </Stepper.Content>

      <StepperActions
        isFirst={stepper.state.isFirst}
        isLast={stepper.state.isLast}
        onPrev={() => stepper.navigation.prev()}
        onNext={handleNext}
        onFinish={onFinish}
      />
    </div>
  );
}

export default function RegisterStepper({onFinish}: {onFinish?: () => void}) {
  return (
    <Scoped>
      <RegisterStepperContent onFinish={onFinish} />
    </Scoped>
  );
}
