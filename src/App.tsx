import React, { useState, useEffect, useCallback } from 'react';
import { CalculationConfig, CaseNumber, GamePhase, GameResult, UserStats } from './types';
import { generateCalculationSequence } from './utils/generator';
import { getSoundEnabled, setSoundEnabled } from './utils/sound';
import { MatrixBackground } from './components/MatrixBackground';
import { SettingsPanel } from './components/SettingsPanel';
import { FlashScreen } from './components/FlashScreen';
import { InputScreen } from './components/InputScreen';
import { ResultScreen } from './components/ResultScreen';
import { StatsModal } from './components/StatsModal';

const STATS_STORAGE_KEY = 'flash_calc_stats_v2';

const DEFAULT_CONFIG: CalculationConfig = {
  digits: 1,
  casesCount: 10,
  operationMode: 'addition_subtraction',
  intervalSeconds: 0.3,
};

function loadStoredStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    totalAttempts: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    records: [],
  };
}

export default function App() {
  const [config, setConfig] = useState<CalculationConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<GamePhase>('config');
  const [sequence, setSequence] = useState<CaseNumber[]>([]);
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [soundEnabled, setSoundState] = useState<boolean>(getSoundEnabled());
  const [showStats, setShowStats] = useState<boolean>(false);
  const [stats, setStats] = useState<UserStats>(loadStoredStats);

  // Synchronize sound state
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundState(next);
    setSoundEnabled(next);
  };

  // Keyboard shortcut: pressing Enter on config screen starts calculation
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (phase === 'config' && !showStats && e.key === 'Enter') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [phase, showStats, config]);

  // Start calculation flow
  const handleStart = () => {
    const newSeq = generateCalculationSequence(config);
    setSequence(newSeq);
    setPhase('flashing');
  };

  // When flashing sequence completes
  const handleFlashComplete = useCallback(() => {
    setPhase('input');
  }, []);

  // Abort back to config
  const handleAbort = () => {
    setPhase('config');
  };

  // User submits final sum guess
  const handleSubmitAnswer = (userAnswer: number) => {
    if (!sequence.length) return;
    const expected = sequence[sequence.length - 1].runningTotal;
    const isCorrect = userAnswer === expected;

    const result: GameResult = {
      id: 'res_' + Date.now(),
      config: { ...config },
      sequence: [...sequence],
      expectedTotal: expected,
      userAnswer,
      isCorrect,
      timeTakenMs: config.casesCount * config.intervalSeconds * 1000,
      timestamp: Date.now(),
    };

    setCurrentResult(result);
    setPhase('result');

    // Update stats
    setStats((prev) => {
      const nextStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, nextStreak);
      const updated: UserStats = {
        totalAttempts: prev.totalAttempts + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        currentStreak: nextStreak,
        bestStreak,
        records: [
          {
            id: result.id,
            timestamp: result.timestamp,
            digits: config.digits,
            casesCount: config.casesCount,
            mode: config.operationMode,
            intervalSeconds: config.intervalSeconds,
            expected,
            userAnswer,
            isCorrect,
          },
          ...prev.records.slice(0, 49),
        ],
      };
      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Retry with same parameters (new randomized numbers)
  const handleRetrySame = () => {
    handleStart();
  };

  // Replay exact same sequence
  const handleReplaySequence = () => {
    if (currentResult) {
      setSequence(currentResult.sequence);
      setPhase('flashing');
    }
  };

  const handleNewConfig = () => {
    setPhase('config');
  };

  const handleClearStats = () => {
    const empty: UserStats = {
      totalAttempts: 0,
      totalCorrect: 0,
      currentStreak: 0,
      bestStreak: 0,
      records: [],
    };
    setStats(empty);
    try {
      localStorage.removeItem(STATS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#06020c] text-purple-200 overflow-x-hidden flex flex-col justify-between">
      {/* Dynamic Purple Matrix Digital Rain Canvas */}
      <MatrixBackground
        density={phase === 'flashing' ? 'low' : 'normal'}
        opacity={phase === 'flashing' ? 0.22 : 0.4}
        highlightSpeed={phase === 'flashing'}
      />

      {/* Main Content View Switcher */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {phase === 'config' && (
          <SettingsPanel
            config={config}
            onChangeConfig={setConfig}
            onStart={handleStart}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenStats={() => setShowStats(true)}
          />
        )}

        {phase === 'flashing' && (
          <FlashScreen
            config={config}
            sequence={sequence}
            onComplete={handleFlashComplete}
            onAbort={handleAbort}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {phase === 'input' && (
          <InputScreen
            config={config}
            onSubmitAnswer={handleSubmitAnswer}
            onCancel={handleAbort}
          />
        )}

        {phase === 'result' && currentResult && (
          <ResultScreen
            result={currentResult}
            onRetrySame={handleRetrySame}
            onReplaySequence={handleReplaySequence}
            onNewConfig={handleNewConfig}
          />
        )}
      </main>

      {/* Persistent Bottom Status Line */}
      <footer className="relative z-10 py-2.5 px-4 border-t border-purple-900/40 bg-[#06020c]/80 backdrop-blur-sm text-[11px] font-mono text-purple-400/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>FLASH CALCULATION MATRIX // ONLINE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>STREAK: <strong className="text-purple-300 font-bold">{stats.currentStreak}</strong></span>
          <span>SOLVED: <strong className="text-purple-300 font-bold">{stats.totalCorrect}/{stats.totalAttempts}</strong></span>
        </div>
      </footer>

      {/* Stats Modal */}
      {showStats && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStats(false)}
          onClearStats={handleClearStats}
        />
      )}
    </div>
  );
}
