import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useDeleteContent = () => {
  return useMutation({
    mutationFn: async (content: { contentId: string }) => {
      const { data } = await api.delete("/delete-content", {
        data: content,
      });

      return data;
    },
  });
};
