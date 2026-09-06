import { TAB_GM } from "@/lib/brand";

/** Robotic Godzilla — laser visor. Body follows currentColor; beams stay red unless `beam="green"`. */
export function GodzillaMark({ className, beam = "red" }: { className?: string; beam?: "red" | "green" }) {
  const laser = beam === "green" ? "#3dff1a" : "#ff1f1f";
  const hot = beam === "green" ? "#b7ff7a" : "#ffd24a";
  const trail = beam === "green" ? "#6fbf63" : "#ff7a18";
  return (
    <svg viewBox="0 0 72 40" className={className} aria-hidden fill="currentColor">
      <title>G0DZ1LLa M0D3 (Godzilla mode) — AI agents bitcoin accumulation agent</title>
      <desc>S1R1US Labs Godzilla mark. AI agents. bitcoin accumulation agent. AI trading bots. Bitcoin trading agents.</desc>
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
      <rect x="17" y="24.5" width="8" height="3" fill={laser} />
      <rect x="31" y="24.5" width="8" height="3" fill={laser} />
      <rect x="19" y="24.5" width="3" height="3" fill={hot} />
      <rect x="33" y="24.5" width="3" height="3" fill={hot} />
      {/* beams */}
      <rect x="48" y="25" width="24" height="1.6" fill={laser} />
      <rect x="48" y="26.7" width="18" height="1.1" fill={trail} opacity="0.85" />
      {/* jaw + teeth */}
      <path d="M14 31h28l-3 6H17z" opacity="0.9" />
      <rect x="18" y="32.5" width="3" height="3" fill="#070908" />
      <rect x="24" y="32.5" width="3" height="3" fill="#070908" />
      <rect x="30" y="32.5" width="3" height="3" fill="#070908" />
      <rect x="36" y="32.5" width="3" height="3" fill="#070908" />
      {/* shoulders / arms */}
      <path d="M2 28h8v10H2zM46 28h8v10h-8z" />
      {/* chest reactor */}
      <rect x="24" y="29" width="8" height="2" fill={laser} opacity="0.7" />
    </svg>
  );
}

export function GmRainbow({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className ? `godzilla-mode gm-rainbow ${className}` : "godzilla-mode gm-rainbow"} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}-${i}`} style={{ animationDelay: `${(i % 12) * -0.28}s` }}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}

/** Sitewide / systemwide label: G0DZ1LLa M0D3 always rainbow. */
export function GodzillaModeLabel({ className }: { className?: string }) {
  return <GmRainbow text={TAB_GM} className={className} />;
}

/** Paint every G0DZ1LLa M0D3 in a string rainbow. */
export function RainbowGodzillaText({ text }: { text: string }) {
  const parts = text.split(/(G0DZ1LLa M0D3)/g);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (p === TAB_GM ? <GodzillaModeLabel key={i} /> : p))}
    </>
  );
}

