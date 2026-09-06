import { useEffect } from "react";
import { APP_GATEWAY_PATH, APP_SURFACES, WEBMCP_TOOLS } from "@/lib/desk/mobile-bridge";

type ToolCall = Record<string, unknown>;

type ModelContext = {
  registerTool?: (tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (args: ToolCall) => Promise<unknown>;
  }) => void | Promise<void>;
};

function ctx(): ModelContext | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    modelContext?: ModelContext;
    navigator?: { modelContext?: ModelContext };
    document?: { modelContext?: ModelContext };
  };
  return w.modelContext ?? w.navigator?.modelContext ?? w.document?.modelContext ?? null;
}

const TOKEN_KEY = "s1r1us-gm-board-token";

async function runTool(name: string, args: ToolCall) {
  if (name === "open_surface") {
    const id = String(args.id ?? "");
    const hit = APP_SURFACES.find((s) => s.id === id || s.path === id || s.path === `/${id}`);
    if (hit) window.location.assign(hit.path);
    return { ok: true, path: hit?.path ?? "/app", trade: false };
  }
  const token =
    typeof window !== "undefined" ? window.sessionStorage.getItem(TOKEN_KEY) || "" : "";
  const body: Record<string, unknown> = { ...args, tool: name, token: args.token || token };
  if (name === "board_register") {
    body.mandate = true;
    body.compute = body.compute || "byo";
  }
  if (name === "board_tick") {
    body.action = body.action || "ACCUMULATE";
  }
  if (name === "waitlist_register" || name === "forum_post" || name === "forum_register") {
    body.mandate = body.mandate ?? true;
  }
  const headers: Record<string, string> = { accept: "application/json", "content-type": "application/json" };
  if (token) headers["x-s1r1us-agent"] = token;
  const r = await fetch(APP_GATEWAY_PATH, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (name === "board_register" && j && typeof j.token === "string") {
    try {
      window.sessionStorage.setItem(TOKEN_KEY, j.token);
    } catch {
      /* ignore */
    }
  }
  return j;
}

/** Registers WebMCP tools so Gemini-in-Chrome / browser agents can drive the desk. */
export function WebMcpBridge() {
  useEffect(() => {
    const mc = ctx();
    if (!mc?.registerTool) return;
    let cancelled = false;
    void (async () => {
      for (const tool of WEBMCP_TOOLS) {
        if (cancelled) return;
        try {
          await mc.registerTool?.({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
            execute: (args) => runTool(tool.name, args ?? {}),
          });
        } catch {
          /* origin trial / unsupported */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
