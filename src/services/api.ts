import axios from 'axios';
import type {
  Employee, Sector, SubSector, BroadSegment,
  CreditProductLine, ProductGroup, SubProductLine,
  DashboardStats, LoginCredentials, AuthResponse,
  Case, MonitoringDashboardStats,
  CrmOfficerCase, CrmOfficerDashboardStats, QuestionAnswer
} from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ews_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  login: (creds: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', creds),
};

// Dashboard
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

// Employees
export const employeeApi = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: string) => api.get<Employee>(`/employees/${id}`),
  create: (data: Partial<Employee>) => api.post<Employee>('/employees', data),
  update: (id: string, data: Partial<Employee>) => api.put<Employee>(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Sectors
export const sectorApi = {
  getAll: () => api.get<Sector[]>('/sectors'),
  create: (data: Partial<Sector>) => api.post<Sector>('/sectors', data),
  update: (id: string, data: Partial<Sector>) => api.put<Sector>(`/sectors/${id}`, data),
  delete: (id: string) => api.delete(`/sectors/${id}`),
};

// Sub Sectors
export const subSectorApi = {
  getAll: () => api.get<SubSector[]>('/sub-sectors'),
  create: (data: Partial<SubSector>) => api.post<SubSector>('/sub-sectors', data),
  update: (id: string, data: Partial<SubSector>) => api.put<SubSector>(`/sub-sectors/${id}`, data),
  delete: (id: string) => api.delete(`/sub-sectors/${id}`),
};

// Broad Segments
export const broadSegmentApi = {
  getAll: () => api.get<BroadSegment[]>('/broad-segments'),
  create: (data: Partial<BroadSegment>) => api.post<BroadSegment>('/broad-segments', data),
  update: (id: string, data: Partial<BroadSegment>) => api.put<BroadSegment>(`/broad-segments/${id}`, data),
  delete: (id: string) => api.delete(`/broad-segments/${id}`),
};

// Credit Product Lines
export const creditProductLineApi = {
  getAll: () => api.get<CreditProductLine[]>('/credit-product-lines'),
  create: (data: Partial<CreditProductLine>) => api.post<CreditProductLine>('/credit-product-lines', data),
  update: (id: string, data: Partial<CreditProductLine>) => api.put<CreditProductLine>(`/credit-product-lines/${id}`, data),
  delete: (id: string) => api.delete(`/credit-product-lines/${id}`),
};

// Product Groups
export const productGroupApi = {
  getAll: () => api.get<ProductGroup[]>('/product-groups'),
  create: (data: Partial<ProductGroup>) => api.post<ProductGroup>('/product-groups', data),
  update: (id: string, data: Partial<ProductGroup>) => api.put<ProductGroup>(`/product-groups/${id}`, data),
  delete: (id: string) => api.delete(`/product-groups/${id}`),
};

// Sub Product Lines
export const subProductLineApi = {
  getAll: () => api.get<SubProductLine[]>('/sub-product-lines'),
  create: (data: Partial<SubProductLine>) => api.post<SubProductLine>('/sub-product-lines', data),
  update: (id: string, data: Partial<SubProductLine>) => api.put<SubProductLine>(`/sub-product-lines/${id}`, data),
  delete: (id: string) => api.delete(`/sub-product-lines/${id}`),
};

// Cases (Monitoring Manager)
export const caseApi = {
  getAll: () => api.get<Case[]>('/cases'),
  getById: (id: string) => api.get<Case>(`/cases/${id}`),
  create: (data: Partial<Case>) => api.post<Case>('/cases', data),
  update: (id: string, data: Partial<Case>) => api.put<Case>(`/cases/${id}`, data),
  delete: (id: string) => api.delete(`/cases/${id}`),
  sendToCRM: (id: string) => api.post(`/cases/${id}/send`),
};

// Monitoring Dashboard
export const monitoringDashboardApi = {
  getStats: () => api.get<MonitoringDashboardStats>('/monitoring/stats'),
};

// CRM Officer
export const crmCaseApi = {
  getAssigned: () => api.get<CrmOfficerCase[]>('/cases/assigned'),
  getCompleted: () => api.get<CrmOfficerCase[]>('/cases/completed'),
  getById: (id: string) => api.get<CrmOfficerCase>(`/cases/${id}`),
  getDashboard: () => api.get<CrmOfficerDashboardStats>('/cases/crm-dashboard'),
  submitQuestionnaire: (id: string, data: { answers: Record<string, QuestionAnswer>; justification: string; keyRiskFactors?: string; recommendation: string }) =>
    api.post(`/cases/${id}/questionnaire`, data),
  saveDraft: (id: string, data: { answers: Record<string, QuestionAnswer>; justification?: string; keyRiskFactors?: string; recommendation?: string }) =>
    api.put(`/cases/${id}/questionnaire/draft`, data),
};

export default api;
