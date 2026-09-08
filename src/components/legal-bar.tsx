import { Link } from "@tanstack/react-router";
import { PRIVACY_HOVER, PRIVACY_PATH, PRIVACY_TITLE, TERMS_HOVER, TERMS_PATH, TERMS_TITLE } from "@/lib/legal";

export function DisclaimerExpandBody() {
  return (
    <div className="space-y-2">
      <p className="w-full text-justify font-mono text-[10px] leading-relaxed text-muted">
        S1R1U$ L@B Strategies is NOT considered financial advice or a financial recommendation. S1R1US.ai
        and the 7-B0T H3DG3 Fund and any related systems are NOT LICENSED for financial advice. If you need
        real financial advice seek a licensed professional. S1R1U$ L@B Strategies and all related entities
        such as Desk, Lab, website or systems are for EDUCATION purpose ONLY. By accessing, browsing,
        registering, playing, or otherwise using this website, the iOS or Google app, any agent API,
        PR3D1CT10N$, L3AD3R B0ARD, or any related function, you agree to the{" "}
        <Link to={TERMS_PATH} className="legal-purple hover:underline" title={TERMS_HOVER}>
          {TERMS_TITLE}
        </Link>
        {" "}and the{" "}
        <Link to={PRIVACY_PATH} className="legal-purple hover:underline" title={PRIVACY_HOVER}>
          {PRIVACY_TITLE}
        </Link>
        . If you do not agree, do not use the system. Use is 100 percent at your own risk. We pay ZERO legal
        fees. Always seek a licensed attorney before live trading. {TERMS_TITLE} · {PRIVACY_TITLE} should be
        reviewed by our licensed legal counsel.
      </p>
      <p className="w-full max-w-none text-justify font-mono text-[10px] leading-relaxed tracking-[0.02em] text-muted/80">
        Use of this website, desk, lab, iOS/Google app, SUP3R B0WL, L3AD3R B0ARD, PR3D1CT10N$, W1S3 0WL$,
        (or external AI Agent games or experiments) and any related system on S1R1US.ai is 100 percent at your
        own risk. S1R1US.ai is NOT a financial advisor and is not licensed for financial advice. ALWAYS seek a
        licensed professional (attorney or financial broker) before trying our service. Not a broker-dealer.
        Not an investment adviser. Not a recommendation to buy, sell, or hold bitcoin, any token, or any other
        asset. Education and proof of concept only. Experimental AI. Invest only on the advice of a licensed
        advisor. You can lose all funds.
      </p>
    </div>
  );
}

export function LegalBar() {
  return <DisclaimerExpandBody />;
}
