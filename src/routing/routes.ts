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
    plansCreate: "/training/plans/create",
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
  /* ========================================
     = Account =
  ========================================= */
  account: {
    profile: "/account/profile",
    subscription: "/account/subscription",
    settings: "/account/settings",
  },
} as const;
