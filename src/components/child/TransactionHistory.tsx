import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { Clock, ArrowDownRight, ArrowUpRight, FileText, Sparkles } from 'lucide-react';

interface TransactionHistoryProps {
  childId: string;
}

type TabType = 'all' | 'pending' | 'earned' | 'withdrawn';

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ childId }) => {
  const { state } = useFamily();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const childSubmissions = state.submissions.filter((s) => s.childId === childId);
  const childTransactions = state.transactions.filter((t) => t.childId === childId);

  const pendingSubmissions = childSubmissions.filter((s) => s.status === 'pending');

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Spare- & Aktivitetslogg</span>
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            Historikk over opptjente poeng, innsendte oppgaver og uttak
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Venter</span>
            {pendingSubmissions.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'pending' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
              }`}>
                {pendingSubmissions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('earned')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'earned'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Opptjent
          </button>
          <button
            onClick={() => setActiveTab('withdrawn')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'withdrawn'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Uttak
          </button>
        </div>
      </div>

      {/* Content list */}
      <div className="space-y-3">
        {/* Pending Submissions Section */}
        {(activeTab === 'all' || activeTab === 'pending') && pendingSubmissions.length > 0 && (
          <div className="space-y-3">
            {activeTab === 'all' && (
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Venter på foreldregodkjenning ({pendingSubmissions.length})</span>
              </div>
            )}
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-amber-50/80 border-2 border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 animate-spin" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                        {sub.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                        Venter
                      </span>
                    </div>
                    {sub.details && (
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{sub.details}</p>
                    )}
                    <p className="text-[11px] font-bold text-slate-400 mt-1">
                      {formatDate(sub.submittedAt)} &bull; {sub.quantity} {sub.unitLabel}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 font-black text-amber-800 text-base md:text-lg">
                    <span>+{sub.calculatedReward}</span>
                    {sub.chosenRewardType === 'screen_time' ? (
                      <span className="text-xs font-bold text-blue-600">min</span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">kr</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {sub.chosenRewardType === 'screen_time' ? 'Skjermtid' : 'Penger'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Section */}
        {(activeTab === 'all' || activeTab === 'earned' || activeTab === 'withdrawn') && (
          <div className="space-y-3">
            {activeTab === 'all' && childTransactions.length > 0 && (
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pt-3">
                <FileText className="w-3.5 h-3.5" />
                <span>Fullførte transaksjoner</span>
              </div>
            )}

            {childTransactions
              .filter((tx) => {
                if (activeTab === 'earned') return tx.type === 'earn' || tx.type === 'adjustment';
                if (activeTab === 'withdrawn') return tx.type === 'withdraw';
                return true;
              })
              .map((tx) => {
                const isEarn = tx.type === 'earn' || tx.type === 'adjustment';
                const isScreenTime = tx.rewardType === 'screen_time';

                return (
                  <div
                    key={tx.id}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isEarn
                            ? isScreenTime
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isEarn ? (
                          <ArrowUpRight className="w-6 h-6" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                          {tx.description}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`flex items-center gap-1 font-black text-base md:text-lg ${
                          isEarn ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        <span>
                          {isEarn ? '+' : '-'}
                          {tx.amount}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {isScreenTime ? 'min' : 'kr'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {isScreenTime ? 'Skjermtid' : 'Penger'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Empty state */}
        {childTransactions.length === 0 && pendingSubmissions.length === 0 && (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-xl">
              📝
            </div>
            <p className="font-extrabold text-slate-600 text-sm">Ingen aktiviteter enda</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Trykk på «Registrer oppgave» for å logge lesing, skriving eller husarbeid!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
