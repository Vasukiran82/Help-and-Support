import { Router } from "express";
import { createTicket, getTickets, getTicketById, replyToTicket, getTicketStatus, getFaqs } from "../controllers/support.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { ownershipCheck } from "../middlewares/ownership.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Public Routes
router.get("/faqs", getFaqs);

// Protected Routes
router.use(authenticate);

router.get("/tickets", getTickets);
router.post("/tickets", upload.single("attachment"), createTicket);

// Ticket Specific Routes
router.get("/tickets/:id", ownershipCheck, getTicketById);
router.post("/tickets/:id/reply", ownershipCheck, upload.single("attachment"), replyToTicket);
router.get("/tickets/:id/status", ownershipCheck, getTicketStatus);

export default router;
