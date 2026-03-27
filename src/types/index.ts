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
export type ActiveTab = 'dashboard' | 'employees' | 'options';

// CRM Manager types
export type CrmActiveTab = 'dashboard' | 'newCases' | 'completedCases';
export type NewCasesSubTab = 'yetToBeAssigned' | 'assigned';
export type CaseStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CrmOfficer {
  id: string;
  name: string;
  district: string;
  activeCases: number;
}

export interface Case {
  id: string;
  caseNumber: string;
  customerName: string;
  customerId: string;
  approveAmount: number;
  status: CaseStatus;
  assignedOfficer?: string;
  assignedOfficerId?: string;
  completedDate?: string;
  createdAt: string;
}

export interface CaseCriterion {
  id: number;
  name: string;
  score: string;
  notes: string;
}
