import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useContent = () => {
  return useMutation({
    mutationFn: async (newContent: {
      link: string;
      title: string;
      tags: string;
      linkText: string;
      type: string;
    }) => {
      const { data } = await api.post("/content", newContent);

      return data;
    },
  });
};
