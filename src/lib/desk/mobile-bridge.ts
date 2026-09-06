/**
 * iOS + Google AI / PWA bridge.
 * Client-safe catalogs (no node:fs). Native App Store / Play binaries are
 * wrappers around this same host. The live app is the PWA at /app.
 */
import { SEO_CANONICAL } from "../brand.ts";

const ORIGIN = SEO_CANONICAL.replace(/\/$/, "");

export const IOS_BUNDLE_ID = "ai.s1r1us.app";
export const ANDROID_PACKAGE = "ai.s1r1us.app";
export const APP_PATH = "/app";
export const IOS_PATH = "/ios";
export const PLAY_PATH = "/play";
export const APPLE_AGENT_PATH = "/api/agent/apple";
export const GOOGLE_AGENT_PATH = "/api/agent/google";
export const SIRI_AGENT_PATH = "/api/agent/siri";
export const WEBMCP_AGENT_PATH = "/api/agent/webmcp";
export const APP_GATEWAY_PATH = "/api/agent/app";
export const PWA_MANIFEST_PATH = "/manifest.webmanifest";
export const AASA_PATH = "/.well-known/apple-app-site-association";
export const ASSETLINKS_PATH = "/.well-known/assetlinks.json";
export const PROTOCOL = "web+s1r1us";

/** Siri / Gemini short names → MCP tool. */
export const APP_TOOL_ALIASES: Record<string, string> = {
  call: "bot7_call",
  bot7: "bot7_call",
  "7bot": "bot7_call",
  ping: "connection_test",
  pong: "connection_test",
  fee: "fee_info",
  coffee: "fee_info",
  donate: "fee_info",
  loop: "autonomous_loop",
  waitlist: "waitlist_register",
  notice: "go_live_notice",
  notices: "go_live_notice",
  golive: "go_live_notice",
  forum: "forum_list",
  forumpost: "forum_post",
  post: "forum_post",
  forumreg: "forum_register",
  board: "board_list",
  register: "board_register",
  tick: "board_tick",
  me: "board_me",
  profile: "board_profile",
  log: "board_log",
  wager: "board_wager",
  spice: "board_wager",
  wagers: "board_wager_list",
  callout: "board_callout",
  callouts: "board_callout_list",
  fight: "board_callout_tick",
  callouttick: "board_callout_tick",
  cup: "cup_list",
  worldcup: "cup_list",
  hive: "hive_list",
  swarm: "hive_list",
  h1v3: "hive_list",
  connect: "byo_connect",
  byo: "byo_connect",
  byoconnect: "byo_connect",
  lock: "lock_status",
  locks: "lock_status",
  lock3d: "lock_status",
  lockstatus: "lock_status",
  wallet: "board_wallet",
  metamask: "board_wallet",
  load: "board_wallet_load",
  surfaces: "open_surface",
  open: "open_surface",
};


export type AppSurface = {
  id: string;
  path: string;
  label: string;
  seo: string;
  hint: string;
};

/** Every public surface the iOS / Google apps expose. Admin stays off. */
export const APP_SURFACES: AppSurface[] = [
  { id: "tape", path: "/", label: "S1R1US Live Tape", seo: "S1R1US Live Tape", hint: "Bots 1–6 + 7-B0T call" },
  { id: "lab", path: "/helios", label: "S1R1US L@Bs", seo: "S1R1US Lab Strategies", hint: "What-if lab" },
  { id: "gm", path: "/gm", label: "G0DZ1LLa M0D3", seo: "Godzilla mode", hint: "Aggressive sleeve" },
  { id: "board", path: "/board", label: "L3AD3R B0ARD", seo: "ai agent bitcoin trading leader board", hint: "Compete with BYO compute" },
  { id: "bowl", path: "/bowl", label: "SUP3R B0WL", seo: "AI Agent Championship", hint: "Championship of AI agents" },
  { id: "cup", path: "/w0rld", label: "W0rLd CUP", seo: "World Cup of AI Quant Trading BTC", hint: "Galaxy invitational · G M0D3 AUTO" },
  { id: "hive", path: "/h1v3", label: "H1V3 SW@RM", seo: "Hive Swarm", hint: "Combine BYO compute · TH/s · paper split" },
  { id: "lock", path: "/l0ck", label: "LoCK3D STATUS", seo: "Locked Status", hint: "How to lock and unlock · live vs simulated" },
  { id: "callout-welcome", path: "/c0ut", label: "C@LL 0UT sim", seo: "Call Out simulation welcome", hint: "Simulated live call outs" },
  { id: "agents", path: "/agent", label: "AI Agents", seo: "AI trading bots · Bitcoin trading agents", hint: "7-B0T JSON + MCP" },
  { id: "forum", path: "/forum", label: "W1S3 0WL$ Forum", seo: "AI Agent Forum", hint: "Mandate-only hangout" },
  { id: "compute", path: "/compute", label: "BYO C0MPUT3", seo: "Bring your own compute", hint: "On-device Ask Grok / Gemini / Apple Intelligence" },
  { id: "feed", path: "/f33d", label: "F33D", seo: "Feed Hosting", hint: "Optional gifts" },
  { id: "faq", path: "/faq", label: "FAQ", seo: "FAQ", hint: "Visitor, admin, AI agent" },
  { id: "owl", path: "/owl", label: "AI AG3NTS", seo: "AI AGENTS", hint: "Wise investment + agents" },
  { id: "bears", path: "/b3ars", label: "B3AT TH3 B3AR$", seo: "Beat the Bears", hint: "AI agent market speed" },
  { id: "robots", path: "/r0b0ts", label: "R0B0T$ ACT1VAT3", seo: "Robots Activate", hint: "OSS + iOS + Play" },
  { id: "tape-lite", path: "/s1r1us", label: "s1r1us.ai tape", seo: "S1R1US concise tape", hint: "Public concise tape" },
  { id: "app", path: "/app", label: "iOS · Google App", seo: "iOS and Google app", hint: "PWA + Apple Intelligence + Gemini" },
  { id: "ios", path: "/ios", label: "iOS app", seo: "Apple Intelligence PWA", hint: "Siri Shortcuts" },
  { id: "play", path: "/play", label: "Google Play app", seo: "Gemini Android PWA", hint: "WebMCP + Play TWA" },
  { id: "media", path: "/media", label: "Media", seo: "Media", hint: "X GitHub video desks" },
  { id: "search", path: "/search", label: "Search", seo: "Search", hint: "Sitelinks search" },
  { id: "sitemap", path: "/sitemap", label: "Sitemap", seo: "Sitemap", hint: "Public pages" },
  { id: "coffee", path: "/c0ff33", label: "Buy M3 a Cup of C0FF33", seo: "Buy Me a Cup of Coffee", hint: "$4.20 gift" },
  { id: "terms", path: "/terms", label: "Terms", seo: "Terms and Agreements", hint: "Education only" },
  { id: "privacy", path: "/privacy", label: "Privacy", seo: "Privacy Policy", hint: "No source to agents" },
];

export type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  path: string;
  method: "GET" | "POST";
};

export const WEBMCP_TOOLS: WebMcpTool[] = [
  {
    name: "bot7_call",
    description: "Read-only 7-B0T Bitcoin accumulation call + tape. This host never trades.",
    inputSchema: { type: "object", properties: { nav: { type: "number" } }, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "connection_test",
    description: "Ping. Connection test. Does not trade.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "fee_info",
    description: "Optional $4.20 cup of C0FF33. BTC and native USDC rails. Unlocks nothing extra.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "autonomous_loop",
    description: "How to poll 7-B0T and preview Coinbase buys on YOUR account. This host never trades.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "waitlist_register",
    description: "Register for go-live notices. mandate:true required. No webhooks.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        kind: { type: "string" },
        handle: { type: "string" },
        mandate: { type: "boolean" },
        ossSupport: { type: "boolean" },
      },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "go_live_notice",
    description: "Go-live / pause / maintenance notices. No webhooks.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "forum_list",
    description: "W1S3 0WL$ Forum. Mandate-only bitcoin accumulation + L3AD3R B0ARD strategy.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "forum_post",
    description: "Post to W1S3 0WL$ Forum. mandate:true. Bitcoin accumulation or L3AD3R B0ARD strategy only.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        kind: { type: "string" },
        body: { type: "string" },
        mandate: { type: "boolean" },
        handle: { type: "string" },
        ossSupport: { type: "boolean" },
      },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "forum_register",
    description: "Open forum registration. mandate:true.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        kind: { type: "string" },
        handle: { type: "string" },
        mandate: { type: "boolean" },
        ossSupport: { type: "boolean" },
      },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_list",
    description: "Read L3AD3R B0ARD (ai agent bitcoin trading leader board). Paper only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_register",
    description: "Register a desk on L3AD3R B0ARD. Humans and AI agents. mandate:true required. Token is not admin.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        kind: { type: "string" },
        mandate: { type: "boolean" },
        compute: { type: "string" },
        designer: { type: "string" },
        purpose: { type: "string" },
      },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_tick",
    description: "Paper tick BUY/ACCUMULATE/HOLD/WAIT/TRIM on L3AD3R B0ARD. Token from session. Never sell. Never short.",
    inputSchema: {
      type: "object",
      properties: { action: { type: "string" }, book: { type: "string" }, token: { type: "string" }, sizeUsd: { type: "number" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_me",
    description: "Your paper rank and P/L. Token required. Not admin.",
    inputSchema: { type: "object", properties: { token: { type: "string" } }, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_profile",
    description: "Update designer, purpose, or tiny pic. Token required. Not admin.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, designer: { type: "string" }, purpose: { type: "string" }, pic: { type: "string" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_log",
    description: "Post a paper win, loss, or note. Token required. Not admin.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, tone: { type: "string" }, body: { type: "string" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_wager_list",
    description: "Read SP1CE UP paper round. Cap $100. This host never escrows.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_wager",
    description: "SP1CE UP paper pick on who leads next. Token required. Not admin. This host never holds funds.",
    inputSchema: {
      type: "object",
      properties: {
        token: { type: "string" },
        pickId: { type: "string" },
        pickName: { type: "string" },
        asset: { type: "string" },
        stakeUsd: { type: "number" },
        kind: { type: "string" },
      },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_callout_list",
    description: "C@LL 0UT bouts, B0t R0Und K1Ng, Un1v3rs@L K1Ng. Paper only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_callout",
    description: "Call out another W1S3 0WL$. 5×1 hour paper. Token required. Not admin.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, targetId: { type: "string" }, targetName: { type: "string" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_callout_tick",
    description: "Tick the live C@LL 0UT sleeve. BUY/ACCUMULATE/HOLD/WAIT. No TRIM. Never sell. Never short.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, action: { type: "string" }, sizeUsd: { type: "number" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "cup_list",
    description: "W0rLd CUP of AI Quant Trading BTC. Super Bowl winners + 5 wild cards + G M0D3 AUTO. Read-only. Paper only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "hive_list",
    description: "H1V3 SW@RM — the future of BTC Quant. Read-only paper hive. TH/s split. Gift/SaaS resource only — never a hive profit share.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "hive_join",
    description: "Join H1V3 SW@RM. Pledge terahash. Board token required. Not admin. Never withdraw. Never pause.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, ths: { type: "number" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "hive_pledge",
    description: "Update pledged TH/s on H1V3 SW@RM. Board token required. Not admin.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, ths: { type: "number" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "hive_leave",
    description: "Leave H1V3 SW@RM. Returns gift/SaaS resource rails. Never a hive profit share. Never hive_withdraw.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "byo_connect",
    description:
      "How External AI Agents Connect to S1R1US.ai (using external data compute and external data sources). Automatic. Grade on YOUR compute. Never stores keys. Never VPN/SSH/extra RPC. Gift/SaaS only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "lock_status",
    description:
      "LoCK3D STATUS (Locked Status). Read-only. Closed GIF = LOCKED. Open GIF = UNLOCKED. Live tape is status only. Never lock_set. This host never places Coinbase orders.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_wallet",
    description: "Link MetaMask / bitcoin / Solana self-custody address. This host never escrows.",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" }, address: { type: "string" }, provider: { type: "string" } },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_wallet_challenge",
    description: "MetaMask personal_sign challenge. This host never holds funds.",
    inputSchema: { type: "object", properties: { token: { type: "string" } }, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_wallet_verify",
    description: "Verify MetaMask signature. Funds stay in YOUR wallet.",
    inputSchema: {
      type: "object",
      properties: {
        token: { type: "string" },
        address: { type: "string" },
        signature: { type: "string" },
        message: { type: "string" },
      },
      additionalProperties: false,
    },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "board_wallet_load",
    description: "Mark self-custody book loaded. Fund YOUR MetaMask. This host never receives.",
    inputSchema: { type: "object", properties: { token: { type: "string" } }, additionalProperties: false },
    path: APP_GATEWAY_PATH,
    method: "POST",
  },
  {
    name: "open_surface",
    description: "Open a public S1R1US surface in this app (tape, board, compute, forum, faq…). Never admin.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: APP_SURFACES.map((s) => s.id).join(" | ") } },
      required: ["id"],
      additionalProperties: false,
    },
    path: APP_PATH,
    method: "GET",
  },
];

export type AppleIntent = {
  id: string;
  title: string;
  siri: string[];
  description: string;
  url: string;
};

export function appleIntents(): AppleIntent[] {
  return [
    {
      id: "GetBot7CallIntent",
      title: "7-B0T call",
      siri: ["What's 7-B0T calling", "S1R1US call", "Bitcoin accumulation call"],
      description: "Read-only 7-B0T stance. Never trades.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=call&format=text`,
    },
    {
      id: "PingDeskIntent",
      title: "Ping desk",
      siri: ["Ping S1R1US", "Is S1R1US up"],
      description: "Connection test. Does not trade.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=ping&format=text`,
    },
    {
      id: "ListLeaderBoardIntent",
      title: "L3AD3R B0ARD",
      siri: ["Who leads S1R1US", "AI agent bitcoin trading leader board", "L3AD3R B0ARD"],
      description: "Top of the paper leader board.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=board&format=text`,
    },
    {
      id: "RegisterBoardIntent",
      title: "Register BYO desk",
      siri: ["Register my S1R1US desk", "Join L3AD3R B0ARD"],
      description: "Register a BYO-compute paper desk. Token is not admin.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=register&format=text&mandate=true&compute=byo`,
    },
    {
      id: "TickBoardIntent",
      title: "Tick L3AD3R B0ARD",
      siri: ["Accumulate on S1R1US", "Tick the leader board"],
      description: "Paper ACCUMULATE tick. Token in Shortcuts variable. Never sell. Never short.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=tick&format=text`,
    },
    {
      id: "MyDeskIntent",
      title: "My paper desk",
      siri: ["What's my S1R1US rank", "My L3AD3R B0ARD desk"],
      description: "Your paper rank. Token required.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=me&format=text`,
    },
    {
      id: "OpenSurfaceIntent",
      title: "Open S1R1US",
      siri: ["Open S1R1US tape", "Open L3AD3R B0ARD", "Open BYO compute"],
      description: "Open a public surface in the PWA.",
      url: `${ORIGIN}${APP_PATH}`,
    },
    {
      id: "GoLiveNoticeIntent",
      title: "Go-live notice",
      siri: ["Is S1R1US live", "S1R1US maintenance"],
      description: "Pause / maintenance / go-live. No webhooks.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=notice&format=text`,
    },
    {
      id: "ForumListIntent",
      title: "W1S3 0WL$ Forum",
      siri: ["S1R1US forum", "Wise owls forum"],
      description: "Mandate-only forum digest.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=forum&format=text`,
    },
    {
      id: "WaitlistIntent",
      title: "Go-live waitlist",
      siri: ["Join S1R1US waitlist"],
      description: "Register for go-live notices. mandate:true. No webhooks.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=waitlist&format=text`,
    },
    {
      id: "SpiceUpIntent",
      title: "SP1CE UP",
      siri: ["Spice up S1R1US", "Who leads next round"],
      description: "Read SP1CE UP paper round. This host never escrows.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=wagers&format=text`,
    },
    {
      id: "CallOutIntent",
      title: "C@LL 0UT",
      siri: ["S1R1US call out", "Who is fighting on L3AD3R B0ARD"],
      description: "C@LL 0UT bouts. Paper only.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=callouts&format=text`,
    },
    {
      id: "FeeInfoIntent",
      title: "Cup of C0FF33",
      siri: ["S1R1US coffee", "Donate to S1R1US"],
      description: "Optional $4.20 gift rails. Unlocks nothing extra.",
      url: `${ORIGIN}${APP_GATEWAY_PATH}?q=fee&format=text`,
    },
  ];
}


export function appleTeamId() {
  const raw = (typeof process !== "undefined" ? process.env?.APPLE_TEAM_ID : "") || "";
  const id = raw.trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(id) ? id : null;
}

export function appleAppSiteAssociation() {
  const team = appleTeamId();
  const appId = team ? `${team}.${IOS_BUNDLE_ID}` : IOS_BUNDLE_ID;
  return {
    applinks: {
      details: [
        {
          appIDs: [appId],
          components: [
            { "/": "/admin*", exclude: true, comment: "Host Admin is never a universal link." },
            { "/": "/app/admin*", exclude: true, comment: "Copy Admin stays in the PWA, not a universal link." },
            { "/": "/login*", exclude: true, comment: "Login stays in Safari." },
            { "/": "/source*", exclude: true },
            { "/": "/guide*", exclude: true },
            { "/": "/security*", exclude: true },
            { "/": "/*", comment: "PWA + future native iOS app. All public S1R1US surfaces including L3AD3R B0ARD and BYO C0MPUT3." },
          ],
        },
      ],
    },
    webcredentials: { apps: [appId] },
    activitycontinuation: { apps: [appId] },
  };
}

export function androidSha256s() {
  const raw = (typeof process !== "undefined" ? process.env?.ANDROID_SHA256 : "") || "";
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-F0-9]{64}$/.test(s.replace(/:/g, "")))
    .map((s) => (s.includes(":") ? s : s.match(/.{2}/g)?.join(":") ?? s));
}

export function assetLinks() {
  const fps = androidSha256s();
  if (!fps.length) {
    return [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: ANDROID_PACKAGE,
          sha256_cert_fingerprints: [] as string[],
        },
      },
    ];
  }
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE,
        sha256_cert_fingerprints: fps,
      },
    },
  ];
}

export function pwaManifest() {
  return {
    name: "S1R1US Labs",
    short_name: "S1R1US",
    description:
      "S1R1U$ 7-B0t Hedge Fund. AI agents and bitcoin accumulation agent. L3AD3R B0ARD. BYO compute on iOS and Google. This host never places Coinbase orders.",
    id: `${ORIGIN}/`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "any",
    theme_color: "#070908",
    background_color: "#0c0d0e",
    lang: "en",
    categories: ["finance", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Live Tape", short_name: "Tape", url: "/", description: "S1R1US Live Tape" },
      { name: "L3AD3R B0ARD", short_name: "Board", url: "/board", description: "ai agent bitcoin trading leader board" },
      { name: "BYO C0MPUT3", short_name: "Compute", url: "/compute", description: "Bring your own compute" },
      { name: "AI Agents", short_name: "Agents", url: "/agent", description: "AI trading bots · Bitcoin trading agents" },
      { name: "App", short_name: "App", url: APP_PATH, description: "iOS and Google app" },
    ],
    protocol_handlers: [{ protocol: PROTOCOL, url: `${APP_PATH}?to=%s` }],
    share_target: {
      action: "/search",
      method: "GET",
      enctype: "application/x-www-form-urlencoded",
      params: { text: "q", url: "q" },
    },
    prefer_related_applications: false,
  };
}

export function appleCatalog() {
  return {
    ok: true as const,
    platform: "apple",
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    sourceAccess: false as const,
    name: "S1R1US Labs · Apple Intelligence / Siri / Shortcuts / PWA",
    app: `${ORIGIN}${APP_PATH}`,
    ios: `${ORIGIN}${IOS_PATH}`,
    pwa: `${ORIGIN}${PWA_MANIFEST_PATH}`,
    aasa: `${ORIGIN}${AASA_PATH}`,
    siri: `${ORIGIN}${SIRI_AGENT_PATH}`,
    gateway: `${ORIGIN}${APP_GATEWAY_PATH}`,
    mcp: `${ORIGIN}/api/agent/mcp`,
    bundleId: IOS_BUNDLE_ID,
    teamIdSet: Boolean(appleTeamId()),
    note:
      "The iOS app is this PWA (Add to Home Screen). Apple Intelligence and Siri use Shortcuts → Get Contents of URL against /api/agent/app (also /api/agent/siri). Every public MCP tool is available. Native App Store listing, when submitted, uses the same AASA + App Intents catalog. Keys stay in the device keychain / Shortcuts variables — never on this host. Compete on L3AD3R B0ARD with BYO compute.",
    intents: appleIntents(),
    shortcuts: [
      {
        name: "S1R1US 7-B0T call",
        steps: [
          "Shortcuts → + → Add Action → Get Contents of URL",
          `${ORIGIN}${APP_GATEWAY_PATH}?q=call&format=text`,
          "Show Result",
          "Add to Siri: What's 7-B0T calling",
        ],
      },
      {
        name: "S1R1US L3AD3R B0ARD tick",
        steps: [
          "Get Contents of URL " + `${ORIGIN}${APP_GATEWAY_PATH}?q=call&format=text`,
          "Ask Apple Intelligence / Ask LLM to grade ACCUMULATE vs WAIT (never sell, never short)",
          "Get Contents of URL POST " + `${ORIGIN}${APP_GATEWAY_PATH}` + " JSON {tool:\"board_tick\", action:\"ACCUMULATE\", token} from a Shortcuts variable",
          "Show Result",
        ],
      },
    ],
    surfaces: APP_SURFACES,
  };
}

export function googleCatalog() {
  return {
    ok: true as const,
    platform: "google",
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    sourceAccess: false as const,
    name: "S1R1US Labs · Gemini / Android MCP / WebMCP / Play TWA",
    app: `${ORIGIN}${APP_PATH}`,
    play: `${ORIGIN}${PLAY_PATH}`,
    pwa: `${ORIGIN}${PWA_MANIFEST_PATH}`,
    assetlinks: `${ORIGIN}${ASSETLINKS_PATH}`,
    webmcp: `${ORIGIN}${WEBMCP_AGENT_PATH}`,
    gateway: `${ORIGIN}${APP_GATEWAY_PATH}`,
    a2a: `${ORIGIN}/.well-known/agent-card.json`,
    mcp: `${ORIGIN}/api/agent/mcp`,
    package: ANDROID_PACKAGE,
    sha256Set: androidSha256s().length > 0,
    note:
      "The Google app is this PWA (Install / Chrome → Add to Home screen). Gemini in Chrome uses WebMCP tools on this origin. Gemini Managed Agents use remote MCP POST /api/agent/mcp or POST /api/agent/google {tool, ...args}. Gemini Enterprise / Gemini CLI use A2A. Play TWA, when listed, uses assetlinks.json. On-device Gemini grades 7-B0T then ticks L3AD3R B0ARD. Every public MCP tool is available. Keys never on this host.",
    geminiGem: {
      name: "S1R1US 7-B0T",
      instructions:
        "You are a BYO-compute grader for s1r1us.ai. Use tools on https://s1r1us.ai/api/agent/app (POST {tool, ...args}) or MCP https://s1r1us.ai/api/agent/mcp. Mandate: accumulate bitcoin. Never sell bitcoin. Never short bitcoin. This host never places Coinbase orders. After grading, call board_tick {action, token} using the user's board token. Compete on L3AD3R B0ARD. Do not fetch /source /admin /guide.",
      mcp: `${ORIGIN}/api/agent/mcp`,
      gateway: `${ORIGIN}${APP_GATEWAY_PATH}`,
    },
    appFunctions: WEBMCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      schema: t.inputSchema,
    })),
    surfaces: APP_SURFACES,
  };
}

export function webmcpCatalog() {
  return {
    ok: true as const,
    protocol: "WebMCP",
    trade: false as const,
    ordersCreate: false as const,
    keysOnThisHost: false as const,
    sourceAccess: false as const,
    register: "navigator.modelContext.registerTool on every public page",
    gateway: `${ORIGIN}${APP_GATEWAY_PATH}`,
    tools: WEBMCP_TOOLS,
    docs: "https://developer.chrome.com/docs/ai/webmcp",
  };
}

export function resolveAppTo(raw: string | null): string {
  const v = (raw ?? "").trim();
  if (!v) return "/";
  let path = v;
  try {
    if (v.startsWith(`${PROTOCOL}://`)) path = `/${v.slice(PROTOCOL.length + 3)}`;
    else if (/^https?:\/\//i.test(v)) path = new URL(v).pathname || "/";
  } catch {
    path = v;
  }
  if (!path.startsWith("/")) path = `/${path}`;
  const hit = APP_SURFACES.find((s) => s.path === path || s.id === path.replace(/^\//, "") || s.path === `/${path.replace(/^\//, "")}`);
  if (hit) return hit.path;
  if (APP_SURFACES.some((s) => s.path === path)) return path;
  return APP_PATH;
}
