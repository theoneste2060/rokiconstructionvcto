export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Building structure icon */}
      <rect x="4" y="18" width="10" height="20" rx="1" className="fill-primary" />
      <rect x="17" y="8" width="10" height="30" rx="1" className="fill-primary/80" />
      <rect x="30" y="14" width="10" height="24" rx="1" className="fill-primary/60" />
      <rect x="6" y="16" width="6" height="2" className="fill-primary-light" />
      <rect x="19" y="6" width="6" height="2" className="fill-primary-light" />
      <rect x="32" y="12" width="6" height="2" className="fill-primary-light" />
      {/* Roof line */}
      <path d="M2 18L22 2L42 18" stroke="#284932" strokeWidth="2.5" strokeLinecap="round" />

      {/* Text */}
      <text x="52" y="22" className="fill-primary-dark dark:fill-primary-light" fontSize="16" fontWeight="800" fontFamily="Georgia, serif" letterSpacing="1.5">
        ROKI
      </text>
      <text x="52" y="36" className="fill-gray-600 dark:fill-gray-400" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif" letterSpacing="2">
        CONSTRUCTION
      </text>
    </svg>
  );
}