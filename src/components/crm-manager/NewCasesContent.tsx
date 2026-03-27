/**
 * New Cases Content
 * Two tabs: "Yet to be Assigned" and "Assigned".
 * Includes Assign/Reassign officer modal with mock CRM officers dropdown.
 * Client-side simulation of assignment.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { FolderOpen, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/DataTable';
import { FormModal } from '@/components/ui/FormModal';
import { toast } from 'sonner';
import { MOCK_NEW_CASES, MOCK_ASSIGNED_CASES, MOCK_OFFICERS } from '@/data/mockCrmData';
import type { Case, NewCasesSubTab } from '@/types';

export default function NewCasesContent() {
  const [subTab, setSubTab] = useState<NewCasesSubTab>('yetToBeAssigned');
  const [unassignedCases, setUnassignedCases] = useState<Case[]>(MOCK_NEW_CASES);
  const [assignedCases, setAssignedCases] = useState<Case[]>(MOCK_ASSIGNED_CASES);

  // Assign / Reassign modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  const [isReassign, setIsReassign] = useState(false);

  /** Open the Assign Officer modal */
  const openAssignModal = (caseItem: Case, reassign = false) => {
    setSelectedCase(caseItem);
    setSelectedOfficerId(reassign ? (caseItem.assignedOfficerId || '') : '');
    setIsReassign(reassign);
    setModalOpen(true);
  };

  /** Handle case assignment */
  const handleAssign = () => {
    if (!selectedCase || !selectedOfficerId) {
      toast.error('Please select a CRM Officer');
      return;
    }

    const officer = MOCK_OFFICERS.find((o) => o.id === selectedOfficerId);
    if (!officer) return;

    if (isReassign) {
      // Reassign: update the officer in the assigned list
      setAssignedCases((prev) =>
        prev.map((c) =>
          c.id === selectedCase.id
            ? { ...c, assignedOfficer: officer.name, assignedOfficerId: officer.id }
            : c
        )
      );
      toast.success('Case reassigned successfully', {
        description: `${selectedCase.caseNumber} reassigned to ${officer.name}`,
      });
    } else {
      // Assign: move from unassigned to assigned
      const updatedCase: Case = {
        ...selectedCase,
        status: 'ASSIGNED',
        assignedOfficer: officer.name,
        assignedOfficerId: officer.id,
      };
      setUnassignedCases((prev) => prev.filter((c) => c.id !== selectedCase.id));
      setAssignedCases((prev) => [updatedCase, ...prev]);
      toast.success('Case assigned successfully', {
        description: `${selectedCase.caseNumber} assigned to ${officer.name}`,
      });
    }

    setModalOpen(false);
    setSelectedCase(null);
    setSelectedOfficerId('');
  };

  /** Columns for "Yet to be Assigned" tab */
  const unassignedColumns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseNumber',
      header: 'Case Number',
      cell: ({ row }) => (
        <span className="font-medium text-white">{row.original.caseNumber}</span>
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
        <Badge variant="outline" className="text-xs bg-amber-500/15 text-amber-400 border-amber-500/30">
          NEW
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => openAssignModal(row.original)}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs shadow-lg shadow-teal-500/20 px-4"
        >
          <UserCheck className="h-3.5 w-3.5 mr-1.5" />
          Assign Officer
        </Button>
      ),
    },
  ];

  /** Columns for "Assigned" tab */
  const assignedColumns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseNumber',
      header: 'Case Number',
      cell: ({ row }) => (
        <span className="font-medium text-white">{row.original.caseNumber}</span>
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
      accessorKey: 'assignedOfficer',
      header: 'Assigned Officer',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs bg-teal-500/15 text-teal-400 border-teal-500/30">
          {row.original.assignedOfficer}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: () => (
        <Badge variant="outline" className="text-xs bg-blue-500/15 text-blue-400 border-blue-500/30">
          ASSIGNED
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
          onClick={() => openAssignModal(row.original, true)}
          className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300 text-xs"
        >
          <UserCheck className="h-3.5 w-3.5 mr-1.5" />
          Reassign
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-teal-400" />
            New Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl w-fit">
            <button
              onClick={() => setSubTab('yetToBeAssigned')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                subTab === 'yetToBeAssigned'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Yet to be Assigned
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                subTab === 'yetToBeAssigned'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-500'
              }`}>
                {unassignedCases.length}
              </span>
            </button>
            <button
              onClick={() => setSubTab('assigned')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                subTab === 'assigned'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Assigned
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                subTab === 'assigned'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-500'
              }`}>
                {assignedCases.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            key={subTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {subTab === 'yetToBeAssigned' ? (
              <DataTable
                columns={unassignedColumns}
                data={unassignedCases}
                searchPlaceholder="Search unassigned cases..."
              />
            ) : (
              <DataTable
                columns={assignedColumns}
                data={assignedCases}
                searchPlaceholder="Search assigned cases..."
              />
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Assign / Reassign Officer Modal */}
      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={isReassign ? 'Reassign CRM Officer' : 'Assign CRM Officer'}
        description={
          selectedCase
            ? `${isReassign ? 'Reassign' : 'Assign an officer to'} case ${selectedCase.caseNumber} (${selectedCase.customerName})`
            : undefined
        }
      >
        <div className="space-y-5">
          {/* Case Info Summary */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Case Number</span>
              <span className="text-sm text-white font-medium">{selectedCase?.caseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Customer</span>
              <span className="text-sm text-white">{selectedCase?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Approve Amount</span>
              <span className="text-sm text-white">
                ETB {selectedCase?.approveAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Officer Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Select CRM Officer</Label>
            <Select value={selectedOfficerId} onValueChange={(v) => setSelectedOfficerId(v ?? '')}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Choose an officer..." />
              </SelectTrigger>
              <SelectContent className="bg-navy-800 border-white/10 text-white">
                {MOCK_OFFICERS.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{officer.name}</span>
                      <span className="text-xs text-gray-500 ml-3">
                        ({officer.activeCases} active)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg shadow-teal-500/20"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {isReassign ? 'Reassign' : 'Assign'}
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
