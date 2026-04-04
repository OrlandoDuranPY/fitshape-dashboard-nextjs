import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import {useAuthStore} from "@/lib/store/authStore";
import {useState} from "react";
import {toast} from "sonner";

/* ========================================
   = Interfaces =
========================================= */
interface ApiResponse {
  status: "success" | "error";
  status_code: number;
  message: string;
  data?: object;
}

interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// TODO: Move this to a separate file if it grows
interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  first_last_name: string;
  second_last_name?: string;
  gender_id?: number;
  metric_system: "metric" | "imperial";
  weight: number;
  height: number;
  birth_date: Date;
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
  const register = async (
    data: RegisterData,
  ): Promise<Record<string, string[]> | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        data,
      });

      if (response && response.status === "success") {
        console.log("SUCCESS", response);
      }
      return null;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error en el registro");
      setErrors(apiError.errors ?? {});
      return apiError.errors ?? {};
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
