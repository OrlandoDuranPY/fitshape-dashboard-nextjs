import {z} from "zod";

export const coachClientSchema = z
  .object({
    coach_uuid: z
      .string({error: "El entrenador es requerido"})
      .min(1, "El entrenador es requerido"),
    user_uuid: z
      .string({error: "El cliente es requerido"})
      .min(1, "El cliente es requerido"),
    start_date: z
      .string()
      .refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Formato de fecha inválido (YYYY-MM-DD)",
      )
      .optional()
      .nullable(),
    end_date: z
      .string()
      .refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Formato de fecha inválido (YYYY-MM-DD)",
      )
      .optional()
      .nullable(),
  })
  .refine(
    (data) =>
      !data.start_date ||
      !data.end_date ||
      data.end_date > data.start_date,
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["end_date"],
    },
  );

export type CoachClientSchema = z.infer<typeof coachClientSchema>;
