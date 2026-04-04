import axios, {type AxiosRequestConfig, type AxiosResponse} from "axios";
import {useAuthStore} from "../store/authStore";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_API_BASE_URL
    : process.env.NEXT_PUBLIC_DEV_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor — inject token on every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — unwrap data, normalize errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // const message =
    //   error.response?.data?.message ?? error.message ?? "Error en la petición";
    // return Promise.reject(new Error(message));
    return Promise.reject(error.response?.data ?? error);
  },
);

export type ApiRequestConfig = AxiosRequestConfig & {
  params?: Record<string, string | number | boolean | undefined>;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestConfig = {},
): Promise<T> {
  // Strip undefined param values so they don't end up in the query string
  if (options.params) {
    options.params = Object.fromEntries(
      Object.entries(options.params).filter(([, v]) => v !== undefined),
    );
  }

  const response = await apiClient.request<T>({
    url: endpoint,
    ...options,
  });

  return response.data;
}

export default apiClient;
