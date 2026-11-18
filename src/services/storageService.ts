import { AppState, ChildProfile, TaskDefinition, TaskSubmission, Transaction } from '../types';

const STORAGE_KEY = 'kids_app_family_state_v1';

export const DEFAULT_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1',
    name: 'Emma',
    avatar: '🦄',
    color: 'from-fuchsia-500 to-pink-500',
    screenTimeMinutes: 45,
    moneyBalance: 60,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'child-2',
    name: 'Lucas',
    avatar: '🚀',
    color: 'from-blue-500 to-cyan-500',
    screenTimeMinutes: 30,
    moneyBalance: 120,
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'child-3',
    name: 'Sofia',
    avatar: '🦁',
    color: 'from-amber-500 to-orange-500',
    screenTimeMinutes: 15,
    moneyBalance: 25,
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  },
];

export const DEFAULT_TASKS: TaskDefinition[] = [
  {
    id: 'task-reading-time',
    title: 'Egenlesing (bok eller tegneserie)',
    category: 'reading',
    description: 'Les i favorittboken din i ro og fred.',
    rewardType: 'choice',
    screenTimeReward: 15,
    moneyReward: 15,
    unit: 'per 15 min',
    unitRate: 15,
    icon: 'BookOpen',
    isDefault: true,
  },
  {
    id: 'task-reading-aloud',
    title: 'Lese høyt for en voksen',
    category: 'reading',
    description: 'Les høyt fra en bok eller leksetekst for mamma eller pappa.',
    rewardType: 'choice',
    screenTimeReward: 20,
    moneyReward: 20,
    unit: 'per 10 min',
    unitRate: 10,
    icon: 'BookMarked',
    isDefault: true,
  },
  {
    id: 'task-writing-story',
    title: 'Skrive historie eller dagbok',
    category: 'writing',
    description: 'Bruk fantasien og skriv en gøy fortelling eller hva du har gjort i dag.',
    rewardType: 'choice',
    screenTimeReward: 15,
    moneyReward: 15,
    unit: 'per 50 ord',
    unitRate: 50,
    icon: 'Pencil',
    isDefault: true,
  },
  {
    id: 'task-writing-homework',
    title: 'Skrivelekser eller skriveøving',
    category: 'writing',
    description: 'Gjør ferdig skriveoppgaver fra skolen.',
    rewardType: 'choice',
    screenTimeReward: 20,
    moneyReward: 20,
    unit: 'per side',
    unitRate: 1,
    icon: 'FileText',
    isDefault: true,
  },
  {
    id: 'task-chore-tidy-room',
    title: 'Rydde eget rom',
    category: 'chore',
    description: 'Sett leker på plass og legg klær til vask.',
    rewardType: 'choice',
    screenTimeReward: 20,
    moneyReward: 20,
    unit: 'per gang',
    unitRate: 1,
    icon: 'Sparkles',
    isDefault: true,
  },
  {
    id: 'task-chore-dishwasher',
    title: 'Tømme oppvaskmaskinen',
    category: 'chore',
    description: 'Sett tallerkener, glass og bestikk inn i skapene.',
    rewardType: 'choice',
    screenTimeReward: 15,
    moneyReward: 15,
    unit: 'per gang',
    unitRate: 1,
    icon: 'UtensilsCrossed',
    isDefault: true,
  },
  {
    id: 'task-chore-trash',
    title: 'Gå ut med søpla',
    category: 'chore',
    description: 'Ta ut posen med restavfall eller papp.',
    rewardType: 'money',
    screenTimeReward: 10,
    moneyReward: 10,
    unit: 'per gang',
    unitRate: 1,
    icon: 'Trash2',
    isDefault: true,
  },
  {
    id: 'task-chore-pet',
    title: 'Mate eller lufte kjæledyr',
    category: 'chore',
    description: 'Gi mat og friskt vann til dyrene våre.',
    rewardType: 'screen_time',
    screenTimeReward: 10,
    moneyReward: 10,
    unit: 'per gang',
    unitRate: 1,
    icon: 'Heart',
    isDefault: true,
  },
];

export const DEFAULT_SUBMISSIONS: TaskSubmission[] = [
  {
    id: 'sub-1',
    childId: 'child-1',
    taskId: 'task-reading-time',
    category: 'reading',
    title: 'Egenlesing (bok eller tegneserie)',
    details: 'Leste i "Harry Potter og De vises stein" kapittel 4',
    quantity: 30,
    unitLabel: 'minutter',
    chosenRewardType: 'screen_time',
    calculatedReward: 30,
    status: 'pending',
    submittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-2',
    childId: 'child-2',
    taskId: 'task-writing-story',
    category: 'writing',
    title: 'Skrive historie eller dagbok',
    details: 'Skrev en fortelling om en robot på Mars (120 ord)',
    quantity: 120,
    unitLabel: 'ord',
    chosenRewardType: 'money',
    calculatedReward: 36,
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'sub-3',
    childId: 'child-3',
    taskId: 'task-chore-tidy-room',
    category: 'chore',
    title: 'Rydde eget rom',
    details: 'Ryddet alle klossene og bamsene på plass',
    quantity: 1,
    unitLabel: 'gang',
    chosenRewardType: 'screen_time',
    calculatedReward: 20,
    status: 'approved',
    submittedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    childId: 'child-1',
    type: 'earn',
    rewardType: 'screen_time',
    amount: 30,
    description: 'Leste 30 min i Harry Potter',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx-2',
    childId: 'child-1',
    type: 'withdraw',
    rewardType: 'screen_time',
    amount: 15,
    description: 'Spilte Roblox på iPad',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx-3',
    childId: 'child-2',
    type: 'earn',
    rewardType: 'money',
    amount: 30,
    description: 'Tømte oppvaskmaskinen og gikk med søpla',
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tx-4',
    childId: 'child-3',
    type: 'earn',
    rewardType: 'screen_time',
    amount: 20,
    description: 'Ryddet rommet',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

export const getInitialState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.children && parsed.tasks) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Kunne ikke hente lokal tilstand, bruker standarddata', e);
  }

  const initial: AppState = {
    children: DEFAULT_CHILDREN,
    tasks: DEFAULT_TASKS,
    submissions: DEFAULT_SUBMISSIONS,
    transactions: DEFAULT_TRANSACTIONS,
    parentPin: '1234',
  };

  saveState(initial);
  return initial;
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Kunne ikke lagre tilstand', e);
  }
};

export const exportDataAsJSON = (state: AppState): string => {
  return JSON.stringify(state, null, 2);
};

export const importDataFromJSON = (jsonString: string): AppState | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.children && parsed.tasks && parsed.submissions && parsed.transactions) {
      saveState(parsed);
      return parsed;
    }
  } catch (e) {
    console.error('Feil ved import av JSON-sikkerhetskopi', e);
  }
  return null;
};
