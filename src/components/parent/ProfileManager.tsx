import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { ChildProfile } from '../../types';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  Download,
  RefreshCw,
  Tv,
  Coins,
  Check,
  X,
  AlertCircle,
  Save,
} from 'lucide-react';

export const ProfileManager: React.FC = () => {
  const {
    state,
    createChild,
    updateChild,
    deleteChild,
    adjustBalance,
    updateParentPin,
    resetToDefaultData,
    exportData,
    importData,
  } = useFamily();

  // Child modal states
  const [showChildModal, setShowChildModal] = useState<boolean>(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [childName, setChildName] = useState<string>('');
  const [childAvatar, setChildAvatar] = useState<string>('🦄');
  const [childColor, setChildColor] = useState<string>('from-purple-500 to-pink-500');

  // Balance Adjustment state
  const [adjustChildId, setAdjustChildId] = useState<string | null>(null);
  const [adjustType, setAdjustType] = useState<'screen_time' | 'money'>('screen_time');
  const [adjustAmount, setAdjustAmount] = useState<number>(15);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // PIN settings state
  const [newPin, setNewPin] = useState<string>('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState<boolean>(false);

  // Backup / Import state
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const availableAvatars = ['🦄', '🚀', '🦁', '🐱', '🐶', '🐼', '🦊', '🦖', '🎨', '⚽', '🎮', '🌟'];
  const availableColors = [
    { name: 'Lilla/Rosa', class: 'from-fuchsia-500 to-pink-500' },
    { name: 'Blå/Cyan', class: 'from-blue-500 to-cyan-500' },
    { name: 'Gul/Oransje', class: 'from-amber-500 to-orange-500' },
    { name: 'Grønn/Smaragd', class: 'from-emerald-500 to-teal-500' },
    { name: 'Lilla/Indigo', class: 'from-purple-600 to-indigo-600' },
    { name: 'Rød/Rose', class: 'from-rose-500 to-red-600' },
  ];

  const handleOpenAddChild = () => {
    setEditingChild(null);
    setChildName('');
    setChildAvatar('🦄');
    setChildColor('from-fuchsia-500 to-pink-500');
    setShowChildModal(true);
  };

  const handleOpenEditChild = (child: ChildProfile) => {
    setEditingChild(child);
    setChildName(child.name);
    setChildAvatar(child.avatar);
    setChildColor(child.color);
    setShowChildModal(true);
  };

  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;

    if (editingChild) {
      updateChild({
        ...editingChild,
        name: childName.trim(),
        avatar: childAvatar,
        color: childColor,
      });
    } else {
      createChild({
        name: childName.trim(),
        avatar: childAvatar,
        color: childColor,
      });
    }

    setShowChildModal(false);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustChildId) return;

    adjustBalance(
      adjustChildId,
      adjustType,
      adjustAmount,
      adjustReason.trim() || 'Manuell foreldrejustering'
    );

    setAdjustChildId(null);
    setAdjustAmount(15);
    setAdjustReason('');
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      updateParentPin(newPin);
      setNewPin('');
      setPinSuccessMsg(true);
      setTimeout(() => setPinSuccessMsg(false), 3000);
    }
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barnebank-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    setImportSuccess(false);

    if (!importJsonText.trim()) return;

    const ok = importData(importJsonText);
    if (ok) {
      setImportSuccess(true);
      setImportJsonText('');
      setTimeout(() => setImportSuccess(false), 3000);
    } else {
      setImportError('Ugyldig JSON-sikkerhetskopi!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Children Profiles Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>Barneprofiler & Saldojustering</span>
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              Administrer barna, rediger avatarene og juster saldo manuelt ved behov
            </p>
          </div>

          <button
            onClick={handleOpenAddChild}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md shadow-purple-500/25 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Legg til barn</span>
          </button>
        </div>

        {/* Children List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.children.map((child) => (
            <div
              key={child.id}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${child.color} flex items-center justify-center text-2xl shadow-sm`}
                    >
                      {child.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-base">{child.name}</h4>
                      <p className="text-[11px] font-bold text-slate-400">Profil #{child.id.slice(-4)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditChild(child)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors"
                      title="Rediger profil"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {state.children.length > 1 && (
                      <button
                        onClick={() => deleteChild(child.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                        title="Slett barn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 text-xs font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-400">Skjerm:</span>
                    <span className="text-blue-700 font-black">{child.screenTimeMinutes}m</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-400">Penger:</span>
                    <span className="text-emerald-700 font-black">{child.moneyBalance}kr</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setAdjustChildId(child.id);
                  setAdjustAmount(15);
                  setAdjustReason('');
                }}
                className="mt-3 w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200 transition-colors shadow-sm"
              >
                Juster saldo manuelt &plusmn;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Balance Adjust Modal */}
      {adjustChildId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setAdjustChildId(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-1">
              Manuell saldojustering
            </h3>
            <p className="text-xs font-bold text-slate-400 mb-4">
              Juster saldo for {state.children.find((c) => c.id === adjustChildId)?.name}
            </p>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Velg kontotype
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('screen_time')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      adjustType === 'screen_time'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    <span>Skjermminutter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('money')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      adjustType === 'money'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>Kroner</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Beløp (bruk minus for trekk, f.eks. -15)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base font-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Begrunnelse (f.eks. 'Ekstra hjelp til besteforeldre' eller 'Bonus')
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Begrunnelse..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md active:scale-95 transition-all"
                >
                  Utfør justering
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustChildId(null)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Child Edit / Create Modal */}
      {showChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowChildModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-4">
              {editingChild ? 'Rediger barneprofil' : 'Legg til nytt barn'}
            </h3>

            <form onSubmit={handleSaveChild} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Barnets navn
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="F.eks. Emma, Lucas, Elias..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Velg avatar / emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableAvatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setChildAvatar(av)}
                      className={`w-11 h-11 rounded-xl border-2 text-2xl flex items-center justify-center transition-all ${
                        childAvatar === av
                          ? 'bg-purple-100 border-purple-500 scale-110 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Profilfarge
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableColors.map((col) => (
                    <button
                      key={col.class}
                      type="button"
                      onClick={() => setChildColor(col.class)}
                      className={`p-2 rounded-xl border-2 flex items-center gap-2 text-xs font-bold transition-all ${
                        childColor === col.class
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-200'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${col.class}`} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md active:scale-95 transition-all"
                >
                  {editingChild ? 'Oppdater profil' : 'Opprett profil'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowChildModal(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN Code & Security Settings */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 mb-1">
          <KeyRound className="w-6 h-6 text-amber-500" />
          <span>Sikkerhet & PIN-kode</span>
        </h3>
        <p className="text-xs font-bold text-slate-400 mb-4">
          Endre den 4-sifrede foreldrekoden (standard er 1234)
        </p>

        <form onSubmit={handleSavePin} className="max-w-md flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            maxLength={4}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Ny 4-sifret PIN"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={newPin.length !== 4}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-sm shadow-md transition-all"
          >
            Lagre ny PIN
          </button>
        </form>

        {pinSuccessMsg && (
          <p className="text-emerald-600 font-bold text-xs mt-2 flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>PIN-koden er oppdatert!</span>
          </p>
        )}
      </div>

      {/* Backup, Export & Reset */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 mb-1">
            <Save className="w-6 h-6 text-blue-600" />
            <span>Sikkerhetskopi & Data</span>
          </h3>
          <p className="text-xs font-bold text-slate-400">
            Eksporter familiens data som JSON-fil for trygg lagring eller gjenopprett fra backup
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-all"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Last ned JSON-sikkerhetskopi</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Vil du tilbakestille alle data til standard demo-data?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Gjenopprett standard demo-data</span>
          </button>
        </div>

        {/* JSON Import area */}
        <form onSubmit={handleImport} className="space-y-3 pt-2">
          <label className="block text-xs font-extrabold text-slate-700">
            Eller lim inn JSON-sikkerhetskopi for å gjenopprette:
          </label>
          <textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Lim inn JSON-data her..."
            rows={2}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!importJsonText.trim()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all"
          >
            Importer data
          </button>

          {importSuccess && (
            <p className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Data ble importert!</span>
            </p>
          )}
          {importError && (
            <p className="text-rose-600 font-bold text-xs flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{importError}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
