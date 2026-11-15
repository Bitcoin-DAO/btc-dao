# Badges (proposal)

Status: proposal, 15 November 2026. Not part of the protocol yet. Members' badges first, after ALPHA DAO's founding; council badges to be decided after ALPHA has run some rounds.

A badge says that someone has done one of the things a DAO depends on. Every badge here is **computed from the DAO's own record**, by the same code that counts votes and checks rounds: nobody issues a badge, approves one or can fake one, and any phone can check it. Badges carry no votes, no rank and no say: every member counts the same (protocol 3.3).

The two tiers differ on purpose:

| | Members | Council |
| --- | --- | --- |
| Identity | anonymous: the DAO's own key, one per DAO (protocol 1.4) | the same, plus an optional link to a personal Nostr key (npub) |
| Where badges count | in the DAO only | in the DAO, and anywhere the council member links them |
| Purpose | learning by doing | a portable track record, for DAOs electing a council |

## 1. Members: learning by doing

Each badge is one task done for real in the DAO. Together they are what a member does; a member who has all four has used every part of the DAO a member uses. Shown on byob.zone as "Learning by doing", and planned for the member's Profile page in the app.

| Badge | Task | Earned when the record shows | Protocol |
| --- | --- | --- | --- |
| 1. Wallet | Add your bitcoin address to your profile | a valid standing payout address of theirs (a `dao.confirm` with no `e` tag) | 4.2 |
| 2. Voice | Cast a vote on an open proposal | a vote of theirs counted in the valid tally that settled a proposal | 4.3, 4.4 |
| 3. Proposer | Publish a proposal, even a small one | a proposal of theirs taken into the numbering, whatever its outcome | 4.1 |
| 4. Builder | Claim a bounty, deliver it, report it | a bounty they were chosen for, their report, and a tranche paid to them in a paid round | 4.6 |

Notes:
- **Wallet** shows that a member has given the DAO a valid address for its network, not that they hold its keys. Builder proves that: their first payout arrives there. The app's own checks apply: the signer must be a member, the address valid for the network and not a treasury address.
- **Counted, not just cast:** Voice needs a vote that a valid tally counted (4.4), so a vote sent after the close, or from a non-member, earns nothing.
- **Each badge is per person,** not per key: a member whose key was replaced (5.2) keeps what they earned.
- **Privacy:** members' badges are shown inside the DAO, beside the member's DAO name. Outside it (byob.zone) only totals are shown, such as "12 of 15 members have a wallet", never who.

**Rewards.** On byob.zone each badge carries "+ [n] sats". The reward is an ordinary bounty, so it goes through the DAO's own rules: the DAO votes a "badge bounties" payout once, with the amount per badge; a member who holds a badge claims it; the council pays it in a round like any other. No new money rules are needed.

Open questions:
- Should Wallet stay once earned, or show only while an address is in force (it ends when withdrawn, on leaving or with a new key, 4.2)?
- Should the badge bounty be paid once per member and badge, enforced by the app, or left to the council's judgement on each claim?

## 2. Council: a portable record

A council seat is a role of trust, and today that trust starts from zero in every DAO. A council member who chooses to can link their seat to a personal Nostr key, so that what they did there can be read by other DAOs: "co-signed 40 rounds across 3 DAOs, handed over a treasury twice".

### 2.1 Link, don't log in

Council members keep using the DAO's own key in the app. They do not sign in with their personal key, because:
- one personal key would then carry every DAO they serve, so a loss or leak would reach all of them at once;
- every DAO action would need an outside signer app, one more moving part in the most sensitive role.

Instead they publish a **link**, signed by both keys, once:
- `dao.link` (proposed kind 3593), signed by the **DAO key**: tags `D` (the DAO id), `p` (the personal key); content `{}`.
- its counterpart, signed by the **personal key**: tags `D`, `p` (the DAO key), and the DAO's site and relays, so that any reader can find the DAO's record from the personal key alone.

A link counts only with both halves. It is offered to council members only; members stay anonymous.

**Unlinking:** a later `dao.link` with `{"unlinked": true}` stops events after it being attributed. What came before stays public: Nostr cannot reliably delete, so linking is in effect permanent for that DAO, and the app must say so plainly before the member signs.

### 2.2 Council badges

Computed from the linked DAO's record, by any app or by byob.zone, the way the pulse is computed:

| Badge | Earned when the record shows |
| --- | --- |
| Founding council | on the council in the founding settings (3.1, 3.4) |
| Keyholder | their treasury key's verified signature used in a paid round (6.1–6.3), counted: "signed 12 rounds" |
| Handover | signed a round that moved the treasury to a new council's wallet (6.6) |
| Recovery | had a lost or replaced treasury key changed through the council rules, with the treasury moved (6.5, 6.6) |

A reader sees each badge **with its context**: the DAO's age, its number of members, its treasury and how much its rounds paid, so that "12 rounds in a 3-member DAO holding 5,000 sats" reads differently from a large, long-running one.

### 2.3 Things to weigh

- **Safety.** A public key tied to "holds a key to a treasury of X sats" makes a person a target, on mainnet above all. Linking comes with a plain warning; a pseudonymous personal key is fine: the track record matters, not a real name.
- **Honest records.** Linking a DAO links everything in it, a removal from the council included. A member can choose which DAOs to link, so readers still judge for themselves.
- **Gaming.** A few people can found a small DAO to collect badges. Context (2.2) is the answer: the badges are true, and what they are worth is visible.

### 2.4 To build it

- protocol: the two link events (2.1) and the council badge definitions (2.2);
- the app: "Link your record" on a council member's Profile, signing the personal half through an outside signer (Amber, a browser extension or a remote signer), with the warnings above;
- a reader: given a personal key, find its links, read each DAO's record, recount the badges; first on byob.zone, later inside the app when a DAO votes on a council change.
