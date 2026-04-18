import {UserInterface} from "@/interfaces/user-interface";
import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import type {ApiResponse} from "@/lib/api/interfaces/api-response.interface";
import type {ApiValidationError} from "@/lib/api/interfaces/api.validation-error.interface";
import {useAuthStore} from "@/lib/store/auth-store";
import {useState} from "react";
import {toast} from "sonner";

/* ========================================
   = Interfaces =
========================================= */

// TODO: Move this to a separate file if it grows
interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  first_last_name: string;
  second_last_name?: string;
  gender_id?: string;
  metric_system: "metric" | "imperial";
  weight: string;
  height: string;
  birth_date: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  /* ========================================
       = States =
    ========================================= */
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const {setSession, clearSession} = useAuthStore();

  /* ========================================
       = Requests =
    ========================================= */

  /**
   * Register a new user.
   */
  const register = async (data: RegisterData): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        data,
      });

      if (response && response.status === "success") {
        toast.success(response.message || "Registro exitoso");
      }

      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error en el registro");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login
   */
  const login = async (
    data: LoginData,
  ): Promise<ApiResponse<{
    user: UserInterface;
    access_token: string;
  }> | null> => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiRequest<
        ApiResponse<{user: UserInterface; access_token: string}>
      >(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        data,
      });

      if (response && response.status === "success") {
        toast.success(response.message || "Inicio de sesión exitoso");
        if (response.data?.user && response.data?.access_token) {
          setSession(response.data.user, response.data.access_token);
        }
      }

      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al iniciar sesión");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Forgot password
   */
  const forgotPassword = async (email: string): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(
        ENDPOINTS.AUTH.FORGOT_PASSWORD,
        {
          method: "POST",
          data: {email},
        },
      );

      if (response && response.status === "success") {
        toast.success(response.message || "Correo de recuperación enviado");
      }

      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(
        apiError.message || "Error al enviar el correo de recuperación",
      );
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async (): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
      });

      if (response && response.status === "success") {
        toast.success(response.message || "Cerrar sesión exitoso");
      }

      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al cerrar sesión");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      clearSession();
      setIsLoading(false);
    }
  };

  /* ========================================
       = Returns =
    ========================================= */
  return {
    // states
    isLoading,
    errors,
    // methods
    register,
    login,
    forgotPassword,
    logout,
  };
};
