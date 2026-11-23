# Draft: the action gateway (modules, Operators and Agents)

17 November 2026 · **design discussion, not yet built.** Nothing here changes `protocol.md` until a later draft names the events and rules. Development and testing on ALPHA DAO (testnet4) once it is founded; its founding workshop runs on the current build. Agent tasks and the fiat bridge (3.4) come first, before mainnet (`NEXT-RELEASE.md` L).

Not to be confused with the **chain gateway** ([`chain-gateway.md`](../chain-gateway.md), the `gateway/` Worker), which reads public chain services and holds no secrets.

---

## 1. Why

An outside review (Venice, November 2026) described btc-dao as a Bitcoin multisig wallet with Nostr and a dashboard: a group that can decide where to send funds. The action gateway gives that permissionless group the tools to operate in the digital and physical world (send and receive email, run its website and DNS, commission work, act on the ground) without becoming a legal person.

Every outside action follows one pattern, the one the treasury already uses:

| Step | What happens | Where it lives today |
| --- | --- | --- |
| Proposal | A typed action (send this email, publish this site update, do this task) | `dao.proposal` (4.1) |
| Approval | The DAO's rules met, checked against the current settings | `dao.vote`, `dao.tally` (4.3, 4.4) |
| Execution | Something carries the action out | **new:** a module's executor, or an Agent |
| Receipt | Proof that it happened, published to the record | `dao.receipt` (6.3) for the treasury; **new** for modules |

Three kinds of executor, with different trust:

- **Cryptographic:** the approval is the action. The treasury.
- **Custodial code:** a service credential used only after a passed proposal. Auditable, not trustless: whoever controls the account could act around it. Modules (section 4).
- **Human:** a member mandated to act. Agents (section 3).

## 2. Principles (decided)

- **Per DAO, nothing shared.** Every tool, account and credential belongs to one DAO, like its keys. No shared gateway service between DAOs.
- **Counterparties who accept bitcoin and need no legal entity.** The DAO never has to be legible to a legal system, only to the people it trades with. Banks, registries and contracts are out of scope by design.
- **Everything through the DAO pipeline:** idea → draft → discuss → proposal → vote → execution → receipt, with all members in the decision.
- **Design by function, not provider.** A module is defined by what it does (DNS, inbox, website, executor); a provider is an interchangeable adapter.
- **Rebuildable.** A module's state lives on the DAO relay, not inside the service. Losing a provider, an account or an Operator means downtime, not loss.

## 3. Roles

| Role | Holds | Does |
| --- | --- | --- |
| Member | a vote | decides |
| Council | treasury keys | signs rounds: **the council holds the money** |
| Operator | root shares of the DAO's accounts | runs infrastructure: **the Operators hold the root shares** |
| Agent | a badge and a task | carries out DAO-directed actions, paid in bitcoin, outcomes reported on the platform |

Council members are not Agents (separation of duties in practice).

### 3.1 Founding minimum

**2 council members + 1 Operator**, all three voting members.

### 3.2 Operators

- Chosen by vote. The starting default is **one badged Operator**.
- As the DAO grows, and when enough members are available for the role, it votes to expand to **three badged Operators, 2-of-3** for Operator actions.
- The number of Operators and their threshold show on the DAO's main dashboard. Count and threshold change together, and a change is flagged, as council changes are.
- **Single-Operator stage:** the root is held by one person, so collective control rests on the audit (4.5), not on cryptography; the dashboard says so plainly. If the Operator disappears, the council still controls the funds, and modules are rebuilt (2, "Rebuildable"): downtime, not loss.
- **One to three:** rebuild the root, change password, 2FA seed and recovery codes, split the new root 2-of-3; the single holding becomes useless.

### 3.3 Agents

The DAO works like a community **notice board**: jobs and needs are listed; a tradesman's advert is replaced by a **badge**.

- **Local representatives**, like the original Lloyd's Agents around the world. Their badges carry a region. **Digital agents** carry none.
- **Payment:** staged, or on completion, as the Agent agrees.
- **Goods are paid directly** to the merchant; **services directly where possible**.
- **Nothing is paid if the task is not completed.** That is part of the Agent's risk.
- **Reputation:** the number and type of tasks completed, shown as badges and on the profile (Agent, Local Agent and Operator badges: [`proposals/badges.md`](../proposals/badges.md) 1.3).
- **Exposure:** the Agent is the one part of the DAO that cannot be anonymous to the outside world, and carries any personal liability, with no legal wrapper. Stated plainly when a task is accepted; first tasks small and low-stakes.

**Fit with the protocol.** An Agent task is close to a bounty (4.6): the mandate is the bounty proposal, acceptance is `dao.claim`, evidence is `dao.report`, settlement is the council's round, and "nothing paid if not completed" is lapse. To add: the Agent badge and region; council members barred from claiming; payout outputs that pay a merchant directly beside the Agent's fee; the Agent's choice of staged or on completion before the vote fixes the schedule (in the draft's discussion).

**Task types:**

- **Physical:** buy, collect, install, attend.
- **Reporting** (the Lloyd's Agents' original job): confirm a merchant still accepts bitcoin, inspect a delivery, check a site. Cheap, low-risk; suits a first badge.
- **Digital deliverables:** writing, translation, design, code, research. Same pipeline, with all members in the decision. The risk runs the other way (once files are handed over the DAO has them), so, *proposed, to confirm:* the Agent posts a hash and a preview, payment follows, the full files are released and checked against the hash; and the DAO's own record as a payer (tasks paid, disputed, time to pay) shown on the dashboard.
- **Fiat bridge:** buying something from a counterparty who takes only fiat (3.4).

### 3.4 Fiat, Agent tasks and claim codes (22 November 2026)

**Decided:** the DAO never pays in fiat. It pays in bitcoin: directly to a counterparty who accepts it, or for a fiat-denominated voucher (a gift card bought for bitcoin, paid from the treasury like any merchant). When a counterparty takes only fiat, the DAO commissions an **Agent** at a price in sats, and the Agent delivers the outcome. How the Agent gets from sats to fiat is their own business: routes considered so far, each owned by the Agent personally and KYC'd to them, never DAO infrastructure:

| Route | How it works | Fit |
| --- | --- | --- |
| **Bitrefill Card** | prepaid Visa; the Agent tops up a EUR balance from bitcoin | a custodial EUR balance held between top-up and spend |
| **wave.space wavecard** (Wave Space Exploration UAB, Lithuania) | Visa debit that spends from the Agent's own Lightning wallet through Nostr Wallet Connect, converting at the till; BTC can also be sold to EUR by bank transfer | no prepaid EUR balance; bitcoin-only service; with the Lightning Purse, the DAO can pay an Agent over Lightning straight into the wallet the card spends from. EEA residents or citizens only; 1% conversion fee plus a 0.5% spread, also on card spending; Tier 1 card limit €10,000 a month |

Two routes for one function, in line with design by function: if a provider closes or changes its terms, Agents switch and the DAO changes nothing (the Fiat bridge badge is named for the function, 3.4.3).

Consistent with "no card paid by a person and reimbursed" (4.2):

- **The Agent quotes a price in sats for the finished outcome**, goods included, agreed in the draft's discussion before the vote fixes the schedule (4.6 in `protocol.md`). The DAO pays that price, staged or on completion, **never against a fiat receipt**.
- **Fiat stays off the record.** The task describes the goods ("one 5 kg bag of X from Y"), not a euro price. The quote absorbs the fiat cost, card fees and exchange movement; once voted it is fixed, and the movement is the Agent's risk.
- **Goods paid directly first.** The fiat route is only for counterparties who cannot be paid in bitcoin.
- **Proof is of the outcome**, not of the card transaction.

| On the record (public) | Never on the record |
| --- | --- |
| The task, the outcome that counts as done | Fiat amount |
| Recipient reference ("Recipient A") | Card, provider, exchange rate |
| The Agent's sats price (the schedule) | Merchant receipt (optional, the Agent's choice) |
| Code commitment, confirmation, round, receipt txid | The recipient's name and address |

#### 3.4.1 One process for every recipient

*Proposed.* One process serves a recipient who is a member and one who is not, and goods, payments and services alike. What differs is set in the proposal, not in the steps.

1. **Draft.** A member posts the need: the **outcome type**, the **recipient reference** and the **channel** for the code. An Agent quotes a price in sats in the discussion.
2. **Proposal.** A bounty (`protocol.md` 4.6) with the Agent's price as its schedule. The app generates the six-word code and puts only its commitment in the proposal (3.4.2).
3. **Vote.** Once it passes, the code goes to the recipient by the named channel. A rejected task never reaches the recipient.
4. **Claim.** An Agent at the badge level the recipient requires claims with an address.
5. **Act.** The Agent buys, pays or arranges the work with their own tools, outside the DAO.
6. **Confirm.** The recipient shows or types the code; `dao.delivered` is published.
7. **Paid.** The council's round pays the Agent's sats price; the receipt marks the task paid; the badge counts it.

**No confirmation** within the window: the claimant's `dao.report` carries the evidence (photo, tracking) and the council's round decides, as for any tranche ("approval is execution", `protocol.md` 4.6.2), giving a public reason if it declines.

**Every task has a code**, members' included. The Agent's handover scan then works the same at every door, and the Agent need not know whether the recipient is a member. A member recipient may instead confirm by signing in the app, but nothing depends on it.

**Outcome types**, each confirmed by the same code:

| Outcome | The recipient shows the code when | Example |
| --- | --- | --- |
| `goods` | they hold the item | a part from a fiat-only shop, delivered to a venue |
| `payment` | the money has arrived | a plumber's or printer's fiat invoice, a venue deposit |
| `service` | the work is done | a repair arranged and paid by the Agent |

A **payment** task names the counterparty's own invoice ("pay Recipient A's invoice, ref 0412"), not a euro amount. Members see the amount on the invoice in the DAO inbox, encrypted (9.2); the public record holds only the reference and the Agent's sats price.

**What the recipient type sets:**

| | Member recipient | Non-member recipient |
| --- | --- | --- |
| Who can claim | any new Agent | Fiat bridge ×3, or any level with a Witness |
| How the code reaches them | in the app | email, Nostr, or paper |
| On the record | pseudonymous member | a reference; name and address to the Agent privately |

Rules for every task:

- **The proposal names the recipient**, not the Agent: the Agent cannot redirect the outcome afterwards.
- **The code travels by a channel the Agent does not control.** Extra evidence may sit beside it: the merchant's receipt sent straight to the DAO inbox (the Agent gives `admin@<dao>.byob.zone` as the order email; some receipts show a name or card digits, which the Agent should know first), or a **Witness**, a member present at the handover.

#### 3.4.2 The claim code

*Proposed.* A **hash commitment**: the proposal publishes the fingerprint of a secret code; the recipient reveals the code to confirm. Anyone can check the code against the fingerprint, so confirming needs no server and no account.

1. **Draft.** The proposer's app generates a random **six-word code** (BIP39 words, 66 bits, for example `orbit velvet candle rescue amber logic`) and a random nonce, and puts only the commitment into the bounty:
   `"delivery": {"outcome": "goods", "recipient": "Recipient A", "channel": "email", "nonce": "<hex>", "commit": "<sha256 hex>", "windowDays": 7}`
   (`outcome`: `goods`, `payment` or `service`; `channel`: `app` for a member recipient, `email`, `nostr` or `paper`)
   with `commit = SHA-256("btc-dao/delivery" ‖ nonce ‖ code)`. The proposal id cannot be used in the hash (the commitment is part of the content that makes the id), hence the nonce. Six words, not four: the commitment is public, so the code must resist an offline guessing attack by the Agent.
2. **Code sent** once the vote passes. The proposer's app sends the code to the recipient over the channel named in the proposal (in the app for a member, email from the DAO, a Nostr message, or on paper by a member). **The proposer cannot claim a bounty they hold the code for.** Later, the executor (4.5) generates and sends the code itself, so no person ever sees it.
3. **Vote, claim, delivery** as for any bounty (`protocol.md` 4.6): the Agent claims with an address, buys with their own tools, delivers.
4. **Confirmed.** The recipient opens `<dao>.byob.zone/confirm/<proposal id>` and types the six words. The page checks the hash in the browser and, on a match, publishes **`dao.delivered`** (proposed kind 3596), signed by a key the page creates on the spot. Like `dao.confirm`, **any key may sign it**; it is valid when the hash of its code matches the commitment. The first valid one counts. The code is never in the link, so the link can be printed or left with the item.
5. **Paid.** A tranche with `delivery` can join a round only after a valid `dao.delivered` (or, past the window, a claimant's report: 3.4.1). The council signs the round; the receipt marks the task paid; the Agent badge counts it.

**Handover scan** (*proposed*, the courier-signature mode). The recipient shows the code; the Agent's phone reads it.

1. **The email to the recipient** carries the six words as text and as a QR code, with one instruction: *show this only when you have the item in your hands.* For the paper channel, the DAO prints a small card with both.
2. **The Agent opens** `<dao>.byob.zone/deliver/<proposal id>` before setting out. The page loads and keeps the commitment, so the check works on a weak signal.
3. **At the handover** the Agent scans the QR (or types the words, if the recipient's email blocks images). The page hashes the code at once: a green tick on a match, a red cross and nothing published on none.
4. **Published** straight away, or when the phone is back online, signed with the **Agent's member key** and marked `"via": "scan"`, with the scan time. The record then says plainly that the Agent submitted it, and the confirmation counts on their badge.

The code only has to stay secret until the handover: showing it *is* the confirmation, so the Agent's phone reading it changes nothing. Validity still rests on the hash alone, so one code serves both modes.

- **QR content:** a `btcdao:delivered` URI with the proposal id, the tranche and the six words, so the scanner refuses a code meant for another task.
- **Shown too early** ("let me check your code first"): the instruction beside the QR is the guard, as with a courier signature; a dispute goes to the claimant's report and the council's round.
- **Shared inboxes:** anyone who can read the recipient's email can show the code, as anyone at a front desk can sign for a parcel.
- **No location** is recorded: a position would put the recipient's address on the public record.

| Mode | Published by | The record shows |
| --- | --- | --- |
| Recipient types the code | the recipient, with a key made on the spot | the recipient confirmed on their own device |
| Handover scan | the Agent's member key, `"via": "scan"` | the code left the recipient at the handover |

`dao.delivered`, content `{"tranche": 1, "code": "<six words>"}` (with `"via": "scan"` in scan mode), tagged `["e", <proposal id>]`. **Member recipient:** the same field with `"channel": "app"`; a `dao.delivered` signed by that member, without the code, also counts. **Staged tasks:** one commitment per tranche (for example "bought", confirmed by a Witness; "delivered", by the recipient's code).

Limits: a recipient can still pass the code to the Agent. The proposal naming the recipient, and the thresholds for non-member tasks, contain that; they do not remove it.

#### 3.4.3 Agent badges by task type

*Proposed,* extending [`proposals/badges.md`](../proposals/badges.md) 1.3, where the Agent badge is already counted by type. The **Fiat bridge** count is the first threshold; it is named for the function, not the provider (a Bitrefill Card is one route), in line with design by function.

- **Earned** by a fiat-bridge task claimed, confirmed and paid in a round. Owning a card earns nothing: the DAO never checks an Agent's accounts.
- **Before any Agent task:** the member holds the four member badges and is not on the council.
- **Trust ladder:** first tasks small, member recipient, paid on completion only. Higher counts open non-member recipients, larger tasks and staged payment (the one case where the DAO pays before delivery). Each DAO sets the limits in its rules.
- **Other types**, each counted on the same badge: Procurement (goods paid directly in bitcoin), Courier (moving items, such as kits to a new council member), Representation (attending an office, a meeting or a supplier and reporting back), Post (physical mail, beside the email module), Witness (confirming another Agent's handover in person, close to the Reporting type in 3.3).

## 4. Modules

A module is selected by the DAO (a rules vote) and adds abilities. Once set up, it runs automatically: no human involvement other than members voting on proposals.

### 4.1 Tiers

| Tier | What | Status |
| --- | --- | --- |
| 1 | No account: services paid per use in sats (paid relays, Blossom media by zap, L402 APIs) | Depends on the Lightning Purse. Until then, Tier 1 actions go through council payouts |
| 2 | Account opened once by a human, then used through an API | **The first design scope** |
| 3 | Identity checks or a legal entity required (banks, most payment processors) | Out of scope |

Tier 1 needs funds the module can spend without council signatures: a capped Purse, topped up only by proposal, every payment published as a receipt. Its keys are infrastructure: Operator side.

### 4.2 Admission tests (Tier 2)

A service is admitted only if:

1. **Token test:** its API can **create, revoke and list** tokens.
2. **Payment test:** it has a usable **free tier**, or **accepts bitcoin**. No card paid by a person and reimbursed.
3. **Exit test:** a known **second provider** exists for the same function. It need not be built, only identified.

Each module records its results (create ✓, revoke ✓, list ✓, payment, exit), so what is required of every service is public.

### 4.3 Module declaration

Held in the DAO's settings:

- **Function** and **provider**
- **Setup:** what a human does once (an Agent or Operator task), and the account, always registered to the DAO's own email address
- **Credentials:** the working token, its scope (as narrow as possible) and rotation period
- **Actions:** the proposal types it adds
- **Receipts:** what it publishes after each action
- **Test results** (4.2)

### 4.4 Lifecycle

**Proposed → Setup → Active → Rotating → Disabled**, each stage on the dashboard.

- **Setup** is a bounded task through the normal pipeline, ending with the handover ceremony (5.3). Payment against its closing receipt.
- **Disabled:** revoke every token, publish the final token and user list, archive the account.

### 4.5 Executor and watcher

- **One executor per DAO** (a Worker) holds the working tokens of every active module. It watches the DAO relay for passed proposals, **checks for itself** that the vote passed (signed votes against the membership and the current rules, not the app's word), acts, and publishes a receipt. Small, auditable, published deployments.
- **Watcher:** compares receipts with passed proposals, and each service's own token and user list with the declaration. An unapproved token, user or action is flagged on the dashboard at once.

## 5. Credentials

### 5.1 Three layers

| Layer | What | Held by |
| --- | --- | --- |
| Root | login, 2FA seed, recovery codes | the Operators, as Shamir shares (1 at the start, 2-of-3 later), on printed cards or plates like the SeedQR cards. Used only through a **Recovery proposal** |
| Working token | what the module uses day to day | the executor (a Worker secret, unreadable once set). Narrow, expiring, rotated automatically; only its token ID published |
| Audit | the service's list of every token and user | public; the watcher checks it against the declaration |

### 5.2 Security email

Password resets arrive at the DAO's email. Readable by any single member, they would get round the root split. So accounts are registered to a separate address, `accounts@`, whose mail is **held back** and released only when a Recovery proposal passes (9.1). Sorting by address is more reliable than spotting security mail by its content.

### 5.3 Handover ceremony

The Agent's task ends when the DAO has full control, not when the account is opened. Run straight after setup:

1. The Agent opens the account with the DAO's email address and creates one bootstrap token for the module.
2. The module creates its own narrow working token, then revokes the bootstrap token.
3. The password is changed to a random one generated in the app and split into shares at once. The Agent never sees it.
4. 2FA on; the TOTP seed and recovery codes split the same way.
5. All sessions logged out, the Agent's included.
6. The module publishes the token and user list as the closing receipt; the Agent's payment is released against it.

After step 6 nothing the Agent knows opens the account. What stays with them is legal: they accepted the terms.

## 6. The domain: an anchor asset

Whoever controls the registrar controls the email address, and so every account's recovery: the domain is the DAO's deepest root. It is **not a module** (registrars rarely pass the token test, and a domain needs almost no actions): once its nameservers point at the DAO's DNS provider, everything day to day happens in a module.

- **Registrar jobs:** hold the nameservers (set once), renewal (prepay several years), transfer lock on.
- **Login:** registered to the DAO's email address, held by the Operators like every root; changes by proposal.
- **Watching needs no credentials:** nameservers, expiry and lock status are public (WHOIS/RDAP). The watcher flags a nameserver change, a lock removed, or expiry near.
- **Renewal:** a normal proposal, paid in bitcoin.
- **Escape hatch:** a registrar separate from the DNS provider means one nameserver change moves the DAO off a provider.

Candidate registrar: **HostSailor** (domain registration, bitcoin via CoinGate, Dubai). To check before moving byob.zone: whether account credit can be topped up first (processor invoices expire in minutes, too fast for a SeedSigner council); the 60-day transfer lock after registration; support for `.zone`; its reputation. NameSilo is a comparable option (bitcoin, renewals from preloaded funds).

This replaces the "Domain care" line in `decisions.md` (two council members reach the registrar) once Operators exist.

## 7. Providers

Cloudflare is the current core (DNS, inbound email, website, Workers): a centralisation risk, mostly of account closure rather than price. It holds no money and no record, so its loss is downtime. Cloudflare stays for now; the interfaces are provider-neutral from the start; second providers are tested early. To verify against the admission tests:

| Function | Second options |
| --- | --- |
| DNS | deSEC (free, non-profit; token API to confirm). The cheapest real exit test |
| Website | Cloudflare Pages as the tested second host; nsite (static sites as Nostr events signed by the DAO npub, files on Blossom) as the final form (8.2) |
| Executor, email | a VPS paid in bitcoin (some take Lightning, with Nostr login and an API) |
| Executor | the Operator's own hardware, as a fallback |

## 8. The first module: Cloudflare base, then email

On the free tier, under the admission tests:

| Stage | What | Notes |
| --- | --- | --- |
| 0 | This document | now |
| 1 | Operator role in the app: badge, founding minimum, 1 → 3 vote, dashboard | beside the council-change work |
| 2 | Cloudflare base module: account (setup, handover, rotation, watcher); **inbound email** as in section 9. The DAO website is its own module (8.2) | text only first; attachments later (9.6). Any member can turn an email into a draft |
| 3 | **Free outbound to verified addresses:** member notifications (new proposals, votes closing, to-dos) to members who opt in by verifying their address | alongside the Nostr notification layer |
| 4 | Outbound email to the world | through a separate sending provider (8.1); Cloudflare's own sending needs a paid plan by card, which fails the payment test |

The Announcement proposal and the DAO npub ([`discussion-and-comms.md`](discussion-and-comms.md) 4) follow the same pattern: an approved proposal, executed by code holding a credential, with a public result.

### 8.1 Stage 4: outbound only, on a separate provider

*Proposed, 22 November 2026.* Inbound stays on Cloudflare Email Routing (free, fits the Worker). Only **sending** moves to another provider:

- **Split by function.** Receiving on one provider and sending on another is design by function (2): losing either breaks half of email, and each half is replaced alone.
- **Neutral interface.** The executor calls `send(message)`; an adapter speaks to the provider's HTTP API (or SMTP). Changing provider is a settings change, by proposal.
- **Inbound exit covered.** The bitcoin-paid candidates below also offer receiving (MX routing), so inbound has a second provider too.

| Provider | Payment test | Token test | Notes |
| --- | --- | --- | --- |
| **Resend** | free tier: 3,000 emails a month, 100 a day, 3 domains | passes: API keys created, listed and deleted by API; a key can be limited to sending only | far above a DAO's volume; a free account a US company can close |
| **KingSMTP** | bitcoin, no KYC, from $49 a year (5,000 emails a month) | HTTP API and API keys; create, revoke and list by API **to confirm** | built on Postal (open source); includes MX routing |
| **Maileroo** | crypto invoices, no minimum tier | to check | a further bitcoin-paid option |
| Proton Mail | bitcoin as account credit | **fails**: SMTP tokens are made by hand in settings, with the account password | paid plans with a custom domain only; a human mailbox, not an executor provider |

**Choice:** **Resend** (free tier) as the primary sender; **KingSMTP** (bitcoin) as the second provider for the exit test, and the better long-term fit (paid in bitcoin, no KYC).

**Tests before building:**

- [x] Resend's free plan delivers to any address once the domain is verified. **Passed 22 November 2026:** a free account (registered to the project address, email and password, not a GitHub login) with `test.byob.zone` verified (EU region, records added by hand at Porkbun) sent through the API to a Gmail address that is not the sign-up address; Resend reported it delivered. The "sign-up address only" limit applies to Resend's shared `resend.dev` domain, not to a verified one. Test key deleted afterwards.
- [ ] KingSMTP: API keys created, revoked and listed through its API
- [ ] Deliverability from `admin@<dao>.byob.zone` to Gmail and Outlook inboxes, with SPF and DKIM for both providers in the DAO's DNS (9.7). **Partly done 22 November 2026:** Resend to Gmail landed in the **inbox** (plain text, new subdomain). Still to do: SPF/DKIM/DMARC results in the message headers, an Outlook address, and KingSMTP.

Records found on 22 November 2026: Resend now verifies a domain with a DKIM TXT record and two CNAMEs for sending (`rsend.<sub>` and `send.<sub>`), not MX and SPF TXT; DMARC (`_dmarc.<sub>`, `p=none`) added by hand. Porkbun's own DNS runs on Cloudflare, so byob.zone already depends on Cloudflare without a Cloudflare account (relevant to the second DNS provider, 7).

Unblocks: Correspondence replies to the world (9.4), claim codes by email (3.4.2), and invoice PDFs as attachments (9.6).

### 8.2 The site module

*Proposed, 22 November 2026.* The DAO's site is static files, so it is defined by function, not tied to a host: **one build, published to several hosts**. Leaving a host is a DNS change.

| Layer | Host | Role |
| --- | --- | --- |
| Source and history | GitHub repo | every DAO's source; what a fork copies |
| Primary host | **GitHub Pages** | live today (`byob.zone`, `www`, `alpha`); a fork gets it by enabling Pages, with no extra account |
| Second host (exit test) | Cloudflare Pages, built from the same repo | tested once, kept ready |
| Final form | **nsite**: files on Blossom, signed by the DAO npub | no account to close: any relay or Blossom server serves it, and anyone can check a page is the DAO's |

Why GitHub stays primary:

- **Forking:** the site comes with the repo, the smoothest path for a new DAO.
- **Separate blocks:** Cloudflare already runs the relay, the chain gateway and (planned) inbound email, and sits behind Porkbun's DNS. The site on GitHub means a Cloudflare problem does not take it down.
- **Public history:** every DAO's site is a public repo, in line with all DAO data public.

**Publish site update** proposals: once passed, the executor publishes the new build to the primary host (and the second, if active), and the receipt records the commit and the deployed hash.

To check:

- [ ] **GitHub and the token test.** Fine-grained personal tokens are made by hand, not by API. Candidates that may pass: a **GitHub App** (installation tokens created and revoked by API, short-lived) or a repo **deploy key** (added, listed and removed by API; SSH, so awkward from a Worker). Cloudflare's token API passes cleanly.
- [ ] **GitHub Pages terms:** not meant for sites primarily facilitating commercial transactions. A DAO's static app should be fine; a marketplace DAO selling through its site is a reason to have the second host ready.
- [ ] Cloudflare Pages built from the same repo: one test deploy and a DNS switch, then back.

## 9. The email module

Decided 17 November 2026, unless marked otherwise. The aim: an easy way for members to run the DAO's email themselves, so the DAO can deal with traditional companies and individuals as well as with Nostr users.

### 9.0 Inbound: which route (open, 22 November 2026)

Cloudflare Email Routing works only when Cloudflare is the domain's DNS provider: byob.zone's nameservers would move from Porkbun to the DAO's own Cloudflare account. That is a decision for the DNS module (6, 7), not only for email. DAO addresses are on subdomains (`admin@<dao>.byob.zone`), and each subdomain's MX can point anywhere, so inbound can be tested without touching byob.zone's own mail forwarding.

| Route | DNS | For | Against |
| --- | --- | --- | --- |
| **A. Cloudflare Email Routing → Worker** (this draft so far) | moves to the DAO's Cloudflare account | free; the Worker receives the raw message, a clean fit with the executor | more weight on Cloudflare (relay, gateway, DNS, email); needs the nameserver move |
| **B. Resend receiving → webhook to the Worker** | stays at Porkbun | no DNS move; testable now on `test.byob.zone` | sending and receiving on one provider unless KingSMTP takes sending; received mail counts toward the free quota (100 a day) |
| **C. KingSMTP MX routing** | stays at Porkbun | paid in bitcoin; already the outbound second provider | untested; may only forward to a mailbox, not to a Worker |

Next: test B (9.0.1). The DNS decision (Cloudflare as DNS provider in the final form, deSEC second, or DNS kept at the registrar) decides between A and B/C.

#### 9.0.1 Test B

- [x] Receiving enabled on `test.byob.zone`, MX added at Porkbun; a message from Gmail arrives in Resend's Receiving view with sender, subject and full text. **Passed 22 November 2026.** Resend keeps each received email as structured data: `subject`, `text`, `html`, `from`, `to`, `cc`, `reply_to` and every original header (including `message-id`, for threading replies, 9.4, and `dkim-signature`).
- [x] The webhook payload (`email.received`): **a notice, not the message.** The request was 403 bytes, too small to hold the email, so the Worker receives the email's id and fetches the message through Resend's API. The webhook is signed (Svix: `svix-id`, `svix-timestamp`, `svix-signature`), so the Worker can check it came from Resend before acting. Needs the Worker's API key to allow reading received mail (a scope to check against the token test). Webhook endpoint to delete after the test (webhook.site is public).
- [ ] Sender checks: no `authentication-results` from Resend seen in the stored headers (only Google's own `arc-authentication-results`). If Resend does not add one, the Worker verifies DKIM itself from the original headers before applying 9.8.

### 9.1 Addresses

| Address | For | Who reads it |
| --- | --- | --- |
| `admin@<dao>.byob.zone` | the world: companies, individuals, counterparties | all members, in the app |
| `accounts@<dao>.byob.zone` | registering Tier 2 accounts only | nobody, until a Recovery proposal passes |

Sub-addresses (`admin+printer@…`) arrive at `admin@`. Each counterparty gets its own tag; a leaked tag is blocked alone. Named after the DAO, not the council: the inbox belongs to all members.

### 9.2 Reading: members only, no reply button

- Every email is readable by **all members** on the DAO website. There is **no reply button**: every reply is drafted as a proposal.
- **Why encrypted:** the relay is public by design. In plain text an email would be readable by anyone, including the private details of a sender who wrote to an ordinary-looking inbox. Encrypted, members read it as if the inbox were open to them, and nobody else can.
- **One inbox key:** the DAO has an inbox keypair. The executor encrypts each email to its public half and needs no secret to do so. The private half is wrapped to each member's identity key (like `dao.keywrap`, 5.4). A new member's key is wrapped by an existing member's app once they are voted in, so they read the full history; when a member leaves, the inbox key is changed for future mail.

### 9.3 Body and record kept apart

- **Email bodies** are kept encrypted in the module's own storage, with a **retention period** set when email is enabled. They are not kept forever.
- **On the relay** (permanent): the email's hash, an encrypted summary, and its links to proposals and replies.
- So the DAO's record shows what happened without keeping private individuals' messages for ever.

### 9.4 Replies: all comms through proposals

- **Correspondence** is a proposal category with a **3-day voting period**. Every outgoing message, to anyone, goes through it: idea → draft → discuss → proposal → vote → sent. No standing mandates or pre-approved templates.
- A passed reply is sent by the executor, word for word, threaded into the counterparty's conversation (reply headers), and its receipt published.
- **Comms transparency:** every outgoing email's hash goes into its receipt, with a footer link to the public record. The recipient can verify the message is the DAO's and was voted, and can follow the **current status** of the DAO's processing of their matter (draft, discussion, vote, result).
- Outbound to the world goes through the separate sending provider (8.1).

### 9.5 Payment fraud

A payout address taken from an email ("our address has changed") must be **confirmed through a second channel** (a call, an Agent's visit, or the counterparty's own website) before its proposal can pass. The app flags any proposal whose address arrived by email.

### 9.6 Attachments (later)

Quotes and invoices as PDFs: stored encrypted (Blossom), offered as downloads only, never opened inside the app, with a size cap. One click turns an invoice email into a draft payout proposal with the attachment linked (and 9.5 applies to its address).

### 9.7 Delivery

The sender records (SPF, DKIM, DMARC) are set in the DAO's DNS by the DNS module, together with the email module; without them replies land in spam.

### 9.8 Spam

Spam is stopped **before** the relay, since the relay keeps everything.

1. **Sender checks:** mail failing SPF, DKIM or DMARC is dropped by the Worker.
2. **Known and new senders:** known senders (addresses the DAO has written to, or a member has added) go straight to the inbox. New senders wait in the module's storage, not on the relay, for a fixed time (say 30 days); members see sender and subject only, any member can let a sender in (logged), and the rest expire unrecorded.
3. **Sub-addresses** per counterparty (9.1).
4. **Contact form** on the DAO website instead of the bare address, with a proof-of-work check (ALTCHA, open source, self-hostable). The bare address goes only to counterparties the DAO deals with.
5. **Limits:** messages per sender per day, size, text only at first.
6. *Later:* Lightning postage (a few sats puts an unknown sender straight in the inbox), once the Purse exists.

Never auto-reply to unknown senders with a challenge: spam forges senders, so the replies hit innocent people and get the DAO's domain blocklisted.

### 9.9 Enabling email

An **"Enable email"** proposal, guided in the app: addresses, retention period, spam settings. Once passed, it creates the Setup task for the Operator (4.4) and the DNS records (9.7).

## 10. Open questions

- [ ] **A cleaner definition of the Operator role** (22 Nov 2026): what an Operator does and holds, what it never holds, and whether a council member may also be an Operator. Today the separation is implied (council holds the money, Operators hold the root shares) but only "council members are not Agents" is stated as a rule. ALPHA DAO runs without a meaningful Operator role until this is settled
- [ ] Email retention period default; how the encrypted summary is written (automatic, or by the member who files the email)
- [ ] Inbox events in the protocol: kinds for received email, inbox-key wrapping, sender admission, correspondence receipts
- [ ] **Single-Operator backup.** A sealed copy of the root split among the council, opened only by a Recovery proposal if the only Operator is gone, retired at three Operators? Blurs council/Operator separation in an emergency only
- [ ] **Executor and chain gateway:** one Worker or two? The chain gateway holds no secrets today, and the comms draft puts the DAO npub's nsec there
- [ ] Digital deliverables: hash and preview before payment; delivery accepted by the council's round (as 4.6 today) or a members' step for larger work; default licence (open, or per task)
- [ ] Agent tasks in the protocol: Agent badge and region, council barred from claiming, merchant outputs, the Agent's choice of schedule
- [ ] Claim codes (3.4.2): the `delivery` field and `dao.delivered` in `protocol.md`; the relay range to 3596; clients keep `dao.delivered` from any key when its code matches (an exception to members-only filtering, like `dao.confirm`); window default; who sends the code before the executor exists
- [ ] Kind numbers: 3593 is proposed twice (`dao.link` in `proposals/badges.md`, `dao.meeting` in `meeting-scheduler.md`); settle the order before 3596 is assigned
- [ ] Fallback when a non-member never confirms: the council's round (as now) or a members' step
- [ ] Fiat bridge thresholds (count for non-member recipients, staged payment) as reference rules
- [ ] Bitrefill checks: guest purchase with email only and on-chain payment (for vouchers bought by the treasury); its terms on passing codes to others; Bitrefill Card terms for an Agent buying on someone else's behalf
- [ ] wave.space checks: whether EUR proceeds can go to a third party's IBAN (an Agent paying an invoice directly, the `payment` outcome) or only to the Agent's own account; card behaviour when the Lightning wallet is offline, and which NWC wallets are supported; its terms on buying on someone else's behalf
- [ ] Operators in the protocol: settings fields, the Operator badge, the 1 → 3 change and its flag
- [ ] Cloudflare details to confirm against its API docs: tokens that create tokens, token expiry, account-owned tokens
- [ ] HostSailor checks (6); whether byob.zone moves
- [ ] deSEC as the second DNS provider: token API, then a real move
