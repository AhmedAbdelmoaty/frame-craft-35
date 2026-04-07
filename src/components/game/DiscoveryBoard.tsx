import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryBoardProps {
  discoveries: string[];
}

const DiscoveryBoard = ({ discoveries }: DiscoveryBoardProps) => {
  if (discoveries.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5" dir="rtl">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
        <span>📝</span>
        <span>ملاحظاتك</span>
      </h3>
      <ul className="space-y-2">
        <AnimatePresence>
          {discoveries.map((d, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-foreground/80 leading-relaxed pr-3 border-r-2 border-primary/40"
            >
              {d}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default DiscoveryBoard;
