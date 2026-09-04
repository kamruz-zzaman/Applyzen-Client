// An enso (the hand-drawn zen circle) as the mark — ties "Applyzen" directly
// to its namesake rather than another generic geometric SaaS glyph.
export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <circle
        cx="20"
        cy="20"
        r="15"
        stroke="#d97706"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="75.4 18.8"
        transform="rotate(-100 20 20)"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-base font-semibold tracking-tight text-stone-900">Applyzen</span>
    </span>
  );
}
