import axios from 'axios';

const baseURLV1 =
  process.env.REACT_APP_API_V1_URL ||
  'https://limpdus-report-clean-check-back-chckb8cadmh2djcd.eastus-01.azurewebsites.net/v1/';

const STORAGE_KEY = 'limpiduscleancheck@project';

const api = axios.create({
  baseURL: 'https://limpidus-api-homol.azurewebsites.net/api',
});

export const newAPI = axios.create({
  baseURL: baseURLV1,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const readSessionToken = (): string | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

newAPI.interceptors.request.use(config => {
  const token = readSessionToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

newAPI.interceptors.response.use(
  response => response,
  error => {
    // 401 vindo do próprio login é credencial inválida, não sessão expirada:
    // a tela de login trata a mensagem sem redirecionar.
    const isAuthRequest = String(error?.config?.url || '').includes('/auth/');
    if (!isAuthRequest && error?.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
