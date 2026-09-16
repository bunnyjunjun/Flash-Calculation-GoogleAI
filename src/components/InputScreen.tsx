import React, { useState, useEffect, useRef } from 'react';
import { CalculationConfig } from '../types';
import { playKeySound } from '../utils/sound';
import { Check, Delete, ArrowRight, CornerDownLeft } from 'lucide-react';

interface InputScreenProps {
  config: CalculationConfig;
  onSubmitAnswer: (answer: number) => void;
  onCancel: () => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  config,
  onSubmitAnswer,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input automatically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleDigit = (char: string) => {
    playKeySound();
    setErrorMsg(null);
    if (char === '-') {
      if (inputValue === '') {
        setInputValue('-');
      } else if (inputValue.startsWith('-')) {
        setInputValue(inputValue.slice(1));
      } else {
        setInputValue('-' + inputValue);
      }
      return;
    }

    if (inputValue.length >= 12) return;
    setInputValue((prev) => (prev === '0' ? char : prev + char));
  };

  const handleBackspace = () => {
    playKeySound();
    setErrorMsg(null);
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playKeySound();
    setErrorMsg(null);
    setInputValue('');
  };

  const handleSubmit = () => {
    if (inputValue.trim() === '' || inputValue === '-') {
      setErrorMsg('Please enter your calculated sum');
      return;
    }
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) {
      setErrorMsg('Invalid number entered');
      return;
    }
    onSubmitAnswer(num);
  };

  // Keyboard events listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '-') {
        handleDigit('-');
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div id="input-screen" className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 select-none">
      {/* Container Frame */}
      <div className="bg-[#0c0418]/90 backdrop-blur-md border border-purple-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(168,85,247,0.25)] relative overflow-hidden">
        {/* Terminal Corner Decors */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-xs font-mono text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            STREAM COMPLETE • {config.casesCount} CASES ACCUMULATED
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display-cyber text-white glow-purple-sm tracking-wide">
            ENTER YOUR FINAL SUM
          </h2>
          <p className="text-xs text-purple-300/70 font-mono">
            Type your calculation result using the numpad or physical keyboard
          </p>
        </div>

        {/* Input Field Display */}
        <div className="mb-6 space-y-2">
          <div
            onClick={() => inputRef.current?.focus()}
            className="w-full relative flex items-center justify-center py-4 px-6 rounded-xl bg-purple-950/60 border-2 border-purple-400/80 shadow-[0_0_20px_rgba(192,132,252,0.3)] cursor-text min-h-[72px]"
          >
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                if (/^-?\d*$/.test(val)) {
                  setInputValue(val);
                  setErrorMsg(null);
                }
              }}
              className="sr-only"
              autoFocus
            />
            <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white glow-purple-md tracking-wider">
              {inputValue ? (
                inputValue
              ) : (
                <span className="text-purple-600/60 animate-pulse font-mono font-light text-3xl sm:text-4xl">
                  _?
                </span>
              )}
            </span>
          </div>

          {errorMsg && (
            <p className="text-center text-xs font-mono text-rose-400 animate-bounce">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Cyber Numpad */}
        <div className="space-y-2 mb-6">
          <div className="grid grid-cols-3 gap-2">
            {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((digit) => (
              <button
                key={digit}
                id={`numpad-btn-${digit}`}
                onClick={() => handleDigit(digit)}
                className="py-3 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 hover:border-purple-400 text-white font-mono text-xl font-bold transition-all active:scale-95 shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              id="numpad-btn-minus"
              onClick={() => handleDigit('-')}
              className="py-3 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 hover:border-purple-400 text-purple-300 font-mono text-xl font-bold transition-all active:scale-95"
            >
              ±
            </button>
            <button
              id="numpad-btn-0"
              onClick={() => handleDigit('0')}
              className="py-3 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 hover:border-purple-400 text-white font-mono text-xl font-bold transition-all active:scale-95"
            >
              0
            </button>
            <button
              id="numpad-btn-backspace"
              onClick={handleBackspace}
              className="py-3 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 hover:border-purple-400 text-purple-300 font-mono text-base font-bold flex items-center justify-center transition-all active:scale-95"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Submit & Cancel Actions */}
        <div className="flex gap-3">
          <button
            id="cancel-input-btn"
            onClick={onCancel}
            className="w-1/3 py-3 rounded-xl border border-purple-800/60 bg-purple-950/40 text-purple-300 hover:text-white hover:border-purple-500 font-mono text-sm transition-colors"
          >
            CANCEL [ESC]
          </button>
          <button
            id="submit-answer-btn"
            onClick={handleSubmit}
            className="w-2/3 py-3 rounded-xl font-display-cyber text-base font-bold tracking-wider text-white transition-all border border-purple-400 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 active:scale-98"
          >
            <span>CONFIRM SUM</span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
