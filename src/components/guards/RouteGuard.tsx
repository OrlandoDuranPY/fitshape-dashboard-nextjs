import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAuthStore} from "@/lib/store/auth-store";
import {ROUTES} from "@/routing/routes";

const AUTH_ROUTES: string[] = [
  ROUTES.auth.login,
  ROUTES.auth.register,
  ROUTES.auth.emailVerification,
  ROUTES.auth.forgotPassword,
  ROUTES.auth.termsAndConditions,
  ROUTES.auth.privacyPolicy,
];

export default function RouteGuard({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  // Esperar a que el store hidrate desde localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const isAuthRoute = AUTH_ROUTES.includes(router.pathname);

    if (!isAuthenticated && !isAuthRoute) {
      router.replace(ROUTES.auth.login);
    } else if (isAuthenticated && isAuthRoute) {
      router.replace(ROUTES.home);
    }
  }, [hydrated, isAuthenticated, router.pathname]);

  // No renderizar nada hasta hidratar para evitar flash de redirección
  if (!hydrated) return null;

  const isAuthRoute = AUTH_ROUTES.includes(router.pathname);

  if (!isAuthenticated && !isAuthRoute) return null;
  if (isAuthenticated && isAuthRoute) return null;

  return <>{children}</>;
}
