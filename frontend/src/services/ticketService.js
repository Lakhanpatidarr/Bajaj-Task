import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ticketService = {
  getTickets: async (filters = {}) => {
    const params = {};
    if (filters.priority) {
      params.priority = filters.priority;
    }
    if (filters.breached) {
      params.breached = 'true';
    }
    
    const response = await axios.get(`${API_URL}/tickets`, { params });
    return response.data.data;
  },

  createTicket: async (ticketData) => {
    const response = await axios.post(`${API_URL}/tickets`, ticketData);
    return response.data;
  },

  updateTicket: async (id, updateData) => {
    const response = await axios.patch(`${API_URL}/tickets/${id}`, updateData);
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await axios.delete(`${API_URL}/tickets/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/tickets/stats`);
    const backendStats = response.data.data;
    return {
      open: backendStats.statusCounts.open || 0,
      in_progress: backendStats.statusCounts.in_progress || 0,
      resolved: backendStats.statusCounts.resolved || 0,
      closed: backendStats.statusCounts.closed || 0,
      breached: backendStats.breachedOpenTickets || 0,
    };
  }
};

export default ticketService;
