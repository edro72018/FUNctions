import { createLocalGateway } from '../../../shared/validation-gateway/local';
import type { ValidationGateway } from '../../../shared/validation-gateway/types';
import type { ValidatorRegistration } from '../../../shared/validation';
import { e01Validator } from './validateE01';

/** Registro de E01 para la puerta local; la UI no conoce el despachador. */
export const e01Registration: ValidatorRegistration = {
  exerciseId: 'E01',
  allowedKinds: ['boolean'],
  requiredFields: [],
  mechanisms: ['local'],
  adapterId: 'e01-local',
  validatorId: 'E01',
  contractVersion: '0.1.0',
  associationStatus: 'ratified',
};

export function createE01Gateway(): ValidationGateway {
  return createLocalGateway([{ registration: e01Registration, validator: e01Validator }]);
}
