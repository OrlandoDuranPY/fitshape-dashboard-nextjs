import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import type {ApiResponse} from "@/lib/api/interfaces/api-response.interface";
import type {ApiValidationError} from "@/lib/api/interfaces/api.validation-error.interface";
import type {PaginatedTrainingPlans} from "@/lib/api/interfaces/training.interface";
import {useState} from "react";
import {toast} from "sonner";

export const usePlans = () => {
  /* ========================================
       = States =
    ========================================= */
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [plans, setPlans] = useState<PaginatedTrainingPlans | null>(null);

  /* ========================================
     = Requests =
  ========================================= */
  const getPlans = async (params?: {
    search?: string;
    category_id?: number;
    difficulty?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<PaginatedTrainingPlans> | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse<PaginatedTrainingPlans>>(
        ENDPOINTS.TRAINING.PLANS,
        {method: "GET", params},
      );
      if (response.status === "success") {
        setPlans(response.data ?? null);
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(
        apiError.message || "Error al obtener los planes de entrenamiento",
      );
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // states
    isLoading,
    errors,
    plans,

    // methods
    getPlans,
  };
};
