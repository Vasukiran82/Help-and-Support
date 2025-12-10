import { Request, Response, NextFunction } from "express";
import { prisma } from "../prismaClient";
import { AuthRequest } from "./auth.middleware";

export const ownershipCheck = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const ticketIdParam = req.params.id;
  if (!ticketIdParam) return res.status(400).json({ error: "Invalid ticket id" });

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketIdParam } });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (req.user?.role === "admin" || ticket.userId === String(req.user?.id)) {
      (req as any).ticket = ticket;
      return next();
    }

    return res.status(403).json({ error: "Forbidden" });
  } catch (error) {
    console.error("Ownership check error:", error);
    return res.status(400).json({ error: "Invalid ticket ID format" });
  }
};
