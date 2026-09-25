export default function BrandMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#0F172A" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="#D4AF37" strokeWidth="2.2" strokeDasharray="40 12" />
      <circle cx="16" cy="7.5" r="2.6" fill="#DC2626" />
    </svg>
  );
}
