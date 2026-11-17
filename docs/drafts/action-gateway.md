# Draft: the action gateway (modules, Operators and Agents)

17 November 2026 · **design discussion, not yet built.** Nothing here changes `protocol.md` until a later draft names the events and rules. Development and testing on UNO DAO (testnet4); ALPHA DAO stays on the current build for its workshop.

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
| Website | nsite: static sites as Nostr events signed by the DAO npub, files on Blossom. To look at later |
| Executor, email | a VPS paid in bitcoin (some take Lightning, with Nostr login and an API) |
| Executor | the Operator's own hardware, as a fallback |

## 8. The first module: Cloudflare base, then email

On the free tier, under the admission tests:

| Stage | What | Notes |
| --- | --- | --- |
| 0 | This document | now |
| 1 | Operator role in the app: badge, founding minimum, 1 → 3 vote, dashboard | beside the council-change work |
| 2 | Cloudflare base module: account (setup, handover, rotation, watcher); **inbound email** as in section 9; the DAO website via Pages ("Publish site update" proposals) | text only first; attachments later (9.6). Any member can turn an email into a draft |
| 3 | **Free outbound to verified addresses:** member notifications (new proposals, votes closing, to-dos) to members who opt in by verifying their address | alongside the Nostr notification layer |
| 4 | Outbound email to the world | blocked: Cloudflare's sending needs a paid plan by card, which fails the payment test. Waits for a provider that passes |

The Announcement proposal and the DAO npub ([`discussion-and-comms.md`](discussion-and-comms.md) 4) follow the same pattern: an approved proposal, executed by code holding a credential, with a public result.

## 9. The email module

Decided 17 November 2026, unless marked otherwise. The aim: an easy way for members to run the DAO's email themselves, so the DAO can deal with traditional companies and individuals as well as with Nostr users.

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
- Outbound to the world waits for a provider that passes the payment test (section 8, stage 4).

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

- [ ] Email retention period default; how the encrypted summary is written (automatic, or by the member who files the email)
- [ ] Inbox events in the protocol: kinds for received email, inbox-key wrapping, sender admission, correspondence receipts
- [ ] **Single-Operator backup.** A sealed copy of the root split among the council, opened only by a Recovery proposal if the only Operator is gone, retired at three Operators? Blurs council/Operator separation in an emergency only
- [ ] **Executor and chain gateway:** one Worker or two? The chain gateway holds no secrets today, and the comms draft puts the DAO npub's nsec there
- [ ] Digital deliverables: hash and preview before payment; delivery accepted by the council's round (as 4.6 today) or a members' step for larger work; default licence (open, or per task)
- [ ] Agent tasks in the protocol: Agent badge and region, council barred from claiming, merchant outputs, the Agent's choice of schedule
- [ ] Operators in the protocol: settings fields, the Operator badge, the 1 → 3 change and its flag
- [ ] Cloudflare details to confirm against its API docs: tokens that create tokens, token expiry, account-owned tokens
- [ ] HostSailor checks (6); whether byob.zone moves
- [ ] deSEC as the second DNS provider: token API, then a real move
