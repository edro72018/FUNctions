/** API pública del núcleo de validación. */
export type { Answer, AnswerKind, ExactNumber, Bound, Interval } from './contracts/answers';
export type { ValidationRequest, ValidationResult, ValidationError, ValidatorRegistration, Mechanism, ResultStatus, ErrorCategory } from './contracts/types';
export { validateAnswer, validateRequest, validateResult, validateError } from './contracts/validate';
export { normalize } from './normalization/normalize';
export { parseRational, serializeRational, canonicalNumber, compareNumbers } from './normalization/rational';
export type { Rational } from './normalization/rational';
export { ValidatorRegistry } from './dispatch/registry';
export { dispatch } from './dispatch/dispatcher';
export { createLocalAdapter, createApiAdapter } from './dispatch/adapters';
export type { Adapter, Adapters, Validator, Registry, DispatchOptions } from './dispatch/interfaces';
export { makeResult } from './result/result';
export { CoreError, makeError } from './errors/errors';
