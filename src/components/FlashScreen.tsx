import React, { useEffect, useState, useRef } from 'react';
import { CalculationConfig, CaseNumber } from '../types';
import { playCountdownTick, playCountdownGo, playFlashBlip } from '../utils/sound';
import { X, Volume2, VolumeX } from 'lucide-react';

interface FlashScreenProps {
  config: CalculationConfig;
  sequence: CaseNumber[];
  onComplete: () => void;
  onAbort: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const FlashScreen: React.FC<FlashScreenProps> = ({
  config,
  sequence,
  onComplete,
  onAbort,
  soundEnabled,
  onToggleSound,
}) => {
  // Phase inside flash screen: 'countdown' | 'flashing'
  const [countdown, setCountdown] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // 1. Countdown timer
  useEffect(() => {
    let count = 3;
    playCountdownTick();

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playCountdownTick();
      } else if (count === 0) {
        setCountdown(0); // "READY / GO"
        playCountdownGo();
      } else {
        clearInterval(timer);
        setIsFlashing(true);
        setCurrentIndex(0);
      }
    }, 750);

    return () => clearInterval(timer);
  }, []);

  // 2. Flashing numbers loop
  useEffect(() => {
    if (!isFlashing) return;

    // Play first blip immediately
    if (sequence.length > 0) {
      playFlashBlip(sequence[0].isNegative, 0);
    }

    const intervalMs = config.intervalSeconds * 1000;
    let step = 0;

    intervalRef.current = window.setInterval(() => {
      step += 1;
      if (step < sequence.length) {
        setCurrentIndex(step);
        playFlashBlip(sequence[step].isNegative, step);
      } else {
        // Sequence finished!
        if (intervalRef.current) clearInterval(intervalRef.current);
        // Small buffer before moving to input screen so user can absorb last number
        setTimeout(() => {
          onComplete();
        }, Math.min(250, intervalMs));
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isFlashing, sequence, config.intervalSeconds, onComplete]);

  // Keyboard shortcut ESC to abort
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onAbort();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAbort]);

  const currentCase = currentIndex >= 0 && currentIndex < sequence.length ? sequence[currentIndex] : null;
  const progressPercent =
    currentIndex >= 0 ? Math.round(((currentIndex + 1) / sequence.length) * 100) : 0;

  return (
    <div id="flash-screen" className="relative z-10 w-full h-[85vh] max-w-4xl mx-auto flex flex-col justify-between px-4 py-6 select-none">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between border-b border-purple-800/60 pb-3 font-mono text-xs text-purple-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span className="font-bold text-white tracking-widest uppercase">
              {isFlashing ? 'TRANSMITTING STREAM' : 'INITIALIZING BUFFER'}
            </span>
          </div>
          <span className="hidden sm:inline-block text-purple-400/60">|</span>
          <span className="hidden sm:inline-block text-purple-400/80">
            {config.digits} DIGIT • {config.casesCount} CASES • {config.intervalSeconds}s INTERVAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded bg-purple-950/70 border border-purple-700/50 hover:border-purple-400 text-purple-300 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-purple-500/50" />}
          </button>
          <button
            id="abort-flash-btn"
            onClick={onAbort}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/70 border border-purple-700/50 hover:border-red-400/80 hover:bg-red-950/40 text-purple-300 hover:text-red-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>ABORT [ESC]</span>
          </button>
        </div>
      </div>

      {/* Center Presentation Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-4">
        {/* Countdown Stage */}
        {!isFlashing && (
          <div className="text-center space-y-4">
            <div className="text-xs font-mono tracking-widest text-purple-400/80 uppercase">
              CALCULATION COMMENCES IN
            </div>
            <div
              key={countdown}
              className="text-8xl md:text-9xl font-extrabold font-display-cyber text-white glow-purple-lg animate-scale"
            >
              {countdown > 0 ? countdown : 'GO!'}
            </div>
            <div className="text-xs font-mono text-purple-300/60">
              Clear your mind • Keep your mental accumulator ready
            </div>
          </div>
        )}

        {/* Flashing Number Display */}
        {isFlashing && currentCase && (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center relative">
            {/* Cyber Brackets Frame */}
            <div className="w-full relative py-12 md:py-16 px-6 rounded-2xl bg-[#0e041c]/90 border-2 border-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.35)] flex flex-col items-center justify-center">
              {/* Corner decorative anchors */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-fuchsia-400" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-fuchsia-400" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-fuchsia-400" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-fuchsia-400" />

              {/* Case Index Tracker */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-purple-400/80">
                <span className="tracking-wider font-semibold">
                  CASE #{String(currentCase.index + 1).padStart(2, '0')} OF {sequence.length}
                </span>
                <span className="tracking-wider">
                  {currentCase.isNegative ? (
                    <span className="text-fuchsia-400 font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-fuchsia-950/80 border border-fuchsia-500/60">
                      SUBTRACTION [-]
                    </span>
                  ) : (
                    <span className="text-purple-300 uppercase tracking-widest px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40">
                      ADDITION [+]
                    </span>
                  )}
                </span>
              </div>

              {/* THE NUMBER ITSELF */}
              <div
                key={currentCase.index}
                className={`font-mono font-extrabold tracking-tight select-none transition-transform duration-75 flex items-center justify-center ${
                  currentCase.isNegative
                    ? 'text-fuchsia-300 glow-purple-lg'
                    : 'text-white glow-purple-lg'
                } ${
                  config.digits === 1
                    ? 'text-7xl sm:text-8xl md:text-9xl'
                    : config.digits <= 3
                    ? 'text-6xl sm:text-7xl md:text-8xl'
                    : config.digits <= 5
                    ? 'text-5xl sm:text-6xl md:text-7xl'
                    : 'text-4xl sm:text-5xl md:text-6xl'
                }`}
              >
                {currentCase.displayString}
              </div>

              {/* Sub-label sign guide for high speed clarity */}
              <div className="absolute bottom-3 text-[11px] font-mono tracking-widest text-purple-400/60">
                {currentCase.isNegative ? 'OPERATOR: MINUS' : 'OPERATOR: PLUS'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar & Stream Counter */}
      <div className="space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs text-purple-300">
          <span>PROGRESS</span>
          <span>
            {currentIndex >= 0 ? `${currentIndex + 1} / ${sequence.length}` : '0 / ' + sequence.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-purple-950 border border-purple-800/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 transition-all duration-100 shadow-[0_0_10px_rgba(232,121,249,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
