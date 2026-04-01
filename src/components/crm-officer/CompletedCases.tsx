import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Search, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { crmCaseApi } from '@/services/api';
import type { CrmOfficerCase, ActiveTab } from '@/types';

const MOCK_COMPLETED: CrmOfficerCase[] = [
  { id: '10', caseId: 'EWS-2026-010', customerName: 'Dire Dawa Steel', loanType: 'Term Loan', totalExposure: 15_000_000, sector: 'Manufacturing', approveAmount: 14_000_000, assignedDate: '2026-03-10', status: 'Submitted', totalScore: 72, riskLevel: 'MEDIUM', submissionDate: '2026-03-20' },
  { id: '11', caseId: 'EWS-2026-011', customerName: 'Awash Wine Factory', loanType: 'Working Capital', totalExposure: 8_000_000, sector: 'Agriculture', approveAmount: 7_500_000, assignedDate: '2026-03-08', status: 'Submitted', totalScore: 35, riskLevel: 'LOW', submissionDate: '2026-03-18' },
  { id: '12', caseId: 'EWS-2026-012', customerName: 'Addis Pharma Ltd', loanType: 'Equipment Financing', totalExposure: 20_000_000, sector: 'Healthcare', approveAmount: 18_000_000, assignedDate: '2026-03-05', status: 'Submitted', totalScore: 88, riskLevel: 'HIGH', submissionDate: '2026-03-15' },
  { id: '13', caseId: 'EWS-2026-013', customerName: 'Bole Printing Press', loanType: 'Pre-Shipment', totalExposure: 4_000_000, sector: 'Service', approveAmount: 3_800_000, assignedDate: '2026-03-02', status: 'Submitted', totalScore: 55, riskLevel: 'MEDIUM', submissionDate: '2026-03-12' },
];

interface CompletedCasesProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectCase: (c: CrmOfficerCase, readOnly: boolean) => void;
}

export default function CompletedCases({ onNavigate, onSelectCase }: CompletedCasesProps) {
  const [cases, setCases] = useState<CrmOfficerCase[]>(MOCK_COMPLETED);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try { const res = await crmCaseApi.getCompleted(); setCases(res.data); } catch { /* mock */ } finally { setLoading(false); }
    };
    fetchCases();
  }, []);

  const filtered = cases.filter((c) => c.customerName.toLowerCase().includes(search.toLowerCase()) || c.caseId.toLowerCase().includes(search.toLowerCase()));

  const handleView = (caseItem: CrmOfficerCase) => {
    onSelectCase(caseItem, true);
    onNavigate('crm-questionnaire');
  };

  const riskBadge = (level?: string) => {
    const styles: Record<string, string> = { HIGH: 'border-red-300 text-red-700 bg-red-50', MEDIUM: 'border-amber-300 text-amber-700 bg-amber-50', LOW: 'border-green-300 text-green-700 bg-green-50' };
    return <Badge variant="outline" className={styles[level || ''] || ''}>{level || '-'}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              Completed Cases
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search cases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 border-purple-200 focus:border-purple-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full bg-purple-100" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead className="text-center">Total Score / Risk</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-gray-500 py-8">No completed cases found</TableCell></TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c.id} className="hover:bg-purple-50/50">
                        <TableCell className="font-medium text-purple-700">{c.caseId}</TableCell>
                        <TableCell className="font-medium">{c.customerName}</TableCell>
                        <TableCell>{c.loanType}</TableCell>
                        <TableCell className="text-center">
                          <span className="mr-2 font-semibold">{c.totalScore ?? '-'}</span>
                          {riskBadge(c.riskLevel)}
                        </TableCell>
                        <TableCell className="text-gray-500">{c.submissionDate || '-'}</TableCell>
                        <TableCell><Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">Submitted</Badge></TableCell>
                        <TableCell className="text-center">
                          <Button size="sm" variant="outline" onClick={() => handleView(c)} className="border-purple-300 text-purple-700 hover:bg-purple-50">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
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
