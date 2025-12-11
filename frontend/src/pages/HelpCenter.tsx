import { useFaqs, useTickets } from '../hooks/useTickets';
import { FAQAccordion } from '../components/FAQAccordion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageSquareText, Phone, Mail, ChevronRight, ArrowLeft } from 'lucide-react'; // Changed MessageSquare to MessageSquareText
import { useState } from 'react';
import { ContactOption } from '../components/ContactOption';
import { StatusBadge } from '../components/StatusBadge';

export default function HelpCenter() {
  const { data: faqs = [], isLoading: isLoadingFaqs } = useFaqs(5);
  // Fetch recent tickets (limit 3)
  const { data: ticketsData, isLoading: isLoadingTickets } = useTickets(1, 3);
  const recentTickets = ticketsData?.tickets || [];

  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(search.toLowerCase()) ||
      faq.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1 text-center pr-9">Help & Support</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-lg mx-auto w-full">

        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 pb-0">
            <h2 className="text-base font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          </div>
          {isLoadingFaqs ? (
            <div className="space-y-4 p-4">
              {[1, 2].map(i => (
                <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-100"></div>
              ))}
            </div>
          ) : (
            <FAQAccordion faqs={filteredFaqs} />
          )}
        </div>

        {/* Get in Touch */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 pb-0">
            <h2 className="text-base font-bold text-gray-900 mb-2">Get in Touch</h2>
          </div>
          <div className="flex flex-col">
            <ContactOption
              icon={MessageSquareText}
              title="Live Chat"
              subtitle="Available 24/7"
              onClick={() => console.log('Live chat clicked')}
            />
            <ContactOption
              icon={Phone}
              title="Call Support"
              subtitle="Mon-Fri, 9am - 6pm"
              onClick={() => window.location.href = 'tel:+1234567890'}
            />
            <ContactOption
              icon={Mail}
              title="Email Us"
              subtitle="Response within 24 hours"
              onClick={() => window.location.href = 'mailto:support@example.com'}
            />
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Tickets</h2>
            <Link to="/help-center/tickets" className="text-xs font-semibold text-orange-500 hover:text-orange-600">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingTickets ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-gray-100"></div>
                ))}
              </div>
            ) : recentTickets && recentTickets.length > 0 ? (
              recentTickets.map(ticket => (
                <Link
                  key={ticket.id}
                  to={`/help-center/tickets/${ticket.id}`}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ticket.subject} <span className="text-xs text-gray-500">#{ticket.id.slice(-8).toUpperCase()}</span>
                    </p>
                    <p className="text-xs text-gray-500">Ticket ID: {ticket.id.slice(0, 6).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ticket.status} />
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                No recent tickets found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
