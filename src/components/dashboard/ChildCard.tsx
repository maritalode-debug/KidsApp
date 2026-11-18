import React from 'react';
import { ChildProfile } from '../../types';
import { useFamily } from '../../store/FamilyContext';
import { Tv, Coins, Clock, ChevronRight, Sparkles } from 'lucide-react';

interface ChildCardProps {
  child: ChildProfile;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const { setActiveChildId, state } = useFamily();

  const pendingCount = state.submissions.filter(
    (s) => s.childId === child.id && s.status === 'pending'
  ).length;

  return (
    <div
      onClick={() => setActiveChildId(child.id)}
      className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/60 border-2 border-slate-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Decorative top accent gradient */}
      <div className={`h-2.5 w-full bg-gradient-to-r ${child.color} absolute top-0 left-0`} />

      <div>
        {/* Child Header: Avatar + Name + Pending badge */}
        <div className="flex items-center justify-between mb-5 mt-1">
          <div className="flex items-center gap-3.5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${child.color} flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition-transform`}>
              {child.avatar}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                {child.name}
              </h3>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <span>Trykk for å åpne banken</span>
              </p>
            </div>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingCount} venter</span>
            </div>
          )}
        </div>

        {/* Balance Display Grid */}
        <div className="grid grid-cols-2 gap-3 my-2">
          {/* Skjermtid */}
          <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-100 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-extrabold mb-1">
              <Tv className="w-4 h-4" />
              <span>Skjermtid</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-black text-blue-900">
                {child.screenTimeMinutes}
              </span>
              <span className="text-xs font-bold text-blue-600">min</span>
            </div>
          </div>

          {/* Lommepenger */}
          <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-100 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-extrabold mb-1">
              <Coins className="w-4 h-4" />
              <span>Penger</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-black text-emerald-900">
                {child.moneyBalance}
              </span>
              <span className="text-xs font-bold text-emerald-600">kr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-blue-600 font-extrabold text-sm group-hover:translate-x-1 transition-transform">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Se sparegris & oppgaver</span>
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
