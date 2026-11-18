import React from 'react';
import { ChildProfile } from '../../types';
import { Tv, Coins, PlusCircle, ArrowDownToLine, PiggyBank } from 'lucide-react';

interface BankBalanceProps {
  child: ChildProfile;
  onOpenTaskModal: () => void;
  onOpenWithdrawModal: () => void;
}

export const BankBalance: React.FC<BankBalanceProps> = ({
  child,
  onOpenTaskModal,
  onOpenWithdrawModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Child Header Card */}
      <div className={`bg-gradient-to-r ${child.color} rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl md:text-5xl shadow-inner border border-white/20">
            {child.avatar}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs mb-1.5 backdrop-blur-md">
              <PiggyBank className="w-3.5 h-3.5" />
              <span>Min personlige BarneBank</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {child.name}s Sparegris
            </h2>
            <p className="text-white/80 text-sm font-semibold">
              Her er alt du har tjent opp på lesing, skriving og oppgaver!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onOpenTaskModal}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white text-slate-800 hover:bg-slate-50 font-black text-base shadow-lg shadow-black/10 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>Registrer oppgave</span>
          </button>

          <button
            onClick={onOpenWithdrawModal}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-white font-black text-base shadow-lg shadow-black/10 border border-white/20 active:scale-95 transition-all"
          >
            <ArrowDownToLine className="w-5 h-5 text-amber-400" />
            <span>Ta ut belønning</span>
          </button>
        </div>
      </div>

      {/* Balance Cards: Skjermtid & Penger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skjermtid Konto */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">
                  Skjermtid-konto
                </p>
                <h3 className="text-xl font-black text-white">Tilgjengelig spilletid</h3>
              </div>
            </div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-blue-100">
              Minutter
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black text-white tracking-tight">
                {child.screenTimeMinutes}
              </span>
              <span className="text-2xl font-bold text-blue-200">minutter</span>
            </div>
            <p className="text-xs font-semibold text-blue-100 mt-2">
              Tilsvarer ca. {Math.floor(child.screenTimeMinutes / 60)} timer og{' '}
              {child.screenTimeMinutes % 60} minutter
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-blue-100">
            <span>Bruk til spill, videoer eller nettbrett</span>
            <button
              onClick={onOpenWithdrawModal}
              className="text-white hover:underline flex items-center gap-1 font-extrabold"
            >
              <span>Bruk nå &rarr;</span>
            </button>
          </div>
        </div>

        {/* Lommepenger Konto */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                  Sparegris & Penger
                </p>
                <h3 className="text-xl font-black text-white">Oppsparte lommepenger</h3>
              </div>
            </div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-emerald-100">
              NOK
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black text-white tracking-tight">
                {child.moneyBalance}
              </span>
              <span className="text-2xl font-bold text-emerald-200">kroner</span>
            </div>
            <p className="text-xs font-semibold text-emerald-100 mt-2">
              Penger spart opp som foreldrene kan utbetale eller overføre
            </p>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-emerald-100">
            <span>Perfekt for leker, godteri eller sparing</span>
            <button
              onClick={onOpenWithdrawModal}
              className="text-white hover:underline flex items-center gap-1 font-extrabold"
            >
              <span>Be om utbetaling &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
