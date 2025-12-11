// Temporary seed endpoint - add this to support.controller.ts
import { Request, Response } from "express";
import { prisma } from "../prismaClient";

export const seedFaqs = async (req: Request, res: Response) => {
    try {
        const faqs = [
            {
                title: 'How do I track my order?',
                content: 'You can track your order by going to the "My Orders" section in your profile. Click on the order you want to track to see its current status and estimated delivery date.'
            },
            {
                title: 'What is the return policy?',
                content: 'We offer a 30-day return policy for most items. If you are not satisfied with your purchase, you can return it within 30 days of receipt for a full refund or exchange. Items must be in their original condition.'
            },
            {
                title: 'How to cancel an order?',
                content: 'To cancel an order, go to "My Orders", select the order you wish to cancel, and click the "Cancel Order" button. Please note that orders can only be canceled if they have not yet been shipped.'
            },
            {
                title: 'Do you offer international shipping?',
                content: 'Yes, we ship to select international destinations. Shipping costs and delivery times vary depending on the location. You can check if we ship to your country during checkout.'
            },
            {
                title: 'How can I change my shipping address?',
                content: 'If your order has not been shipped yet, you can contact our support team to update your shipping address. Once the order is shipped, we cannot change the address.'
            },
        ];

        const created = [];
        for (const faq of faqs) {
            const existing = await prisma.faq.findFirst({ where: { title: faq.title } });

            if (!existing) {
                const newFaq = await prisma.faq.create({ data: faq });
                created.push(newFaq);
            }
        }

        return res.json({
            message: 'Seeding completed',
            created: created.length,
            total: faqs.length
        });
    } catch (error) {
        console.error('Seed error:', error);
        return res.status(500).json({ error: 'Seeding failed', details: error });
    }
};
