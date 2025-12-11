// src/pages/TicketDetail.tsx
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTicket, useReplyTicket } from '../hooks/useTickets';
import { MessageBubble } from '../components/MessageBubble';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, Send, Paperclip, Loader2, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Message } from '../lib/api';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  // Poll every 30s is handled in useTicket hook
  const { data: ticket, isLoading, isError, refetch } = useTicket(id);
  const { mutate: reply, isPending: isSending } = useReplyTicket(id!);

  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom on load and when messages change
  useEffect(() => {
    if (ticket?.messages) {
      scrollToBottom();
    }
  }, [ticket?.messages?.length, ticket?.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const formData = new FormData();
    formData.append('message', message.trim());
    if (file) formData.append('attachment', file);

    reply(formData, {
      onSuccess: () => {
        setMessage('');
        setFile(null);
        // Scroll is handled by useEffect on messages change (optimistic update triggers it too)
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <X className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Failed to load ticket</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">The ticket may not exist or we encountered an error.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/help-center/tickets" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
            Back to tickets
          </Link>
          <button onClick={() => refetch()} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <Link
          to="/help-center/tickets"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                {ticket.subject}
              </h1>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-mono">#{ticket.ticketId}</span>
              <span>•</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
              <span>•</span>
              <span className={`font-medium ${ticket.priority === 'HIGH' ? 'text-red-600' :
                  ticket.priority === 'MEDIUM' ? 'text-orange-600' : 'text-gray-600'
                }`}>{ticket.priority} Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-4 shadow-inner">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Ticket Description as first message */}
          <div className="flex justify-start w-full gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-white">
              <span className="text-xs font-bold">YOU</span>
            </div>
            <div className="max-w-md rounded-2xl px-5 py-3 shadow-sm bg-white dark:bg-gray-800 border dark:border-gray-700">
              <p className="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-200">
                {ticket.description || "No description provided."}
              </p>
              <div className="mt-2 text-xs opacity-70 text-left">
                {new Date(ticket.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Conversation */}
          {ticket.messages?.map((msg: Message) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={msg.senderType === 'USER'}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Box */}
      {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' ? (
        <div className="flex-shrink-0 mt-4">
          <form onSubmit={handleSend} className="relative rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">

            {/* File Preview */}
            {file && (
              <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                  <Paperclip className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (f.size > 5 * 1024 * 1024) {
                      toast.error('File too large (max 5MB)');
                      return;
                    }
                    setFile(f);
                  }
                }}
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Write a reply..."
                className="flex-1 resize-none bg-transparent py-2.5 text-sm focus:outline-none max-h-32 min-h-[44px]"
                rows={1}
                style={{ height: 'auto', minHeight: '44px' }}
              />

              <button
                type="submit"
                disabled={isSending || (!message.trim() && !file)}
                className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-shrink-0 mt-4 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500 dark:bg-gray-900/50 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
          This ticket is <span className="font-semibold">{ticket.status.toLowerCase()}</span>. You can no longer reply.
        </div>
      )}
    </div>
  );
}
