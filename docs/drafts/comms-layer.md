# Comms layer: calls for DAO meetings (design draft)

22 November 2026 · **design discussion, not yet built.** Not a mainnet launch condition: nothing here goes in MAINNET-READINESS.md.

Related: [meeting protocol](meeting-protocol.md) (section 8, minute-taking), [decisions](../decisions.md) (Chat group row), [action gateway](action-gateway.md) (per-DAO infrastructure, exit test).

---

## 1. Decided

- **WhatsApp is fine for mainnet launch.** Calls carry no keys and no money; the treasury, votes and record do not depend on them. Each DAO names its chat group in `config/dao.json` as today.
- **NCC (Nostr Comms for Communities) is the future comms layer** for btc-dao DAOs, once it is ready. Not on the mainnet critical path.

---

## 2. Three layers

A DAO meeting with remote members touches three layers, each with its own level of sovereignty:

| Layer | Now | Leaks | Later |
|---|---|---|---|
| **Call** | WhatsApp (Desktop on the meeting laptop) | Audio end-to-end encrypted; Meta sees metadata (who, when, how long) and members' phone numbers | Signal (interim, optional) → NCC |
| **Minute pipeline** | Meetily + Parakeet + Ollama on the laptop ([meeting protocol](meeting-protocol.md) 8.1) | None, when cloud providers are unset; Windows telemetry set to minimum | No change |
| **Record** | The DAO's own Nostr relay | Public by design: only what the DAO chooses to post | No change |

Only the call layer still depends on an outside platform. The phone number is the main cost: btc-dao members are pseudonymous, and a WhatsApp group ties each one to a number.

---

## 3. Why NCC

- **Same identity:** members call by Nostr key, not phone number, as they already sign in (Amber, NIP-05). Pseudonymity holds through the call.
- **Same architecture:** a single-file webapp, Nostr presence board, peer-to-peer WebRTC audio, no central server: per DAO, nothing shared.
- **Same minute pipeline:** NCC runs in the laptop's browser, so the call plays through the speakerphone and Meetily records it as it does WhatsApp.

---

## 4. Interim option: Signal

A drop-in swap with the same laptop and speakerphone: end-to-end encrypted group calls on Signal Desktop and far less metadata. Still needs a phone number to register (usernames can be shown instead). Optional: a DAO may move to it before NCC, by its own choice.

---

## 5. What others have built (research, 22 November 2026)

Signalling calls over Nostr is solved many times over; the hard part is getting audio through home routers and mobile networks, and everyone who does it reliably uses **TURN**.

| Project | What it does | Relevance |
|---|---|---|
| 0xchat | 1:1 encrypted audio/video calls, signalling over Nostr with NIP-100, media via ICE servers | Use NIP-100 rather than a new signalling format |
| bloop | Ring over a Nostr relay, voice through a TURN relay | Almost NCC's design; TURN sees only encrypted packets |
| Amethyst | Nostr-signalled voice calls (Android) | Reference implementation others study |
| voistr | Experimental Nostr softphone, multi-peer rooms (Linux) | Room handshake over Nostr |
| Corny Chat | Audio rooms built on Jam; npub roles, private and passphrase rooms; public instance cornychat.com | Ready to use now: the trial for meeting #3 |
| Nests | Nostr for rooms, chat and presence; one MoQ audio server is the only backend; rooms can name their own audio server (kind 10112) | The model for a per-DAO audio server |

Direction among Nostr developers: mesh for tiny rooms, a forwarding audio server (SFU) for real rooms; NIP-53 kind 30312 for interactive rooms.

### 5.1 The three pieces of a group call

| Piece | Job |
|---|---|
| Room and identity | Who is in the room, roles, access |
| Audio server | Receives each person's audio and forwards it to the others: what makes a 10-person meeting work |
| TURN | Gets a device through a blocking network (4G, strict WiFi) to the audio server or another person |

### 5.2 TURN on Cloudflare

Cloudflare Realtime offers managed TURN (free STUN; 1,000 GB a month free, shared with its SFU, then $0.05 per GB). Voice meetings stay far inside the free tier. It sits beside the DAO's relay and chain gateway on Cloudflare; **coturn, self-hosted, is the exit** (a known second provider), per the action gateway's exit test.

---

## 6. Test sequence

One new thing per meeting. WhatsApp is the call layer in practice; #3 and later run only if WhatsApp causes a real problem.

| Meeting | Call layer | Audio server and TURN | New thing tested |
|---|---|---|---|
| **#2** | WhatsApp: remote members on their phones, the meeting laptop on WhatsApp Desktop | WhatsApp's | Agenda template, Meetily minute (MT-1) ([run sheet](../workshop/second-meeting.md)) |
| **#3 (optional)** | Corny Chat, protected room, council as moderators by npub | Corny Chat's (the operator's) | Group call on Nostr identity, real networks ([run sheet](../workshop/third-meeting.md)) |
| **Future** | The DAO's own room | The DAO's own audio server (Nests-style) + Cloudflare TURN | All three pieces owned by the DAO |

- **Meeting #3 is for routine business only:** on a public instance the audio passes through the operator's server.
- **Before the future meeting, a 10-minute TURN check on its own:** one phone on 4G, one on WiFi, both reaching the DAO's audio server with TURN on. A failed meeting then points at one cause.

---

## 7. NCC: work list (revised)

State as of November 2026: on hold as a separate project. Amber NIP-46 sign-in and 1:1 audio on the same network work.

1. **Signalling:** adopt NIP-100 for 1:1 calls (interoperable with 0xchat) instead of NCC's own format.
2. **TURN required:** Cloudflare TURN as the first adapter, coturn as the exit; an Operator holds the credentials.
3. **Meetings through an audio server, not mesh:** a per-DAO Nests-style MoQ relay (or LiveKit), listed on Nostr. Whether Cloudflare's MoQ relays can serve this is to check.
4. **Membership check:** only keys in the DAO's roster can join a DAO room.
5. **Meeting link:** a fixed meeting ([meeting scheduler](meeting-scheduler.md)) opens the DAO's room from the app.
6. **Tests:** the sequence in section 6; MT-0 ([meeting protocol](meeting-protocol.md) 8.3) repeated on each new call layer.

---

## 8. Open questions

- Is NCC developed inside the Bitcoin-DAO organisation, or kept as a separate project that btc-dao DAOs use?
- Build NCC's meeting side, or adopt Nests (self-hosted per DAO) and keep NCC for 1:1 calls?
- Whether the DAO's chat group (text) also moves to Nostr, or only calls.
