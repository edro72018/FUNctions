import type { Mechanism, ResultStatus, ValidationResult } from '../contracts/types';
import { validateResult } from '../contracts/validate';

export function makeResult(status: ResultStatus, feedbackCode: string, origin?: Mechanism): ValidationResult {
  return validateResult({ status, feedbackCode, ...(origin === undefined ? {} : { origin }) });
}
