import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, CheckCircle, Loader2, Clock,
  Activity, ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { crmCaseApi } from '@/services/api';
import type { CrmOfficerDashboardStats } from '@/types';

const MOCK_STATS: CrmOfficerDashboardStats = {
  totalNewAssigned: 12,
  totalCompleted: 45,
  casesInProgress: 8,
  pendingSubmissions: 4,
  recentActivities: [
    { caseId: 'EWS-2026-001', customerName: 'Abebe Trading PLC', action: 'Assessed', date: '2026-03-30', status: 'Submitted' },
    { caseId: 'EWS-2026-002', customerName: 'Ethio Metals Corp', action: 'Draft Saved', date: '2026-03-29', status: 'In Progress' },
    { caseId: 'EWS-2026-003', customerName: 'Star Agro Ltd', action: 'Assessed', date: '2026-03-28', status: 'Submitted' },
    { caseId: 'EWS-2026-004', customerName: 'Habesha Cement', action: 'Assessed', date: '2026-03-27', status: 'Submitted' },
    { caseId: 'EWS-2026-005', customerName: 'Unity Transport', action: 'Assessment Started', date: '2026-03-26', status: 'In Progress' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function CrmOfficerDashboard() {
  const [stats, setStats] = useState<CrmOfficerDashboardStats>(MOCK_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await crmCaseApi.getDashboard();
        setStats(res.data);
      } catch {
        // Use mock data on failure
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
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

  const statCards = [
    { label: 'Total New Assigned', value: stats.totalNewAssigned, icon: ClipboardList, color: 'from-purple-500 to-fuchsia-600', glow: 'shadow-purple-500/20' },
    { label: 'Total Completed', value: stats.totalCompleted, icon: CheckCircle, color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20' },
    { label: 'Cases In Progress', value: stats.casesInProgress, icon: Loader2, color: 'from-fuchsia-500 to-pink-600', glow: 'shadow-fuchsia-500/20' },
    { label: 'Pending Submissions', value: stats.pendingSubmissions, icon: Clock, color: 'from-purple-600 to-indigo-600', glow: 'shadow-purple-600/20' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className={`glass-card glass-card-hover group cursor-default transition-all duration-300 hover:scale-[1.02] shadow-lg ${card.glow}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.glow} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <ArrowUpRight className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600">Active</span>
                    <span className="text-xs text-gray-400 ml-1">this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentActivities.map((activity) => (
                  <TableRow key={activity.caseId} className="hover:bg-purple-50/50">
                    <TableCell className="font-medium text-purple-700">{activity.caseId}</TableCell>
                    <TableCell>{activity.customerName}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-gray-500">{activity.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={activity.status === 'Submitted' ? 'border-green-300 text-green-700 bg-green-50' : 'border-purple-300 text-purple-700 bg-purple-50'}>
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
