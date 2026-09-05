import { useEffect, useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { HeliosCard, PaperCard, money, stanceClass, CallWords, bannerTone } from "@/components/helios-card";
import { LiveTracks } from "@/components/live-tracks";
import { Button } from "@/components/ui/button";
import { Panel, Shell } from "@/components/shell";
import { APP_CALLS, APP_NAME, TAB_LAB } from "@/lib/brand";
import { SeoCopy } from "@/components/seo-copy";
import { TapeFreezeBanner } from "@/components/tape-freeze";

import { askHelios } from "@/lib/desk/grok";
import { useOperator } from "@/lib/desk/operator";
import { looksLikeSecret } from "@/lib/desk/security";
import { DEFAULT_KNOBS, LAB_PRESETS, knobsFromSnap, overlayLive, readStructure, type LabKnobs } from "@/lib/desk/lab";
import { heliosCall, runBots } from "@/lib/desk/signal";
import { peekDeskTape, useDeskTape } from "@/lib/desk/tape-client";
import { initialStop, STOP_DEFAULT } from "@/lib/desk/stops";
import { STARTING_CASH, usePaper } from "@/lib/desk/store";
import type { HeliosCall, Stance } from "@/lib/desk/types";
import { cn, fgTone } from "@/lib/utils";

export function HeliosLab() {
  const [knobs, setKnobs] = useState<LabKnobs>(DEFAULT_KNOBS);
  const [preset, setPreset] = useState("live");
  const [grok, setGrok] = useState<string | null>(null);
  const [grokErr, setGrokErr] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveNote, setLiveNote] = useState<string | null>(null);

  const { snap: liveTape, loading: loadingLive, refresh: loadTape } = useDeskTape();

  const cash = usePaper((s) => s.cashUsd);
  const btc = usePaper((s) => s.btc);
  const profitBtc = usePaper((s) => s.profitBtc);
  const fills = usePaper((s) => s.fills);
  const fill = usePaper((s) => s.fill);
  const reset = usePaper((s) => s.reset);
  const log = useOperator((s) => s.log);
  const unlocked = useOperator((s) => s.unlocked);
  const role = useOperator((s) => s.role);
  const isAdmin = unlocked && role === "admin";

  const whatIf = Boolean(liveTape && preset !== "live");
  const liveBriefs = useMemo(() => (liveTape ? runBots(liveTape) : []), [liveTape]);
  const liveNav = cash + (btc + (profitBtc ?? 0)) * (liveTape?.btc.price ?? 0);
  const liveCall = useMemo(
    () => (liveTape ? heliosCall(liveTape, liveBriefs, liveNav) : null),
    [liveTape, liveBriefs, liveNav],
  );
  const engine = liveTape ? (whatIf ? overlayLive(liveTape, knobs) : liveTape) : null;
  const labBriefs = useMemo(() => (engine ? runBots(engine) : []), [engine]);
  const labCall = useMemo(() => (engine ? heliosCall(engine, labBriefs, liveNav) : null), [engine, labBriefs, liveNav]);

  function patch(partial: Partial<LabKnobs>) {
    setPreset("custom");
    setKnobs((k) => ({ ...k, ...partial }));
  }

  function applyPreset(id: string) {
    if (id === "live") {
      setPreset("live");
      if (liveTape) setKnobs(knobsFromSnap(liveTape));
      setGrok(null);
      setGrokErr(null);
      return;
    }
    const p = LAB_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPreset(id);
    const livePx = liveTape?.btc.price ?? 0;
    setKnobs({ ...p.knobs, price: livePx || p.knobs.price });
    setGrok(null);
    setGrokErr(null);
  }

  useEffect(() => {
    if (!liveTape) return;
    if (preset === "live") setKnobs(knobsFromSnap(liveTape));
    setLiveNote(
      `Live Coinbase ${money(liveTape.btc.price ?? 0, 0)} · 5 min poll · ${liveTape.errors.length ? `degraded ${liveTape.errors.join(", ")}` : "all sources live"}`,
    );
  }, [liveTape, preset]);

  async function loadLive() {
    setLiveNote(null);
    try {
      await loadTape();
      const live = peekDeskTape();
      if (live) {
        setKnobs(knobsFromSnap(live));
        setPreset("live");
        setGrok(null);
        setLiveNote(
          `Loaded Coinbase ${money(live.btc.price ?? 0, 0)}. M2 ${live.macro.m2.last != null ? `$${(live.macro.m2.last / 1000).toFixed(2)}T` : "n/a"} (${live.macro.m2.asOf ?? "FRED"}).`,
        );
      }
    } catch (e) {
      setLiveNote(e instanceof Error ? e.message : "Live tape failed");
    }
  }

  async function onAskGrok() {
    if (!unlocked || !engine || !labCall) return;
    setAsking(true);
    setGrokErr(null);
    try {
      const res = await askHelios({ data: { token: useOperator.getState().token, snapshot: engine, briefs: labBriefs, call: labCall } });
      if (!res.ok) setGrokErr(res.error);
      else {
        setGrok(res.text);
        log("grok", "Ask Grok");
      }
    } catch (e) {
      setGrokErr(e instanceof Error ? e.message : "Grok request failed");
    } finally {
      setAsking(false);
    }
  }

  function executeClip(c: HeliosCall) {
    if (!unlocked || role !== "admin") return;
    const px = liveTape?.btc.price;
    if (!px || !c || c.clipUsd <= 0) return;
    if (c.stance === "TRIM") {
      const qty = Math.min(btc, c.clipUsd / px);
      if (qty <= 0) return;
      fill({
        at: new Date().toISOString(),
        side: "SELL",
        usd: qty * px,
        btc: qty,
        price: px,
        note: `${APP_CALLS} lab ${c.stance} ${c.conviction}`,
        kind: "trim",
      });
      log("fill", `Paper SELL ${c.clipUsd}`);
      return;
    }
    const usd = Math.min(cash, c.clipUsd);
    if (usd <= 0) return;
    fill({
      at: new Date().toISOString(),
      side: "BUY",
      usd,
      btc: usd / px,
      price: px,
      note: `${APP_CALLS} lab ${c.stance} ${c.conviction}`,
      kind: "clip",
      stopPrice: initialStop(px, STOP_DEFAULT),
      peakPrice: px,
    });
    log("fill", `Paper BUY ${c.clipUsd}`);
  }

  async function copyCli(text: string) {
    if (looksLikeSecret(text) || text.includes("orders create")) {
      log("reject", "Blocked unsafe CLI copy");
      return;
    }
    await navigator.clipboard.writeText(text);
    log("copy", "Preview CLI copied");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const flipped = (liveCall?.checks ?? []).filter((c) => {
    const lab = labCall?.checks.find((x) => x.label === c.label);
    return lab != null && lab.pass !== c.pass;
  });
  const activeLab = LAB_PRESETS.find((p) => p.id === preset);

  return (
    <Shell
      right={
        <Button
          variant="primary"
          onClick={() => void loadLive()}
          disabled={loadingLive}
          aria-label="Refresh data"
          title="Refresh data"
          className="px-2.5"
        >
          <Radio className="size-4" />
        </Button>
      }
    >
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <SeoCopy />
        <TapeFreezeBanner />
        <div className="mb-6">
          <p className="text-xs font-medium tracking-[0.08em] text-accum uppercase">{TAB_LAB}</p>
          <h1 className="mt-1 max-w-2xl text-2xl font-bold tracking-tight text-medium sm:text-3xl">
            {APP_NAME}
          </h1>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {LAB_PRESETS.map((p) => (
            <Button
              key={p.id}
              variant={preset === p.id ? "primary" : "outline"}
              aria-pressed={preset === p.id}
              onClick={() => applyPreset(p.id)}
            >
              {p.name}
            </Button>
          ))}
          {preset === "custom" ? (
            <Button variant="primary" aria-pressed>
              Custom
            </Button>
          ) : null}
        </div>
        <p className="mb-4 text-sm text-muted">
          {preset === "custom" ? "Custom overlay — move a slider, Bot 7 re-runs on the live tape." : activeLab?.blurb}
        </p>
        {liveNote ? <p className="mb-4 font-mono text-xs text-muted">{liveNote}</p> : null}

        <CompareCalls live={liveCall} lab={whatIf ? labCall : liveCall} whatIf={whatIf} />
        <StructureBoard live={liveTape} lab={engine} whatIf={whatIf} />

        <div className="mt-4 space-y-4">
          <Panel kicker="Variables" title="Drive the accumulation call" kickerClass="text-high" titleClass="text-medium">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Tape</p>
                <Knob label="BTC-USD" value={money(knobs.price, 0)} min={40000} max={150000} step={100} raw={knobs.price} onChange={(n) => patch({ price: n })} />
                <Knob label="RSI(14) hourly" value={knobs.rsi.toFixed(0)} min={10} max={90} step={1} raw={knobs.rsi} onChange={(n) => patch({ rsi: n })} />
                <Knob label="Fear & Greed" value={`${Math.round(knobs.fg)}`} min={5} max={95} step={1} raw={knobs.fg} onChange={(n) => patch({ fg: n })} tone={fgTone(knobs.fg)} />
                <Knob label="OKX long/short" value={knobs.longShort.toFixed(2)} min={0.5} max={2.4} step={0.02} raw={knobs.longShort} onChange={(n) => patch({ longShort: n })} />
                <Knob label="Funding %" value={`${knobs.fundingPct.toFixed(3)}%`} min={-0.03} max={0.12} step={0.005} raw={knobs.fundingPct} onChange={(n) => patch({ fundingPct: n })} />
              </div>
              <div>
                <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Flow</p>
                <Knob label="Kimchi %" value={`${knobs.kimchi >= 0 ? "+" : ""}${knobs.kimchi.toFixed(1)}%`} min={-5} max={8} step={0.1} raw={knobs.kimchi} onChange={(n) => patch({ kimchi: n })} />
                <Knob label="CNY OTC %" value={`${knobs.cnyOtc >= 0 ? "+" : ""}${knobs.cnyOtc.toFixed(1)}%`} min={-4} max={6} step={0.1} raw={knobs.cnyOtc} onChange={(n) => patch({ cnyOtc: n })} />
                <Knob label="EM inflow regions" value={String(Math.round(knobs.emHot))} min={0} max={5} step={1} raw={knobs.emHot} onChange={(n) => patch({ emHot: n })} />
                <Knob label="EM outflow regions" value={String(Math.round(knobs.emOut))} min={0} max={5} step={1} raw={knobs.emOut} onChange={(n) => patch({ emOut: n })} />
                <Knob label="US spot ETF $M" value={`${knobs.etfFlowM >= 0 ? "+" : ""}${knobs.etfFlowM.toFixed(0)}`} min={-400} max={800} step={10} raw={knobs.etfFlowM} onChange={(n) => patch({ etfFlowM: n })} />
                <Knob label="BTC / gold oz" value={knobs.goldOz.toFixed(1)} min={10} max={28} step={0.1} raw={knobs.goldOz} onChange={(n) => patch({ goldOz: n })} />
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <HeliosCard
              kicker={whatIf ? "Bot 7 · this lab" : "Bot 7 · live tape"}
              title={`${APP_CALLS}`}
              call={labCall}
              grok={grok}
              grokErr={grokErr}
              asking={asking}
              copied={copied}
              canFill={isAdmin && Boolean(labCall && labCall.clipUsd > 0 && liveTape?.btc.price)}
              canAct={isAdmin}
              onAsk={() => void onAskGrok()}
              onCopy={() => {
                if (labCall) void copyCli(labCall.cli);
              }}
              onFill={() => {
                if (labCall) executeClip(labCall);
              }}
              tape={
                engine
                  ? {
                      price: engine.btc.price,
                      rsi: engine.rsi14,
                      rsiAvg: engine.rsiAvg,
                      fg: engine.fearGreed?.value ?? null,
                      fgLabel: engine.fearGreed?.label,
                      fetchedAt: engine.fetchedAt,
                    }
                  : null
              }
            />
            <div className="space-y-4">
            {whatIf && flipped.length ? (
              <Panel kicker="Delta" title="Checks that flipped">
                <ul className="space-y-1.5 font-mono text-xs">
                  {flipped.map((c) => {
                    const lab = labCall?.checks.find((x) => x.label === c.label);
                    return (
                      <li key={c.label}>
                        <span className={c.pass ? "text-up" : "text-down"}>{c.pass ? "LIVE PASS" : "LIVE FAIL"}</span>
                        <span className="text-muted"> → </span>
                        <span className={lab?.pass ? "text-up" : "text-down"}>{lab?.pass ? "LAB PASS" : "LAB FAIL"}</span>
                        <span className="ml-2 text-muted">{c.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            ) : null}
            {isAdmin ? (
              <PaperCard
                mounted
                cash={cash}
                btc={btc}
                profitBtc={profitBtc ?? 0}
                px={liveTape?.btc.price ?? 0}
                fills={fills}
                onReset={unlocked ? reset : undefined}
              />
            ) : null}
            </div>
          </div>
        </div>

        <BotDelta live={liveBriefs} lab={labBriefs} whatIf={whatIf} />
        <LiveTracks
          briefs={labBriefs}
          kicker={whatIf ? "THIS LAB · B0TS 1–6" : "B0TS 1–6"}
          title={whatIf ? "Lab analysts under this overlay" : "Live Hedge Fund analysts"}
          note={
            whatIf
              ? "How bots 1–6 vote if this lab’s structure holds. Compare the Live column above to see what flipped."
              : "Visual summary of bots 1–6 on the live pull. Pick a lab or move a slider to predict a different structure."
          }
        />

        <p className="mt-4 text-xs text-muted">
          Paper NAV {money(liveNav || STARTING_CASH, 0)}. Clip is 1% NAV on ACCUMULATE, 2% on BUY, 1%
          on TRIM. Desk is the live view of bots 1–6 and Bot 7. L@B is for strategy experiments only —
          knobs never write a feed.
        </p>
      </main>
    </Shell>
  );
}

function CompareCalls({
  live,
  lab,
  whatIf,
}: {
  live: HeliosCall | null;
  lab: HeliosCall | null;
  whatIf: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CallChip label="Live tape" call={live} />
      <CallChip label={whatIf ? "This lab" : "Lab = live"} call={lab} />
    </div>
  );
}

function heatClass(heat: "bid" | "chase" | "neutral") {
  if (heat === "bid") return "text-high";
  if (heat === "chase") return "text-sell";
  return "text-muted";
}

function StructureBoard({
  live,
  lab,
  whatIf,
}: {
  live: ReturnType<typeof overlayLive> | null;
  lab: ReturnType<typeof overlayLive> | null;
  whatIf: boolean;
}) {
  const liveRead = live ? readStructure(live) : null;
  const labRead = lab ? readStructure(lab) : null;
  const rows = labRead?.rows ?? [];
  return (
    <Panel className="mt-4" kicker="Market structure" title={whatIf ? "Live tape vs this lab" : "Live structure Bot 7 is reading"}>
      <p className="mb-3 text-xs text-muted">
        Sliders rewrite these prints on a copy of the last pull. Bid = accumulate-friendly. Chase =
        crowded / do not chase. Desk stays on the live column.
      </p>
      {labRead?.tags.length ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {labRead.tags.map((t) => (
            <li
              key={t.id}
              className={cn(
                "rounded-sm border border-rule px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em]",
                heatClass(t.heat),
              )}
            >
              {whatIf ? "Lab · " : ""}
              {t.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
              <th className="pb-2 pr-3 font-medium">Variable</th>
              <th className="pb-2 pr-3 font-medium">Live</th>
              <th className="pb-2 font-medium">{whatIf ? "This lab" : "Lab = live"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const lv = liveRead?.rows.find((r) => r.id === row.id);
              return (
                <tr key={row.id} className="border-t border-rule/70">
                  <td className="py-2 pr-3">{row.label}</td>
                  <td className={cn("py-2 pr-3 font-mono text-xs tabular-nums", heatClass(lv?.heat ?? "neutral"))}>
                    {lv?.value ?? "—"}
                  </td>
                  <td className={cn("py-2 font-mono text-xs tabular-nums", heatClass(row.heat))}>{row.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function CallChip({ label, call }: { label: string; call: HeliosCall | null }) {
  return (
    <div className="rounded-lg border border-rule bg-surface p-4">
      <p className={cn("font-mono text-[11px] tracking-[0.14em] uppercase", bannerTone(call))}>{label}</p>
      {call ? (
        <CallWords call={call} className="mt-1 text-xl font-semibold" />
      ) : (
        <p className="mt-1 text-xl font-semibold text-muted">—</p>
      )}
      <p className="mt-1 font-mono text-xs text-muted">clip {call ? money(call.clipUsd, 0) : "—"}</p>
    </div>
  );
}

function BotDelta({
  live,
  lab,
  whatIf,
}: {
  live: ReturnType<typeof runBots>;
  lab: ReturnType<typeof runBots>;
  whatIf: boolean;
}) {
  const rows = lab.map((b, i) => ({
    lab: b,
    live: live.find((x) => x.id === b.id) ?? live[i],
  }));
  return (
    <Panel className="mt-4" kicker="B0TS 1–6" title="Live vs this lab">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
              <th className="pb-2 pr-3 font-medium">Analyst</th>
              <th className="pb-2 pr-3 font-medium">Live</th>
              <th className="pb-2 font-medium">{whatIf ? "Lab" : "Lab = live"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ live: lv, lab: lb }) => (
              <tr key={lb.id} className="border-t border-rule/70">
                <td className="py-2 pr-3">{lb.name}</td>
                <td className={cn("py-2 pr-3 font-mono text-[11px] uppercase", stanceClass((lv?.stance ?? "HOLD") as Stance))}>
                  {lv?.stance ?? "—"}
                </td>
                <td className={cn("py-2 font-mono text-[11px] uppercase", stanceClass(lb.stance))}>{lb.stance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  raw,
  onChange,
  tone,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  raw: number;
  onChange: (n: number) => void;
  tone?: string;
}) {
  const id = `knob-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <div className="mt-3 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={cn("text-sm", tone)}>
          {label}
        </label>
        <span className={cn("font-mono text-xs tabular-nums", tone || "text-muted")}>{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={raw}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-11 w-full cursor-pointer accent-pine"
      />
    </div>
  );
}
