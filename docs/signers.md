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
| **Krux** | current release | **Planned:** test after the ALPHA DAO workshop (`NEXT-RELEASE.md` M) | Its documentation lists multisig key export, wallet descriptor loading, animated PSBT signing and SeedQR (standard and compact). Not yet checked against the app. |

Other devices can be added the same way: check R1–R8 on a testnet4 DAO, record the formats as for SeedSigner, then list it as tested.

**A mixed council** (different devices for different keys) is stronger than one brand for every key: a fault or a supply problem in one device's firmware cannot stop or compromise the treasury alone. Once a second device is tested, mixing is encouraged. A workshop still runs on one device type, for simplicity.

## 3. Steps per device

### SeedSigner (tested)

- **Network:** Settings → Advanced → Bitcoin network → Testnet (or Mainnet). Save settings (Persistent settings), or it starts on Mainnet.
- **Key export (sign-up, council change):** Export Xpub → Multisig → Native Segwit → Sparrow; the phone scans the animated QR.
- **Wallet descriptor (signing step 1):** Scan, then point at the app's descriptor QR.
- **Sign (signing step 2):** Scan, then point at the animated PSBT QR; check every address and amount, and that the rest is verified change; sign; the phone scans the signed PSBT.

### Krux (planned, not yet tested)

From Krux's documentation, to be confirmed in the test:

- **Network:** in Settings, set the network to Testnet (or Mainnet).
- **Key export:** load the key (SeedQR), then the extended public key, multisig, shown as QR.
- **Wallet descriptor:** Wallet → Wallet Descriptor, scan the app's descriptor QR.
- **Sign:** Sign → PSBT, scan the animated QR, check, sign; the phone scans the signed PSBT.

## 4. The test for a new device

On a testnet4 DAO, with the device and at least one tested device on the same council:

1. **Key export** scanned at founder sign-up; the fingerprint on the phone matches the device.
2. **Founding** with that key; the council member's phone confirms the key listed for them is theirs.
3. **Descriptor** loaded on the device; it shows the threshold and every fingerprint.
4. **A round signed** with this device and a tested one; change shown as verified on both; the round confirms.
5. **Council change** scanned from the device (as the incoming key).
6. **Recovery** of the treasury in Sparrow from the recovery sheet and the device's seed.

Record the formats (as in [seedsigner.md](seedsigner.md)) and move the device to "Tested".

## 5. In the record

A council key on a signer is stored as `device: "seedsigner"` in the founding settings and council changes, a name kept from the first device for compatibility. It means "key on a stateless signer", whatever the device. Whether the NIP should also accept a generic value is an open item (`NEXT-RELEASE.md` M).
