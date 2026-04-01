import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { crmCaseApi } from '@/services/api';
import type { CrmOfficerCase, ActiveTab } from '@/types';

const MOCK_CASES: CrmOfficerCase[] = [
  { id: '1', caseId: 'EWS-2026-001', customerName: 'Abebe Trading PLC', loanType: 'Term Loan', totalExposure: 5_000_000, sector: 'Manufacturing', approveAmount: 4_500_000, assignedDate: '2026-03-28', status: 'New' },
  { id: '2', caseId: 'EWS-2026-002', customerName: 'Ethio Metals Corp', loanType: 'Working Capital', totalExposure: 12_000_000, sector: 'Mining', approveAmount: 10_000_000, assignedDate: '2026-03-27', status: 'In Progress' },
  { id: '3', caseId: 'EWS-2026-003', customerName: 'Star Agro Ltd', loanType: 'Agriculture Loan', totalExposure: 3_200_000, sector: 'Agriculture', approveAmount: 3_000_000, assignedDate: '2026-03-26', status: 'New' },
  { id: '4', caseId: 'EWS-2026-004', customerName: 'Habesha Cement', loanType: 'Project Finance', totalExposure: 25_000_000, sector: 'Construction', approveAmount: 22_000_000, assignedDate: '2026-03-25', status: 'In Progress' },
  { id: '5', caseId: 'EWS-2026-005', customerName: 'Unity Transport', loanType: 'Equipment Financing', totalExposure: 8_500_000, sector: 'Transport', approveAmount: 7_000_000, assignedDate: '2026-03-24', status: 'Ready to Submit' },
  { id: '6', caseId: 'EWS-2026-006', customerName: 'Nile Coffee Export', loanType: 'Pre-Shipment', totalExposure: 6_000_000, sector: 'Agriculture', approveAmount: 5_500_000, assignedDate: '2026-03-23', status: 'New' },
];

interface NewAssignedCasesProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectCase: (c: CrmOfficerCase) => void;
}

export default function NewAssignedCases({ onNavigate, onSelectCase }: NewAssignedCasesProps) {
  const [cases, setCases] = useState<CrmOfficerCase[]>(MOCK_CASES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try { const res = await crmCaseApi.getAssigned(); setCases(res.data); } catch { /* mock */ } finally { setLoading(false); }
    };
    fetchCases();
  }, []);

  const filtered = cases.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.caseId.toLowerCase().includes(search.toLowerCase()) ||
    c.sector.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssess = (caseItem: CrmOfficerCase) => {
    onSelectCase(caseItem);
    onNavigate('crm-questionnaire');
  };

  const statusBadge = (status: CrmOfficerCase['status']) => {
    const styles: Record<string, string> = {
      New: 'border-blue-300 text-blue-700 bg-blue-50',
      'In Progress': 'border-purple-300 text-purple-700 bg-purple-50',
      'Ready to Submit': 'border-green-300 text-green-700 bg-green-50',
    };
    return <Badge variant="outline" className={styles[status] || ''}>{status}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-600" />
              New Assigned Cases
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search cases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-purple-200 focus:border-purple-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full bg-purple-100" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead className="text-right">Total Exposure</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-gray-500 py-8">No assigned cases found</TableCell></TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c.id} className="hover:bg-purple-50/50">
                        <TableCell className="font-medium text-purple-700">{c.caseId}</TableCell>
                        <TableCell className="font-medium">{c.customerName}</TableCell>
                        <TableCell>{c.loanType}</TableCell>
                        <TableCell className="text-right">{c.totalExposure.toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}</TableCell>
                        <TableCell>{c.sector}</TableCell>
                        <TableCell className="text-gray-500">{c.assignedDate}</TableCell>
                        <TableCell>{statusBadge(c.status)}</TableCell>
                        <TableCell className="text-center">
                          <Button size="sm" onClick={() => handleAssess(c)} className="text-white" style={{ backgroundColor: '#b129b6' }}>Assess</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
