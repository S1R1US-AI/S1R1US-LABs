import { Link } from "@tanstack/react-router";
import { GodzillaMark, GmRainbow } from "@/components/godzilla-mark";
import { Shell } from "@/components/shell";
import { SeoCopy } from "@/components/seo-copy";
import { SupportDonate } from "@/components/support-donate";
import { TAB_COFFEE, TAB_FEED, TAB_FEED_GROWL } from "@/lib/brand";

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
        <p className="mt-6 font-mono text-xs text-oss">
          <Link to="/c0ff33" className="hover:underline">
            {TAB_COFFEE}
          </Link>
          {" — optional $4.20 cup for long programming days at s1r1us.ai."}
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
