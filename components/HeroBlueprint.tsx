const CENTER = 200;
const VIEWBOX = 400;

function hexPoints(radius: number, rotationDeg = 0): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = ((60 * i - 90 + rotationDeg) * Math.PI) / 180;
    const x = CENTER + radius * Math.cos(angle);
    const y = CENTER + radius * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function tickMarks(radius: number, count: number, length: number): string {
  let d = "";
  for (let i = 0; i < count; i++) {
    const angle = ((360 * i) / count) * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x1 = CENTER + radius * cos;
    const y1 = CENTER + radius * sin;
    const x2 = CENTER + (radius - length) * cos;
    const y2 = CENTER + (radius - length) * sin;
    d += `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `;
  }
  return d.trim();
}

/**
 * Purely decorative technical-drawing motif for the hero's empty right side:
 * concentric hexagons echoing the wordmark, a crosshair, perimeter ticks, a
 * radius callout, and corner registration marks. No semantic content, so it
 * carries no alt text and is skipped by assistive tech.
 */
export default function HeroBlueprint() {
  return (
    <svg
      className="hero-blueprint"
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <line className="bp-line" x1="0" y1={CENTER} x2={VIEWBOX} y2={CENTER} strokeWidth="1" />
      <line className="bp-line" x1={CENTER} y1="0" x2={CENTER} y2={VIEWBOX} strokeWidth="1" />

      <g className="bp-ring bp-ring-outer">
        <polygon points={hexPoints(178)} strokeWidth="1" />
        <path d={tickMarks(178, 24, 8)} strokeWidth="1" />
      </g>

      <g className="bp-ring bp-ring-inner">
        <polygon points={hexPoints(138, 8)} strokeWidth="1.25" />
        <polygon points={hexPoints(100, -6)} strokeWidth="1.25" />
      </g>

      <polygon points={hexPoints(58)} strokeWidth="1.5" />

      {/* Radius callout */}
      <line x1={CENTER} y1={CENTER} x2={CENTER + 138} y2={CENTER} strokeWidth="1" strokeDasharray="2 4" />
      <text
        x={CENTER + 70}
        y={CENTER - 10}
        className="bp-label"
        fontSize="11"
        fill="currentColor"
        stroke="none"
      >
        R138
      </text>

      {/* Corner registration marks */}
      {[
        [24, 24],
        [VIEWBOX - 24, 24],
        [24, VIEWBOX - 24],
        [VIEWBOX - 24, VIEWBOX - 24],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} strokeWidth="1">
          <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
          <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
        </g>
      ))}
    </svg>
  );
}
