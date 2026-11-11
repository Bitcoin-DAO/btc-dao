# COUNCIL DAO: v0.5.x in the wild (council change and growth)

**Release:** v0.5.1. **Network:** testnet4. **Council:** 2 of 3, one SeedSigner, SeedQR test cards A, B, C; card D (printed for this run) is the replacement. Test cards are testnet only.

## Plan

1. Found a 2-of-3 SeedSigner DAO with cards A, B, C (as SEEDSIGNER DAO), plus one founder on a phone.
2. Fund the treasury.
3. Card C plays the lost key: its holder opens Profile → "SeedQR card and plate lost?" → reports it.
4. On the Council page, "Start a council change: a new key for …". Scan card D's key export (Export Xpub → Multisig → Native Segwit → Sparrow). Check the new treasury address against Sparrow (cards A, B, D, 2 of 3). Publish; everyone votes.
5. After the tally: Prepare the round (the migration). Sign with cards A and B on the SeedSigner; check on the device that the single output is the new treasury address. Broadcast.
6. After the receipt: publish and approve the new settings version (Council page shows the council before and after).
7. Home: one "Treasury moved" movement, the balance in the new treasury.
8. A payout signed with card D and one other card: the new council works (the SeedSigner must load the new descriptor first).
9. History (footer): founding and the council change with the migration tx.
10. Growth (v0.5.1): the plain member proposes a council change, reason "A new council seat", joining with card C (now off the council), threshold 3 of 4. Check the new treasury address in Sparrow (cards A, B, C, D, 3 of 4). Everyone votes.
11. The migration is signed by the council in force (two of A, B, D). After the receipt, publish and approve settings version 3.
12. A payout signed with three cards, one of them C on the new member's phone. History shows both changes.
13. Optional: send a small amount to the old treasury address and check the home page shows it as "earlier treasury".

## Findings

**Founded** 11 November 2026, DAO id c2296c844748369e8dc140d85864486423e95b8b9812888ab00f7dc60d93725d; 2 of 3 on cards A, B, C.

1. **The fourth phone was left off the founders.** Its code was not scanned at setup step 3, so the founding went out without it. Its page then said "You are not listed: talk to the person preparing the founding", a dead end once the DAO is founded. It joined instead as a candidate (#/candidate: council check in person, add_member proposal COUNCIL-0001, vote, member list version 2), which worked. *Fix:* once founded, the not-listed page should say so and link to the member sign-up; the setup page could ask "no founders besides the council?" before publishing.
2. **"Closes in 14 minutes" on a 10-minute vote.** The phones' clocks differ by about 4 minutes; a proposal is dated by the phone that publishes it. Nothing limits how far ahead an event can be dated, so a fast clock stretches a vote, and a slow one could date a late vote inside it. *Fix:* the DAO relay refuses events dated more than ~2 minutes ahead of its clock; the app warns when the phone's clock is off.
3. Two council members checked the candidate's code; one in-person check is enough (the page counts every check signed: "3 ✓").
4. **Lost-key report told a SeedSigner member to type the words into the phone if found.** Bad practice for any key. Fixed in v0.5.2: found again by scanning the SeedSigner's key export (public part), matched by fingerprint. The "start a council change" flow from the report was clear.
5. **Members can outvote the council** (asked during the run): by design, members decide and the council carries out; the council's check is that nothing moves without its signatures and approvals. Quorum 1/3 lets the council alone meet quorum when members stay away (gap G-02).
6. **Migration round (COUNCIL-0002):** prepared, signed with cards A and B on the SeedSigner, broadcast, known to 3 of 3 sources; tx 042e2f08c02139f3…. After "Enough signatures ✓" the signing steps (descriptor QR open) still show on the signer's page; they could fold away once the round has enough signatures.
7. **Migration confirmed** (block at 10:21, 9,684 sats to the new treasury, fee 316). During the move Home showed the old treasury at 0 and "New treasury (on its way)" at 9,684, as designed. *Problem:* "Donate to the treasury" still showed the old treasury's address while the move was under way; donations there would need a sweep. *Fix:* once the migration is broadcast, the donate box shows the new treasury's address (or nothing until the settings version is in force).
8. **Settings version 2 published and approved;** History shows "Council changed": reason lost key, new treasury key for @CouncilC ec03225a → 6b7fa6f3, 2/3 → 2/3, the migration tx, COUNCIL-0002.
