import { AppState, FamilyStats } from '../types';

export const calculateFamilyStats = (state: AppState): FamilyStats => {
  const approvedSubmissions = state.submissions.filter((s) => s.status === 'approved');

  let totalReadingMinutes = 0;
  let totalWritingWords = 0;
  let totalTasksCompleted = approvedSubmissions.length;

  approvedSubmissions.forEach((sub) => {
    if (sub.category === 'reading') {
      // Hvis unitLabel er minutter
      totalReadingMinutes += sub.quantity;
    } else if (sub.category === 'writing') {
      // Hvis unitLabel er ord, eller estimer 150 ord per side
      if (sub.unitLabel === 'ord') {
        totalWritingWords += sub.quantity;
      } else if (sub.unitLabel === 'side' || sub.unitLabel === 'sider') {
        totalWritingWords += sub.quantity * 120;
      } else {
        totalWritingWords += sub.quantity;
      }
    }
  });

  // Ukestatistikk for de siste 7 dagene
  const days = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
  const now = new Date();
  const weeklyTrend = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const dayName = days[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];

    const daySubs = approvedSubmissions.filter((s) => {
      const subDate = (s.approvedAt || s.submittedAt).split('T')[0];
      return subDate === dateStr;
    });

    let readingMin = 0;
    let writingWords = 0;

    daySubs.forEach((s) => {
      if (s.category === 'reading') readingMin += s.quantity;
      if (s.category === 'writing') {
        writingWords += s.unitLabel === 'ord' ? s.quantity : s.quantity * 120;
      }
    });

    weeklyTrend.push({
      day: dayName,
      readingMinutes: readingMin,
      writingWords: writingWords,
      tasksCount: daySubs.length,
    });
  }

  return {
    totalReadingMinutes,
    totalWritingWords,
    totalTasksCompleted,
    weeklyTrend,
  };
};
