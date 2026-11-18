import React from 'react';
import { FamilyProvider, useFamily } from './store/FamilyContext';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ChildProfileView } from './components/child/ChildProfileView';
import { ParentAdminView } from './components/parent/ParentAdminView';

const MainContent: React.FC = () => {
  const { isParentMode, activeChild } = useFamily();

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
      {isParentMode ? (
        <ParentAdminView />
      ) : activeChild ? (
        <ChildProfileView />
      ) : (
        <DashboardView />
      )}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <FamilyProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
        <div>
          <Header />
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="py-6 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-400 font-bold">
          <p>BarneBank PWA &bull; Laget for familiens felles nettbrett</p>
        </footer>
      </div>
    </FamilyProvider>
  );
};

export default App;
