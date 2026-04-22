import {apiRequest} from "@/lib/api/client/axios";
import {ENDPOINTS} from "@/lib/api/endpoints";
import type {ApiResponse} from "@/lib/api/interfaces/api-response.interface";
import type {ApiValidationError} from "@/lib/api/interfaces/api.validation-error.interface";
import {useState} from "react";
import {toast} from "sonner";

export const useCatalogs = () => {
  /* ========================================
       = States =
    ========================================= */
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [genders, setGenders] = useState<{value: string; label: string}[]>([]);
  const [coaches, setCoaches] = useState<{value: string; label: string}[]>([]);
  const [users, setUsers] = useState<{value: string; label: string}[]>([]);

  /* ========================================
     = Requests =
  ========================================= */

  /**
   * Genders catalog
   */
  const getGenders = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        ENDPOINTS.CATALOGS.GENDERS_WITHOUT_SESSION,
        {
          method: "GET",
        },
      );

      if (response && response.status === "success") {
        // Mapear al formato esperado por el select { value, label }
        const mappedGenders = (
          response.data as unknown as {id: string; name: string}[]
        ).map((gender) => ({
          value: gender.id,
          label: gender.name,
        }));
        setGenders(mappedGenders);
      }
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al cargar los géneros");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Coaches catalog
   */
  const getCoaches = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        ENDPOINTS.CATALOGS.COACHES,
        {
          method: "GET",
        },
      );

      if (response && response.status === "success") {
        const mappedCoaches = (
          response.data as unknown as {uuid: string; full_name: string}[]
        ).map((coach) => ({
          value: coach.uuid,
          label: coach.full_name,
        }));
        setCoaches(mappedCoaches);
      }
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al cargar los coaches");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Users catalog (role: user)
   */
  const getUsers = async (params?: {coach_uuid?: string}) => {
    setIsLoading(true);
    setUsers([]);
    try {
      const response = await apiRequest<ApiResponse>(
        ENDPOINTS.CATALOGS.USERS,
        {method: "GET", params},
      );

      if (response && response.status === "success") {
        const mappedUsers = (
          response.data as unknown as {uuid: string; full_name: string}[]
        ).map((u) => ({
          value: u.uuid,
          label: u.full_name,
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      const apiError = err as ApiValidationError;
      toast.error(apiError.message || "Error al cargar los usuarios");
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
    genders,
    coaches,
    users,
    // methods
    getGenders,
    getCoaches,
    getUsers,
  };
};
