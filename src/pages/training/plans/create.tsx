import DashboardLayout from "@/components/layouts/dashboard-layout";
import {Card} from "@/components/ui/card";
import Title from "@/components/ui/title";
import {ReactElement, useEffect} from "react";
import {useAuthStore} from "@/lib/store/auth-store";
import InputGroup from "@/components/forms/input-group";
import {useCatalogs} from "@/hooks/use-catalogs";
import {FormProvider, useForm} from "react-hook-form";
import {
  trainingPlanSchema,
  type TrainingPlanSchema,
} from "@/lib/schemas/training/training-plan-schema";
import {zodResolver} from "@hookform/resolvers/zod";

export default function CreatePlan() {
  /* ========================================
     = Stores =
  ========================================= */
  const {user} = useAuthStore();
  console.log(user);
  /* ========================================
     = Composables =
  ========================================= */
  const {isLoading, coaches, getCoaches} = useCatalogs();

  /* ========================================
     = Form =
  ========================================= */
  const methods = useForm<TrainingPlanSchema>({
    resolver: zodResolver(trainingPlanSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    getCoaches();
  }, []);
  return (
    <section>
      <Card>
        <div className='px-4 w-full'>
          <Title
            level={4}
            title='Datos del plan de entranamiento.'
            className='mb-4'
          />
          <FormProvider {...methods}>
            <div className='grid lg:grid-cols-3 gap-4'>
              <InputGroup
                name='user_uuid'
                label='Cliente'
                placeholder='Escoge un cliente'
                type='combobox'
                options={coaches}
                required
              />
              <InputGroup
                name='coach_uuid'
                label='Entrenador'
                placeholder='Escoge un entrenador'
                type='combobox'
                options={coaches}
                required
              />
              <InputGroup
                name='name'
                label='Nombre'
                placeholder='Escribe el nombre'
                required
              />
              <div className='lg:col-span-3'>
                <InputGroup
                  name='description'
                  label='Descripción'
                  placeholder='Escribe la descripción'
                  type='textarea'
                  maxLength={500}
                />
              </div>
              <InputGroup
                name='days_count'
                label='Cantidad de días'
                placeholder='Escribe la cantidad de días'
                required
                type='number'
                maxDigits={1}
              />
            </div>
          </FormProvider>
        </div>
      </Card>
    </section>
  );
}

CreatePlan.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
