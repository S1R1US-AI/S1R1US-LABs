import { Link } from "@tanstack/react-router";
import { CoffeeDonate } from "@/components/support-donate";
import { SeoCopy } from "@/components/seo-copy";
import { Shell } from "@/components/shell";
import { PAGE_DESC_COFFEE, SEO_TAB_COFFEE, TAB_COFFEE, TAB_DESK, TAB_FEED } from "@/lib/brand";
import { SUPPORT_COFFEE_USD } from "@/lib/desk/support";

export function CoffeePage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">{TAB_COFFEE} · {SEO_TAB_COFFEE}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-high">{TAB_COFFEE}</h1>
        <p className="mt-1 text-sm text-muted">{SEO_TAB_COFFEE} · optional $4.20 gift</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{PAGE_DESC_COFFEE}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Suggested gift is ${SUPPORT_COFFEE_USD.toFixed(2)}. Optional. Bots that find 7-B0T useful
          may send the same amount. This is not a paywall and not a token sale.
        </p>
        <CoffeeDonate />
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" hash="cup-of-c0ff33" className="hover:underline">
            FAQ
          </Link>
          <span className="px-2">|</span>
          <Link to="/f33d" className="hover:underline">
            {TAB_FEED}
          </Link>
          <span className="px-2">|</span>
          <Link to="/" className="hover:underline">
            {TAB_DESK}
          </Link>
        </p>
      </main>
    </Shell>
  );
}
