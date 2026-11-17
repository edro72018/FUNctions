/**
 * Demo funcional del núcleo de validación (TypeScript).
 *
 * Uso (desde la raíz del repo `development/`):
 *   npx --prefix frontend vite-node frontend/scripts/demo.ts
 *
 * Muestra: normalización exacta, validación de contratos, despacho con registro
 * explícito, adaptadores local/api y catálogo de errores. Espeja el demo de
 * `backend/scripts/demo.py` para comprobar la paridad entre lenguajes.
 */
import {
  createApiAdapter,
  createLocalAdapter,
  dispatch,
  makeResult,
  normalize,
  ValidatorRegistry,
  validateAnswer,
} from '../src/shared/validation/index';

const titulo = (texto: string): void => {
  console.log(`\n=== ${texto} ===`);
};

function normalizacion(): void {
  titulo('1. Normalización exacta (sin flotantes)');
  const casos = [
    { kind: 'number', value: '1.50' },
    { kind: 'number', value: '3/2' },
    { kind: 'finiteSet', values: ['3', '-3', '3'] },
    { kind: 'mapping', pairs: [['1', '2'], ['1', '3']] },
    { kind: 'vertex', h: '3', k: '2' },
    { kind: 'asymptote', orientation: 'vertical', value: '3' },
    {
      kind: 'intervalUnion',
      intervals: [
        { lower: { value: '-inf', inclusive: false }, upper: { value: '3', inclusive: false } },
        { lower: { value: '3', inclusive: false }, upper: { value: '+inf', inclusive: false } },
      ],
    },
  ] as const;
  for (const caso of casos) {
    console.log(`  entrada  ${JSON.stringify(caso)}`);
    console.log(`  salida   ${JSON.stringify(normalize(caso))}`);
  }
}

function contratos(): void {
  titulo('2. Rechazo de contratos inválidos');
  const invalidos = [
    { kind: 'number', value: '1/0' },
    { kind: 'number', value: '1e3' },
    { kind: 'number', value: '.5' },
    { kind: 'boolean', value: 'true' },
    { kind: 'expression', tokens: [{ value: 'x+2' }] },
    { kind: 'matriz', values: [] },
  ];
  for (const caso of invalidos) {
    try {
      validateAnswer(caso);
      console.log(`  ${JSON.stringify(caso)} -> ACEPTADO (inesperado)`);
    } catch (error: unknown) {
      console.log(`  ${JSON.stringify(caso)} -> rechazado: ${(error as Error).message}`);
    }
  }
}

function construccionRegistro(): { registro: ValidatorRegistry; adaptadores: Record<string, Partial<Record<'local' | 'api', unknown>>> } {
  const registro = new ValidatorRegistry();
  registro.register({
    exerciseId: 'E01',
    allowedKinds: ['number'],
    requiredFields: [],
    mechanisms: ['local', 'api'],
    adapterId: 'principal',
    validatorId: 'v1',
    contractVersion: '1.0.0',
    associationStatus: 'pending',
  });
  registro.register({
    exerciseId: 'E02',
    allowedKinds: ['composite'],
    requiredFields: ['altura', 'base'],
    mechanisms: ['local'],
    adapterId: 'principal',
    validatorId: 'v2',
    contractVersion: '1.0.0',
    associationStatus: 'pending',
  });
  const local = createLocalAdapter({
    v1: () => makeResult('correct', 'EXACT_MATCH', 'local'),
    v2: () => makeResult('correct', 'COMPOSITE_OK', 'local'),
  });
  const api = createApiAdapter(() => makeResult('correct', 'REMOTE_OK', 'api'));
  return { registro, adaptadores: { principal: { local, api } } };
}

async function despacho(): Promise<void> {
  titulo('3. Despacho (registro explícito + adaptadores)');
  const { registro, adaptadores } = construccionRegistro();
  const base = { requestId: '3f2504e0-4f89-11d3-9a0c-0305e82c3301', exerciseId: 'E01' };
  const mostrar = async (etiqueta: string, entrada: unknown, tabla = adaptadores): Promise<void> => {
    const salida = await dispatch(entrada, registro, tabla as never);
    console.log(`  ${etiqueta}\n    ${JSON.stringify(salida)}`);
  };

  await mostrar('E01 vía API (mecanismo en la solicitud):', { ...base, mechanism: 'api', answer: { kind: 'number', value: '1/2' } });
  await mostrar("E01 vía local (mecanismo explícito 'local'):", { ...base, mechanism: 'local', answer: { kind: 'number', value: '1/2' } });
  await mostrar('E01 sin mechanism y sin configuración por defecto:', { ...base, answer: { kind: 'number', value: '1/2' } });
  await mostrar('E02 compuesto completo:', {
    ...base, exerciseId: 'E02', mechanism: 'local',
    answer: { kind: 'composite', fields: { altura: { kind: 'number', value: '2' }, base: { kind: 'number', value: '4' } } },
  });
  await mostrar("E02 compuesto incompleto (falta 'base'):", {
    ...base, exerciseId: 'E02', mechanism: 'local',
    answer: { kind: 'composite', fields: { altura: { kind: 'number', value: '2' } } },
  });
  await mostrar('E02 compuesto con campo extra:', {
    ...base, exerciseId: 'E02', mechanism: 'local',
    answer: { kind: 'composite', fields: { altura: { kind: 'number', value: '2' }, base: { kind: 'number', value: '4' }, extra: { kind: 'boolean', value: true } } },
  });
  await mostrar('Ejercicio no registrado (E15, patrón válido pero sin entrada en el registro):', { ...base, exerciseId: 'E15', answer: { kind: 'number', value: '1' } });
  await mostrar('Ejercicio con identificador fuera del patrón E01–E15 (E99):', { ...base, exerciseId: 'E99', answer: { kind: 'number', value: '1' } });
  await mostrar('Tipo no permitido (E01 con kind=boolean):', { ...base, mechanism: 'local', answer: { kind: 'boolean', value: true } });
  await mostrar('Expresión bloqueada (gramática no aprobada):', { ...base, mechanism: 'local', answer: { kind: 'expression', tokens: ['x', '+', '2'] } });
  await mostrar('Fallo de transporte (API sin adaptador):', { ...base, mechanism: 'api', answer: { kind: 'number', value: '1' } },
    { principal: { local: adaptadores.principal!.local } });
}

async function main(): Promise<void> {
  console.log('Núcleo de validación FUNctions — demostración funcional (TypeScript)');
  normalizacion();
  contratos();
  await despacho();
  console.log('\nNota: los adaptadores de esta demo son dobles de prueba; no hay servidor HTTP real.');
}

await main();
