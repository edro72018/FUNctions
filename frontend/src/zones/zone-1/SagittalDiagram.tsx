import { Application, Graphics, Text } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';

const WIDTH = 420;
const HEIGHT = 240;
const NODE_RADIUS = 19;

const inputs = [
  { value: 1, y: 60 },
  { value: 2, y: 120 },
  { value: 3, y: 180 },
] as const;
const outputs = [
  { value: 4, y: 90 },
  { value: 5, y: 150 },
] as const;
const relations = [
  [1, 4],
  [2, 4],
  [3, 5],
] as const;

const inputX = 100;
const outputX = 320;

/** Descripción textual equivalente; el canvas no es la única fuente. */
export const sagittalDescription =
  'A = {1, 2, 3}, B = {4, 5} y R = {(1, 4), (2, 4), (3, 5)}. ' +
  'Los cables son 1 → 4, 2 → 4 y 3 → 5. Las entradas 1 y 2 comparten la salida 4.';

function drawNode(app: Application, x: number, value: number, y: number) {
  const circle = new Graphics().circle(x, y, NODE_RADIUS).fill(0x1e293b);
  const label = new Text({
    text: String(value),
    style: { fill: 0xffffff, fontSize: 16, fontFamily: 'system-ui, sans-serif' },
  });
  label.anchor.set(0.5);
  label.position.set(x, y);
  app.stage.addChild(circle, label);
}

function draw(app: Application) {
  const cables = new Graphics();
  for (const [from, to] of relations) {
    const start = inputs.find(node => node.value === from);
    const end = outputs.find(node => node.value === to);
    if (!start || !end) continue;
    cables.moveTo(inputX + NODE_RADIUS, start.y).lineTo(outputX - NODE_RADIUS, end.y);
  }
  cables.stroke({ width: 3, color: 0x2563eb });
  app.stage.addChild(cables);

  for (const node of inputs) drawNode(app, inputX, node.value, node.y);
  for (const node of outputs) drawNode(app, outputX, node.value, node.y);

  const inputsTitle = new Text({
    text: 'A',
    style: { fill: 0x1e293b, fontSize: 18, fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' },
  });
  inputsTitle.anchor.set(0.5);
  inputsTitle.position.set(inputX, 18);
  const outputsTitle = new Text({
    text: 'B',
    style: { fill: 0x1e293b, fontSize: 18, fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' },
  });
  outputsTitle.anchor.set(0.5);
  outputsTitle.position.set(outputX, 18);
  app.stage.addChild(inputsTitle, outputsTitle);
}

/**
 * Diagrama sagital fijo de E01. Solo presenta: no valida, no persiste y no
 * escribe estado de dominio. La descripción textual y las opciones viven fuera
 * del canvas.
 */
export function SagittalDiagram() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const app = new Application();
    let cancelled = false;
    let initialized = false;

    void app
      .init({
        width: WIDTH,
        height: HEIGHT,
        background: '#ffffff',
        antialias: true,
        autoStart: false,
        resolution: 1,
      })
      .then(() => {
        initialized = true;
        if (cancelled) {
          app.destroy({ removeView: true }, { children: true });
          return;
        }
        draw(app);
        app.canvas.style.width = '100%';
        app.canvas.style.height = 'auto';
        app.canvas.style.display = 'block';
        host.replaceChildren(app.canvas);
        app.render();
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (initialized) app.destroy({ removeView: true }, { children: true });
    };
  }, []);

  return (
    <section aria-labelledby="e01-diagram-title" className="sagittal-diagram">
      <h2 id="e01-diagram-title">Diagrama sagital</h2>
      <p>{sagittalDescription}</p>
      <div ref={hostRef} aria-hidden="true" data-role="sagittal-canvas" />
      {failed ? (
        <p>No se pudo dibujar el diagrama; la descripción textual contiene toda la información.</p>
      ) : null}
    </section>
  );
}
