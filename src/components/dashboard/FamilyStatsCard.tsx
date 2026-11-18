import React from 'react';
import { useFamily } from '../../store/FamilyContext';
import { calculateFamilyStats } from '../../services/statsService';
import { BookOpen, Pencil, CheckCircle2, TrendingUp, Trophy } from 'lucide-react';

export const FamilyStatsCard: React.FC = () => {
  const { state } = useFamily();
  const stats = calculateFamilyStats(state);

  const maxReading = Math.max(...stats.weeklyTrend.map((d) => d.readingMinutes), 30);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-blue-300 font-extrabold text-sm uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Familiens felles bragder</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
            Samlet innsats denne uken
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">
            {stats.totalTasksCompleted} fullførte oppdrag
          </span>
        </div>
      </div>

      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
        {/* Lesing */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200">Lest totalt</p>
              <p className="text-2xl md:text-3xl font-black text-white">
                {stats.totalReadingMinutes}{' '}
                <span className="text-sm font-bold text-amber-300">min</span>
              </p>
            </div>
          </div>
        </div>

        {/* Skriving */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/20">
              <Pencil className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200">Skrevet totalt</p>
              <p className="text-2xl md:text-3xl font-black text-white">
                {stats.totalWritingWords}{' '}
                <span className="text-sm font-bold text-pink-300">ord</span>
              </p>
            </div>
          </div>
        </div>

        {/* Fullførte oppgaver */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200">Oppgaver løst</p>
              <p className="text-2xl md:text-3xl font-black text-white">
                {stats.totalTasksCompleted}{' '}
                <span className="text-sm font-bold text-emerald-300">stk</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend Bar Chart */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 relative z-10">
        <p className="text-xs font-bold text-blue-200 mb-3 flex items-center justify-between">
          <span>Aktivitet siste 7 dager</span>
          <span className="text-[11px] text-blue-300/80">Leste minutter per dag</span>
        </p>

        <div className="flex items-end justify-between gap-2 h-20 pt-2">
          {stats.weeklyTrend.map((day, idx) => {
            const heightPercent = Math.max(12, Math.round((day.readingMinutes / maxReading) * 100));
            const hasActivity = day.readingMinutes > 0 || day.writingWords > 0;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="relative w-full flex justify-center items-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                      hasActivity
                        ? 'bg-gradient-to-t from-blue-500 to-cyan-300 group-hover:brightness-125 shadow-sm'
                        : 'bg-white/10'
                    }`}
                  />
                  {day.readingMinutes > 0 && (
                    <span className="absolute -top-6 text-[10px] font-black text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.readingMinutes}m
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-extrabold text-blue-200/90">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
