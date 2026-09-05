import { GodzillaMark, GmRainbow } from "@/components/godzilla-mark";
import { Panel, Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SupportDonate } from "@/components/support-donate";
import { TAB_FEED, TAB_FEED_GROWL, TAB_FEED_NOW, TAB_GM } from "@/lib/brand";

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
        <Panel className="mt-6" kicker={TAB_GM} title={TAB_FEED_NOW} kickerClass="text-high" titleClass="text-high">
          <p className="text-sm leading-relaxed text-muted">
            {TAB_FEED} sits next to {TAB_GM}. Same rainbow tab. Optional BTC / USDC covers hosting,
            the s1r1us.ai domain, and the open-source web / iOS / Play apps. Not the trading book.
          </p>
        </Panel>
        <SupportDonate />
      </main>
    </Shell>
  );
}
