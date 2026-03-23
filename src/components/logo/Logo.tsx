// src/app/components/logo/Logo.tsx
import Image from "next/image";
import clsx from "clsx";

// the logo SVG
interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}
export function Logo({ className, width = 240, height = 120 }: LogoProps) {
  return (
    <Image
      aria-hidden="true"
      src="/wikigraph3d.svg"
      alt=""
      width={width}
      height={height}
      className={className}
    />
  );
}

export function StyledLogo({ className, width, height }: LogoProps) {
  return (
    <span className={clsx(className, "relative inline-block")}>
      <Logo
        className="absolute inset-0 dark:blur-xs my-10"
        width={width}
        height={height}
      />
      <Logo
        className="relative block my-10 drop-shadow-lg dark:drop-shadow-none"
        width={width}
        height={height}
      />
    </span>
  );
}
