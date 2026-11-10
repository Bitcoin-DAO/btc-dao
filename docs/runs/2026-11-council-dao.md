# COUNCIL DAO: v0.5.0 in the wild (council change)

**Release:** v0.5.0. **Network:** testnet4. **Council:** 2 of 3, one SeedSigner, SeedQR test cards A, B, C; card D (printed for this run) is the replacement. Test cards are testnet only.

## Plan

1. Found a 2-of-3 SeedSigner DAO with cards A, B, C (as SEEDSIGNER DAO), plus one founder on a phone.
2. Fund the treasury.
3. Card C plays the lost key: its holder opens Profile → "SeedQR card and plate lost?" → reports it.
4. On the Council page, "Start a council change: a new key for …". Scan card D's key export (Export Xpub → Multisig → Native Segwit → Sparrow). Check the new treasury address against Sparrow (cards A, B, D, 2 of 3). Publish; everyone votes.
5. After the tally: Prepare the round (the migration). Sign with cards A and B on the SeedSigner; check on the device that the single output is the new treasury address. Broadcast.
6. After the receipt: publish and approve the new settings version (Council page shows the council before and after).
7. Home: one "Treasury moved" movement, the balance in the new treasury.
8. A payout signed with card D and one other card: the new council works (the SeedSigner must load the new descriptor first).
9. The DAO name in the header → history: founding and the council change with the migration tx.
10. Optional: send a small amount to the old treasury address and check the home page shows it as "earlier treasury".

## Findings

(to fill in during the run)
