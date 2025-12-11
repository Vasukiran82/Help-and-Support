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
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export interface Ticket {
    id: string;
    ticketId: string;
    subject: string;
    status: 'OPEN' | 'PENDING' | 'RESOLVED';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
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

export const getTickets = async (params: { page?: number; limit?: number; status?: string } = {}) => {
    const { page = 1, limit = 10, status = 'All' } = params;
    const res = await api.get<{ tickets: Ticket[] }>(`/tickets`, {
        params: { page, limit, status }
    });
    return res.data; // Note: Backend returns { tickets, pagination }. We might need to adjust or just return tickets.
    // Based on useTickets, it seems to expect just tickets or the whole object.
    // Let's check useTickets again. It accesses `data.tickets`.
    // So if we return `res.data`, the hook gets `{ tickets, pagination }`.
    // The hook in useTickets.ts: `const { data: ticketsData } = useTickets(...)`.
    // Then `ticketsData?.tickets`.
    // So `getTickets` should return the full response data structure.
};

export const getTicket = async (id: string) => {
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

export const replyTicket = async (id: string, message: string, file?: File) => {
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
