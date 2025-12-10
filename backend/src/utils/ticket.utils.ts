import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const generateTicketId = async (): Promise<string> => {
  // TCK-YYYYMMDD-#### where #### is increment per day (1-based, zero padded to 4)
  const today = dayjs().format("YYYYMMDD");
  // count existing tickets today
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();
  const count = await prisma.ticket.count({
    where: {
      createdAt: {
        gte: start,
        lte: end
      }
    }
  });

  const seq = count + 1;
  const seqStr = seq.toString().padStart(4, "0");
  return `TCK-${today}-${seqStr}`;
};

export const determinePriority = (subject: string, description: string) => {
  const text = `${subject} ${description}`.toLowerCase();
  if (/\burgent\b/.test(text) || /refund/.test(text) || /not delivered|not-delivered|notdelivered/.test(text) || /stuck|lost|failed/.test(text)) {
    return "HIGH";
  }
  return "MEDIUM";
};
