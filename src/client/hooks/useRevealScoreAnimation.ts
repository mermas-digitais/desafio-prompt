import { useEffect, useState } from 'react';
import {
  ACHIEVEMENTS_CATALOG,
  evaluateRoundAchievements,
  type AchievementId,
} from '../../shared/achievements';
import {
  playRevealDrumroll,
  playScoreTick,
  playCategoryHitSound,
  playRecordBreakerSound,
  fireCelebrationConfetti,
  playAchievementUnlockSound,
  playLevelUpPowerSound,
} from '../lib/soundEngine';
import type { GamePhase, PlayerRoundEvaluation } from '../../shared/types';

export function useRevealScoreAnimation(
  phase: GamePhase,
  currentRevealIndex: number,
  currentEvaluation: PlayerRoundEvaluation | null
) {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  const currentEvalKey =
    phase === 'REVEALING' && currentEvaluation
      ? `${currentRevealIndex}-${currentEvaluation.playerId}-${currentEvaluation.totalScore}`
      : '';

  useEffect(() => {
    if (!currentEvalKey || !currentEvaluation) {
      setAnimatedScore(0);
      return;
    }

    playRevealDrumroll();
    setAnimatedScore(0);

    const catTimer1 = setTimeout(() => playCategoryHitSound(0), 250);
    const catTimer2 = setTimeout(() => playCategoryHitSound(1), 650);
    const catTimer3 = setTimeout(() => playCategoryHitSound(2), 1050);

    const roundAchIds = (
      currentEvaluation.roundAchievements && currentEvaluation.roundAchievements.length > 0
        ? currentEvaluation.roundAchievements
        : evaluateRoundAchievements({
            subjectScore: currentEvaluation.subjectScore,
            styleScore: currentEvaluation.styleScore,
            detailsScore: currentEvaluation.detailsScore,
            speedBonus: currentEvaluation.speedBonus,
            totalScore: currentEvaluation.totalScore,
            lockedAtRemainingSeconds: currentEvaluation.lockedAtRemainingSeconds,
            isWinner: currentEvaluation.isWinner,
            isNewHighScore: currentEvaluation.isNewHighScore,
            matchesPlayedAfter: 1,
            winsCountAfter: currentEvaluation.isWinner ? 1 : 0,
          })
    ) as AchievementId[];

    const achTimers = roundAchIds.map((achId, idx) => {
      const def = ACHIEVEMENTS_CATALOG[achId];
      return setTimeout(
        () => {
          if (def) {
            playAchievementUnlockSound(def.rarity);
          }
        },
        1500 + idx * 400
      );
    });

    const levelUpTimer = currentEvaluation.leveledUpTitle
      ? setTimeout(() => {
          playLevelUpPowerSound();
        }, 1800)
      : null;

    const target = currentEvaluation.totalScore;
    const steps = 20;
    const intervalMs = 70; // 20 * 70ms = 1400ms e CRAVA na pontuação final sem loop!
    let currentStep = 0;

    const scoreInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps) {
        clearInterval(scoreInterval);
        setAnimatedScore(target);
        if (currentEvaluation.isNewHighScore || target >= 750) {
          playRecordBreakerSound();
        }
        return;
      }

      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));

      if (currentStep % 2 === 0) {
        playScoreTick(currentStep);
      }
    }, intervalMs);

    return () => {
      clearTimeout(catTimer1);
      clearTimeout(catTimer2);
      clearTimeout(catTimer3);
      achTimers.forEach((t) => clearTimeout(t));
      if (levelUpTimer) clearTimeout(levelUpTimer);
      clearInterval(scoreInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvalKey]);

  return {
    animatedScore,
    currentEvalKey,
  };
}
