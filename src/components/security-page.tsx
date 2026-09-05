import { Shield } from "lucide-react";
import { Panel } from "@/components/shell";
import { CDP_KEYS, CDP_REVOKE, MCP_DOCS, MCP_REMOTE, SPARROW_SITE, ANALYSIS_AS_OF, protocolRows, vulnRows } from "@/lib/desk/security";
import { useOperator } from "@/lib/desk/operator";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/brand";

/** Admin-only Coinbase MCP / protocol / vuln review. Not on the public desk. */
export function AccessDesk() {
  const rows = protocolRows();
  const audit = useOperator((s) => s.audit);

  return (
    <div className="mt-6">
      <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">
        Coinbase MCP for Agents · {ANALYSIS_AS_OF}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Analysis against{" "}
        <a className="underline" href={MCP_DOCS} target="_blank" rel="noreferrer">
          Coinbase MCP for Agents
        </a>
        . This host never holds a CDP secret. Live trades stay on MCP OAuth or CLI on your machine.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel kicker="Remote MCP" title="OAuth harness">
          <p className="text-sm leading-relaxed text-muted">
            Allowlisted clients connect to Coinbase. Custom harnesses use CLI. Do not paste a key JSON into{" "}
            {APP_NAME}.
          </p>
          <p className="mt-3">
            <a className="text-sm underline" href={MCP_REMOTE} target="_blank" rel="noreferrer">
              agents.coinbase.com/mcp
            </a>
          </p>
        </Panel>
        <Panel kicker="CDP Portal" title="Key + revoke">
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a className="underline" href={CDP_KEYS} target="_blank" rel="noreferrer">
                Create scoped API key
              </a>
            </li>
            <li>
              <a className="underline" href={CDP_REVOKE} target="_blank" rel="noreferrer">
                Revoke app connections
              </a>
            </li>
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4" kicker="Analysis" title="Protocol status">
        <ul className="divide-y divide-rule">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <span
                className={cn(
                  "w-24 shrink-0 font-mono text-xs",
                  r.status === "PASS" ? "text-up" : r.status === "FAIL" ? "text-down" : "text-accent",
                )}
              >
                {r.status}
              </span>
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="mt-4" kicker="Analysis" title="Vulnerability review">
        <p className="mb-3 text-sm leading-relaxed text-muted">
          Live 24/7 trading stays on Coinbase MCP/CLI. Take-profit BTC goes to the Coinbase profit address.{" "}
          <a className="underline" href={SPARROW_SITE} target="_blank" rel="noreferrer">
            Sparrow
          </a>{" "}
          is optional worst-case backup. This web host never holds a seed or CDP secret.
        </p>
        <ul className="divide-y divide-rule">
          {vulnRows().map((v) => (
            <li key={v.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <span
                className={cn(
                  "w-24 shrink-0 font-mono text-xs",
                  v.severity === "HIGH" ? "text-down" : v.severity === "MED" ? "text-accent" : "text-muted",
                )}
              >
                {v.severity}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {v.title}{" "}
                  <span className={v.status === "FIXED" || v.status === "MITIGATED" ? "text-up" : "text-accent"}>
                    {v.status}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{v.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="mt-4" kicker="Audit" title="This browser">
        <ul className="max-h-64 space-y-1 overflow-auto font-mono text-xs">
          {audit.length ? (
            audit.map((e) => (
              <li key={e.id} className="flex gap-3">
                <span className="text-muted">{e.at.slice(11, 19)}</span>
                <span className="text-accent">{e.kind}</span>
                <span>{e.note}</span>
              </li>
            ))
          ) : (
            <li className="text-muted">No events yet.</li>
          )}
        </ul>
        <p className="mt-3 flex items-start gap-2 text-xs text-muted">
          <Shield className="mt-0.5 size-3.5 shrink-0" />
          Coinbase does not guarantee agent actions. You review and authorize every live trade.
        </p>
      </Panel>
    </div>
  );
}