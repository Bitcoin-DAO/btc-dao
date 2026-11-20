# Recovery sheet: issue, print, confirm (design draft)

Status: idea agreed 20 November 2026, not yet built. Reviewed 20 November 2026; confirmations made local, 20 November 2026.
Scope: **mainnet DAOs only.** Protocol (the migration destination only), app (sheet, notice, confirmation, signing gate), guide and spec (council kit, signing, council change). No change to the descriptor, the floor or the payout rules.

DAOs founded on testnet4 keep the shared-device setup they were founded with (one shared SeedSigner, a SeedQR card each); nothing in this draft changes them.

---

## 1. Summary

The recovery sheet is the one document that holds every public key of the treasury. With a threshold of seeds (for example any 3 of 5) it restores the funds in Sparrow, without this software. Losing every copy is as serious as losing a threshold of seeds, and an out-of-date copy is almost as bad: after a council change it restores an old, emptied treasury.

Today the sheet is a written step in the guide ("print and hand out the new recovery sheet"). Nothing tells a council member a new one exists, and nothing records that they hold it. This draft makes the sheet part of the app:

1. **The app produces the sheet** from the settings in force, with a short **sheet ID** printed large at the top.
2. **Every new descriptor issues a new sheet**, and every council member gets a notice: print it, archive the old one.
3. **"I have printed it"**: each council member confirms in their own app. The confirmation stays on their phone: no event, nothing on the relay, nothing public.
4. **No signing without it**: a council member cannot sign until they have confirmed the sheet in force, and coins never move to a new treasury before its council have read the new sheet aloud to each other and confirmed they hold it.

It also records the mainnet council kit that goes with it: **one SeedSigner per council member, no SeedQR card** (section 3).

---

## 2. Principles

- **Checked across the council, not taken from one screen.** The app prints the sheet, so a tampered website could print a tampered sheet. The defence is comparison: every council member checks their own fingerprint against their own plate, and the council reads the sheet ID aloud to each other before confirming (section 6.2). A confirmation in the app is only a tap; the spoken check is what catches a wrong or tampered sheet.
- **One sheet per descriptor.** The sheet changes exactly when the descriptor changes (founding and every council change) and at no other time.
- **The sheet is public, like the descriptor.** It holds no secrets. It may be printed, saved as a PDF and published in the repository.
- **Confirmations stay on the member's phone.** Who has printed which sheet is each council member's own housekeeping. It drives their own to-do list and signing gate, and is not sent to the relay, the DAO history or the dashboard.
- **Archive, never destroy.** An earlier sheet is still needed to sweep anything that arrives at an earlier treasury.

---

## 3. The mainnet council kit (assumed by this draft)

Each council member holds their own, and nothing in it is shared:

| Item | Contains | Kept | Used |
|---|---|---|---|
| **SeedSigner** with their own SD card | Signing software (the SeedCard plate-reader build when ready); no seed | At home | Every signing |
| **Steel plate** (SeedCard SH01, engraved seed-only) | 12 words, master fingerprint | At home, never carried | Every signing: read by the SeedSigner |
| **Recovery sheet** (current, plus archived ones) | Descriptor, fingerprints, sheet ID; no keys | At home, apart from the plate | Every signing: fingerprint check and descriptor QR |
| **Phone with the DAO app** | Passkey-protected identity key | With the member | Votes, endorsements, rounds |
| **Identity card** | Identity key as a QR | At home, apart from the plate | Restoring the passkey |

**No SeedQR card.** With a SeedSigner each, signing happens at home, so the plate never travels and no second copy of the seed is needed. Until the plate reader is ready, the words are typed in from the plate on the SeedSigner keypad.

On mainnet this replaces the "Signing setup for the trial" table in the spec (one shared SeedSigner, SeedQR card carried to signing). It also answers most of gap G-13 (signing-session logistics): there are no sessions; each council member signs at home, in any order.

**SeedSigner setting:** each council member's SD card should keep persistent settings, so the device starts on the right network (see `docs/seedsigner.md`).

---

## 4. The sheet

Produced by the app from the settings version in force (or pending, section 5), one A4 page, printed from the browser. A PDF can also be saved: it holds nothing secret.

| Part | Content |
|---|---|
| **Header** | Warning: *"Keep this sheet. With any [threshold] of the [n] seeds it restores the treasury. Losing every copy is as serious as losing [threshold] seeds."* |
| **Sheet ID** | Printed large: the 8-character checksum of the descriptor **exactly as it appears in the endorsed `dao.settings`** (the part after `#`), its word form (four words, for reading aloud), the settings version and the date |
| **Status line** | Left blank for the holder to write *"ARCHIVED on …"* when it is replaced |
| **DAO** | Name, network, threshold (for example 3 of 5) |
| **Descriptor for restoring** | The full descriptor, receive and change, as text and as a QR, for Sparrow or any other wallet |
| **Descriptor for the SeedSigner** | The `/0/*` form as a QR, the form the SeedSigner reads (`docs/seedsigner.md` §2), marked "for signing" |
| **Council** | The fingerprints, each with its holder's pseudonym and role |
| **First addresses** | The first 3 receive addresses, for checking a restore and a migration destination by eye |
| **Restore steps** | Import the restore descriptor into Sparrow, gather a threshold of seeds, sign, broadcast |

The sheet ID is the checksum the settings descriptor already carries, so it needs no new data and anyone can recompute it. The `/0/*` QR has its own, different checksum; the sheet ID always refers to the settings form.

**The word form.** The 40 bits of the checksum map to four words from the BIP39 list (eleven bits each, the last word padded), so the ID can be read aloud on a call without spelling it out.

**Restore test.** Before mainnet, restore a testnet4 treasury in Sparrow from a printed sheet alone, with coins at both receive and change addresses, and check that every coin is found.

---

## 5. When a sheet is issued

| Event | Sheet |
|---|---|
| **Founding** | Sheet 1, from the genesis descriptor |
| **Council change passes** | A new sheet, marked **PENDING**, from `new_descriptor` (section 7) |
| **New settings version confirmed** after the migration receipt | The pending sheet comes **into force**; the previous one becomes **archived** |
| Rule change, roster change, payout | No new sheet |

Every `change_council` reason (resignation, recall, lost key, rotation, threshold, expansion) produces a new descriptor, so each one issues a new sheet.

---

## 6. Notice and confirmation

### 6.1 The notice

When a sheet is issued, every member of the council named on it (incoming members included, outgoing ones excluded) gets:

- an item at the top of their **Council to-do list**: *"New recovery sheet 7f3k9q2d: print it and archive sheet a81c04ee."* (at founding: *"Recovery sheet 7f3k9q2d: print it."*);
- a banner on the Council page until they confirm;
- the same message through the members notification layer over Nostr, for those who have opted in.

### 6.2 Checking and confirming

Before confirming, the council compares the printed sheets: on a call or in the room, one member reads the sheet ID's four words and the first receive address, and each of the others checks them against their own printed sheet. Each member also checks that their own line of the council list shows the fingerprint engraved on their own plate.

Then one tap: **"I have printed recovery sheet 7f3k9q2d and archived the old one."** At founding: **"I have printed recovery sheet 7f3k9q2d."** The app first shows the sheet ID large and asks the member to read it off the printed paper.

### 6.3 Where the confirmation lives

On the council member's own phone, in the app's local storage, keyed by DAO, settings version and sheet ID. No event is published: the relay, the members and the public see nothing.

- It ticks off the member's own to-do item and banner.
- It opens the member's own signing gate (section 7).
- A member who changes phone, or loses their app data, confirms again from their printed sheet: one tap, after checking the ID.

There is no automatic check across members. The spoken comparison in 6.2, before anyone confirms, is the check.

### 6.4 Shown

- **The member's own Council page:** *"Recovery sheet 7f3k9q2d: confirmed"* or *"not yet confirmed"*, for their own sheet only.
- **DAO history:** each band of the descriptor chain shows its sheet ID.
- **Dashboard:** nothing. The public record shows the descriptor chain, as it already does.

---

## 7. Gates

**Signing a payout round.** A council member is offered signing only after they have confirmed the sheet in force. The signing screen shows the sheet ID and its words; the member checks them against their printed sheet before loading its SeedSigner QR. A wrong sheet would also show up on the device: change would not verify (requirement S7).

**Council change: backup before the move.** Coins must never sit in a treasury whose sheet nobody holds. So:

1. The `change_council` proposal passes: the pending sheet is issued to the new council.
2. Before the migration round can be **prepared**, the new council compares the pending sheet aloud (section 6.2), on a call or in the room. The council member preparing the round then ticks a required box: *"The new council read sheet 7f3k9q2d aloud, and at least [new threshold] of them confirmed holding it printed."* The app records the tick with the round.
3. The migration round pays to **receive index 0 of the new descriptor**, the first address printed on the pending sheet. Each signer checks the destination against it before signing.
4. After the receipt, the new settings version is confirmed; the pending sheet comes into force; the old one is archived.

**Founding.** Phase 2's gate in the guide (restore in Sparrow from the sheet alone, before any funds) is done from the printed sheet 1. The genesis hand-out ends with the founding council reading sheet 1 aloud, then each confirming in their own app.

---

## 8. Signing at home, step by step

1. Insert your own SD card into your SeedSigner and boot it.
2. Load your seed from your plate: read by the camera (plate reader) or typed in.
3. Check the fingerprint shown matches the one engraved on your plate and your line on the recovery sheet.
4. Check the sheet ID and its words on the app's signing screen match your printed sheet; scan the sheet's SeedSigner QR.
5. Scan the round's animated QR from the app.
6. Check every address in full and every amount on the device against the proposal page; check change shows as verified.
7. Sign and show the signed QR to the app.
8. Power off, remove the SD card, and put the plate and sheet away separately.

---

## 9. Changes to existing documents (when built, for mainnet)

- **protocol.md:** the migration round pays to receive index 0 of the new descriptor (section 7). No new event kind.
- **spec.md:** a mainnet council kit beside the testnet "Signing setup for the trial" table, which stays for testnet4 DAOs; on mainnet, no SeedQR cards in roles, rules and the threat table (S8 changes: no cards carried to a room, but a device per member to source and keep); recovery sheet section points here.
- **guide.md:** mainnet kit list (one SeedSigner per council member, no SeedQR templates, steel plates engraved seed-only or stamped); 3.3 and the hand-out (print, compare, confirm); 6.4 signing (section 8 here); council change steps 6 and 8 (pending sheet, gate, archive); G-13 mostly resolved for mainnet.
- **MAINNET-READINESS.md:** "every council member has confirmed the current recovery sheet", "a council change issues a new sheet before the migration", and the restore test (section 4).
- **Unchanged:** the workshop pack (`docs/workshop/`), its card generator and run sheet, and every testnet4 DAO, including ALPHA DAO.

---

## 10. Open questions

- Should the Council page remind a council member who has not confirmed the current sheet after a set time (for example 14 days)?

**Decided 20 November 2026:** confirmations stay on each member's phone, with no `dao.sheet` event. A relay event was considered (encrypted to the council) and dropped: a confirmation is only a tap and proves nothing about the paper, while the spoken comparison already catches a wrong sheet. If the spoken check proves easy to skip in practice, an automatic check can be added later.
