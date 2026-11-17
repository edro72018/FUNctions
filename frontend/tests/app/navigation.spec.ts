import { expect, it } from 'vitest';
import { canNavigate, recoveryActions } from '../../src/app/navigation';
it('T010–T011 exige intro y flow para E01 y resolución para E08', () => {
  const context = { introCompleted: false, completedExerciseIds: [] as ('E01' | 'E08')[] };
  expect(canNavigate('index', 'exercise:E01', context)).toBe(false);
  expect(canNavigate('flow', 'exercise:E01', context)).toBe(false);
  context.introCompleted = true;
  expect(canNavigate('flow', 'exercise:E01', context)).toBe(true);
  expect(canNavigate('flow', 'exercise:E08', context)).toBe(false);
  context.completedExerciseIds.push('E01');
  expect(canNavigate('flow', 'exercise:E08', context)).toBe(true);
  for (const screen of ['instructions', 'about', 'how-to-play'] as const) expect(canNavigate(screen, 'index', context)).toBe(true);
  expect(recoveryActions).toEqual({ canContinue: false, canAutoOverwrite: false });
});
