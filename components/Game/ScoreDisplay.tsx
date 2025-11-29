"use client";

import { useEffect, useRef } from 'react';
import { Config } from '@/game';
import { useLanguage } from '@/contexts/language-context';

interface ScoreDisplayProps {
  score: number;
  bestScore: number;
}

export default function ScoreDisplay({ score, bestScore }: ScoreDisplayProps) {
  const { t } = useLanguage();
  const scoreRef = useRef<HTMLDivElement>(null);
  const prevScoreRef = useRef(score);

  // Efecto de flash cuando aumenta el score
  useEffect(() => {
    if (score > prevScoreRef.current && scoreRef.current) {
      scoreRef.current.style.transform = `scale(${Config.feedback.scoreFlashScale})`;
      scoreRef.current.style.transition = 'transform 0.1s';

      setTimeout(() => {
        if (scoreRef.current) {
          scoreRef.current.style.transform = 'scale(1)';
        }
      }, Config.feedback.scoreFlashDuration);
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <div className="absolute top-5 left-0 right-0 text-center pointer-events-none z-10">
      <div
        ref={scoreRef}
        className="font-black text-7xl text-white drop-shadow-lg opacity-90"
      >
        {score}
      </div>
      <div className="font-sans text-lg text-white/60 mt-1">
        {t.score.best}: {bestScore}
      </div>
    </div>
  );
}
