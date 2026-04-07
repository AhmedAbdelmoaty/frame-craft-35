import { useGameState } from '@/hooks/useGameState';
import StartScreen from './StartScreen';
import IntroScreen from './IntroScreen';
import InvestigationScreen from './InvestigationScreen';
import FramingScreen from './FramingScreen';
import ResultScreen from './ResultScreen';
import { AnimatePresence, motion } from 'framer-motion';

const GameContainer = () => {
  const {
    state,
    scenario,
    setPhase,
    askQuestion,
    isQuestionAsked,
    remainingQuestions,
    canAskMore,
    goToFraming,
    selectFraming,
    restart,
    discoveries,
  } = useGameState();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {state.phase === 'start' && (
          <motion.div key="start" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <StartScreen onStart={() => setPhase('intro')} />
          </motion.div>
        )}

        {state.phase === 'intro' && (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <IntroScreen
              narrativeSteps={scenario.introNarrative}
              onComplete={() => setPhase('investigation')}
            />
          </motion.div>
        )}

        {state.phase === 'investigation' && (
          <motion.div key="investigation" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <InvestigationScreen
              scenario={scenario}
              currentDialogue={state.currentDialogue}
              askedQuestions={state.askedQuestions}
              remainingQuestions={remainingQuestions}
              canAskMore={canAskMore}
              discoveries={discoveries}
              onAsk={askQuestion}
              isQuestionAsked={isQuestionAsked}
              onFinish={goToFraming}
            />
          </motion.div>
        )}

        {state.phase === 'framing' && (
          <motion.div key="framing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <FramingScreen options={scenario.framingOptions} onSelect={selectFraming} />
          </motion.div>
        )}

        {state.phase === 'result' && (
          <motion.div key="result" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ResultScreen
              scenario={scenario}
              stars={state.stars}
              selectedFramingId={state.selectedFramingId!}
              askedQuestions={state.askedQuestions}
              onRestart={restart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameContainer;
