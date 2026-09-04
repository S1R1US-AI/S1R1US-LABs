export type PracticePulse = {
  at: string;
  paused: boolean;
  day: number;
  bot7: { fills: number; ticks: number; cash: number; btc: number; last: string };
  gm: { fills: number; ticks: number; cash: number; btc: number; last: string };
};

const PATH = "/workspace/data/practice-pulse.json";
let mem: PracticePulse | null = null;

export function readPulse(): PracticePulse | null {
  return mem;
}

export async function loadPulse(): Promise<PracticePulse | null> {
  if (mem) return mem;
  try {
    const fs = await import("node:fs");
    mem = JSON.parse(fs.readFileSync(PATH, "utf8")) as PracticePulse;
    return mem;
  } catch {
    return null;
  }
}

export async function writePulse(p: PracticePulse) {
  mem = p;
  try {
    const fs = await import("node:fs");
    fs.mkdirSync("/workspace/data", { recursive: true });
    fs.writeFileSync(PATH, JSON.stringify(p, null, 2));
  } catch {
    /* preview */
  }
}
