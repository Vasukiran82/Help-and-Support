// src/components/MessageBubble.tsx
import { Message } from '../lib/api';
import { Paperclip, User, Bot } from 'lucide-react';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser?: boolean; // ← THIS LINE WAS MISSING
}

export function MessageBubble({ message, isCurrentUser = false }: MessageBubbleProps) {
  const isAgent = message.senderType === 'ADMIN';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    return isToday
      ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className={clsx('flex w-full gap-4 py-3', isCurrentUser ? 'justify-end' : 'justify-start')}>
      {/* Avatar */}
      {!isCurrentUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          {isAgent ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
        </div>
      )}

      {/* Bubble */}
      <div className={clsx('max-w-md rounded-2xl px-5 py-3 shadow-md', isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border dark:border-gray-700')}>
        <p className="whitespace-pre-wrap break-words text-sm">{message.message}</p>

        {/* Attachment */}
        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              isCurrentUser
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            )}
          >
            <Paperclip className="h-4 w-4" />
            View Attachment
          </a>
        )}

        {/* Timestamp */}
        <div className={clsx('mt-2 text-xs opacity-70', isCurrentUser ? 'text-right' : 'text-left')}>
          {formatDate(message.createdAt)}
        </div>
      </div>

      {/* Current user avatar on right */}
      {isCurrentUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-white">
          <User className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}