import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Panel } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { APP_NAME, TAB_DESK } from "@/lib/brand";
import { useOperator } from "@/lib/desk/operator";
import { COIN_DOMAIN } from "@/lib/launch/model";
import { probeSiteHealth, type SiteHealth } from "@/lib/launch/site-health";

const LIVE_PATH = "/s1r1us";
const APEX = `https://${COIN_DOMAIN}`;

export function WebsitePortal() {
  const token = useOperator((s) => s.token);
  const [health, setHealth] = useState<SiteHealth | null>(null);
  const [busy, setBusy] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  async function ping(remount = false) {
    if (!token) return;
    setBusy(true);
    setErr(null);
    try {
      const h = await probeSiteHealth({ data: { token } });
      setHealth(h);
      if (remount) setFrameKey((k) => k + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Health probe failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    void ping(false);
  }, [token]);

  return (
    <div className="mt-6">
      <Panel kicker="Website" title={`${COIN_DOMAIN} live tape`}>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          This portal is the public {APP_NAME} page — live tape only. Same two-phase 5-minute pull as {TAB_DESK}
          (core then fill). No Wallet, no practice book, no launch notes. Apex {COIN_DOMAIN} is
          on DigitalOcean ingress — add the domain on the app so TLS matches this tape.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="primary" onClick={() => void ping(true)} disabled={busy}>
            <RefreshCw className={busy ? "size-4 animate-spin" : "size-4"} />
            Refresh live page
          </Button>
          <a
            className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm"
            href={LIVE_PATH}
            target="_blank"
            rel="noreferrer"
          >
            Open live build <ExternalLink className="size-3.5" />
          </a>
          <a
            className="inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm"
            href={APEX}
            target="_blank"
            rel="noreferrer"
          >
            Open {COIN_DOMAIN} <ExternalLink className="size-3.5" />
          </a>
          <Link to="/" className="inline-flex h-11 min-h-11 items-center rounded-md px-3 text-sm text-muted">
            Desk
          </Link>
        </div>
        {err ? <p className="mt-3 text-sm text-down">{err}</p> : null}
        {health ? (
          <dl className="mt-4 grid gap-2 font-mono text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted">Apex A</dt>
              <dd className="mt-0.5 text-fg">{health.apexA.join(" ") || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">www CNAME</dt>
              <dd className="mt-0.5 text-fg">{health.wwwCname.join(" ") || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">HTTPS</dt>
              <dd className="mt-0.5 text-fg">{health.tls}</dd>
            </div>
            <div>
              <dt className="text-muted">Verdict</dt>
              <dd className="mt-0.5 text-fg">{health.verdict}</dd>
            </div>
          </dl>
        ) : null}
      </Panel>

      <Panel className="mt-4" kicker="Portal" title="Real-time public build">
        <p className="mb-3 font-mono text-[11px] text-muted">
          Preview of {LIVE_PATH} — this app’s live public tape
        </p>
        <div className="overflow-hidden rounded-md border border-rule bg-bg">
          <iframe
            key={frameKey}
            title={`${COIN_DOMAIN} live tape`}
            src={LIVE_PATH}
            className="h-[70vh] w-full bg-bg"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </Panel>
    </div>
  );
}
