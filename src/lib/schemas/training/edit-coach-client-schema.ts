import {z} from "zod";

export const editCoachClientSchema = z
  .object({
    status: z.enum(["active", "inactive", "pending"], {
      error: "El estado es requerido",
    }),
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

export type EditCoachClientSchema = z.infer<typeof editCoachClientSchema>;
