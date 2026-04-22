import {z} from "zod";
import {format} from "date-fns";

const localToday = () => format(new Date(), "yyyy-MM-dd");

export const trainingPlanSchema = z
  .object({
    user_uuid: z
      .string({error: "El cliente es requerido"})
      .min(1, "El cliente es requerido"),
    coach_uuid: z
      .string({error: "El entrenador es requerido"})
      .min(1, "El entrenador es requerido")
      .optional()
      .nullable(),
    name: z
      .string({error: "El nombre es requerido"})
      .min(1, "El nombre es requerido")
      .max(255, "Máximo 255 caracteres"),
    description: z
      .string()
      .max(500, "Máximo 500 caracteres")
      .optional()
      .nullable(),
    days_count: z
      .number({error: "Debe ser un número"})
      .int("Debe ser un número entero")
      .min(1, "Mínimo 1 día")
      .max(7, "Máximo 7 días"),
    starts_at: z
      .string({error: "La fecha de inicio es requerida"})
      .min(1, "La fecha de inicio es requerida")
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Formato de fecha inválido (YYYY-MM-DD)",
      )
      .refine(
        (val) => val > localToday(),
        "La fecha de inicio debe ser posterior a hoy",
      ),
    ends_at: z
      .string({error: "La fecha de fin es requerida"})
      .min(1, "La fecha de fin es requerida")
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Formato de fecha inválido (YYYY-MM-DD)",
      ),
  })
  .refine(
    (data) => !data.ends_at || !data.starts_at || data.ends_at > data.starts_at,
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["ends_at"],
    },
  );

export type TrainingPlanSchema = z.infer<typeof trainingPlanSchema>;
