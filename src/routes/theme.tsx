import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DeskWorkspace } from "@/components/desk-workspace";
import { Shell } from "@/components/shell";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { useDeskTape } from "@/lib/desk/tape-client";
import { rollBots, DESK_POLL_MS } from "@/lib/desk/roll-bots";

export const Route = createFileRoute("/theme")({
  component: ThemeTest,
  head: () => ({
    meta: [
      { title: "Theme · professional desk" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ThemeTest() {
  const { snap } = useDeskTape();
  const [copied] = useState(false);
  useEffect(() => {
    void rollBots({ force: true });
    const id = window.setInterval(() => void rollBots(), DESK_POLL_MS);
    return () => window.clearInterval(id);
  }, []);
  const briefs = useMemo(() => (snap ? runBots(snap) : []), [snap]);
  const call = useMemo(() => (snap ? heliosCall(snap, briefs, 1000) : null), [snap, briefs]);
  return (
    <Shell>
      <main className="mx-auto max-w-[1400px] px-3 py-4 sm:px-4">
        <p className="mb-3 text-xs text-muted">
          This chrome is live on the desk.{" "}
          <Link to="/" className="text-tab hover:underline">
            Open tape
          </Link>
        </p>
        <DeskWorkspace
          snap={snap}
          briefs={briefs}
          call={call}
          canAct={false}
          canFill={false}
          asking={false}
          copied={copied}
          grok={null}
          grokErr={null}
          onAsk={() => {
            window.location.assign("/compute");
          }}
          onCopy={() => undefined}
          onFill={() => undefined}
        />
      </main>
    </Shell>
  );
}
