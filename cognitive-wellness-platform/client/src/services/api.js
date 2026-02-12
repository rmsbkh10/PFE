import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Ajouter le token automatiquement à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTH API =====
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
  getMe: () => API.get("/auth/me"),
};

// ===== ASSESSMENT API =====
export const assessmentAPI = {
  submit: (data) => API.post("/assessment/submit", data),
  getHistory: () => API.get("/assessment/history"),
  getById: (id) => API.get(`/assessment/${id}`),
};

// ===== RECOMMENDATIONS API =====
export const recommendationsAPI = {
  get: (assessmentId) => API.get(`/recommendations/${assessmentId}`),
};

export default API;