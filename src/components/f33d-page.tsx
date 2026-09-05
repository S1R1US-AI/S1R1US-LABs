import { GodzillaMark, GmRainbow } from "@/components/godzilla-mark";
import { Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SupportDonate } from "@/components/support-donate";
import { TAB_FEED, TAB_FEED_GROWL } from "@/lib/brand";

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
        <SupportDonate />
      </main>
    </Shell>
  );
}
