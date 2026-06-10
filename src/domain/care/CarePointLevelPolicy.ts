export type CarePointLevelProgress = {
  level: number;
  lifetimePoints: number;
  currentLevelStartsAt: number;
  nextLevelStartsAt: number | null;
  pointsIntoLevel: number;
  pointsToNextLevel: number | null;
};

export type CarePointLevelPolicyConfig = {
  levelThresholds: number[];
};

const defaultLevelThresholds = [0, 25, 75, 150, 275, 450, 700, 1000];

export class CarePointLevelPolicy {
  constructor(private readonly config: CarePointLevelPolicyConfig = { levelThresholds: defaultLevelThresholds }) {}

  getLevel(lifetimePoints: number): number {
    return this.getProgress(lifetimePoints).level;
  }

  getProgress(lifetimePoints: number): CarePointLevelProgress {
    const safePoints = Math.max(0, Math.floor(lifetimePoints));
    const thresholds = this.getSortedThresholds();

    let levelIndex = 0;

    for (let index = 0; index < thresholds.length; index += 1) {
      if (safePoints >= thresholds[index]) {
        levelIndex = index;
      }
    }

    const currentLevelStartsAt = thresholds[levelIndex];
    const nextLevelStartsAt = thresholds[levelIndex + 1] ?? null;

    return {
      level: levelIndex + 1,
      lifetimePoints: safePoints,
      currentLevelStartsAt,
      nextLevelStartsAt,
      pointsIntoLevel: safePoints - currentLevelStartsAt,
      pointsToNextLevel: nextLevelStartsAt === null ? null : nextLevelStartsAt - safePoints,
    };
  }

  private getSortedThresholds(): number[] {
    const thresholds = [...this.config.levelThresholds]
      .map((threshold) => Math.max(0, Math.floor(threshold)))
      .sort((left, right) => left - right);

    return thresholds[0] === 0 ? thresholds : [0, ...thresholds];
  }
}
