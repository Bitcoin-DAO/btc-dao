# Code review, 14 November 2026 (v0.8.6, commit 7de7b57)

Five reviewers, each reading one area of the code without having written it: the money path, the consensus rules against `protocol.md`, identity and keys, the relay and gateway, and the UI. Critical and high findings were reproduced with the app's own code (`rebuild`, `buildRound`, signing and finalising) or traced line by line. This file lists every finding and its status; fixes are recorded against each one.

Severity: **critical** = funds lost or the DAO broken by one actor with no warning; **high** = the same with a precondition, or a split between clients; **medium** = a member misled or blocked; **low** = minor.

Phase A: fixed before the ALPHA DAO workshop. Phase B: fixed before mainnet.

## Critical

| ID | Area | Finding | Phase |
| --- | --- | --- | --- |
| R-C1 | Rules | One malformed event (wrong types, `1e999`, `null` in arrays) throws in `rebuild()`; the app goes blank for every member, for good, since relays never delete. Any key can publish it | A |
| R-C2 | Rules | A tally is never checked against the votes: one council member can list made-up vote ids or a false result and decide any vote, even weeks later (the settle window is measured from the signer's own `created_at`) | A |
| R-C3 | Rules | A backdated `dao.leave` removes the member's past proposals and renumbers the DAO, reopening decided proposals | A |
| M-F1 | Money | The same proposal listed twice in one round is paid twice | A |
| M-F2 | Money | A replacement only has to share a coin with one open round, not all: with a replacement under way, a third round can pay the same payout again | A |
| M-F3 | Money | Round validity is judged at the round's own `created_at`: a round backdated before a paid one pays the payout again; rounds can be dated before the tally or after a lapse | A |
| M-F4 | Money | Input amounts come from the PSBT's `witness_utxo`, never checked against the chain (segwit v0 fee attack): two rounds with the same transaction and different false amounts combine into one with a huge real fee, past the cap; SeedSigner shows the false fee | A |

## High

| ID | Area | Finding | Phase |
| --- | --- | --- | --- |
| R-H1 | Rules | Any council tally, even invalid, on the newest proposal rejects every older open proposal; honest case: a shortened voting period | A |
| R-H2 | Rules | `change_rules` values unchecked: a passed bad time zone or a key like `constructor` crashes every client | A |
| R-H3 | Rules | Roster and settings chains stop after 50 versions in total (loop cap) | A |
| R-H4 | Rules | Rekeys and leaves judged against the genesis council on the first pass and never revisited | B |
| R-H5 | Rules | A stale council change (two passed) can still move the treasury to a wallet the DAO will not adopt | B |
| R-H6 / X-1 | Rules, relay | Fetching is capped (app 5,000, relay 500 newest first, no paging): history drops out as the DAO grows, or by flooding with junk events | A |
| X-2 | Relay | The event id is not checked against the content; fields not type-checked (a non-numeric `created_at` passes the future-date check) | A |
| X-3 | Relay | No size limits (content, tags, message); per-connection rate limit only: one script can fill the database or its daily write allowance | A |
| M-F5 | Money | Receipts never checked against the chain, and one chain source is enough to trigger one: a council member can mark a migration or closing done with the funds unmoved | B |
| I-1 | Identity | All DAOs share the origin `bitcoin-dao.github.io` (storage and passkey relying party); code on any page of the origin can reach members' keys. ALPHA DAO gets an origin of its own (phase A); every DAO before mainnet | A/B |

## Medium

| ID | Area | Finding | Phase |
| --- | --- | --- | --- |
| M-F6 | Money | A junk signature in a sign event, or in the round's PSBT, stops the round from being finalised or signed | A |
| M-F7 | Money | Treasury unusable after 100 addresses on a branch (fixed lookahead) | B |
| I-2 | Identity | An extended private key (tprv/xprv) is accepted where a treasury xpub is expected, and could be published | A |
| I-3 / R-M5 | Identity | Any member can break another's passkey sign-in with a keywrap under their public `c` tag | A |
| I-4 | Identity | Pending secrets and the trial treasury mnemonic stored in plain text; Profile shows the words while signed out | B |
| I-5 | Identity | Report links not restricted to http(s) | A |
| X-4 | Relay | Not pinned to the DAO ids (`ALLOWED_DAO_IDS` empty) | A |
| X-5 | Relay | No limits on subscriptions, filter sizes; `limit: -1` reads everything | A |
| X-6 | Gateway | "already known" pattern matches "unknown": a failed broadcast reported as accepted | A |
| X-7 | Gateway | Usable by any script without an Origin; rate limit in memory, cleared at 5,000 IPs | B |
| R-M1 | Rules | Without `site.daoId`, an outsider's backdated genesis can be chosen | B (ALPHA sets daoId) |
| R-M2 | Rules | Endorser checked at endorsement time, not the object's; endorsements can be backdated before the basis tally | B |
| R-M3 | Rules | Spec rules not enforced: proposal category, character counting, votes after a close, reports for paid tranches, late claims, pledge reservation; fee-capped round dates not decidable from events (protocol to change) | B |
| R-M4 | Rules | A disputed settings chain never resolves; a resolved roster takes effect at its old time | B |
| U-1 | UI | Council page sums every tranche (and 0 for a bounty) when checking funds: Prepare round can be hidden | A |
| U-2 | UI | Home's "approved payouts" total counts every tranche | A |
| U-3 | UI | A removed member is told the phone has no key | B |
| U-4 | UI | Rule-change proposals show raw JSON values | A |
| U-5 | UI | A fully paid staged payout says "Paid in round " with no round | A |
| U-6 | UI | Leave fails silently and can be tapped twice | A |
| U-7 | UI | A vote looks open for up to 30 s after the close; a vote cast then is ignored without a word | A |
| U-8 | UI | Pages crash before founding (Members, Council, New proposal, Round, Sponsor) | A |
| U-9 | UI | Two sponsors can publish duplicate add_member proposals | B |

## Low

Money: sweep signatures counted from keys not in the old wallet (M-F8); locktime, version, sequence and change paths not checked (M-F9). Rules: votes dated before their proposal counted; confirmations made after a round count; roster validity depends on `now`; `add_member` basis replayable after removal; a person who leaves cannot return; two rekeys of one key; missing `founders` throws. Identity: sign-out only in the current tab, no "remove from this device"; two-tab races; identity records inherit another member's fields; CSP gaps (framing, trusted types); the card QR kept in the DOM. Relay/gateway: source URLs would expose future tokens; no size check before reading a broadcast body. UI: Sponsor summary cannot be cleared; hooks called conditionally; misleading wordings; forms lose input on navigation; accessibility (tabs and filters, a hard-coded "OK"); dead code and 14 unused i18n keys; untranslated core messages (missing-field names, round errors, `errText` codes, rule names on the Rules page); no memoising. All phase B unless fixed in passing.

## Sound

Signature checks before use (relay and app); outputs of ordinary payouts must match the approved list exactly; change verified as the treasury's own; signatures checked per member key, SIGHASH_ALL, same txid; closing, migration and sweep destinations; tranche and bounty gating; deletions and replaceable events unreachable on the relay; no gateway SSRF; no third-party scripts, a CSP with `script-src 'self'`; no `innerHTML`; secrets never in URLs or logs; key generation, PRF salt and wrapping; i18n key sets and placeholders identical in both languages.

## Fixes

| Block | Findings | Commit | Tests |
| --- | --- | --- | --- |
| 1. Crash-proofing | R-C1 (every confirmed crash: round ids and tranches, key-status fingerprint, 1e999 in genesis, roster, settings, tallies and drafts, null in tallies; missing founders), R-H2 (rule names and values) | e31936f | `robust.test.ts` (15 cases; 11 fail on the old code); founding and governance end-to-end |
| 2. Vote counts | R-C2 (a tally must check out against the votes it lists; decided means decided), R-H1 (only valid tallies fix the numbering), R-C3 (a leave contradicted by a later count is refused) | 07ed4fb | `governance.test.ts`, 6 new cases (fail on the old rules); governance, council and payouts end-to-end. Remaining limit (backdated vote and count within the settle window) until anchoring, phase B |
| 3. Rounds | M-F1 (proposal listed twice), M-F2 (replacement shares a coin with every open round), M-F3 (rounds with receipts judged first; nothing paid twice whatever the dates; no round before its count), a payout paid once (two rounds paying it must share a coin), M-F6 and M-F8 (unsigned rounds only; final transaction from verified signatures only) | 6e789ca | 5 new unit cases (fail on the old code), 3 updated; payouts, recall, closing, delivery, seedsigner, council end-to-end (recall timed out once, then passed twice) |
| 4. Coin amounts | M-F4: coins checked against the blockchain before Sign is offered; the same transaction with other coin amounts is refused. Still open (phase B unless brought forward): the previous transactions in the PSBT, so the SeedSigner checks amounts itself | bad7b18 | 5 new unit cases; the six round suites end-to-end |
| 5. Relay and fetching | X-2 (event id must be the hash of the content; every field checked), X-3 (size limits; 60 events a minute per address), X-5 (subscriptions, filters, limit), X-1/R-H6 (no skipped queries; the app pages each relay's record), X-6 (gateway "already known" anchored). Still open: X-4, pin the relay to the DAO ids, right after ALPHA DAO's founding | 183cd29 | relay.e2e.cjs (10 checks, 7 fail on the old relay), relays.test.ts (4), gateway (1); relay, founding, governance, payouts, discussion, closing, council and delivery end-to-end |
| 6. Identity and record | I-2 (a private key refused wherever a public key is expected, with a warning not to show it), I-3/R-M5 (every passkey backup kept; sign-in uses the one that opens to its own key), I-5 (report links http(s) only, in the record and on screen), R-H3 (roster and settings chains no longer capped) | 0e47a57 | 5 new unit cases (fail on the old code) |
| 7. UI for the workshop | U-1, U-2 (funds checks count the next tranche only), U-4 (rule values in words), U-5 (paid staged payout names its round), U-6 (Leave), U-7 (a vote closes on screen at the exact time), U-8 (pages before the founding show how to join; a page that throws shows a way home) | 2a30384, ea07a79 | next-tranche unit case; founding (pages before founding) and governance (vote closing) end-to-end. Blocks 5 to 7 together: all 12 end-to-end suites, 292 checks |

| I-1 for ALPHA DAO | ALPHA DAO has a web address of its own, https://alpha.byob.zone (repo byob-zone/alpha-dao, a separate GitHub organisation, domain verified there), so its keys and passkeys share no origin with the other DAOs; the gateway accepts that origin | 2211691 (gateway) | site loads at the new address over HTTPS |

Phase A still open: X-4 (pin the relay to ALPHA DAO's id, after its founding). Every other DAO gets its own origin before mainnet (I-1, phase B).
