import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, ChildProfile, TaskDefinition, TaskSubmission, Transaction } from '../types';
import { exportDataAsJSON, getInitialState, importDataFromJSON, saveState, DEFAULT_CHILDREN, DEFAULT_TASKS, DEFAULT_SUBMISSIONS, DEFAULT_TRANSACTIONS } from '../services/storageService';

interface FamilyContextType {
  state: AppState;
  activeChild: ChildProfile | null;
  activeChildId: string | null;
  setActiveChildId: (id: string | null) => void;
  isParentMode: boolean;
  setIsParentMode: (val: boolean) => void;
  submitTask: (data: Omit<TaskSubmission, 'id' | 'status' | 'submittedAt'>) => void;
  approveSubmission: (submissionId: string, customRewardAmount?: number) => void;
  rejectSubmission: (submissionId: string, reason?: string) => void;
  withdrawReward: (childId: string, rewardType: 'screen_time' | 'money', amount: number, description: string) => boolean;
  adjustBalance: (childId: string, rewardType: 'screen_time' | 'money', amount: number, reason: string) => void;
  createTask: (task: Omit<TaskDefinition, 'id'>) => void;
  updateTask: (task: TaskDefinition) => void;
  deleteTask: (taskId: string) => void;
  createChild: (child: Omit<ChildProfile, 'id' | 'createdAt' | 'screenTimeMinutes' | 'moneyBalance'>) => void;
  updateChild: (child: ChildProfile) => void;
  deleteChild: (childId: string) => void;
  updateParentPin: (newPin: string) => void;
  resetToDefaultData: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [isParentMode, setIsParentMode] = useState<boolean>(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeChild = state.children.find((c) => c.id === activeChildId) || null;

  const submitTask = (data: Omit<TaskSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSubmission: TaskSubmission = {
      ...data,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      submissions: [newSubmission, ...prev.submissions],
    }));
  };

  const approveSubmission = (submissionId: string, customRewardAmount?: number) => {
    setState((prev) => {
      const sub = prev.submissions.find((s) => s.id === submissionId);
      if (!sub || sub.status !== 'pending') return prev;

      const rewardAmount = customRewardAmount !== undefined ? customRewardAmount : sub.calculatedReward;

      const updatedSubmissions = prev.submissions.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'approved' as const,
              calculatedReward: rewardAmount,
              approvedAt: new Date().toISOString(),
            }
          : s
      );

      const updatedChildren = prev.children.map((c) => {
        if (c.id === sub.childId) {
          if (sub.chosenRewardType === 'screen_time') {
            return { ...c, screenTimeMinutes: c.screenTimeMinutes + rewardAmount };
          } else {
            return { ...c, moneyBalance: c.moneyBalance + rewardAmount };
          }
        }
        return c;
      });

      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        childId: sub.childId,
        type: 'earn',
        rewardType: sub.chosenRewardType,
        amount: rewardAmount,
        description: `${sub.title} (${sub.quantity} ${sub.unitLabel})`,
        timestamp: new Date().toISOString(),
        submissionId: sub.id,
      };

      return {
        ...prev,
        submissions: updatedSubmissions,
        children: updatedChildren,
        transactions: [newTx, ...prev.transactions],
      };
    });
  };

  const rejectSubmission = (submissionId: string, reason?: string) => {
    setState((prev) => ({
      ...prev,
      submissions: prev.submissions.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'rejected' as const,
              rejectionReason: reason || 'Ikke godkjent av forelder',
            }
          : s
      ),
    }));
  };

  const withdrawReward = (
    childId: string,
    rewardType: 'screen_time' | 'money',
    amount: number,
    description: string
  ): boolean => {
    const child = state.children.find((c) => c.id === childId);
    if (!child) return false;

    const currentBalance = rewardType === 'screen_time' ? child.screenTimeMinutes : child.moneyBalance;
    if (currentBalance < amount) return false;

    setState((prev) => {
      const updatedChildren = prev.children.map((c) => {
        if (c.id === childId) {
          return rewardType === 'screen_time'
            ? { ...c, screenTimeMinutes: Math.max(0, c.screenTimeMinutes - amount) }
            : { ...c, moneyBalance: Math.max(0, c.moneyBalance - amount) };
        }
        return c;
      });

      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        childId,
        type: 'withdraw',
        rewardType,
        amount,
        description,
        timestamp: new Date().toISOString(),
      };

      return {
        ...prev,
        children: updatedChildren,
        transactions: [newTx, ...prev.transactions],
      };
    });

    return true;
  };

  const adjustBalance = (
    childId: string,
    rewardType: 'screen_time' | 'money',
    amount: number,
    reason: string
  ) => {
    setState((prev) => {
      const updatedChildren = prev.children.map((c) => {
        if (c.id === childId) {
          return rewardType === 'screen_time'
            ? { ...c, screenTimeMinutes: Math.max(0, c.screenTimeMinutes + amount) }
            : { ...c, moneyBalance: Math.max(0, c.moneyBalance + amount) };
        }
        return c;
      });

      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        childId,
        type: 'adjustment',
        rewardType,
        amount: Math.abs(amount),
        description: `Saldojustering (${amount >= 0 ? '+' : '-'}${Math.abs(amount)}): ${reason}`,
        timestamp: new Date().toISOString(),
      };

      return {
        ...prev,
        children: updatedChildren,
        transactions: [newTx, ...prev.transactions],
      };
    });
  };

  const createTask = (task: Omit<TaskDefinition, 'id'>) => {
    const newTask: TaskDefinition = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const updateTask = (task: TaskDefinition) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  };

  const deleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const createChild = (
    childData: Omit<ChildProfile, 'id' | 'createdAt' | 'screenTimeMinutes' | 'moneyBalance'>
  ) => {
    const newChild: ChildProfile = {
      ...childData,
      id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      screenTimeMinutes: 0,
      moneyBalance: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
    }));
  };

  const updateChild = (child: ChildProfile) => {
    setState((prev) => ({
      ...prev,
      children: prev.children.map((c) => (c.id === child.id ? child : c)),
    }));
  };

  const deleteChild = (childId: string) => {
    setState((prev) => ({
      ...prev,
      children: prev.children.filter((c) => c.id !== childId),
      submissions: prev.submissions.filter((s) => s.childId !== childId),
      transactions: prev.transactions.filter((t) => t.childId !== childId),
    }));
    if (activeChildId === childId) {
      setActiveChildId(null);
    }
  };

  const updateParentPin = (newPin: string) => {
    setState((prev) => ({
      ...prev,
      parentPin: newPin,
    }));
  };

  const resetToDefaultData = () => {
    const defaultState: AppState = {
      children: DEFAULT_CHILDREN,
      tasks: DEFAULT_TASKS,
      submissions: DEFAULT_SUBMISSIONS,
      transactions: DEFAULT_TRANSACTIONS,
      parentPin: '1234',
    };
    setState(defaultState);
  };

  const exportData = () => {
    return exportDataAsJSON(state);
  };

  const importData = (json: string): boolean => {
    const loaded = importDataFromJSON(json);
    if (loaded) {
      setState(loaded);
      return true;
    }
    return false;
  };

  return (
    <FamilyContext.Provider
      value={{
        state,
        activeChild,
        activeChildId,
        setActiveChildId,
        isParentMode,
        setIsParentMode,
        submitTask,
        approveSubmission,
        rejectSubmission,
        withdrawReward,
        adjustBalance,
        createTask,
        updateTask,
        deleteTask,
        createChild,
        updateChild,
        deleteChild,
        updateParentPin,
        resetToDefaultData,
        exportData,
        importData,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
