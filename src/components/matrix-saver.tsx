import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/auth/client";
import { useOperator } from "@/lib/desk/operator";
import { GM_BURST_MS, SAVER_IDLE_MS, saverLockEnabled } from "@/lib/desk/saver-lock";
import { APP_NAME } from "@/lib/brand";

const IDLE_MS = SAVER_IDLE_MS;
const BURST_MS = GM_BURST_MS;
const GM_SEQ = "G0DZ1LLa M0D3";
const CLASSIC =
  "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ420420420420420420420420420420420420420420";

const RAINBOW = ["#ff1f1f", "#ff8a1f", "#f4e14b", "#3dff1a", "#5eb3e4", "#9b6bdb", "#e879b0"];

type Column = {
  y: number;
  speed: number;
  gm: boolean;
  seq: number;
  hold: number;
  glyphs: string[];
};
type Mode = "off" | "lock" | "burst" | "saver";
type Rain = "classic" | "gm";

const burstFns = new Set<(ms: number) => void>();

/** 3 s Matrix rain on every G0DZ1LLa M0D3 tab click / /gm open — never locks the session. */
export function rainGmBurst(ms = BURST_MS) {
  for (const fn of burstFns) fn(ms);
}

function rainbowAt(tMs: number, col: number, row: number) {
  const cycle = 3600;
  const shift = ((tMs + col * 90 + row * 220) % cycle) / cycle;
  const i = shift * RAINBOW.length;
  return RAINBOW[Math.floor(i) % RAINBOW.length] ?? "#3dff1a";
}

/** GM rain only on the G0DZ1LLa M0D3 tab. Every other view uses classic rain. */
export function gmRainActive() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  return path === "/gm" || path.startsWith("/gm/");
}

export function MatrixSaver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("off");
  const [rain, setRain] = useState<Rain>("classic");
  const modeRef = useRef<Mode>("off");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    let idleTimer = window.setTimeout(trip, IDLE_MS);
    let burstTimer = 0;

    async function trip() {
      const useGmRain = gmRainActive();
      const session = useOperator.getState();
      const lockPolicy = saverLockEnabled();
      if (!lockPolicy || !session.unlocked) {
        // UNLOCKED policy (or no session to lock): Matrix classic screensaver.
        // Runs until the user moves — never locks the system.
        setRain(useGmRain ? "gm" : "classic");
        setMode("saver");
        return;
      }
      // LOCKED policy: sign the session out and require login again.
      void session.lockFromIdle();
      try {
        void signOut("/login");
      } catch {
        try {
          sessionStorage.removeItem("grok-auth.bearer-token");
        } catch {
          /* private mode */
        }
      }
      setRain(useGmRain ? "gm" : "classic");
      setMode("lock");
    }

    function burst(ms: number) {
      if (modeRef.current === "lock") return;
      setRain("gm");
      setMode("burst");
      window.clearTimeout(burstTimer);
      burstTimer = window.setTimeout(() => {
        if (modeRef.current === "burst") setMode("off");
      }, ms);
    }

    burstFns.add(burst);

    function goLogin() {
      window.location.assign("/login");
    }

    function poke(ev: Event) {
      if (modeRef.current === "saver") {
        setMode("off");
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(trip, IDLE_MS);
        return;
      }
      if (modeRef.current === "lock") {
        const authed = useOperator.getState().unlocked;
        if (!authed) {
          setMode("off");
          idleTimer = window.setTimeout(trip, IDLE_MS);
          return;
        }
        if (ev.type === "pointermove" || ev.type === "wheel" || ev.type === "scroll") return;
        goLogin();
        return;
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(trip, IDLE_MS);
    }

    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "pointermove",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ];
    for (const e of events) window.addEventListener(e, poke, { passive: true });

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(burstTimer);
      burstFns.delete(burst);
      for (const e of events) window.removeEventListener(e, poke);
    };
  }, []);

  useEffect(() => {
    if (mode === "off") return;
    const raw = canvasRef.current;
    const rawCtx = raw?.getContext("2d") ?? null;
    if (!raw || !rawCtx) return;
    const surface: HTMLCanvasElement = raw;
    const g: CanvasRenderingContext2D = rawCtx;
    const gmTheme = rain === "gm";
    const burstFall = mode === "burst";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let columns: Column[] = [];
    let size = 16;
    let pitch = 16;
    let rowGap = 28;
    let raf = 0;
    let running = true;
    const t0 = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.imageSmoothingEnabled = false;
      size = w < 480 ? 20 : 24;
      pitch = size / 1.875;
      rowGap = Math.round(size * 1.78);
      const count = Math.ceil(w / pitch);
      const rows = Math.max(1, h / rowGap);
      const fall = burstFall ? rows / 180 : (reduced ? 0.28 + Math.random() * 0.2 : 0.5 + Math.random() * 0.8) * 0.5419;
      columns = Array.from({ length: count }, (_, i) => ({
        y: burstFall ? -Math.random() * rows * 0.35 : Math.random() * rows,
        speed: burstFall ? fall * (0.92 + Math.random() * 0.16) : fall,
        gm: gmTheme ? i % 12 === 0 : Math.random() < 0.05,
        seq: Math.floor(Math.random() * GM_SEQ.length),
        hold: 18 + Math.floor(Math.random() * 12),
        glyphs: Array.from({ length: 11 }, () => CLASSIC[Math.floor(Math.random() * CLASSIC.length)] ?? "0"),
      }));
      g.fillStyle = "#000";
      g.fillRect(0, 0, w, h);
    }

    function glyph() {
      return CLASSIC[Math.floor(Math.random() * CLASSIC.length)] ?? "0";
    }

    let frame = 0;
    function tick(now: number) {
      if (!running) return;
      if (document.hidden) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      frame += 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const tMs = now - t0;
      g.fillStyle = reduced ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.2)";
      g.fillRect(0, 0, w, h);
      g.font = `700 ${size}px "IBM Plex Mono", Consolas, monospace`;
      g.textBaseline = "top";
      g.textAlign = "left";
      const classicPx = Math.round(size * 1.08);
      const gmPx = Math.round(size * 0.92);
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]!;
        const x = Math.round(i * pitch);
        const flip = frame % col.hold === 0;
        if (col.gm) {
          g.font = `600 ${gmPx}px "IBM Plex Mono", Consolas, monospace`;
          if (flip) col.seq = (col.seq + 1) % GM_SEQ.length;
          const trail = GM_SEQ.length;
          for (let k = 0; k < trail; k++) {
            const yy = Math.round((col.y - k) * rowGap);
            if (yy < -rowGap || yy > h) continue;
            const ch = GM_SEQ[(col.seq + k) % GM_SEQ.length] ?? "G";
            g.fillStyle = rainbowAt(tMs, i, Math.floor(col.y) - k);
            g.fillText(ch === " " ? "·" : ch, x, yy);
          }
        } else {
          g.font = `800 ${classicPx}px "IBM Plex Mono", Consolas, monospace`;
          if (flip) {
            col.glyphs.pop();
            col.glyphs.unshift(glyph());
          }
          const y = Math.round(col.y * rowGap);
          const greens = [
            "#d8ff9a",
            "#b6ff7a",
            "#4dff3a",
            "#3dff1a",
            "#32c428",
            "#2f9e2c",
            "#268528",
            "#1d7a22",
            "#17661a",
            "#125214",
            "#0d3f10",
          ];
          for (let k = 0; k < col.glyphs.length; k++) {
            const yy = y - k * rowGap;
            if (yy < -rowGap || yy > h) continue;
            const ch = col.glyphs[k] ?? "0";
            g.strokeStyle = "#031208";
            g.lineWidth = 1.35;
            g.strokeText(ch, x, yy);
            g.fillStyle = greens[k] ?? "#17661a";
            g.fillText(ch, x, yy);
          }
        }
        col.y += col.speed;
        if (!burstFall && col.y * rowGap > h && Math.random() > (reduced ? 0.992 : 0.975)) col.y = 0;
      }
      g.fillStyle = "#2f7d34";
      g.fillText(APP_NAME, 16, h - size * 2);
      raf = window.requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(tick);
    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mode, rain]);

  if (mode === "off") return null;

  const burst = mode === "burst";
  const saver = mode === "saver";

  return (
    <div
      className={burst ? "pointer-events-none fixed inset-0 z-[90] bg-bg/80" : "fixed inset-0 z-[90] bg-bg"}
      role="presentation"
      aria-label={burst ? "G0DZ1LLa M0D3" : saver ? "Matrix classic screensaver. Move to continue." : "Locked. Sign in again to continue."}
      onPointerDown={burst || saver ? undefined : () => window.location.assign("/login")}
      onKeyDown={burst || saver ? undefined : () => window.location.assign("/login")}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
