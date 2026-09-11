import { Link } from "@tanstack/react-router";
import { LEGAL_DISCLAIMER_PARAS } from "@/lib/desk/disclaimer";
import { PRIVACY_HOVER, PRIVACY_PATH, PRIVACY_TITLE, TERMS_HOVER, TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

export function DisclaimerExpandBody() {
  return (
    <div className="space-y-2">
      {LEGAL_DISCLAIMER_PARAS.map((p) => (
        <p key={p.slice(0, 24)} className="w-full text-justify font-mono text-[10px] leading-relaxed text-muted">
          {p}
        </p>
      ))}
      <p className="mt-2 w-full max-w-none text-justify font-mono text-[10px] leading-relaxed tracking-[0.02em] text-muted/80">
        Contract (unchanged):{" "}
        <Link to={TERMS_PATH} className="legal-purple underline-offset-2 hover:underline" title={TERMS_HOVER}>
          {TERMS_TITLE}
        </Link>
        {" · "}
        <Link to={PRIVACY_PATH} className="legal-purple underline-offset-2 hover:underline" title={PRIVACY_HOVER}>
          {PRIVACY_TITLE}
        </Link>
        . This DISCLAIMER does not rewrite those pages.
      </p>
    </div>
  );
}

export function LegalBar() {
  return <DisclaimerExpandBody />;
}
