import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export const useLogin = () => {
  return useMutation<LoginResponse, any, LoginFormData>({
    mutationFn: async (credentials) => {
      const { data } = await api.post("/login", credentials);
      return data;
    },
  });
};
