import InputGroup from "@/components/forms/input-group";
import {Button} from "@/components/ui/button";
import {useCoachClients} from "@/hooks/training/use-coach-clients";
import type {CoachClient} from "@/lib/api/interfaces/training.interface";
import {
  editCoachClientSchema,
  type EditCoachClientSchema,
} from "@/lib/schemas/training/edit-coach-client-schema";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {X} from "lucide-react";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

/* ========================================
   = Props =
========================================= */
interface EditCoachClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  coachClient: CoachClient | null;
}

const statusOptions = [
  {value: "active", label: "Activo"},
  {value: "inactive", label: "Inactivo"},
  {value: "pending", label: "Pendiente"},
];

/* ========================================
   = Component =
========================================= */
export default function EditCoachClientDialog({
  open,
  onOpenChange,
  onSuccess,
  coachClient,
}: EditCoachClientDialogProps) {
  const {isLoading, errors: apiErrors, updateCoachClient} = useCoachClients();

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ========================================
     = Form =
  ========================================= */
  const methods = useForm<EditCoachClientSchema>({
    resolver: zodResolver(editCoachClientSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      status: "pending",
      start_date: null,
      end_date: null,
    },
  });

  /* ========================================
     = Effects =
  ========================================= */
  useEffect(() => {
    if (open && coachClient) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      methods.reset({
        status: coachClient.status,
        start_date: coachClient.start_date ?? null,
        end_date: coachClient.end_date ?? null,
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(t);
    }
  }, [open, coachClient]);

  /* ========================================
     = Handlers =
  ========================================= */
  const onSubmit = methods.handleSubmit(async (data) => {
    if (!coachClient) return;

    const response = await updateCoachClient(coachClient.id, data);

    if (response?.status === "success") {
      onOpenChange(false);
      onSuccess();
    } else {
      Object.entries(apiErrors).forEach(([field, messages]) => {
        methods.setError(field as keyof EditCoachClientSchema, {
          message: messages[0],
        });
      });
    }
  });

  if (!mounted) return null;

  return (
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
            Editar cliente
          </h2>
          {coachClient && (
            <p className='text-sm text-muted-foreground'>
              {coachClient.user_name ?? coachClient.user_email ?? "Cliente"}
            </p>
          )}
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className='grid gap-4'>
            <InputGroup
              name='status'
              label='Estado'
              type='select'
              placeholder='Selecciona el estado'
              options={statusOptions}
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
              <Button type='submit' isLoading={isLoading}>
                Guardar cambios
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
