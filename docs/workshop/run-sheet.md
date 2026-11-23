# Founding day: run sheet

One page for the room, for the organiser. The [checklist](../new-dao.md) is for preparing; this is for the day itself. Times are a guide for a council of five and a few founders; a practice founding goes faster.

## Roles

- **Organiser:** a council member. Prepares the founding on their phone (Prepare the founding), adds every code, publishes.
- **Council members:** each has a phone, their SeedQR card (or makes a key from dice) and a turn at the SeedSigner.
- **Founders:** each has a phone. Remote founders join the group's video call.
- **A helper,** if there is one: watches the clock, checks the three checks below, takes photos (cards and dice, never a SeedQR or words).

## Before people arrive (30 min)

- [ ] WiFi works; the DAO's site opens on a test phone; the printer prints from a phone.
- [ ] SeedSigners on, network set to the DAO's network, persistent settings on.
- [ ] Cards cut out and laid out per council member; dice on the tables.
- [ ] For the KEY route, on each table: eleven d2 dice (2 orange, 5 white, 4 black), the dice strip cut out, word sheets A–D and page 1 of the step sheet; a roll log (page 2) per KEY member; pens ([KEY route](key/README.md)).
- [ ] The group's video call open on a laptop or tablet, for remote founders.

## 1. Welcome (10 min)

What the DAO is for, what happens today, and what nobody will ever ask anyone for: 12 words, a SeedQR photo, a private key.

## 2. Council keys (30–45 min)

Each council member, with the steps on page 1 of the cards (A: the ready-made key, or B: a key of their own from dice), until the SeedSigner shows their key's fingerprint, written on their card.
- KEY route members roll and look up words 1–11 at their table ([step sheet](key/key-d2-steps.pdf)) and queue for the SeedSigner only for word 12; ready-made and SeedSigner-entropy members use the device meanwhile.

## 3. Sign-up (20 min)

- Everyone opens the DAO's site and taps **Sign up as a founder**: name, then a key protected by a passkey.
- **Council members tick "I request a council seat"**, then export the key from the SeedSigner (step C on the cards) and scan it. The phone shows the fingerprint: it must match the card.
- **Check 1:** every council member says aloud that they ticked the box and their fingerprint matched.

## 4. Codes (20 min)

- The organiser opens **Prepare the founding** and adds each council member, then each founder: scan the QR, both read the short code aloud, **It matches: add**.
- Remote founders: **Share** in the group, the organiser pastes it, and they read the short code on the video call.
- **Check 2:** the setup page shows the council planned, for example **3 of 5**. If it shows fewer seats, stop: whoever is missing signs up again with the box ticked.

## 5. Publish and approve (10 min)

- The organiser taps **Sign and publish**.
- Each council member opens their sign-up page and taps **Approve and sign**.
- **Check 3:** no council phone shows "Do not approve: the treasury key listed for you…". If one does, stop: that council member's code was changed or scanned wrongly. Sign up and add them again before anyone else approves.
- Founded when enough council members have approved: everyone's page says so.

## 6. Cards (15 min)

- Each phone protects its key with the passkey, then offers the identity card: print it (to the printer, not as a file), cut it out, keep it apart from any SeedQR card.
- Anyone who can't print here prints it at home from their Profile, soon.

## 7. First steps (10 min)

- Everyone adds their test wallet address (Mycelium Testnet) on the home page's **Add your bitcoin address** card: the DAO's first badge.
- **Pin the DAO id** (last step of the day): a council member opens the Council page, taps the **Pin the DAO id** task, and commits the id to `config/dao.json` from the GitHub link; the same id goes to whoever pins the relay, with the ids of the other DAOs still on it ([guide 4.1](../guide.md#41-pinning-the-dao-id)). Once the site rebuilds, the task disappears; no phone should show **Wrong DAO id**.
- A first proposal, or a vote, if there is time: **Share in the group** sends it round.

## After

- [ ] The DAO id pinned in `config/dao.json` on the day, and the relay pinned with every DAO still on it (checklist F).
- [ ] Unused cards shredded; the cards' PDF deleted.
- [ ] A news post on byob.zone, with photos.
