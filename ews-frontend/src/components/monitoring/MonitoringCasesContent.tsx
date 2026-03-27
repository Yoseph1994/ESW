import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Briefcase, Clock, CheckCircle, Eye, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  caseApi,
  sectorApi,
  subSectorApi,
  broadSegmentApi,
  creditProductLineApi,
  productGroupApi,
  subProductLineApi,
} from '@/services/api';
import type { Case, RiskLevel, Sector, SubSector, BroadSegment, CreditProductLine, ProductGroup, SubProductLine } from '@/types';

// ─── Case ID Generation ────────────────────────────────────────────
function generateCaseId(seq: number): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const seqStr = String(seq).padStart(4, '0');
  return `50168/${seqStr}/${mm}/${yyyy}`;
}

// ─── Zod Schema ───────────────────────────────────────────────────
const caseSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  customerName: z.string().min(2, 'Customer name is required'),
  totalExposure: z.coerce.number().positive('Must be positive'),
  customerSegment: z.string().min(1, 'Customer segment is required'),
  economicSector: z.string().min(1, 'Economic sector is required'),
  subEconomicSector: z.string().min(1, 'Sub-economic sector is required'),
  broadSegment: z.string().min(1, 'Broad segment is required'),
  creditProductLine: z.string().min(1, 'Credit product line is required'),
  productGroup: z.string().min(1, 'Product group is required'),
  subProductGroup: z.string().min(1, 'Sub product group is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  approveAmount: z.coerce.number().positive('Must be positive'),
  lafNo: z.string().min(1, 'LAF No is required'),
  dateOfApproval: z.string().min(1, 'Date of approval is required'),
  limit: z.coerce.number().positive('Must be positive'),
  tenure: z.string().min(1, 'Tenure is required'),
});

type CaseFormData = z.infer<typeof caseSchema>;

const RISK_BADGE_STYLES: Record<RiskLevel, string> = {
  HIGH: 'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-200',
  LOW: 'bg-purple-50 text-purple-600 border-purple-200',
};

type CasesTab = 'addNew' | 'pending' | 'completed';

// ─── Tabs config ──────────────────────────────────────────────────
const TAB_CONFIG: { id: CasesTab; label: string; icon: typeof Plus }[] = [
  { id: 'addNew', label: 'Add New Case', icon: Plus },
  { id: 'pending', label: 'Pending Cases', icon: Clock },
  { id: 'completed', label: 'Completed Cases', icon: CheckCircle },
];

// ─── Customer Segments ────────────────────────────────────────────
const CUSTOMER_SEGMENTS = ['Corporate', 'SME', 'Retail', 'Government', 'Institutional'];

// ─── Tenure Options ────────────────────────────────────────────────
const DEFAULT_TENURES = ['6 Months', '1 Year', '2 Years', '3 Years', '5 Years', '7 Years', '10 Years', '15 Years', '20 Years'];

// ─── Purpose Options ─────────────────────────────────────────────
const DEFAULT_PURPOSES = [
  'Equipment Purchase', 'Working Capital', 'Import Financing', 'Export Financing',
  'Construction', 'Real Estate', 'Vehicle Purchase', 'Agricultural Input',
  'Inventory Financing', 'Business Expansion', 'Debt Refinancing', 'Other',
];

// ─── Mock Data ────────────────────────────────────────────────────
const MOCK_PENDING: Case[] = [
  {
    id: '10', caseId: '50168/0010/03/2026', customerId: 'CUS-20456',
    customerName: 'Selam Transport PLC', totalExposure: 12000000,
    customerSegment: 'Corporate', economicSector: 'Transport',
    subEconomicSector: 'Road Transport', broadSegment: 'Large Enterprise',
    creditProductLine: 'Term Loan', productGroup: 'Asset Finance',
    subProductGroup: 'Vehicle Loan', purpose: 'Vehicle Purchase',
    approveAmount: 10000000, lafNo: 'LAF-2026-010', dateOfApproval: '2026-03-01',
    limit: 15000000, tenure: '5 Years', status: 'PENDING',
    dateSent: '2026-03-05',
    createdAt: '2026-02-28', updatedAt: '2026-03-05',
  },
  {
    id: '11', caseId: '50168/0011/03/2026', customerId: 'CUS-20789',
    customerName: 'Bethlehem Garment', totalExposure: 3500000,
    customerSegment: 'SME', economicSector: 'Manufacturing',
    subEconomicSector: 'Textile', broadSegment: 'Medium Enterprise',
    creditProductLine: 'Overdraft', productGroup: 'Working Capital',
    subProductGroup: 'Short Term WC', purpose: 'Working Capital',
    approveAmount: 2800000, lafNo: 'LAF-2026-011', dateOfApproval: '2026-03-05',
    limit: 4000000, tenure: '1 Year', status: 'PENDING',
    dateSent: '2026-03-10',
    createdAt: '2026-03-03', updatedAt: '2026-03-10',
  },
];

const MOCK_COMPLETED: Case[] = [
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
        { criterion: 'Financial Performance', score: 8, maxScore: 10, comment: 'Strong revenue growth' },
        { criterion: 'Collateral Coverage', score: 9, maxScore: 10, comment: 'Adequate collateral' },
        { criterion: 'Industry Risk', score: 7, maxScore: 10, comment: 'Stable sector' },
        { criterion: 'Management Quality', score: 8, maxScore: 10, comment: 'Experienced team' },
      ],
      totalScore: 32, maxTotalScore: 40,
      verdict: 'LOW', evaluatedBy: 'CRM Officer Kebede',
      evaluatedAt: '2026-03-05', notes: 'Client in good standing',
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
        { criterion: 'Financial Performance', score: 4, maxScore: 10, comment: 'Declining margins' },
        { criterion: 'Collateral Coverage', score: 5, maxScore: 10, comment: 'Under-collateralized' },
        { criterion: 'Industry Risk', score: 6, maxScore: 10, comment: 'Volatile market' },
        { criterion: 'Management Quality', score: 5, maxScore: 10, comment: 'Key-man dependency' },
      ],
      totalScore: 20, maxTotalScore: 40,
      verdict: 'HIGH', evaluatedBy: 'CRM Officer Hailu',
      evaluatedAt: '2026-03-10', notes: 'Requires close monitoring',
    },
  },
];

// ─── SelectWithAdd Component ──────────────────────────────────────
function SelectWithAdd({
  value,
  onValueChange,
  options,
  onAddNew,
  placeholder,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  onAddNew: (newVal: string) => void;
  placeholder: string;
}) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newValue, setNewValue] = useState('');

  if (showAddInput) {
    return (
      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`New ${placeholder.toLowerCase()}...`}
          className="bg-white border-gray-200 text-gray-800 flex-1"
          autoFocus
        />
        <Button
          type="button"
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-xs px-3"
          onClick={() => {
            if (newValue.trim()) {
              onAddNew(newValue.trim());
              onValueChange(newValue.trim());
              setNewValue('');
              setShowAddInput(false);
            }
          }}
        >
          Add
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-gray-500 text-xs px-2"
          onClick={() => { setShowAddInput(false); setNewValue(''); }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={(v) => { if (v) onValueChange(v); }}>
        <SelectTrigger className="bg-white border-gray-200 text-gray-800 flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200 text-gray-800 max-h-60">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-10 w-10 text-purple-600 hover:text-purple-500 hover:bg-purple-50 shrink-0"
        onClick={() => setShowAddInput(true)}
        title="Add new option"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════
export default function MonitoringCasesContent() {
  const [activeTab, setActiveTab] = useState<CasesTab>('addNew');
  const [pendingCases, setPendingCases] = useState<Case[]>(MOCK_PENDING);
  const [completedCases, setCompletedCases] = useState<Case[]>(MOCK_COMPLETED);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<CaseFormData | null>(null);
  const [generatedCaseId, setGeneratedCaseId] = useState(generateCaseId(12));
  const [caseSeq, setCaseSeq] = useState(12);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // ─── Dynamic options state (loadable from backend + add on the fly) ───
  const [sectorOptions, setSectorOptions] = useState<string[]>(['Agriculture', 'Manufacturing', 'Trade', 'Construction', 'Transport', 'Health', 'Education', 'ICT', 'Mining', 'Tourism']);
  const [subSectorOptions, setSubSectorOptions] = useState<string[]>(['Crop Production', 'Food Processing', 'Wholesale', 'Retail', 'Building Construction', 'Road Transport', 'Pharmaceuticals', 'Textile', 'Export', 'Import']);
  const [broadSegmentOptions, setBroadSegmentOptions] = useState<string[]>(['Large Enterprise', 'Medium Enterprise', 'Small Enterprise', 'Micro Enterprise']);
  const [creditProductLineOptions, setCreditProductLineOptions] = useState<string[]>(['Term Loan', 'Overdraft', 'Project Finance', 'Pre-Export Finance', 'Letter of Credit', 'Bank Guarantee', 'Mortgage Loan']);
  const [productGroupOptions, setProductGroupOptions] = useState<string[]>(['Working Capital', 'Trade Finance', 'Asset Finance', 'Infrastructure', 'Agri Finance', 'Health Sector', 'Real Estate']);
  const [subProductGroupOptions, setSubProductGroupOptions] = useState<string[]>(['Short Term WC', 'Import LC', 'Pre-Shipment', 'Vehicle Loan', 'Seasonal', 'Road Construction', 'Pharma Equipment', 'Domestic Trade']);
  const [purposeOptions, setPurposeOptions] = useState<string[]>(DEFAULT_PURPOSES);
  const [tenureOptions, setTenureOptions] = useState<string[]>(DEFAULT_TENURES);

  // Attempt to load options from backend
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [sectors, subSectors, broad, cpl, pg, spl] = await Promise.all([
          sectorApi.getAll(),
          subSectorApi.getAll(),
          broadSegmentApi.getAll(),
          creditProductLineApi.getAll(),
          productGroupApi.getAll(),
          subProductLineApi.getAll(),
        ]);
        if (sectors.data.length) setSectorOptions(sectors.data.map((s: Sector) => s.economicSector));
        if (subSectors.data.length) setSubSectorOptions(subSectors.data.map((s: SubSector) => s.name));
        if (broad.data.length) setBroadSegmentOptions(broad.data.map((s: BroadSegment) => s.name));
        if (cpl.data.length) setCreditProductLineOptions(cpl.data.map((s: CreditProductLine) => s.name));
        if (pg.data.length) setProductGroupOptions(pg.data.map((s: ProductGroup) => s.name));
        if (spl.data.length) setSubProductGroupOptions(spl.data.map((s: SubProductLine) => s.name));
      } catch {
        // Use default options
      }
    };
    loadOptions();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema) as any,
    defaultValues: {
      customerId: '', customerName: '', totalExposure: 0,
      customerSegment: '', economicSector: '', subEconomicSector: '',
      broadSegment: '', creditProductLine: '', productGroup: '',
      subProductGroup: '', purpose: '', approveAmount: 0,
      lafNo: '', dateOfApproval: '', limit: 0, tenure: '',
    },
  });

  // ─── Review & Confirm Flow ──────────────────────────────────────
  const onFormSubmit = (data: CaseFormData) => {
    setReviewData(data);
    setReviewModalOpen(true);
  };

  const confirmCase = async () => {
    if (!reviewData) return;
    const newCase: Case = {
      id: Date.now().toString(),
      caseId: generatedCaseId,
      ...reviewData,
      status: 'PENDING',
      dateSent: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await caseApi.create(newCase);
    } catch {
      // Use local state
    }

    setPendingCases((prev) => [newCase, ...prev]);
    const nextSeq = caseSeq + 1;
    setCaseSeq(nextSeq);
    setGeneratedCaseId(generateCaseId(nextSeq));
    setReviewModalOpen(false);
    setReviewData(null);
    reset();
    toast.success('Case registered & sent to CRM Manager', {
      description: `Case ${newCase.caseId} created successfully`,
    });
    setActiveTab('pending');
  };

  // ─── Pending Columns ───────────────────────────────────────────
  const pendingColumns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseId',
      header: 'Case Number',
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.caseId}</span>,
    },
    { accessorKey: 'customerName', header: 'Customer Name' },
    { accessorKey: 'customerId', header: 'Customer ID' },
    {
      accessorKey: 'approveAmount',
      header: 'Approve Amount',
      cell: ({ row }) => <span>{row.original.approveAmount.toLocaleString()} ETB</span>,
    },
    { accessorKey: 'dateSent', header: 'Date Sent' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: () => (
        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
          Pending
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant="ghost" size="sm"
          className="text-purple-600 hover:text-purple-500 hover:bg-purple-50 text-xs"
          onClick={() => { setSelectedCase(row.original); setDetailModalOpen(true); }}
        >
          <Eye className="h-3 w-3 mr-1" /> View
        </Button>
      ),
    },
  ];

  // ─── Completed Columns ──────────────────────────────────────────
  const completedColumns: ColumnDef<Case>[] = [
    {
      accessorKey: 'caseId',
      header: 'Case Number',
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.caseId}</span>,
    },
    { accessorKey: 'customerName', header: 'Customer Name' },
    { accessorKey: 'customerId', header: 'Customer ID' },
    {
      accessorKey: 'approveAmount',
      header: 'Approve Amount',
      cell: ({ row }) => <span>{row.original.approveAmount?.toLocaleString() ?? 0} ETB</span>,
    },
    { accessorKey: 'dateReturned', header: 'Date Returned' },
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
      cell: ({ row }) => (
        <Button
          variant="ghost" size="sm"
          className="text-purple-600 hover:text-purple-500 hover:bg-purple-50 text-xs"
          onClick={() => { setSelectedCase(row.original); setDetailModalOpen(true); }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Tab Buttons */}
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`gap-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-150 hover:text-purple-600'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ─── ADD NEW CASE TAB ─── */}
      {activeTab === 'addNew' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Add New Case
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-5">
                {/* Case ID (auto-generated, read-only) */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Case ID</Label>
                  <Input
                    value={generatedCaseId}
                    readOnly
                    className="bg-purple-50 border-purple-200 text-purple-700 font-mono cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400">Auto-generated</p>
                </div>

                {/* Row: Customer ID + Customer Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Customer ID</Label>
                    <Input {...register('customerId')} placeholder="CUS-XXXXX" className="bg-white border-gray-200 text-gray-800" />
                    {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Customer Name</Label>
                    <Input {...register('customerName')} className="bg-white border-gray-200 text-gray-800" />
                    {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
                  </div>
                </div>

                {/* Row: Total Exposure + Customer Segment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Total Exposure (ETB)</Label>
                    <Input type="number" {...register('totalExposure')} className="bg-white border-gray-200 text-gray-800" />
                    {errors.totalExposure && <p className="text-xs text-red-500">{errors.totalExposure.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Customer Segment</Label>
                    <Select value={watch('customerSegment') ?? ''} onValueChange={(v) => { if (v) setValue('customerSegment', v); }}>
                      <SelectTrigger className="bg-white border-gray-200 text-gray-800">
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-800">
                        {CUSTOMER_SEGMENTS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.customerSegment && <p className="text-xs text-red-500">{errors.customerSegment.message}</p>}
                  </div>
                </div>

                {/* Row: Economic Sector + Sub-Economic Sector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Economic Sector</Label>
                    <SelectWithAdd
                      value={watch('economicSector')}
                      onValueChange={(v) => setValue('economicSector', v)}
                      options={sectorOptions}
                      onAddNew={(v) => setSectorOptions((prev) => [...prev, v])}
                      placeholder="Select sector"
                    />
                    {errors.economicSector && <p className="text-xs text-red-500">{errors.economicSector.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Sub-Economic Sector</Label>
                    <SelectWithAdd
                      value={watch('subEconomicSector')}
                      onValueChange={(v) => setValue('subEconomicSector', v)}
                      options={subSectorOptions}
                      onAddNew={(v) => setSubSectorOptions((prev) => [...prev, v])}
                      placeholder="Select sub-sector"
                    />
                    {errors.subEconomicSector && <p className="text-xs text-red-500">{errors.subEconomicSector.message}</p>}
                  </div>
                </div>

                {/* Row: Broad Segment + Credit Product Line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Broad Segment</Label>
                    <SelectWithAdd
                      value={watch('broadSegment')}
                      onValueChange={(v) => setValue('broadSegment', v)}
                      options={broadSegmentOptions}
                      onAddNew={(v) => setBroadSegmentOptions((prev) => [...prev, v])}
                      placeholder="Select broad segment"
                    />
                    {errors.broadSegment && <p className="text-xs text-red-500">{errors.broadSegment.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Credit Product Line</Label>
                    <SelectWithAdd
                      value={watch('creditProductLine')}
                      onValueChange={(v) => setValue('creditProductLine', v)}
                      options={creditProductLineOptions}
                      onAddNew={(v) => setCreditProductLineOptions((prev) => [...prev, v])}
                      placeholder="Select credit product line"
                    />
                    {errors.creditProductLine && <p className="text-xs text-red-500">{errors.creditProductLine.message}</p>}
                  </div>
                </div>

                {/* Row: Product Group + Sub Product Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Product Group</Label>
                    <SelectWithAdd
                      value={watch('productGroup')}
                      onValueChange={(v) => setValue('productGroup', v)}
                      options={productGroupOptions}
                      onAddNew={(v) => setProductGroupOptions((prev) => [...prev, v])}
                      placeholder="Select product group"
                    />
                    {errors.productGroup && <p className="text-xs text-red-500">{errors.productGroup.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Sub Product Group</Label>
                    <SelectWithAdd
                      value={watch('subProductGroup')}
                      onValueChange={(v) => setValue('subProductGroup', v)}
                      options={subProductGroupOptions}
                      onAddNew={(v) => setSubProductGroupOptions((prev) => [...prev, v])}
                      placeholder="Select sub product group"
                    />
                    {errors.subProductGroup && <p className="text-xs text-red-500">{errors.subProductGroup.message}</p>}
                  </div>
                </div>

                {/* Row: Purpose + Approve Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Purpose</Label>
                    <SelectWithAdd
                      value={watch('purpose')}
                      onValueChange={(v) => setValue('purpose', v)}
                      options={purposeOptions}
                      onAddNew={(v) => setPurposeOptions((prev) => [...prev, v])}
                      placeholder="Select purpose"
                    />
                    {errors.purpose && <p className="text-xs text-red-500">{errors.purpose.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Approve Amount (ETB)</Label>
                    <Input type="number" {...register('approveAmount')} className="bg-white border-gray-200 text-gray-800" />
                    {errors.approveAmount && <p className="text-xs text-red-500">{errors.approveAmount.message}</p>}
                  </div>
                </div>

                {/* Row: LAF No + Date of Approval */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">LAF No</Label>
                    <Input {...register('lafNo')} placeholder="LAF-2026-XXX" className="bg-white border-gray-200 text-gray-800" />
                    {errors.lafNo && <p className="text-xs text-red-500">{errors.lafNo.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Date of Approval</Label>
                    <Input type="date" {...register('dateOfApproval')} className="bg-white border-gray-200 text-gray-800" />
                    {errors.dateOfApproval && <p className="text-xs text-red-500">{errors.dateOfApproval.message}</p>}
                  </div>
                </div>

                {/* Row: Limit + Tenure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Limit (ETB)</Label>
                    <Input type="number" {...register('limit')} className="bg-white border-gray-200 text-gray-800" />
                    {errors.limit && <p className="text-xs text-red-500">{errors.limit.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Tenure</Label>
                    <SelectWithAdd
                      value={watch('tenure')}
                      onValueChange={(v) => setValue('tenure', v)}
                      options={tenureOptions}
                      onAddNew={(v) => setTenureOptions((prev) => [...prev, v])}
                      placeholder="Select tenure"
                    />
                    {errors.tenure && <p className="text-xs text-red-500">{errors.tenure.message}</p>}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-500"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/20">
                    <Send className="h-4 w-4 mr-2" />
                    Review & Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── PENDING CASES TAB ─── */}
      {activeTab === 'pending' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Pending Cases
              </CardTitle>
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                {pendingCases.length} pending
              </Badge>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={pendingColumns}
                data={pendingCases}
                searchPlaceholder="Search pending cases..."
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── COMPLETED CASES TAB ─── */}
      {activeTab === 'completed' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                Completed Cases
              </CardTitle>
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                {completedCases.length} completed
              </Badge>
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
      )}

      {/* ─── REVIEW & CONFIRM MODAL ─── */}
      <FormModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        title="Review & Confirm Case"
        description="Please review the case details before submitting"
      >
        {reviewData && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4 space-y-3 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Case ID</p>
                  <p className="text-purple-600 font-mono">{generatedCaseId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Customer ID</p>
                  <p className="text-gray-800">{reviewData.customerId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Customer Name</p>
                  <p className="text-gray-800">{reviewData.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total Exposure</p>
                  <p className="text-gray-800">{Number(reviewData.totalExposure || 0).toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Customer Segment</p>
                  <p className="text-gray-800">{reviewData.customerSegment}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Economic Sector</p>
                  <p className="text-gray-800">{reviewData.economicSector}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Sub-Economic Sector</p>
                  <p className="text-gray-800">{reviewData.subEconomicSector}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Broad Segment</p>
                  <p className="text-gray-800">{reviewData.broadSegment}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Credit Product Line</p>
                  <p className="text-gray-800">{reviewData.creditProductLine}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Product Group</p>
                  <p className="text-gray-800">{reviewData.productGroup}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Sub Product Group</p>
                  <p className="text-gray-800">{reviewData.subProductGroup}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Purpose</p>
                  <p className="text-gray-800">{reviewData.purpose}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Approve Amount</p>
                  <p className="text-gray-800">{Number(reviewData.approveAmount || 0).toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">LAF No</p>
                  <p className="text-gray-800">{reviewData.lafNo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Date of Approval</p>
                  <p className="text-gray-800">{reviewData.dateOfApproval}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Limit</p>
                  <p className="text-gray-800">{Number(reviewData.limit || 0).toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Tenure</p>
                  <p className="text-gray-800">{reviewData.tenure}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="text-gray-500"
                onClick={() => setReviewModalOpen(false)}
              >
                Edit
              </Button>
              <Button
                onClick={confirmCase}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/20"
              >
                <Send className="h-4 w-4 mr-2" />
                Confirm & Send to CRM
              </Button>
            </div>
          </div>
        )}
      </FormModal>

      {/* ─── CASE DETAIL MODAL ─── */}
      <FormModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        title="Case Details"
        description={selectedCase ? `Case ${selectedCase.caseId}` : ''}
      >
        {selectedCase && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
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
                  <p className="text-gray-400 text-xs">Sector</p>
                  <p className="text-gray-800">{selectedCase.economicSector}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Approve Amount</p>
                  <p className="text-gray-800">{selectedCase.approveAmount.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Status</p>
                  <Badge variant="outline" className={`text-xs ${
                    selectedCase.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    selectedCase.status === 'COMPLETED' && selectedCase.riskLevel ? RISK_BADGE_STYLES[selectedCase.riskLevel] :
                    'bg-purple-50 text-purple-600 border-purple-200'
                  }`}>
                    {selectedCase.status}
                  </Badge>
                </div>
                {selectedCase.riskLevel && (
                  <div>
                    <p className="text-gray-400 text-xs">Risk Level</p>
                    <Badge variant="outline" className={`text-xs ${RISK_BADGE_STYLES[selectedCase.riskLevel]}`}>
                      {selectedCase.riskLevel}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluation Details (if completed) */}
            {selectedCase.evaluation && (
              <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                <h4 className="text-sm font-semibold text-purple-600">Evaluation Results</h4>
                <div className="space-y-2">
                  {selectedCase.evaluation.criteria.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div>
                        <p className="text-sm text-gray-800">{c.criterion}</p>
                        <p className="text-xs text-gray-400">{c.comment}</p>
                      </div>
                      <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                        {c.score}/{c.maxScore}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Total Score</p>
                    <p className="text-xs text-gray-400">Evaluated by {selectedCase.evaluation.evaluatedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{selectedCase.evaluation.totalScore}/{selectedCase.evaluation.maxTotalScore}</p>
                    <Badge variant="outline" className={`text-xs ${RISK_BADGE_STYLES[selectedCase.evaluation.verdict]}`}>
                      {selectedCase.evaluation.verdict} RISK
                    </Badge>
                  </div>
                </div>
                {selectedCase.evaluation.notes && (
                  <p className="text-xs text-gray-500 italic">{selectedCase.evaluation.notes}</p>
                )}
              </div>
            )}
          </div>
        )}
      </FormModal>
    </div>
  );
}
