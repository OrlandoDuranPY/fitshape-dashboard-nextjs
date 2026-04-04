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
    termsAndConditions: "/auth/terms-and-conditions",
    privacyPolicy: "/auth/privacy-policy",
  },
} as const;
