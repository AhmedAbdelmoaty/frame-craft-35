export type QuestionValue = 'critical' | 'useful' | 'marginal' | 'misleading';

export type GamePhase = 'start' | 'intro' | 'investigation' | 'framing' | 'result';

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  response: string;
  value: QuestionValue;
  discoveryText: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  questions: Question[];
}

export interface FramingOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedbackShort: string;
}

export interface Scenario {
  id: string;
  title: string;
  clientName: string;
  clientRole: string;
  introNarrative: string[];
  initialComplaint: string;
  categories: QuestionCategory[];
  framingOptions: FramingOption[];
  maxQuestions: number;
  correctFramingExplanation: string;
  lessonSummary: string;
  criticalQuestionIds: string[];
}

export interface AskedQuestion {
  questionId: string;
  question: Question;
}

export interface GameState {
  phase: GamePhase;
  scenarioId: string;
  askedQuestions: AskedQuestion[];
  currentDialogue: string | null;
  selectedFramingId: string | null;
  score: number;
  stars: number;
}
