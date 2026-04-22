import Image from "next/image";
import {useRouter} from "next/router";
import {CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {useAuth} from "@/hooks/auth/use-auth";
import {useAuthStore} from "@/lib/store/auth-store";
import {ROUTES} from "@/routing/routes";

/* ========================================
   = Role label + style map =
========================================= */
const roleConfig: Record<string, {label: string; className: string}> = {
  super_admin: {
    label: "Super Admin",
    className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  admin: {
    label: "Admin",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  coach: {
    label: "Coach",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  user: {
    label: "Usuario",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
};

/* ========================================
   = Component =
========================================= */
function UserDropdownComponent() {
  const {logout} = useAuth();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);

  const role = currentUser?.role ?? "";
  const roleCfg = roleConfig[role] ?? {label: role, className: "bg-muted text-muted-foreground"};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='relative size-8 shrink-0 hover:cursor-pointer'>
          <Image
            src='/assets/img/user.jpg'
            alt='User'
            width={100}
            height={100}
            className='rounded-full'
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-card-surface w-56'>
        {/* User info header */}
        <div className='px-2 py-2 flex flex-col gap-1'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-sm font-medium leading-none truncate'>
              {currentUser?.full_name ?? "—"}
            </p>
            <Badge className={roleCfg.className}>{roleCfg.label}</Badge>
          </div>
          <p className='text-xs text-muted-foreground truncate'>
            {currentUser?.email ?? ""}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(ROUTES.account.profile)}>
          <UserIcon />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(ROUTES.account.subscription)}
        >
          <CreditCardIcon />
          Suscripción
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(ROUTES.account.settings)}>
          <SettingsIcon />
          Ajustes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onClick={logout}>
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdownComponent;
