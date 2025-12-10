// src/hooks/useCreateTicket.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api'; // ← use named import!
import { toast } from 'sonner';     // ← correct import (sonner has no default export)

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/tickets', formData);
      return data;
    },
    onSuccess: () => {
      // Correct way for React Query v5
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create ticket');
    },
  });
};