import { z } from "zod";

export const listTicketsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  status: z.string().optional().transform(s => s ?? "All")
    .refine(s => ["All","Open","OPEN","PENDING","RESOLVED"].includes(s), { message: "Invalid status" })
});

export const createTicketSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1)
  // attachment handled via multipart file
});

export const replyTicketSchema = z.object({
  message: z.string().min(1)
});
