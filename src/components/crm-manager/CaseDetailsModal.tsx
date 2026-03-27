/**
 * Case Details Modal (Phase 3)
 * Large modal showing full case details and criteria evaluated by CRM Officer.
 * Criteria data structured as an array of objects for easy API replacement.
 */
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, ClipboardList } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MOCK_CRITERIA } from '@/data/mockCrmData';
import type { Case } from '@/types';

interface CaseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case | null;
}

export default function CaseDetailsModal({
  open,
  onOpenChange,
  caseData,
}: CaseDetailsModalProps) {
  if (!caseData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-400" />
            Case Details
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Complete case information and evaluation criteria
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Case Summary Header */}
          <div className="p-5 rounded-xl bg-white/5 border border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Case Number</span>
                <p className="text-sm font-semibold text-white">{caseData.caseNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Customer Name</span>
                <p className="text-sm font-semibold text-white">{caseData.customerName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Customer Id</span>
                <p className="text-sm text-white">{caseData.customerId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Approve Amount</span>
                <p className="text-sm font-semibold text-white">
                  ETB {caseData.approveAmount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Assigned Officer</span>
                <p className="text-sm text-white">{caseData.assignedOfficer || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Status</span>
                <div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {caseData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Criteria Evaluated by CRM Officer */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-teal-400" />
              Criteria Evaluated by CRM Officer
            </h3>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 bg-white/[0.02] px-4 py-3 border-b border-white/5">
                <span className="col-span-1 text-xs text-teal-400/80 font-semibold uppercase tracking-wider">#</span>
                <span className="col-span-3 text-xs text-teal-400/80 font-semibold uppercase tracking-wider">Criterion Name</span>
                <span className="col-span-2 text-xs text-teal-400/80 font-semibold uppercase tracking-wider">Score</span>
                <span className="col-span-6 text-xs text-teal-400/80 font-semibold uppercase tracking-wider">Notes</span>
              </div>

              {/* Criteria Rows */}
              {MOCK_CRITERIA.map((criterion, index) => (
                <motion.div
                  key={criterion.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                  }`}
                >
                  <span className="col-span-1 text-sm text-gray-500">{criterion.id}</span>
                  <span className="col-span-3 text-sm text-white font-medium">{criterion.name}</span>
                  <span className="col-span-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getScoreBadgeColor(criterion.score)}`}
                    >
                      {criterion.score}
                    </Badge>
                  </span>
                  <span className="col-span-6 text-sm text-gray-400 leading-relaxed">{criterion.notes}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Back to List Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

/** Returns the appropriate badge color class based on criteria score */
function getScoreBadgeColor(score: string): string {
  const s = score.toLowerCase();
  if (['excellent', 'positive', 'low'].includes(s)) {
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }
  if (['good', 'sufficient'].includes(s)) {
    return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
  }
  if (['moderate', 'acceptable'].includes(s)) {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
  if (['poor', 'high', 'negative'].includes(s)) {
    return 'bg-red-500/15 text-red-400 border-red-500/30';
  }
  return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
}
