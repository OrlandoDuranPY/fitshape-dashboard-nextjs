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

  /* ========================================
       = Returns =
    ========================================= */
  return {
    // states
    isLoading,
    errors,
    // methods
    register,
  };
};
