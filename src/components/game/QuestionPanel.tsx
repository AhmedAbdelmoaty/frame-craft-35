import { motion } from 'framer-motion';
import { QuestionCategory, Question } from '@/types/game';
import { useState } from 'react';

interface QuestionPanelProps {
  categories: QuestionCategory[];
  onAsk: (question: Question) => void;
  isQuestionAsked: (id: string) => boolean;
  canAskMore: boolean;
}

const QuestionPanel = ({ categories, onAsk, isQuestionAsked, canAskMore }: QuestionPanelProps) => {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  return (
    <div className="space-y-2" dir="rtl">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">اختر سؤال:</h3>
      {categories.map((cat) => {
        const isOpen = openCategoryId === cat.id;
        const allAsked = cat.questions.every((q) => isQuestionAsked(q.id));

        return (
          <div key={cat.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenCategoryId(isOpen ? null : cat.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-right transition-colors ${
                allAsked
                  ? 'bg-muted/50 text-muted-foreground'
                  : 'bg-card hover:bg-accent text-foreground'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {cat.questions.filter((q) => isQuestionAsked(q.id)).length}/{cat.questions.length}
              </span>
            </button>

            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border"
              >
                {cat.questions.map((q) => {
                  const asked = isQuestionAsked(q.id);
                  return (
                    <button
                      key={q.id}
                      disabled={asked || !canAskMore}
                      onClick={() => onAsk(q)}
                      className={`w-full text-right px-5 py-3 text-sm border-b border-border last:border-b-0 transition-colors ${
                        asked
                          ? 'bg-muted/30 text-muted-foreground cursor-default'
                          : !canAskMore
                            ? 'text-muted-foreground cursor-not-allowed'
                            : 'hover:bg-accent text-foreground cursor-pointer'
                      }`}
                    >
                      <span className="leading-relaxed">{q.text}</span>
                      {asked && (
                        <span className="block text-xs text-muted-foreground mt-1">✓ تم السؤال</span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionPanel;
