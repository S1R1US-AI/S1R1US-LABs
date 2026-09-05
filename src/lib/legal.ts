import { APP_NAME, LABS_NAME, SEO_CANONICAL, TAB_DESK, TAB_FEED, TAB_GM, TAB_LAB } from "@/lib/brand";
import { COMPANY_X_HANDLE } from "@/lib/desk/x-admin";

export const TERMS_PATH = "/terms";
export const TERMS_TITLE = "Terms and Agreements";
export const TERMS_HOVER = `${TERMS_TITLE} · using this website is agreement · not financial advice`;

export const LEGAL_NFA =
  "Not financial advice. Not licensed. Not a broker-dealer. Not an investment adviser. Not a recommendation to buy, sell, or hold bitcoin, any token, or any other asset. Education only. Seek a licensed professional. Invest only on the advice of a licensed advisor. You can lose all funds.";

export const LEGAL_HOWEY =
  "Nothing on this website is an offer to sell or a solicitation to buy a security. A cultural ticker, if one exists on a public pad, is not shares of the desk, not a claim on bitcoin, not a share of profit, and not how the trading book is funded. The desk is funded only by operator cash and unconditional gifts that receive nothing back. Do not buy any ticker because bots, a treasury, or a bitcoin stack exist.";

export const LEGAL_USE_IS_AGREEMENT =
  "By accessing or using this website you agree to the Terms and Agreements. If you do not agree, do not use the site.";

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
    body: `${TAB_DESK} (S1R1US 7-bot hedge fund), ${TAB_LAB} (S1R1US Lab Strategies), ${TAB_GM} (Godzilla mode), and ${TAB_FEED} (Feed Godzilla mode) are educational tools and open-source software. Practice and paper fills are not live orders. Live execution, if ever unlocked, is the operator's own risk. You are responsible for any action you take.`,
  },
  {
    id: "gifts",
    title: "6. Donations and gifts",
    body: `${TAB_FEED} wallets, if used, are optional gifts to help pay hosting, domain, and app-store fees. Gifts buy no ticker, no equity, no profit share, and no service level. Do not send anything except the stated asset to the stated address. Wrong-network sends can be lost.`,
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
    body: `${APP_NAME} source is offered under Apache License 2.0 where stated on GitHub. Brand marks stay with ${LABS_NAME}. Do not imply we endorse your trades.`,
  },
  {
    id: "conduct",
    title: "10. Prohibited use",
    body: "Do not use the site to commit crime, to scrape in a way that harms the service, or to market an unregistered security as if it were this desk. Do not paste seeds, Coinbase keys, or one-time codes into any form.",
  },
  {
    id: "changes",
    title: "11. Changes",
    body: `We may update these Terms. The date at the top of the Terms page is the current version. Continued use after a change is agreement to the new Terms. Last updated ${TERMS_UPDATED}. Canonical: ${SEO_CANONICAL.replace(/\/$/, "")}${TERMS_PATH}.`,
  },
];
