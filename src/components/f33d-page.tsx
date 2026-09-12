import { Link } from "@tanstack/react-router";
import { GodzillaMark, GmRainbow } from "@/components/godzilla-mark";
import { Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SeoImage } from "@/components/seo-image";
import { SupportDonate } from "@/components/support-donate";
import {
  GIF_FEED_CHAIN,
  GIF_FEED_CHAIN_NAME,
  GIF_FEED_GIFT,
  GIF_FEED_GIFT_NAME,
  GIF_FEED_LARGE,
  GIF_FEED_LARGE_NAME,
  SEO_TAB_SPONSOR,
  SPONSOR_PATH,
  TAB_COFFEE,
  TAB_FEED,
  TAB_FEED_GROWL,
  TAB_SPONSOR,
} from "@/lib/brand";

export function F33dPage() {
  return (
    <Shell>
      <SeoCopy />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <GodzillaMark className="h-10 w-16 text-high" beam="green" />
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <GmRainbow text={TAB_FEED} />
          </h1>
        </div>
        <p className="mt-4 text-lg font-bold leading-relaxed text-high">{TAB_FEED_GROWL}</p>
        <SeoImage
          src={GIF_FEED_LARGE}
          alt={GIF_FEED_LARGE_NAME}
          title={GIF_FEED_LARGE_NAME}
          desc={GIF_FEED_LARGE_NAME}
          width={480}
          height={270}
          className="mt-4 h-auto w-full max-w-[480px] rounded-md border border-rule"
        />
        <SupportDonate />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <figure className="rounded-md border border-rule p-3">
            <SeoImage
              src={GIF_FEED_GIFT}
              alt={GIF_FEED_GIFT_NAME}
              title={GIF_FEED_GIFT_NAME}
              desc={GIF_FEED_GIFT_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px]"
            />
            <figcaption className="mt-2 text-center text-xs text-muted">
              Liberapay / Tidelift / thanks.dev donation type — BTC or USDC keeps the servers fed.
            </figcaption>
          </figure>
          <figure className="rounded-md border border-rule p-3">
            <SeoImage
              src={GIF_FEED_CHAIN}
              alt={GIF_FEED_CHAIN_NAME}
              title={GIF_FEED_CHAIN_NAME}
              desc={GIF_FEED_CHAIN_NAME}
              width={200}
              height={200}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[200px]"
            />
            <figcaption className="mt-2 text-center text-xs text-muted">
              Open Collective donation type — transparent on-chain funding with public explorer wallets.
            </figcaption>
          </figure>
        </div>
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/c0ff33" className="hover:underline">
            {TAB_COFFEE}
          </Link>
          {" — optional $4.20 cup for long programming days at s1r1us.ai."}
        </p>
        <p className="mt-2 font-mono text-xs text-oss">
          <Link to={SPONSOR_PATH} className="hover:underline" title={`${TAB_SPONSOR} (${SEO_TAB_SPONSOR})`}>
            {TAB_SPONSOR}
          </Link>
          {" — every GitHub FUNDING.yml donation type mapped to these BTC / USDC rails."}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          iOS / Google Play design: onboard compute. The app keeps your xAI / Grok key in the device
          keychain, GETs 7-B0T JSON from this host, and Ask Grok on-device. This host never receives
          spend keys. Gifts here cover those apps. See{" "}
          <Link to="/compute" className="text-tab hover:underline">
            BYO C0MPUT3
          </Link>
          .
        </p>
      </main>
    </Shell>
  );
}
