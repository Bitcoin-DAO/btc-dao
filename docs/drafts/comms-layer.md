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

## 5. NCC: work list before it can replace WhatsApp

State as of November 2026: on hold as a separate project. Amber NIP-46 sign-in and 1:1 audio on the same network work.

1. **Calls across networks** (WiFi to 4G): needs a TURN relay. A TURN relay is a server, so it becomes one more per-DAO piece of infrastructure beside the relay and the chain gateway, with the exit test (a known second provider) and an Operator holding its credentials.
2. **Group calls:** peer-to-peer mesh audio holds a handful of people. A meeting of ten or more needs a mixing or forwarding server (SFU), or a cap on remote participants. Design question: what size of meeting a btc-dao DAO actually holds.
3. **Membership check:** only the DAO's members and council (by their keys in the roster) can join a DAO call; others are filtered, as Discussion filters non-members' posts.
4. **Meeting link:** a fixed meeting ([meeting scheduler](meeting-scheduler.md)) opens the DAO's NCC room from the app.
5. **Tests:** a 1:1 call across networks; a meeting-sized call with the room on the speakerphone and remote members on phones; test MT-0 ([meeting protocol](meeting-protocol.md) 8.3) repeated with NCC in place of WhatsApp.

---

## 6. Open questions

- Is NCC developed inside the Bitcoin-DAO organisation, or kept as a separate project that btc-dao DAOs use?
- TURN: self-hosted per DAO, or a free-tier service as a first adapter?
- Whether the DAO's chat group (text) also moves to Nostr, or only calls.
