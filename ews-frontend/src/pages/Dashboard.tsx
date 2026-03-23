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
import type { DashboardStats, UserRole, ActiveTab, OptionTab } from '@/types';
import EmployeesContent from '@/components/managers/EmployeesContent';
import OptionsContent from '@/components/managers/OptionsContent';

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
    { label: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'from-teal-400 to-teal-600', glow: 'shadow-teal-500/20' },
    { label: 'Sectors', value: stats.totalSectors, icon: Building2, color: 'from-blue-400 to-blue-600', glow: 'shadow-blue-500/20' },
    { label: 'Sub Sectors', value: stats.totalSubSectors, icon: Layers, color: 'from-purple-400 to-purple-600', glow: 'shadow-purple-500/20' },
    { label: 'Broad Segments', value: stats.totalBroadSegments, icon: Target, color: 'from-amber-400 to-amber-600', glow: 'shadow-amber-500/20' },
    { label: 'Credit Products', value: stats.totalCreditProductLines, icon: CreditCard, color: 'from-emerald-400 to-emerald-600', glow: 'shadow-emerald-500/20' },
    { label: 'Product Groups', value: stats.totalProductGroups, icon: Package, color: 'from-rose-400 to-rose-600', glow: 'shadow-rose-500/20' },
    { label: 'Sub Products', value: stats.totalSubProductLines, icon: GitBranch, color: 'from-cyan-400 to-cyan-600', glow: 'shadow-cyan-500/20' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className={`glass-card glass-card-hover border-white/5 group cursor-default transition-all duration-300 hover:scale-[1.02] shadow-lg ${card.glow}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        {card.label}
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.glow} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <ArrowUpRight className="h-3 w-3 text-teal-400" />
                    <span className="text-xs text-teal-400">+{Math.floor(Math.random() * 15 + 1)}%</span>
                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.action === 'Created' ? 'bg-teal-400' :
                      activity.action === 'Updated' ? 'bg-blue-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <p className="text-sm text-white">{activity.entity}</p>
                      <p className="text-xs text-gray-500">
                        {activity.action} by {activity.user}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function CRMManagerDashboard() {
  const teamCards = [
    { label: 'Team Members', value: 24, icon: Users, trend: '+3' },
    { label: 'Active Cases', value: 156, icon: Briefcase, trend: '+12' },
    { label: 'Performance', value: '94%', icon: TrendingUp, trend: '+2%' },
    { label: 'Pending Reviews', value: 8, icon: BarChart3, trend: '-3' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-teal-400" />
          My Team Overview
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className="glass-card glass-card-hover border-white/5 hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-5 w-5 text-teal-400" />
                    <Badge variant="outline" className="text-teal-400 border-teal-500/30 text-xs">
                      {card.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function CRMOfficerDashboard() {
  const portfolioCards = [
    { label: 'My Clients', value: 42, icon: Users },
    { label: 'Follow-ups Due', value: 7, icon: Activity },
    { label: 'New Referrals', value: 3, icon: ArrowUpRight },
    { label: 'Risk Alerts', value: 2, icon: AlertTriangle },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-teal-400" />
          My Portfolio
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className="glass-card glass-card-hover border-white/5 hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5 text-center">
                  <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-teal-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MonitoringDashboard() {
  const alertCards = [
    { label: 'Active Alerts', value: 5, severity: 'high', icon: AlertTriangle },
    { label: 'Under Monitoring', value: 23, severity: 'medium', icon: Activity },
    { label: 'Resolved Today', value: 12, severity: 'low', icon: TrendingUp },
    { label: 'System Health', value: '99.2%', severity: 'ok', icon: BarChart3 },
  ];

  const severityColors: Record<string, string> = {
    high: 'from-red-500/20 to-red-600/20 text-red-400',
    medium: 'from-amber-500/20 to-amber-600/20 text-amber-400',
    low: 'from-green-500/20 to-green-600/20 text-green-400',
    ok: 'from-teal-500/20 to-teal-600/20 text-teal-400',
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          Alerts & Monitoring
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className="glass-card glass-card-hover border-white/5 hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5 text-center">
                  <div className={`h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${severityColors[card.severity]} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DashboardContent({ role }: { role: UserRole }) {
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
          <Card key={i} className="glass-card border-white/5">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-20 bg-white/5" />
              <Skeleton className="h-8 w-16 bg-white/5" />
              <Skeleton className="h-3 w-24 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  switch (role) {
    case 'CRM MANAGER': return <CRMManagerDashboard />;
    case 'CRM OFFICER': return <CRMOfficerDashboard />;
    case 'MONITORING OFFICER': return <MonitoringDashboard />;
    default: return <AdminDashboard stats={stats} />;
  }
}

export default function Dashboard({ activeTab, onTabChange }: DashboardProps) {
  const { role } = useAuth();
  const [optionSubTab, setOptionSubTab] = useState<OptionTab | null>(null);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'dashboard' && <DashboardContent role={role} />}
        {activeTab === 'employees' && <EmployeesContent />}
        {activeTab === 'options' && (
          <OptionsContent
            activeSubTab={optionSubTab}
            onSubTabChange={setOptionSubTab}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
