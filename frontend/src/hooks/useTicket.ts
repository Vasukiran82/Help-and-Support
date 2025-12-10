import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useTicket = (id?: number | null) => {
  return useQuery({
    queryKey: ["ticket", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("No id");
      const { data } = await api.get(`/tickets/${id}`);

      return data as {
        id: number;
        ticketId: string;
        subject: string;
        status: string;
        priority: string;
        createdAt: string;
        updatedAt: string;
        messages: Array<{
          id: number;
          senderType: "USER" | "ADMIN";
          message: string;
          attachmentUrl?: string | null;
          createdAt: string;
        }>;
      };
    },
  });
};
