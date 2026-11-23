# ALPHA DAO: the founding proposals

Five proposals that follow the founding day. Each sets one part of how the DAO works, each is made by a different member (so each earns **Proposer**), and together they let every member earn every badge with money the DAO raised itself.

Status: plan, 23 November 2026. For [the second meeting](second-meeting.md), item 3 (Proposals and treasury). Needs **v0.9.8** for proposal 2 (dues as rules); the other four run on the current build.

## The set

| # | Proposal | Type | Sets | Badges it opens |
|---|---|---|---|---|
| 1 | Live votes | `change_rules` | How long members have to vote | none extra |
| 2 | Membership dues | `change_rules` | How the DAO is funded | Paid-up, for each member who pays |
| 3 | How we meet | `statement` | The off-DAO protocol | none extra |
| 4 | First bounty | `payout`, bounty | That the DAO pays members for work, and how | Builder, for whoever delivers |
| 5 | A new member | `add_member` | That the DAO grows by the normal route | the new member starts their own path |

Live votes was added last (23 November 2026) but runs first. Every member votes on all five: **Voice** counts a vote only when a valid tally counts it.

## Order and timing

- **1** is published at the second meeting, while ALPHA DAO still has its founding-day practice votes (10 minutes). The room watches the whole cycle at the table: publish, vote, close, tally, and the council confirming the new rules version. From then on votes last 3 days.
- **2 and 3** are drafted in Discussion before the meeting and published **after** 1 is in force, so they run as live 3-day votes and remote members have time to vote. Published under practice rules, they would close in 10 minutes.
- **4** is published once dues are in force, so the bounty is paid from dues. It can be drafted meanwhile.
- **5** follows 2: a candidate should know the dues before joining.
- Several proposals can be open at once. A proposal keeps the voting period in force when it was published.

**Dues are in force** only when proposal 2 has passed, been tallied, and the council has confirmed the new rules version. Members pay after that, not before: an early payment does not count.

## 1. Live votes

**Proposer:** a member who is not the organiser.

- **Title:** Live votes: 3 days
- **Type:** rule change: *Voting period* from 10 minutes to 3 days
- **Summary (draft):** From now on every vote lasts 3 days, so members who are not at a meeting have time to read, discuss and vote. The founding day's 10-minute votes were for trying everything in one sitting.
- **Majority:** a rule change needs two thirds (`twoThirdsMajority` includes `changeRules`), with the quorum met.
- **At the table:** once it closes, a council member publishes the tally and the council confirms the new rules version (2 of 3 signatures). The proposal page then shows the rules in force.

## 2. Membership dues

**Proposer:** a second member.

- **Title:** Membership dues: [amount] sats a month
- **Type:** rule change, two changes in one proposal: *Membership dues* from — to [amount]; *Dues period* from — to Every month
- **Summary (draft):** Every member pays [amount] sats each month to the treasury, from the wallet that holds their standing address (the address on their profile). The dues fund the DAO's own work, starting with the first bounty. Paying earns the Paid-up badge.
- **Amount, for ALPHA DAO:** small enough that the testnet treasury can supply every member (for example 10,000 sats), large enough to fund one bounty from a few members' dues. Mainnet dues are a separate decision, in sats, discussed at a meeting with the euro cost in view.

After it is in force: each member gets tBTC at their standing address (a faucet, the BTC DAO Testnet Treasury, or the peer-to-peer rehearsal: [MAINNET-READINESS](../../MAINNET-READINESS.md) section 10) and pays the dues from that coin.

## 3. How we meet

**Proposer:** a third member.

- **Title:** How we meet
- **Type:** statement
- **Summary (draft):** The members meet [monthly, on the first (day) at (time)], in [place], with remote members on the group call. The meeting follows the agenda template: every item is read, and silence means no business on it. The chair rotates. The minute, read back and corrected at the end, is posted to the record and is the DAO's account of the meeting.
- **Link:** [meeting protocol](../drafts/meeting-protocol.md)

A statement binds nobody's money, but it makes the meeting the members' decision rather than the organiser's.

## 4. First bounty

**Proposer:** a fourth member.

- **Title:** Bounty: [task]
- **Type:** payout, bounty (open recipient), paid on completion, one tranche; report requested
- **Amount:** no more than the dues paid in so far.
- **Candidates for the task** (real items from the roadmap):
  - Italian version of [How members get sats](../getting-sats.md) (`NEXT-RELEASE.md` L).
  - Agent rehearsal, step 1 (readiness section 10): a small task for a member recipient that needs no real fiat.
- **Summary (draft):** [Task], delivered as [what counts as done]. Paid on completion to the member who claims and delivers it. Funded from members' dues.

The member who claims, delivers and is paid earns **Builder**. Council members may claim this one; the rule that council members are not Agents applies only to Agent tasks.

## 5. A new member

**Proposer:** a fifth member, as sponsor, from their Profile (*Propose a new member*).

- **Who:** someone who was not at the founding day, so onboarding is tested on a newcomer. Joining remotely is fine: two council members check their short code on video calls.
- **Before the proposal:** the sponsor tells the candidate the dues and the meeting rhythm (proposals 2 and 3), and the candidate signs up and adds their address (**Wallet**).
- **After the vote:** the new member pays dues (**Paid-up**) and votes on the next proposal (**Voice**).

If ALPHA DAO has fewer than five members besides the organiser, the organiser proposes one, and if needed a member proposes two. Proposer is earned once; the rest still count as the DAO's business.

## What the set leaves out, on purpose

- **Charter modules:** no change to the charter in the founding set. A charter change needs a charter-change flow in the app (the charter text is built into the site), which is not built.
- **Treasury cap and payout cadence:** already set at founding and editable at any time; a sixth proposal if a member wants one.

## After the set

Tick in the run log of the meeting that follows:

- [ ] Live votes in force: proposal 1 voted, tallied and confirmed at the second meeting
- [ ] Five proposals published, five different proposers (or as many as there are members)
- [ ] Every member voted on all five
- [ ] Dues in force (rules version confirmed by the council)
- [ ] Each member's dues paid from their standing address
- [ ] Bounty claimed, delivered and paid in a round
- [ ] New member voted in and member list version confirmed
