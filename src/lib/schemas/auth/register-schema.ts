import {z} from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("Ingresa un correo válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirma tu contraseña"),
    name: z.string().min(1, "El nombre es requerido"),
    first_last_name: z.string().min(1, "El primer apellido es requerido"),
    second_last_name: z.string().optional(),
    gender_id: z.string().min(1, "El género es requerido"),
    metric_system: z.enum(["metric", "imperial"], {
      error: "Selecciona un sistema métrico",
    }),
    weight: z.string().min(1, "El peso es requerido"),
    height: z.string().min(1, "La altura es requerida"),
    birth_date: z.date({error: "La fecha de nacimiento es requerida"}),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
