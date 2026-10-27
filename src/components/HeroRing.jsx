/* The four service verticals around the 360 Biz Health hub (home hero).
   Nodes sit on the outer ring; spokes tie each one back to the hub. */
const C = 260;
const R = 168;
const NODES = [
  { x: C, y: C - R, l1: "HRMS", l2: "software solutions" },
  { x: C + R, y: C, l1: "Payroll, TDS", l2: "& compliance" },
  { x: C, y: C + R, l1: "Registration", l2: "IPR & ISO" },
  { x: C - R, y: C, l1: "Corporate", l2: "retreats" },
];
const D = Math.round(R * Math.SQRT1_2);
const DOTS = [[C + D, C - D], [C + D, C + D], [C - D, C + D], [C - D, C - D]];

export default function HeroRing() {
  return (
    <svg className="ring" viewBox="0 0 520 520" role="img" aria-labelledby="ring-title">
      <title id="ring-title">Four connected service verticals around a central 360 Biz Health hub: HRMS software solutions; payroll, TDS and compliance; business registration, IPR and ISO; corporate retreats.</title>
      <circle cx={C} cy={C} r={R + 70} fill="#F1EADB" opacity=".55" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="#719078" strokeWidth="1.5" strokeDasharray="4 8" />
      <circle cx={C} cy={C} r="112" fill="none" stroke="#E8DDC9" strokeWidth="12" />
      {NODES.map((o) => <line key={"s" + o.l1} x1={C} y1={C} x2={o.x} y2={o.y} stroke="#719078" strokeWidth="1" opacity=".45" />)}
      {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6.5" fill="#F26423" />)}
      <circle cx={C} cy={C} r="80" fill="#FFFFFF" stroke="#1E5A3C" strokeWidth="3" />
      <text x={C} y={C + 6} textAnchor="middle" fontFamily="Poppins, Inter, sans-serif" fontWeight="700" fontSize="44" fill="#0C4727">360</text>
      <text x={C} y={C + 31} textAnchor="middle" fontSize="11.5" letterSpacing="2.4" fontWeight="600" fill="#4F6B57">BIZ HEALTH</text>
      <circle cx={C + 55} cy={C - 56} r="9" fill="#F26423" />
      {NODES.map((o) => (
        <g key={o.l1}>
          <circle cx={o.x} cy={o.y} r="64" fill="#FFFFFF" stroke="#1E5A3C" strokeWidth="1.5" />
          <text className="ring__l1" x={o.x} y={o.y - 2} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0C4727">{o.l1}</text>
          <text className="ring__l2" x={o.x} y={o.y + 18} textAnchor="middle" fontSize="12.5" fill="#55645A">{o.l2}</text>
        </g>
      ))}
    </svg>
  );
}
