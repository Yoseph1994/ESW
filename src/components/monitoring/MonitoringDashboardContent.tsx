import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, AlertTriangle,
  Activity, TrendingUp, Target, ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import { monitoringDashboardApi } from '@/services/api';
import type { MonitoringDashboardStats, Case, RiskLevel } from '@/types';
import { Button } from '@/components/ui/button';

// Mock stats
const MOCK_STATS: MonitoringDashboardStats = {
  newCases: 14,
  onProgressCases: 23,
  completedCases: 87,
  highRisk: 12,
  mediumRisk: 31,
  lowRisk: 44,
  totalEvaluated: 87,
};

// Mock completed cases
const MOCK_COMPLETED_CASES: Case[] = [
  {
    id: '1', caseId: '50168/0001/03/2026', customerId: 'CUS-10234',
    customerName: 'Abebe Enterprises PLC', totalExposure: 15000000,
    customerSegment: 'Corporate', economicSector: 'Manufacturing',
    subEconomicSector: 'Food Processing', broadSegment: 'Large Enterprise',
    creditProductLine: 'Term Loan', productGroup: 'Working Capital',
    subProductGroup: 'Short Term WC', purpose: 'Equipment Purchase',
    approveAmount: 12000000, lafNo: 'LAF-2026-001', dateOfApproval: '2026-01-15',
    limit: 15000000, tenure: '5 Years', status: 'COMPLETED', riskLevel: 'LOW',
    dateSent: '2026-02-01', dateReturned: '2026-03-10',
    createdAt: '2026-01-10', updatedAt: '2026-03-10',
  },
  {
    id: '2', caseId: '50168/0002/03/2026', customerId: 'CUS-10567',
    customerName: 'Tigist Trading', totalExposure: 8500000,
    customerSegment: 'SME', economicSector: 'Trade',
    subEconomicSector: 'Wholesale', broadSegment: 'Medium Enterprise',
    creditProductLine: 'Overdraft', productGroup: 'Trade Finance',
    subProductGroup: 'Import LC', purpose: 'Import Financing',
    approveAmount: 7000000, lafNo: 'LAF-2026-002', dateOfApproval: '2026-01-20',
    limit: 10000000, tenure: '1 Year', status: 'COMPLETED', riskLevel: 'HIGH',
    dateSent: '2026-02-05', dateReturned: '2026-03-12',
    createdAt: '2026-01-18', updatedAt: '2026-03-12',
  },
  {
    id: '3', caseId: '50168/0003/03/2026', customerId: 'CUS-10891',
    customerName: 'Dawit Construction', totalExposure: 25000000,
    customerSegment: 'Corporate', economicSector: 'Construction',
    subEconomicSector: 'Building Construction', broadSegment: 'Large Enterprise',
    creditProductLine: 'Project Finance', productGroup: 'Infrastructure',
    subProductGroup: 'Road Construction', purpose: 'Bridge Construction Project',
    approveAmount: 20000000, lafNo: 'LAF-2026-003', dateOfApproval: '2026-02-01',
    limit: 30000000, tenure: '7 Years', status: 'COMPLETED', riskLevel: 'MEDIUM',
    dateSent: '2026-02-10', dateReturned: '2026-03-15',
    createdAt: '2026-01-28', updatedAt: '2026-03-15',
  },
  {
    id: '4', caseId: '50168/0004/03/2026', customerId: 'CUS-11023',
    customerName: 'Hana Agro Industries', totalExposure: 5000000,
    customerSegment: 'SME', economicSector: 'Agriculture',
    subEconomicSector: 'Crop Production', broadSegment: 'Small Enterprise',
    creditProductLine: 'Term Loan', productGroup: 'Agri Finance',
    subProductGroup: 'Seasonal', purpose: 'Seasonal Crop Financing',
    approveAmount: 4000000, lafNo: 'LAF-2026-004', dateOfApproval: '2026-02-10',
    limit: 6000000, tenure: '2 Years', status: 'COMPLETED', riskLevel: 'LOW',
    dateSent: '2026-02-15', dateReturned: '2026-03-18',
    createdAt: '2026-02-08', updatedAt: '2026-03-18',
  },
  {
    id: '5', caseId: '50168/0005/03/2026', customerId: 'CUS-11256',
    customerName: 'Yonas Export PLC', totalExposure: 18000000,
    customerSegment: 'Corporate', economicSector: 'Trade',
    subEconomicSector: 'Export', broadSegment: 'Large Enterprise',
    creditProductLine: 'Pre-Export Finance', productGroup: 'Trade Finance',
    subProductGroup: 'Pre-Shipment', purpose: 'Coffee Export Pre-Shipment',
    approveAmount: 15000000, lafNo: 'LAF-2026-005', dateOfApproval: '2026-02-15',
    limit: 20000000, tenure: '1 Year', status: 'COMPLETED', riskLevel: 'MEDIUM',
    dateSent: '2026-02-20', dateReturned: '2026-03-20',
    createdAt: '2026-02-12', updatedAt: '2026-03-20',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const RISK_BADGE_STYLES: Record<RiskLevel, string> = {
  HIGH: 'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-200',
  LOW: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function MonitoringDashboardContent() {
  const [stats, setStats] = useState<MonitoringDashboardStats>(MOCK_STATS);
  const [completedCases] = useState<Case[]>(MOCK_COMPLETED_CASES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await monitoringDashboardApi.getStats();
        setStats(res.data);
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statusCards = [
    {
      label: 'New Cases',
      description: 'Cases initiated, not yet sent',
      value: stats.newCases,
      icon: FileText,
      color: 'from-purple-500 to-fuchsia-600',
      glow: 'shadow-purple-500/20',
    },
    {
      label: 'On Progress',
      description: 'Sent to CRM, awaiting return',
      value: stats.onProgressCases,
      icon: Clock,
      color: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/20',
    },
    {
      label: 'Completed Cases',
      description: 'Returned from CRM Officer',
      value: stats.completedCases,
      icon: CheckCircle,
      color: 'from-fuchsia-500 to-pink-600',
      glow: 'shadow-fuchsia-500/20',
    },
  ];

  const riskCards = [
    { label: 'High Risk', value: stats.highRisk, color: 'from-red-100 to-red-50', textColor: 'text-red-500', icon: AlertTriangle },
    { label: 'Medium Risk', value: stats.mediumRisk, color: 'from-amber-100 to-amber-50', textColor: 'text-amber-500', icon: Activity },
    { label: 'Low Risk', value: stats.lowRisk, color: 'from-green-100 to-green-50', textColor: 'text-green-500', icon: TrendingUp },
    { label: 'Total Evaluated', value: stats.totalEvaluated, color: 'from-purple-100 to-fuchsia-50', textColor: 'text-purple-600', icon: Target },
  ];

  const completedColumns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseId',
      header: 'Case Number',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.caseId}</span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer Name',
    },
    {
      accessorKey: 'customerId',
      header: 'Customer ID',
    },
    {
      accessorKey: 'approveAmount',
      header: 'Approve Amount',
      cell: ({ row }) => (
        <span>{row.original.approveAmount.toLocaleString()} ETB</span>
      ),
    },
    {
      accessorKey: 'dateReturned',
      header: 'Date Returned',
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Level',
      cell: ({ row }) => {
        const level = row.original.riskLevel;
        if (!level) return null;
        return (
          <Badge variant="outline" className={`text-xs ${RISK_BADGE_STYLES[level]}`}>
            {level}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell: () => (
        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-500 hover:bg-purple-50 text-xs">
          Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-20 bg-purple-100" />
              <Skeleton className="h-8 w-16 bg-purple-100" />
              <Skeleton className="h-3 w-24 bg-purple-100" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* 3 Big Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className={`glass-card glass-card-hover group cursor-default transition-all duration-300 hover:scale-[1.02] shadow-lg ${card.glow}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {card.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {card.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{card.description}</p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.glow} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <ArrowUpRight className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600">+{Math.floor(Math.random() * 15 + 1)}%</span>
                    <span className="text-xs text-gray-400 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 4 Risk Statistic Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {riskCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className="glass-card glass-card-hover hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5 text-center">
                  <div className={`h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${card.textColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completed Cases Table */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              Completed Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={completedColumns}
              data={completedCases}
              searchPlaceholder="Search completed cases..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
