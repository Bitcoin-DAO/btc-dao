# Next release: v0.3.0

**Status (9 November 2026):** carried-over issues and B. Discussion built and tested (v0.3.0). The latest release is v0.2.8 (`CHANGELOG.md`). UNO DAO's 2-of-3 run on three phones passed on 9 November (`docs/runs/2026-11-uno-dao.md`).

**Scope, decided 9 November 2026:** v0.3.0 is the issues carried over from the two UNO runs, plus **B. Discussion**. **A. Hardware keys** moves to v0.4.0, **C. Outward comms** after it (it needs Discussion's Announcement flow and the gateway's key). Sections A and C below stay as the plan for those releases.

**Rule:** an item is ticked when it is built and its tests pass. Passing in the wild is tracked separately in `MAINNET-READINESS.md`.

## Carried over from the UNO runs

- [x] Automatic second broadcast: about a minute after a broadcast, re-send once to the sources that do not know the transaction yet (UNO DAO finding 11; practice finding 24)
- [x] Broadcast pages as their own config entry (practice finding 25)
- [x] Council members write down the trial treasury key's 12 words as a required step, checked by typing some back (UNO DAO finding 7)
- [x] A council member's phone can tell the council its treasury key is gone; the Council page shows the keys left and whether a spare remains (UNO DAO finding 8)
- [x] End-to-end test that closes a DAO (UNO DAO finding 13)

## Carried over to v0.4.0

- [ ] Prepare page says "not enough funds" as soon as it opens, with the amount missing (payouts plus an estimated fee, less the balance); the Council page does not offer "Prepare the payout round" meanwhile (TEST DAO, 9 Nov 2026)

## A. Hardware keys (v0.4.0)

Plan agreed 8 November 2026. Phase 2 of the build plan (`docs/spec.md`). Tested with one SeedSigner and one SD card, loading three SeedQR cards in turn.

**QR in and out**
- [ ] Show a round's PSBT as an animated QR the SeedSigner can scan
- [ ] Scan the signed PSBT back from the SeedSigner
- [ ] Scan a SeedSigner's xpub export (founding with hardware keys and council change); today the setup page takes it as typed text only
- [ ] Show the treasury descriptor as a QR to load on the device, so it verifies change (S7, hard gate)

**Council change**
- [ ] `change_council` proposal form (category, reason, keys; the rules are already in `docs/protocol.md`)
- [ ] New descriptor confirmed by the council, like a rules version
- [ ] Migration round: the whole balance from the old treasury to the new one, signed with the old keys
- [ ] Treasury page follows both descriptors during the move
- [ ] DAO history page opened from the DAO name (`docs/spec.md`, "DAO history"), including council changes

**Tests**
- [ ] End-to-end: a software stand-in that behaves like a SeedSigner (xpub export, PSBT scan, signed PSBT back)
- [ ] End-to-end: council change from phone keys to hardware keys, migration round confirmed

## B. Discussion

Design: `docs/drafts/discussion-and-comms.md`, section 3.

**Protocol**
- [x] Three new kinds: draft version, thread post, draft withdraw. Proposed numbers 3587, 3588, 3589 (next free after 3586; check the registry and large relays as for 3570–3586)
- [x] Proposal event gains the draft id and the submitted version number
- [x] Validation: version cards only from the draft's author; no version card after the proposal opens (freeze); posts only from members; withdraw only by the author
- [x] Draft status (open, submitted, withdrawn) derived from events
- [x] Relay: accept kinds 3570–3590 (`relay/src/config.ts`), keep all, no deletions; discussion kinds limited per key (10 a minute)
- [x] `docs/protocol.md` updated (section 4.5; kinds 3587–3590). There is no separate NIP draft yet: it will be written from `docs/protocol.md`

**App**
- [x] Discussion tab: drafts and proposals by last activity
- [x] New idea: title and a line or two; thread opens at once
- [x] Thread view: latest version card pinned, then the full timeline of version cards and posts
- [x] Version cards: author posts v2, v3… with the proposal fields
- [x] Posts: flat, plain text, links allowed
- [x] Submit as proposal (author only), pre-filled from the chosen version
- [x] Withdraw (author only); the draft stays visible, marked closed
- [x] Share button: public read-only link to a draft or thread
- [x] "New since your last visit", timestamp kept on the device
- [x] Proposal page: **Discussion** (thread link) and **Version** (e.g. v3); a version's form has no external link box. A proposal written directly keeps its optional link and gets its own thread

**Tests**
- [x] Unit: draft status, freeze, author-only version cards and withdraw, posts from non-members ignored
- [x] End-to-end: idea → v1 → posts → v2 → submit → vote, with the thread continuing through the vote

## C. Outward comms (after v0.4.0)

Design: `docs/drafts/discussion-and-comms.md`, section 4.

- [ ] DAO npub: one keypair per DAO, nsec held by the chain gateway (Worker secret), profile with name, picture, description, website
- [ ] NIP-05 on the DAO's domain (`dao@<domain>`) as the trust anchor; key rotation steps in `docs/guide.md`
- [ ] Automatic feed from the gateway: proposal opened, passed or failed with the result, payout sent with tx link, council change completed. Facts only
- [ ] Announcement proposal category; once passed, the gateway publishes the submitted version's text word for word, linked to the proposal
- [ ] Gateway: watch the DAO relay for record events, post once per event (no duplicates after a restart)
- [ ] Tests: gateway unit tests for each feed note and the announcement; end-to-end announcement passed and published

## Open items

- [x] **Relay write check.** Decided 9 November 2026: phones show only members' posts (as for every other kind, `docs/protocol.md` 7.3), and the relay limits how fast one key can post discussion events. A relay rule limited to the current member list waits until spam is actually seen
- [ ] **Where the DAO npub's notes go.** The feed and announcements are ordinary notes (kind 1), and the DAO relay rejects every kind outside the DAO's range. Either they go to public relays only, or the relay also accepts kind 1 from the DAO npub alone
- [ ] Testnet4 DAOs: feed to public relays, or only to their own relay? (ties in with the open question in `docs/decisions.md` on testnet publishing)
- [ ] Default list of public relays for the DAO npub
- [x] Order of the three parts: B (with the carried-over issues) in v0.3.0, A in v0.4.0, C after
