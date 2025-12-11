// src/services/support.service.ts
import { prisma } from "../prismaClient";
import { CreateTicketInput } from "../types/support.types";
import { SupportPriority, SupportStatus } from "@prisma/client";
import dayjs from "dayjs";

const generateTicketId = async (): Promise<string> => {
  const today = dayjs().format("YYYYMMDD");
  const startOfDay = dayjs().startOf("day").toDate();
  const endOfDay = dayjs().endOf("day").toDate();

  const count = await prisma.ticket.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(count + 1).padStart(4, "0");
  return `TCK-${today}-${sequence}`;
};

const determinePriority = (subject: string, description: string): SupportPriority => {
  const text = `${subject} ${description}`.toLowerCase();
  const highKeywords = [
    "urgent", "refund", "not delivered", "emergency", "failed",
    "stuck", "lost", "broken", "cancel", "charge", "payment", "missing"
  ];

  return highKeywords.some(kw => text.includes(kw))
    ? SupportPriority.HIGH
    : SupportPriority.MEDIUM;
};

export const SupportService = {
  createTicket: async (
    userId: string,
    input: CreateTicketInput,
    file?: Express.Multer.File & { location?: string }
  ) => {
    const ticketId = await generateTicketId();
    const priority = determinePriority(input.subject, input.description);
    const attachmentUrl = file?.location;

    return await prisma.ticket.create({
      data: {
        ticketId,
        userId,
        subject: input.subject,
        description: input.description,
        priority,
        status: SupportStatus.OPEN,
        messages: {
          create: {
            senderId: userId,
            senderType: "USER",
            message: input.description,
            attachmentUrl,
          },
        },
      },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        user: { select: { name: true, email: true } },
      },
    });
  },

  getAllTickets: async (
    userId: string,
    query: { page?: number; limit?: number; status?: string },
    isAdmin: boolean = false
  ) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = isAdmin ? {} : { userId };

    if (query.status && query.status !== "All") {
      where.status = query.status.toUpperCase();
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ticketId: true,
          subject: true,
          status: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { messages: true },
          },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getTicketById: async (id: string) => {
    return await prisma.ticket.findUnique({
      where: { id }, // ← use `id`, not `_id`
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });
  },

  addReply: async (
    ticketId: string,
    senderType: "USER" | "ADMIN",
    message: string,
    attachmentUrl?: string,
    senderId?: string
  ) => {
    return await prisma.$transaction([
      prisma.ticketMessage.create({
        data: {
          ticketId,
          senderId: senderId || null,
          senderType,
          message,
          attachmentUrl,
        },
      }),
      prisma.ticket.update({
        where: { id: ticketId }, // ← use `id`
        data: { updatedAt: new Date() },
      }),
    ]);
  },

  updateStatus: async (ticketId: string, status: SupportStatus) => {
    return await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });
  },

  getFaqs: async (limit?: number) => {
    return await prisma.faq.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};