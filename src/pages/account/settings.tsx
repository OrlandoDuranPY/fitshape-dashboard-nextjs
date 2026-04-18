import {ReactElement, useState} from "react";
import {
  SettingsIcon,
  BellIcon,
  PaletteIcon,
  ShieldIcon,
  SmartphoneIcon,
  MailIcon,
  ActivityIcon,
  MoonIcon,
  SunIcon,
  MonitorIcon,
  TrashIcon,
  LogOutIcon,
} from "lucide-react";
import {useTheme} from "next-themes";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useAuth} from "@/hooks/auth/use-auth";

/* ========================================
   = Toggle =
========================================= */
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role='switch'
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-brand" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}

/* ========================================
   = SettingRow =
========================================= */
function SettingRow({
  icon: Icon,
  label,
  description,
  control,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-between gap-4 py-3.5 border-b last:border-0'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='shrink-0 p-1.5 rounded-md bg-muted'>
          <Icon className='size-4 text-muted-foreground' />
        </div>
        <div className='min-w-0'>
          <p className='text-sm font-medium leading-tight'>{label}</p>
          {description && (
            <p className='text-xs text-muted-foreground mt-0.5 truncate'>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className='shrink-0'>{control}</div>
    </div>
  );
}

/* ========================================
   = Theme selector =
========================================= */
const THEMES = [
  {value: "light", label: "Claro", icon: SunIcon},
  {value: "dark", label: "Oscuro", icon: MoonIcon},
  {value: "system", label: "Sistema", icon: MonitorIcon},
];

function ThemeSelector() {
  const {theme, setTheme} = useTheme();
  return (
    <div className='flex gap-1.5'>
      {THEMES.map(({value, label, icon: Icon}) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
            theme === value
              ? "bg-brand text-white border-brand shadow-sm"
              : "border-border text-muted-foreground hover:text-foreground hover:border-brand/40",
          )}
        >
          <Icon className='size-3.5' />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ========================================
   = Page =
========================================= */
export default function SettingsPage() {
  const {logout} = useAuth();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    activity: true,
    marketing: false,
  });

  const toggle = (key: keyof typeof notifications) =>
    setNotifications((p) => ({...p, [key]: !p[key]}));

  return (
    <div className='max-w-2xl mx-auto space-y-6'>

      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 rounded-lg bg-brand/10'>
          <SettingsIcon className='size-5 text-brand' />
        </div>
        <div>
          <h1 className='text-xl font-semibold'>Ajustes</h1>
          <p className='text-sm text-muted-foreground'>
            Personaliza tu experiencia en FitShape
          </p>
        </div>
      </div>

      {/* Notifications */}
      <Card className='bg-card-surface'>
        <CardHeader className='pb-1'>
          <div className='flex items-center gap-2'>
            <BellIcon className='size-4 text-brand' />
            <CardTitle className='text-sm font-semibold'>
              Notificaciones
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-1'>
          <SettingRow
            icon={MailIcon}
            label='Correo electrónico'
            description='Recibe actualizaciones y resúmenes por correo'
            control={
              <Toggle
                id='notif-email'
                checked={notifications.email}
                onChange={() => toggle("email")}
              />
            }
          />
          <SettingRow
            icon={SmartphoneIcon}
            label='Notificaciones push'
            description='Alertas en tiempo real en tu dispositivo'
            control={
              <Toggle
                id='notif-push'
                checked={notifications.push}
                onChange={() => toggle("push")}
              />
            }
          />
          <SettingRow
            icon={ActivityIcon}
            label='Actividad de clientes'
            description='Notificar cuando un cliente complete una rutina'
            control={
              <Toggle
                id='notif-activity'
                checked={notifications.activity}
                onChange={() => toggle("activity")}
              />
            }
          />
          <SettingRow
            icon={BellIcon}
            label='Comunicaciones de marketing'
            description='Novedades, ofertas y actualizaciones del producto'
            control={
              <Toggle
                id='notif-marketing'
                checked={notifications.marketing}
                onChange={() => toggle("marketing")}
              />
            }
          />
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className='bg-card-surface'>
        <CardHeader className='pb-1'>
          <div className='flex items-center gap-2'>
            <PaletteIcon className='size-4 text-brand' />
            <CardTitle className='text-sm font-semibold'>Apariencia</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-1'>
          <SettingRow
            icon={MoonIcon}
            label='Tema de la interfaz'
            description='Elige entre modo claro, oscuro o según tu sistema'
            control={<ThemeSelector />}
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card className='bg-card-surface'>
        <CardHeader className='pb-1'>
          <div className='flex items-center gap-2'>
            <ShieldIcon className='size-4 text-brand' />
            <CardTitle className='text-sm font-semibold'>
              Cuenta y seguridad
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-1 space-y-2'>
          <SettingRow
            icon={LogOutIcon}
            label='Cerrar todas las sesiones'
            description='Desconecta tu cuenta en todos los dispositivos'
            control={
              <Button
                variant='outline'
                size='sm'
                className='text-xs'
                onClick={logout}
              >
                Cerrar sesiones
              </Button>
            }
          />
          <SettingRow
            icon={TrashIcon}
            label='Eliminar cuenta'
            description='Esta acción es permanente y no se puede deshacer'
            control={
              <Button
                variant='outline'
                size='sm'
                className='text-xs border-destructive/40 text-destructive hover:bg-destructive hover:text-white'
              >
                Eliminar cuenta
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
