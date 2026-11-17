import type { ValidatorRegistration } from '../contracts/types';
import { exercisePattern } from '../contracts/types';
import { answerKinds } from '../contracts/answers';
import { fullMatch } from '../contracts/validate';
import type { Registry } from './interfaces';

/** Registro vacío; nunca asigna tipos por semejanza. */
export class ValidatorRegistry implements Registry {
  private readonly entries = new Map<string, ValidatorRegistration>();
  register(entry: ValidatorRegistration): void {
    if (!fullMatch(exercisePattern, entry.exerciseId) || this.entries.has(entry.exerciseId)
        || !entry.allowedKinds.length || entry.allowedKinds.some((kind) => !answerKinds.includes(kind))
        || entry.mechanisms.some((mode) => mode !== 'local' && mode !== 'api')
        || !entry.adapterId || !entry.validatorId || !entry.contractVersion
        || !['ratified', 'proposed', 'pending'].includes(entry.associationStatus)
        || entry.requiredFields.some((field) => !field) || new Set(entry.requiredFields).size !== entry.requiredFields.length) {
      throw new TypeError('Registro de validador inválido o duplicado.');
    }
    this.entries.set(entry.exerciseId, Object.freeze({ ...entry,
      allowedKinds: Object.freeze([...entry.allowedKinds]), requiredFields: Object.freeze([...entry.requiredFields]),
      mechanisms: Object.freeze([...entry.mechanisms]),
    }));
  }
  get(exerciseId: string): ValidatorRegistration | undefined { return this.entries.get(exerciseId); }
}
