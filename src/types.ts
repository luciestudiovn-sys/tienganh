export type SkillLevel = 'Beginner' | 'Elementary' | 'Intermediate';

export interface VocabularyItem {
  id: string;
  unitId: number;
  word: string;
  phonetic: string; // e.g. /bæg/
  letter: string; // e.g. 'B'
  vietnamese: string;
  exampleEn: string;
  exampleVi: string;
  imageUrl?: string;
  emoji: string;
  audioText: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  unitId: number;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-scramble' | 'listening';
  questionText: string;
  audioPrompt?: string;
  options?: string[];
  correctAnswer: string;
  sentenceWords?: string[]; // for scramble
  explanationVi: string;
  imageUrl?: string;
  emoji?: string;
}

export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export interface UnitData {
  id: number;
  gradeLevel?: GradeLevel;
  titleEn: string;
  titleVi: string;
  letterFocus: string;
  description: string;
  themeColor: string;
  iconEmoji: string;
  vocabularies: VocabularyItem[];
  quizzes: QuizQuestion[];
  isReviewUnit?: boolean;
}

export interface UserProgress {
  selectedGrade: GradeLevel;
  studentName: string;
  studentAvatar: string;
  xp: number;
  streakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  completedUnits: number[]; // unit IDs
  unitStars: Record<number, number>; // unitId -> 1..3
  masteredWordIds: string[];
  hardWordIds: string[];
  pronunciationScores: Record<string, number>; // wordId -> score 0..100
  dailyGoalMinutes: number;
  todayMinutesSpent: number;
  badges: string[]; // badge IDs unlocked
}

export interface EvaluationReport {
  unitId: number;
  unitTitleEn: string;
  unitTitleVi: string;
  studentName: string;
  studentAvatar: string;
  flashcardTimeSeconds: number;
  quizTimeSeconds: number;
  totalTimeSeconds: number;
  correctAnswers: number;
  totalQuestions: number;
  scorePercentage: number;
  stars: number;
  aiFeedback: string;
}

export interface BadgeInfo {
  id: string;
  titleVi: string;
  descriptionVi: string;
  iconEmoji: string;
  unlocked: boolean;
  requiredMetric: string;
}

export interface PronunciationResult {
  score: number; // 0..100
  stars: number; // 1..3
  phonemeFeedback: string;
  encouragementVi: string;
  recognizedText: string;
}

export interface PlacementQuestion {
  id: number;
  questionText: string;
  audioText?: string;
  options: { label: string; imageEmoji: string; isCorrect: boolean }[];
  level: SkillLevel;
}

export interface SRSItem {
  wordId: string;
  intervalDays: number;
  nextReviewDate: string; // ISO date
  easeFactor: number;
  repetitions: number;
}
