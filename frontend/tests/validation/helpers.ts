import Ajv2020 from 'ajv/dist/2020';
import answerSchema from '../../../specs/001-nucleo-validacion/contracts/answer.schema.json';
import requestSchema from '../../../specs/001-nucleo-validacion/contracts/request.schema.json';
import resultSchema from '../../../specs/001-nucleo-validacion/contracts/result.schema.json';
import errorSchema from '../../../specs/001-nucleo-validacion/contracts/error.schema.json';
import type { ValidatorRegistration } from '../../src/shared/validation/contracts/types';

const ajv = new Ajv2020({ strict: false });
ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
ajv.addSchema(answerSchema, 'answer.schema.json');
export const schemas = {
  answer: ajv.getSchema('answer.schema.json')!,
  request: ajv.compile(requestSchema),
  result: ajv.compile(resultSchema),
  error: ajv.compile(errorSchema),
};
export function registration(overrides: Partial<ValidatorRegistration> = {}): ValidatorRegistration {
  return {
    exerciseId: 'E01', allowedKinds: ['boolean'], requiredFields: [],
    mechanisms: ['local', 'api'], adapterId: 'test', validatorId: 'test-only',
    contractVersion: '0.1.0', associationStatus: 'ratified', ...overrides,
  };
}
