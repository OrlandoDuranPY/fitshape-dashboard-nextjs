import {apiRequest} from "@/lib/api/client/axios";
import {useState} from "react";

export const useCatalogs = () => {
  /* ========================================
       = States =
    ========================================= */
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [genders, setGenders] = useState<{id: string; name: string}[]>([]);

  /* ========================================
     = Requests =
  ========================================= */

  /**
   * Genders catalog
   */
  const getGenders = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest;
    } catch (err) {
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
    getGenders,
  };
};
