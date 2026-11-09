# Next releases

**Status (9 November 2026):** the latest release is v0.2.0 (8 November 2026, `CHANGELOG.md`). UNO DAO runs v0.2.0 end to end first (2 of 3, three phones with their own Google accounts, practice votes, no SeedSigner); fixes from that run go out as v0.2.1, tested on their own. Discussion is built in parallel on the `discussion` branch and merged after.

**Order (decided 9 November 2026):** v0.3.0 discussion, v0.4.0 hardware keys, then outward comms (it needs the Announcement flow and the gateway's key).

**Rule:** an item is ticked when it is built and its tests pass. Passing in the wild is tracked separately in `MAINNET-READINESS.md`.

## v0.3.0 · Discussion

Design: `docs/drafts/discussion-and-comms.md`, section 3. Protocol: `docs/protocol.md` section 4.5. Branch: `discussion`.

**Decided:** only members and council post; non-members' posts are filtered in the app, not at the relay (the relay keeps accepting the DAO's kinds from any key, as for every other event).

**Protocol**
- [x] Three new kinds: draft version, thread post, draft withdraw. 3587 `dao.draft`, 3588 `dao.post`, 3589 `dao.withdraw` (still to check the registry and large relays, as for 3570–3586)
- [x] Proposal event gains the draft id and the submitted version number
- [x] Validation: version cards only from the draft's author; no version card after the proposal opens (freeze); posts only from members; withdraw only by the author
- [x] Draft status (open, submitted, withdrawn) derived from events
- [x] Relay: accept kinds 3570–3589 (`relay/src/config.ts`), keep all, no deletions
- [x] `docs/protocol.md` updated (the NIP draft follows when it is written)

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
- [x] Proposal page: the external link box replaced by **Discussion** (thread link) and **Version** (e.g. v3)

**Tests**
- [x] Unit: draft status, freeze, author-only version cards and withdraw, posts from non-members ignored
- [x] End-to-end: idea → v1 → posts → v2 → submit → vote, with the thread continuing through the vote

**In the wild (UNO DAO, after v0.2.1)**
- [ ] An idea, two versions, posts from three phones, submit, vote, posts during the vote
- [ ] A withdrawn draft
- [ ] Share link opened on a phone that is not a member
- [ ] Relay redeployed with kinds 3570–3589 before UNO DAO upgrades

## v0.4.0 · Hardware keys

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

## Later · Outward comms

Design: `docs/drafts/discussion-and-comms.md`, section 4.

- [ ] DAO npub: one keypair per DAO, nsec held by the chain gateway (Worker secret), profile with name, picture, description, website
- [ ] DAO npub in the endorsed listing (`npub`), served as NIP-05 by dashboards (`<name>@btcdao.tech`), or on the DAO's own domain if it has one; replacing a lost key is a new endorsed listing (protocol 7.2)
- [ ] Automatic feed from the gateway: proposal opened, passed or failed with the result, payout sent with tx link, council change completed. Facts only
- [ ] Announcement proposal category; once passed, the gateway publishes the submitted version's text word for word, linked to the proposal
- [ ] Gateway: watch the DAO relay for record events, post once per event (no duplicates after a restart)
- [ ] Tests: gateway unit tests for each feed note and the announcement; end-to-end announcement passed and published

**Member notifications** (decided 9 November 2026): opt-in, for members and council
- [ ] Opt-in from the profile: a **Nostr address** field taking a NIP-05 name (`name@domain`) or an npub; the member can change or remove it
- [ ] A NIP-05 name is resolved in the member's browser (`/.well-known/nostr.json`), the npub shown for the member to confirm, and that npub stored, so a later change on the name's domain cannot redirect the DAO's messages
- [ ] Deliver to the recipient's own message relays (their NIP-17 inbox list, kind 10050), falling back to the DAO's public relay list, or their app may never see the message
- [ ] Test client: 0xchat on Android and iPhone (NIP-17 gift-wrapped messages). Check a message arrives with the phone locked, and that the DAO npub shows with its NIP-05 name. 0xchat's push (checked 9 November 2026 in its own design note and code): a push server it is configured with watches relays for the user's messages and wakes the phone through Apple (APNs) or Google (FCM) once the app's 60-second heartbeat stops; the registration is encrypted with the older NIP-04. So the push server and Apple or Google see that a message arrived and when, not what it says or (gift-wrapped) who sent it. UnifiedPush support was not found
- [ ] The link is **encrypted to the DAO npub** (NIP-44), so only the gateway can read which npub belongs to which member. The first DAO data that is not public, by decision: it is the member's own contact, not a DAO record. Anyone can see that a member opted in, not to which npub
- [ ] The gateway sends gift-wrapped private messages (NIP-17) from the DAO npub; the member's Nostr app gives the phone notification
- [ ] Council: a round to sign, a tally to count, a candidate to check, a key replacement
- [ ] Members: a vote opening or closing within 24 hours, a payout to confirm as recipient, new posts in a thread they took part in, their proposal's result
- [ ] Everyone opted in: passed Announcement proposals
- [ ] Urgent items at once, the rest as one daily digest; the gateway works out each person's to-do list on a timer
- [ ] Never received on the DAO identity key itself (that would mean pasting the voting key into a third-party app)

**Sign in with Nostr:** parked (9 November 2026). Notifications reach members without it, and the passkey stays the only sign-in. If it comes back: any NIP-07 or NIP-46 signer, a key made for the DAO, and only signers we have tested (Amber on Android; NostrKey, then Nostash, on iOS).

## Open items

- [x] **Relay write check.** Decided 9 November 2026: filtered in the app only. The relay accepts the DAO's kinds from any key, because candidates and payout recipients must publish, and clients validate every event (`docs/protocol.md` 7.3); a relay rule limiting posts to the roster can be added later without changing the event format
- [ ] **Where the DAO npub's notes go.** The feed and announcements are ordinary notes (kind 1), and the DAO relay rejects every kind outside the DAO's range. Either they go to public relays only, or the relay also accepts kind 1 from the DAO npub alone
- [ ] Testnet4 DAOs: feed to public relays, or only to their own relay? (ties in with the open question in `docs/decisions.md` on testnet publishing)
- [ ] Default list of public relays for the DAO npub
