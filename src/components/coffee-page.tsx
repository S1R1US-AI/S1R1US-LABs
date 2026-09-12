import { Link } from "@tanstack/react-router";
import { CoffeeDonate } from "@/components/support-donate";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { Shell } from "@/components/shell";
import {
  GIF_COFFEE_CRYPTO,
  GIF_COFFEE_CRYPTO_NAME,
  GIF_COFFEE_LARGE,
  GIF_COFFEE_LARGE_NAME,
  GIF_COFFEE_TIP,
  GIF_COFFEE_TIP_NAME,
  PAGE_DESC_COFFEE,
  SEO_TAB_COFFEE,
  SEO_TAB_SPONSOR,
  SPONSOR_PATH,
  TAB_COFFEE,
  TAB_DESK,
  TAB_FEED,
  TAB_SPONSOR,
} from "@/lib/brand";
import { SUPPORT_COFFEE_USD } from "@/lib/desk/support";

export function CoffeePage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="font-mono text-xs tracking-[0.12em] text-oss uppercase">{TAB_COFFEE} · {SEO_TAB_COFFEE}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-high">{TAB_COFFEE}</h1>
        <p className="mt-1 text-sm text-muted">{SEO_TAB_COFFEE} · optional $4.20 gift</p>
        <SeoImage
          src={GIF_COFFEE_LARGE}
          alt={GIF_COFFEE_LARGE_NAME}
          title={GIF_COFFEE_LARGE_NAME}
          desc={GIF_COFFEE_LARGE_NAME}
          width={480}
          height={270}
          className="mt-4 h-auto w-full max-w-[480px] rounded-md border border-rule"
        />
        <p className="mt-3 text-sm leading-relaxed text-muted">{PAGE_DESC_COFFEE}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Suggested gift is ${SUPPORT_COFFEE_USD.toFixed(2)}. Optional. Bots that find 7-B0T useful
          may send the same amount. This is not a paywall and not a token sale.
        </p>
        <CoffeeDonate />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <figure className="rounded-md border border-rule p-3">
            <SeoImage
              src={GIF_COFFEE_TIP}
              alt={GIF_COFFEE_TIP_NAME}
              title={GIF_COFFEE_TIP_NAME}
              desc={GIF_COFFEE_TIP_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px]"
            />
            <figcaption className="mt-2 text-center text-xs text-muted">
              Ko-fi donation type — the same coffee tip as a direct bitcoin gift.
            </figcaption>
          </figure>
          <figure className="rounded-md border border-rule p-3">
            <SeoImage
              src={GIF_COFFEE_CRYPTO}
              alt={GIF_COFFEE_CRYPTO_NAME}
              title={GIF_COFFEE_CRYPTO_NAME}
              desc={GIF_COFFEE_CRYPTO_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px]"
            />
            <figcaption className="mt-2 text-center text-xs text-muted">
              Buy Me a Coffee donation type — $4.20 in BTC or native USDC.
            </figcaption>
          </figure>
        </div>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/faq" hash="cup-of-c0ff33" className="hover:underline">
            FAQ
          </Link>
          <span className="px-2">|</span>
          <Link to={SPONSOR_PATH} className="hover:underline" title={`${TAB_SPONSOR} (${SEO_TAB_SPONSOR})`}>
            {TAB_SPONSOR}
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
