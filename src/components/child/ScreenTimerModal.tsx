import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Play, Pause, RotateCcw, Plus, Bell, Tv } from 'lucide-react';

interface ScreenTimerModalProps {
  initialMinutes: number;
  childName: string;
  onClose: () => void;
}

export const ScreenTimerModal: React.FC<ScreenTimerModalProps> = ({
  initialMinutes,
  childName,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            try {
              confetti({
                particleCount: 80,
                spread: 80,
              });
            } catch {
              // Ignorer
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const handleAddFiveMinutes = () => {
    setTotalSeconds((prev) => prev + 300);
    setRemainingSeconds((prev) => prev + 300);
    if (isFinished) {
      setIsFinished(false);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setRemainingSeconds(totalSeconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-10 shadow-2xl border border-indigo-500/30 text-white relative text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-blue-300">
            Aktiv Skjermtid
          </span>
        </div>

        <h3 className="text-2xl font-black text-white">{childName}s Spilletid</h3>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Nyt spilletiden din! Timeren teller ned automatisk.
        </p>

        {/* Circular Countdown Display */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="w-64 h-64 md:w-72 md:h-72 rounded-full border-8 border-white/10 flex flex-col items-center justify-center relative shadow-inner">
            {/* Pulsing glow background */}
            <div
              className={`absolute inset-2 rounded-full opacity-20 blur-xl transition-all ${
                isFinished ? 'bg-rose-500' : isRunning ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />

            <span className="text-6xl md:text-7xl font-black tracking-tighter text-white font-mono drop-shadow-md">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>

            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-300 mt-2">
              {isFinished ? 'Tiden er ute!' : isRunning ? 'Tiden løper' : 'Pauset'}
            </span>
          </div>
        </div>

        {/* Notification when finished */}
        {isFinished && (
          <div className="bg-rose-500/20 border border-rose-500/40 rounded-2xl p-4 mb-6 animate-bounce">
            <div className="flex items-center justify-center gap-2 text-rose-300 font-black text-sm">
              <Bell className="w-5 h-5" />
              <span>Pip pip! Skjermtiden er over for denne gang.</span>
            </div>
            <p className="text-xs text-rose-200 mt-1">
              Husk å lagre spillet ditt og skru av nettbrettet!
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-2xl font-black text-base flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={handleAddFiveMinutes}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95"
            title="+5 minutter"
          >
            <Plus className="w-5 h-5" />
            <span>+5 min</span>
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Start forfra"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 text-xs font-semibold text-slate-400">
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white underline font-bold"
          >
            Lukk timeren og gå tilbake
          </button>
        </div>
      </div>
    </div>
  );
};
