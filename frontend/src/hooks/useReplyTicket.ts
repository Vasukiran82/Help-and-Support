// src/hooks/useReplyTicket.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';        // named import
import { toast } from 'sonner';           // correct import (no default export)

export const useReplyTicket = (ticketId: string) => {
  // MongoDB uses string IDs → change number → string
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post(`/tickets/${ticketId}/reply`, formData);
    },
    onSuccess: () => {
      // React Query v5 syntax
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      toast.success('Reply sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to send reply');
    },
  });
};