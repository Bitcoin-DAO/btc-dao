# Signers

A council member's treasury key lives on a **stateless signer** (in the app: *signer*; in Italian: *dispositivo di firma*): a small offline device that holds the key only while it is switched on, loads it from a SeedQR card or words, and talks to the phone only through QR codes. The phone never holds the key.

btc-dao is not tied to one device. This page says what a signer must do, which devices have been tested, and the steps on each. **Only tested devices are recommended**; a device that meets the requirements on paper is "planned" until it has passed the tests below on a testnet4 DAO.

Device names are used here only to say which device a step is for. The project's own names (DAOs, badges, kits) do not use any device's name.

## 1. What a signer must do

| # | Requirement | Why |
| --- | --- | --- |
| R1 | **Stateless:** forgets the key when switched off; the key comes from a SeedQR card, a plate or words each time | Nothing to steal from the device; the card and plate are the key |
| R2 | **QR only:** a camera in and a screen out; no USB data, no Wi-Fi, no Bluetooth needed for any step | The phone and the device never connect |
| R3 | **SeedQR:** reads standard SeedQR (12 words) | The workshop cards and steel plates work on every device |
| R4 | **Network setting:** Testnet and Mainnet | Trial DAOs run on testnet4 |
| R5 | **Multisig key export:** P2WSH (BIP48, script type 2), with master fingerprint and path, as a QR the app reads (UR `crypto-account`, or text `[fp/48h/…/2h]tpub…`) | Sign-up and council change scan it |
| R6 | **Wallet descriptor:** loads the `wsh(sortedmulti(…))` descriptor from a QR and shows threshold and fingerprints | The device can tell change going back to the treasury from a payment (S7) |
| R7 | **PSBT signing:** reads an animated PSBT QR, shows every output and amount, marks verified change, and shows the signed PSBT as an animated QR | The council checks on the device, not on the phone |
| R8 | **Open source and verifiable:** published firmware, reproducible or hash-checked builds | The council can check what it runs |

## 2. Tested and planned

| Device | Firmware | Status | Notes |
| --- | --- | --- | --- |
| **SeedSigner** | 0.8.6 | **Tested** (9–10 November 2026: sign-up, founding, signing, council change on testnet4 DAOs) | Formats recorded in [seedsigner.md](seedsigner.md). Starts on Mainnet unless settings are saved. |
| **Krux** on a Yahboom K210 module | current release | **Planned:** test after the ALPHA DAO workshop (`NEXT-RELEASE.md` M) | Its documentation lists multisig key export, wallet descriptor loading, animated PSBT signing and SeedQR (standard and compact), and a Testnet setting. Testnet4 expected to work (an offline signer only needs testnet key format and addresses, the same on testnet3 and testnet4); to be confirmed. Board choice in section 3. |
| **Blockstream Jade** (Core or Plus) | current release | **Planned** | Off the shelf, no assembly. Stateless QR mode from a SeedQR (standard and compact), multisig registration with change checks, quick seed switching (one device, several keys). Has USB and Bluetooth hardware, unused in QR mode. Its firmware is written separately (C), which makes it the independent signer in a mixed council. |

| **Old Android phone** with Cypher Box (Seed-Signer mode) | 0.1.14, reviewed 27 November 2026 | **Candidate, staging only;** mainnet only: its signer refuses testnet wallets, so it cannot join a testnet4 DAO until it adds a network switch | See section 6. |

Other devices can be added the same way: check R1–R8 on a testnet4 DAO, record the formats as for SeedSigner, then list it as tested.

**Different code, not only different devices.** As far as is known, SeedSigner and Krux both build on the same Python Bitcoin library (embit), so a bug there could reach both; Jade's firmware is separate. A council meant to be independent mixes code lines (for example SeedSigner or Krux plus Jade), not only brands.

**A mixed council** (different devices for different keys) is stronger than one brand for every key: a fault or a supply problem in one device's firmware cannot stop or compromise the treasury alone. Once a second device is tested, mixing is encouraged. A workshop still runs on one device type, for simplicity.

## 3. Steps per device

### SeedSigner (tested)

- **Network:** Settings → Advanced → Bitcoin network → Testnet (or Mainnet). Save settings (Persistent settings), or it starts on Mainnet.
- **Key export (sign-up, council change):** Export Xpub → Multisig → Native Segwit → Sparrow; the phone scans the animated QR.
- **Wallet descriptor (signing step 1):** Scan, then point at the app's descriptor QR.
- **Sign (signing step 2):** Scan, then point at the animated PSBT QR; check every address and amount, and that the rest is verified change; sign; the phone scans the signed PSBT.

### Krux (planned, not yet tested)

**Board** (checked 27 November 2026, prices with VAT; they move):

| Board | Price | Notes |
| --- | --- | --- |
| **Yahboom K210 vision module** (part YB-A71, "K210 Vision Recognition/Sensor Module") | about €49 (Amazon.de or .it, sold by Yahboom-EU) | **Recommended for the test.** Camera, 2-inch touchscreen, case or bracket, 32 GB card and reader in the box. No built-in battery: runs from a USB charger or power bank. **Not** the "AI-Motion K210 Developer Kit", which has a Wi-Fi module. Some shop listings show "Bluetooth" or "Cortex A9": those are listing errors; check the board is a bare K210 with no radio. |
| **Maix Amigo** | about €76–80 (Botland, Amazon.it/.fr; often out of stock) | Largest screen, touchscreen, built-in battery. Some screens need display settings changed; charge and flash through the USB-C port at the bottom. |

Krux's own list also has the M5StickV, Maix Dock, Maix Cube, WonderMV and others; the two above are the ready-to-use touchscreen ones.

**Settings once flashed:** Settings → Bitcoin → Network → **Testnet** (Krux starts on mainnet); Default Wallet → **Multisig**; settings stored in **flash**, so both survive a restart. On testnet a multisig key is derived at `m/48'/1'/0'/2'`, the path btc-dao uses.

From Krux's documentation, to be confirmed in the test:

- **Key export:** load the key (SeedQR), then the extended public key, multisig, shown as QR.
- **Wallet descriptor:** Wallet → Wallet Descriptor, scan the app's descriptor QR.
- **Sign:** Sign → PSBT, scan the animated QR, check, sign; the phone scans the signed PSBT.

**A funded kit,** if the test passes: board, SeedQR card or plate, cable: roughly €55–60 per council member. A candidate default kit for the SIGNER DAO's programme phase.

## 4. The test for a new device

On a testnet4 DAO, with the device and at least one tested device on the same council:

1. **Key export** scanned at founder sign-up; the fingerprint on the phone matches the device.
2. **Founding** with that key; the council member's phone confirms the key listed for them is theirs.
3. **Descriptor** loaded on the device; it shows the threshold and every fingerprint.
4. **A round signed** with this device and a tested one; change shown as verified on both; the round confirms.
5. **Council change** scanned from the device (as the incoming key).
6. **Recovery** of the treasury in Sparrow from the recovery sheet and the device's seed.

Record the formats (as in [seedsigner.md](seedsigner.md)) and move the device to "Tested".

## 6. Phone signers (staging)

An old Android phone, set up offline from its first boot and used for nothing else, can act as a signer. It is a **staging device**: a way for council members to learn to sign remotely on hardware they already have, not a replacement for a stateless signer.

**Why it is weaker than a stateless signer:** the phone runs a full operating system, old phones get no security updates, and the signer app is a whole wallet app whose network code is still there; "offline" is a promise to never connect, not hardware with no radio. A browser page is not used: it would have to be loaded from the web, and a browser cannot reach the camera from a local file.

**Limits:**

- **Testnet:** allowed, for practice.
- **Mainnet:** only with a low treasury cap (`treasuryCapSats`), and **fewer phone-signer keys than the threshold** (in 2 of 3, at most one), so phones alone can never move the money and every payment also passes an independent signer.
- **Visible:** phone-signer keys to be marked in the app and on the dashboard as declared (`NEXT-RELEASE.md` M); the threshold rule is a declared charter article, not something the app can check (section 7).

**Candidate app: Cypher Box, Seed-Signer mode** (github.com/CypherBoxLLC/Cypher-Box, MIT, reviewed at 0.1.14):

- Holds no seed: loads it from SeedQR or words for one signature and drops it; blocks screenshots while a secret is shown; signs only while no server answers.
- Multisig only for a wallet registered first: native SegWit `sortedmulti`, 2 to 15 keys, descriptor checksum checked, change checked against the registered wallet. Formats match btc-dao: key export `[fp/48h/0h/0h/2h]xpub…`, PSBTs as UR `crypto-psbt`.
- One-way: once Seed-Signer mode is on, the app is a signer until deleted.
- **Against:** mainnet only (testnet wallets refused); the same app carries internet permission and online features; runs back to Android 7; young (0.1.x, one company); Android reproducible builds described as a goal; iOS builds cannot be checked against the source (Android only for btc-dao).

**Set-up** (council hardware workshop): [workshop/phone-signer.md](workshop/phone-signer.md).

## 7. Declared, witnessed, enforced

Which device holds a key **cannot be checked from the record or the chain**: a public key and a signature look the same whatever made them, a QR format can be copied, and device attestation exists only for some commercial devices, through their own apps. So btc-dao is honest about three levels:

| Level | What | How |
| --- | --- | --- |
| **Enforced** by the protocol | The treasury cap (`treasuryCapSats`), the threshold, the keys in the descriptor | Every client checks them; nobody can sign around them |
| **Witnessed** | Which device a key was scanned from | At founding and every council change, the key is scanned while another council member watches (in person or on a call); the minute records device and witness |
| **Declared** in the charter | Phone-signer keys fewer than the threshold; mixed device types and code lines | Council handbook articles 8 to 10 ([charter module](charter-modules/council-handbook.md)); the council holds itself to them, visibly in its minutes |

The device type stored with a key is a declaration: the app and the dashboard show it as **declared**, never as fact. For the phone-signer limits, the cap is the real safeguard; the threshold rule is the council's declared commitment.

## 8. In the record

A council key on a signer is stored as `device: "seedsigner"` in the founding settings and council changes, a name kept from the first device for compatibility. It means "key on a stateless signer", whatever the device. Whether the NIP should also accept a generic value is an open item (`NEXT-RELEASE.md` M).
