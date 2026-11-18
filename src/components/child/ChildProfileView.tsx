import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { BankBalance } from './BankBalance';
import { TransactionHistory } from './TransactionHistory';
import { TaskSubmissionModal } from './TaskSubmissionModal';
import { WithdrawalModal } from './WithdrawalModal';
import { ScreenTimerModal } from './ScreenTimerModal';

export const ChildProfileView: React.FC = () => {
  const { activeChild } = useFamily();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeTimerMinutes, setActiveTimerMinutes] = useState<number | null>(null);

  if (!activeChild) {
    return null;
  }

  const handleStartTimer = (minutes: number) => {
    setActiveTimerMinutes(minutes);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Visual Bank & Balances */}
      <BankBalance
        child={activeChild}
        onOpenTaskModal={() => setShowTaskModal(true)}
        onOpenWithdrawModal={() => setShowWithdrawModal(true)}
      />

      {/* History of submissions and transactions */}
      <TransactionHistory childId={activeChild.id} />

      {/* Modal for Submitting Tasks */}
      {showTaskModal && (
        <TaskSubmissionModal
          child={activeChild}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Modal for Withdrawing Rewards */}
      {showWithdrawModal && (
        <WithdrawalModal
          child={activeChild}
          onClose={() => setShowWithdrawModal(false)}
          onStartTimer={handleStartTimer}
        />
      )}

      {/* Modal for Active Screen Time Countdown */}
      {activeTimerMinutes !== null && (
        <ScreenTimerModal
          initialMinutes={activeTimerMinutes}
          childName={activeChild.name}
          onClose={() => setActiveTimerMinutes(null)}
        />
      )}
    </div>
  );
};
