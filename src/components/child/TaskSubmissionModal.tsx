import React, { useState } from 'react';
import { ChildProfile, TaskCategory, TaskDefinition } from '../../types';
import { useFamily } from '../../store/FamilyContext';
import confetti from 'canvas-confetti';
import {
  X,
  BookOpen,
  Pencil,
  Sparkles,
  Tv,
  Coins,
  CheckCircle2,
  Send,
  Plus,
  Minus,
  UtensilsCrossed,
  Trash2,
  Heart,
  FileText,
  BookMarked,
} from 'lucide-react';

interface TaskSubmissionModalProps {
  child: ChildProfile;
  onClose: () => void;
}

export const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({ child, onClose }) => {
  const { state, submitTask } = useFamily();

  // Mode: category selection vs details
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('reading');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>('task-reading-time');

  // Form states
  const [readingMinutes, setReadingMinutes] = useState<number>(15);
  const [bookTitle, setBookTitle] = useState<string>('');

  const [writingMode, setWritingMode] = useState<'editor' | 'count'>('editor');
  const [writingText, setWritingText] = useState<string>('');
  const [manualWordCount, setManualWordCount] = useState<number>(50);

  const choreQuantity = 1;
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDetails, setCustomDetails] = useState<string>('');

  // Reward type choice
  const [chosenRewardType, setChosenRewardType] = useState<'screen_time' | 'money'>('screen_time');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const currentTask: TaskDefinition | undefined = state.tasks.find((t) => t.id === selectedTaskId);

  // Word count calculation
  const wordsInText = writingText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // Calculate rewards dynamically
  let calculatedQuantity = 1;
  let unitLabel = 'oppgave';
  let title = 'Fullført oppgave';
  let details = '';

  if (selectedCategory === 'reading') {
    calculatedQuantity = readingMinutes;
    unitLabel = 'minutter';
    title = currentTask ? currentTask.title : 'Leseøkt';
    details = bookTitle ? `Bok: "${bookTitle}"` : 'Egenlesing';
  } else if (selectedCategory === 'writing') {
    calculatedQuantity = writingMode === 'editor' ? Math.max(wordsInText, 1) : manualWordCount;
    unitLabel = 'ord';
    title = currentTask ? currentTask.title : 'Skriveøkt';
    details =
      writingMode === 'editor'
        ? writingText.length > 60
          ? `${writingText.substring(0, 60)}... (${wordsInText} ord)`
          : `Tekst (${wordsInText} ord)`
        : `${manualWordCount} ord skrevet`;
  } else if (selectedCategory === 'chore') {
    calculatedQuantity = choreQuantity;
    unitLabel = currentTask?.unit || 'gang';
    title = currentTask ? currentTask.title : 'Husarbeid';
    details = currentTask?.description || 'Fullført oppdrag';
  } else {
    calculatedQuantity = 1;
    unitLabel = 'oppdrag';
    title = customTitle.trim() || 'Eget oppdrag';
    details = customDetails.trim();
  }

  // Calculate final reward value
  let rewardRate = 1;
  if (currentTask) {
    const rate = currentTask.unitRate || 1;
    const baseReward =
      chosenRewardType === 'screen_time' ? currentTask.screenTimeReward : currentTask.moneyReward;
    rewardRate = (calculatedQuantity / rate) * baseReward;
  } else {
    // Custom task default: 15 min or 15 kr
    rewardRate = 15;
  }

  const finalRewardAmount = Math.max(1, Math.round(rewardRate));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitTask({
      childId: child.id,
      taskId: selectedTaskId || undefined,
      category: selectedCategory,
      title,
      details,
      quantity: calculatedQuantity,
      unitLabel,
      chosenRewardType,
      calculatedReward: finalRewardAmount,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignorer confetti-feil
    }

    setIsSubmitted(true);
  };

  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'BookMarked':
        return <BookMarked className="w-5 h-5" />;
      case 'Pencil':
        return <Pencil className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'Trash2':
        return <Trash2 className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-lg shadow-emerald-500/20">
              🎉
            </div>
            <h3 className="text-2xl font-black text-slate-800">Kjempebra jobbet, {child.name}!</h3>
            <p className="text-slate-600 text-sm max-w-sm mx-auto font-medium">
              Oppgaven din er nå sendt inn. Så snart en voksen godkjenner den, får du{' '}
              <span className="font-extrabold text-blue-600">
                +{finalRewardAmount}{' '}
                {chosenRewardType === 'screen_time' ? 'skjermminutter' : 'kroner'}
              </span>{' '}
              rett inn i banken din!
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-base shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
              >
                Flott, lukk vinduet!
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                <span>Registrering for {child.name}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Hva har du gjort?</h3>
            </div>

            {/* Category Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('reading');
                  setSelectedTaskId('task-reading-time');
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-black transition-all ${
                  selectedCategory === 'reading'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>Lesing</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('writing');
                  setSelectedTaskId('task-writing-story');
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-black transition-all ${
                  selectedCategory === 'writing'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pencil className="w-5 h-5 text-pink-500" />
                <span>Skriving</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('chore');
                  setSelectedTaskId('task-chore-tidy-room');
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-black transition-all ${
                  selectedCategory === 'chore'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>Oppdrag</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('custom');
                  setSelectedTaskId(null);
                }}
                className={`py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-black transition-all ${
                  selectedCategory === 'custom'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-5 h-5 text-purple-500" />
                <span>Eget</span>
              </button>
            </div>

            {/* Category Specific Input Fields */}
            {selectedCategory === 'reading' && (
              <div className="space-y-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Hvor mange minutter har du lest?
                  </label>
                  <div className="flex items-center gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setReadingMinutes(mins)}
                        className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${
                          readingMinutes === mins
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>

                  {/* Plus / Minus for fine tuning */}
                  <div className="flex items-center justify-between mt-3 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600">Tilpass minutter:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setReadingMinutes((prev) => Math.max(5, prev - 5))}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-base text-slate-800 w-12 text-center">
                        {readingMinutes} m
                      </span>
                      <button
                        type="button"
                        onClick={() => setReadingMinutes((prev) => prev + 5)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Boktittel eller hva du leste (valgfritt)
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="F.eks. Harry Potter, Donald Duck, Hundemannen..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold text-sm bg-white"
                  />
                </div>
              </div>
            )}

            {selectedCategory === 'writing' && (
              <div className="space-y-4 bg-pink-50/50 p-4 rounded-2xl border border-pink-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700">Skrivemetode</span>
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setWritingMode('editor')}
                      className={`px-3 py-1 rounded-lg ${
                        writingMode === 'editor'
                          ? 'bg-pink-500 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Skriv her
                    </button>
                    <button
                      type="button"
                      onClick={() => setWritingMode('count')}
                      className={`px-3 py-1 rounded-lg ${
                        writingMode === 'count'
                          ? 'bg-pink-500 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tast antall ord
                    </button>
                  </div>
                </div>

                {writingMode === 'editor' ? (
                  <div>
                    <textarea
                      value={writingText}
                      onChange={(e) => setWritingText(e.target.value)}
                      placeholder="Skriv fortellingen din, dagboken eller leksene her..."
                      rows={4}
                      className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium text-sm bg-white resize-none"
                    />
                    <div className="flex justify-between items-center text-xs font-bold text-pink-700 mt-1">
                      <span>Du har skrevet: {wordsInText} ord</span>
                      <span>Belønning: ca. {Math.max(1, Math.round((wordsInText / 50) * 15))} poeng</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Hvor mange ord har du skrevet?
                    </label>
                    <div className="flex items-center gap-2">
                      {[25, 50, 100, 150].map((words) => (
                        <button
                          key={words}
                          type="button"
                          onClick={() => setManualWordCount(words)}
                          className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${
                            manualWordCount === words
                              ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
                          }`}
                        >
                          {words} ord
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedCategory === 'chore' && (
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 max-h-56 overflow-y-auto">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Velg oppgave du har fullført:
                </label>
                <div className="space-y-2">
                  {state.tasks
                    .filter((t) => t.category === 'chore')
                    .map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          selectedTaskId === task.id
                            ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-200'
                            : 'bg-white/80 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            {getTaskIcon(task.icon)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-sm">{task.title}</h4>
                            <p className="text-[11px] text-slate-500">{task.description}</p>
                          </div>
                        </div>

                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shrink-0">
                          +{task.screenTimeReward}p
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {selectedCategory === 'custom' && (
              <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-200/60">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Hva har du gjort?
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="F.eks. Hjulpne bestemor i hagen, øvd på piano..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Beskrivelse (valgfritt)
                  </label>
                  <input
                    type="text"
                    value={customDetails}
                    onChange={(e) => setCustomDetails(e.target.value)}
                    placeholder="Hvor lenge, hva gjorde du?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-sm bg-white"
                  />
                </div>
              </div>
            )}

            {/* Reward Type Selection (Screen time OR Money) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2">
                Velg hva du vil ha som belønning:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChosenRewardType('screen_time')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    chosenRewardType === 'screen_time'
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200 text-blue-900'
                      : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-500">Skjermtid</p>
                      <p className="font-black text-lg text-blue-700">+{finalRewardAmount} min</p>
                    </div>
                  </div>
                  {chosenRewardType === 'screen_time' && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setChosenRewardType('money')}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    chosenRewardType === 'money'
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-500">Penger</p>
                      <p className="font-black text-lg text-emerald-700">+{finalRewardAmount} kr</p>
                    </div>
                  </div>
                  {chosenRewardType === 'money' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-base shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Send inn til godkjenning ({finalRewardAmount} {chosenRewardType === 'screen_time' ? 'min' : 'kr'})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
