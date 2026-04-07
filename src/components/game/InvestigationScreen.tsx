import { Scenario, Question } from '@/types/game';
import { AskedQuestion } from '@/types/game';
import DialogueBox from './DialogueBox';
import QuestionPanel from './QuestionPanel';
import QuestionCounter from './QuestionCounter';
import DiscoveryBoard from './DiscoveryBoard';
import { motion } from 'framer-motion';

interface InvestigationScreenProps {
  scenario: Scenario;
  currentDialogue: string | null;
  askedQuestions: AskedQuestion[];
  remainingQuestions: number;
  canAskMore: boolean;
  discoveries: string[];
  onAsk: (question: Question) => void;
  isQuestionAsked: (id: string) => boolean;
  onFinish: () => void;
}

const InvestigationScreen = ({
  scenario,
  currentDialogue,
  askedQuestions,
  remainingQuestions,
  canAskMore,
  discoveries,
  onAsk,
  isQuestionAsked,
  onFinish,
}: InvestigationScreenProps) => {
  const dialogueText = currentDialogue || scenario.initialComplaint;
  const hasAskedAny = askedQuestions.length > 0;

  return (
    <div className="min-h-screen py-6 px-4 md:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">جلسة التحليل</h2>
            <p className="text-sm text-muted-foreground">
              اسأل {scenario.clientName} عشان تفهم المشكلة الحقيقية
            </p>
          </div>
          <QuestionCounter remaining={remainingQuestions} total={scenario.maxQuestions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Right side: Dialogue + Discoveries */}
          <div className="lg:col-span-2 space-y-4">
            <DialogueBox clientName={scenario.clientName} text={dialogueText} />
            <DiscoveryBoard discoveries={discoveries} />

            {/* Finish button */}
            {hasAskedAny && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onFinish}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90"
              >
                {canAskMore ? 'خلصت أسئلتي - ورّيني التأطيرات' : 'الأسئلة خلصت - ورّيني التأطيرات'}
              </motion.button>
            )}
          </div>

          {/* Left side: Questions */}
          <div className="lg:col-span-3">
            <QuestionPanel
              categories={scenario.categories}
              onAsk={onAsk}
              isQuestionAsked={isQuestionAsked}
              canAskMore={canAskMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationScreen;
