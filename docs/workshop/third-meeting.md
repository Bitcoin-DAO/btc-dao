# ALPHA DAO third meeting: run sheet (outline)

The second run of the [meeting protocol](../drafts/meeting-protocol.md), and the first meeting on a Nostr call layer: **Corny Chat** in place of WhatsApp ([comms layer](../drafts/comms-layer.md) section 6). The agenda, minute-taking and posting stay as at the [second meeting](second-meeting.md), so the call layer is the only new thing.

Status: **optional**, 22 November 2026. WhatsApp is the call layer; run this only if WhatsApp causes a real problem.

## Goals

1. Hold the whole meeting on Corny Chat, with council moderators by npub and remote members on real networks (home WiFi and 4G).
2. Record and minute it with the same local setup as meeting #2 (Meetily on the T480), and compare.
3. Decide whether a Nostr call layer is good enough to replace WhatsApp for meetings.

**Routine business only:** on the public instance the audio passes through the operator's server.

## Roles

As at meeting #2: chair (rotated), laptop keeper, by-hand minute-taker. The laptop keeper also owns the Corny Chat room.

## Sign-in: what Corny Chat supports

Members join in their phone's **web browser** (no app): open the room link, allow the microphone, talk. Corny Chat's project page lists three sign-in methods: a **NIP-07 browser extension** (laptops; most phone browsers have no extensions), **pasting an nsec**, and **anonymous login**. It does not mention NIP-46 or Amber.

**Rule: never paste the nsec used for the DAO** into Corny Chat or any third-party site.

Chosen for this meeting (option 3, mixed):

- **Council members** sign in on laptops with a NIP-07 extension and are set as moderators by npub.
- **Everyone else** joins on their phone with **anonymous login** and the room passphrase, under the display name they use in the DAO.
- If the live site turns out to support Amber / NIP-46, members may use that instead.

## Before the day

- [ ] Check the live sign-in options on cornychat.com (the project page may be behind the site); note them in the run log.
- [ ] Room created: **private**, **passphrase-protected**, council members set as moderators by npub. Passphrase sent in the group chat, not posted publicly.
- [ ] Each council member has tried the NIP-07 sign-in on their laptop once; each remote member has opened a test room on their phone once.
- [ ] Short practice call (10 min): the laptop keeper on the T480, one remote member on 4G. Meetily records both voices (repeat of MT-0 on the new call layer).
- [ ] WhatsApp group kept as the fallback: if Corny Chat fails, switch, and note when and why.

## Setting up (30 min)

- [ ] T480 on mains, speakerphone set as microphone and speaker in Windows **and in the browser** (site permissions for cornychat.com).
- [ ] Corny Chat open in the laptop's browser, signed in, room joined; the room is on the speakerphone.
- [ ] Remote members join; each confirms they hear the room and are heard.
- [ ] Meetily: Microphone + System Audio; 30-second test recording shows both voices once each.

## The meeting

The same agenda as [meeting #2](second-meeting.md), with the break before Close for the minute.

## What to record (run log)

`docs/runs/2026-xx-alpha-dao-meeting-3.md`:

- Sign-in: which methods the live site offers; how many joined without help; council NIP-07 sign-in on laptops; anonymous joins on phones.
- Networks: who was on WiFi, who on 4G; any drop-outs, echo or delay, and when.
- Fallback: whether WhatsApp was needed, and why.
- Minute: transcript quality compared with meeting #2; summary time; corrections at read-back.
- Verdict: Corny Chat good enough for routine meetings? What a DAO's own audio server (the future stage) must do better.
