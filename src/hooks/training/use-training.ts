import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import type {ApiResponse} from "@/lib/api/interfaces/api-response.interface";
import type {ApiValidationError} from "@/lib/api/interfaces/api.validation-error.interface";
import type {PaginatedExercises} from "@/lib/api/interfaces/training.interface";
import {useState} from "react";
import {toast} from "sonner";

export const useTraining = () => {
  /* ========================================
       = States =
    ========================================= */
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [exercises, setExercises] = useState<PaginatedExercises | null>(null);

  /* ========================================
       = Requests =
    ========================================= */
  const getExercices = async (params?: {
    search?: string;
    category_id?: number;
    difficulty?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<PaginatedExercises> | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse<PaginatedExercises>>(
        ENDPOINTS.TRAINING.EXERCISES,
        {method: "GET", params},
      );
      if (response.status === "success") {
        setExercises(response.data ?? null);
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al obtener los ejercicios");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {isLoading, errors, exercises, getExercices};
};
