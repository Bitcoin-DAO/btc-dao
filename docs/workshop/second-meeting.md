# ALPHA DAO second meeting: run sheet (outline)

The first ordinary meeting after the founding day, and the first full run of the [meeting protocol](../drafts/meeting-protocol.md): the workshop is the meeting, and the agenda template is the business of the day. It also runs minute-taking test **MT-1** (protocol 8.3).

Status: outline, 22 November 2026. Optional later: [meeting #3](third-meeting.md), on Corny Chat. Date, chair and members to be fixed with the [meeting scheduler](../drafts/meeting-scheduler.md) or the group chat.

## Goals

1. Run the agenda template once, item by item, including the "Not yet" line and the silence rule.
2. Do at least one *do* item at the table (a vote, a signing or a vouching in): the live votes proposal, from publishing to the council confirming the new rules version.
3. Produce the first minute with the local AI setup, check it against a by-hand minute, and post it.

## Roles

- **Chair:** not the organiser, if possible (the chair rotates from the first meeting). Reads each item, pauses about ten seconds, names remote members on items with business.
- **Laptop keeper:** runs the call and Meetily, watches the recording, generates the minute in the break.
- **Minute-taker by hand:** fills in the printed agenda in parallel, for MT-1.
- **Council members:** at least two of the three, in the room or on the call, to confirm the live votes rules version; they bring their SeedQR cards if a round is to be signed.

## Kit

- [ ] Lenovo ThinkPad T480 (Windows 11 Pro, 32 GB RAM), on mains power, sleep set to never, BitLocker on.
- [ ] USB conference speakerphone.
- [ ] WhatsApp Desktop on the laptop, signed in, with the group's call. Remote members join on their phones; the call in the room runs on the laptop, not on a phone, or Meetily hears only the room.
- [ ] Meetily, Parakeet model and an Ollama 7–8B model installed; the agenda template loaded; no cloud provider or API key set.
- [ ] One SeedSigner and the council's SeedQR cards, if signing.
- [ ] Printed agendas: one for the chair, one for the by-hand minute-taker.

## Before the day

- [ ] **MT-0 dry run** done at home (protocol 8.3), summary time noted. If over 15 minutes, plan a longer break or try a smaller model.
- [ ] Check Device Manager on the T480 for an NVIDIA GPU (some T480s have an MX150).
- [ ] Drafts for the meeting posted in Discussion, so the chair can read them out: [founding proposals](founding-proposals.md) 1 (live votes), 2 (dues) and 3 (how we meet), each by a different member.
- [ ] ALPHA DAO running v0.9.8 or later (dues as rules).

## Setting up (30 min)

- [ ] Speakerphone in the middle of the table, set as microphone and speaker (system and WhatsApp).
- [ ] Call started on the laptop; a remote member confirms they hear the room, and the room hears them.
- [ ] Meetily: Microphone + System Audio selected; a 30-second test recording shows both voices.
- [ ] The DAO's site open on the laptop and a phone.

## The meeting

| # | Item | Expected at this meeting |
|---|---|---|
| 0 | Opening | Recording announced; members say their names; who's in the room, who's remote |
| 1 | Record | Site, relay and record working; unauthorised spends: 0 |
| 2 | Members | Badges earned since the founding; who still needs to try a part of the DAO |
| 3 | Proposals and treasury | The [founding proposals](founding-proposals.md): **live votes** published, voted (10 minutes), tallied and confirmed by two council members at the table; then dues and how we meet published as 3-day votes; the bounty and a new member planned; any open votes; a payout round signed at the table if one has passed |
| 4 | Council and keys | Recovery and card storage checked (first cycle) |
| — | "Not yet" | Read as one line: "Not yet: Operate, Trade" |
| 7 | Mainnet | What stands between ALPHA DAO and mainnet |
| 8 | Lineage | Likely no business: said, minuted |
| 9 | Rules | Is the agenda itself right? Changes noted for the next draft |
| — | **Stop recording, break (15 min)** | Laptop keeper generates the minute |
| 10 | Close | Minute read back and corrected; next meeting fixed; minute posted |

## After

- [ ] Minute posted to the record (format per protocol 7: for now a `dao.post` in a "Meetings" thread).
- [ ] Audio and transcript deleted from Meetily.
- [ ] Run log written: `docs/runs/2026-xx-alpha-dao-meeting-2.md`, with the summary time, model, the number of corrections at read-back, AI minute vs by-hand minute item by item, and what to change in the template or the protocol.
