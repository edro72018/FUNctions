/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import * as core from '../../src/shared/validation';

const files = import.meta.glob<string>('../../src/shared/validation/**/*.ts', { query: '?raw', import: 'default', eager: true });
const root = '../../src/shared/validation/';

function violations(path: string, source: string): string[] {
  const issues: string[] = [];
  function checkImport(specifier: string): void {
    const parts = path.slice(0, path.lastIndexOf('/')).split('/');
    for (const part of specifier.split('/')) {
      if (part === '..') parts.pop();
      else if (part !== '.') parts.push(part);
    }
    const target = parts.filter((part) => part !== '').join('/');
    if (!specifier.startsWith('.') || !target.startsWith(root) || !(target + '.ts' in files || target + '/index.ts' in files)) issues.push(specifier);
  }
  const tree = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  function visit(node: ts.Node): void {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) checkImport(node.moduleSpecifier.text);
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      const argument = node.arguments[0];
      if (argument && ts.isStringLiteral(argument)) checkImport(argument.text);
      else issues.push('importación dinámica no verificable');
    }
    if (ts.isIdentifier(node) && ['localStorage', 'sessionStorage', 'indexedDB', 'fetch', 'XMLHttpRequest', 'eval', 'document', 'window'].includes(node.text)) issues.push(node.text);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return issues;
}

describe('REQ-09–10 / AC-08: fronteras del núcleo', () => {
  it('comprueba todos los módulos y exportaciones públicas', () => {
    expect(Object.keys(files).length).toBeGreaterThan(10);
    for (const [path, source] of Object.entries(files)) expect(violations(path, source), path).toEqual([]);
    expect(core.dispatch).toBeTypeOf('function');
    expect(core.makeResult('correct', 'CORRECT_DEFAULT')).toEqual({ status: 'correct', feedbackCode: 'CORRECT_DEFAULT' });
  });
  it.each(['react', 'pixi.js', 'mafs', 'fastapi', 'sympy', '../../zones/zone-1', 'ajv'])('detecta importación prohibida %s', (module) => {
    expect(violations(root + 'index.ts', `import value from '${module}';`)).not.toEqual([]);
  });
  it('detecta almacenamiento global e importaciones dinámicas', () => {
    expect(violations(root + 'index.ts', 'localStorage.getItem("x");')).toContain('localStorage');
    expect(violations(root + 'index.ts', 'import("react");')).toContain('react');
  });
});
