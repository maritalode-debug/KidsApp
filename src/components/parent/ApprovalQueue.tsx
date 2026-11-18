import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { TaskSubmission } from '../../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Tv,
  Coins,
  Edit2,
} from 'lucide-react';

export const ApprovalQueue: React.FC = () => {
  const { state, approveSubmission, rejectSubmission } = useFamily();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedReward, setEditedReward] = useState<number>(0);
  const [rejectReasonId, setRejectReasonId] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState<string>('');

  const pendingSubmissions = state.submissions.filter((s) => s.status === 'pending');

  const getChild = (childId: string) => {
    return state.children.find((c) => c.id === childId);
  };

  const handleStartEdit = (sub: TaskSubmission) => {
    setEditingId(sub.id);
    setEditedReward(sub.calculatedReward);
  };

  const handleApprove = (sub: TaskSubmission) => {
    const finalAmount = editingId === sub.id ? editedReward : sub.calculatedReward;
    approveSubmission(sub.id, finalAmount);
    setEditingId(null);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 },
      });
    } catch {
      // Ignorer
    }
  };

  const handleReject = (subId: string) => {
    rejectSubmission(subId, rejectReasonText || 'Ikke godkjent av forelder');
    setRejectReasonId(null);
    setRejectReasonText('');
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            <span>Godkjenningskø ({pendingSubmissions.length})</span>
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            Bekreft barnas innsendte lese-, skrive- og husarbeidsøkter
          </p>
        </div>
      </div>

      {pendingSubmissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl mb-3 shadow-inner">
            ✨
          </div>
          <h4 className="text-xl font-black text-slate-800">Alt er ajour!</h4>
          <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto mt-1">
            Ingen ventende oppgaver i køen akkurat nå. Nye oppgaver barna sender inn vil dukke opp
            her.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSubmissions.map((sub) => {
            const child = getChild(sub.childId);
            const isEditing = editingId === sub.id;
            const isRejecting = rejectReasonId === sub.id;

            return (
              <div
                key={sub.id}
                className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-200/80 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Child info & Task Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${
                        child?.color || 'from-blue-500 to-indigo-500'
                      } flex items-center justify-center text-3xl shrink-0 shadow-md`}
                    >
                      {child?.avatar || '🧒'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base md:text-lg">
                          {child?.name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black">
                          {sub.category === 'reading'
                            ? '📖 Lesing'
                            : sub.category === 'writing'
                            ? '✍️ Skriving'
                            : sub.category === 'chore'
                            ? '🧹 Husarbeid'
                            : '✨ Eget'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-800 text-base mt-0.5">
                        {sub.title}
                      </h4>

                      {sub.details && (
                        <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl mt-1 border border-slate-100">
                          {sub.details}
                        </p>
                      )}

                      <p className="text-[11px] font-bold text-slate-400 mt-1.5">
                        Innsendt: {formatDate(sub.submittedAt)} &bull; Mengde: {sub.quantity}{' '}
                        {sub.unitLabel}
                      </p>
                    </div>
                  </div>

                  {/* Right: Reward Adjustment & Action buttons */}
                  <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Reward Badge / Editor */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {sub.chosenRewardType === 'screen_time' ? (
                          <Tv className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Coins className="w-5 h-5 text-emerald-600" />
                        )}
                        <span className="text-xs font-bold text-slate-500">
                          {sub.chosenRewardType === 'screen_time' ? 'Skjermtid:' : 'Penger:'}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editedReward}
                            onChange={(e) => setEditedReward(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 px-2 py-1 rounded-lg border border-blue-400 font-black text-center text-sm focus:outline-none"
                            autoFocus
                          />
                          <span className="text-xs font-bold text-slate-600">
                            {sub.chosenRewardType === 'screen_time' ? 'min' : 'kr'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 font-black text-lg text-slate-900">
                          <span>+{sub.calculatedReward}</span>
                          <span className="text-xs font-bold text-slate-500">
                            {sub.chosenRewardType === 'screen_time' ? 'min' : 'kr'}
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(sub)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                          title="Juster belønning"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Action buttons: Approve / Reject */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(sub)}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Godkjenn</span>
                      </button>

                      <button
                        onClick={() => setRejectReasonId(isRejecting ? null : sub.id)}
                        className="p-3 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-extrabold text-sm active:scale-95 transition-all"
                        title="Avvis oppgave"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reject Reason input box */}
                {isRejecting && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 animate-fadeIn">
                    <input
                      type="text"
                      value={rejectReasonText}
                      onChange={(e) => setRejectReasonText(e.target.value)}
                      placeholder="Begrunnelse for avvisning (f.eks. 'Ikke helt ferdig ryddet')"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(sub.id)}
                        className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-black shadow-md hover:bg-rose-600 transition-colors"
                      >
                        Bekreft avvisning
                      </button>
                      <button
                        onClick={() => setRejectReasonId(null)}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
