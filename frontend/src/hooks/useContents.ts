import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useContents = () => {
  return useQuery({
    queryKey: ["contents"],
    queryFn: async () => {
      const { data } = await api.get("/contents");
      return data.message;
    },
  });
};
