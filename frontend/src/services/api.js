const API_BASE = '/api';

export const api = {
  // Chat & Inference
  async askQuestion(query) {
    const res = await fetch(`${API_BASE}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return res.json();
  },

  // Dashboard Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Knowledge Base
  async getKnowledge(category = '', search = '') {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/knowledge?${params.toString()}`);
    return res.json();
  },

  async searchKnowledge(q = '') {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    const res = await fetch(`${API_BASE}/knowledge/search?${params.toString()}`);
    return res.json();
  },

  async createKnowledge(data) {
    const res = await fetch(`${API_BASE}/knowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateKnowledge(id, data) {
    const res = await fetch(`${API_BASE}/knowledge/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteKnowledge(id) {
    const res = await fetch(`${API_BASE}/knowledge/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Knowledge Graph
  async getGraph() {
    const res = await fetch(`${API_BASE}/graph`);
    return res.json();
  },

  async addGraphNode(nodeData) {
    const res = await fetch(`${API_BASE}/graph/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeData),
    });
    return res.json();
  },

  async addGraphEdge(edgeData) {
    const res = await fetch(`${API_BASE}/graph/edges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edgeData),
    });
    return res.json();
  },

  async resetGraph() {
    const res = await fetch(`${API_BASE}/graph/reset`, {
      method: 'POST',
    });
    return res.json();
  },

  // Activity History
  async getHistory(status = '') {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const res = await fetch(`${API_BASE}/history?${params.toString()}`);
    return res.json();
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async deleteHistoryItem(id) {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
