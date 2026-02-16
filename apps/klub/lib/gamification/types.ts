export interface LevelInfo {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
}

export interface BadgeWithStatus {
  id: string;
  name: string;
  displayName: string;
  description: string;
  iconUrl: string;
  category: string;
  points: number;
  isSecret: boolean;
  earned: boolean;
  earnedAt?: string;
  progress?: number; // 0-100 percentage
}

export interface ChallengeWithProgress {
  id: string;
  title: string;
  description: string;
  type: string;
  reward: number;
  startDate: string;
  endDate: string;
  requirement: {
    type: string;
    target: number;
    metadata?: Record<string, string>;
  };
  badgeName?: string;
  participation?: {
    progress: number;
    completed: boolean;
    completedAt?: string;
    joinedAt: string;
  } | null;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  points: number;
  level: number;
  streak: number;
  isCurrentUser: boolean;
}

export interface GamificationStats {
  points: number;
  level: number;
  levelName: string;
  levelColor: string;
  levelIcon: string;
  nextLevelPoints: number;
  progressToNextLevel: number; // 0-100
  streak: number;
  longestStreak: number;
  badgesEarned: number;
  totalBadges: number;
  rank: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  completedCourses: number;
}
