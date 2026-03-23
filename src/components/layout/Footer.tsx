// src/app/components/Footer.tsx
import { version, name } from "../../../package.json";

export default function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 w-full pointer-events-none">
      <span className="absolute left-4 bottom-4 text-xs">
        {name} {version}
      </span>
    </footer>
  );
}
