import { createLocalGateway } from '../../../shared/validation-gateway/local';
import type { ValidationGateway } from '../../../shared/validation-gateway/types';
import type { ValidatorRegistration } from '../../../shared/validation';
import { e08Validator } from './validateE08';

/** Registro de E08 para la puerta local; la UI no conoce el despachador. */
export const e08Registration: ValidatorRegistration = {
  exerciseId: 'E08',
  allowedKinds: ['vertex'],
  requiredFields: ['h', 'k'],
  mechanisms: ['local'],
  adapterId: 'e08-local',
  validatorId: 'E08',
  contractVersion: '0.1.0',
  associationStatus: 'ratified',
};

export function createE08Gateway(): ValidationGateway {
  return createLocalGateway([{ registration: e08Registration, validator: e08Validator }]);
}
