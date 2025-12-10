// src/pages/TicketDetail.tsx
import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTicket, useReplyTicket } from '../hooks/useTickets';
import { MessageBubble } from '../components/MessageBubble';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, Send, Paperclip, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Message, Ticket } from '../lib/api';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id);
  const { mutate: reply, isPending: isSending } = useReplyTicket(id!);

  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        setTimeout(scrollToBottom, 100);
        toast.success('Reply sent!');
      },
      onError: () => {
        toast.error('Failed to send reply');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">Ticket not found</p>
        <Link to="/help-center/tickets" className="mt-4 text-blue-600 hover:underline">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-6 dark:border-gray-700">
        <Link
          to="/help-center/tickets"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Link>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
                {ticket.subject}
              </h1>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>#{ticket.ticketId}</span>
              <span>•</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {ticket.messages?.map((msg: Message) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              // Simple: if senderType is USER → it's current user
              isCurrentUser={msg.senderType === 'USER'}
            />
          )) || (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Box */}
      {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
        <div className="mt-6">
          <form onSubmit={handleSend} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                  if (f && f.size > 5 * 1024 * 1024) {
                    toast.error('File too large (max 5MB)');
                    return;
                  }
                  setFile(f || null);
                }}
              />

              <div className="flex-1">
                {file && (
                  <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm dark:bg-blue-900/30">
                    <span className="truncate font-medium text-blue-700 dark:text-blue-300">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
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
                  className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isSending || (!message.trim() && !file)}
                className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          This ticket is {ticket.status.toLowerCase()}. You can no longer reply.
        </div>
      )}
    </div>
  );
}