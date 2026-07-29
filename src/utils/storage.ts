import { UserProgress } from '../types';

const STORAGE_KEY = 'tieng_anh_2_global_success_user_progress';

export const getDefaultProgress = (): UserProgress => {
  const todayStr = new Date().toISOString().split('T')[0];
  return {
    selectedGrade: 2,
    studentName: 'Bé Bún',
    studentAvatar: '🐱',
    xp: 120,
    streakDays: 1,
    lastStudyDate: todayStr,
    completedUnits: [],
    unitStars: { 1: 3 }, // default unit 1 unlocked with 3 stars
    masteredWordIds: ['u1-1', 'u1-2'],
    hardWordIds: ['u1-3'],
    pronunciationScores: { 'u1-1': 92, 'u1-2': 98 },
    dailyGoalMinutes: 15,
    todayMinutesSpent: 8,
    badges: ['badge-first-step'],
  };
};

export const loadUserProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultProgress();
      saveUserProgress(initial);
      return initial;
    }

    const parsed: UserProgress = JSON.parse(raw);
    if (!parsed.selectedGrade) parsed.selectedGrade = 2;
    if (!parsed.studentName) parsed.studentName = 'Bé Bún';
    if (!parsed.studentAvatar) parsed.studentAvatar = '🐱';
    const todayStr = new Date().toISOString().split('T')[0];

    // Check streak logic
    if (parsed.lastStudyDate) {
      const lastDate = new Date(parsed.lastStudyDate);
      const todayDate = new Date(todayStr);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // consecutive day!
      } else if (diffDays > 1) {
        // streak broken
        parsed.streakDays = 1;
      }

      if (parsed.lastStudyDate !== todayStr) {
        parsed.todayMinutesSpent = 0; // reset daily timer
        parsed.lastStudyDate = todayStr;
      }
    }

    return parsed;
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return getDefaultProgress();
  }
};

export const saveUserProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
};
