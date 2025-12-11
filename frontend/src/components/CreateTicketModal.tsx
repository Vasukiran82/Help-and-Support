// src/components/CreateTicketModal.tsx
import { useRef } from 'react';
import { useCreateTicket } from '../hooks/useTickets';
import { X, Upload, Loader2, AlertCircle, FileText } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  initialDescription?: string;
}

const validationSchema = Yup.object({
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
});

export const CreateTicketModal = ({ isOpen, onClose, initialSubject = '', initialDescription = '' }: CreateTicketModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createTicket, isPending } = useCreateTicket();

  const formik = useFormik({
    initialValues: {
      subject: initialSubject,
      description: initialDescription,
      file: null as File | null,
    },
    enableReinitialize: true, // Allow Formik to update when props change
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('subject', values.subject);
      formData.append('description', values.description);
      if (values.file) {
        formData.append('attachment', values.file);
      }

      createTicket(formData, {
        onSuccess: () => {
          formik.resetForm();
          // Reset file input manually as it's uncontrolled
          if (fileInputRef.current) fileInputRef.current.value = '';
          onClose();
        },
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      formik.setFieldValue('file', e.currentTarget.files[0]);
    }
  };

  const removeFile = () => {
    formik.setFieldValue('file', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800 animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-gray-800 dark:bg-gray-800/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Ticket</h2>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Submit a request and we'll get back to you.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white p-2 text-gray-400 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 ring-1 ring-gray-100 dark:ring-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-6 sm:p-8">
          <div className="space-y-6">

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                {...formik.getFieldProps('subject')}
                className={`block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-gray-900 dark:focus:ring-blue-500/20
                  ${formik.touched.subject && formik.errors.subject ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-900/50 dark:bg-red-900/10' : ''}`}
                placeholder="Brief summary of the issue"
              />
              {formik.touched.subject && formik.errors.subject && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formik.errors.subject}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                {...formik.getFieldProps('description')}
                className={`block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-gray-900 dark:focus:ring-blue-500/20
                  ${formik.touched.description && formik.errors.description ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 dark:border-red-900/50 dark:bg-red-900/10' : ''}`}
                placeholder="Please describe your issue in detail..."
              />
              {formik.touched.description && formik.errors.description && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Attachment <span className="text-xs font-normal text-gray-400">(Optional)</span>
              </label>

              {!formik.values.file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-8 transition-all hover:bg-white hover:border-blue-400 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/30 dark:hover:border-blue-500 dark:hover:bg-gray-800"
                >
                  <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-110 dark:bg-gray-800 dark:ring-gray-700">
                    <Upload className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Supported: PNG, JPG, PDF (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formik.values.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formik.values.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:shadow-none dark:hover:bg-blue-500"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
