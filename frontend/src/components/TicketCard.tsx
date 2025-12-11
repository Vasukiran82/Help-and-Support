import { Ticket } from '../lib/api';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { StatusBadge } from './StatusBadge';
import { ChevronRight, FileText } from 'lucide-react';

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const date = formatDate(ticket.createdAt);

  return (
    <Link
      to={`/help-center/tickets/${ticket.id}`}
      className="group relative block w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      <div className="flex items-start justify-between p-5">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {ticket.subject}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: #{ticket.id.slice(-8).toUpperCase()} &bull; Created on {date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-[3.25rem]">
            <StatusBadge status={ticket.status} />
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${ticket.priority === 'HIGH'
              ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/20'
              : ticket.priority === 'MEDIUM'
                ? 'bg-orange-50 text-orange-700 ring-orange-600/10 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-400/20'
                : 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-400/20'
              }`}>
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 text-gray-400 transition-colors group-hover:text-blue-500 dark:text-gray-600">
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}
