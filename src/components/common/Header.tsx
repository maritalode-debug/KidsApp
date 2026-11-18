import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { Lock, Unlock, Sparkles, Home, ArrowLeft } from 'lucide-react';
import { PinModal } from './PinModal';

export const Header: React.FC = () => {
  const { activeChild, setActiveChildId, isParentMode, setIsParentMode, state } = useFamily();
  const [showPinModal, setShowPinModal] = useState(false);

  const pendingSubmissionsCount = state.submissions.filter((s) => s.status === 'pending').length;

  const handleParentButtonClick = () => {
    if (isParentMode) {
      // Exit parent mode back to dashboard
      setIsParentMode(false);
    } else {
      setShowPinModal(true);
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-3">
            {activeChild && !isParentMode && (
              <button
                onClick={() => setActiveChildId(null)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Hjem</span>
              </button>
            )}

            {isParentMode && (
              <button
                onClick={() => setIsParentMode(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-all active:scale-95 shadow-sm"
              >
                <Home className="w-5 h-5" />
                <span>Tilbake til familievisning</span>
              </button>
            )}

            <div
              onClick={() => {
                setActiveChildId(null);
                setIsParentMode(false);
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                  BarneBank
                </h1>
                <p className="text-xs font-bold text-slate-400 hidden sm:block">
                  Skjermtid & Lommepenger
                </p>
              </div>
            </div>
          </div>

          {/* Active Child indicator or Parent button */}
          <div className="flex items-center gap-3">
            {activeChild && !isParentMode && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-inner">
                <span className="text-xl">{activeChild.avatar}</span>
                <span className="font-extrabold text-slate-800 text-sm hidden sm:inline">
                  {activeChild.name}
                </span>
              </div>
            )}

            {/* Parent Mode Toggle */}
            <button
              onClick={handleParentButtonClick}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md ${
                isParentMode
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-slate-200/50'
              }`}
            >
              {isParentMode ? (
                <>
                  <Unlock className="w-4 h-4 text-amber-100" />
                  <span>Foreldremodus</span>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500" />
                    {pendingSubmissionsCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce">
                        {pendingSubmissionsCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Foreldre</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <PinModal
          title="Lås opp foreldremodus"
          description="Tast inn din 4-sifrede foreldrekode for å administrere oppgaver og godkjenninger."
          onSuccess={() => {
            setShowPinModal(false);
            setIsParentMode(true);
            setActiveChildId(null);
          }}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </>
  );
};
