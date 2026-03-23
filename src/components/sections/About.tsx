// src/app/components/sections/Main.tsx
import { StyledLogo } from "@/components/logo";

export default function About() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center-safe">
        <StyledLogo className="" />
        <div className="max-w-prose mx-auto space-y-4">
          <p>
            I&apos;m Mars, a developer based in Toronto who studied at the
            University of Toronto. I like to build reliable, efficient,
            well-designed software.
          </p>

          <p>
            <strong>Wikigraph3d</strong> is built with <strong>Next.js</strong>,{" "}
            <strong>Tailwind CSS</strong>,{" "}
            <strong>
              {process.env.NEXT_PUBLIC_DATABASE_NAME || "Supabase"}
            </strong>{" "}
            and deployed via{" "}
            <strong>{process.env.NEXT_PUBLIC_DEPLOY_ENV || "Netlify"}</strong>.
          </p>

          <p>
            The source for this project is available on{" "}
            <span className="relative inline-block">
              <span
                className="absolute blur text-sky-400 select-none"
                aria-hidden="true"
              >
                GitHub
              </span>
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}/${process.env.NEXT_PUBLIC_APP_NAME}`}
                className="relative text-sky-400"
              >
                GitHub
              </a>
            </span>
            . You can also see what else I&apos;m working on in my{" "}
            <span className="relative inline-block">
              <span
                className="absolute blur text-sky-400 select-none"
                aria-hidden="true"
              >
                profile
              </span>
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`}
                className="relative text-sky-400"
              >
                profile
              </a>
            </span>
            .
          </p>

          <p>
            If you&apos;d like to connect, find me on{" "}
            <span className="relative inline-block">
              <span
                className="absolute blur text-sky-400 select-none"
                aria-hidden="true"
              >
                GitHub
              </span>
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`}
                className="relative text-sky-400"
              >
                GitHub
              </a>
            </span>{" "}
            or reach out by email at{" "}
            <span className="relative inline-block">
              <span
                className="absolute z-0 blur text-sky-400 select-none font-extrabold"
                aria-hidden="true"
              >
                {process.env.NEXT_PUBLIC_CONTACT}
              </span>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT}`}
                className="relative text-sky-400"
              >
                {process.env.NEXT_PUBLIC_CONTACT}
              </a>
            </span>
            .
          </p>
        </div>
      </div>
    </>
  );
}
