import {ReactElement} from "react";
import {useForm, FormProvider, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {UserIcon, ShieldIcon, SaveIcon, KeyRoundIcon} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {useAuthStore} from "@/lib/store/auth-store";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import PasswordComponent from "@/components/forms/inputs/password-component";
import {Badge} from "@/components/ui/badge";

/* ========================================
   = Schemas =
========================================= */
const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  first_last_name: z.string().min(1, "El primer apellido es requerido"),
  second_last_name: z.string().optional(),
  email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "La contraseña actual es requerida"),
    new_password: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirm_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type ProfileSchema = z.infer<typeof profileSchema>;
type PasswordSchema = z.infer<typeof passwordSchema>;

/* ========================================
   = Avatar =
========================================= */
function UserAvatar({name, lastName}: {name: string; lastName: string}) {
  const initials = `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return (
    <div className='relative mx-auto size-24 rounded-full bg-gradient-to-br from-brand to-[#ff6b9d] flex items-center justify-center shadow-lg shadow-brand/30'>
      <span className='text-2xl font-bold text-white tracking-widest'>
        {initials}
      </span>
    </div>
  );
}

/* ========================================
   = Page =
========================================= */
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const profileMethods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      first_last_name: user?.first_last_name ?? "",
      second_last_name: user?.second_last_name ?? "",
      email: user?.email ?? "",
    },
  });

  const passwordMethods = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSaveProfile = (data: ProfileSchema) => {
    console.log("Update profile:", data);
  };

  const onChangePassword = (data: PasswordSchema) => {
    console.log("Change password:", data);
  };

  return (
    <div className='max-w-5xl mx-auto space-y-6'>

      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 rounded-lg bg-brand/10'>
          <UserIcon className='size-5 text-brand' />
        </div>
        <div>
          <h1 className='text-xl font-semibold'>Mi Perfil</h1>
          <p className='text-sm text-muted-foreground'>
            Administra tu información personal y seguridad
          </p>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>

        {/* Left — User summary card */}
        <Card className='lg:col-span-1 bg-card-surface'>
          <CardContent className='pt-6 flex flex-col items-center text-center gap-4'>
            <UserAvatar
              name={user?.name ?? "U"}
              lastName={user?.first_last_name ?? "U"}
            />
            <div className='space-y-1'>
              <p className='font-semibold text-lg leading-tight'>
                {user?.full_name ?? "—"}
              </p>
              <p className='text-sm text-muted-foreground'>{user?.email}</p>
            </div>
            <Badge
              variant='outline'
              className='capitalize border-brand/40 text-brand bg-brand/5 px-3 py-1 text-xs'
            >
              {user?.role ?? "usuario"}
            </Badge>

            <div className='w-full border-t pt-4 space-y-3 text-left'>
              <div className='space-y-0.5'>
                <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Nombre
                </p>
                <p className='text-sm font-medium'>{user?.name ?? "—"}</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Primer apellido
                </p>
                <p className='text-sm font-medium'>
                  {user?.first_last_name ?? "—"}
                </p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Segundo apellido
                </p>
                <p className='text-sm font-medium'>
                  {user?.second_last_name || "—"}
                </p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-xs text-muted-foreground uppercase tracking-wide'>
                  Correo
                </p>
                <p className='text-sm font-medium break-all'>
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right — Edit forms */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='datos'>
            <TabsList variant='line' className='mb-6'>
              <TabsTrigger value='datos' className='gap-2'>
                <UserIcon className='size-4' />
                Datos personales
              </TabsTrigger>
              <TabsTrigger value='seguridad' className='gap-2'>
                <ShieldIcon className='size-4' />
                Seguridad
              </TabsTrigger>
            </TabsList>

            {/* Tab: Datos personales */}
            <TabsContent value='datos'>
              <Card className='bg-card-surface'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>
                    Editar datos personales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormProvider {...profileMethods}>
                    <form
                      onSubmit={profileMethods.handleSubmit(onSaveProfile)}
                      className='space-y-5'
                    >
                      <div className='grid sm:grid-cols-2 gap-4'>
                        <Controller
                          control={profileMethods.control}
                          name='name'
                          render={({field, fieldState}) => (
                            <div className='space-y-2'>
                              <Label htmlFor='name'>
                                Nombre{" "}
                                <span className='text-red-500'>*</span>
                              </Label>
                              <Input id='name' {...field} />
                              {fieldState.error && (
                                <ErrorMessage
                                  errorMessage={fieldState.error.message!}
                                />
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          control={profileMethods.control}
                          name='first_last_name'
                          render={({field, fieldState}) => (
                            <div className='space-y-2'>
                              <Label htmlFor='first_last_name'>
                                Primer apellido{" "}
                                <span className='text-red-500'>*</span>
                              </Label>
                              <Input id='first_last_name' {...field} />
                              {fieldState.error && (
                                <ErrorMessage
                                  errorMessage={fieldState.error.message!}
                                />
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          control={profileMethods.control}
                          name='second_last_name'
                          render={({field, fieldState}) => (
                            <div className='space-y-2'>
                              <Label htmlFor='second_last_name'>
                                Segundo apellido
                              </Label>
                              <Input id='second_last_name' {...field} />
                              {fieldState.error && (
                                <ErrorMessage
                                  errorMessage={fieldState.error.message!}
                                />
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          control={profileMethods.control}
                          name='email'
                          render={({field, fieldState}) => (
                            <div className='space-y-2'>
                              <Label htmlFor='email'>
                                Correo electrónico{" "}
                                <span className='text-red-500'>*</span>
                              </Label>
                              <Input id='email' type='email' {...field} />
                              {fieldState.error && (
                                <ErrorMessage
                                  errorMessage={fieldState.error.message!}
                                />
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <div className='flex justify-end pt-2'>
                        <Button
                          type='submit'
                          className='gap-2 bg-brand hover:bg-brand/90 text-white'
                        >
                          <SaveIcon className='size-4' />
                          Guardar cambios
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Seguridad — Cambiar contraseña */}
            <TabsContent value='seguridad'>
              <Card className='bg-card-surface'>
                <CardHeader>
                  <div className='flex items-center gap-2'>
                    <KeyRoundIcon className='size-4 text-brand' />
                    <CardTitle className='text-base font-semibold'>
                      Cambiar contraseña
                    </CardTitle>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Elige una contraseña segura de al menos 8 caracteres.
                  </p>
                </CardHeader>
                <CardContent>
                  <FormProvider {...passwordMethods}>
                    <form
                      onSubmit={passwordMethods.handleSubmit(onChangePassword)}
                      className='space-y-5 max-w-sm'
                    >
                      <PasswordComponent
                        name='current_password'
                        label='Contraseña actual'
                        required
                        placeholder='Ingresa tu contraseña actual'
                      />
                      <PasswordComponent
                        name='new_password'
                        label='Nueva contraseña'
                        required
                        placeholder='Mínimo 8 caracteres'
                      />
                      <PasswordComponent
                        name='confirm_password'
                        label='Confirmar nueva contraseña'
                        required
                        placeholder='Repite tu nueva contraseña'
                      />

                      <div className='flex justify-end pt-2'>
                        <Button
                          type='submit'
                          className='gap-2 bg-brand hover:bg-brand/90 text-white'
                        >
                          <ShieldIcon className='size-4' />
                          Actualizar contraseña
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
