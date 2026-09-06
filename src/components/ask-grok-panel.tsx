import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shell";
import { getBearerToken } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PAGE_DESC_COMPUTE, SEO_TAB_COMPUTE, TAB_COMPUTE } from "@/lib/brand";

const KEY_SESSION = "s1r1us.byo-xai";

function loadKey() {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(KEY_SESSION) ?? "";
  } catch {
    return "";
  }
}

export function AskGrokPanel({ kicker = "Ask Grok" }: { kicker?: string }) {
  const { user, isPending } = useCurrentUserState();
  const [key, setKey] = useState(loadKey);
  const [question, setQuestion] = useState("Grade Bot 7 on this tape. Accumulate BTC — never short.");
  const [text, setText] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  async function onAsk() {
    setAsking(true);
    setErr(null);
    try {
      if (key) {
        try {
          window.sessionStorage.setItem(KEY_SESSION, key);
        } catch {
          /* ignore */
        }
      }
      const { askHeliosByo } = await import("@/lib/desk/grok");
      const res = await askHeliosByo({
        data: { xaiKey: key, question, bearer: getBearerToken() ?? undefined },
      });
      if (!res.ok) setErr(res.error);
      else setText(res.text);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ask Grok failed");
    } finally {
      setAsking(false);
    }
  }

  return (
    <Panel kicker={kicker} title={TAB_COMPUTE} kickerClass="text-tab" titleClass="text-medium">
      <p className="text-sm leading-relaxed text-muted">
        {PAGE_DESC_COMPUTE} Sign in with X for identity. Paste your xAI API key so Ask Grok spends{" "}
        <span className="text-fg">your</span> compute, not the operator SuperGrok bill. The key stays in
        this browser session — this host never stores it. {SEO_TAB_COMPUTE}.
      </p>
      {isPending ? <p className="mt-3 text-sm text-muted">Checking sign-in…</p> : null}
      {!isPending && !user ? (
        <p className="mt-3 text-sm">
          <Link to="/login" className="text-tab hover:underline">
            Sign in with X
          </Link>{" "}
          then return here.
        </p>
      ) : null}
      <label className="mt-4 block text-xs tracking-[0.12em] text-muted uppercase">
        xAI API key (your bill)
        <input
          type="password"
          autoComplete="off"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="xai-…"
          className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 font-mono text-sm text-fg"
        />
      </label>
      <label className="mt-3 block text-xs tracking-[0.12em] text-muted uppercase">
        Strategy question
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-fg"
        />
      </label>
      <div className="mt-3">
        <Button onClick={() => void onAsk()} disabled={asking || !user}>
          {asking ? <LoaderCircle className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
          Ask Grok
        </Button>
      </div>
      {err ? <p className="mt-3 text-sm text-down">{err}</p> : null}
      {text ? (
        <p className="mt-3 whitespace-pre-wrap border-t border-rule pt-3 text-sm leading-relaxed">{text}</p>
      ) : null}
    </Panel>
  );
}
