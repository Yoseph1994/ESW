/**
 * Completed Cases Content
 * Displays a table of completed cases with a "Detail" button.
 * The Detail button opens CaseDetailsModal.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/DataTable';
import { MOCK_COMPLETED_CASES } from '@/data/mockCrmData';
import CaseDetailsModal from '@/components/crm-manager/CaseDetailsModal';
import type { Case } from '@/types';

export default function CompletedCasesContent() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setDetailOpen(true);
  };

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseNumber',
      header: 'Case Number',
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
      cell: () => (
        <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
          COMPLETED
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openDetail(row.original)}
          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 text-xs"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Detail
        </Button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Completed Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={MOCK_COMPLETED_CASES}
            searchPlaceholder="Search completed cases..."
          />
        </CardContent>
      </Card>

      {/* Case Details Modal */}
      <CaseDetailsModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        caseData={selectedCase}
      />
    </motion.div>
  );
}
