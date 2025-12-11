// src/lib/api/index.ts
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Optional: auto-add JWT token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types — these are the ones your frontend expects
export interface FAQ {
  id: string;           // Prisma maps MongoDB _id → id
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  description?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}

// API functions
export const getFaqs = async (limit?: number): Promise<FAQ[]> => {
  const res = await api.get('/faqs', { params: { limit } });
  return res.data.faqs || res.data;
};

export const getTickets = async (params?: any) => {
  const res = await api.get('/tickets', { params });
  return res.data;
};

export const getTicketById = async (id: string): Promise<Ticket> => {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
};

export const createTicket = (formData: FormData) =>
  api.post('/tickets', formData);

export const replyToTicket = (id: string, formData: FormData) =>
  api.post(`/tickets/${id}/reply`, formData);

// Export the axios instance too
export { api };

// Optional: default export if you prefer `import api from ...`
export default api;