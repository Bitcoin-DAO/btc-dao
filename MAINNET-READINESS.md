# Mainnet readiness

**Goal:** move the first DAO to mainnet as soon as every part of btc-dao has been shown to work in the wild, not only in the automated tests.

**Why in the wild:** the automated tests run a simulated chain and passed throughout UNO's practice run, while the real network found five issues in one day (throttled requests, a single chain source, a false "Broadcast ✓", a transaction that never spread, fees and empty blocks). Only real networks, real phones and real people find these.

**Where each item is tested**

| Stage | Network | What it proves |
| --- | --- | --- |
| UNO practice | testnet4, 2 of 2, two phones, short votes | The whole life of a DAO, quickly, with the developer at hand |
| UNO testnet | testnet4, hardware signing | SeedSigner, recovery without the website, real vote lengths |
| Sandbox DAO | testnet4, 3 of 5, all remote | Strangers, many devices, signatures spread over days |
| First mainnet DAO | mainnet, treasury capped (S9) | Three monthly rounds without developer help (release condition in FORK-TASKS.md) |

**Rule:** an item is ticked only when it has passed on a real network, with the release and the date written next to it. A fix found in one stage is released, and the item is tested again.

**Status:** started 6 November 2026, at v0.1.6.

## 1. Founding and identity

- [x] Founding in person and remote, 2 of 2, short codes checked (UNO practice, v0.1.1–v0.1.5, 6 Nov 2026)
- [ ] Remote founding with strangers, 3 of 5, through the group (Sandbox DAO)
- [ ] Passkeys on iPhone (Safari) and Android (Chrome), and a passkey synced to a second device
- [ ] Identity card printed, then used to restore on a new phone
- [ ] Sign-in on a phone that has never seen the DAO, from the site address only

## 2. Treasury reading

- [x] Balance, movements and funding address read through an unstable indexer, with the remembered reading shown (UNO practice, v0.1.4)
- [x] Second chain source used when the first fails (Blockbook, UNO practice, v0.1.5)
- [ ] Our own indexer as a chain source (needed before mainnet)
- [ ] Change returned by a round is shown and spent in the next round
- [ ] Treasury read with many movements (10 or more)

## 3. Proposals and votes

- [x] Payout proposal with recipient confirmation, voted and passed (UNO practice, 6 Nov 2026)
- [ ] Rejected proposal (fails on votes)
- [ ] Proposal without quorum
- [ ] Vote changed before the close
- [ ] Rule change, confirmed by the council (including the fee setting, once released)
- [ ] Statement proposal
- [ ] Votes of the real length (days), with members voting on different days (Sandbox DAO)

## 4. Membership

- [ ] New member proposed, short code checked, voted in
- [ ] Member leaves
- [ ] Member removed by a two-thirds vote
- [ ] Council change (a council member replaced, new descriptor)
- [ ] Lost key: card restore, and key replacement when there is no card

## 5. Payout rounds

- [ ] First payout confirmed on chain, receipt published, proposal shows paid (UNO practice, round 2026-11: broadcast reached the network on the second attempt, v0.1.6)
- [ ] A broadcast reaches the network first time, and the round confirms within a few blocks (fee setting released)
- [ ] Round with several payouts
- [ ] Signatures collected over days (Sandbox DAO, 3 of 5)
- [ ] A council member declines a round, with the reason shown
- [ ] Payment that lapses after two rounds
- [ ] Fee above the charter cap: the round waits (S5)
- [ ] Closing: the whole balance returns to the BTC DAO Testnet Treasury

## 6. Hardware signing and recovery (UNO testnet)

- [ ] SeedSigner signs a round from the copied PSBT, the signed PSBT is pasted back
- [ ] Descriptor loaded on the SeedSigner, change shown as verified (S7, hard gate)
- [ ] Every address shown in full and compared on the device (S1)
- [ ] UNO restores and spends its treasury in Sparrow without the website

## 7. Infrastructure and security

- [ ] Own indexer (Bitcoin Core plus Blockbook or Esplora) running and monitored
- [ ] Org relay and the public relays: events found after a day, a week, a month
- [ ] Site mirrored on a second host; releases signed with a published hash (S2)
- [ ] Final tallies published at every close; late votes ignored (S3)
- [ ] State edge cases written as test cases and passing (S4)
- [ ] Independent code review

## 8. Mainnet launch conditions

- [ ] Sections 1 to 7 ticked
- [ ] Treasury cap set in the charter at an amount the members can afford to lose (S9)
- [ ] Main and spare SeedSigner from different sources (S8)
- [ ] Mainnet config: chain sources (own indexer first), fee setting, relays

## Next release (findings not yet built)

From UNO's practice run, 6 November 2026:

1. After publishing the founding settings, say what happens next and show who has approved.
2. After founding, a "Fund the treasury" step.
3. Home page: make clear a round can be prepared as soon as payments are approved.
4. Treasury reading names its source: "Read from the blockchain: 15:24 · via Blockbook".
5. Fee setting in the DAO's rules, **fast** (default) or **economical**, changed by a rule-change vote. Fast aims for the next block with 25% headroom and a floor of 2 sat/vB; the charter cap stays, with a warning when the fast rate is above it; a check before broadcast if the rate has risen while signatures were collected; the fee shown to signers in sats, as a share of the payouts, and with its aim. No replace-by-fee.
6. A broadcast goes to every chain source, not only the first that accepts.
7. Founder guide: each member uses their own Google or Apple account for the passkey.
