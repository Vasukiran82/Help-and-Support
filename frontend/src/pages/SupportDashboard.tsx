// src/pages/SupportDashboard.tsx
import { useState, useEffect } from 'react';
import { useTickets } from '../hooks/useTickets';
import { TicketCard } from '../components/TicketCard';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { Plus, Filter, ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import type { Ticket } from '../lib/api';

const STATUS_OPTIONS: Array<{ label: string; value: 'All' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' }> = [
  { label: 'All Tickets', value: 'All' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' },
];

export default function SupportDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'All' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialSubject, setInitialSubject] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // useTickets hook handles the query params
  const { data, isLoading, isFetching } = useTickets(page, 10, status);

  const pagination = data?.pagination; // Ensure backend returns this structure

  // Handle URL params for creating ticket from FAQ
  useEffect(() => {
    const create = searchParams.get('create');
    const subject = searchParams.get('subject');

    if (create === 'true') {
      if (subject) setInitialSubject(subject);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInitialSubject('');
    // specific to clearing the query params without reloading
    setSearchParams(params => {
      params.delete('create');
      params.delete('subject');
      return params;
    });
  };

  const selectedStatusLabel = STATUS_OPTIONS.find(o => o.value === status)?.label;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Navigation / Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/help-center"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <div className="rounded-full bg-gray-100 p-1 group-hover:bg-gray-200 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Help Center
          </Link>
        </nav>

        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Support Tickets
            </h1>
            <p className="text-base text-gray-600">
              Track the status of your requests and inquiries.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Create New Ticket
          </button>
        </div>

        {/* Filters & Content Area */}
        <div className="space-y-6">

          {/* Filter Bar */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-5">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setTimeout(() => setIsFilterOpen(false), 200);
                  }
                }}
                className="group flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <Filter className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                <span>{selectedStatusLabel}</span>
                <ChevronDown className={clsx("h-4 w-4 text-gray-400 transition-transform duration-200", isFilterOpen && "rotate-180")} />
              </button>

              {/* Custom Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-20 animate-in fade-in zoom-in-95 duration-100">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatus(option.value);
                        setPage(1);
                        setIsFilterOpen(false);
                      }}
                      className={clsx(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        status === option.value
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {option.label}
                      {status === option.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{(page - 1) * 10 + 1}-{Math.min(page * 10, data?.pagination?.total || 0)}</span> of <span className="font-semibold text-gray-900">{data?.pagination?.total || 0}</span>
            </div>
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-2xl bg-white/50 border border-dashed border-gray-200">
              {/* Simplified loader since Loader2 import was removed, or just re-add it if needed. But existing code had removed it. Using text for now or simple div */}
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-gray-500">Loading tickets...</p>
            </div>
          ) : data?.tickets?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center">
              <div className="mb-4 rounded-full bg-blue-50 p-4">
                <Filter className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No tickets found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                {status === 'All'
                  ? "You haven't created any support tickets yet. Need help? Create one now."
                  : `There are no ${status.toLowerCase().replace('_', ' ')} tickets in your history.`}
              </p>
              {status !== 'All' && (
                <button
                  onClick={() => setStatus('All')}
                  className="mt-6 font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
              {data?.tickets?.map((ticket: Ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}

          {/* Pagination Implementation */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Previous
              </button>
              <div className="text-sm font-medium text-gray-700">
                Page {page} of {pagination.totalPages}
              </div>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= pagination.totalPages || isFetching}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Create Modal */}
        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialSubject={initialSubject}
        />
      </div>
    </div>
  );
}
