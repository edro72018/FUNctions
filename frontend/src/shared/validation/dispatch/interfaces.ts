import type { Mechanism, ValidationRequest, ValidatorRegistration } from '../contracts/types';

/** El límite del adaptador se valida incluso si el consumidor está tipado. */
export type Validator = (request: ValidationRequest) => unknown | Promise<unknown>;
export type Adapter = (request: ValidationRequest, registration: ValidatorRegistration) => unknown | Promise<unknown>;
export type Adapters = Readonly<Record<string, Partial<Record<Mechanism, Adapter>>>>;
export interface Registry {
  get(exerciseId: string): ValidatorRegistration | undefined;
}
export interface DispatchOptions { mechanism?: Mechanism }
