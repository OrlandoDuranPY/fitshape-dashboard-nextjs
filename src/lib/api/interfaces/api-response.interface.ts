export interface ApiResponse {
  status: "success" | "error";
  status_code: number;
  message: string;
  data?: object;
}
