# Use-case kits: one core, four starting points (design draft)

23 November 2026 · **design discussion, not yet built.** Nothing here changes `protocol.md`. Kits are settings and charter selections; the three open questions in section 5 are the only parts that could touch the protocol, and each needs its own draft before it does.

Related: [funding models](../funding-models.md), [charter modules](../charter-modules/README.md), [member loans](member-loans.md), [payments and accounts](payments-and-accounts.md), [action gateway](action-gateway.md) (Agents, email, fiat bridge), [meeting protocol](meeting-protocol.md).

---

## 1. The question

Can btc-dao become the default tool for four kinds of group: a **family**, a **building** (shared occupation), a **community group or association**, and a **co-op or small business** (for example market traders)? Do they need their own builds, or is the core enough with different branding and examples?

**Answer:** neither extreme. One core, unchanged. A **kit** per use case: a bundle of default settings, charter modules and suggested modules chosen at fork time. No kit has code of its own, and no module is built for one kit only. Three open questions (section 5) are real design decisions, not kit settings.

## 2. What "default tool" means here

For all four groups the competitor is not another DAO. It is a group chat plus one trusted person holding the money in their own bank account, maybe with a spreadsheet. The pitch is the same for every kit:

- **No single treasurer.** The money needs more than one key to move.
- **A record nobody can quietly edit.** Every decision and payment is in the DAO's history.

The shared obstacle is also the same: money arriving in fiat, and payees who only accept fiat. The Agent fiat bridge (action-gateway section 3.4) matters more to adoption than anything kit-specific.

## 3. Layers

| Layer | What it is | Changes per kit? |
|---|---|---|
| **Core** | Proposals, members and council, PSBT treasury, payout rounds, discussion, DAO history, funding model | No |
| **Kit** | Default `rules` values, council size and threshold, funding model, charter modules, suggested modules, example proposals and wording | Yes: this is the kit |
| **Modules** | Optional features any DAO can switch on: recurring contributions, email, accounts and invoicing, Agents and fiat bridge, marketplace and escrow, member loans, meeting protocol, Purse | Kits suggest different bundles |

A kit is a starting point. Every value in it can be changed at founding, or later by a rules vote, like any other DAO.

## 4. The four kits

Values are suggestions for discussion, not decisions.

| | Association | Co-op / traders | Building | Family |
|---|---|---|---|---|
| **Typical size** | 5–50 members | 3–15 members | One member per household or unit | 3–10 members |
| **Council** | 2-of-3, growing to 3-of-5 | 2-of-3 | 2-of-3 | 2-of-3 |
| **`votingPeriodDays`** | 7 | 3 | 7 | 7 |
| **`payoutRound`** | monthly | weekly | monthly | monthly |
| **`fundingModel`** | `mutual` (dues) or `grant` | `production` | `mutual` (service charge) | `mutual` |
| **Charter modules** | Council handbook, Conduct, Use of funds | Council handbook, Use of funds, Member assets | Council handbook, Use of funds, Council eligibility (one key per household) | Council handbook (death or incapacity matters most) |
| **Suggested modules** | Email, Accounts, Meeting protocol, GRANTS DAO link | Accounts and invoicing, Marketplace and escrow, Member loans, Agents, Purse | Recurring contributions, Agents (contractors), Accounts | Recurring contributions |
| **Dashboard** | Listed | Listed | Not listed | Not listed |
| **Fits the core today** | Almost entirely: ALPHA DAO is this kit | Mostly; needs the Purse (5.2) | Mostly; needs 5.3 | Needs 5.1 |

### 4.1 Association

The closest fit. Dues in, events and projects paid out, outward contact by email, decisions made at the meeting. Grant funding comes through the GRANTS DAO. Nothing new is needed. **This is the reference kit**, built from ALPHA DAO's founding.

### 4.2 Co-op or small business (market traders)

Shared costs (stall fees, a van, a bulk order), income from sales, payouts to members. Marketplace and escrow (members' offers as proposals, the treasury holding buyers' payments) and member loans (prestito sociale) are already sketched. Invoicing and Accounts give the BTC-only paperwork. The weak point is speed: see 5.2.

### 4.3 Building (shared occupation)

A shared fund for repairs and running costs, topped up by regular contributions, paying contractors through Agents because contractors want fiat. Membership follows occupancy, so joining and leaving happen whenever someone moves in or out: offboarding must be routine, not an exception. Voting weight is open: see 5.3.

### 4.4 Family

A shared pot with a long horizon: a holiday fund, care for a relative, savings across generations. Regular contributions in, rare payouts. Its two needs are not features. The record must not be public (5.1), and the council must survive the death of a keyholder, which the council handbook module and council change already cover but which a family will test for real.

## 5. Open questions (not kit settings)

### 5.1 Visibility

Today transparency is a protocol principle: every event goes to public relays, and the dashboard switch governs listing only (protocol 7.2). Most families, and many buildings, will not accept a public record with names and votes.

Options:

1. **Accept it.** btc-dao is for groups that want to be seen; the Family kit is dropped and the Building kit carries a clear warning.
2. **Members-only mode.** Event content encrypted to a DAO key that every member holds; relays store ciphertext. The treasury stays readable on chain to anyone with the descriptor, so the descriptor would no longer be published either.
3. **Own relay only.** Events go only to the DAO's own relay with read access limited to members. Simpler, but loses the public relays as backup, which the domain-loss recovery depends on.

This touches the event format, so it should be decided **before** the NIP is written. Until then, the Family kit stays a draft.

### 5.2 Operational spending

A 3-day vote before buying stall supplies does not survive a market day. A business needs a standing budget: "up to X sats a week for supplies, without a vote".

Leaning: **the Purse is the answer.** A proposal approves an allowance into the Purse; day-to-day spending happens there, and the Purse's balance and spending are reported back to the record. That keeps "every spend from the treasury needs a vote" intact and makes the Purse a requirement for the Co-op kit, not only a later convenience.

### 5.3 Vote weighting

Buildings often vote one per unit, or by share of ownership. Co-ops vote one member, one vote; so do associations and families. Token weighting stays out of scope.

Options:

1. **One member per unit.** The Building kit makes each household one member: the household chooses who holds the identity key. No protocol change.
2. **A per-member weight.** One optional number on the roster entry, used in tallies. Light, but it is a protocol change and needs its own draft.

Leaning: option 1 first; option 2 only if a real building asks for it.

## 6. Shared modules this draft depends on

| Module | Status | Kits |
|---|---|---|
| Recurring contributions (member standing orders) | Idea (10 Nov 2026), no draft yet | Building, Family, Association |
| Email | Drafted (action-gateway), Resend tested | Association, Co-op |
| Accounts and invoicing | Drafted (payments-and-accounts) | Co-op, Association, Building |
| Agents and fiat bridge | Drafted (action-gateway 3.4) | Building, Co-op |
| Marketplace and escrow | Idea (13 Nov 2026), no draft yet | Co-op |
| Member loans | Drafted (member-loans) | Co-op, Association |
| Meeting protocol | Drafted, first test at ALPHA DAO | All |
| Purse (Lightning) | Idea; "own the operator" options noted | Co-op (required), others later |

**Recurring contributions** appears in three of four kits, so it is the next module worth drafting.

## 7. Legal position (for every kit)

An unwrapped DAO runs **beside** a legal structure, not instead of it. Two cases need saying plainly in the kit text:

- **Building:** where the law requires a formal body (for example an Italian condominio above a certain size must have an administrator and hold assemblies), the DAO is the shared fund and decision record, not the legal body.
- **Co-op or traders:** members trading under their own VAT numbers still owe tax on their income, whether or not it passed through the DAO. Accounts should export a member's payouts in a form a bookkeeper can use.

The kit pitch is "the shared kitty and decision record", never "a replacement for the legal entity" where one is required.

## 8. Order

1. **Association:** written from ALPHA DAO's founding and first meetings. No new build.
2. **Co-op:** forces the Purse decision (5.2) and the marketplace draft.
3. **Building:** needs recurring contributions and Agents paying contractors; decide 5.3.
4. **Family:** last, after the visibility decision (5.1).

## 9. In the fork kit

When it is built, the setup wizard (spec, fork kit) opens with one question, "What kind of group are you?", offering the four kits plus "Start from scratch". The answer prefills the wizard; every value stays editable. Each kit ships as a config fragment and a charter assembled from the chosen modules, plus a page of worked example proposals for that kind of group.
