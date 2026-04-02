export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",

  /* ========================================
     = Autenticacion =
  ========================================= */
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
  },
} as const;
