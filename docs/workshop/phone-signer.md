# Council hardware workshop: an old phone as a signer

A short workshop, about an hour per phone, that turns an old Android phone into a signing device for one council member: offline from its first boot, used for nothing else. It is a **staging device** ([signers.md](../signers.md), section 6): for practice, and for low-value treasuries within the phone-signer limits. It does not replace a stateless signer.

Status: plan, 27 November 2026. **Not usable yet on a testnet4 DAO:** the candidate app (Cypher Box, Seed-Signer mode) signs for mainnet wallets only. Run this workshop when the app supports testnet4, or for a low-cap mainnet DAO. ALPHA DAO uses SeedSigner only.

## What each person brings

- An old Android phone (Android 7 or later), charged, with its charger. Nothing on it they want to keep: it will be wiped.
- Their council key's SeedQR card (or plate), made on dice or at a key ceremony, never on the phone.

## What the organiser brings

- A computer, a microSD card per phone (or one card passed round), and a card reader.
- The app's install file (APK) from the project's release page, with its published checksum and signature.
- The DAO's wallet descriptor as a QR (from the DAO's site), and a practice PSBT if the DAO has one ready.

## Steps

1. **Factory-reset the phone.** Settings → System → Reset → Erase all data. This removes everything that was on it, accounts included.
2. **Skip Wi-Fi at first boot.** Android allows this: at the network screen choose **Skip** or **Set up offline**; skip every account sign-in. No SIM card. The phone must never join a network, from now on.
3. **On the computer, copy the install file and its checksum onto the microSD card, and check the hash there.** The hash printed by the computer must match the one published with the release. If it doesn't, stop: do not install.
4. **On the phone, install the app from the card.** Insert the card, open the phone's file manager, tap the install file, allow installing from this source when asked.
5. **Turn on aeroplane mode and never join a network.** Also turn Wi-Fi and Bluetooth off in their own settings. Take the microSD card out.

## Then, in the app

6. **Switch on the app's signer mode.** In Cypher Box: Offline Seed-Signing mode. It is one-way: the app stays a signer until deleted.
7. **Scan the council key's SeedQR** and export the multisig key (`[fingerprint/48h/…/2h]xpub…`) as a QR. The council member's DAO phone scans it at sign-up, or a council member scans it at a council change. Check the fingerprint shown on both phones is the same.
8. **Register the DAO's wallet:** scan the descriptor QR from the DAO's site. The signer must show the threshold and every council fingerprint, and its own among them.
9. **A practice signature:** scan a practice PSBT, check every address and amount and that the change is recognised as the wallet's, sign, and let the DAO phone scan the signed QR back.

## Rules for the phone afterwards

- It is a signing device and nothing else: no SIM, no Wi-Fi, no Bluetooth, no other apps, no accounts.
- The seed is never typed into it: SeedQR by camera only. The card and the phone are kept apart.
- If it ever joins a network by mistake, or is lost: treat the key as exposed, tell the council, and replace the key by a council change.
- Updating the app means repeating steps 3 to 5 with the new version (hash checked), never an update over the internet.

## Limits (from signers.md)

- **Testnet:** allowed, for practice, once the app supports it.
- **Mainnet:** only with a low treasury cap, and fewer phone-signer keys than the threshold (in 2 of 3, at most one), so every payment also passes an independent signer.
