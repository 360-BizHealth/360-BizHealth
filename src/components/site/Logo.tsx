export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const textColor = variant === "dark" ? "#1a1a2e" : "#ffffff";
  return (
    <svg
      viewBox="0 0 220 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="360 Biz Health"
    >
      <title>360 Biz Health</title>
      <text
        x="0"
        y="28"
        fill={textColor}
        fontFamily="Poppins, ui-sans-serif, system-ui, sans-serif"
        fontSize="26"
        fontWeight="700"
      >
        360 Biz Health
      </text>
    </svg>
  );
}
