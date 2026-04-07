import { useState, useCallback, useMemo } from 'react';
import { GameState, GamePhase, Question, AskedQuestion } from '@/types/game';
import scenario1 from '@/data/scenario1';

const initialState: GameState = {
  phase: 'start',
  scenarioId: scenario1.id,
  askedQuestions: [],
  currentDialogue: null,
  selectedFramingId: null,
  score: 0,
  stars: 0,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const scenario = scenario1;

  const setPhase = useCallback((phase: GamePhase) => {
    setState((prev) => ({ ...prev, phase, currentDialogue: null }));
  }, []);

  const askQuestion = useCallback(
    (question: Question) => {
      setState((prev) => {
        if (prev.askedQuestions.length >= scenario.maxQuestions) return prev;
        if (prev.askedQuestions.some((aq) => aq.questionId === question.id)) return prev;

        const asked: AskedQuestion = { questionId: question.id, question };
        return {
          ...prev,
          askedQuestions: [...prev.askedQuestions, asked],
          currentDialogue: question.response,
        };
      });
    },
    [scenario.maxQuestions],
  );

  const isQuestionAsked = useCallback(
    (questionId: string) => state.askedQuestions.some((aq) => aq.questionId === questionId),
    [state.askedQuestions],
  );

  const remainingQuestions = scenario.maxQuestions - state.askedQuestions.length;

  const canAskMore = remainingQuestions > 0;

  const goToFraming = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'framing', currentDialogue: null }));
  }, []);

  const selectFraming = useCallback(
    (framingId: string) => {
      const criticalAsked = state.askedQuestions.filter((aq) =>
        scenario.criticalQuestionIds.includes(aq.questionId),
      ).length;

      const chosen = scenario.framingOptions.find((f) => f.id === framingId);
      let stars = 0;
      if (chosen?.isCorrect) {
        if (criticalAsked >= 5) stars = 3;
        else if (criticalAsked >= 3) stars = 2;
        else stars = 1;
      }

      setState((prev) => ({
        ...prev,
        phase: 'result',
        selectedFramingId: framingId,
        stars,
        score: criticalAsked,
      }));
    },
    [state.askedQuestions, scenario],
  );

  const restart = useCallback(() => {
    setState(initialState);
  }, []);

  const discoveries = useMemo(
    () => state.askedQuestions.map((aq) => aq.question.discoveryText),
    [state.askedQuestions],
  );

  return {
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
  };
}
