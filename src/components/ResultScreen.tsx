import React, { useEffect, useState } from 'react';
import { GameResult } from '../types';
import { playSuccessSound, playErrorSound, playKeySound } from '../utils/sound';
import { CheckCircle2, XCircle, RotateCcw, Play, Settings, ListCollapse, ChevronDown, ChevronUp, Share2, Award, Zap } from 'lucide-react';

interface ResultScreenProps {
  result: GameResult;
  onRetrySame: () => void;
  onReplaySequence: () => void;
  onNewConfig: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onRetrySame,
  onReplaySequence,
  onNewConfig,
}) => {
  const [showFullTrace, setShowFullTrace] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (result.isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  }, [result.isCorrect]);

  const handleCopyResult = () => {
    playKeySound();
    const text = `Matrix Flash Calculation [${result.isCorrect ? 'PASSED' : 'FAILED'}]
Digits: ${result.config.digits} | Cases: ${result.config.casesCount} | Speed: ${result.config.intervalSeconds}s
Correct Answer: ${result.expectedTotal} | Your Guess: ${result.userAnswer}
Total Stream Time: ${(result.config.casesCount * result.config.intervalSeconds).toFixed(1)}s`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalStreamTime = (result.config.casesCount * result.config.intervalSeconds).toFixed(1);

  return (
    <div id="result-screen" className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 md:py-8 select-none">
      {/* Container Frame */}
      <div className="bg-[#0b0417]/90 backdrop-blur-md border border-purple-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(168,85,247,0.25)] relative overflow-hidden">
        {/* Terminal Corner Decors */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />

        {/* Verdict Banner */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            {result.isCorrect ? (
              <div className="w-16 h-16 rounded-full bg-purple-950/80 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_25px_rgba(192,132,252,0.6)] animate-bounce">
                <CheckCircle2 className="w-9 h-9 text-purple-300" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-rose-500/80 flex items-center justify-center text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.4)]">
                <XCircle className="w-9 h-9 text-rose-400" />
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-mono tracking-widest text-purple-400/80 uppercase">
              {result.isCorrect ? 'ACCUMULATOR SYNCHRONIZED' : 'TRANSMISSION PARITY ERROR'}
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold font-display-cyber tracking-wider ${
                result.isCorrect ? 'text-white glow-purple-md' : 'text-rose-200'
              }`}
            >
              {result.isCorrect ? 'CORRECT ANSWER!' : 'CALCULATION MISMATCH'}
            </h2>
          </div>
        </div>

        {/* Comparison Cards: User Answer vs Actual Sum */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`p-4 rounded-xl border text-center font-mono ${
              result.isCorrect
                ? 'bg-purple-950/50 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-red-950/30 border-rose-800/60'
            }`}
          >
            <div className="text-xs text-purple-400/80 mb-1 uppercase tracking-wider">
              YOUR ANSWER
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white font-mono glow-purple-sm">
              {result.userAnswer !== null ? result.userAnswer : 'None'}
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-purple-950/50 border-purple-400/80 text-center font-mono shadow-[0_0_15px_rgba(192,132,252,0.3)]">
            <div className="text-xs text-purple-300 mb-1 uppercase tracking-wider">
              ACTUAL TOTAL
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white font-mono glow-purple-md">
              {result.expectedTotal}
            </div>
          </div>
        </div>

        {/* Quick parameters readout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono mb-6">
          <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/50">
            <span className="text-purple-400/70 block">DIGITS</span>
            <strong className="text-white text-sm">{result.config.digits}</strong>
          </div>
          <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/50">
            <span className="text-purple-400/70 block">CASES</span>
            <strong className="text-white text-sm">{result.config.casesCount}</strong>
          </div>
          <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/50">
            <span className="text-purple-400/70 block">INTERVAL</span>
            <strong className="text-white text-sm">{result.config.intervalSeconds}s</strong>
          </div>
          <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/50">
            <span className="text-purple-400/70 block">TOTAL STREAM</span>
            <strong className="text-white text-sm">{totalStreamTime}s</strong>
          </div>
        </div>

        {/* Breakdown of all numbers with running sums (Trace Log) */}
        <div className="border border-purple-800/60 rounded-xl overflow-hidden mb-6 bg-purple-950/30">
          <button
            onClick={() => setShowFullTrace(!showFullTrace)}
            className="w-full flex items-center justify-between px-4 py-3 bg-purple-900/40 hover:bg-purple-900/60 border-b border-purple-800/60 font-mono text-xs text-purple-300 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold tracking-wider">
              <ListCollapse className="w-4 h-4 text-purple-400" />
              <span>STEP-BY-STEP CALCULATION AUDIT TRACE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-600/40 text-purple-300">
                {result.sequence.length} items
              </span>
            </div>
            {showFullTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFullTrace && (
            <div className="p-3 max-h-60 overflow-y-auto font-mono text-xs divide-y divide-purple-900/50">
              <div className="grid grid-cols-12 pb-2 text-purple-400/70 font-semibold px-2">
                <div className="col-span-2">#</div>
                <div className="col-span-5">OPERATOR & VALUE</div>
                <div className="col-span-5 text-right">RUNNING TOTAL</div>
              </div>
              {result.sequence.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 py-1.5 px-2 hover:bg-purple-900/30 transition-colors items-center"
                >
                  <div className="col-span-2 text-purple-400/60">
                    {String(item.index + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        item.isNegative
                          ? 'bg-fuchsia-950 border border-fuchsia-600/60 text-fuchsia-300'
                          : 'bg-purple-950 border border-purple-600/60 text-purple-300'
                      }`}
                    >
                      {item.isNegative ? '-' : '+'}
                    </span>
                    <span className={`font-bold ${item.isNegative ? 'text-fuchsia-300' : 'text-white'}`}>
                      {item.absoluteValue}
                    </span>
                  </div>
                  <div className="col-span-5 text-right text-purple-200 font-bold">
                    = {item.runningTotal}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="replay-sequence-btn"
            onClick={onReplaySequence}
            className="py-3 px-4 rounded-xl border border-purple-600/60 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 hover:text-white font-mono text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 text-purple-400" />
            <span>REPLAY FLASH</span>
          </button>

          <button
            id="retry-same-btn"
            onClick={onRetrySame}
            className="py-3 px-4 rounded-xl border border-purple-400 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(168,85,247,0.4)] transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>NEW PROBLEMS</span>
          </button>

          <button
            id="new-config-btn"
            onClick={onNewConfig}
            className="py-3 px-4 rounded-xl border border-purple-800/60 bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 hover:text-white font-mono text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>CHANGE SETUP</span>
          </button>
        </div>

        {/* Share / Copy Snippet */}
        <div className="mt-4 pt-4 border-t border-purple-900/50 flex justify-center">
          <button
            onClick={handleCopyResult}
            className="text-xs font-mono text-purple-400/80 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'COPIED CALCULATION SUMMARY TO CLIPBOARD!' : 'COPY RESULT LOG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
