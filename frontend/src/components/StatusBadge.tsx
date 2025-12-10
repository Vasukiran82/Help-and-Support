import { Ticket } from '../lib/api';
import clsx from 'clsx';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: Ticket['status'];
  className?: string;
}

const statusConfig = {
  OPEN: {
    label: 'Open',
    icon: Circle,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  PENDING: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  RESOLVED: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Normalize status to uppercase just in case
  const normalizedStatus = status.toUpperCase() as keyof typeof statusConfig;
  const config = statusConfig[normalizedStatus] || statusConfig.OPEN;
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
