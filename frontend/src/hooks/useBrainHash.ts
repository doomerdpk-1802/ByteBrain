import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useParams } from "react-router-dom";

export const useBrainHash = () => {
  const { hash } = useParams();

  return useQuery({
    queryKey: ["shared-brain", hash],
    queryFn: async () => {
      const { data } = await api.get(`/brain/${hash}`);
      return data.message;
    },
  });
};
