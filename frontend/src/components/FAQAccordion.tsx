// src/components/FAQAccordion.tsx
import { FAQ } from '../lib/api';
import { useState } from 'react';
import { ChevronDown, HelpCircle, FileQuestion } from 'lucide-react';
import clsx from 'clsx';

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="p-4 bg-gray-50 rounded-full mb-3">
          <HelpCircle className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-base font-medium text-gray-900">
          No FAQs available
        </p>
        <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
          We couldn't find any common questions at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className={clsx(
              "group rounded-xl border transition-all duration-200 overflow-hidden",
              isOpen
                ? "bg-white border-blue-100 shadow-md ring-1 ring-blue-500/10"
                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
            )}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-start justify-between p-4 sm:p-5 text-left bg-white"
              aria-expanded={isOpen}
            >
              <div className="flex gap-4">
                <div className={clsx(
                  "mt-0.5 min-w-[20px] transition-colors duration-200",
                  isOpen ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                )}>
                  <FileQuestion className="h-5 w-5" />
                </div>
                <span className={clsx(
                  "text-sm sm:text-base font-medium transition-colors duration-200",
                  isOpen ? "text-blue-700" : "text-gray-900 group-hover:text-gray-800"
                )}>
                  {faq.title}
                </span>
              </div>

              <div className={clsx(
                "ml-4 p-1 rounded-full transition-all duration-300 flex-shrink-0",
                isOpen ? "bg-blue-50 text-blue-600 rotate-180" : "text-gray-400 group-hover:bg-gray-50"
              )}>
                <ChevronDown className="h-5 w-5" />
              </div>
            </button>

            <div
              className={clsx(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-0 pl-[3.25rem]"> {/* Align with text, skipping icon width */}
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    {faq.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })
      }
    </div>
  );
}
