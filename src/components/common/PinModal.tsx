import React, { useState } from 'react';
import { useFamily } from '../../store/FamilyContext';
import { Lock, X, Delete, AlertCircle } from 'lucide-react';

interface PinModalProps {
  title?: string;
  description?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  title = 'Tast inn foreldrekode',
  description = 'Tast inn din 4-sifrede PIN-kode.',
  onSuccess,
  onClose,
}) => {
  const { state } = useFamily();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        // Validate PIN
        setTimeout(() => {
          if (newPin === state.parentPin) {
            onSuccess();
          } else {
            setError(true);
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <p className="text-sm font-semibold text-slate-500 mt-1 max-w-xs">{description}</p>

          {/* PIN Indicators */}
          <div className="flex gap-4 my-6">
            {[0, 1, 2, 3].map((index) => {
              const filled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    error
                      ? 'bg-rose-500 scale-110 animate-shake'
                      : filled
                      ? 'bg-blue-600 scale-125'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold mb-3 animate-bounce">
              <AlertCircle className="w-4 h-4" />
              <span>Feil PIN-kode! Standard er 1234.</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigit(digit)}
                className="h-16 rounded-2xl bg-slate-100/80 hover:bg-slate-200 active:bg-blue-100 active:text-blue-700 text-2xl font-black text-slate-800 transition-all active:scale-95 shadow-sm flex items-center justify-center"
              >
                {digit}
              </button>
            ))}

            <button
              onClick={handleClear}
              className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-500 transition-all active:scale-95 flex items-center justify-center"
            >
              Nullstill
            </button>

            <button
              onClick={() => handleDigit('0')}
              className="h-16 rounded-2xl bg-slate-100/80 hover:bg-slate-200 active:bg-blue-100 active:text-blue-700 text-2xl font-black text-slate-800 transition-all active:scale-95 shadow-sm flex items-center justify-center"
            >
              0
            </button>

            <button
              onClick={handleDelete}
              className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all active:scale-95 flex items-center justify-center"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
