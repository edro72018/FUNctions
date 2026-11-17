import { expect, it } from 'vitest';
import fresh from '../../../specs/002-primer-recorrido/contracts/examples/progress.fresh.valid.json';
import e01 from '../../../specs/002-primer-recorrido/contracts/examples/progress.e01-complete.valid.json';
import complete from '../../../specs/002-primer-recorrido/contracts/examples/progress.complete.valid.json';
import version from '../../../specs/002-primer-recorrido/contracts/examples/progress.unknown-version.invalid.json';
import origin from '../../../specs/002-primer-recorrido/contracts/examples/progress.origin.invalid.json';
import { parseProgress } from '../../src/shared/storage/schema';
it('T019 acepta fixtures y rechaza origen, versiones y complete incoherente', () => {
  for (const value of [fresh, e01, complete]) expect(parseProgress(JSON.stringify(value)).status).toBe('available');
  expect(parseProgress(JSON.stringify(version)).status).toBe('unknown-version');
  for (const value of [origin, { ...complete, completedExerciseIds: ['E01'] }, { ...complete, activeExerciseId: 'E08' }, { ...fresh, origin: 'local' }]) expect(parseProgress(JSON.stringify(value)).status).toBe('corrupt');
});
