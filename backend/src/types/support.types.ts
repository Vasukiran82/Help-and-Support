import { z } from "zod";

export const CreateTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const ReplyTicketSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export const TicketQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  status: z.union([
    z.literal("All"), z.literal("Open"), z.literal("OPEN"),
    z.literal("PENDING"), z.literal("RESOLVED")
  ]).default("All")
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type ReplyTicketInput = z.infer<typeof ReplyTicketSchema>;
export type TicketQueryInput = z.infer<typeof TicketQuerySchema>;
