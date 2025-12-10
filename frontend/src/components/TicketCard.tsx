import { Ticket } from '../lib/api';
import { StatusBadge } from './StatusBadge';
import { CalendarDays, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const date = new Date(ticket.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/help-center/tickets/${ticket.id}`}
      className="block w-full rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              #{ticket.ticketId}
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {ticket.subject}
          </h3>
        </div>
        <div className={`mt-1 flex-shrink-0 rounded px-2 py-1 text-xs font-bold ${ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            ticket.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }`}>
          {ticket.priority}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          {/* Note: We don't have message count in list API, so omitting or adding if we change API */}
        </div>
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <span>View Details</span>
          {/* Arrow or similar */}
        </div>
      </div>
    </Link>
  );
}
