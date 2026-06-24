import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (newUser: {
      firstName: string;
      lastName?: string;
      email: string;
      password: string;
    }) => {
      const { data } = await api.post("/signup", newUser);
      return data;
    },
  });
};
