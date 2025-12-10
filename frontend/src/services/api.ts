import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface FAQ {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

export interface Ticket {
    id: number;
    ticketId: string;
    subject: string;
    status: 'OPEN' | 'PENDING' | 'RESOLVED';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: number;
    senderType: 'USER' | 'ADMIN';
    message: string;
    attachmentUrl?: string | null;
    createdAt: string;
}

export interface TicketDetail extends Ticket {
    messages: Message[];
}

export const getFaqs = async () => {
    const res = await api.get<{ faqs: FAQ[] }>('/faqs');
    return res.data.faqs;
};

export const getTickets = async (status: string = 'All') => {
    const res = await api.get<{ tickets: Ticket[] }>(`/tickets?status=${status}&page=1&limit=50`);
    return res.data.tickets;
};

export const getTicket = async (id: number) => {
    const res = await api.get<TicketDetail>(`/tickets/${id}`);
    return res.data;
};

export const createTicket = async (subject: string, description: string, file?: File) => {
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('description', description);
    if (file) {
        formData.append('attachment', file);
    }
    const res = await api.post('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const replyTicket = async (id: number, message: string, file?: File) => {
    const formData = new FormData();
    formData.append('message', message);
    if (file) {
        formData.append('attachment', file);
    }
    const res = await api.post(`/tickets/${id}/reply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export default api;
