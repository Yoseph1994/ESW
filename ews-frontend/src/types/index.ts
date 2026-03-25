export type UserRole = 'ADMIN' | 'CRM MANAGER' | 'CRM OFFICER' | 'MONITORING OFFICER';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  district: string;
  branch: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Sector {
  id: string;
  economicSector: string;
  macroPd: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubSector {
  id: string;
  name: string;
  sectorId: string;
  sector?: Sector;
  createdAt: string;
  updatedAt: string;
}

export interface BroadSegment {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditProductLine {
  id: string;
  name: string;
  broadSegmentId: string;
  broadSegment?: BroadSegment;
  createdAt: string;
  updatedAt: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  creditProductLineId: string;
  creditProductLine?: CreditProductLine;
  createdAt: string;
  updatedAt: string;
}

export interface SubProductLine {
  id: string;
  name: string;
  productGroupId: string;
  productGroup?: ProductGroup;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalSectors: number;
  totalSubSectors: number;
  totalBroadSegments: number;
  totalCreditProductLines: number;
  totalProductGroups: number;
  totalSubProductLines: number;
  recentActivity?: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  user: string;
  timestamp: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    name: string;
    role: UserRole;
  };
}

export type OptionTab = 'sectors' | 'subSectors' | 'broadSegments' | 'creditProductLines' | 'productGroups' | 'subProductLines';
export type ActiveTab = 'dashboard' | 'employees' | 'options' | 'cases' | 'report';

// Monitoring Manager types
export type CaseStatus = 'NEW' | 'PENDING' | 'COMPLETED';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CaseEvaluationCriterion {
  criterion: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface CaseEvaluation {
  criteria: CaseEvaluationCriterion[];
  totalScore: number;
  maxTotalScore: number;
  verdict: RiskLevel;
  evaluatedBy: string;
  evaluatedAt: string;
  notes: string;
}

export interface Case {
  id: string;
  caseId: string;
  customerId: string;
  customerName: string;
  totalExposure: number;
  customerSegment: string;
  economicSector: string;
  subEconomicSector: string;
  broadSegment: string;
  creditProductLine: string;
  productGroup: string;
  subProductGroup: string;
  purpose: string;
  approveAmount: number;
  lafNo: string;
  dateOfApproval: string;
  limit: number;
  tenure: string;
  status: CaseStatus;
  riskLevel?: RiskLevel;
  dateSent?: string;
  dateReturned?: string;
  evaluation?: CaseEvaluation;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringDashboardStats {
  newCases: number;
  onProgressCases: number;
  completedCases: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  totalEvaluated: number;
}
