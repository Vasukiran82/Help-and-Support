import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const prisma = new PrismaClient();

const faqData = [
  // 1. Account Management
  { category: 'Account Management', title: 'How do I create an account?', content: 'Click "Sign Up" at the top right, enter your email and password, and follow the verification steps.' },
  { category: 'Account Management', title: 'I forgot my password', content: 'Click "Forgot Password" on the login page and follow the email instructions to reset it.' },
  { category: 'Account Management', title: 'How do I change my email address?', content: 'Go to "My Account" > "Profile Settings" and update your email address.' },
  { category: 'Account Management', title: 'Can I have multiple accounts?', content: 'We recommend one account per person to track orders and rewards efficiently.' },
  { category: 'Account Management', title: 'How do I delete my account?', content: 'Please contact customer support to permanently delete your account and data.' },
  { category: 'Account Management', title: 'How do I view my order history?', content: 'Log in and go to "My Orders" to see all past and current orders.' },
  { category: 'Account Management', title: 'How do I manage my saved addresses?', content: 'Go to "My Account" > "Address Book" to add, edit, or remove shipping addresses.' },

  // 2. Orders & Tracking
  { category: 'Orders & Tracking', title: 'How do I place an order?', content: 'Browse items, add to cart, proceed to checkout, and enter shipping/payment info.' },
  { category: 'Orders & Tracking', title: 'Where is my order?', content: 'Check the status in "My Orders" or use the tracking link sent to your email.' },
  { category: 'Orders & Tracking', title: 'Can I modify my order after placing it?', content: 'Orders can be modified within 30 minutes of placement. Contact support immediately.' },
  { category: 'Orders & Tracking', title: 'How do I cancel my order?', content: 'Go to "My Orders" and select "Cancel Order" if it hasn’t shipped yet.' },
  { category: 'Orders & Tracking', title: 'Why was my order cancelled?', content: 'Orders may be cancelled due to payment issues or stock unavailability. We will refund you.' },
  { category: 'Orders & Tracking', title: 'My order is delayed', content: 'Shipping delays can happen. Check the tracking link for the latest updates.' },
  { category: 'Orders & Tracking', title: 'I received the wrong item', content: 'We apologize! Please initiate a return/exchange from "My Orders" > "Return Item".' },

  // 3. Shipping & Delivery
  { category: 'Shipping & Delivery', title: 'What are the shipping costs?', content: 'Shipping is calculated at checkout based on location and weight. Free shipping on orders over $50.' },
  { category: 'Shipping & Delivery', title: 'Do you ship internationally?', content: 'Yes, we ship to select countries. Check our shipping policy page for details.' },
  { category: 'Shipping & Delivery', title: 'How long does delivery take?', content: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 days.' },
  { category: 'Shipping & Delivery', title: 'Can I change my delivery address?', content: 'Only before the order ships. Contact support ASAP.' },
  { category: 'Shipping & Delivery', title: 'What if I am not home for delivery?', content: 'The carrier will leave a note or attempt redelivery the next day.' },
  { category: 'Shipping & Delivery', title: 'Do you offer same-day delivery?', content: 'Available in select metro areas for orders placed before 12 PM.' },

  // 4. Returns & Refunds
  { category: 'Returns & Refunds', title: 'What is your return policy?', content: 'You can return items within 30 days of receipt if they are unused and in original packaging.' },
  { category: 'Returns & Refunds', title: 'How do I return an item?', content: 'Go to "My Orders", select the item, and click "Return". Print the label and mail it.' },
  { category: 'Returns & Refunds', title: 'When will I get my refund?', content: 'Refunds are processed within 5-7 business days after we receive the return.' },
  { category: 'Returns & Refunds', title: 'Can I exchange an item?', content: 'Yes, select "Exchange" instead of "Return" in the order options.' },
  { category: 'Returns & Refunds', title: 'Do I have to pay for return shipping?', content: 'Return shipping is free for defective items. For preference returns, a fee applies.' },
  { category: 'Returns & Refunds', title: 'I lost my return label', content: 'You can reprint it from the "My Orders" section.' },

  // 5. Payments & Billing
  { category: 'Payments & Billing', title: 'What payment methods do you accept?', content: 'We accept Visa, MasterCard, PayPal, Apple Pay, and Google Pay.' },
  { category: 'Payments & Billing', title: 'Is my payment information secure?', content: 'Yes, we use SSL encryption and do not store your full card details.' },
  { category: 'Payments & Billing', title: 'My payment failed', content: 'Check your card details and billing address. Try a different payment method if issues persist.' },
  { category: 'Payments & Billing', title: 'How do I use a promo code?', content: 'Enter the code in the "Promo Code" box at checkout and click "Apply".' },
  { category: 'Payments & Billing', title: 'Can I pay with multiple cards?', content: 'Currently, we only support split payment with Gift Cards + Credit Card.' },
  { category: 'Payments & Billing', title: 'Do you offer installment plans?', content: 'Yes, we support Klarna and Afterpay for eligible orders.' },

  // 6. Products & Stock
  { category: 'Products & Stock', title: 'How do I find the right size?', content: 'Check our "Size Guide" on the product page for measurements.' },
  { category: 'Products & Stock', title: 'Will restocked items be announced?', content: 'Sign up for "Back in Stock" notifications on the product page.' },
  { category: 'Products & Stock', title: 'Are your products authentic?', content: 'Yes, we are an authorized retailer for all brands we sell.' },
  { category: 'Products & Stock', title: 'Can I pre-order items?', content: 'Select upcoming items are available for pre-order. Estimated shipping dates are listed.' },
  { category: 'Products & Stock', title: 'Do you offer gift wrapping?', content: 'Yes, select "Gift Wrap" at checkout for a small fee.' },

  // 7. Tech Support (App/Website)
  { category: 'Tech Support', title: 'The website is slow', content: 'Clear your browser cache or try a different browser.' },
  { category: 'Tech Support', title: 'I cannot add items to cart', content: 'Ensure cookies are enabled. If the issue persists, contact support.' },
  { category: 'Tech Support', title: 'The app keeps crashing', content: 'Update the app to the latest version and restart your device.' },
  { category: 'Tech Support', title: 'I am not receiving emails', content: 'Check your spam folder and ensure your email in "Profile" is correct.' },

  // 8. Membership & Loyalty
  { category: 'Membership & Loyalty', title: 'How do I join the loyalty program?', content: 'Create an account and you are automatically enrolled.' },
  { category: 'Membership & Loyalty', title: 'How do I earn points?', content: 'Earn 1 point for every $1 spent. Bonus points on birthdays.' },
  { category: 'Membership & Loyalty', title: 'How do I redeem points?', content: 'Apply points at checkout for a discount.' },
  { category: 'Membership & Loyalty', title: 'Do points expire?', content: 'Points expire after 12 months of inactivity.' },

  // 9. Gift Cards
  { category: 'Gift Cards', title: 'How do I buy a gift card?', content: 'Search "Gift Card", select the amount, and choose digital or physical delivery.' },
  { category: 'Gift Cards', title: 'How do I check my balance?', content: 'Visit the "Gift Cards" page and enter your card number/PIN.' },
  { category: 'Gift Cards', title: 'Can I reload a gift card?', content: 'No, gift cards are not reloadable currently.' },

  // 10. Privacy & Security
  { category: 'Privacy & Security', title: 'How do you use my data?', content: 'We use data to improve your experience. Read our Privacy Policy for details.' },
  { category: 'Privacy & Security', title: 'Do you share data with third parties?', content: 'Only with essential partners (shipping, payment processors).' },
  { category: 'Privacy & Security', title: 'How do I unsubscribe from emails?', content: 'Click "Unsubscribe" at the bottom of any marketing email.' },

  // 11. Stores & Locations
  { category: 'Stores & Locations', title: 'Where is the nearest store?', content: 'Use our "Store Locator" page to find branches near you.' },
  { category: 'Stores & Locations', title: 'What are store opening hours?', content: 'Hours vary by location. Check the Store Locator for specific times.' },
  { category: 'Stores & Locations', title: 'Do you offer in-store pickup?', content: 'Yes, select "Click & Collect" at checkout.' },

  // 12. Sustainability
  { category: 'Sustainability', title: 'Is your packaging eco-friendly?', content: 'Yes, we use 100% recyclable materials.' },
  { category: 'Sustainability', title: 'Do you have a recycling program?', content: 'Yes, bring old items to any store for a discount on new ones.' },

  // 13. Promotions & Discounts
  { category: 'Promotions & Discounts', title: 'Why isn\'t my code working?', content: 'Check expiration dates and minimum spend requirements.' },
  { category: 'Promotions & Discounts', title: 'Do you offer student discounts?', content: 'Yes, verify your status with StudentBeans to get 15% off.' },

  // 14. Contact Us
  { category: 'Contact Us', title: 'What is your phone number?', content: 'Call us at 1-800-123-4567 (9 AM - 6 PM EST).' },
  { category: 'Contact Us', title: 'Do you have live chat?', content: 'Yes, click the chat icon in the bottom right corner.' },

  // 15. Career
  { category: 'Career', title: 'How do I apply for a job?', content: 'Visit our "Careers" page to see open positions.' },
  { category: 'Career', title: 'Do you offer internships?', content: 'Yes, summer internships open in January.' },

  // 16. Wholesale & Partners
  { category: 'Wholesale & Partners', title: 'How do I become a supplier?', content: 'Email partners@example.com with your catalog.' },
  { category: 'Wholesale & Partners', title: 'Do you offer bulk discounts?', content: 'Yes, for orders over 50 items. Contact corporate sales.' },
];

async function main() {
  console.log('Start seeding...');

  try {
    await prisma.$transaction(
      faqData.map((faq) =>
        prisma.faq.create({
          data: {
            title: faq.title,
            content: faq.content,
          },
        })
      )
    );
    console.log(`Seeding finished. Created ${faqData.length} FAQs.`);
  } catch (e) {
    console.error('Error during seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();