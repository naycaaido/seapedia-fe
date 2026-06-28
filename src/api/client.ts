const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function handle401() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('activeRole');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    handle401();
    throw new ApiError('Unauthorized', 401);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(error.message || 'Request failed', response.status);
  }

  return response.json();
}

async function uploadRequest<T>(endpoint: string, formData: FormData, method: string = 'POST'): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(endpoint), {
    method,
    headers,
    body: formData,
  });

  if (response.status === 401) {
    handle401();
    throw new ApiError('Unauthorized', 401);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(error.message || 'Request failed', response.status);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: 'POST', body }),
  patch: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
  upload: <T>(endpoint: string, formData: FormData) => uploadRequest<T>(endpoint, formData, 'POST'),
  uploadPatch: <T>(endpoint: string, formData: FormData) => uploadRequest<T>(endpoint, formData, 'PATCH'),
};

export { ApiError };
