export function Logo({
  className = "h-10 w-auto",
  onDark = false,
}: {
  className?: string;
  /** Set true when the logo sits on an always-dark surface (e.g. the footer). */
  onDark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Logo mark — white chip keeps the artwork crisp in dark mode */}
      <img
        src="/images/roki-logo.png"
        alt="ROKI Construction Ltd logo"
        className="h-full w-auto rounded-lg bg-white p-[3px] ring-1 ring-black/10 dark:ring-white/10"
      />

      {/* Wordmark */}
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-[0.12em] ${
            onDark ? "text-primary-light" : "text-primary-dark dark:text-primary-light"
          }`}
        >
          ROKI
        </span>
        <span
          className={`mt-1 text-[8px] font-semibold tracking-[0.28em] ${
            onDark ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          CONSTRUCTION
        </span>
      </span>
    </span>
  );
}
