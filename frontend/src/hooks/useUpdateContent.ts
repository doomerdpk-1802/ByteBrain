import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useUpdateContent = () => {
  return useMutation({
    mutationFn: async (Content: {
      contentId: string;
      link: string;
      type: string;
      title: string;
      tags: string;
    }) => {
      const { data } = await api.put("/update-content", Content);

      return data;
    },
  });
};
