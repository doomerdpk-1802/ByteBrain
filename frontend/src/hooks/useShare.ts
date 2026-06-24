import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useShare = () => {
  return useMutation({
    mutationFn: async (content: { contentId: string; share: boolean }) => {
      const { data } = await api.post("/share", content);
      return data;
    },
  });
};
