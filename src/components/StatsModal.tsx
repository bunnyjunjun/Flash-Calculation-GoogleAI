import React from 'react';
import { UserStats } from '../types';
import { X, Trophy, Target, Zap, Flame, Trash2 } from 'lucide-react';

interface StatsModalProps {
  stats: UserStats;
  onClose: () => void;
  onClearStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose, onClearStats }) => {
  const accuracy = stats.totalAttempts > 0 ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-[#0e041c] border-2 border-purple-500/60 rounded-2xl w-full max-w-lg p-6 shadow-[0_0_40px_rgba(168,85,247,0.4)] relative font-mono text-purple-200">
        {/* Decorative brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/60 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold font-display-cyber text-white tracking-wider glow-purple-sm">
              CALCULATION TELEMETRY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-purple-900/60 border border-transparent hover:border-purple-600 transition-colors text-purple-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-purple-400/80 mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>ACCURACY</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono glow-purple-sm">
              {accuracy}%
            </div>
            <div className="text-[10px] text-purple-400/60">
              {stats.totalCorrect} / {stats.totalAttempts} correct
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-purple-400/80 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>CURRENT STREAK</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono glow-purple-sm">
              {stats.currentStreak}
            </div>
            <div className="text-[10px] text-purple-400/60">
              Best: {stats.bestStreak}
            </div>
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="mb-5">
          <div className="text-xs font-bold text-purple-400 uppercase mb-2 tracking-wider flex items-center justify-between">
            <span>Recent Exercises ({stats.records.length})</span>
            {stats.records.length > 0 && (
              <button
                onClick={onClearStats}
                className="text-[11px] text-purple-500 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Data</span>
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-purple-900/40 border border-purple-900/60 rounded-lg bg-purple-950/30">
            {stats.records.length === 0 ? (
              <div className="p-4 text-center text-xs text-purple-400/50">
                No calculation sessions logged yet. Complete a calculation to record telemetry!
              </div>
            ) : (
              stats.records.slice(0, 10).map((rec) => (
                <div key={rec.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-purple-900/20">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        rec.isCorrect ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]' : 'bg-red-400'
                      }`}
                    />
                    <span className="font-semibold text-white">
                      {rec.digits}D • {rec.casesCount}C
                    </span>
                    <span className="text-[10px] text-purple-400/70">
                      @{rec.intervalSeconds}s ({rec.mode === 'addition' ? '+' : '±'})
                    </span>
                  </div>

                  <div className="font-mono text-right">
                    <span className={rec.isCorrect ? 'text-purple-300 font-bold' : 'text-rose-400 line-through'}>
                      {rec.userAnswer ?? 'None'}
                    </span>
                    {!rec.isCorrect && (
                      <span className="text-purple-300 ml-1.5 font-bold">
                        (ans: {rec.expected})
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/50 text-white font-bold text-xs tracking-wider transition-colors"
        >
          CLOSE TELEMETRY [ESC]
        </button>
      </div>
    </div>
  );
};
