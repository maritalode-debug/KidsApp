import React from 'react';
import { useFamily } from '../../store/FamilyContext';
import { FamilyStatsCard } from './FamilyStatsCard';
import { ChildCard } from './ChildCard';
import { Users } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { state } = useFamily();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero / Family Stats Overview */}
      <FamilyStatsCard />

      {/* Children Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">
                Velg din sparegris & konto
              </h3>
              <p className="text-xs font-bold text-slate-400">
                Trykk på ditt navn for å registrere lesing, skriving eller ta ut belønning
              </p>
            </div>
          </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      </div>

      {/* Motivational Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
            🌟
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-black">
              Husk: 10 minutter skriving gir 20 minutter skjermtid!!
            </h4>
            <p className="text-xs md:text-sm font-semibold text-amber-100">
              Eller du kan spare pengene i sparegrisen din til noe du ønsker deg.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
