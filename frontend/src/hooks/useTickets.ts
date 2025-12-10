// src/hooks/useTickets.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import * as api from '../lib/api';
import { toast } from 'sonner';

// Types
type TicketListParams = {
  page?: number;
  limit?: number;
  status?: string;
};

// 1. FAQs
export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: api.getFaqs,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// 2. Tickets List (with pagination & filtering)
export const useTickets = (
  page = 1,
  limit = 10,
  status: string | 'All' = 'All'
) => {
  return useQuery({
    queryKey: ['tickets', { page, limit, status }],
    queryFn: () =>
      api.getTickets({
        page,
        limit,
        status: status === 'All' ? undefined : status,
      }),
    placeholderData: (previousData) => previousData, // ← This replaces keepPreviousData in v5
    staleTime: 1000 * 30, // 30 seconds
  });
};

// 3. Single Ticket (with auto-refresh)
export const useTicket = (id: string | undefined) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => api.getTicketById(id!),
    enabled: !!id,
    refetchInterval: 8000, // every 8 seconds
    staleTime: 1000 * 10,
  });
};

// 4. Create Ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createTicket,
    onSuccess: () => {
      toast.success('Ticket created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create ticket');
    },
  });
};

// 5. Reply to Ticket
export const useReplyTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => api.replyToTicket(ticketId, formData),
    onSuccess: () => {
      toast.success('Reply sent!');
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
    onError: () => {
      toast.error('Failed to send reply');
    },
  });
};