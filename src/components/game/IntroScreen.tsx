import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  narrativeSteps: string[];
  onComplete: () => void;
}

const IntroScreen = ({ narrativeSteps, onComplete }: IntroScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < narrativeSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const isLast = currentStep === narrativeSteps.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="max-w-2xl w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-12">
          {narrativeSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep
                  ? 'w-8 bg-primary'
                  : i < currentStep
                    ? 'w-4 bg-primary/40'
                    : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Narrative text */}
        <div className="min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl text-foreground text-center leading-relaxed font-medium"
            >
              {narrativeSteps[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <motion.div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-base font-semibold transition-all hover:opacity-90"
          >
            {isLast ? 'ابدأ التحليل' : 'كمّل'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroScreen;
