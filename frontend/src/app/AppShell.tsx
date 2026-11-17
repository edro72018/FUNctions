import { useState } from 'react';
import { content } from './content';
import { canNavigate, type AppScreen } from './navigation';
import { useProgress } from './useProgress';
import { E01Screen } from '../features/exercises/e01/E01Screen';
import { E08Screen } from '../features/exercises/e08/E08Screen';
import { FlowScreen } from '../features/flow/FlowScreen';
import { beginFlow, canOpenExercise, createMissionProgress, resumeScreen } from '../features/flow/flow';
import { IndexScreen } from '../features/index/IndexScreen';
import { NewMissionDialog } from '../features/index/NewMissionDialog';
import { selectIndexActions, type IndexActionId } from '../features/index/indexActions';
import { AboutScreen } from '../features/info/AboutScreen';
import { HowToPlayScreen } from '../features/info/HowToPlayScreen';
import { InstructionsScreen } from '../features/info/InstructionsScreen';
import { IntroScreen } from '../features/intro/IntroScreen';
import { PersistenceNotice } from '../features/recovery/PersistenceNotice';
import { ProgressRecoveryScreen } from '../features/recovery/ProgressRecoveryScreen';
import type { ExerciseId } from '../shared/storage/progress';

function nowIso(): string {
  return new Date().toISOString();
}

function newMissionId(): string {
  return globalThis.crypto.randomUUID();
}

/**
 * Navegación en memoria del corte. El índice es la pantalla inicial; no hay
 * router ni URLs profundas. Comenzar y Continuar comparten el progreso real.
 */
export function AppShell() {
  const { progress, persistence, initialScreen, save, recover } = useProgress();
  const [screen, setScreen] = useState<AppScreen>(initialScreen);
  const [newMissionOpen, setNewMissionOpen] = useState(false);

  const readableProgress = progress !== null && (persistence.status === 'available' || persistence.status === 'saved');
  const unreadableProgress = persistence.status === 'corrupt' || persistence.status === 'unknown-version';
  const introCompleted = progress !== null && progress.flow.step !== 'intro';
  const actions = selectIndexActions({
    hasReadableProgress: readableProgress,
    overrides: {
      instructions: { enabled: true },
      about: { enabled: true },
      'how-to-play': { enabled: true },
      ...(unreadableProgress
        ? { start: { enabled: false, unavailableMessage: 'El progreso guardado no se pudo leer y no se sobrescribirá.' } }
        : {}),
    },
  });

  function navigate(to: AppScreen) {
    if (canNavigate(screen, to, { introCompleted, completedExerciseIds: progress?.completedExerciseIds ?? [] })) setScreen(to);
  }

  function startNewMission() {
    const next = createMissionProgress(newMissionId(), nowIso());
    const result = save(next);
    setNewMissionOpen(false);
    if (result.status === 'saved' || result.status === 'unavailable') navigate('intro');
  }

  /** Recuperación: confirma, respalda el contenido ilegible y recién después escribe. */
  function recoverNewMission() {
    const result = recover(createMissionProgress(newMissionId(), nowIso()), true);
    if (result.status === 'saved') setScreen('intro');
    return result;
  }

  function handleIndexAction(id: IndexActionId) {
    if (id === 'start') {
      if (progress !== null) setNewMissionOpen(true);
      else startNewMission();
      return;
    }
    if (id === 'continue') {
      if (progress !== null) navigate(resumeScreen(progress));
      return;
    }
    const action = actions.find(candidate => candidate.id === id);
    if (action?.destination) navigate(action.destination);
  }

  function handleIntroContinue() {
    if (progress === null) return;
    const result = save(beginFlow(progress, nowIso()));
    if (result.status === 'saved' || result.status === 'unavailable') navigate('flow');
  }

  function handleOpenExercise(exerciseId: ExerciseId) {
    if (progress === null || !canOpenExercise(progress, exerciseId)) return;
    navigate(exerciseId === 'E01' ? 'exercise:E01' : 'exercise:E08');
  }

  if (screen === 'progress-recovery') {
    return (
      <ProgressRecoveryScreen
        persistence={persistence}
        onBackToIndex={() => setScreen('index')}
        onStartNewMission={recoverNewMission}
      />
    );
  }

  if (screen === 'intro' && progress !== null) {
    return (
      <>
        <IntroScreen entry={content.intro} onContinue={handleIntroContinue} />
        <PersistenceNotice visible={persistence.status === 'unavailable'} />
      </>
    );
  }

  if (screen === 'flow' && progress !== null) {
    return (
      <>
        <FlowScreen progress={progress} onOpenExercise={handleOpenExercise} onBackToIndex={() => navigate('index')} />
        <PersistenceNotice visible={persistence.status === 'unavailable'} />
      </>
    );
  }

  if ((screen === 'exercise:E01' || screen === 'exercise:E08') && progress !== null) {
    const exerciseId: ExerciseId = screen === 'exercise:E01' ? 'E01' : 'E08';
    if (canOpenExercise(progress, exerciseId)) {
      if (exerciseId === 'E01') {
        return (
          <E01Screen
            progress={progress}
            onSave={save}
            onContinue={() => navigate('flow')}
            onBackToFlow={() => navigate('flow')}
          />
        );
      }
      return (
        <E08Screen
          progress={progress}
          onSave={save}
          onContinue={() => navigate('flow')}
          onBackToFlow={() => navigate('flow')}
        />
      );
    }
  }

  if (screen === 'instructions') {
    return <InstructionsScreen onBackToIndex={() => navigate('index')} />;
  }

  if (screen === 'how-to-play') {
    return <HowToPlayScreen onBackToIndex={() => navigate('index')} />;
  }

  if (screen === 'about') {
    return <AboutScreen onBackToIndex={() => navigate('index')} />;
  }

  const statusMessage = unreadableProgress
    ? 'El progreso guardado no se pudo leer. No se sobrescribirá.'
    : null;

  return (
    <>
      <IndexScreen
        actions={actions}
        onAction={handleIndexAction}
        {...(statusMessage === null ? {} : { statusMessage })}
      />
      <PersistenceNotice visible={!unreadableProgress && persistence.status === 'unavailable'} />
      <NewMissionDialog
        open={newMissionOpen}
        onConfirm={startNewMission}
        onCancel={() => setNewMissionOpen(false)}
        returnFocus={() => document.getElementById('index-action-start')}
      />
    </>
  );
}
