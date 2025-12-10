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
    const faqs = await SupportService.getFaqs();
    return res.json({ faqs });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
