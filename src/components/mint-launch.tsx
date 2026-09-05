import { useState } from "react";
import { Panel } from "@/components/shell";
import { CHECKLIST, GITHUB_URL, MINT_FLOOR, OSS_NEEDS, ROADMAP, ROADMAP_STEALTH, ROADMAP_TOTAL, type LaunchCheck } from "@/lib/launch/model";
import { cn, USD_TONE } from "@/lib/utils";

function usd(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `$${n}`;
}

function usdRange(a: [number, number]) {
  if (a[0] === 0 && a[1] === 0) return "—";
  return a[0] === a[1] ? usd(a[0]) : `${usd(a[0])}–${usd(a[1])}`;
}

export function MintLaunchPanel({
  publicSite = false,
}: {
  publicSite?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (publicSite) return null;
  const showMintHow = true;
  const rows = ROADMAP;
  const phases = [...new Set(CHECKLIST.map((c) => c.phase))];
  return (
    <Panel className="mt-4" kicker="pump.fun" title="Minimum to mint and launch">
      <p className="text-sm text-fg">
        Floor to exist on pump.fun:{" "}
        <span className={USD_TONE}>
          {usd(MINT_FLOOR.minUsd)}–{usd(MINT_FLOOR.maxUsd)}
        </span>{" "}
        (SOL fees). Create is $0. Curve and PumpSwap graduate at $0 extra. {usd(150000)} is bot-7
        treasury (M6), not a Uniswap seed.
      </p>
      {showMintHow ? (
        <ol className="mt-3 space-y-1.5 text-sm text-muted">
          {MINT_FLOOR.need.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Mint steps stay off this public page until the mint tx is confirmed. Funding ranges below
          are what a launch may cost — not a sale of the trading book.
        </p>
      )}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((m) => (
          <li key={m.id} className="rounded-md border border-rule px-3 py-2">
            <p className="font-mono text-[11px] text-muted">
              M{m.n} · {m.name}
            </p>
            <p className={cn("mt-1 font-mono text-sm tabular-nums", USD_TONE)}>
              {usd(m.minUsd)}–{usd(m.maxUsd)}
            </p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-4 flex w-full items-baseline justify-between gap-3 rounded-md py-1 text-left hover:bg-fg/4"
      >
        <span className="text-xs font-medium tracking-[0.08em] expand-ctl uppercase">
          Full roadmap + ordered requirements
        </span>
        <span className="font-mono text-[11px] expand-ctl">{open ? "collapse" : "expand"}</span>
      </button>
      {open ? (
        <>
          <p className="mt-3 text-sm text-muted">
            Order is launch order. Amounts are cash you may spend — not a raise target.{" "}
            {showMintHow ? ROADMAP_STEALTH : "Public mint recipe is withheld until TOKEN_LAUNCHED."}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead>
                <tr className="border-b border-rule text-xs font-medium tracking-[0.08em] text-muted uppercase">
                  <th className="py-2 pr-3">Step</th>
                  <th className="py-2 pr-3">Goal</th>
                  <th className="py-2 pr-3">When</th>
                  <th className={cn("py-2 pr-3 text-right", USD_TONE)}>Min</th>
                  <th className={cn("py-2 pr-3 text-right", USD_TONE)}>Max</th>
                  <th className="py-2 pr-3">Public?</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-b border-rule/70 align-top">
                    <td className="py-2 pr-3 font-mono text-xs text-muted">M{m.n}</td>
                    <td className="py-2 pr-3">
                      <span className="font-medium text-fg">{m.name}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {m.goal}
                      </span>
                      {showMintHow ? <span className="mt-0.5 block text-[11px] text-muted">{m.hold}</span> : null}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted">{m.when}</td>
                    <td className={cn("py-2 pr-3 text-right font-mono text-xs tabular-nums", USD_TONE)}>
                      {usd(m.minUsd)}
                    </td>
                    <td className={cn("py-2 pr-3 text-right font-mono text-xs tabular-nums", USD_TONE)}>
                      {usd(m.maxUsd)}
                    </td>
                    <td className="py-2 pr-3 font-mono text-[11px] uppercase text-muted">
                      {m.publicAfterMint ? "after mint" : "admin"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-2 pr-3 font-mono text-xs" colSpan={3}>
                    Sum of ranges (do not add every max — M5+M6 are optional)
                  </td>
                  <td className={cn("py-2 pr-3 text-right font-mono text-xs", USD_TONE)}>
                    {usdRange([ROADMAP_TOTAL[0], ROADMAP_TOTAL[0]])}
                  </td>
                  <td className={cn("py-2 pr-3 text-right font-mono text-xs", USD_TONE)}>
                    {usdRange([ROADMAP_TOTAL[1], ROADMAP_TOTAL[1]])}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-4 text-xs font-medium tracking-[0.08em] text-muted uppercase">
            Open source · {GITHUB_URL.replace("https://", "")}
          </p>
          <ol className="mt-2 space-y-1.5 text-sm text-muted">
            {OSS_NEEDS.map((row, i) => (
              <li key={row.id}>
                <span className="font-mono text-xs text-muted">{i + 1}.</span> {row.need}
              </li>
            ))}
          </ol>
          {showMintHow ? (
            <>
              <p className="mt-4 text-xs font-medium tracking-[0.08em] text-muted uppercase">
                Requirements in order of need
              </p>
              <ol className="mt-2 space-y-3">
                {phases.map((phase) => (
                  <li key={phase}>
                    <p className="text-sm font-medium text-fg">{phase}</p>
                    <ul className="mt-1 space-y-1 text-sm text-muted">
                      {CHECKLIST.filter((c) => c.phase === phase).map((c: LaunchCheck) => (
                        <li key={c.id}>
                          <span className={c.required ? "text-fg" : ""}>
                            {c.required ? "Required · " : "Optional · "}
                            {c.label}
                          </span>
                          <span className="mt-0.5 block text-xs">{c.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </>
      ) : null}
    </Panel>
  );
}
