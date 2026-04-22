import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import type {ApiResponse} from "@/lib/api/interfaces/api-response.interface";
import type {ApiValidationError} from "@/lib/api/interfaces/api.validation-error.interface";
import type {PaginatedCoachClients} from "@/lib/api/interfaces/training.interface";
import {useState} from "react";
import {toast} from "sonner";

/* ========================================
   = Interfaces =
========================================= */
interface StoreCoachClientData {
  coach_uuid: string;
  user_uuid: string;
  start_date?: string | null;
  end_date?: string | null;
}

interface UpdateCoachClientData {
  status: "active" | "inactive" | "pending";
  start_date?: string | null;
  end_date?: string | null;
}

export const useCoachClients = () => {
  /* ========================================
     = States =
  ========================================= */
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [coachClients, setCoachClients] =
    useState<PaginatedCoachClients | null>(null);

  /* ========================================
     = Requests =
  ========================================= */

  const getCoachClients = async (params?: {
    search?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<PaginatedCoachClients> | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse<PaginatedCoachClients>>(
        ENDPOINTS.TRAINING.COACH_CLIENTS,
        {method: "GET", params},
      );
      if (response.status === "success") {
        setCoachClients(response.data ?? null);
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al obtener los clientes");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const storeCoachClient = async (
    data: StoreCoachClientData,
  ): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(
        ENDPOINTS.TRAINING.COACH_CLIENTS,
        {method: "POST", data},
      );
      if (response?.status === "success") {
        toast.success(response.message || "Cliente vinculado correctamente");
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al vincular el cliente");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCoachClient = async (
    id: number,
    data: UpdateCoachClientData,
  ): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(
        `${ENDPOINTS.TRAINING.COACH_CLIENTS}/${id}`,
        {method: "PATCH", data},
      );
      if (response?.status === "success") {
        toast.success(response.message || "Cliente actualizado correctamente");
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al actualizar el cliente");
      setErrors(apiError.errors ?? {});
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoachClient = async (id: number): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiRequest<ApiResponse>(
        `${ENDPOINTS.TRAINING.COACH_CLIENTS}/${id}`,
        {method: "DELETE"},
      );
      if (response?.status === "success") {
        toast.success(response.message || "Cliente desvinculado correctamente");
      }
      return response;
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al desvincular el cliente");
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
    coachClients,
    // methods
    getCoachClients,
    storeCoachClient,
    updateCoachClient,
    removeCoachClient,
  };
};
