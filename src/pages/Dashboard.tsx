import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Layers, CreditCard,
  Package, GitBranch, Activity, TrendingUp,
  AlertTriangle, Briefcase, ArrowUpRight,
  BarChart3, Shield, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { dashboardApi } from '@/services/api';
import type { DashboardStats, UserRole, ActiveTab, OptionTab, CrmOfficerCase } from '@/types';
import EmployeesContent from '@/components/managers/EmployeesContent';
import OptionsContent from '@/components/managers/OptionsContent';
import MonitoringDashboardContent from '@/components/monitoring/MonitoringDashboardContent';
import MonitoringCasesContent from '@/components/monitoring/MonitoringCasesContent';
import MonitoringReportContent from '@/components/monitoring/MonitoringReportContent';
import CrmManagerDashboard from '@/components/crm-manager/CrmManagerDashboard';
import NewCasesContent from '@/components/crm-manager/NewCasesContent';
import CompletedCasesContent from '@/components/crm-manager/CompletedCasesContent';
import CrmOfficerDashboard from '@/components/crm-officer/CrmOfficerDashboard';
import NewAssignedCases from '@/components/crm-officer/NewAssignedCases';
import CompletedCases from '@/components/crm-officer/CompletedCases';
import CaseQuestionnaire from '@/components/crm-officer/CaseQuestionnaire';

interface DashboardProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

// Mock stats for demo
const MOCK_STATS: DashboardStats = {
  totalEmployees: 1284,
  totalSectors: 18,
  totalSubSectors: 67,
  totalBroadSegments: 12,
  totalCreditProductLines: 34,
  totalProductGroups: 89,
  totalSubProductLines: 156,
  recentActivity: [
    { id: '1', action: 'Created', entity: 'New Employee: Abebe Kebede', user: 'Admin', timestamp: '2 min ago' },
    { id: '2', action: 'Updated', entity: 'Sector: Agriculture', user: 'CRM Manager', timestamp: '15 min ago' },
    { id: '3', action: 'Deleted', entity: 'Sub Product Line: Legacy Product', user: 'Admin', timestamp: '1 hour ago' },
    { id: '4', action: 'Created', entity: 'Credit Product Line: SME Loan', user: 'Admin', timestamp: '2 hours ago' },
    { id: '5', action: 'Updated', entity: 'Employee: Tigist Hailu', user: 'CRM Officer', timestamp: '3 hours ago' },
  ],
};

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

function AdminDashboard({ stats }: { stats: DashboardStats }) {
  const statCards = [
    { label: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'from-purple-500 to-fuchsia-600', glow: 'shadow-purple-500/20' },
    { label: 'Sectors', value: stats.totalSectors, icon: Building2, color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20' },
    { label: 'Sub Sectors', value: stats.totalSubSectors, icon: Layers, color: 'from-fuchsia-500 to-pink-600', glow: 'shadow-fuchsia-500/20' },
    { label: 'Broad Segments', value: stats.totalBroadSegments, icon: Target, color: 'from-purple-600 to-indigo-600', glow: 'shadow-purple-600/20' },
    { label: 'Credit Products', value: stats.totalCreditProductLines, icon: CreditCard, color: 'from-pink-500 to-rose-600', glow: 'shadow-pink-500/20' },
    { label: 'Product Groups', value: stats.totalProductGroups, icon: Package, color: 'from-violet-600 to-purple-700', glow: 'shadow-violet-600/20' },
    { label: 'Sub Products', value: stats.totalSubProductLines, icon: GitBranch, color: 'from-fuchsia-600 to-purple-700', glow: 'shadow-fuchsia-600/20' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
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

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-purple-50/50 border border-purple-100 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.action === 'Created' ? 'bg-purple-500' :
                      activity.action === 'Updated' ? 'bg-fuchsia-500' : 'bg-red-400'
                    }`} />
                    <div>
                      <p className="text-sm text-gray-800">{activity.entity}</p>
                      <p className="text-xs text-gray-500">
                        {activity.action} by {activity.user}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function DashboardContent({ role, onTabChange }: { role: UserRole; onTabChange: (tab: ActiveTab) => void }) {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await dashboardApi.getStats();
        setStats(res.data);
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(7)].map((_, i) => (
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

  switch (role) {
    case 'CRM MANAGER': return <CrmManagerDashboard onTabChange={onTabChange as any} />;
    case 'CRM OFFICER': return <CrmOfficerDashboard />;
    case 'MONITORING OFFICER': return <MonitoringDashboardContent />;
    default: return <AdminDashboard stats={stats} />;
  }
}

export default function Dashboard({ activeTab, onTabChange }: DashboardProps) {
  const { role } = useAuth();
  const [optionSubTab, setOptionSubTab] = useState<OptionTab | null>(null);
  const [selectedCase, setSelectedCase] = useState<CrmOfficerCase | null>(null);
  const [questionnaireReadOnly, setQuestionnaireReadOnly] = useState(false);

  const handleSelectCase = (c: CrmOfficerCase, readOnly = false) => {
    setSelectedCase(c);
    setQuestionnaireReadOnly(readOnly);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'dashboard' && <DashboardContent role={role} onTabChange={onTabChange} />}
        {activeTab === 'employees' && role === 'ADMIN' && <EmployeesContent />}
        {activeTab === 'options' && role === 'ADMIN' && (
          <OptionsContent
            activeSubTab={optionSubTab}
            onSubTabChange={setOptionSubTab}
          />
        )}
        {activeTab === 'cases' && role === 'MONITORING OFFICER' && <MonitoringCasesContent />}
        {activeTab === 'report' && role === 'MONITORING OFFICER' && <MonitoringReportContent />}
        {activeTab === 'newCases' && role === 'CRM MANAGER' && <NewCasesContent />}
        {activeTab === 'completedCases' && role === 'CRM MANAGER' && <CompletedCasesContent />}

        {/* CRM Officer Tabs */}
        {activeTab === 'crm-new-cases' && role === 'CRM OFFICER' && (
          <NewAssignedCases
            onNavigate={onTabChange}
            onSelectCase={(c) => handleSelectCase(c)}
          />
        )}
        {activeTab === 'crm-completed-cases' && role === 'CRM OFFICER' && (
          <CompletedCases
            onNavigate={onTabChange}
            onSelectCase={(c, readOnly) => handleSelectCase(c, readOnly)}
          />
        )}
        {activeTab === 'crm-questionnaire' && role === 'CRM OFFICER' && selectedCase && (
          <CaseQuestionnaire
            caseData={selectedCase}
            readOnly={questionnaireReadOnly}
            onNavigate={onTabChange}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
