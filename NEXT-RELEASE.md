# Next release: v0.5.0

**Status (11 November 2026):** v0.5.x passed in the wild on COUNCIL DAO (lost key replaced; council grown to 3 of 4). Open items below are the run's findings.

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
- [x] v0.5.1: `expansion` reason, a council seat added (2 of 3 → 3 of 4), in the end-to-end test
- [x] In the wild: a new testnet4 SeedSigner DAO, 2 of 3 on cards A, B, C; card C plays the lost key and card D (printed for this) replaces it; then the plain member joins with card C, 2 of 3 → 3 of 4
- [x] The sweep round for late arrivals at an earlier treasury (protocol 6.1): v0.7.0

## C. Outward comms (after v0.5.0)

Design: `docs/drafts/discussion-and-comms.md`, section 4.

- [ ] DAO npub: one keypair per DAO, nsec held by the chain gateway (Worker secret), profile with name, picture, description, website
- [ ] NIP-05 on the DAO's domain (`dao@<domain>`) as the trust anchor; key rotation steps in `docs/guide.md`
- [ ] Automatic feed from the gateway: proposal opened, passed or failed with the result, payout sent with tx link, council change completed. Facts only
- [ ] Announcement proposal category; once passed, the gateway publishes the submitted version's text word for word, linked to the proposal
- [ ] Gateway: watch the DAO relay for record events, post once per event (no duplicates after a restart)
- [ ] Tests: gateway unit tests for each feed note and the announcement; end-to-end announcement passed and published

## D. Descriptor floor, descriptor chain and watcher (from the 13 November review)

Design: `docs/protocol.md` 6.5 and 6.6, `docs/dashboard-spec.md` sections 2 and 2b, requirement S10. Decisions of 13 November 2026 in `docs/decisions.md`. The timelock and challenge draft from the same review is not in v1 (`docs/spec.md`, Out of scope).

- [ ] Floor check: one function from a descriptor to its floor result, line by line, shared by the app and the dashboard
- [ ] Founding setup: the floor check for the genesis descriptor, before endorsement (replaces the threshold-equals-council warning from UNO's practice finding 16)
- [ ] Council-change proposals: green, or the red "weakens the treasury" notice naming each reason (a broken floor line, a lower threshold), old and new shape side by side with one plain line per point, green changes too, on the proposal page, the vote screen and every signing screen of the migration round
- [ ] Council-change form: keys and threshold together, with the reminder that they go together and a suggested threshold when a seat is added or removed
- [ ] Descriptor chain: derived from the settings chain with each link's floor result, status (active, swept, residual, unsweepable), active period, proposal and migration txid
- [ ] DAO history page: the chain as bands, residual highlighted, and the headline line "Chain of N descriptors · never below the floor · unauthorised spends: 0"
- [ ] Rules page: the current descriptor's floor result
- [ ] Watcher in the app: reconciliation at every stage, and an unmatched treasury spend (no published round) shown at once, from the mempool, as a notice on every member's Home page
- [ ] Payout address check: warn, without refusing, when an address entered in a proposal or confirmation has received coins before; standing addresses exempt
- [ ] Guide: council treasury keys are for this DAO only, never a personal wallet (joins the open item "one key per DAO" below); payees give a fresh address for every payout
- [ ] Tests: unit tests for cases B-01 to B-22, H-01 to H-06, C-R01 to C-R03, N-08, N-09; end-to-end: a council change that weakens the treasury shows the red notice on every screen
- [ ] In the wild: a council change on a testnet4 DAO that breaks a floor line, then one that restores it, both shown in the history

## E. Action gateway (design; after the mainnet path)

Design in `docs/drafts/action-gateway.md`, decided 17 November 2026. Built and tried on ALPHA DAO (testnet4) after its founding workshop, which runs on the current build. Agent tasks and the fiat bridge are in L, ahead of the rest of this section.

- [x] Stage 0: design written down (roles, modules, admission tests, credentials, handover ceremony, domain as anchor asset)
- [ ] Stage 1: Operator role: badge, founding minimum 2 council + 1 Operator, the 1 → 3 (2-of-3) vote, dashboard display
- [ ] Stage 2: Cloudflare base module on the free tier: account setup and handover ceremony, inbound email to the relay (security mail held for a Recovery proposal), website via Pages, watcher
- [ ] Stage 3: member notifications by email to verified addresses (free)
- [ ] Stage 4: outbound email to the world, once a provider passes the payment test
- [ ] Second providers: deSEC for DNS first; nsite for the website later

## F. Meeting scheduler (design)

Design in `docs/drafts/meeting-scheduler.md`, idea agreed 18 November 2026. A non-binding meeting-time poll beside proposals: no council, no quorum, no treasury effect.

- [x] Stage 0: idea written down (flow, time zones, where to join, provisional kinds 3593–3595)
- [ ] Design settled: open questions in the draft answered, kinds confirmed with the rest of the block
- [ ] Meeting poll in Discussion ("Meeting" chip): propose slots, tick yes / if need be, organiser fixes a slot, withdraw
- [ ] "Next meeting" on Home; slots shown in the viewer's time zone with the DAO's beside it
- [ ] Relay: accept kinds 3570–3595
- [ ] Tests: unit tests for the suggested slot and latest-answer-counts; end-to-end: a poll opened, ticked by three members, fixed, shown on Home
- [ ] In the wild: used to schedule a real call on a testnet4 DAO

## G. Member loans to the DAO (design)

Design in `docs/drafts/member-loans.md`, idea agreed 18 November 2026. Interest-free loans from members to the DAO, repaid before ordinary payouts. The DAO does not lend to members.

- [x] Stage 0: idea written down (flow, rules, where it touches rounds, cap, closing, Accounts)
- [ ] Design settled: open questions answered, protocol sections drafted
- [ ] `member_loan` proposal type and `loan_repayment` payout category
- [ ] Treasury page and Accounts: owed to members, free balance
- [ ] Rounds: due repayments first; closing repays every lender first
- [ ] Tests, then in the wild on a testnet4 DAO

## H. GRANTS DAO and repayable grants (design)

Design in `docs/drafts/grants-dao.md`, idea agreed 18 November 2026. The GRANTS DAO is the verification gateway for outside funding; programme DAOs (first: SIGNER DAO) decide, and are measured by how well their repayable grants are repaid; local DAOs repay the GRANTS DAO when they can.

- [x] Stage 0: idea written down (roles, flow, repayable grants, programme measures, website, additions to the core)
- [ ] Design settled: open questions answered
- [ ] Application event signed by the applicant DAO's npub (needs the DAO npub from section C)
- [ ] Repayable grant on payouts (amount owed, repay-to address) and the `grant_repayment` category
- [ ] Labelled inflows on the treasury page and in Accounts; amounts owed between DAOs in Accounts
- [ ] Applicant record shown beside the proposal; payout address checked against the applicant's descriptor
- [ ] Programme measures (repayment rate, fully repaid, time to repay, outstanding, still active) on the dashboard
- [ ] GRANTS DAO website from the `btc-dao-homepage` wrapper: projects supported, repayment chain
- [ ] In the wild: a testnet4 GRANTS DAO funds a testnet4 SIGNER DAO, which gives a repayable kit grant to a testnet4 local DAO, which repays

## I. Language of DAO content (idea to test)

Idea in `docs/drafts/bilingual-content.md`, 20 November 2026. Not decided. Option A: one working language chosen at founding. Option B: bilingual content (author-approved translations for proposals, a "Translate" button elsewhere).

- [x] Stage 0: idea written down (both options, the language tag, how to test)
- [ ] Language tag on every text event, and `lang` on displayed text (useful with either option; before the NIP)
- [ ] Test option A on a testnet4 DAO
- [ ] Decide: option A only, or option B as a module

## J. Throughput and rankings (dashboard)

Design in `docs/dashboard-spec.md` section 2c, decided 20 November 2026. A DAO's size is measured by throughput: sats paid out through authorised rounds over time, like assets under management.

- [ ] Throughput per DAO: last 12 months, since founding, monthly chart; exclusions as in 2c
- [ ] Network throughput on the front page
- [ ] Rankings: throughput (main), treasury, participation, clean record, tree, repayment rate; listed mainnet DAOs only, never one combined score
- [ ] Test cases: a migration, a sweep and a loan repayment leave throughput unchanged
## K. Recovery sheet (design, mainnet)

Design in `docs/drafts/recovery-sheet.md`, agreed and reviewed 20 November 2026. Mainnet only: testnet4 DAOs keep the shared SeedSigner and SeedQR cards. One SeedSigner per council member, no SeedQR card.

- [x] Stage 0: draft written and reviewed (sheet ID from the settings descriptor, word form, restore and SeedSigner descriptors, receive index 0 for migrations; confirmations local, no event)
- [ ] Restore test on testnet4: Sparrow from a printed sheet alone, coins at receive and change addresses
- [ ] Sheet page in the app (print and PDF), sheet ID with word form
- [ ] Notice, compare-aloud-and-confirm; confirmation kept on the member's phone, shown on their own Council page
- [ ] Gates: signing needs the member's own confirmation; preparing a migration needs the required box "new council read the sheet aloud" ticked
- [ ] Spec, guide and MAINNET-READINESS edits listed in the draft, section 9

## L. Agent tasks and the fiat bridge (before mainnet, on ALPHA DAO)

Design in `docs/drafts/action-gateway.md` section 3.4 (PR #19, #30). Brought forward from E on 23 November 2026: paying fiat-only suppliers is what holds adoption back, so it is rehearsed before mainnet, not after. Readiness items in `MAINNET-READINESS.md` section 10.

- [x] Members' guide: [how members get sats](docs/getting-sats.md) (fiat in; the DAO does not sell bitcoin)
- [ ] Italian version of the guide
- [ ] Paid-up badge (`docs/proposals/badges.md` 1.2.1): a payment to a treasury address that spends from the member's standing address and pays at least `rules.duesSats`; `rules.duesSats` and `rules.duesPeriod`; the Pay dues prompt shown only once `duesSats` is set in the rules version in force, and only payments confirmed while dues are in force counted; paid-up status for the period on the Members page; txid fallback confirmed by the council. No new event kind for the automatic route
- [ ] Peer-to-peer route rehearsal: a member buys tBTC from a person and pays dues from their own wallet (readiness 10)
- [ ] Step 1 rehearsal on the current build: an Agent task run as a bounty (4.6), member recipient, paid on completion, delivery report confirmed
- [ ] Claim codes: the six-word code made on the recipient's side, its commitment in the proposal, `dao.delivered` (app and handover-scan modes)
- [ ] Agent role in the app: Agent badge and region on the profile; council members refused as claimants (separation of duties)
- [ ] Payout outputs that pay a merchant directly beside the Agent's fee
- [ ] The Agent's choice of staged or on completion, fixed in the schedule before the vote
- [ ] Step 2 rehearsal: a non-member recipient, confirmed by handover scan
- [ ] Reference rules for the trust ladder (counts for non-member recipients and staged payment) as rule settings with defaults
      
## M. Discussion: chat stays in WhatsApp (idea; future)

Decided 23 November 2026: Discussion stays the DAO's record, not its chat. Images, documents and everyday conversation stay in the group's chat app (WhatsApp); a thread's "Share the link" is the bridge between the two. No uploads, previews or formatting are planned.

- [ ] "New since your last visit": unread markers on the thread list and on posts within a thread, kept on the member's own device only (no server, nothing published)
- [ ] Notifications: see E, stage 3 (member notifications by email to verified addresses); not duplicated here
- [ ] Ideas held for later, not planned: tap-to-show images (no automatic loading, which would reveal members' IP addresses to the image host); attachments on a Blossom server with the file's SHA-256 in the post, so the record proves which file was discussed; reply-to and quoting.

## N. Market DAO on OpenBazaar (idea; watch, don't build)

Noted 23 November 2026. OpenBazaar is being rebuilt in Rust (github.com/OpenBazaar/openbazaar-rs, MIT): person-to-person trade for ordinary goods; a buyer's phone app; the vendor runs the desktop app or an always-on home node, reachable over Tor. Status: Phase 0, alpha builds on testnet4 (v0.1.0-alpha.12), not signed. Idea: a DAO-owned store, where the DAO sells what its members make and the money goes to the treasury.

- [ ] Shape: the store's sales go to an address the DAO's treasury controls; makers are paid through ordinary payout rounds (a proposal, a vote and the council's signatures)
- [ ] Operator role (E, stage 1) runs the store's home node, as part of the DAO's always-on infrastructure
- [ ] Council as moderator: OpenBazaar 2 used 2-of-3 escrow (buyer, seller, moderator). Ask whether the Rust version will have escrow and moderators, and whether a DAO council can hold the moderator key
- [ ] Possible first goods: Made in Bosa glass editions, Anonymous Art pieces, BUONO vouchers

**Check before any build:**
- Can a store's sales be paid to an address the vendor chooses (a multisig treasury address), rather than the node's own wallet?
- Can a store accept only bitcoin? (The node mentions BTC, ZEC and XMR prices.)
- Escrow and dispute resolution: present, planned, or absent?

**Revisit when:** OpenBazaar has a release with escrow, real stores on testnet4, and signed builds. Until then this takes no slot.
      
## M. Stateless signers (27 November 2026)

Generic wording and a signer guide ([`docs/signers.md`](docs/signers.md)): the app and docs say **signer** (*stateless signer*, *dispositivo di firma*); a device's name appears only in its own steps. Any device meeting the requirements can be tested; only tested devices are recommended.

- [x] App wording: generic, with SeedSigner menu paths kept as "on a SeedSigner: …" (v0.9.10)
- [x] Signer guide: requirements, tested list, per-device steps; SeedSigner tested, Krux planned
- [x] Programme DAO renamed SIGNER DAO (was SEEDSIGNER DAO)
- [ ] **Krux test, after the ALPHA DAO workshop,** on a testnet4 DAO: key export scanned at sign-up, wallet descriptor loaded, a round signed with one SeedSigner and one Krux on the same council, the descriptor's change check confirmed on the Krux; results recorded in `docs/signers.md` like `docs/seedsigner.md`
- [ ] Protocol note: the record's `device: "seedsigner"` value means "key on a stateless signer"; decide whether to accept a generic `"signer"` value in the NIP (old records keep theirs)

## Open items

- [x] **Paid on delivery** (protocol 4.6): staged payouts and bounties, v0.8.0. Built: staged payouts (schedule in the form, reports as thread cards, a tranche joins a round only after its report, lapse, the committed line on the treasury page), then bounties (claims; the council's round picks the claimant). Reports are read in Discussion (a chip on the thread and a Reports filter) and on the proposal page (the schedule with each tranche's status); not on Home or in the footer
- [x] Same wallet in another key order is one treasury (v0.6.4, COUNCIL DAO finding 17)
- [x] **Migration to the first unused address** of the new treasury (protocol 6.1 says "first receive address"; after a return to an earlier key set that address is already used). Protocol change: discuss first
- [ ] **Guide: one key per DAO.** The same SeedSigner key with the same co-signers in two DAOs makes the same wallet (COUNCIL DAO and SEEDSIGNER DAO shared one with the test cards)
- [ ] **Transaction box before broadcast** (COUNCIL DAO finding 19): a source answered "known" for a round not yet sent; not reproduced
- [ ] **Restoring a member in another browser** (COUNCIL DAO finding 14): add to the guide how one good phone can stand in for a member whose phone cannot use its camera
- [x] **Replace an open round** (COUNCIL DAO finding 9): the protocol allows a replacement round spending one of the open round's coins; the app has no button for it, so an unsignable or declined round blocks every later payout. Add "Replace this round" for the council, carrying the open round's payouts plus newly approved ones
- [x] **Donate address during a council change** (COUNCIL DAO finding 7): show the new treasury once the migration is broadcast
- [x] **Signing steps fold away** once a round has enough signatures (COUNCIL DAO finding 6)
- [x] **Not-listed founder after founding** (COUNCIL DAO finding 1): say the DAO is founded and link to the member sign-up
- [ ] **Clock skew** (COUNCIL DAO finding 2): the relay refuses events dated more than ~2 minutes ahead; the app warns when the phone's clock is off
- [ ] **Onboarding process for the council** (from COUNCIL DAO, 11 November 2026; **on hold until after the ALPHA DAO workshop and any changes to ALPHA DAO**, decided 18 November 2026: to be a detailed step-by-step guide with screenshots). Joining works, but the council needs one clear, step-by-step procedure it can follow. Rework `docs/guide.md` 6.1 into an onboarding section written for the council and the sponsor: who does what and in which order (check first, then the sponsor's proposal), one in-person check is enough (two council members for remote), the vote, then publishing and approving the member list (as many approvals as the threshold, not "three"), and what the candidate sees at each step. Cover the founding case too: someone left off the founders joins this way. Consider a short in-app version on the Council page next to **Check a candidate**
- [x] **Relay write check.** Decided 9 November 2026: phones show only members' posts (as for every other kind, `docs/protocol.md` 7.3), and the relay limits how fast one key can post discussion events. A relay rule limited to the current member list waits until spam is actually seen
- [ ] **Where the DAO npub's notes go.** The feed and announcements are ordinary notes (kind 1), and the DAO relay rejects every kind outside the DAO's range. Either they go to public relays only, or the relay also accepts kind 1 from the DAO npub alone
- [ ] Testnet4 DAOs: feed to public relays, or only to their own relay? (ties in with the open question in `docs/decisions.md` on testnet publishing)
- [ ] Default list of public relays for the DAO npub
- [x] Order of the three parts: B (with the carried-over issues) in v0.3.0, A in v0.4.0, C after
