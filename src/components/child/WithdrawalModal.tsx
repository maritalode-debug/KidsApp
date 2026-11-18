import React, { useState } from 'react';
import { ChildProfile } from '../../types';
import { useFamily } from '../../store/FamilyContext';
import { PinModal } from '../common/PinModal';
import { X, Tv, Coins, ArrowDownToLine, AlertCircle } from 'lucide-react';

interface WithdrawalModalProps {
  child: ChildProfile;
  onClose: () => void;
  onStartTimer: (minutes: number) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  child,
  onClose,
  onStartTimer,
}) => {
  const { withdrawReward } = useFamily();

  const [withdrawType, setWithdrawType] = useState<'screen_time' | 'money'>('screen_time');
  const [amount, setAmount] = useState<number>(15);
  const [description, setDescription] = useState<string>('Spilling på iPad / Roblox');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const availableBalance =
    withdrawType === 'screen_time' ? child.screenTimeMinutes : child.moneyBalance;

  const quickMinutes = [15, 30, 45, 60].filter((m) => m <= child.screenTimeMinutes);
  const quickMoney = [10, 20, 50, 100].filter((m) => m <= child.moneyBalance);

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (amount <= 0) {
      setErrorMsg('Beløpet må være større enn 0');
      return;
    }

    if (amount > availableBalance) {
      setErrorMsg(
        `Du har bare ${availableBalance} ${
          withdrawType === 'screen_time' ? 'minutter' : 'kroner'
        } tilgjengelig!`
      );
      return;
    }

    // Require Parent PIN to finalize withdrawal
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);

    const ok = withdrawReward(
      child.id,
      withdrawType,
      amount,
      description.trim() ||
        (withdrawType === 'screen_time' ? 'Uttak av skjermtid' : 'Utbetaling av lommepenger')
    );

    if (ok) {
      setSuccess(true);
      if (withdrawType === 'screen_time') {
        setTimeout(() => {
          onClose();
          onStartTimer(amount);
        }, 1200);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-lg shadow-emerald-500/20">
                {withdrawType === 'screen_time' ? '🎮' : '💰'}
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                Uttak godkjent for {child.name}!
              </h3>
              <p className="text-slate-600 text-sm max-w-xs mx-auto font-medium">
                {withdrawType === 'screen_time'
                  ? `Du har tatt ut ${amount} minutter skjermtid. Starter nedtellingstimeren nå!`
                  : `Forelder har godkjent utbetaling av ${amount} kr.`}
              </p>

              {withdrawType === 'money' && (
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-md mt-4"
                >
                  Ferdig, lukk vinduet
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleInitiate} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <span>Uttak for {child.name}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800">Hva vil du ta ut?</h3>
              </div>

              {/* Type selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawType('screen_time');
                    setAmount(Math.min(15, child.screenTimeMinutes));
                    setDescription('Spilling / Skjermtid');
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    withdrawType === 'screen_time'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-md ring-2 ring-blue-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <Tv className="w-6 h-6 text-blue-600" />
                  <span className="font-black text-sm">Skjermtid</span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Saldo: {child.screenTimeMinutes} min
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWithdrawType('money');
                    setAmount(Math.min(20, child.moneyBalance));
                    setDescription('Lommepenger / Kjøp');
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                    withdrawType === 'money'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md ring-2 ring-emerald-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  <Coins className="w-6 h-6 text-emerald-600" />
                  <span className="font-black text-sm">Lommepenger</span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Saldo: {child.moneyBalance} kr
                  </span>
                </button>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Velg antall {withdrawType === 'screen_time' ? 'minutter' : 'kroner'}:
                </label>

                {/* Quick Chips */}
                <div className="flex gap-2 mb-3">
                  {(withdrawType === 'screen_time' ? quickMinutes : quickMoney).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                        amount === val
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {val} {withdrawType === 'screen_time' ? 'min' : 'kr'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    min={1}
                    max={availableBalance}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-base font-black text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="font-extrabold text-slate-500 text-sm">
                    {withdrawType === 'screen_time' ? 'minutter' : 'kroner'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Hva skal det brukes til? (valgfritt)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="F.eks. Roblox, YouTube, Lørdagsgodt..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={availableBalance === 0 || amount > availableBalance}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownToLine className="w-5 h-5" />
                <span>
                  Ta ut {amount} {withdrawType === 'screen_time' ? 'min' : 'kr'} (krever PIN)
                </span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forelder-PIN bekreftelse før uttak */}
      {showPinModal && (
        <PinModal
          title="Bekreft uttak"
          description={`Forelder må taste PIN for å bekrefte uttak av ${amount} ${
            withdrawType === 'screen_time' ? 'skjermminutter' : 'kroner'
          } for ${child.name}.`}
          onSuccess={handlePinSuccess}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </>
  );
};
