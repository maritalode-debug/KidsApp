export type RewardType = 'screen_time' | 'money' | 'choice';

export type TaskCategory = 'reading' | 'writing' | 'chore' | 'custom';

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // Emoji eller avatar-id
  color: string; // F.eks. 'from-pink-500 to-rose-500'
  screenTimeMinutes: number; // Nåværende saldo
  moneyBalance: number; // Nåværende saldo i NOK
  createdAt: string;
}

export interface TaskDefinition {
  id: string;
  title: string;
  category: TaskCategory;
  description?: string;
  rewardType: RewardType;
  screenTimeReward: number; // Minutter per enhet
  moneyReward: number; // NOK per enhet
  unit: string; // F.eks. 'per 15 min', 'per 100 ord', 'per oppgave', 'per side'
  unitRate: number; // Hvor mange minutter/ord/sider per belønning (f.eks. 15 for 15 min, 50 for 50 ord, 1 for 1 oppgave)
  icon: string; // Ikonnavn (f.eks. 'BookOpen', 'Pencil', 'Sparkles', 'Trash2', etc.)
  isDefault?: boolean;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  childId: string;
  taskId?: string;
  category: TaskCategory;
  title: string;
  details?: string; // F.eks. boktittel, tekst som ble skrevet, eller notat
  quantity: number; // Antall minutter, sider, ord eller oppgaver
  unitLabel: string;
  chosenRewardType: 'screen_time' | 'money';
  calculatedReward: number; // Beregnet minutter eller kroner
  status: SubmissionStatus;
  submittedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface Transaction {
  id: string;
  childId: string;
  type: 'earn' | 'withdraw' | 'adjustment';
  rewardType: 'screen_time' | 'money';
  amount: number;
  description: string;
  timestamp: string;
  submissionId?: string;
}

export interface FamilyStats {
  totalReadingMinutes: number;
  totalWritingWords: number;
  totalTasksCompleted: number;
  weeklyTrend: {
    day: string;
    readingMinutes: number;
    writingWords: number;
    tasksCount: number;
  }[];
}

export interface AppState {
  children: ChildProfile[];
  tasks: TaskDefinition[];
  submissions: TaskSubmission[];
  transactions: Transaction[];
  parentPin: string; // Standard PIN '1234'
}
