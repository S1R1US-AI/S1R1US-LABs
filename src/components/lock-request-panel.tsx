import { useState } from "react";
import { useAppAdmin } from "@/lib/desk/app-admin-client";
import { postLockTicket } from "@/lib/desk/lock-request-rpc";
import { PHONE_REQUEST_OK } from "@/lib/desk/lock-request";

const LABELS: Record<string, string> = {
  agents: "AI Agents",
  hive: "H1V3 SW@RM",
  pred: "PR3D1CT10N$",
};

export function LockRequestPanel() {
  const token = useAppAdmin((s) => (s.unlocked ? s.token : ""));
  const [ids, setIds] = useState<string[]>(["pred"]);
  const [locked, setLocked] = useState(true);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  if (!token.startsWith("app.")) return null;
  return (
    <section className="lock-request mt-3 rounded-lg border border-white/10 p-3 text-sm">
      <p className="mb-2">
        Request a LoCK3D change for S1R1US.ai 7-B0T desk rails that phone admin may ask about. System admin applies it.
        You cannot request unlock of 7-B0T AUTO, G M0D3, or AI Agents LIVE.
      </p>
      <div className="flex flex-wrap gap-3">
        {PHONE_REQUEST_OK.map((id) => (
          <label key={id} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={ids.includes(id)}
              onChange={() => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))}
            />
            {LABELS[id] || id}
          </label>
        ))}
      </div>
      <label className="mt-2 flex items-center gap-2">
        <input type="checkbox" checked={locked} onChange={() => setLocked((v) => !v)} />
        Request LOCKED (off = request UNLOCKED)
      </label>
      <input className="mt-2 w-full bg-black/30 p-2" placeholder="note for system admin" value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        className="mt-2 rounded border border-white/20 px-3 py-1"
        type="button"
        onClick={() => {
          void postLockTicket({ data: { token, ids, locked, note } }).then((res) => {
            setMsg(res.ok ? `Ticket ${res.ticket?.id}` : res.error || "failed");
          });
        }}
      >
        Send request
      </button>
      {msg ? <p className="mt-1 opacity-80">{msg}</p> : null}
    </section>
  );
}
