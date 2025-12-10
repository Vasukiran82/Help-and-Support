// src/components/FAQAccordion.tsx
import { FAQ } from '../lib/api';
import { useState } from 'react'; // ← THIS WAS BROKEN BEFORE
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <HelpCircle className="h-16 w-16 text-gray-200 dark:text-gray-800 mb-4" />
        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
          No FAQs available yet
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Check back later or contact support
        </p>
      </div>
    );
  }

  return 
    <div className="space-y-4">
    {faqs.map((faq) => (
      <div
        key={faq.id} // ← Prisma gives you `id`, not `_id`
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
      >
        <button
          onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
          className="flex w-full items-center justify-between px-6 py-5 text-left font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
          aria-expanded={openId === faq.id}
        >
          <span className="text-gray-900 dark:text-gray-100 pr-8">
            {faq.title}
          </span>
          {openId === faq.id ? (
            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
        </button>

        <div
          className={clsx(
            "transition-all duration-300 ease-in-out overflow-hidden",
            openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-5 text-sm leading-relaxed text-gray-700 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
            {faq.content}
          </div>
        </div>
      </div>
    ))}
  </div>;
}