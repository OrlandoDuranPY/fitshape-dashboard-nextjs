import InputGroup from "@/components/forms/input-group";
import {Button} from "@/components/ui/button";
import {useCoachClients} from "@/hooks/training/use-coach-clients";
import {useCatalogs} from "@/hooks/use-catalogs";
import {
  coachClientSchema,
  type CoachClientSchema,
} from "@/lib/schemas/training/coach-client-schema";
import {useAuthStore} from "@/lib/store/auth-store";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {X} from "lucide-react";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

/* ========================================
   = Props =
========================================= */
interface LinkClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/* ========================================
   = Component =
========================================= */
export default function LinkClientDialog({
  open,
  onOpenChange,
  onSuccess,
}: LinkClientDialogProps) {
  const {isLoading: loadingCatalog, coaches, users, getCoaches, getUsers} = useCatalogs();
  const {isLoading, errors: apiErrors, storeCoachClient} = useCoachClients();
  const currentUser = useAuthStore((s) => s.user);
  const isCoach = currentUser?.role === "coach";

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ========================================
     = Form =
  ========================================= */
  const methods = useForm<CoachClientSchema>({
    resolver: zodResolver(coachClientSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      coach_uuid: isCoach ? (currentUser?.uuid ?? "") : "",
      user_uuid: "",
      start_date: null,
      end_date: null,
    },
  });

  /* ========================================
     = Effects =
  ========================================= */
  const coachUuid = methods.watch("coach_uuid");

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      if (isCoach) {
        methods.reset({
          coach_uuid: currentUser?.uuid ?? "",
          user_uuid: "",
          start_date: null,
          end_date: null,
        });
        getUsers();
      } else {
        getCoaches();
        methods.reset();
      }
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (isCoach) return;
    methods.setValue("user_uuid", "", {shouldValidate: false});
    if (coachUuid) {
      getUsers();
    }
  }, [coachUuid]);

  /* ========================================
     = Handlers =
  ========================================= */
  const onSubmit = methods.handleSubmit(async (data) => {
    const response = await storeCoachClient(data);

    if (response?.status === "success") {
      methods.reset();
      onOpenChange(false);
      onSuccess();
    } else {
      Object.entries(apiErrors).forEach(([field, messages]) => {
        methods.setError(field as keyof CoachClientSchema, {
          message: messages[0],
        });
      });
    }
  });

  if (!mounted) return null;

  return (
    /* Overlay — cierra solo cuando el click fue directo sobre el fondo */
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "transition-opacity duration-150",
        visible ? "bg-black/10 backdrop-blur-xs opacity-100" : "opacity-0",
      )}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      {/* Panel */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/10 mx-4",
          "transition-all duration-150",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        )}
      >
        {/* Close button */}
        <button
          type='button'
          onClick={() => onOpenChange(false)}
          className='absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'
          aria-label='Cerrar'
        >
          <X className='size-4' />
        </button>

        {/* Header */}
        <div className='mb-4 flex flex-col gap-1 pr-6'>
          <h2 className='font-heading text-base font-medium leading-none'>
            Vincular cliente
          </h2>
          <p className='text-sm text-muted-foreground'>
            Selecciona el usuario que deseas vincular como tu cliente.
          </p>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className='grid gap-4'>
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
              placeholder={isCoach || coachUuid ? "Escoge un cliente" : "Primero selecciona un entrenador"}
              type='combobox'
              options={users}
              required
            />
            <InputGroup
              name='start_date'
              label='Fecha de inicio'
              placeholder='Selecciona la fecha de inicio'
              type='date'
            />
            <InputGroup
              name='end_date'
              label='Fecha de fin'
              placeholder='Selecciona la fecha de fin'
              type='date'
            />

            {/* Footer */}
            <div className='-mx-4 -mb-4 flex justify-end rounded-b-xl border-t bg-muted/50 px-4 py-3'>
              <Button
                type='submit'
                isLoading={isLoading || loadingCatalog}
              >
                Vincular
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
