# Tiers, stages and badges (proposal)

Status: proposal, 15 November 2026. Not part of the protocol yet. Members' badges first, after ALPHA DAO's founding; council badges and the DAO tier to be decided after ALPHA has run some rounds. Numbers marked *to tune* are starting points, not decisions.

## The growth model

A DAO grows in three tiers: **members**, the **council**, and **DAOs** themselves, each new one forked from the kit. Each tier starts from a **hard minimum** (the least that is safe and still works) and grows by its own rules, never by anyone's say-so:

- a hard minimum is a floor the app enforces: below it, the step cannot be taken at all;
- every step up is visible in the DAO's record, so a badge can show it and anyone can check it;
- nothing is skipped: a DAO founded at the minimum grows the same way as any other, by vote.

Badges mark the steps. Every badge is **computed from a DAO's own record** by the same code that counts votes and checks rounds: nobody issues, approves or fakes one, and any phone can check it. Badges carry no votes, no rank and no say: every member counts the same (protocol 3.3).

| | Members | Council | DAOs |
| --- | --- | --- | --- |
| Hard minimum | a name, a key, and the DAO's verification (founding or vote) | 2 council members to found | a council of 2, on its own site |
| Grows by | doing: wallet, vote, proposal, delivered work | a council change, by vote | stages: practice → testnet → mainnet; and forks |
| Identity | anonymous: the DAO's own key (1.4) | the same, plus an optional link to a personal npub | its DAO id, and its parent if forked |
| Badges count | inside the DAO | inside the DAO, and wherever linked | on byob.zone and any dashboard |

## 1. Members

### 1.1 Stages and minimums

| Stage | Hard minimum (today) |
| --- | --- |
| Founder | signed up at the founding meeting and listed in the genesis, which the council endorses (3.5) |
| Member | sponsored, verified (one in person, or two remote checks by different council members) and voted in (4.1, 5.1) |

### 1.2 Badges: learning by doing

Each badge is one task done for real in the DAO; a member who has all four has used every part of the DAO a member uses. Shown on byob.zone as "Learning by doing", and on the member's own Profile in the app.

| Badge | Task | Earned when the record shows | Protocol |
| --- | --- | --- | --- |
| 1. Wallet | Add your bitcoin address to your profile | a valid standing payout address of theirs (a `dao.confirm` with no `e` tag) | 4.2 |
| 2. Voice | Cast a vote on an open proposal | a vote of theirs counted in the valid tally that settled a proposal | 4.3, 4.4 |
| 3. Proposer | Publish a proposal, even a small one | a proposal of theirs taken into the numbering, whatever its outcome | 4.1 |
| 4. Builder | Claim a bounty, deliver it, report it | a bounty they were chosen for, their report, and a tranche paid to them in a paid round | 4.6 |

- **Wallet** shows a valid address for the DAO's network, not that the member holds its keys; Builder proves that, when their first payout arrives there.
- **Counted, not just cast:** Voice needs a vote a valid tally counted (4.4); a vote after the close, or from a non-member, earns nothing.
- **Per person,** not per key: a member whose key was replaced (5.2) keeps what they earned.
- **Privacy:** shown inside the DAO beside the member's DAO name; outside it (byob.zone) only totals, such as "12 of 15 members have a wallet", never who.
- **Rewards** are an ordinary bounty: the DAO votes a "badge bounties" payout once, with an amount per badge; a member who holds a badge claims it; the council pays it in a round, **once per member and badge**.

**Built in v0.9.5, Home card as in v0.9.7** (`core/badges.ts`, `ui/Badges.tsx`), decided 16 November 2026:

- **An onboarding tool, shown only to the member:** a "Learning by doing" card on their own Profile, with how to earn each badge or what earned it. Not on the Members page.
- **On Home, for information:** below the donation card, the four badges and the next step, worked out at every load, until all four are earned. No buttons; the Wallet card at the top is the one thing flagged.
- **Wallet stays once earned.** If the address later lapses, the Profile says so and the Home card asks again.
- **Share in the group** from the Profile's badges card ("@anna: Voice, Proposer ✓ Learning by doing").

**Badge bounties are paid once per member and badge** (decided 16 November 2026). To build when a DAO first votes one: the bounty proposal names the badge it rewards, a claim counts only from a member who holds that badge, and the app refuses a round that pays the same person for the same badge twice, as it refuses any payout paid twice.

## 2. Council

### 2.1 Stages and minimums

| Stage | Hard minimum |
| --- | --- |
| Founding council | **2 members** (today: the founding cannot be published with fewer). 2 of 2 is allowed, with a warning that every key is then needed |
| Spare key | a council where the signatures needed are fewer than the seats (2 of 3, 3 of 5): one lost key no longer locks the treasury. Reached by a council change |
| Mainnet council | every treasury key on a SeedSigner (today: enforced by the app at founding); *proposed:* a spare key too |

A council grows only by a `change_council` vote, which moves the treasury to the new council's wallet (6.6): a 2-of-2 council can vote more members onto the council later, and raise the signatures needed as it grows.

### 2.2 A portable record: link, don't log in

A council seat is a role of trust, and today that trust starts from zero in every DAO. A council member who chooses to can link their seat to a personal Nostr key, so that other DAOs can read what they did: "co-signed 40 rounds across 3 DAOs, handed over a treasury twice".

They keep using the DAO's own key in the app; they do not sign in with their personal key, because one key would then carry every DAO they serve (a loss or leak would reach all of them at once), and every action would need an outside signer app, in the most sensitive role. Instead they publish a **link**, signed by both keys, once:

- `dao.link` (proposed kind 3593), signed by the **DAO key**: tags `D` (the DAO id) and `p` (the personal key); content `{}`;
- its counterpart, signed by the **personal key**: tags `D`, `p` (the DAO key), and the DAO's site and relays, so that any reader can find the record from the personal key alone.

A link counts only with both halves, and is offered to council members only; members stay anonymous. A later `dao.link` with `{"unlinked": true}` stops events after it being attributed, but what came before stays public: Nostr cannot reliably delete, so the app must say plainly that linking is in effect permanent for that DAO.

### 2.3 Council badges

Computed from a linked DAO's record by any app, or by byob.zone the way its pulse is computed:

| Badge | Earned when the record shows |
| --- | --- |
| Founding council | on the council in the founding settings (3.1, 3.4) |
| Keyholder | their treasury key's verified signature used in a paid round (6.1–6.3), counted: "signed 12 rounds" |
| Handover | signed a round that moved the treasury to a new council's wallet (6.6) |
| Recovery | a lost or replaced treasury key changed through the council rules, with the treasury moved (6.5, 6.6) |

Each is shown **with its context**: the DAO's age, members, treasury and what its rounds paid, so "12 rounds in a 3-member DAO holding 5,000 sats" reads differently from a large, long-running one.

To weigh: **safety** (a public key tied to "holds a key to a treasury of X sats" makes a person a target, on mainnet above all: a plain warning, and a pseudonymous key is fine); **honest records** (linking a DAO links all of it, a removal included; members choose which DAOs to link, so readers still judge); **gaming** (a small DAO founded to collect badges: the context shows what they are worth).

## 3. DAOs: forked from the kit

Every DAO is a fork of the kit: its own repository, its own site, its own record (ALPHA DAO is `byob-zone/alpha-dao`, at alpha.byob.zone). The third tier is the DAOs themselves: how a new one is founded, how it grows up, and the family they form.

### 3.1 Stages and minimums

The genesis config already names a DAO's stage (`stage`: practice, testnet or mainnet), and dashboards keep trial stages apart (7.4).

| Stage | Hard minimum |
| --- | --- |
| Practice | a council of 2, founders optional; ten-minute votes; testnet4 |
| Testnet | the same, with real vote lengths, or kept short by a rules vote |
| Mainnet | today: every treasury key on a SeedSigner. *Proposed* (checked by the app before a mainnet founding, and shown on byob.zone): a site of its own (review I-1), its relay pinned to its DAO id, a council with a spare key, and a trial behind it (below) |

A DAO moves up a stage by being **founded again** at the next stage, as UNO did: the new DAO lists the earlier one's members as founders, so no one is voted in again (3.5). Each stage is its own DAO, with its own id and record; the earlier one can then close.

*Proposed* trial before mainnet, *to tune*: at least one month on testnet, at least one council change, and at least three payout rounds paid, so the council has signed, recovered and handed over before real money is at stake.

### 3.2 Forks and lineage

*Proposed:* an optional `parent` in the genesis config, naming the DAO it was forked from (a DAO id), with the parent's site and relays. It records lineage only: the parent has no say over the child, and the child inherits nothing but the record of where it came from.

- a DAO founded **at the next stage** names the earlier stage as parent (UNO testnet → UNO mainnet);
- a DAO founded **by members of another** names it (a group from ALPHA DAO founds BOSA DAO);
- byob.zone shows the family: each DAO with its stage, its parent and the DAOs forked from it.

Forking is also the exit: members who disagree with their DAO can found their own, taking their record with them (their council badges are portable, 2.2), without asking anyone.

### 3.3 DAO badges

Shown on byob.zone beside each DAO's pulse, computed from its record:

| Badge | Earned when the record shows |
| --- | --- |
| Founded | an endorsed genesis (3.1) |
| First payout | a payout round paid (6.3) |
| Spare key | a council with fewer signatures needed than seats |
| Grown | a council change passed and its treasury moved (6.6) |
| Learning | every member holds the Wallet badge (1.2) |
| Parent | another DAO names it as parent (3.2) |
| Mainnet | a mainnet DAO meeting the minimums in 3.1 |

### 3.4 To build

- protocol: `parent` in the genesis config; the two link events (2.2); the badge definitions above;
- the app: the mainnet checks (3.1) before a mainnet founding; "Link your record" on a council member's Profile, signing the personal half through an outside signer (Amber, a browser extension or a remote signer);
- byob.zone: members' badge totals and DAO badges in each DAO's pulse; the family of DAOs; a reader for linked council records.
