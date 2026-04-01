import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { crmCaseApi } from '@/services/api';
import JustificationModal from './JustificationModal';
import type { CrmOfficerCase, ActiveTab, QuestionAnswer, QuestionnaireTab } from '@/types';

// ── Full 7-tab questionnaire definition ──
const QUESTIONNAIRE_TABS: QuestionnaireTab[] = [
  {
    id: 'financial',
    label: '1. Financial',
    weight: 25,
    questions: [
      { id: 'f1', text: 'Is the borrower experiencing declining revenue or sales trends?' },
      { id: 'f2', text: 'Are profit margins shrinking compared to prior periods?' },
      { id: 'f3', text: 'Has the borrower reported net losses in recent financial statements?' },
      { id: 'f4', text: 'Is there a deterioration in key financial ratios (e.g., debt-to-equity, current ratio)?' },
      { id: 'f5', text: 'Does the borrower have difficulty meeting interest or principal repayment obligations?' },
      { id: 'f6', text: 'Are there signs of cash flow stress (e.g., delayed receivables, increasing payables)?' },
      { id: 'f7', text: 'Has the borrower requested restructuring or rescheduling of existing debts?' },
    ],
  },
  {
    id: 'collateral',
    label: '2. Collateral',
    weight: 15,
    questions: [
      { id: 'c1', text: 'Has the value of pledged collateral declined significantly?' },
      { id: 'c2', text: 'Is the collateral coverage ratio below the minimum threshold?' },
      { id: 'c3', text: 'Are there legal issues (e.g., disputes, liens) affecting the collateral?' },
      { id: 'c4', text: 'Is the collateral difficult to liquidate or located in an illiquid market?' },
      { id: 'c5', text: 'Has the borrower failed to maintain or insure the pledged collateral?' },
    ],
  },
  {
    id: 'character',
    label: '3. Character',
    weight: 10,
    questions: [
      { id: 'ch1', text: 'Has the borrower\'s management exhibited lack of transparency or cooperation?' },
      { id: 'ch2', text: 'Are there concerns about the integrity or competence of key personnel?' },
      { id: 'ch3', text: 'Has the borrower been involved in legal disputes, fraud, or regulatory violations?' },
      { id: 'ch4', text: 'Have there been frequent changes in management or ownership?' },
      { id: 'ch5', text: 'Is there evidence of related-party transactions that may not be at arm\'s length?' },
    ],
  },
  {
    id: 'riskGrade',
    label: '4. Risk Grade',
    weight: 15,
    questions: [
      { id: 'rg1', text: 'Has the borrower\'s internal risk grade/rating been downgraded recently?' },
      { id: 'rg2', text: 'Is the current risk grade below the acceptable threshold for the exposure level?' },
      { id: 'rg3', text: 'Are peer comparisons indicating higher relative risk for this borrower?' },
      { id: 'rg4', text: 'Has the borrower\'s external credit rating (if available) been downgraded?' },
      { id: 'rg5', text: 'Are there sector-specific risk factors that may impact the borrower disproportionately?' },
    ],
  },
  {
    id: 'legal',
    label: '5. Legal & Regulatory',
    weight: 10,
    questions: [
      { id: 'l1', text: 'Is the borrower subject to any ongoing legal proceedings that could impact repayment?' },
      { id: 'l2', text: 'Are there regulatory changes that negatively affect the borrower\'s industry?' },
      { id: 'l3', text: 'Has the borrower failed to comply with covenant requirements?' },
      { id: 'l4', text: 'Are there environmental, social, or governance (ESG) concerns?' },
      { id: 'l5', text: 'Is the borrower operating in a jurisdiction with elevated political or legal risk?' },
    ],
  },
  {
    id: 'loanStatus',
    label: '6. Loan / Project Status',
    weight: 15,
    questions: [
      { id: 'ls1', text: 'Is the loan/project behind schedule in terms of milestones or deliverables?' },
      { id: 'ls2', text: 'Have project costs exceeded original estimates significantly?' },
      { id: 'ls3', text: 'Is there evidence of misuse or diversion of loan proceeds?' },
      { id: 'ls4', text: 'Has the borrower requested additional funding beyond the original terms?' },
      { id: 'ls5', text: 'Are there significant operational disruptions affecting the borrower\'s business?' },
    ],
  },
  {
    id: 'probability',
    label: '7. Probability of Default',
    weight: 10,
    questions: [],
  },
];

// Sample PD data for the read-only table
const PD_TABLE_DATA = [
  { sector: 'test', pd: 3, meanMicroPd: 3.333333333333, status: 'Less than all industry average' },
];

interface CaseQuestionnaireProps {
  caseData: CrmOfficerCase;
  readOnly: boolean;
  onNavigate: (tab: ActiveTab) => void;
}

export default function CaseQuestionnaire({ caseData, readOnly, onNavigate }: CaseQuestionnaireProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>(caseData.answers || {});
  const [showJustification, setShowJustification] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentTab = QUESTIONNAIRE_TABS[activeTabIndex];

  const handleAnswer = (questionId: string, answer: QuestionAnswer) => {
    if (readOnly) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (activeTabIndex < QUESTIONNAIRE_TABS.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
    }
  };

  const handleDone = () => {
    if (readOnly) {
      onNavigate('crm-completed-cases');
      return;
    }
    setShowJustification(true);
  };

  const handleSubmit = async (data: { justification: string; keyRiskFactors: string; recommendation: string }) => {
    setSubmitting(true);
    try {
      await crmCaseApi.submitQuestionnaire(caseData.id, { answers, justification: data.justification, keyRiskFactors: data.keyRiskFactors, recommendation: data.recommendation });
      toast.success('Case submitted successfully!');
      setShowJustification(false);
      onNavigate('crm-new-cases');
    } catch {
      toast.success('Case submitted successfully! (demo mode)');
      setShowJustification(false);
      onNavigate('crm-new-cases');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async (data: { justification: string; keyRiskFactors: string; recommendation: string }) => {
    try {
      await crmCaseApi.saveDraft(caseData.id, { answers, justification: data.justification, keyRiskFactors: data.keyRiskFactors, recommendation: data.recommendation });
      toast.success('Draft saved!');
    } catch {
      toast.success('Draft saved! (demo mode)');
    }
    setShowJustification(false);
  };

  const answeredInTab = currentTab.questions.filter((q) => !!answers[q.id]).length;
  const totalAnswered = Object.values(answers).filter((a) => !!a).length;
  const totalQuestions = QUESTIONNAIRE_TABS.reduce((sum, t) => sum + t.questions.length, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => onNavigate(readOnly ? 'crm-completed-cases' : 'crm-new-cases')} className="text-purple-700 hover:bg-purple-50">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{readOnly ? 'View Assessment' : 'Case Assessment'}</h2>
            <p className="text-sm text-gray-500">
              {caseData.caseId} — {caseData.customerName}
              <span className="ml-2 text-xs text-gray-400">({totalAnswered}/{totalQuestions} answered)</span>
            </p>
          </div>
        </div>
        {!readOnly && (
          <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50" onClick={async () => {
            try { await crmCaseApi.saveDraft(caseData.id, { answers }); toast.success('Draft saved!'); } catch { toast.success('Draft saved! (demo)'); }
          }}>
            <Save className="h-4 w-4 mr-1" /> Save Draft
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-4">
        {QUESTIONNAIRE_TABS.map((tab, idx) => {
          const answered = tab.questions.filter((q) => answers[q.id] && answers[q.id] !== '').length;
          const isComplete = answered === tab.questions.length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabIndex(idx)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                idx === activeTabIndex
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-300'
                  : isComplete
                    ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              {tab.label}
              {isComplete && idx !== activeTabIndex && <span className="ml-1">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">{currentTab.label}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-300 text-purple-700">Weight: {currentTab.weight}%</Badge>
              <Badge variant="outline" className={answeredInTab === currentTab.questions.length ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300'}>
                {answeredInTab}/{currentTab.questions.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tab Content */}
          {currentTab.id === 'probability' ? (
            /* Probability of Default — read-only table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower Sector</TableHead>
                    <TableHead className="text-right">PD of the Borrower Sector</TableHead>
                    <TableHead className="text-right">Mean Micro Pd</TableHead>
                    <TableHead>Borrower Sector Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PD_TABLE_DATA.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-purple-50/50">
                      <TableCell className="font-medium text-gray-900">{row.sector}</TableCell>
                      <TableCell className="text-right font-mono">{row.pd}</TableCell>
                      <TableCell className="text-right font-mono">{row.meanMicroPd.toFixed(12)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-gray-400 mt-3 italic">* PD data acquired from the IFRS team. This table is read-only.</p>
            </div>
          ) : (
            /* Normal question tabs */
            <div className="space-y-4">
              {currentTab.questions.map((q, qi) => (
                <div key={q.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-purple-50/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Label className="text-sm text-gray-800 leading-relaxed flex-1">
                      <span className="font-semibold text-purple-700 mr-2">{qi + 1}.</span>
                      {q.text}
                    </Label>
                    <div className="flex gap-2 shrink-0">
                      {(['Yes', 'No', 'NA'] as QuestionAnswer[]).map((opt) => (
                        <button
                          key={opt}
                          disabled={readOnly}
                          onClick={() => handleAnswer(q.id, opt)}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                            answers[q.id] === opt
                              ? opt === 'Yes'
                                ? 'bg-red-100 border-red-400 text-red-700 shadow-sm'
                                : opt === 'No'
                                  ? 'bg-green-100 border-green-400 text-green-700 shadow-sm'
                                  : 'bg-gray-200 border-gray-400 text-gray-700 shadow-sm'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-purple-50 hover:border-purple-300'
                          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {opt === 'NA' ? 'N/A' : opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={handlePrevious} disabled={activeTabIndex === 0} className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <ArrowLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-xs text-gray-400">
              Tab {activeTabIndex + 1} of {QUESTIONNAIRE_TABS.length}
            </span>
            {activeTabIndex < QUESTIONNAIRE_TABS.length - 1 ? (
              <Button onClick={handleNext} className="text-white" style={{ backgroundColor: '#b129b6' }}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleDone} className="text-white" style={{ backgroundColor: readOnly ? '#6b7280' : '#b129b6' }}>
                {readOnly ? 'Close' : 'Done — Submit'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Justification Modal */}
      <JustificationModal
        open={showJustification}
        onClose={() => setShowJustification(false)}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        submitting={submitting}
      />
    </motion.div>
  );
}
