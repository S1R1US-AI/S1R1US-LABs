/** Robotic Godzilla — laser visor. Body follows currentColor; beams stay red. */
export function GodzillaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 40" className={className} aria-hidden fill="currentColor">
      {/* dorsal fins */}
      <path d="M14 4l3 10H12zm7-2l3 12h-5zm7 1l4 11h-6zm8 2l5 9h-7z" />
      {/* helmet plate */}
      <path d="M10 14h36l-2 5H12z" />
      {/* skull / chassis */}
      <path d="M8 19h40v12H8z" opacity="0.92" />
      <path d="M12 19h32v3H12z" />
      {/* visor slot */}
      <rect x="14" y="23" width="28" height="6" fill="#070908" />
      {/* laser eyes */}
      <rect x="17" y="24.5" width="8" height="3" fill="#ff1f1f" />
      <rect x="31" y="24.5" width="8" height="3" fill="#ff1f1f" />
      <rect x="19" y="24.5" width="3" height="3" fill="#ffd24a" />
      <rect x="33" y="24.5" width="3" height="3" fill="#ffd24a" />
      {/* beams */}
      <rect x="48" y="25" width="24" height="1.6" fill="#ff1f1f" />
      <rect x="48" y="26.7" width="18" height="1.1" fill="#ff7a18" opacity="0.85" />
      {/* jaw + teeth */}
      <path d="M14 31h28l-3 6H17z" opacity="0.9" />
      <rect x="18" y="32.5" width="3" height="3" fill="#070908" />
      <rect x="24" y="32.5" width="3" height="3" fill="#070908" />
      <rect x="30" y="32.5" width="3" height="3" fill="#070908" />
      <rect x="36" y="32.5" width="3" height="3" fill="#070908" />
      {/* shoulders / arms */}
      <path d="M2 28h8v10H2zM46 28h8v10h-8z" />
      {/* chest reactor */}
      <rect x="24" y="29" width="8" height="2" fill="#ff1f1f" opacity="0.7" />
    </svg>
  );
}

export function GmRainbow({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className ? `gm-rainbow ${className}` : "gm-rainbow"} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}-${i}`} style={{ animationDelay: `${(i % 12) * -0.28}s` }}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}
