import { motion } from 'framer-motion';
import { Scenario, AskedQuestion } from '@/types/game';

interface ResultScreenProps {
  scenario: Scenario;
  stars: number;
  selectedFramingId: string;
  askedQuestions: AskedQuestion[];
  onRestart: () => void;
}

const ResultScreen = ({
  scenario,
  stars,
  selectedFramingId,
  askedQuestions,
  onRestart,
}: ResultScreenProps) => {
  const chosen = scenario.framingOptions.find((f) => f.id === selectedFramingId);
  const correct = scenario.framingOptions.find((f) => f.isCorrect);
  const isCorrect = chosen?.isCorrect ?? false;

  const criticalAsked = askedQuestions.filter((aq) =>
    scenario.criticalQuestionIds.includes(aq.questionId),
  );

  const criticalMissed = scenario.criticalQuestionIds.filter(
    (id) => !askedQuestions.some((aq) => aq.questionId === id),
  );

  // Find the question text for missed critical questions
  const allQuestions = scenario.categories.flatMap((c) => c.questions);
  const missedQuestions = criticalMissed
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" dir="rtl">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Stars */}
          <div className="text-5xl mb-4 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: s * 0.2, duration: 0.4 }}
              >
                {s <= stars ? '⭐' : '☆'}
              </motion.span>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {isCorrect
              ? stars === 3
                ? 'تحليل ممتاز!'
                : stars === 2
                  ? 'تحليل كويس!'
                  : 'وصلت للإجابة الصح!'
              : 'التأطير محتاج مراجعة'}
          </h2>
        </motion.div>

        {/* Chosen framing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`p-5 rounded-xl border-2 mb-4 ${
            isCorrect ? 'border-green-500/50 bg-green-500/5' : 'border-destructive/50 bg-destructive/5'
          }`}
        >
          <p className="text-sm text-muted-foreground mb-1">اختيارك:</p>
          <p className="text-foreground font-medium leading-relaxed">{chosen?.text}</p>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{chosen?.feedbackShort}</p>
        </motion.div>

        {/* Correct framing (if wrong) */}
        {!isCorrect && correct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="p-5 rounded-xl border-2 border-primary/30 bg-primary/5 mb-4"
          >
            <p className="text-sm text-muted-foreground mb-1">التأطير الصح:</p>
            <p className="text-foreground font-medium leading-relaxed">{correct.text}</p>
          </motion.div>
        )}

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="p-5 rounded-xl bg-card border border-border mb-4"
        >
          <h3 className="font-bold text-foreground mb-2">الصورة الكاملة</h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {scenario.correctFramingExplanation}
          </p>
        </motion.div>

        {/* Critical questions review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="p-5 rounded-xl bg-card border border-border mb-4"
        >
          <h3 className="font-bold text-foreground mb-3">
            الأسئلة المحورية ({criticalAsked.length}/{scenario.criticalQuestionIds.length})
          </h3>

          {criticalAsked.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">✓ أسئلة محورية سألتها:</p>
              <ul className="space-y-1">
                {criticalAsked.map((aq) => (
                  <li key={aq.questionId} className="text-sm text-foreground/70 pr-3 border-r-2 border-primary/40">
                    {aq.question.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {missedQuestions.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">✗ أسئلة محورية فاتتك:</p>
              <ul className="space-y-1">
                {missedQuestions.map((q) => (
                  <li key={q!.id} className="text-sm text-foreground/50 pr-3 border-r-2 border-destructive/30">
                    {q!.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Lesson */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8 text-center"
        >
          <p className="text-foreground/80 text-sm font-medium leading-relaxed">
            💡 {scenario.lessonSummary}
          </p>
        </motion.div>

        {/* Restart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-center"
        >
          <button
            onClick={onRestart}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          >
            العب تاني
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultScreen;
