const NODES = [
  { x: 240, y: 70, l1: "HRMS", l2: "software solutions" },
  { x: 410, y: 240, l1: "Payroll, TDS", l2: "& compliance" },
  { x: 240, y: 410, l1: "Registration", l2: "IPR & ISO" },
  { x: 70, y: 240, l1: "Corporate", l2: "retreats" },
];
const DOTS = [[360, 120], [360, 360], [120, 360], [120, 120]];

/* The four service verticals around the 360 Biz Health hub (home hero). */
export default function HeroRing() {
  return (
    <svg className="ring" viewBox="0 0 480 480" role="img" aria-labelledby="ring-title">
      <title id="ring-title">Four connected service verticals around a central 360 Biz Health hub: HRMS software solutions; payroll, TDS and compliance; business registration, IPR and ISO; corporate retreats.</title>
      <circle cx="240" cy="240" r="170" fill="none" stroke="#719078" strokeWidth="1.5" strokeDasharray="5 9" />
      <circle cx="240" cy="240" r="112" fill="none" stroke="#E8DDC9" strokeWidth="14" />
      {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#F26423" />)}
      <circle cx="240" cy="240" r="74" fill="#FFFFFF" stroke="#1E5A3C" strokeWidth="3" />
      <text x="240" y="244" textAnchor="middle" fontFamily="Poppins, Inter, sans-serif" fontWeight="700" fontSize="40" fill="#0C4727">360</text>
      <text x="240" y="268" textAnchor="middle" fontSize="11" letterSpacing="2.2" fontWeight="600" fill="#4F6B57">BIZ HEALTH</text>
      <circle cx="292" cy="190" r="9" fill="#F26423" />
      {NODES.map((o) => (
        <g key={o.l1}>
          <circle cx={o.x} cy={o.y} r="56" fill="#FFFFFF" stroke="#1E5A3C" strokeWidth="1.5" />
          <text x={o.x} y={o.y - 2} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0C4727">{o.l1}</text>
          <text x={o.x} y={o.y + 16} textAnchor="middle" fontSize="11" fill="#55645A">{o.l2}</text>
        </g>
      ))}
    </svg>
  );
}
