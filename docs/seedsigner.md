# SeedSigner formats

What the app reads from and shows to a SeedSigner, checked against a real device. Each format is recorded here before the app relies on it (`NEXT-RELEASE.md`, v0.4.0 step 1).

## Device used for the checks

- SeedSigner firmware **0.8.6**, network set to **Testnet** (Settings → Advanced)
- Keys: three test SeedQR cards (A, B, C), standard SeedQR, 12 words, made on a computer for testnet4 only (9 November 2026). Card A: fingerprint `d3bdd580`

## 1. Xpub export (founding)

Checked 9 November 2026, card A.

- Menu: **Export Xpub → Multisig → Native Segwit → Sparrow**
- Shown as an **animated QR**, about 3 frames a second, in **UR format, type `crypto-account`** ([BCR-2020-015](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-015-account.md)), 5 fragments, sent as fountain codes: the sequence numbers keep rising (`UR:CRYPTO-ACCOUNT/43-5/…`), so a scanner joins any parts in any order
- From a 23-second phone video, 62 different frames decoded; the first **9 frames** were enough to complete the key (about 3 seconds of scanning)
- Content: master fingerprint `d3bdd580`; one output descriptor, script `wsh`, origin path `48'/1'/0'/2'`, use info network 1 (testnet); the key itself as BIP32 public key data. Re-encoded with testnet version bytes it gives `tpubDFKVE4hAcCsmYyXX8mURCAE3smjoLhyqGH5CtJjgyhBBQR9VopPxmK24XsjmbG4XTvHoQo73WBRnC2aLuG5mbUPemuyvUBJUEeDMM5nyG8e`, **the same key** the card was made from
- Decoding libraries that work: `@ngraveio/bc-ur` (fragments) and `@keystonehq/bc-ur-registry` (`CryptoAccount`). The registry prints the key with mainnet version bytes (`xpub…`) whatever the network; the app must take the network from the key's use info and re-encode as `tpub` on testnet
- The **Specter Desktop** export is also animated (not checked further: the app reads the Sparrow one)

## 2. PSBT to the device (signing)

To check in step 1: a test round's PSBT as animated UR `crypto-psbt`.

## 3. Signed PSBT back from the device

To check in step 1.

## 4. Wallet descriptor (change check, S7)

To check in step 1: the treasury's descriptor as a QR the SeedSigner scans before signing.
