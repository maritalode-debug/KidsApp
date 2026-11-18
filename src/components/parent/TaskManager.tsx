import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { TaskCategory, TaskDefinition, RewardType } from '../../types';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Tv,
  Coins,
  X,
  BookOpen,
  Pencil,
  BookMarked,
  FileText,
  UtensilsCrossed,
  Heart,
  Sliders,
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { state, createTask, updateTask, deleteTask } = useFamily();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskDefinition | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('chore');
  const [rewardType, setRewardType] = useState<RewardType>('choice');
  const [screenTimeReward, setScreenTimeReward] = useState<number>(15);
  const [moneyReward, setMoneyReward] = useState<number>(15);
  const [unit, setUnit] = useState<string>('per gang');
  const [unitRate, setUnitRate] = useState<number>(1);
  const [icon, setIcon] = useState<string>('Sparkles');

  const availableIcons = [
    { name: 'Sparkles', label: 'Stjerne', icon: Sparkles },
    { name: 'BookOpen', label: 'Bok', icon: BookOpen },
    { name: 'BookMarked', label: 'Bokmerke', icon: BookMarked },
    { name: 'Pencil', label: 'Blyant', icon: Pencil },
    { name: 'FileText', label: 'Ark', icon: FileText },
    { name: 'UtensilsCrossed', label: 'Oppvask', icon: UtensilsCrossed },
    { name: 'Trash2', label: 'Søppel', icon: Trash2 },
    { name: 'Heart', label: 'Kjæledyr/Omsorg', icon: Heart },
  ];

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setCategory('chore');
    setRewardType('choice');
    setScreenTimeReward(15);
    setMoneyReward(15);
    setUnit('per gang');
    setUnitRate(1);
    setIcon('Sparkles');
    setShowModal(true);
  };

  const handleOpenEdit = (task: TaskDefinition) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setCategory(task.category);
    setRewardType(task.rewardType);
    setScreenTimeReward(task.screenTimeReward);
    setMoneyReward(task.moneyReward);
    setUnit(task.unit);
    setUnitRate(task.unitRate || 1);
    setIcon(task.icon);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        category,
        rewardType,
        screenTimeReward,
        moneyReward,
        unit,
        unitRate,
        icon,
      });
    } else {
      createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        rewardType,
        screenTimeReward,
        moneyReward,
        unit,
        unitRate,
        icon,
      });
    }

    setShowModal(false);
  };

  const renderIcon = (iconName: string) => {
    const found = availableIcons.find((i) => i.name === iconName);
    const Comp = found ? found.icon : Sparkles;
    return <Comp className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            <span>Oppgavebank & Satser</span>
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            Definer hvilke oppgaver barna kan velge og hvor mye de skal belønnes med
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Opprett nytt oppdrag</span>
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {renderIcon(task.icon)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base">{task.title}</h4>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {task.category === 'reading'
                        ? 'Lesing'
                        : task.category === 'writing'
                        ? 'Skriving'
                        : 'Husarbeid'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Rediger oppgave"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Slett oppgave"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-xs text-slate-500 font-medium my-2 bg-slate-50 p-2.5 rounded-xl">
                  {task.description}
                </p>
              )}
            </div>

            {/* Reward badges */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">{task.unit}</span>
              <div className="flex items-center gap-2">
                {(task.rewardType === 'choice' || task.rewardType === 'screen_time') && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-black">
                    <Tv className="w-3.5 h-3.5" />
                    <span>+{task.screenTimeReward}m</span>
                  </span>
                )}
                {(task.rewardType === 'choice' || task.rewardType === 'money') && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{task.moneyReward}kr</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-800 mb-4">
              {editingTask ? 'Rediger oppgave' : 'Opprett nytt oppdrag'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Oppgavetittel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="F.eks. Lufte hunden, vaske bilen..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Beskrivelse / veiledning
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Hva skal gjøres for at oppgaven godkjennes?"
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="chore">Husarbeid / Plikter</option>
                    <option value="reading">Lesing</option>
                    <option value="writing">Skriving</option>
                    <option value="custom">Tilpasset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Belønningstype
                  </label>
                  <select
                    value={rewardType}
                    onChange={(e) => setRewardType(e.target.value as RewardType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="choice">Fritt valg (Tid el. Penger)</option>
                    <option value="screen_time">Kun Skjermtid</option>
                    <option value="money">Kun Penger</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Skjermtid (min)
                  </label>
                  <input
                    type="number"
                    value={screenTimeReward}
                    onChange={(e) => setScreenTimeReward(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Penger (kr)
                  </label>
                  <input
                    type="number"
                    value={moneyReward}
                    onChange={(e) => setMoneyReward(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Enhet / Rate
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="F.eks. 'per gang', 'per 15 min', 'per rom'..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Velg ikon
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setIcon(item.name)}
                      className={`p-2.5 rounded-xl border-2 flex items-center justify-center transition-all ${
                        icon === item.name
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                >
                  {editingTask ? 'Oppdater oppgave' : 'Opprett oppgave'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
