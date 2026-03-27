/**
 * Mock data for CRM Manager pages.
 * Structured as static arrays for easy replacement with real API data later.
 */
import type { Case, CrmOfficer, CaseCriterion } from '@/types';

/** Mock CRM Officers available for case assignment */
export const MOCK_OFFICERS: CrmOfficer[] = [
  { id: 'off-1', name: 'Tigist Hailu', district: 'Addis Ababa District', activeCases: 5 },
  { id: 'off-2', name: 'Yonas Alemu', district: 'Adama District', activeCases: 3 },
  { id: 'off-3', name: 'Dawit Gebre', district: 'Bahir Dar District', activeCases: 7 },
  { id: 'off-4', name: 'Sara Tadesse', district: 'Hawassa District', activeCases: 2 },
  { id: 'off-5', name: 'Mulugeta Bekele', district: 'Mekelle District', activeCases: 4 },
];

/** Mock cases – "Yet to be Assigned" */
export const MOCK_NEW_CASES: Case[] = [
  { id: 'c-1', caseNumber: 'EWS-2026-001', customerName: 'Ethio Leather PLC', customerId: 'CUST-1001', approveAmount: 2500000, status: 'NEW', createdAt: '2026-03-20' },
  { id: 'c-2', caseNumber: 'EWS-2026-002', customerName: 'Addis Textiles Share Co.', customerId: 'CUST-1002', approveAmount: 5000000, status: 'NEW', createdAt: '2026-03-19' },
  { id: 'c-3', caseNumber: 'EWS-2026-003', customerName: 'Green Coffee Export', customerId: 'CUST-1003', approveAmount: 1800000, status: 'NEW', createdAt: '2026-03-18' },
  { id: 'c-4', caseNumber: 'EWS-2026-004', customerName: 'Habesha Breweries', customerId: 'CUST-1004', approveAmount: 12000000, status: 'NEW', createdAt: '2026-03-17' },
  { id: 'c-5', caseNumber: 'EWS-2026-005', customerName: 'Sunshine Construction', customerId: 'CUST-1005', approveAmount: 8500000, status: 'NEW', createdAt: '2026-03-16' },
  { id: 'c-6', caseNumber: 'EWS-2026-006', customerName: 'Abay Metal Engineering', customerId: 'CUST-1006', approveAmount: 3200000, status: 'NEW', createdAt: '2026-03-15' },
  { id: 'c-7', caseNumber: 'EWS-2026-007', customerName: 'National Flour Mill', customerId: 'CUST-1007', approveAmount: 6700000, status: 'NEW', createdAt: '2026-03-14' },
  { id: 'c-8', caseNumber: 'EWS-2026-008', customerName: 'Anbessa Shoe Factory', customerId: 'CUST-1008', approveAmount: 4100000, status: 'NEW', createdAt: '2026-03-13' },
];

/** Mock cases – already "Assigned" */
export const MOCK_ASSIGNED_CASES: Case[] = [
  { id: 'c-20', caseNumber: 'EWS-2026-020', customerName: 'Dashen Beer PLC', customerId: 'CUST-2001', approveAmount: 9500000, status: 'ASSIGNED', assignedOfficer: 'Tigist Hailu', assignedOfficerId: 'off-1', createdAt: '2026-03-10' },
  { id: 'c-21', caseNumber: 'EWS-2026-021', customerName: 'Ethiopian Airlines Cargo', customerId: 'CUST-2002', approveAmount: 15000000, status: 'ASSIGNED', assignedOfficer: 'Yonas Alemu', assignedOfficerId: 'off-2', createdAt: '2026-03-09' },
  { id: 'c-22', caseNumber: 'EWS-2026-022', customerName: 'Awash Wine Share Co.', customerId: 'CUST-2003', approveAmount: 3800000, status: 'ASSIGNED', assignedOfficer: 'Dawit Gebre', assignedOfficerId: 'off-3', createdAt: '2026-03-08' },
];

/** Mock cases – "Completed" */
export const MOCK_COMPLETED_CASES: Case[] = [
  { id: 'c-50', caseNumber: 'EWS-2026-050', customerName: 'United Insurance', customerId: 'CUST-3001', approveAmount: 7200000, status: 'COMPLETED', assignedOfficer: 'Tigist Hailu', assignedOfficerId: 'off-1', completedDate: '2026-03-15', createdAt: '2026-02-20' },
  { id: 'c-51', caseNumber: 'EWS-2026-051', customerName: 'Nile Insurance Co.', customerId: 'CUST-3002', approveAmount: 4500000, status: 'COMPLETED', assignedOfficer: 'Yonas Alemu', assignedOfficerId: 'off-2', completedDate: '2026-03-14', createdAt: '2026-02-18' },
  { id: 'c-52', caseNumber: 'EWS-2026-052', customerName: 'ZamZam Trading PLC', customerId: 'CUST-3003', approveAmount: 2100000, status: 'COMPLETED', assignedOfficer: 'Dawit Gebre', assignedOfficerId: 'off-3', completedDate: '2026-03-12', createdAt: '2026-02-15' },
  { id: 'c-53', caseNumber: 'EWS-2026-053', customerName: 'East Africa Bottling', customerId: 'CUST-3004', approveAmount: 11000000, status: 'COMPLETED', assignedOfficer: 'Sara Tadesse', assignedOfficerId: 'off-4', completedDate: '2026-03-10', createdAt: '2026-02-12' },
  { id: 'c-54', caseNumber: 'EWS-2026-054', customerName: 'Wegagen Bank SC', customerId: 'CUST-3005', approveAmount: 8900000, status: 'COMPLETED', assignedOfficer: 'Mulugeta Bekele', assignedOfficerId: 'off-5', completedDate: '2026-03-08', createdAt: '2026-02-10' },
  { id: 'c-55', caseNumber: 'EWS-2026-055', customerName: 'Oromia Coffee Union', customerId: 'CUST-3006', approveAmount: 5600000, status: 'COMPLETED', assignedOfficer: 'Tigist Hailu', assignedOfficerId: 'off-1', completedDate: '2026-03-05', createdAt: '2026-02-05' },
];

/** Mock criteria for case detail views */
export const MOCK_CRITERIA: CaseCriterion[] = [
  { id: 1, name: 'Credit Score', score: 'Excellent', notes: 'Customer has maintained a credit score above 750 for the past 3 years.' },
  { id: 2, name: 'Repayment History', score: 'Good', notes: 'No defaults in the past 5 years. Two late payments recorded in 2024.' },
  { id: 3, name: 'Collateral Adequacy', score: 'Sufficient', notes: 'Collateral value covers 120% of outstanding loan balance.' },
  { id: 4, name: 'Business Viability', score: 'Moderate', notes: 'Revenue growth at 8% YoY. Market conditions remain stable.' },
  { id: 5, name: 'Debt-to-Income Ratio', score: 'Acceptable', notes: 'Current ratio at 35%, within acceptable threshold of 40%.' },
  { id: 6, name: 'Industry Risk', score: 'Low', notes: 'Operating in a low-risk sector with stable demand patterns.' },
  { id: 7, name: 'Management Quality', score: 'Good', notes: 'Experienced management team with 10+ years in the industry.' },
  { id: 8, name: 'Cash Flow Analysis', score: 'Positive', notes: 'Positive operating cash flow for the last 8 consecutive quarters.' },
];
