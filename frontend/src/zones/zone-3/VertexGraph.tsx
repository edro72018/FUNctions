/// <reference types="vite/client" />
import { Coordinates, Mafs, Plot, Point, Theme } from 'mafs';
import 'mafs/core.css';
import type { ExactNumber } from '../../shared/validation';

export interface VertexGraphProps {
  readonly h: ExactNumber | null;
  readonly k: ExactNumber | null;
}

export const vertexGraphDescription =
  'La gráfica representa f(x) = (x − h)² + k con a = 1. El punto objetivo es (3, 2).';

function displayNumber(value: ExactNumber | null): number {
  if (value === null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Representación de E08 con Mafs. Solo presenta la parábola, el vértice actual
 * y el punto objetivo; no valida, no persiste y no escribe estado de dominio.
 * Los campos h y k operables viven fuera de la gráfica.
 */
export function VertexGraph({ h, k }: VertexGraphProps) {
  const currentH = displayNumber(h);
  const currentK = displayNumber(k);

  return (
    <section aria-labelledby="e08-graph-title" className="vertex-graph">
      <h2 id="e08-graph-title">Gráfica de la trayectoria</h2>
      <p>{vertexGraphDescription}</p>
      <p>
        Vértice actual: ({h ?? 'sin valor'}, {k ?? 'sin valor'}). Usa los campos h y k que están
        fuera de la gráfica para ajustarlo.
      </p>
      <div aria-hidden="true" data-role="vertex-canvas" className="vertex-graph-canvas">
        <Mafs
          height={320}
          pan={false}
          zoom={false}
          viewBox={{ x: [-2, 8], y: [-3, 7], padding: 0.5 }}
          preserveAspectRatio="contain"
        >
          <Coordinates.Cartesian />
          <Plot.OfX y={x => (x - currentH) ** 2 + currentK} color={Theme.blue} />
          <Point x={3} y={2} color={Theme.orange} />
          <Point x={currentH} y={currentK} color={Theme.green} />
        </Mafs>
      </div>
    </section>
  );
}
