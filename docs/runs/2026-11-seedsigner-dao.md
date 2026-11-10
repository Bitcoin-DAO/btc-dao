# SEEDSIGNER DAO run · from 10 November 2026

**DAO:** SEEDSIGNER DAO (`seedsigner-dao`), testnet4, practice votes (10 minutes), 2-of-3 council, every treasury key on a SeedSigner. The mainnet flow with worthless coins (v0.4.0 step 5).
**DAO id:** `39b02358d1748cbfc803df310b5daf3f7e12f517b2bd1d569ee9c8ce1674fffc`
**Equipment:** one SeedSigner (firmware 0.8.6), one SD card, three test SeedQR cards (A, B, C) loaded in turn; phones on Android.

## Steps

| Step | Result | Notes |
| --- | --- | --- |
| Council sign-up from the SeedSigner's key export | Passed | First attempt refused: the device was on Mainnet (path 48h/0h/…); the message now says to switch the device to Testnet (fb9e227) |
| Founding, 2 of 3 | Passed | |
| Funding | Passed | showed in the treasury once confirmed |
| Payout proposal and vote | Passed | a repeated "Yes" published a second, identical vote; only the latest counts, but it confused the record (fixed 9c9ed0f) |
| Payout round signed on the SeedSigner with cards A and B | Passed | descriptor, animated PSBT and signed PSBT all read quickly on device and phone |
| Broadcast | Passed | "Broadcast again" was needed to reach 3 of 3 sources, as in UNO's runs |
| Receipt | Issued too early | published for block 160347 at "3 confirmations" while Blockbook had the payment in block 160349, 1 deep: finding 4 |
| Closing round, signed on the SeedSigner | Passed | SEEDSIGNER-0002, 14,328 sats back to the BTC DAO Testnet Treasury, fee 294 sats, block 160355; signed by @Founder1 and @Founder2; receipt under the new rule (every source, same block) |

## Findings

1. **SeedSigner on the wrong network:** the export does not say "mainnet", only its path does (fixed: the app reads the path and says how to switch).
2. **Repeated vote:** tapping the current choice published it again (fixed: no new event; replaced votes marked in the record).
3. **Broadcast reached 2 of 3 sources at first:** "Broadcast again" brought it to 3 of 3. v0.3.0 re-sends by itself a minute after a broadcast if the page stays open; to check whether it ran here.
4. **A receipt from mixed sources.** The depth was computed from one source's block height (160347) and another source's chain tip (160349): "3 confirmations" that no chain had. Blockbook, on the winning chain, had the payment in block 160349, 1 deep. The payment itself is real; the receipt names the wrong block and came too early. Fixed: each source's depth comes from its own tip, and the receipt waits until **every** source that knows the payment sees it deep enough and in the same block; the round page says when sources disagree (a fork settling).
5. **The descriptor QR overflowed a narrow phone's screen** on the round page (it still scanned). Fixed: QR codes shrink to the width available; the QR test checks a 340-pixel-wide screen.
6. **The automatic second broadcast worked:** in the closing round the transaction went from 2 to 3 of 3 sources by itself, and showed on Blockbook.
