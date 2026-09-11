import { useState } from "react";
import { SeoCopy } from "@/components/seo-copy";
import { Panel, Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { PAGE_DESC_WHITE, TAB_WHITE } from "@/lib/brand";
import {
  OSS_LICENSE_NOTICE,
  SYSTEM_ADMIN_OVERRIDE,
  WHITE_LABEL_BUILDERS,
  WHITE_LABEL_DOWNLOAD_URL,
  WHITE_LABEL_PRIVILEGES,
  WHITE_LABEL_STRIP,
  WHITE_LABEL_WATCH,
  builderPrompt,
  emptyWhiteLabelConfig,
  fieldBlocked,
  whiteLabelGoLive,
  type WhiteLabelConfig,
} from "@/lib/desk/white-label";

function Box({
  label,
  value,
  onChange,
  placeholder,
  locked,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  locked?: boolean;
}) {
  const blocked = fieldBlocked(value);
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        disabled={locked}
        className="mt-1 h-11 w-full rounded-md border border-rule bg-bg px-3 text-sm text-fg disabled:opacity-50"
      />
      {blocked ? <span className="mt-1 block text-xs text-sell">{blocked}</span> : null}
    </label>
  );
}

export function WhiteLabelPage() {
  const [cfg, setCfg] = useState<WhiteLabelConfig>(() => emptyWhiteLabelConfig());
  const [handle, setHandle] = useState("");
  const [report, setReport] = useState<string[] | null>(null);
  const [live, setLive] = useState(false);

  function set<K extends keyof WhiteLabelConfig>(key: K, value: WhiteLabelConfig[K]) {
    setCfg((c) => ({ ...c, [key]: value }));
  }

  function setMenu(i: number, v: string) {
    set(
      "menus",
      cfg.menus.map((m, k) => (k === i ? v : m)),
    );
  }

  function setSecret(i: number, field: "id" | "secret", v: string) {
    set(
      "secrets",
      cfg.secrets.map((s, k) => (k === i ? { ...s, [field]: v } : s)),
    );
  }

  function runCheck() {
    const res = whiteLabelGoLive(cfg, { handle: handle || "@white-label-user" });
    setLive(res.live);
    setReport(res.report);
  }

  return (
    <Shell>
      <main className="mx-auto w-full max-w-[1100px] px-3 py-6 sm:px-4">
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">Download · rebrand · your domain</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-fg">{TAB_WHITE}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Upgrade to system admin of your own copy: download this entire open-source system and relaunch it under a
          domain name YOU control — never under S1R1US.ai. Available to all phone app and website users. As soon as
          the system goes live on your domain it is rebranded for that domain. The go-live check below verifies zero
          use of S1R1US.ai system admin account data — the white label does not go live if the check fails.
        </p>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-fg">{OSS_LICENSE_NOTICE}</p>

        <Panel className="mt-5" kicker="Build with AI" title="Connect Grok, Claude, or GitHub Copilot">
          <p className="text-sm leading-relaxed text-muted">
            Connect an AI builder to help build your white label system using YOUR domain name and the config settings
            you enter below. Copy the prompt — it never includes your secrets.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {WHITE_LABEL_BUILDERS.map((b) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-4 text-sm font-semibold hover:bg-fg/6"
              >
                {b.name}
              </a>
            ))}
            <Button
              onClick={() => {
                try {
                  void navigator.clipboard.writeText(builderPrompt(cfg));
                } catch {
                  /* clipboard unavailable */
                }
              }}
            >
              Copy builder prompt
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">{OSS_LICENSE_NOTICE}</p>
        </Panel>

        <Panel className="mt-4" kicker="Stripped" title="What is removed before every download">
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
            {WHITE_LABEL_STRIP.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The white label never gets s1r1us.ai system access, never populates with S1R1US.ai app data or system
            admin data, and can never overtake s1r1us.ai system admin rights — 100 percent match on security, no
            compromise. External AI agents can never take over the s1r1us.ai system admin.
          </p>
          <div className="mt-3">
            <a
              href={WHITE_LABEL_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 min-h-10 items-center rounded-md border border-rule bg-surface px-4 text-sm font-semibold hover:bg-fg/6"
            >
              Download the stripped OSS system
            </a>
          </div>
        </Panel>

        <Panel className="mt-4" kicker="Rebrand config" title="Domain · web host · account access">
          <p className="text-sm leading-relaxed text-muted">
            Every box starts blank. Populate the OSS information manually — including your own terms and agreement
            and privacy policy. Proprietary s1r1us.ai info is blocked from every box.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Box label="Domain name (rebrand target — never S1R1US.ai)" value={cfg.domain} onChange={(v) => set("domain", v)} placeholder="your-domain.com" />
            <Box label="Actor handle (for the bad-actor gate)" value={handle} onChange={setHandle} placeholder="@your_handle" />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-fg">Top-level menu names</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {cfg.menus.map((m, i) => (
              <Box key={i} label={`Menu name ${i + 1}`} value={m} onChange={(v) => setMenu(i, v)} />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Button onClick={() => set("menus", [...cfg.menus, ""])}>+ menu</Button>
            <Button onClick={() => set("menus", cfg.menus.slice(0, -1))} disabled={cfg.menus.length <= 1}>
              − menu
            </Button>
          </div>

          <h3 className="mt-5 text-sm font-semibold text-fg">Accounts</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Box label="1. System admin" value={cfg.systemAdmin} onChange={(v) => set("systemAdmin", v)} placeholder="@your_new_admin" />
            <Box label="2. Phone app user" value={cfg.phoneAppUser} onChange={(v) => set("phoneAppUser", v)} placeholder="@your_phone_user" />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-fg">Web host + DNS</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Box label="Web host name" value={cfg.webhostName} onChange={(v) => set("webhostName", v)} />
            <Box label="Web host IP address" value={cfg.webhostIp} onChange={(v) => set("webhostIp", v)} placeholder="203.0.113.7" />
            <Box label="DNS server 1" value={cfg.dns1} onChange={(v) => set("dns1", v)} />
            <Box label="DNS server 2" value={cfg.dns2} onChange={(v) => set("dns2", v)} />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-fg">Encrypted token ids + secrets</h3>
          <p className="mt-1 text-xs text-muted">
            Name every id and encrypted secret needed to maintain or access your new branded system — for example a
            better_auth id and its secret. Use + / − to add more pairs.
          </p>
          <div className="mt-2 space-y-3">
            {cfg.secrets.map((s, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                <Box label={`Token id ${i + 1}`} value={s.id} onChange={(v) => setSecret(i, "id", v)} placeholder="better_auth_id" />
                <Box label={`Encrypted secret ${i + 1}`} value={s.secret} onChange={(v) => setSecret(i, "secret", v)} placeholder="secret name" />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Button onClick={() => set("secrets", [...cfg.secrets, { id: "", secret: "" }])}>+ secret</Button>
            <Button onClick={() => set("secrets", cfg.secrets.slice(0, -1))} disabled={cfg.secrets.length <= 1}>
              − secret
            </Button>
          </div>

          <h3 className="mt-5 text-sm font-semibold text-fg">GitHub</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Box label="GitHub repository (never S1R1US-AI/S1R1US-LABs — any branch or main)" value={cfg.githubRepo} onChange={(v) => set("githubRepo", v)} placeholder="you/your-repo" />
            <Box label="GitHub system admin for the white label" value={cfg.githubAdmin} onChange={(v) => set("githubAdmin", v)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="primary" onClick={runCheck}>
              Run go-live check — verify no S1R1US.ai system admin data
            </Button>
          </div>
          {report ? (
            <div className={live ? "mt-3 rounded-md border border-rule p-3 text-sm text-up" : "mt-3 rounded-md border border-rule p-3 text-sm text-sell"}>
              {report.map((r) => (
                <p key={r} className="mt-1 first:mt-0">
                  {r}
                </p>
              ))}
            </div>
          ) : null}
        </Panel>

        <Panel className="mt-4" kicker="Security" title="System admin vs white label admin">
          <ul className="divide-y divide-rule">
            {WHITE_LABEL_PRIVILEGES.map((row) => (
              <li key={row.control} className="flex flex-wrap items-start gap-2 py-2 font-mono text-xs">
                <span className="min-w-0 flex-1 text-fg">{row.control}</span>
                <span className="text-muted">system: {row.system}</span>
                <span className={row.white.startsWith("NEVER") ? "text-sell" : "text-up"}>white label: {row.white}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted">{WHITE_LABEL_WATCH}</p>
          <p className="mt-2 font-mono text-xs text-muted">Override authority: {SYSTEM_ADMIN_OVERRIDE} — main system admin for S1R1US.ai.</p>
        </Panel>

        <p className="mt-6 text-xs leading-relaxed text-muted">{PAGE_DESC_WHITE}</p>

        <SeoCopy />
      </main>
    </Shell>
  );
}
