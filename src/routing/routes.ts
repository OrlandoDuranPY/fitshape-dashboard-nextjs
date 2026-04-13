export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",

  /* ========================================
     = Autenticacion =
  ========================================= */
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    emailVerification: "/auth/email-verification",
    forgotPassword: "/auth/forgot-password",
    termsAndConditions: "/auth/terms-and-conditions",
    privacyPolicy: "/auth/privacy-policy",
  },
  /* ========================================
     = Training =
  ========================================= */
  training: {
    plans: "/training/plans",
    routines: "/training/routines",
    coachees: "/training/coachees",
    exercises: "/training/exercises",
  },
  /* ========================================
     = Nutrition =
  ========================================= */
  nutrition: {
    foods: "/nutrition/foods",
  },
} as const;
