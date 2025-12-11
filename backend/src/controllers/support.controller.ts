import { Request, Response } from "express";
import { SupportService } from "../services/support.service";
import { CreateTicketSchema, ReplyTicketSchema, TicketQuerySchema } from "../types/support.types";
import { uploadToS3 } from "../middlewares/upload.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Validate input (req.body might depend on how multer parses it, usually text fields are in body)
    // Zod parseSync/safeParse handles coercing if needed, but for files multipart/form-data
    const input = CreateTicketSchema.safeParse(req.body);
    if (input.success === false) {
      return res.status(400).json({ error: (input.error as any).errors[0].message });
    }

    // Handle file upload if present
    let file = req.file;
    let attachmentUrl = undefined;

    if (file) {
      // We need to upload to S3 here because our previous middleware might just be parsing into memory
      // The previous `upload.middleware.ts` I read (Step 35) exports `uploadToS3` function.
      // It takes req.file.
      const result = await uploadToS3(file);
      if (result) {
        attachmentUrl = result.url;
        // Hack: Modifying file object to include location for service layer compatibility if it expects it
        (file as any).location = result.url;
      }
    }

    const ticket = await SupportService.createTicket(String(req.user.id), input.data, file);
    return res.status(201).json(ticket);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const query = TicketQuerySchema.parse(req.query);
    const isAdmin = req.user.role === "admin"; // Assuming role property exists

    const result = await SupportService.getAllTickets(String(req.user.id), query, isAdmin);
    return res.json(result);
  } catch (error) {
    console.error("Get Tickets Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTicketById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await SupportService.getTicketById(id);

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    // Ownership check is handled by middleware, but good to be safe if middleware isn't used
    // However, the service `getTicketById` returns the ticket regardless of user.
    // The ownership middleware prevents this from being called if not authorized.

    return res.json(ticket);
  } catch (error) {
    console.error("Get Ticket By ID Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const replyToTicket = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;

    const input = ReplyTicketSchema.safeParse(req.body);
    if (input.success === false) {
      return res.status(400).json({ error: (input.error as any).errors[0].message });
    }

    let file = req.file;
    let attachmentUrl = undefined;
    if (file) {
      const result = await uploadToS3(file);
      if (result) attachmentUrl = result.url;
    }

    const senderType = req.user.role === "admin" ? "ADMIN" : "USER";

    await SupportService.addReply(id, senderType, input.data.message, attachmentUrl);
    return res.status(200).json({ message: "Reply added" });

  } catch (error) {
    console.error("Reply Ticket Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTicketStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticket = await SupportService.getTicketById(id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    return res.json({ status: ticket.status });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const faqs = await SupportService.getFaqs(limit);
    return res.json({ faqs });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const seedFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = [
      { title: 'How do I track my order?', content: 'You can track your order by going to the "My Orders" section in your profile. Click on the order you want to track to see its current status and estimated delivery date.' },
      { title: 'What is the return policy?', content: 'We offer a 30-day return policy for most items. If you are not satisfied with your purchase, you can return it within 30 days of receipt for a full refund or exchange. Items must be in their original condition.' },
      { title: 'How to cancel an order?', content: 'To cancel an order, go to "My Orders", select the order you wish to cancel, and click the "Cancel Order" button. Please note that orders can only be canceled if they have not yet been shipped.' },
      { title: 'Do you offer international shipping?', content: 'Yes, we ship to select international destinations. Shipping costs and delivery times vary depending on the location. You can check if we ship to your country during checkout.' },
      { title: 'How can I change my shipping address?', content: 'If your order has not been shipped yet, you can contact our support team to update your shipping address. Once the order is shipped, we cannot change the address.' },
    ];

    const { prisma } = await import("../prismaClient");
    const created = [];

    for (const faq of faqs) {
      const existing = await prisma.faq.findFirst({ where: { title: faq.title } });
      if (!existing) {
        const newFaq = await prisma.faq.create({ data: faq });
        created.push(newFaq);
      }
    }

    return res.json({ message: 'Seeding completed', created: created.length, total: faqs.length });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: "Seeding failed", details: String(error) });
  }
};
