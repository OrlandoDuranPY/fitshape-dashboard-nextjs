export interface ApiResponse<T = Record<string, unknown>> {
  status: "success" | "error";
  status_code: number;
  message: string;
  data?: T;
}
