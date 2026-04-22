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
import {Button} from "@/components/ui/button";
import {usePlans} from "@/hooks/training/use-plans";

export default function CreatePlan() {
  /* ========================================
     = Stores =
  ========================================= */
  const currentUser = useAuthStore((s) => s.user);
  const isCoach = currentUser?.role === "coach";

  /* ========================================
     = Composables =
  ========================================= */
  const {isLoading, coaches, users, getCoaches, getUsers} = useCatalogs();
  const {isLoading: isLoadingPlans, errors: apiErrors, storePlan} = usePlans();

  /* ========================================
     = Form =
  ========================================= */
  const methods = useForm<TrainingPlanSchema>({
    resolver: zodResolver(trainingPlanSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      coach_uuid: isCoach ? (currentUser?.uuid ?? "") : "",
    },
  });

  const coachUuid = methods.watch("coach_uuid");

  /* ========================================
     = Effects =
  ========================================= */
  useEffect(() => {
    if (isCoach) {
      getUsers({coach_uuid: currentUser?.uuid});
    } else {
      getCoaches();
    }
  }, []);

  useEffect(() => {
    if (isCoach) return;
    methods.setValue("user_uuid", "", {shouldValidate: false});
    if (coachUuid) {
      getUsers({coach_uuid: coachUuid});
    }
  }, [coachUuid]);

  /* ========================================
     = Functions =
  ========================================= */
  const onFinish = methods.handleSubmit(async (data) => {
    const response = await storePlan(data);

    if (response?.status === "success") {
      methods.reset();
    } else {
      Object.entries(apiErrors).forEach(([field, messages]) => {
        methods.setError(field as keyof TrainingPlanSchema, {
          message: messages[0],
        });
      });
    }
  });

  return (
    <section>
      <Card>
        <div className='px-4 w-full'>
          <Title
            level={4}
            title='Datos del plan de entrenamiento.'
            className='mb-4'
          />
          <FormProvider {...methods}>
            <form onSubmit={onFinish}>
              <div className='grid lg:grid-cols-3 gap-4 mb-4'>
                {!isCoach && (
                  <InputGroup
                    name='coach_uuid'
                    label='Entrenador'
                    placeholder='Escoge un entrenador'
                    type='combobox'
                    options={coaches}
                    required
                  />
                )}
                <InputGroup
                  name='user_uuid'
                  label='Cliente'
                  placeholder={
                    isCoach || coachUuid
                      ? "Escoge un cliente"
                      : "Primero selecciona un entrenador"
                  }
                  type='combobox'
                  options={users}
                  required
                />
                <InputGroup
                  name='name'
                  label='Nombre'
                  placeholder='Escribe el nombre'
                  required
                />
                <InputGroup
                  name='days_count'
                  label='Cantidad de días'
                  placeholder='Escribe la cantidad de días'
                  required
                  type='number'
                  maxDigits={1}
                />
                <InputGroup
                  name='starts_at'
                  label='Fecha de inicio'
                  placeholder='Escoge la fecha de inicio'
                  required
                  type='date'
                />
                <InputGroup
                  name='ends_at'
                  label='Fecha de fin'
                  placeholder='Escoge la fecha de finalización'
                  required
                  type='date'
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
              </div>
              <div className='flex justify-end'>
                <Button type='submit' isLoading={isLoading || isLoadingPlans}>
                  Guardar
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Card>
    </section>
  );
}

CreatePlan.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
