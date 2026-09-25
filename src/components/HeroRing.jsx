const NODES = [
  { x: 230, y: 64, l1: "HRMS", l2: "software solutions" },
  { x: 396, y: 230, l1: "Payroll, TDS", l2: "& compliance" },
  { x: 230, y: 396, l1: "Registration", l2: "IPR & ISO" },
  { x: 64, y: 230, l1: "Corporate", l2: "retreats" },
];

/* The four-vertical ring illustration in the home hero */
export default function HeroRing() {
  return (
    <svg className="ring" viewBox="0 0 460 460" role="img" aria-label="Four connected service verticals around a central 360 Biz Health hub: HRMS software solutions; payroll, TDS and compliance; business registration, IPR and ISO; corporate retreats.">
      <circle cx="230" cy="230" r="166" fill="none" stroke="rgba(255,255,255,.10)" />
      <circle cx="230" cy="230" r="166" fill="none" stroke="#D4AF37" strokeWidth="1.4" strokeDasharray="6 14" strokeLinecap="round" opacity=".75" />
      <circle cx="230" cy="230" r="104" fill="none" stroke="rgba(20,184,166,.35)" strokeDasharray="2 9" />
      <circle cx="230" cy="230" r="70" fill="#111c37" stroke="rgba(255,255,255,.14)" />
      <text x="230" y="228" textAnchor="middle" fontFamily="Newsreader, serif" fontSize="40" fill="#ffffff">360</text>
      <text x="230" y="252" textAnchor="middle" fontSize="11.5" letterSpacing="1" fill="#D4AF37">BIZ HEALTH</text>
      {NODES.map((o) => (
        <g key={o.l1}>
          <circle cx={o.x} cy={o.y} r="52" fill="#0F172A" stroke="rgba(212,175,55,.55)" />
          <text x={o.x} y={o.y - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">{o.l1}</text>
          <text x={o.x} y={o.y + 15} textAnchor="middle" fontSize="11.5" fill="rgba(255,255,255,.66)">{o.l2}</text>
        </g>
      ))}
    </svg>
  );
}
