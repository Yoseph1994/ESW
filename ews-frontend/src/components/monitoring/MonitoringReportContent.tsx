import { useState } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/DataTable';
import { FormModal } from '@/components/ui/FormModal';
import type { Case, RiskLevel } from '@/types';

const RISK_BADGE_STYLES: Record<RiskLevel, string> = {
  HIGH: 'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-200',
  LOW: 'bg-purple-50 text-purple-600 border-purple-200',
};

// Mock completed cases with evaluations for the report
const MOCK_REPORT_CASES: Case[] = [
  {
    id: '20', caseId: '50168/0020/02/2026', customerId: 'CUS-30123',
    customerName: 'Addis Pharma PLC', totalExposure: 20000000,
    customerSegment: 'Corporate', economicSector: 'Health',
    subEconomicSector: 'Pharmaceuticals', broadSegment: 'Large Enterprise',
    creditProductLine: 'Term Loan', productGroup: 'Health Sector',
    subProductGroup: 'Pharma Equipment', purpose: 'Equipment Purchase',
    approveAmount: 16000000, lafNo: 'LAF-2026-020', dateOfApproval: '2026-01-25',
    limit: 22000000, tenure: '7 Years', status: 'COMPLETED', riskLevel: 'LOW',
    dateSent: '2026-02-01', dateReturned: '2026-03-05',
    createdAt: '2026-01-20', updatedAt: '2026-03-05',
    evaluation: {
      criteria: [
        { criterion: 'Financial Performance', score: 8, maxScore: 10, comment: 'Strong revenue growth, consistent profitability over 3 years' },
        { criterion: 'Collateral Coverage', score: 9, maxScore: 10, comment: 'Collateral exceeds requirement by 140%' },
        { criterion: 'Industry Risk', score: 7, maxScore: 10, comment: 'Pharmaceutical sector is stable with growing demand' },
        { criterion: 'Management Quality', score: 8, maxScore: 10, comment: 'Experienced management with proven track record' },
        { criterion: 'Cash Flow Adequacy', score: 8, maxScore: 10, comment: 'Operating cash flows sufficient for debt service' },
      ],
      totalScore: 40, maxTotalScore: 50,
      verdict: 'LOW', evaluatedBy: 'CRM Officer Kebede',
      evaluatedAt: '2026-03-05', notes: 'Client in good standing. Recommended for approval with standard monitoring.',
    },
  },
  {
    id: '21', caseId: '50168/0021/02/2026', customerId: 'CUS-30456',
    customerName: 'Merkato Wholesale', totalExposure: 8000000,
    customerSegment: 'SME', economicSector: 'Trade',
    subEconomicSector: 'Wholesale', broadSegment: 'Medium Enterprise',
    creditProductLine: 'Overdraft', productGroup: 'Trade Finance',
    subProductGroup: 'Domestic Trade', purpose: 'Inventory Financing',
    approveAmount: 6500000, lafNo: 'LAF-2026-021', dateOfApproval: '2026-02-01',
    limit: 10000000, tenure: '1 Year', status: 'COMPLETED', riskLevel: 'HIGH',
    dateSent: '2026-02-05', dateReturned: '2026-03-10',
    createdAt: '2026-01-28', updatedAt: '2026-03-10',
    evaluation: {
      criteria: [
        { criterion: 'Financial Performance', score: 4, maxScore: 10, comment: 'Declining profit margins, revenue drop of 15% YoY' },
        { criterion: 'Collateral Coverage', score: 5, maxScore: 10, comment: 'Under-collateralized, gap of ~20%' },
        { criterion: 'Industry Risk', score: 6, maxScore: 10, comment: 'Volatile wholesale market with foreign exchange pressure' },
        { criterion: 'Management Quality', score: 5, maxScore: 10, comment: 'Key-man dependency, succession plan not in place' },
        { criterion: 'Cash Flow Adequacy', score: 4, maxScore: 10, comment: 'Cash flow barely covers installments' },
      ],
      totalScore: 24, maxTotalScore: 50,
      verdict: 'HIGH', evaluatedBy: 'CRM Officer Hailu',
      evaluatedAt: '2026-03-10', notes: 'Requires close monitoring. Recommend enhanced supervision and quarterly review.',
    },
  },
  {
    id: '22', caseId: '50168/0022/02/2026', customerId: 'CUS-30789',
    customerName: 'Unity Hotel Group', totalExposure: 35000000,
    customerSegment: 'Corporate', economicSector: 'Tourism',
    subEconomicSector: 'Hospitality', broadSegment: 'Large Enterprise',
    creditProductLine: 'Project Finance', productGroup: 'Real Estate',
    subProductGroup: 'Hotel Development', purpose: 'Hotel Expansion',
    approveAmount: 28000000, lafNo: 'LAF-2026-022', dateOfApproval: '2026-01-30',
    limit: 40000000, tenure: '10 Years', status: 'COMPLETED', riskLevel: 'MEDIUM',
    dateSent: '2026-02-08', dateReturned: '2026-03-12',
    createdAt: '2026-01-25', updatedAt: '2026-03-12',
    evaluation: {
      criteria: [
        { criterion: 'Financial Performance', score: 6, maxScore: 10, comment: 'Mixed results — revenue growing but margins under pressure' },
        { criterion: 'Collateral Coverage', score: 7, maxScore: 10, comment: 'Property-based collateral, adequate but illiquid' },
        { criterion: 'Industry Risk', score: 5, maxScore: 10, comment: 'Tourism recovery ongoing, seasonal volatility' },
        { criterion: 'Management Quality', score: 7, maxScore: 10, comment: 'Competent team with expansion experience' },
        { criterion: 'Cash Flow Adequacy', score: 6, maxScore: 10, comment: 'Projected cash flows depend on occupancy rates' },
      ],
      totalScore: 31, maxTotalScore: 50,
      verdict: 'MEDIUM', evaluatedBy: 'CRM Officer Tadesse',
      evaluatedAt: '2026-03-12', notes: 'Moderate risk. Continue monitoring cash flow adequacy and occupancy rate performance.',
    },
  },
  {
    id: '23', caseId: '50168/0023/03/2026', customerId: 'CUS-31012',
    customerName: 'Green Valley Farms', totalExposure: 6000000,
    customerSegment: 'SME', economicSector: 'Agriculture',
    subEconomicSector: 'Horticulture', broadSegment: 'Small Enterprise',
    creditProductLine: 'Term Loan', productGroup: 'Agri Finance',
    subProductGroup: 'Greenhouse', purpose: 'Agricultural Input',
    approveAmount: 4500000, lafNo: 'LAF-2026-023', dateOfApproval: '2026-02-15',
    limit: 7000000, tenure: '3 Years', status: 'COMPLETED', riskLevel: 'LOW',
    dateSent: '2026-02-20', dateReturned: '2026-03-18',
    createdAt: '2026-02-12', updatedAt: '2026-03-18',
    evaluation: {
      criteria: [
        { criterion: 'Financial Performance', score: 7, maxScore: 10, comment: 'Steady growth in export revenue' },
        { criterion: 'Collateral Coverage', score: 8, maxScore: 10, comment: 'Land and equipment pledged, 120% coverage' },
        { criterion: 'Industry Risk', score: 7, maxScore: 10, comment: 'Horticulture export demand strong' },
        { criterion: 'Management Quality', score: 7, maxScore: 10, comment: 'Owner-managed with good industry network' },
        { criterion: 'Cash Flow Adequacy', score: 7, maxScore: 10, comment: 'Seasonal but predictable cash flows' },
      ],
      totalScore: 36, maxTotalScore: 50,
      verdict: 'LOW', evaluatedBy: 'CRM Officer Bekele',
      evaluatedAt: '2026-03-18', notes: 'Good candidate. Seasonal monitoring recommended.',
    },
  },
];

export default function MonitoringReportContent() {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseId',
      header: 'Case Number',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.caseId}</span>
      ),
    },
    { accessorKey: 'customerName', header: 'Customer Name' },
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
    { accessorKey: 'dateReturned', header: 'Date Returned' },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-600 hover:text-purple-500 hover:bg-purple-50 text-xs"
          onClick={() => {
            setSelectedCase(row.original);
            setDetailModalOpen(true);
          }}
        >
          <Eye className="h-3 w-3 mr-1" /> Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Case Reports
            </CardTitle>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              {MOCK_REPORT_CASES.length} reports
            </Badge>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={MOCK_REPORT_CASES}
              searchPlaceholder="Search reports..."
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Evaluation Detail Modal */}
      <FormModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        title="Evaluation Report"
        description={selectedCase ? `Case ${selectedCase.caseId} — ${selectedCase.customerName}` : ''}
      >
        {selectedCase && selectedCase.evaluation && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {/* Case Overview */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-purple-600 mb-3">Case Overview</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Customer</p>
                  <p className="text-gray-800">{selectedCase.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Customer ID</p>
                  <p className="text-gray-800">{selectedCase.customerId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Economic Sector</p>
                  <p className="text-gray-800">{selectedCase.economicSector}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Segment</p>
                  <p className="text-gray-800">{selectedCase.customerSegment}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Approve Amount</p>
                  <p className="text-gray-800">{selectedCase.approveAmount.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total Exposure</p>
                  <p className="text-gray-800">{selectedCase.totalExposure.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Product</p>
                  <p className="text-gray-800">{selectedCase.creditProductLine}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Tenure</p>
                  <p className="text-gray-800">{selectedCase.tenure}</p>
                </div>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-purple-600">Evaluation Criteria</h4>
              <div className="space-y-2">
                {selectedCase.evaluation.criteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex-1 mr-4">
                      <p className="text-sm text-gray-800 font-medium">{c.criterion}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.comment}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className={`text-xs ${
                        c.score >= 7 ? 'text-purple-600 border-purple-300' :
                        c.score >= 5 ? 'text-amber-600 border-amber-300' :
                        'text-red-600 border-red-300'
                      }`}>
                        {c.score}/{c.maxScore}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Verdict */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-purple-600 mb-1">Final Verdict</h4>
                  <p className="text-xs text-gray-400">
                    Evaluated by {selectedCase.evaluation.evaluatedBy} on {selectedCase.evaluation.evaluatedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedCase.evaluation.totalScore}/{selectedCase.evaluation.maxTotalScore}
                  </p>
                  <Badge variant="outline" className={`text-sm px-3 py-1 ${RISK_BADGE_STYLES[selectedCase.evaluation.verdict]}`}>
                    {selectedCase.evaluation.verdict} RISK
                  </Badge>
                </div>
              </div>
              {selectedCase.evaluation.notes && (
                <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                  <p className="text-sm text-gray-600">{selectedCase.evaluation.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}
