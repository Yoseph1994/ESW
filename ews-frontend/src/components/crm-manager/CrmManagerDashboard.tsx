/**
 * CRM Manager Dashboard
 * Shows two big cards (New Cases + Completed Cases) and a recent new cases table.
 * Matches the Admin design system exactly.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, CheckCircle2, Plus, ArrowRight } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { MOCK_NEW_CASES, MOCK_ASSIGNED_CASES, MOCK_COMPLETED_CASES } from '@/data/mockCrmData';
import type { Case, CrmActiveTab } from '@/types';

interface CrmManagerDashboardProps {
  onTabChange: (tab: CrmActiveTab) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function CrmManagerDashboard({ onTabChange }: CrmManagerDashboardProps) {
  const newCasesCount = MOCK_NEW_CASES.length + MOCK_ASSIGNED_CASES.length;
  const completedCount = MOCK_COMPLETED_CASES.length;

  /** Table columns for the dashboard's recent cases preview */
  const columns: ColumnDef<Case>[] = [
    { accessorKey: 'caseNumber', header: 'Case Number',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.caseNumber}</span>
      ),
    },
    { accessorKey: 'customerName', header: 'Customer Name' },
    { accessorKey: 'customerId', header: 'Customer Id' },
    {
      accessorKey: 'approveAmount',
      header: 'Approve Amount',
      cell: ({ row }) => (
        <span>ETB {row.original.approveAmount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Two Big Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* New Cases Card */}
        <motion.div variants={itemVariants}>
          <Card
            className="glass-card glass-card-hover cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-500/10"
            onClick={() => onTabChange('newCases')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    New Cases
                  </p>
                  <p className="text-5xl font-bold text-gray-900">{newCasesCount}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {MOCK_NEW_CASES.length} unassigned · {MOCK_ASSIGNED_CASES.length} assigned
                  </p>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completed Cases Card */}
        <motion.div variants={itemVariants}>
          <Card
            className="glass-card glass-card-hover cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-fuchsia-500/10"
            onClick={() => onTabChange('completedCases')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Completed Cases
                  </p>
                  <p className="text-5xl font-bold text-gray-900">{completedCount}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed by officers this period
                  </p>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent New Cases Table */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-600" />
              Recent New Cases
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => onTabChange('newCases')}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-sm"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={MOCK_NEW_CASES.slice(0, 5)}
              searchPlaceholder="Search cases..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
