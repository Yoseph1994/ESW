import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Layers, Target, CreditCard,
  Package, GitBranch, ArrowLeft, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { OptionTab } from '@/types';
import SectorManager from './SectorManager';
import SubSectorManager from './SubSectorManager';
import BroadSegmentManager from './BroadSegmentManager';
import CreditProductLineManager from './CreditProductLineManager';
import ProductGroupManager from './ProductGroupManager';
import SubProductLineManager from './SubProductLineManager';

interface OptionsContentProps {
  activeSubTab: OptionTab | null;
  onSubTabChange: (tab: OptionTab | null) => void;
}

const OPTION_CARDS: { id: OptionTab; label: string; icon: typeof Building2; description: string }[] = [
  { id: 'sectors', label: 'Sectors', icon: Building2, description: 'Manage economic sectors and macro PD values' },
  { id: 'subSectors', label: 'Sub Sectors', icon: Layers, description: 'Manage sub sectors linked to sectors' },
  { id: 'broadSegments', label: 'Broad Segments', icon: Target, description: 'Manage broad segment categories' },
  { id: 'creditProductLines', label: 'Credit Product Lines', icon: CreditCard, description: 'Manage credit product lines' },
  { id: 'productGroups', label: 'Product Groups', icon: Package, description: 'Manage product group classifications' },
  { id: 'subProductLines', label: 'Sub Product Lines', icon: GitBranch, description: 'Manage sub product line details' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function ManagerRenderer({ tab }: { tab: OptionTab }) {
  switch (tab) {
    case 'sectors': return <SectorManager />;
    case 'subSectors': return <SubSectorManager />;
    case 'broadSegments': return <BroadSegmentManager />;
    case 'creditProductLines': return <CreditProductLineManager />;
    case 'productGroups': return <ProductGroupManager />;
    case 'subProductLines': return <SubProductLineManager />;
  }
}

export default function OptionsContent({ activeSubTab, onSubTabChange }: OptionsContentProps) {
  if (activeSubTab) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Button
            variant="ghost"
            onClick={() => onSubTabChange(null)}
            className="mb-4 text-purple-600 hover:text-purple-500 hover:bg-purple-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Button>
          <ManagerRenderer tab={activeSubTab} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div>
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Options
          </CardTitle>
        </CardHeader>
      </Card>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {OPTION_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.id} variants={itemVariants}>
              <Card
                className="glass-card glass-card-hover cursor-pointer group transition-all duration-300 hover:scale-[1.03] overflow-hidden"
                onClick={() => onSubTabChange(card.id)}
              >
                {/* Gradient top border like CBE services cards */}
                <div className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500" />
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center mb-4 group-hover:from-purple-200 group-hover:to-fuchsia-200 transition-all">
                    <Icon className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {card.label}
                  </h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
