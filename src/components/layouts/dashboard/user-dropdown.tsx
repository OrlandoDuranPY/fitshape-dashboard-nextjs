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
import {useAuth} from "@/hooks/auth/use-auth";
import {ROUTES} from "@/routing/routes";

function UserDropdownComponent() {
  const {logout} = useAuth();
  const router = useRouter();
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
      <DropdownMenuContent align='end' className='bg-card-surface'>
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
