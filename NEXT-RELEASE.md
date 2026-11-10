# Next release: v0.5.0

**Status (10 November 2026):** v0.5.0 (council change) built and tested; next, the wild test on a new SeedSigner DAO.

**Direction, decided 9 November 2026:** the focus moves to mainnet. New DAOs that matter start on SeedSigners; phone keys stay only as a practice mode on testnet4. One codebase: the network and the founding choice decide which keys are allowed (mainnet: SeedSigners only). There is no move from phone keys to SeedSigners.

**Order:**
- **v0.4.0 — SeedSigner founding and signing**, in small steps, each tested before the next.
- **v0.5.0 — Council change** (one key swapped or the threshold changed; the migration round that a lost, resigned or recalled key needs), before any mainnet launch. Tested on v0.4.0's SeedSigner DAO, with one SeedQR card playing the lost key.
- **Later — Outward comms** (section C).

**Rule:** an item is ticked when it is built and its tests pass. Passing in the wild is tracked separately in `MAINNET-READINESS.md`.

**Equipment for the wild test:** one SeedSigner, one SD card with current firmware (a fresh card from the SD card ceremony, `docs/guide.md` 3.1), SeedQR test cards A, B, C and, for v0.5.0, D (testnet only).

## v0.3.0 (done)

Issues carried over from the UNO runs, and Discussion: see `CHANGELOG.md` v0.3.0 and v0.3.1.

## v0.4.0 — SeedSigner founding and signing

Formats: the ones Sparrow uses with SeedSigner, so any of the DAO's keys and descriptors also work in Sparrow for recovery. Animated QRs in UR (`crypto-psbt`) for PSBTs; the xpub export as the SeedSigner shows it for a multisig key (fingerprint, path `m/48'/coin'/0'/2'`, xpub); the descriptor as a wallet-registration QR the SeedSigner can scan. Each to be confirmed against the firmware on the test SD card in step 1.

**Step 1. QR building blocks**
- [x] Format check with the real device: export a multisig xpub, scan a test PSBT, show the signed PSBT, scan a descriptor; record the exact formats and firmware version in `docs/seedsigner.md` (9 Nov 2026, firmware 0.8.6, cards A, B, C: all four work; change verified on the device)
- [x] Animated QR display (UR parts, steady frame rate, size suited to the SeedSigner's camera)
- [x] Animated QR scanning on the phone (multi-part decoding with progress, any order, duplicates ignored)
- [x] Unit tests: UR parts identical to the reference library's, decoding from mixed parts alone, the real device's key export (`src/core/ur.test.ts`)
- [x] QR test page (`#/qrtest`): scan keys, show the test wallet's descriptor and a test PSBT, scan the signed PSBT back and check whose signature it carries; end-to-end test `e2e/hw.e2e.cjs`

**Step 2. Founding with SeedSigner keys**
- [x] Founding choice on testnet4: **phone keys (practice)** or **SeedSigners**; mainnet: SeedSigners only, no choice shown
- [x] Council sign-up with a SeedSigner: scan its xpub export instead of creating a phone key and the 12 words; check network and path; the sign-up code carries fingerprint and xpub as today
- [x] The setup page's typed key-origin text stays as a fallback
- [x] No 12-word step and no phone treasury key for SeedSigner councils; the profile shows the key's fingerprint and where it lives (SeedQR card, steel plate)
- [x] The choice is made per council member at sign-up (SeedSigner by default); the founding code and the genesis council entry carry `"device": "seedsigner"`; the setup page shows where each key lives, warns about a mixed council, refuses a treasury key already on the council (one SeedSigner, several cards) and, on mainnet, any phone key
- [x] End-to-end `e2e/seedsigner.e2e.cjs`: three council members sign up from SeedSigner exports (card A from the device's recorded frames), founding, treasury address checked against embit

**Step 3. Signing a round**
- [x] Round page, per council member: show the PSBT as an animated QR; scan the signed PSBT back; check it carries this member's valid signature (as the pasted-PSBT path does today) and publish it
- [x] Descriptor QR (S7, hard gate): shown before the PSBT, with the step "scan the wallet descriptor first, check change shows as verified"
- [x] Address check (S1): the payout addresses on the round page laid out as the SeedSigner shows them, to compare on the device
- [x] The preparer no longer signs automatically (only phone keys did)
- [x] "Not enough funds" shown as soon as the prepare page opens, with the amount missing; the Council page does not offer a round meanwhile (TEST DAO, 9 Nov 2026)

**Step 4. Tests**
- [x] A software stand-in for a SeedSigner in the end-to-end tests: key export (the real device's recorded frames, or key-origin text), signing with the card's words, the signed PSBT trimmed as the device trims it and sent back as UR parts (pasted, the scanner's no-camera path; the camera path itself is covered by the camera test)
- [x] End-to-end (`e2e/seedsigner.e2e.cjs`): founding a 2-of-3 SeedSigner DAO, a payout waiting for funds, funding, a round signed with cards A and B (a wrong card refused), broadcast; signatures checked independently with embit

**Step 5. In the wild**
- [x] A new testnet4 DAO founded on SeedSigners, 2 of 3, one SeedSigner and three SeedQR cards loaded in turn: founding, funding, a payout signed on the device, closing round (SEEDSIGNER DAO, 10 Nov 2026, `docs/runs/2026-11-seedsigner-dao.md`)

## v0.5.0 — Council change

The rules are already in `docs/protocol.md` (4.1.2, 6.1): every council change moves the whole treasury to a new descriptor, because keys cannot be removed from a multisig.

- [x] `change_council` proposal form: reason (`lost_key`, `resignation`, `recall`, `rotation`, `threshold`), outgoing key, incoming member (another member, or the same member with a new key) and their scanned SeedSigner key, new threshold; the new council, the new treasury's first address and the descriptor shown
- [x] Migration round: the whole balance to the new treasury's first address, signed with the old keys, checked as protocol 6.1 says
- [x] New settings version (council, threshold, descriptor) confirmed by the council after the migration's receipt; the Council page shows the council before and after
- [x] Treasury page follows both descriptors during the move, and keeps watching the old one for late payments (shown as "earlier treasury" when anything arrives); the move shows as one movement
- [x] Warning before signing when the continuing keys could not sweep the old treasury (protocol 6.1, "unsweepable")
- [x] A reported lost key (`dao.keystatus`) links to "start a council change"
- [x] DAO history page, linked from the footer (`docs/spec.md`, "DAO history"): founding, rules and council versions, funding model, closing, disputed versions. Listing entries wait for `dao.listing`
- [x] End-to-end (`e2e/council.e2e.cjs`): a 2-of-3 SeedSigner DAO replaces a lost key (card C → card D); migration confirmed; the next payout spends from the new treasury; history checked
- [ ] In the wild: a new testnet4 SeedSigner DAO, 2 of 3 on cards A, B, C; card C plays the lost key and card D (printed for this) replaces it
- [ ] Later: the sweep round for late arrivals at an earlier treasury (protocol 6.1); v0.5.0 shows them but does not move them

## C. Outward comms (after v0.5.0)

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
