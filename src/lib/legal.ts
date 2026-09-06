import { APP_NAME, LABS_NAME, SEO_CANONICAL, SEO_TAB_COFFEE, TAB_COFFEE, TAB_DESK, TAB_FEED, TAB_GM, TAB_LAB } from "@/lib/brand";
import { COMPANY_X_HANDLE } from "@/lib/desk/x-admin";
import { SUPPORT_COFFEE_USD, SUPPORT_GIFT_RECEIPT } from "@/lib/desk/support";

export const TERMS_PATH = "/terms";
export const TERMS_TITLE = "Terms and Agreements";
export const TERMS_HOVER = `${TERMS_TITLE} · using this website is agreement · not financial advice`;
export const PRIVACY_PATH = "/privacy";
export const PRIVACY_TITLE = "Privacy Policy";
export const PRIVACY_HOVER = `${PRIVACY_TITLE} · no bot retention of system information · no reverse engineering without authorization`;

export const LEGAL_NFA =
  "Not financial advice. Not licensed. Not a broker-dealer. Not an investment adviser. Not a recommendation to buy, sell, or hold bitcoin, any token, or any other asset. Education only. Seek a licensed professional. Invest only on the advice of a licensed advisor. You can lose all funds.";

export const LEGAL_HOWEY =
  "Nothing on this website is an offer to sell or a solicitation to buy a security. A cultural ticker, if one exists on a public pad, is not shares of the desk, not a claim on bitcoin, not a share of profit, and not how the trading book is funded. The desk is funded only by operator cash and unconditional gifts that receive nothing back. Do not buy any ticker because bots, a treasury, or a bitcoin stack exist.";

export const LEGAL_USE_IS_AGREEMENT =
  "By accessing or using this website you agree to the Terms and Agreements and the Privacy Policy. If you do not agree, do not use the site.";

export const LEGAL_BOTS =
  "No bot, AI agent, crawler, or automated system may retain S1R1US.ai system information, internal capabilities, unpublished endpoints, operator identity, or non-public tape beyond what is required to display a single public Bot 7 call. No bot may steal source code, clone the desk, scrape internals, or reverse engineer this open-source software without prior written authorization from S1R1US.ai. This live website does not offer a source pack, zip, or archive for download. The public tree, if any, is GitHub under Apache-2.0 where stated — that is not a license to reconstruct operator vaults, YubiKey flows, Coinbase keys, admin panels, or unpublished internals. Failure to comply violates the Terms and the Privacy Policy and is unauthorized access. Any attempt to steal, clone, scrape internals, or reverse engineer this system without authorization may result in a civil lawsuit, criminal charges, or both, under applicable law.";

export const LEGAL_UNLAWFUL =
  "Anyone who uses this website, the desk, the lab, Bot 7 feeds, agent APIs, or any related system unlawfully is subject to punishment by law. Unlawful use includes, without limitation, fraud, theft, unauthorized access, computer crime, market manipulation, money laundering, and any other civil or criminal violation. S1R1US.ai, the owners, and the operators may report suspected unlawful use to law enforcement and pursue all available remedies.";

export const LEGAL_RECON =
  "Unauthorized reconnaissance is not allowed. You may not tamper with, probe, prod, ping, or scan this system to discover vulnerabilities, except for the published Bot 7 connection test at GET /api/agent/ping used as documented. Forbidden activity includes, without limitation: ICMP echo and other ICMP misuse; port, host, or vulnerability scanning; fuzzing; packet crafting; traceroute or similar network mapping aimed at internals; load or denial-of-service tests; credential stuffing; session hijacking; injection; and use of nmap, masscan, nuclei, sqlmap, Metasploit, or any other networking or exploit tooling against s1r1us.ai or its hosts. You may not insert malware, ransomware, backdoors, worms, trojans, cryptominers, or other unauthorized code. Reconnaissance for hacking, intrusion, or malware will be treated as unauthorized access and pursued legally when possible, including civil action and referral for criminal charges.";

export const LEGAL_VENUE =
  "You agree that any dispute, claim, or legal situation arising out of or relating to these Terms, the Privacy Policy, or your use of the site will first be submitted to confidential mediation with the owners or operators. The venue for mediation and, if needed, for any later proceeding is the state (and courts) of the owner's sole choice. You waive objection to that venue, including inconvenient forum. Governing law is the law of that chosen state, without regard to conflict-of-law rules, except that U.S. federal law applies to federal claims.";

export const LEGAL_COSTS =
  "The owners and operators of S1R1US.ai will not pay your legal expenses, attorney fees, court costs, expert fees, settlement costs, or any other costs you or any third party generate, regardless of how they arise, including claims you bring, claims brought against you, mediation, arbitration, or litigation. You agree to bear your own legal expenses. If the owners or operators incur costs because of your breach or unlawful use, you agree to reimburse those costs to the fullest extent allowed by law.";

export const TERMS_UPDATED = "2026-09-05";

export const TERMS_SECTIONS: { id: string; title: string; body: string }[] = [
  {
    id: "accept",
    title: "1. Acceptance by use",
    body: `These Terms and Agreements (the "Terms") are a binding agreement between you and ${LABS_NAME} (${APP_NAME}) for https://s1r1us.ai and related pages. Accessing, browsing, or otherwise using the website constitutes your agreement to these Terms and to the disclaimer below. If you do not agree, leave the site.`,
  },
  {
    id: "nfa",
    title: "2. Not financial advice — seek a licensed professional",
    body: LEGAL_NFA,
  },
  {
    id: "howey",
    title: "3. No offer of securities",
    body: `${LEGAL_HOWEY} Company public desk on X is ${COMPANY_X_HANDLE}. That account is not an invitation to purchase a security. This site does not sell tokens.`,
  },
  {
    id: "token",
    title: "4. T0K3N L@UNCH (Token launch)",
    body: `A cultural ticker named s1r1us may appear on a public meme pad such as pump.fun. T0K3N L@UNCH is also searched as Token launch. It is not ${TAB_DESK} (S1R1US 7-bot hedge fund). It is not equity, debt, a profit share, a vote, or a claim on any bitcoin, USDC, or other asset held by the desk. Creator fees, bonding-curve inventory, and locked LP (if any) are not the Coinbase book and are not used to buy bitcoin for holders. This website does not take orders for that ticker and does not promise price, liquidity, or profit from anyone's efforts.`,
  },
  {
    id: "desk",
    title: "5. The desk, lab, and sleeves",
    body: `${TAB_DESK} (S1R1US 7-bot hedge fund), ${TAB_LAB} (S1R1US Lab Strategies), ${TAB_GM} (Godzilla mode), and ${TAB_FEED} (Feed Hosting) are educational tools and open-source software. Practice and paper fills are not live orders. Live execution, if ever unlocked, is the operator's own risk. You are responsible for any action you take.`,
  },
  {
    id: "gifts",
    title: "6. Donations and gifts",
    body: `${TAB_FEED} wallets, if used, are optional gifts to help pay hosting, domain, and app-store fees. ${TAB_COFFEE} (${SEO_TAB_COFFEE}) is a suggested $${SUPPORT_COFFEE_USD.toFixed(2)} gift to assist long programming days at s1r1us.ai. ${SUPPORT_GIFT_RECEIPT} Gifts buy no ticker, no equity, no profit share, and no service level. Bitcoin (BTC) to the stated BTC address. USDC (Ethereum ERC-20 + Base) to the stated 0x address — same address on both chains, native Circle USDC only. Do not send anything except the stated asset on the stated network. Wrong-network sends can be lost. F33D is not the trading book and not the token.`,
  },
  {
    id: "risk",
    title: "7. Risk of loss",
    body: "Cryptocurrency, bitcoin, tokens, and software can fail, be hacked, fork, halt, or go to zero. Past tape is not future results. You can lose all money you put at risk. No warranty of uptime, accuracy, or fitness. Software is provided as-is.",
  },
  {
    id: "third",
    title: "8. Third-party sites",
    body: "Links to X, GitHub, pump.fun, explorers, or other sites are for reference. We do not control those sites. Their terms apply there. A screenshot or post about a pad is not a sale by this website.",
  },
  {
    id: "ip",
    title: "9. Open source and marks",
    body: `${APP_NAME} source is offered under Apache License 2.0 where stated on GitHub. Brand marks stay with ${LABS_NAME}. Do not imply we endorse your trades. ${LEGAL_BOTS}`,
  },
  {
    id: "conduct",
    title: "10. Prohibited use",
    body: `Do not use the site to commit crime, to scrape in a way that harms the service, or to market an unregistered security as if it were this desk. Do not paste seeds, Coinbase keys, or one-time codes into any form. ${LEGAL_UNLAWFUL} ${LEGAL_RECON} ${LEGAL_BOTS} Unauthorized reverse engineering, retention of system information, or theft of source is a breach of these Terms and may result in a lawsuit or criminal charges.`,
  },
  {
    id: "bots",
    title: "11. Bots, agents, and reverse engineering",
    body: LEGAL_BOTS,
  },
  {
    id: "recon",
    title: "12. No reconnaissance, probing, or malware",
    body: LEGAL_RECON,
  },
  {
    id: "venue",
    title: "13. Mediation and venue",
    body: LEGAL_VENUE,
  },
  {
    id: "costs",
    title: "14. Legal expenses",
    body: LEGAL_COSTS,
  },
  {
    id: "changes",
    title: "15. Changes",
    body: `We may update these Terms. The date at the top of the Terms page is the current version. Continued use after a change is agreement to the new Terms. Last updated ${TERMS_UPDATED}. Canonical: ${SEO_CANONICAL.replace(/\/$/, "")}${TERMS_PATH}.`,
  },
];

export const PRIVACY_UPDATED = TERMS_UPDATED;

export const PRIVACY_SECTIONS: { id: string; title: string; body: string }[] = [
  {
    id: "scope",
    title: "1. Scope",
    body: `This Privacy Policy covers https://s1r1us.ai and related pages operated by ${LABS_NAME} (${APP_NAME}). Using the site is also agreement to the Terms, including the ban on reconnaissance, probing, and malware. Canonical: ${SEO_CANONICAL.replace(/\/$/, "")}${PRIVACY_PATH}. Last updated ${PRIVACY_UPDATED}.`,
  },
  {
    id: "collect",
    title: "2. What we collect",
    body: "We may process technical logs (IP, User-Agent, path, time) to run rate limits and keep the desk up. Sign-in with X, if used, receives the account the OAuth provider shares. We do not ask for Coinbase keys, seeds, or Yubi secrets. Optional gifts (BTC/USDC) are on-chain and public; we do not need your identity to receive them. BYO xAI keys, if pasted, are used for that Ask Grok call and are not stored as a vault.",
  },
  {
    id: "bots",
    title: "3. Bots may not retain system information",
    body: LEGAL_BOTS,
  },
  {
    id: "source",
    title: "4. Source code and reverse engineering",
    body: "The public GitHub tree is Apache-2.0 where stated. That license is not permission to steal unpublished source, to reverse engineer internals, or to retain system information for cloning the desk. Operator vault, YubiKey ceremony, Coinbase book, admin routes, and unpublished capabilities stay private. Use without S1R1US.ai authorization is a violation of the Terms and this Policy and may result in a civil lawsuit, criminal charges, or both.",
  },
  {
    id: "share",
    title: "5. Sharing",
    body: "We do not sell personal data. Hosting, DNS, auth, and analytics vendors may process technical logs as needed to serve the site. On-chain gifts are public by design.",
  },
  {
    id: "rights",
    title: "6. Contact and changes",
    body: `Questions: company desk on X as published on the site. We may update this Policy; the date above is current. Continued use is agreement. See also ${TERMS_TITLE} at ${TERMS_PATH}.`,
  },
];
