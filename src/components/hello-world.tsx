import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  APP_NAME,
  TAB_CALLING_BOTS,
  TAB_COMPUTE,
  TAB_HELLO,
  TAB_HOVER_COMPUTE,
  TAB_HOVER_HELLO,
  TAB_HOVER_MAX_GAINS,
  TAB_HOVER_HIVE,
  TAB_HOVER_PRED,
  TAB_HOVER_ROBOTS,
  TAB_HOVER_SEND_BTC,
  TAB_HIVE,
  TAB_MAX_GAINS,
  TAB_PRED,
  TAB_SEND_BTC,
} from "@/lib/brand";
import { GITHUB_URL } from "@/lib/launch/model";

const ORANGE =
  "coinbase-orange font-semibold tracking-tight underline decoration-[#ff8a1f] underline-offset-2";
const BLUE =
  "welcome-blue font-semibold tracking-tight underline decoration-tab underline-offset-2";
const GRAY = "text-[#c8d0cb]";
const COMMENT = "text-[#6a9955]";
const COMMENT_LINK =
  "font-semibold tracking-tight text-[#9cdcfe] underline decoration-[#6a9955] underline-offset-2 hover:text-[#ce9178]";
const RED =
  "font-semibold tracking-tight text-[#e10600] underline decoration-[#e10600] underline-offset-2";

export function HelloWorld() {
  const [open, setOpen] = useState(true);
  const greet = `"welcome to ${APP_NAME}"`;
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full rounded-md text-left hover:bg-fg/4"
      >
        <p className="welcome-blue text-sm">welcome to {APP_NAME}</p>
      </button>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={TAB_HOVER_HELLO}
        aria-label={TAB_HOVER_HELLO}
        className={`${ORANGE} mt-0.5 inline-block text-sm`}
      >
        {TAB_HELLO}
      </a>
      {open ? (
        <pre className="mt-2 overflow-x-auto rounded-md border border-rule bg-black px-4 py-3 font-mono text-[12px] leading-[1.65] sm:text-sm">
          <span className="text-muted">root@s1r1us-labz:~# </span>
          <span className="text-high">./stage --rwx 0x7f8a1c00</span>
          {"\n"}
          <span className="text-medium">[*]</span>
          <span className="text-muted">{" attaching "}</span>
          <span className={GRAY}>console.exploit</span>
          <span className="text-muted">{"  pid=1337  prot=rwx"}</span>
          {"\n"}
          <span className="text-high">[+]</span>
          <span className="text-muted">{" hook H@CK4U2K  ret=0x0040f00d"}</span>
          {"\n"}
          <span className="text-muted">{`00000000  48 33 4c 4c 30 20 57 30  52 4c 44              |${TAB_HELLO}|`}</span>
          {"\n"}
          <span className={COMMENT}>{"// --[ "}</span>
          <Link
            to="/pr3d"
            className={COMMENT_LINK}
            title={`${TAB_PRED} · ${TAB_HOVER_PRED}`}
            aria-label={`Open ${TAB_PRED}`}
          >
            payload
          </Link>
          <span className={COMMENT}>{" / "}</span>
          <span className="font-semibold text-[#e10600]">geek greeting only / not a shell</span>
          <span className={COMMENT}>{" / "}</span>
          <Link to="/r0b0ts" className={COMMENT_LINK} title={TAB_HOVER_ROBOTS} aria-label={TAB_HOVER_ROBOTS}>
            ROBOTS ACTIVATE
          </Link>
          <span className={COMMENT}>{" / "}</span>
          <Link
            to="/h1v3"
            className={COMMENT_LINK}
            title={`${TAB_HIVE} · ${TAB_HOVER_HIVE}`}
            aria-label={`Open ${TAB_HIVE}`}
          >
            SW@RM-worm
          </Link>
          <span className={COMMENT}>{" ]--"}</span>
          {"\n"}
          <span className={GRAY}>function </span>
          <span className="text-high">main</span>
          <span className="text-muted">{"() {"}</span>
          {"\n"}
          <span className={GRAY}>{"  console.exploit ("}</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={TAB_HOVER_HELLO}
            aria-label={TAB_HOVER_HELLO}
            className={ORANGE}
          >
            "{TAB_HELLO}"
          </a>
          <span className="text-muted">);</span>
          {"\n"}
          <span className={GRAY}>{"  console.H@CK4U2K.$("}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            title={TAB_HOVER_HELLO}
            aria-label={`welcome to ${APP_NAME}`}
            className={`${BLUE} bg-transparent p-0 text-left`}
          >
            {greet}
          </button>
          <span className="text-muted">);</span>
          {"\n"}
          <span className={GRAY}>{"  run executable ("}</span>
          <Link
            to="/faq"
            hash="calling-all-bots"
            title={`${TAB_CALLING_BOTS} · AI agent FAQ`}
            aria-label={`${TAB_CALLING_BOTS} · how AI agents interact`}
            className="call1ng-bots font-semibold tracking-tight underline decoration-sell underline-offset-2"
          >
            "{TAB_CALLING_BOTS}"
          </Link>
          <span className="text-muted">);</span>
          {"\n"}
          <span className={GRAY}>{"  run executable ("}</span>
          <Link
            to="/compute"
            title={TAB_HOVER_COMPUTE}
            aria-label={TAB_HOVER_COMPUTE}
            className={RED}
          >
            "{TAB_COMPUTE}"
          </Link>
          <span className="text-muted">);</span>
          {"\n"}
          <span className="text-muted">{"}"}</span>
          {"\n"}
          <span className="text-high">variable</span>
          <span className="text-muted">(load full access); return; run=</span>
          <Link to="/gm" title={TAB_HOVER_MAX_GAINS} aria-label={TAB_HOVER_MAX_GAINS} className={ORANGE}>
            [{TAB_MAX_GAINS}]
          </Link>
          {"\n"}
          <span className="text-high">variable</span>
          <span className="text-muted">(send max profits); return; run=</span>
          <Link to="/f33d" title={TAB_HOVER_SEND_BTC} aria-label={TAB_HOVER_SEND_BTC} className={ORANGE}>
            [{TAB_SEND_BTC}]
          </Link>
          {"\n"}
          <span className="text-high">[+]</span>
          <span className="text-muted">{" staged  exit=0  no bind / no reverse"}</span>
        </pre>
      ) : null}
    </div>
  );
}
