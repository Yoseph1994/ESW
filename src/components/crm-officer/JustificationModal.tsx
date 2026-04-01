import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface JustificationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { justification: string; keyRiskFactors: string; recommendation: string }) => void;
  onSaveDraft: (data: { justification: string; keyRiskFactors: string; recommendation: string }) => void;
  submitting?: boolean;
}

export default function JustificationModal({ open, onClose, onSubmit, onSaveDraft, submitting = false }: JustificationModalProps) {
  const [justification, setJustification] = useState('');
  const [keyRiskFactors, setKeyRiskFactors] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const handleSubmit = () => {
    if (!justification.trim()) { toast.error('Overall Justification is required'); return; }
    if (!recommendation) { toast.error('Please select a recommendation'); return; }
    onSubmit({ justification, keyRiskFactors, recommendation });
  };

  const handleDraft = () => { onSaveDraft({ justification, keyRiskFactors, recommendation }); };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900">Justification & Submission</DialogTitle>
          <DialogDescription>Provide your overall justification and recommendation before submitting.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-sm font-medium text-gray-700">Overall Justification <span className="text-red-500">*</span></Label>
            <Textarea id="justification" placeholder="Enter your overall justification..." value={justification} onChange={(e) => setJustification(e.target.value)} rows={4} className="border-purple-200 focus:border-purple-400 focus:ring-purple-400" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk-factors" className="text-sm font-medium text-gray-700">Key Risk Factors</Label>
            <Textarea id="risk-factors" placeholder="Describe key risk factors..." value={keyRiskFactors} onChange={(e) => setKeyRiskFactors(e.target.value)} rows={3} className="border-purple-200 focus:border-purple-400 focus:ring-purple-400" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recommendation" className="text-sm font-medium text-gray-700">Recommendation <span className="text-red-500">*</span></Label>
            <Select value={recommendation} onValueChange={setRecommendation}>
              <SelectTrigger id="recommendation" className="border-purple-200"><SelectValue placeholder="Select recommendation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Submit to Monitoring Officer">Submit to Monitoring Officer</SelectItem>
                <SelectItem value="Request More Info">Request More Info</SelectItem>
                <SelectItem value="Escalate to Management">Escalate to Management</SelectItem>
                <SelectItem value="Close Case">Close Case</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleDraft} disabled={submitting} className="border-purple-300 text-purple-700 hover:bg-purple-50">Save as Draft</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="text-white" style={{ backgroundColor: '#b129b6' }}>{submitting ? 'Submitting...' : 'Submit to Monitoring Officer'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
