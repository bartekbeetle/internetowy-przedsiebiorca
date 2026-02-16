// ==========================================
// LEVEL SYSTEM
// ==========================================

export const LEVEL_THRESHOLDS = [
  0,    // level 0 (unused)
  0,    // level 1 - Obserwator
  50,   // level 2 - Poczatkujacy
  150,  // level 3 - Aktywny
  350,  // level 4 - Regularny
  600,  // level 5 - Zaangazowany
  1000, // level 6 - Ekspert
  1600, // level 7 - Mentor
  2500, // level 8 - Lider
  4000, // level 9 - Mistrz
  6000, // level 10 - Legenda
];

export const LEVEL_DATA = [
  { level: 1, name: "Obserwator", minPoints: 0, maxPoints: 49, color: "#94A3B8", icon: "👀" },
  { level: 2, name: "Poczatkujacy", minPoints: 50, maxPoints: 149, color: "#22C55E", icon: "🌱" },
  { level: 3, name: "Aktywny", minPoints: 150, maxPoints: 349, color: "#3B82F6", icon: "⚡" },
  { level: 4, name: "Regularny", minPoints: 350, maxPoints: 599, color: "#8B5CF6", icon: "🔥" },
  { level: 5, name: "Zaangazowany", minPoints: 600, maxPoints: 999, color: "#F59E0B", icon: "💪" },
  { level: 6, name: "Ekspert", minPoints: 1000, maxPoints: 1599, color: "#EF4444", icon: "🎯" },
  { level: 7, name: "Mentor", minPoints: 1600, maxPoints: 2499, color: "#EC4899", icon: "🧠" },
  { level: 8, name: "Lider", minPoints: 2500, maxPoints: 3999, color: "#F97316", icon: "👑" },
  { level: 9, name: "Mistrz", minPoints: 4000, maxPoints: 5999, color: "#14B8A6", icon: "🏆" },
  { level: 10, name: "Legenda", minPoints: 6000, maxPoints: Infinity, color: "#FFD700", icon: "⭐" },
];

export function getLevelInfo(level: number) {
  return LEVEL_DATA[Math.min(Math.max(level - 1, 0), LEVEL_DATA.length - 1)];
}

export function calculateLevel(points: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  return level;
}

// ==========================================
// BADGE CATEGORIES
// ==========================================

export const BADGE_CATEGORIES = {
  COMMUNITY: { label: "Spolecznosc", color: "#3B82F6", icon: "👥" },
  CONTENT: { label: "Tresci", color: "#22C55E", icon: "📝" },
  LEARNING: { label: "Nauka", color: "#8B5CF6", icon: "📚" },
  SPECIAL: { label: "Specjalne", color: "#F59E0B", icon: "🌟" },
  SECRET: { label: "Sekretne", color: "#EF4444", icon: "🔮" },
} as const;

// ==========================================
// BADGE DEFINITIONS (28 badges)
// ==========================================

export const BADGE_DEFINITIONS = [
  // COMMUNITY (7)
  { name: "first_comment", displayName: "Pierwszy Komentarz", description: "Napisz swoj pierwszy komentarz", category: "COMMUNITY", icon: "💬", requirement: { type: "comment_count", threshold: 1 }, points: 5 },
  { name: "commentator", displayName: "Komentator", description: "Napisz 10 komentarzy", category: "COMMUNITY", icon: "🗣️", requirement: { type: "comment_count", threshold: 10 }, points: 10 },
  { name: "discussion_master", displayName: "Mistrz Dyskusji", description: "Napisz 50 komentarzy", category: "COMMUNITY", icon: "🎤", requirement: { type: "comment_count", threshold: 50 }, points: 25 },
  { name: "helpful", displayName: "Pomocny", description: "Polub 10 postow innych", category: "COMMUNITY", icon: "👍", requirement: { type: "like_given", threshold: 10 }, points: 5 },
  { name: "supporter", displayName: "Wspierajacy", description: "Polub 50 postow innych", category: "COMMUNITY", icon: "🤝", requirement: { type: "like_given", threshold: 50 }, points: 15 },
  { name: "streak_3", displayName: "Regularnosc", description: "Utrzymaj streak 3 dni", category: "COMMUNITY", icon: "🔥", requirement: { type: "streak_days", threshold: 3 }, points: 10 },
  { name: "streak_7", displayName: "Tygodniowy Wojownik", description: "Utrzymaj streak 7 dni", category: "COMMUNITY", icon: "⚡", requirement: { type: "streak_days", threshold: 7 }, points: 25 },

  // CONTENT (7)
  { name: "first_post", displayName: "Pierwszy Post", description: "Opublikuj swoj pierwszy post", category: "CONTENT", icon: "✏️", requirement: { type: "post_count", threshold: 1 }, points: 5 },
  { name: "author", displayName: "Autor", description: "Opublikuj 5 postow", category: "CONTENT", icon: "📝", requirement: { type: "post_count", threshold: 5 }, points: 15 },
  { name: "prolific_writer", displayName: "Plodny Pisarz", description: "Opublikuj 20 postow", category: "CONTENT", icon: "📚", requirement: { type: "post_count", threshold: 20 }, points: 30 },
  { name: "popular_post", displayName: "Popularny Post", description: "Otrzymaj 10 polubien na jednym poscie", category: "CONTENT", icon: "❤️", requirement: { type: "post_likes", threshold: 10 }, points: 15 },
  { name: "viral_post", displayName: "Viralowy Post", description: "Otrzymaj 50 polubien na jednym poscie", category: "CONTENT", icon: "🚀", requirement: { type: "post_likes", threshold: 50 }, points: 50 },
  { name: "liked_10", displayName: "Doceniany", description: "Otrzymaj lacznie 10 polubien", category: "CONTENT", icon: "💖", requirement: { type: "total_likes_received", threshold: 10 }, points: 10 },
  { name: "liked_100", displayName: "Uwielbiany", description: "Otrzymaj lacznie 100 polubien", category: "CONTENT", icon: "🌟", requirement: { type: "total_likes_received", threshold: 100 }, points: 50 },

  // LEARNING (7)
  { name: "student", displayName: "Uczen", description: "Zapisz sie na pierwszy kurs", category: "LEARNING", icon: "🎒", requirement: { type: "course_enrolled", threshold: 1 }, points: 5 },
  { name: "first_lesson", displayName: "Pierwsza Lekcja", description: "Ukoncz pierwsza lekcje", category: "LEARNING", icon: "📖", requirement: { type: "lesson_completed", threshold: 1 }, points: 5 },
  { name: "diligent", displayName: "Pilny Uczen", description: "Ukoncz 10 lekcji", category: "LEARNING", icon: "📗", requirement: { type: "lesson_completed", threshold: 10 }, points: 20 },
  { name: "scholar", displayName: "Naukowiec", description: "Ukoncz 25 lekcji", category: "LEARNING", icon: "🎓", requirement: { type: "lesson_completed", threshold: 25 }, points: 40 },
  { name: "graduate", displayName: "Absolwent", description: "Ukoncz pierwszy kurs", category: "LEARNING", icon: "🏅", requirement: { type: "course_completed", threshold: 1 }, points: 25 },
  { name: "multi_graduate", displayName: "Multi-Absolwent", description: "Ukoncz 3 kursy", category: "LEARNING", icon: "🏆", requirement: { type: "course_completed", threshold: 3 }, points: 75 },
  { name: "reel_collector", displayName: "Kolekcjoner Reelsow", description: "Zapisz 10 inspiracji", category: "LEARNING", icon: "🎬", requirement: { type: "reel_saved", threshold: 10 }, points: 10 },

  // SPECIAL (4)
  { name: "early_adopter", displayName: "Early Adopter", description: "Dolacz w pierwszym miesiacu platformy", category: "SPECIAL", icon: "🚀", requirement: { type: "early_adopter", threshold: 1 }, points: 20 },
  { name: "level_5", displayName: "Poziom 5", description: "Osiagnij poziom 5", category: "SPECIAL", icon: "⭐", requirement: { type: "level_reached", threshold: 5 }, points: 15 },
  { name: "level_10", displayName: "Poziom 10", description: "Osiagnij poziom 10 - Legenda!", category: "SPECIAL", icon: "👑", requirement: { type: "level_reached", threshold: 10 }, points: 100 },
  { name: "streak_30", displayName: "Miesieczny Streak", description: "Utrzymaj streak 30 dni", category: "SPECIAL", icon: "💎", requirement: { type: "streak_days", threshold: 30 }, points: 100 },

  // SECRET (3)
  { name: "night_owl", displayName: "Nocny Marek", description: "Opublikuj post miedzy 00:00 a 05:00", category: "SECRET", icon: "🦉", requirement: { type: "night_post", threshold: 1 }, points: 10, isSecret: true },
  { name: "centurion", displayName: "Centurion", description: "Zdobadz 1000 punktow", category: "SECRET", icon: "🏛️", requirement: { type: "points_reached", threshold: 1000 }, points: 25, isSecret: true },
  { name: "completionist", displayName: "Kompletycista", description: "Zdobadz 20 odznak", category: "SECRET", icon: "🎪", requirement: { type: "badges_earned", threshold: 20 }, points: 50, isSecret: true },
] as const;
