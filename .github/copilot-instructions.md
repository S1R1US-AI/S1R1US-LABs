# Copilot — S1R1US-LABs numbering (do not mix)

Three different numbers. Do not treat them as one. Do not “fix” one into another.

| What | Number | Code / Git | May you change it? |
|---|---|---|---|
| As-live **sim lock** | **DEPLOY #68** | `CHECKPOINT_BASELINE_N = 68` | **No.** Changing this retargets G M0D3 AUTO / AI agents. Conflict rebases the sim to 68 LIVE. |
| Operator fold (historical name) | Checkpoint 101 | finalized, **renamed** | Do not revive “101” as the live number. |
| Operator fold **name** + **rebuild pin** | **S1R1US App build #111** | `CHECKPOINT_BUILD_N = 111` | Do not bump. Do not move the pin tag. |

The as-live sim label stays **DEPLOY #68 on purpose**. #68 is the sim lock so the book does not rebase. Checkpoint 101 is the operator fold (now named #111). Live chrome is **#111 LIVE**. Carbon-fiber origin is still DEPLOY #68.

## Rebuild pin (if live s1r1us.ai is corrupt)

| | |
|---|---|
| Project folder | `Project BTD/S1R1US L@Bs/checkpoint S1R1US App build #111.md` |
| Tag | `s1r1us-app-build-111` (protected — do not move) |
| Branch | `checkpoint/s1r1us-app-build-111` (protected) |
| Release | https://github.com/S1R1US-AI/S1R1US-LABs/releases/tag/s1r1us-app-build-111 |
| Commit | `d7cb6fe30b91d733662a3c870cd819e6bb0d20ac` |

Restore: DigitalOcean project **live-production** → App Spec `github.branch` = `checkpoint/s1r1us-app-build-111` → wait Healthy → hard-refresh https://s1r1us.ai. Point back to `main` only after `main` matches that tag. The pin includes prebuilt `.output`. Do not compile on the 1 GB box.

## Hard rules

- Do not change `CHECKPOINT_BASELINE_N` (68). That is the sim lock.
- Do not change `CHECKPOINT_BUILD_N` (111). That is the operator fold name.
- Do not merge empty `rebuild-output-*` PRs over a checkpoint.
- Do not rewrite Terms or Privacy. Unified DISCLAIMER says **NO LEGAL FEES**.
- This host never places Coinbase orders. Auto trade stays LOCKED.
- PR3D1CT10N$ is paper only. This host never takes bets.
- Surgical patches only. Keep GitHub `LEGAL_HOWEY`. Do not copy workspace wholesale.
