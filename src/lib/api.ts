const API_BASE = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD
    ? 'https://ai-service-matching-backend-production.up.railway.app'
    : 'http://localhost:3000');

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ===== Auth =====
  async register(email: string, password: string, name: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request<any>('/api/auth/me');
  }

  // ===== Companions =====
  async getCompanions(params?: { search?: string; minRating?: number; maxPrice?: number; activity?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.minRating) query.set('minRating', params.minRating.toString());
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params?.activity) query.set('activity', params.activity);
    const qs = query.toString();
    return this.request<{ companions: any[] }>(`/api/companions${qs ? `?${qs}` : ''}`);
  }

  async getCompanion(id: string) {
    return this.request<any>(`/api/companions/${id}`);
  }

  async getCompanionAvailability(id: string) {
    return this.request<{ availability: any[] }>(`/api/companions/${id}/availability`);
  }

  // ===== Bookings =====
  async getBookings(status?: string) {
    const qs = status ? `?status=${status}` : '';
    return this.request<{ bookings: any[] }>(`/api/bookings${qs}`);
  }

  async createBooking(data: {
    companionId: string;
    activity: string;
    location?: string;
    scheduledAt: string;
    duration: number;
    notes?: string;
  }) {
    return this.request<any>('/api/bookings', { method: 'POST', body: data });
  }

  async updateBooking(id: string, status: string) {
    return this.request<any>(`/api/bookings/${id}`, { method: 'PATCH', body: { status } });
  }

  async cancelBooking(id: string) {
    return this.request<any>(`/api/bookings/${id}`, { method: 'DELETE' });
  }

  // ===== Reviews =====
  async getReviews(companionId: string) {
    return this.request<{ reviews: any[] }>(`/api/reviews/${companionId}`);
  }

  async createReview(companionId: string, rating: number, comment?: string) {
    return this.request<any>('/api/reviews', {
      method: 'POST',
      body: { companionId, rating, comment },
    });
  }

  // ===== Chat =====
  async sendAIMessage(message: string, conversationHistory: Array<{ role: string; content: string }> = []) {
    return this.request<{
      response: string;
      recommendations: any[];
      extractedPreferences: any;
    }>('/api/chat/ai', {
      method: 'POST',
      body: { message, conversationHistory },
    });
  }

  async getMessages(companionId: string) {
    return this.request<{ messages: any[] }>(`/api/chat/messages/${companionId}`);
  }

  async sendMessage(companionId: string, content: string) {
    return this.request<any>('/api/chat/messages', {
      method: 'POST',
      body: { companionId, content },
    });
  }

  // ===== Payments =====
  async createPaymentIntent(bookingId: string) {
    return this.request<{ clientSecret: string; paymentId: string }>('/api/payments/create-intent', {
      method: 'POST',
      body: { bookingId },
    });
  }

  async getPaymentStatus(bookingId: string) {
    return this.request<any>(`/api/payments/${bookingId}`);
  }

  // ===== User =====
  async getProfile() {
    return this.request<any>('/api/users/profile');
  }

  async updateProfile(data: { name?: string; phone?: string; avatar?: string }) {
    return this.request<any>('/api/users/profile', { method: 'PATCH', body: data });
  }

  async updatePreferences(data: {
    interests?: string[];
    personality?: string[];
    preferredTimes?: string[];
    preferredActivities?: string[];
    budgetRange?: string;
  }) {
    return this.request<any>('/api/users/preferences', { method: 'PUT', body: data });
  }
}

export const api = new ApiClient(API_BASE);
export default api;
