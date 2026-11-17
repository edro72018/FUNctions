export type AppScreen = 'index' | 'intro' | 'flow' | 'instructions' | 'how-to-play' | 'about' | 'exercise:E01' | 'exercise:E08' | 'progress-recovery';
export interface NavigationContext {
  introCompleted: boolean;
  completedExerciseIds: readonly ('E01' | 'E08')[];
  recoveryConfirmed?: boolean;
}
export const recoveryActions = { canContinue: false, canAutoOverwrite: false } as const;
export function canNavigate(from: AppScreen, to: AppScreen, context: NavigationContext): boolean {
  if (to === 'index' || to === 'progress-recovery') return true;
  if (from === 'progress-recovery') return to === 'intro' && context.recoveryConfirmed === true;
  if (to === 'exercise:E01') return from === 'flow' && context.introCompleted;
  if (to === 'exercise:E08') return from === 'flow' && context.introCompleted && context.completedExerciseIds.includes('E01');
  if (to === 'flow') return from === 'intro' || (context.introCompleted && (from === 'index' || from.startsWith('exercise:')));
  if (to === 'intro') return from === 'index';
  return from === 'index';
}
