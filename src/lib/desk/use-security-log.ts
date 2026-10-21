import { useEffect, useState } from "react";
import { fetchSecurityLog } from "./desk-rpc";
import { useOperator } from "./operator";
import type { ProtocolRow, VulnRow } from "./security";

/** Admin security log, fetched from the server after sign-in. Empty until then. */
export function useSecurityLog(): { protocol: ProtocolRow[]; vulns: VulnRow[] } {
  const token = useOperator((s) => s.token);
  const [log, setLog] = useState<{ protocol: ProtocolRow[]; vulns: VulnRow[] }>({ protocol: [], vulns: [] });
  useEffect(() => {
    if (!token) return;
    let gone = false;
    void fetchSecurityLog({ data: { token } })
      .then((res) => {
        if (!gone && res.ok) setLog({ protocol: res.protocol, vulns: res.vulns });
      })
      .catch(() => undefined);
    return () => {
      gone = true;
    };
  }, [token]);
  return log;
}
