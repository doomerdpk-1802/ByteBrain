import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useTypeContents = (type?: string) => {
  return useQuery({
    queryKey: ["contents", type],
    queryFn: async () => {
      const endpoint = type ? `/contents/${type}` : `/contents`;
      const { data } = await api.get(endpoint);
      return data.message;
    },
  });
};
