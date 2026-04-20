import axios from "axios";
import { getAuthHeaders, getStoredUser } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5119/api",
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders(); // Authorization header'ını alır
  const user = getStoredUser(); // LocalStorage'dan kullanıcıyı alır

  config.headers = {
    ...((config.headers as any) ?? {}),
    ...headers,
    "X-User-Role": user?.role || "", // Backend'in beklediği özel header
  } as any;
  
  return config;
});

export default api;