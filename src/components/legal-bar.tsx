import { Link } from "@tanstack/react-router";
import { LEGAL_NFA, LEGAL_USE_IS_AGREEMENT, TERMS_HOVER, TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

export function LegalBar() {
  return (
    <p className="mt-2 max-w-5xl font-mono text-[10px] leading-relaxed tracking-[0.02em] text-muted/80">
      {LEGAL_USE_IS_AGREEMENT}{" "}
      <Link to={TERMS_PATH} className="text-oss underline-offset-2 hover:underline" title={TERMS_HOVER}>
        {TERMS_TITLE}
      </Link>
      . {LEGAL_NFA}
    </p>
  );
}
