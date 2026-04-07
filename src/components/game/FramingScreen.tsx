import { useState } from 'react';
import { motion } from 'framer-motion';
import { FramingOption } from '@/types/game';

interface FramingScreenProps {
  options: FramingOption[];
  onSelect: (id: string) => void;
}

const FramingScreen = ({ options, onSelect }: FramingScreenProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) onSelect(selectedId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" dir="rtl">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
            إيه تأطيرك للمشكلة؟
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            بناءً على اللي عرفته من أبو خالد... إيه المشكلة الحقيقية؟
          </p>
        </motion.div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              onClick={() => setSelectedId(opt.id)}
              className={`w-full text-right p-5 rounded-xl border-2 transition-all ${
                selectedId === opt.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <p className="text-foreground leading-relaxed">{opt.text}</p>
            </motion.button>
          ))}
        </div>

        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground px-10 py-3 rounded-lg text-base font-semibold transition-all hover:opacity-90"
            >
              تأكيد اختياري
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FramingScreen;
