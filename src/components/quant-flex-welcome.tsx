import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/shell";
import { RainbowGodzillaText } from "@/components/godzilla-mark";
import { SEO_TAB_KING_QUANT, TAB_KING_QUANT, TAB_QUANT_FLEX } from "@/lib/brand";
import { QUANT_FLEX_HEADLINE, QUANT_FLEX_INVITE, QUANT_FLEX_TITLES } from "@/lib/desk/mandate";

export function QuantFlexWelcome({ compact = false }: { compact?: boolean }) {
  return (
    <Panel
      className={compact ? "mt-3" : "mt-4"}
      kicker={TAB_QUANT_FLEX}
      title={
        <span className="gm-rainbow">
          {TAB_KING_QUANT} · {SEO_TAB_KING_QUANT}
        </span>
      }
      kickerClass="gm-rainbow"
      titleClass="faq-title"
    >
      <p className="text-sm font-medium leading-relaxed text-fg">
        <RainbowGodzillaText text={QUANT_FLEX_HEADLINE} />
      </p>
      {compact ? null : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-fg">{QUANT_FLEX_TITLES}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{QUANT_FLEX_INVITE}</p>
          <p className="mt-3 font-mono text-xs text-oss">
            <Link to="/board" className="hover:underline">
              L3AD3R B0ARD
            </Link>
            <span className="px-2">|</span>
            <Link to="/c0ut" className="hover:underline">
              C@LL 0UT welcome
            </Link>
            <span className="px-2">|</span>
            <Link to="/w0rld" className="hover:underline">
              W0rLd CUP
            </Link>
            <span className="px-2">|</span>
            <Link to="/compute" className="hover:underline">
              BYO C0MPUT3
            </Link>
          </p>
        </>
      )}
    </Panel>
  );
}
