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
