import type { Answer, AnswerKind } from './answers';
export type { Answer, AnswerKind } from './answers';

export type Mechanism = 'local' | 'api';
export type ResultStatus = 'correct' | 'incorrect' | 'indeterminate';
export type ErrorCategory = 'format' | 'incomplete' | 'unsupported' | 'configuration' | 'transport' | 'service';
export interface ValidationRequest {
  requestId: string;
  exerciseId: string;
  answer: Answer;
  mechanism?: Mechanism;
}
export interface ValidationResult {
  status: ResultStatus;
  feedbackCode: string;
  origin?: Mechanism;
}
export interface ValidationError {
  category: ErrorCategory;
  code: string;
  message: string;
}
export interface ValidatorRegistration {
  exerciseId: string;
  allowedKinds: readonly AnswerKind[];
  requiredFields: readonly string[];
  mechanisms: readonly Mechanism[];
  adapterId: string;
  validatorId: string;
  contractVersion: string;
  associationStatus: 'ratified' | 'proposed' | 'pending';
}
export const exercisePattern = /^E(0[1-9]|1[0-5])$/;
export const codePattern = /^[A-Z][A-Z0-9_]*$/;
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
