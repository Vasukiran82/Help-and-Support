// src/pages/SupportDashboard.tsx
import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { TicketCard } from '../components/TicketCard';
import { CreateTicketModal } from '../components/CreateTicketModal'; // ← This now works
import { Plus, Filter, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Define the type for your tickets (from your API)
import type { Ticket } from '../lib/api';

export default function SupportDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'All' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Correct way to call useTickets hook (it accepts an object)
  const { data, isLoading, isFetching } = useTickets(page, 10, status);

  const tabs: Array<{ label: string; value: typeof status }> = [
    { label: 'All', value: 'All' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  const pagination = data?.pagination;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/help-center"
            className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and track your support requests</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto border-b border-gray-200 pb-2 dark:border-gray-800">
        <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={clsx(
                "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
                status === tab.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Empty State */}
          {data?.tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-20 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No tickets found</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {status === 'All' ? "You haven't created any tickets yet." : `No ${status.toLowerCase()} tickets.`}
                </p>
                {status !== 'All' && (
                  <button
                    onClick={() => setStatus('All')}
                    className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Ticket List */
            <div className="space-y-4">
              {data?.tickets.map((ticket: Ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong>
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= pagination.totalPages || isFetching}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}