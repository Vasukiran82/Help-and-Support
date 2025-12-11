// src/hooks/useTickets.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as api from '../lib/api';
import { toast } from 'sonner';

// 1. FAQs
export const useFaqs = (limit?: number) => {
  return useQuery({
    queryKey: ['faqs', limit],
    queryFn: () => api.getFaqs(limit),
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
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  });
};

// 3. Single Ticket (with auto-refresh)
export const useTicket = (id: string | undefined) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => api.getTicketById(id!),
    enabled: !!id,
    refetchInterval: 30000,
    staleTime: 1000 * 10,
  });
};

// 4. Create Ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => api.createTicket(formData),
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
    onMutate: async (newReplyFormData) => {
      await queryClient.cancelQueries({ queryKey: ['ticket', ticketId] });
      const previousTicket = queryClient.getQueryData<api.Ticket>(['ticket', ticketId]);

      if (previousTicket) {
        const messageContent = newReplyFormData.get('message') as string;
        const hasAttachment = !!newReplyFormData.get('attachment');

        const optimisticMessage: api.Message = {
          id: `optimistic-${Date.now()}`,
          senderType: 'USER',
          message: messageContent,
          attachmentUrl: hasAttachment ? 'uploading...' : undefined,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<api.Ticket>(['ticket', ticketId], (old: api.Ticket | undefined) => {
          if (!old) return old;
          // Check if messages exists, if not init it
          const oldMessages = old.messages || [];
          return {
            ...old,
            messages: [...oldMessages, optimisticMessage],
          };
        });
      }
      return { previousTicket };
    },
    onError: (err: any, _newTodo, context: any) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(['ticket', ticketId], context.previousTicket);
      }
      toast.error(err?.response?.data?.error || 'Failed to send reply');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
    onSuccess: () => {
      toast.success('Reply sent!');
    },
  });
};
