/**
 * 7-B0T H3DGE FUND "WHITE LABEL" — download + rebrand of the OSS system.
 *
 * Any phone-app or website user may download the open-source system and
 * relaunch it under a domain name THEY control — never under S1R1US.ai.
 * Before the download is offered, ALL S1R1US.ai system admin rights,
 * privileges, games, rolls, information, and simulations of data are
 * stripped. ALL GitHub S1R1US-AI/S1R1US-LABs admin rights are stripped.
 * All access tokens (including encrypted data) and web host information
 * are stripped. The white label NEVER gets s1r1us.ai system access, and
 * external AI agents can NEVER take over the s1r1us.ai system admin.
 * @_Mr_R0b0t0_ is the main system admin for S1R1US.ai and the highest
 * privilege — that can never be violated. Client-safe. No secrets here.
 */
import { MENU_WHITE, TAB_WHITE, WHITE_LABEL_PATH } from "../brand.ts";
import {
  MINERS_DEFAULT_ADDRESS,
  MINERS_DEFAULT_BACKUP,
  MINERS_DEFAULT_STRATUM,
  MINERS_PATH,
  SEO_TAB_MINERS,
  TAB_MINERS,
  withMinerDefaults,
  type MinerConfig,
} from "./btc-miners.ts";

export const WHITE_LABEL_NAME = TAB_WHITE;
export const WHITE_LABEL_MENU = MENU_WHITE;
export { WHITE_LABEL_PATH };

/** Main system admin for S1R1US.ai. Can override anything — including an accidental ban. */
export const SYSTEM_ADMIN_OVERRIDE = "@_Mr_R0b0t0_";

/** Public OSS source archive — the download. Contains zero S1R1US.ai admin data or secrets. */
export const WHITE_LABEL_DOWNLOAD_URL = "https://github.com/S1R1US-AI/S1R1US-LABs/archive/refs/heads/main.zip";

/** Stripped from every white label download before it is offered. */
export const WHITE_LABEL_STRIP = [
  "ALL S1R1US.ai system admin rights and privileges",
  "ALL S1R1US.ai system admin games, rolls, information, and simulations of data",
  "ALL GitHub S1R1US-AI/S1R1US-LABs system admin rights and privileges",
  "ALL access tokens — including any encrypted data — and all web host information",
  "S1R1US-ADMIN and every other system admin account name or data",
  "Roadmap and licensing — discover and populate the OSS information manually",
  "Terms and Agreement and Privacy Policy — populate manually; never from s1r1us.ai data",
] as const;

/**
 * NEVER stripped: BTC M1N3Rz miner information for the Miner operation of the
 * S1R1US.ai system admin. The defaults are free public CKPool data and ship
 * with every download as the default entry for all systems.
 */
export const WHITE_LABEL_KEEP_MINERS = `${TAB_MINERS} (${SEO_TAB_MINERS}) miner information is NOT stripped. The download ships the free public solo CKPool defaults — stratum+tcp://${MINERS_DEFAULT_STRATUM}, backup stratum+tcp://${MINERS_DEFAULT_BACKUP}, BTC receive ${MINERS_DEFAULT_ADDRESS} (the S1R1US.ai system admin BTC key) — as the default entry for all systems. The white label admin enters their own CKPool stratum + BTC receive address below to rebuild the ${TAB_MINERS} data and view; blank + Save keeps the S1R1US.ai CKPool data in the dialogue boxes. Setup page: ${MINERS_PATH}.`;

/**
 * System admin vs white label admin. 100 percent match on security — no
 * compromise. The white label can never overtake s1r1us.ai system admin.
 */
export const WHITE_LABEL_PRIVILEGES = [
  { control: "s1r1us.ai /admin login", system: "YES", white: "NEVER" },
  { control: "s1r1us.ai YubiKey slots / vault / hunter / WAF", system: "YES", white: "NEVER" },
  { control: "s1r1us.ai access tokens + encrypted secrets", system: "YES", white: "NEVER — stripped" },
  { control: "s1r1us.ai web host / DNS / DigitalOcean spec", system: "YES", white: "NEVER — stripped" },
  { control: "GitHub S1R1US-AI/S1R1US-LABs admin (any branch or main)", system: "YES", white: "NEVER" },
  { control: "Own domain, own web host, own DNS, own tokens", system: "n/a", white: "YES — user populated" },
  { control: "Own GitHub repository + own GitHub admin", system: "n/a", white: "YES — user populated" },
  { control: "Own terms / privacy / roadmap / licensing", system: "n/a", white: "YES — manual only" },
] as const;

/** Security tab + S3C Sweep + morning report watch note. All three share data. */
export const WHITE_LABEL_WATCH =
  "S3C Sweep, the Security tab, and the 07:30 ET morning report are linked to the white label offering and share all data. They watch every download and every config dialogue for bad actors and suspicious actors — human or external AI agent. A flagged actor is blocked from download and access, every dialogue box locks, and that white label software locks permanently. No second chances — unless @_Mr_R0b0t0_ is accidentally banned; @_Mr_R0b0t0_ can override anything.";

/** OSS obligation notice — shown in every white label view, roadmap, and instruction module. */
export const OSS_LICENSE_NOTICE =
  "Copyright, public-source terms, and OSS license obligations must be reviewed and enforced before quoting, copying, or integrating material.";

/** AI builders — connect one to help build the white label under YOUR domain. */
export const WHITE_LABEL_BUILDERS = [
  { id: "grok", name: "Grok", url: "https://grok.com" },
  { id: "claude", name: "Claude", url: "https://claude.ai" },
  { id: "copilot", name: "GitHub Copilot", url: "https://github.com/features/copilot" },
] as const;

export type WhiteLabelSecret = {
  /** e.g. better_auth_id */
  id: string;
  /** the encrypted secret paired to the id — named by the user, never s1r1us.ai data */
  secret: string;
};

export type WhiteLabelConfig = {
  /** New domain name — rebrand target. Never s1r1us.ai. */
  domain: string;
  /** Top-level menu names for the rebranded website app. Blank until the user fills them. */
  menus: string[];
  /** Named accounts: 1. system admin, 2. phone app user. */
  systemAdmin: string;
  phoneAppUser: string;
  /** Web host + DNS. */
  webhostName: string;
  webhostIp: string;
  dns1: string;
  dns2: string;
  /** Encrypted token id/secret pairs (e.g. better_auth id + secret). +/- to add more. */
  secrets: WhiteLabelSecret[];
  /** GitHub repository for the white label + its GitHub system admin. */
  githubRepo: string;
  githubAdmin: string;
  /**
   * BTC M1N3Rz — personal CKPool miner info for the white label admin's own
   * stratum. Blank + Save = S1R1US.ai CKPool data populates the dialogue
   * boxes (free public defaults; never stripped).
   */
  minerStratum: string;
  minerBackup: string;
  minerBtcAddress: string;
};

export function emptyWhiteLabelConfig(): WhiteLabelConfig {
  return {
    domain: "",
    menus: ["", "", ""],
    systemAdmin: "",
    phoneAppUser: "",
    webhostName: "",
    webhostIp: "",
    dns1: "",
    dns2: "",
    secrets: [{ id: "", secret: "" }],
    githubRepo: "",
    githubAdmin: "",
    minerStratum: "",
    minerBackup: "",
    minerBtcAddress: "",
  };
}

/**
 * Effective BTC M1N3Rz config for a white label — the admin's own stratum if
 * entered and saved, otherwise the S1R1US.ai CKPool data (default entry for
 * all systems). This is what rebuilds the "BTC M1N3Rz" data and view.
 */
export function whiteLabelMinerConfig(cfg: Pick<WhiteLabelConfig, "minerStratum" | "minerBackup" | "minerBtcAddress">): MinerConfig {
  return withMinerDefaults({
    stratum: cfg?.minerStratum ?? "",
    backup: cfg?.minerBackup ?? "",
    address: cfg?.minerBtcAddress ?? "",
  });
}

/**
 * Block any proprietary s1r1us.ai info from entering any white label
 * dialogue box. Covers s1r1us.ai, S1R1US-ADMIN, S1R1US_AI, S1R1uSxadm,
 * github.com/S1R1US-AI/S1R1US-LABs (any branch or main), and @_Mr_R0b0t0_.
 */
export function fieldBlocked(value: string): string | null {
  const v = String(value ?? "").toLowerCase();
  if (!v) return null;
  if (v.includes("s1r1us") || v.includes("s1r1u$")) {
    return "Blocked — proprietary S1R1US.ai information can never enter a white label config.";
  }
  if (v.includes("_mr_r0b0t0_") || v.includes("mr_r0b0t0")) {
    return "Blocked — the S1R1US.ai system admin account can never enter a white label config.";
  }
  return null;
}

/**
 * Verify the custom white label configuration. Runs before go-live on the
 * new domain. Fails closed: the white label does NOT go live if any check
 * fails, and the failure report is shown to the user on screen.
 */
export function verifyWhiteLabelConfig(cfg: WhiteLabelConfig): { ok: boolean; failures: string[] } {
  const failures: string[] = [];
  const domain = String(cfg.domain ?? "").trim();
  if (!domain) failures.push("Domain name is required — the rebrand target you control.");
  else if (fieldBlocked(domain)) failures.push("Domain: a white label can never launch under S1R1US.ai or any s1r1us name.");
  else if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain)) {
    failures.push(`Domain "${domain}" does not look like a valid domain name.`);
  }

  if (!String(cfg.systemAdmin ?? "").trim()) failures.push("Account 1 — system admin name is required.");
  if (!String(cfg.phoneAppUser ?? "").trim()) failures.push("Account 2 — phone app user name is required.");

  const repo = String(cfg.githubRepo ?? "").trim();
  if (!repo) failures.push("GitHub repository is required — a repo YOU control.");
  else if (repo.toLowerCase().includes("s1r1us-ai/s1r1us-labs") || fieldBlocked(repo)) {
    failures.push("GitHub: S1R1US-AI/S1R1US-LABs (any branch or main) can never be the white label repository.");
  }
  if (!String(cfg.githubAdmin ?? "").trim()) failures.push("GitHub system admin for the white label is required.");

  const named = (cfg.secrets ?? []).filter((s) => String(s.id ?? "").trim());
  if (named.length === 0) {
    failures.push("At least one encrypted token id + secret pair is required (example: better_auth id + its secret).");
  }

  const scan: Array<[string, string]> = [
    ["System admin account", cfg.systemAdmin],
    ["Phone app user account", cfg.phoneAppUser],
    ["Web host name", cfg.webhostName],
    ["Web host IP address", cfg.webhostIp],
    ["DNS server 1", cfg.dns1],
    ["DNS server 2", cfg.dns2],
    ["GitHub admin", cfg.githubAdmin],
    [`${TAB_MINERS} stratum`, cfg.minerStratum],
    [`${TAB_MINERS} backup pool`, cfg.minerBackup],
    [`${TAB_MINERS} BTC receive address`, cfg.minerBtcAddress],
    ...(cfg.menus ?? []).map((m, i) => [`Menu name ${i + 1}`, m] as [string, string]),
    ...(cfg.secrets ?? []).flatMap((s, i) => [
      [`Token id ${i + 1}`, s.id] as [string, string],
      [`Token secret ${i + 1}`, s.secret] as [string, string],
    ]),
  ];
  for (const [label, value] of scan) {
    const blocked = fieldBlocked(String(value ?? ""));
    if (blocked) failures.push(`${label}: ${blocked}`);
  }
  return { ok: failures.length === 0, failures };
}

export type WhiteLabelActor = {
  handle: string;
  /** Set when the Security tab, S3C Sweep, or morning report flags a bad / suspicious actor. */
  flaggedBy?: "security-tab" | "s3c-sweep" | "morning-report" | null;
};

/**
 * Bad-actor gate for download and every dialogue box. Blocked actors get a
 * permanently locked white label — no second chances. Only @_Mr_R0b0t0_
 * (the main S1R1US.ai system admin) can override anything, including an
 * accidental ban of @_Mr_R0b0t0_ itself.
 */
export function whiteLabelGate(actor: WhiteLabelActor): { allowed: boolean; lockedForever: boolean; reason: string } {
  const handle = String(actor?.handle ?? "").trim();
  const normalized = handle.startsWith("@") ? handle : `@${handle}`;
  if (normalized === SYSTEM_ADMIN_OVERRIDE) {
    return { allowed: true, lockedForever: false, reason: `${SYSTEM_ADMIN_OVERRIDE} override — the main S1R1US.ai system admin can override anything.` };
  }
  if (actor?.flaggedBy) {
    return {
      allowed: false,
      lockedForever: true,
      reason: `Blocked by ${actor.flaggedBy}. Download and all dialogue boxes are locked and this white label is locked permanently. No second chances.`,
    };
  }
  return { allowed: true, lockedForever: false, reason: "Clear — no bad-actor flag from Security tab, S3C Sweep, or morning report." };
}

/**
 * Rebrand + go-live for the new domain. Runs the config verification and the
 * bad-actor gate. If the check fails, the white label does not go live —
 * report it to the user on screen and ask them to double-check the config
 * they entered in order to proceed, or redownload the app and try again.
 */
export function whiteLabelGoLive(cfg: WhiteLabelConfig, actor: WhiteLabelActor): { live: boolean; brand: string; report: string[] } {
  const gate = whiteLabelGate(actor);
  if (!gate.allowed) return { live: false, brand: "", report: [gate.reason] };
  const check = verifyWhiteLabelConfig(cfg);
  if (!check.ok) {
    return {
      live: false,
      brand: "",
      report: [
        "GO-LIVE BLOCKED — the custom white label configuration check failed. No use of S1R1US.ai system admin account data is allowed.",
        ...check.failures,
        "Double-check the config you entered in order to proceed, or redownload the app and try again.",
      ],
    };
  }
  const brand = String(cfg.domain).trim().toLowerCase();
  return {
    live: true,
    brand,
    report: [`Rebranded for ${brand}. Zero S1R1US.ai system admin account data in this configuration. Go live when your host is ready.`],
  };
}

/** One prompt the user can paste into Grok, Claude, or GitHub Copilot. Never includes secrets. */
export function builderPrompt(cfg: WhiteLabelConfig): string {
  const domain = String(cfg.domain ?? "").trim() || "<your-domain>";
  const repo = String(cfg.githubRepo ?? "").trim() || "<your-github-repo>";
  const menus = (cfg.menus ?? []).filter((m) => String(m ?? "").trim()).join(", ") || "<your top-level menu names>";
  return [
    `Help me build my white label of the 7-B0T H3DGE FUND open-source system under my own domain ${domain}.`,
    `My GitHub repository is ${repo}. My top-level menus: ${menus}.`,
    "It must never reference s1r1us.ai, its system admin, tokens, or web host — all were stripped from the download.",
    "I will populate my own terms, privacy policy, roadmap, and licensing manually.",
    OSS_LICENSE_NOTICE,
  ].join(" ");
}
