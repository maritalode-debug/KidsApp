import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { ApprovalQueue } from './ApprovalQueue';
import { TaskManager } from './TaskManager';
import { ProfileManager } from './ProfileManager';
import { ShieldCheck, Clock, Sliders, Users, ArrowLeft } from 'lucide-react';

type ParentTab = 'queue' | 'tasks' | 'profiles';

export const ParentAdminView: React.FC = () => {
  const { state, setIsParentMode } = useFamily();
  const [activeTab, setActiveTab] = useState<ParentTab>('queue');

  const pendingCount = state.submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Parent Mode Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/20 text-white font-extrabold text-[11px] mb-1">
              <span>PIN-låst kontrollpanel</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Foreldrepanel</h2>
            <p className="text-amber-100 text-xs md:text-sm font-semibold">
              Her administrerer du familiens oppgaver, godkjenninger og barneprofiler.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsParentMode(false)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-800 hover:bg-slate-50 font-black text-sm shadow-md active:scale-95 transition-all self-end md:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Lukk foreldremodus</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all relative ${
            activeTab === 'queue'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Godkjenningskø</span>
          {pendingCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === 'queue'
                  ? 'bg-white text-amber-700'
                  : 'bg-amber-500 text-white animate-bounce'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Oppgavebank & Satser</span>
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'profiles'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Profiler & Innstillinger</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'queue' && <ApprovalQueue />}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'profiles' && <ProfileManager />}
      </div>
    </div>
  );
};
