import logo from "../assets/brand/logo.svg";
import logoReverse from "../assets/brand/logo-reverse.svg";

/* The 360 Biz Health logo (vector, built from the brand PDF). `reverse` = cream on green. */
export default function BrandLogo({ reverse = false, height = 46, className = "brand__logo", alt = "360 Biz Health" }) {
  return (
    <img
      src={reverse ? logoReverse : logo}
      alt={alt}
      width={Math.round(height * 1.695)}
      height={height}
      className={className}
      decoding="async"
    />
  );
}
