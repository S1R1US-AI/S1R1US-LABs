import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  APP_NAME,
  TAB_HELLO,
  TAB_HOVER_HELLO,
  TAB_HOVER_MAX_GAINS,
  TAB_HOVER_SEND_BTC,
  TAB_MAX_GAINS,
  TAB_SEND_BTC,
} from "@/lib/brand";
import { GITHUB_URL } from "@/lib/launch/model";

const ORANGE =
  "coinbase-orange font-semibold tracking-tight underline decoration-[#ff8a1f] underline-offset-2";

export function HelloWorld() {
  const [open, setOpen] = useState(false);
  const greet = `"welcome to ${APP_NAME}"`;
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full rounded-md text-left hover:bg-fg/4"
      >
        <p className="text-sm text-tab">welcome to {APP_NAME}</p>
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
          <span className="text-muted">{" attaching console.exploit  pid=1337  prot=rwx"}</span>
          {"\n"}
          <span className="text-high">[+]</span>
          <span className="text-muted">{" hook H@CK4U2K  ret=0x0040f00d"}</span>
          {"\n"}
          <span className="text-muted">{`00000000  48 33 4c 4c 30 20 57 30  52 4c 44              |${TAB_HELLO}|`}</span>
          {"\n"}
          <span className="text-sell">--[ payload / greeting only / not a shell ]--</span>
          {"\n"}
          <span className="text-muted">function </span>
          <span className="text-high">main</span>
          <span className="text-muted">{"() {"}</span>
          {"\n"}
          <span className="text-muted">{"  console.exploit ("}</span>
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
          <span className="text-muted">{"  console.H@CK4U2K.$("}</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={TAB_HOVER_HELLO}
            aria-label={TAB_HOVER_HELLO}
            className={ORANGE}
          >
            {greet}
          </a>
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
