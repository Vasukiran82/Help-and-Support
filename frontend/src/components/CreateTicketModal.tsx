// src/components/CreateTicketModal.tsx

// ← Your file

import { useRef, useState } from 'react';
import { useCreateTicket } from '../hooks/useTickets';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal = ({ isOpen, onClose }: CreateTicketModalProps) => {  // ← MUST be `export const` or `export function`
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createTicket, isPending } = useCreateTicket();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('description', description);
    if (file) formData.append('attachment', file);

    createTicket(formData, {
      onSuccess: () => {
        toast.success('Ticket created!');
        onClose();
        setSubject('');
        setDescription('');
        setFile(null);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* ... your modal JSX ... */}
      <form onSubmit={handleSubmit}>
        {/* ... form fields ... */}
      </form>
    </div>
  );
};

// VERY IMPORTANT: This line MUST exist
export default CreateTicketModal; // ← or use `export const CreateTicketModal` above