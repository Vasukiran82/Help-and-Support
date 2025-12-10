import { useFaqs } from '../hooks/useTickets';
import { FAQAccordion } from '../components/FAQAccordion';
import { Link } from 'react-router-dom';
import { LifeBuoy, MessageSquarePlus, Search } from 'lucide-react';
import { useState } from 'react';

export default function HelpCenter() {
  const { data: faqs = [], isLoading } = useFaqs();
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(search.toLowerCase()) ||
      faq.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Search our knowledge base or get in touch with our support team.
        </p>

        <div className="mx-auto mt-8 max-w-xl relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-900 dark:text-white dark:ring-gray-800 sm:text-sm sm:leading-6"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Knowledge Base</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Browse through our frequently asked questions to find quick answers to common issues.
          </p>
        </div>

        <Link
          to="/help-center/tickets"
          className="group rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 transition-all hover:shadow-md dark:from-emerald-900/20 dark:to-teal-900/20"
        >
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white transition-transform group-hover:scale-110">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Support Tickets</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Check the status of your existing tickets or create a new request for personalized assistance.
          </p>
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>
            ))}
          </div>
        ) : (
          <FAQAccordion faqs={filteredFaqs} />
        )}
      </div>
    </div>
  );
}
