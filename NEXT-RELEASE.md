# Next release: v0.3.0

**Status (9 November 2026):** planned, not started. The latest release is v0.2.0 (8 November 2026, `CHANGELOG.md`). Before building, UNO DAO runs v0.2.0 end to end: 2 of 3, three phones with their own Google accounts, practice votes, no SeedSigner.

**Rule:** an item is ticked when it is built and its tests pass. Passing in the wild is tracked separately in `MAINNET-READINESS.md`.

## A. Hardware keys

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
- [ ] Three new kinds: draft version, thread post, draft withdraw. Proposed numbers 3587, 3588, 3589 (next free after 3586; check the registry and large relays as for 3570–3586)
- [ ] Proposal event gains the draft id and the submitted version number
- [ ] Validation: version cards only from the draft's author; no version card after the proposal opens (freeze); posts only from members; withdraw only by the author
- [ ] Draft status (open, submitted, withdrawn) derived from events
- [ ] Relay: accept kinds 3570–3589 (`relay/src/config.ts`), keep all, no deletions
- [ ] `docs/protocol.md` and the NIP draft updated

**App**
- [ ] Discussion tab: drafts and proposals by last activity
- [ ] New idea: title and a line or two; thread opens at once
- [ ] Thread view: latest version card pinned, then the full timeline of version cards and posts
- [ ] Version cards: author posts v2, v3… with the proposal fields
- [ ] Posts: flat, plain text, links allowed
- [ ] Submit as proposal (author only), pre-filled from the chosen version
- [ ] Withdraw (author only); the draft stays visible, marked closed
- [ ] Share button: public read-only link to a draft or thread
- [ ] "New since your last visit", timestamp kept on the device
- [ ] Proposal page: the external link box replaced by **Discussion** (thread link) and **Version** (e.g. v3)

**Tests**
- [ ] Unit: draft status, freeze, author-only version cards and withdraw, posts from non-members ignored
- [ ] End-to-end: idea → v1 → posts → v2 → submit → vote, with the thread continuing through the vote

## C. Outward comms

Design: `docs/drafts/discussion-and-comms.md`, section 4.

- [ ] DAO npub: one keypair per DAO, nsec held by the chain gateway (Worker secret), profile with name, picture, description, website
- [ ] NIP-05 on the DAO's domain (`dao@<domain>`) as the trust anchor; key rotation steps in `docs/guide.md`
- [ ] Automatic feed from the gateway: proposal opened, passed or failed with the result, payout sent with tx link, council change completed. Facts only
- [ ] Announcement proposal category; once passed, the gateway publishes the submitted version's text word for word, linked to the proposal
- [ ] Gateway: watch the DAO relay for record events, post once per event (no duplicates after a restart)
- [ ] Tests: gateway unit tests for each feed note and the announcement; end-to-end announcement passed and published

## Open items

- [ ] **Relay write check.** The design assumes the relay accepts writes from member keys only. It does not: by design it accepts the DAO's kinds from any key, because candidates and payout recipients must publish, and clients validate every event (`docs/protocol.md` 7.3). Discussion fits that model (clients show only members' posts), but non-members could fill the relay with posts the app ignores. Decide: client-side filtering only, or a relay rule limiting kinds 3588 to keys on the latest roster
- [ ] **Where the DAO npub's notes go.** The feed and announcements are ordinary notes (kind 1), and the DAO relay rejects every kind outside the DAO's range. Either they go to public relays only, or the relay also accepts kind 1 from the DAO npub alone
- [ ] Testnet4 DAOs: feed to public relays, or only to their own relay? (ties in with the open question in `docs/decisions.md` on testnet publishing)
- [ ] Default list of public relays for the DAO npub
- [ ] Order of the three parts. Suggested: B (discussion) first, since it touches no keys and UNO can use it straight away; then A (hardware keys); C last, since it needs B's Announcement flow and the gateway's key
