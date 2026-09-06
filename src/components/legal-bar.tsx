import { Link } from "@tanstack/react-router";
import { LEGAL_NFA, LEGAL_USE_IS_AGREEMENT, PRIVACY_HOVER, PRIVACY_PATH, PRIVACY_TITLE, TERMS_HOVER, TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

export function LegalBar() {
  return (
    <p className="mt-2 w-full max-w-none text-justify font-mono text-[10px] leading-relaxed tracking-[0.02em] text-muted/80">
      {LEGAL_USE_IS_AGREEMENT}{" "}
      <Link to={TERMS_PATH} className="legal-purple underline-offset-2 hover:underline" title={TERMS_HOVER}>
        {TERMS_TITLE}
      </Link>
      {" · "}
      <Link to={PRIVACY_PATH} className="legal-purple underline-offset-2 hover:underline" title={PRIVACY_HOVER}>
        {PRIVACY_TITLE}
      </Link>
      . {LEGAL_NFA}
    </p>
  );
}
