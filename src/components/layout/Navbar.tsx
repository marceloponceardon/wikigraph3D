"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  //  {
  //    href: "https://github.com/marsponce/wikigraph3D",
  //    label: "Repo",
  //  },
  {
    href: "/",
    label: "Home",
    icon: <Logo width={48} />,
  },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-x-2 text-base flex flex-row items-center font-light space-x-2 justify-center">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href;

          return (
            <li key={label}>
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex flex-row items-center gap-1",
                  isActive && "font-bold",
                )}
                aria-label={label}
              >
                {icon ? (
                  <>
                    {icon}
                    {label}
                  </>
                ) : (
                  label
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
