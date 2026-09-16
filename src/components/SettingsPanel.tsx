import React from 'react';
import { CalculationConfig, DigitsCount, OperationMode } from '../types';
import { playKeySound } from '../utils/sound';
import { Play, Sparkles, Sliders, ShieldCheck, Zap, Volume2, VolumeX, BarChart2 } from 'lucide-react';

interface SettingsPanelProps {
  config: CalculationConfig;
  onChangeConfig: (newConfig: CalculationConfig) => void;
  onStart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
}

const CASES_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const DIGITS_OPTIONS: DigitsCount[] = [1, 2, 3, 4, 5, 6];
const INTERVAL_PRESETS = [
  { val: 0.1, label: '0.1s Matrix Master' },
  { val: 0.2, label: '0.2s Lightning' },
  { val: 0.3, label: '0.3s Fast (Default)' },
  { val: 0.5, label: '0.5s Moderate' },
  { val: 0.8, label: '0.8s Relaxed' },
  { val: 1.0, label: '1.0s Training' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  config,
  onChangeConfig,
  onStart,
  soundEnabled,
  onToggleSound,
  onOpenStats,
}) => {
  const handleDigitSelect = (digits: DigitsCount) => {
    playKeySound();
    onChangeConfig({ ...config, digits });
  };

  const handleCasesSelect = (casesCount: number) => {
    playKeySound();
    onChangeConfig({ ...config, casesCount });
  };

  const handleModeSelect = (operationMode: OperationMode) => {
    playKeySound();
    onChangeConfig({ ...config, operationMode });
  };

  const handleIntervalChange = (val: number) => {
    playKeySound();
    const clamped = Math.min(1.0, Math.max(0.1, Math.round(val * 10) / 10));
    onChangeConfig({ ...config, intervalSeconds: clamped });
  };

  const totalTime = (config.casesCount * config.intervalSeconds).toFixed(1);

  return (
    <div id="settings-panel" className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 md:py-8">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-purple-800/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-white font-display-cyber glow-purple-sm">
                FLASH CALCULATION
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/40 text-purple-300">
                v2.0 // PURPLE MATRIX
              </span>
            </div>
            <p className="text-xs text-purple-300/70 font-mono">
              High-speed mental arithmetic & abacus flash engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-stats-btn"
            onClick={onOpenStats}
            title="Practice History & Stats"
            className="p-2 rounded bg-purple-950/70 border border-purple-700/50 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-900/60 transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Matrix Audio' : 'Unmute Matrix Audio'}
            className="p-2 rounded bg-purple-950/70 border border-purple-700/50 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-900/60 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-purple-500/60" />}
          </button>
        </div>
      </div>

      {/* Main Terminal Frame */}
      <div className="bg-[#0b0416]/85 backdrop-blur-md border border-purple-500/40 rounded-xl p-5 md:p-7 shadow-[0_0_30px_rgba(168,85,247,0.18)] relative overflow-hidden">
        {/* Terminal Corner Decors */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

        <div className="space-y-6">
          {/* STEP 1: # of Digits */}
          <section id="section-digits" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-purple-300 font-mono">
                <span className="text-purple-400 font-bold">[01]</span>
                <span>SELECT NUMBER OF DIGITS</span>
              </div>
              <span className="text-xs text-purple-400/80 font-mono">
                {config.digits === 1
                  ? 'Range: 1 – 9'
                  : `Range: ${Math.pow(10, config.digits - 1).toLocaleString()} – ${(Math.pow(10, config.digits) - 1).toLocaleString()}`}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DIGITS_OPTIONS.map((d) => {
                const isSelected = config.digits === d;
                return (
                  <button
                    key={d}
                    id={`digit-btn-${d}`}
                    onClick={() => handleDigitSelect(d)}
                    className={`py-3 px-2 rounded-lg font-mono text-center transition-all border ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(192,132,252,0.4)] ring-1 ring-purple-400'
                        : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:border-purple-600 hover:text-white hover:bg-purple-900/30'
                    }`}
                  >
                    <div className="text-lg font-bold font-display-cyber">{d}</div>
                    <div className="text-[10px] text-purple-400/70 uppercase">
                      {d === 1 ? 'Digit' : 'Digits'}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: Number of Cases (Multiples of 5: 5 till 50) */}
          <section id="section-cases" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-purple-300 font-mono">
                <span className="text-purple-400 font-bold">[02]</span>
                <span>NUMBER OF CASES (MULTIPLES OF 5)</span>
              </div>
              <span className="text-xs font-mono text-purple-300">
                Selected: <strong className="text-purple-300 font-bold">{config.casesCount} numbers</strong>
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {CASES_OPTIONS.map((c) => {
                const isSelected = config.casesCount === c;
                return (
                  <button
                    key={c}
                    id={`cases-btn-${c}`}
                    onClick={() => handleCasesSelect(c)}
                    className={`py-2 px-1 rounded font-mono text-center text-sm transition-all border ${
                      isSelected
                        ? 'bg-purple-600/40 border-purple-400 text-white shadow-[0_0_12px_rgba(192,132,252,0.5)] font-bold'
                        : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:border-purple-600 hover:text-white hover:bg-purple-900/30'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3: Operation Mode */}
          <section id="section-mode" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-purple-300 font-mono">
                <span className="text-purple-400 font-bold">[03]</span>
                <span>OPERATION MODE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="mode-addition-btn"
                onClick={() => handleModeSelect('addition')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  config.operationMode === 'addition'
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(192,132,252,0.35)] ring-1 ring-purple-400'
                    : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:border-purple-600 hover:bg-purple-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold font-mono tracking-wide flex items-center gap-1.5">
                    <span className="text-purple-400 text-base font-bold">+</span>
                    PURELY ADDITION
                  </span>
                  {config.operationMode === 'addition' && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_#c084fc]" />
                  )}
                </div>
                <p className="text-xs text-purple-300/70 font-mono">
                  All generated cases are positive integers to sum continuously.
                </p>
              </button>

              <button
                id="mode-addition-subtraction-btn"
                onClick={() => handleModeSelect('addition_subtraction')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  config.operationMode === 'addition_subtraction'
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(192,132,252,0.35)] ring-1 ring-purple-400'
                    : 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:border-purple-600 hover:bg-purple-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold font-mono tracking-wide flex items-center gap-1.5">
                    <span className="text-purple-400 text-base font-bold">±</span>
                    ADDITION WITH SUBTRACTION
                  </span>
                  {config.operationMode === 'addition_subtraction' && (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_#c084fc]" />
                  )}
                </div>
                <p className="text-xs text-purple-300/70 font-mono">
                  Mixed addition & subtraction cases (e.g. 7, 9, -4, -6...).
                </p>
              </button>
            </div>
          </section>

          {/* STEP 4: Interval Time (0.1s to 1.0s) */}
          <section id="section-interval" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-purple-300 font-mono">
                <span className="text-purple-400 font-bold">[04]</span>
                <span>FLASH INTERVAL (0.1s – 1.0s)</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs text-purple-400/80">Each Number:</span>
                <span className="text-base font-bold text-white font-mono bg-purple-900/80 px-2 py-0.5 rounded border border-purple-500/50 glow-purple-sm">
                  {config.intervalSeconds.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                id="interval-slider"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={config.intervalSeconds}
                onChange={(e) => handleIntervalChange(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400 border border-purple-700/60"
              />
              <div className="flex justify-between text-[11px] text-purple-400/60 font-mono">
                <span>0.1s (Fastest)</span>
                <span>0.5s (Standard)</span>
                <span>1.0s (Relaxed)</span>
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {INTERVAL_PRESETS.map((preset) => {
                const isSelected = Math.abs(config.intervalSeconds - preset.val) < 0.01;
                return (
                  <button
                    key={preset.val}
                    id={`preset-${preset.val * 10}`}
                    onClick={() => handleIntervalChange(preset.val)}
                    className={`py-1.5 px-2 rounded text-xs font-mono border transition-all ${
                      isSelected
                        ? 'bg-purple-600/40 border-purple-400 text-white shadow-[0_0_10px_rgba(192,132,252,0.4)]'
                        : 'bg-purple-950/30 border-purple-800/40 text-purple-300/80 hover:text-white hover:border-purple-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Configuration Summary Banner */}
          <div className="bg-purple-950/50 border border-purple-700/40 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-purple-300">
            <div className="flex items-center gap-3">
              <div className="text-purple-400 font-bold uppercase tracking-wider">Parameters:</div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/30">
                  {config.digits} {config.digits === 1 ? 'digit' : 'digits'}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/30">
                  {config.casesCount} cases
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/30">
                  {config.operationMode === 'addition' ? 'Add only' : 'Add & Sub'}
                </span>
              </div>
            </div>

            <div className="text-purple-300 flex items-center gap-1.5">
              <span>Estimated Flash Duration:</span>
              <strong className="text-white font-bold">{totalTime}s</strong>
            </div>
          </div>

          {/* Start Button */}
          <button
            id="start-calculation-btn"
            onClick={onStart}
            className="w-full group relative py-4 px-6 rounded-xl font-display-cyber text-lg md:text-xl font-bold tracking-widest text-white transition-all overflow-hidden border border-purple-400 bg-gradient-to-r from-purple-800 via-purple-600 to-fuchsia-700 hover:from-purple-700 hover:via-purple-500 hover:to-fuchsia-600 shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(192,132,252,0.8)] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Play className="w-6 h-6 fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span>START CALCULATION</span>
            <span className="text-xs font-mono font-normal opacity-80 border border-white/30 px-2 py-0.5 rounded">
              [ENTER]
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
