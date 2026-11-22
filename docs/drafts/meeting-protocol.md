# Meeting protocol: the workshop agenda (design draft)

22 November 2026 · **design discussion, not yet built.** Nothing here changes `protocol.md` until a later draft names the events and rules. A social protocol first: most of it needs no code at all.

Related: [meeting scheduler](meeting-scheduler.md) (finding the time), [discussion and comms](discussion-and-comms.md) (drafts and threads), [the competence path](../proposals/badges.md) section 4 (the eight stages), [workshop](../workshop/README.md) and [run sheet](../workshop/run-sheet.md) (the founding day).

---

## 1. Why

A DAO is a cooperation machine, but only part of one. On the ledger it keeps the books, holds the pot and enforces the vote. It cannot create trust, enforce anything off the ledger, or make people turn up. Those come from a small, local group meeting face to face, often enough that the DAO becomes an understood, habitual activity.

So the **off-DAO protocol is as important as the in-DAO one.** The ledger is where cooperation is recorded and money released; the meeting is where it happens.

This draft makes the meeting a fixed form: **the workshop is the meeting, and the agenda template is the model of the workshop's business of the day.** There is no other place where the DAO's business is done. Every item is a stage of the growth model, so each meeting walks the whole life of the DAO, and the agenda a DAO runs shows how far it has grown.

---

## 2. Principles

- **Everything gets raised.** Every item on the template is called at every meeting, in the same order.
- **Silence means no business.** If nobody speaks to an item, there is no business on it today, and that is minuted. "No business" is information, not a gap.
- **Some silences are flags.** Items with a cycle (section 5) are *due*; silence on a due item past its cycle is recorded as overdue, not as no business.
- **Speak before you post.** A proposal is said aloud at a meeting before it goes on-chain, or read aloud from its draft. The vote confirms a conversation; nobody is surprised by what appears in the app.
- **Talk and do.** Each item is either *talk* (discussion feeding a draft or proposal) or *do* (an act at the table: signing a round, printing a recovery sheet, vouching a member in). The *do* items keep the workshop a workshop.
- **The agenda grows with the DAO.** Items for stages not yet reached are read as one line, so the whole map is heard every time (section 4).
- **The minute goes on the record.** Each meeting ends with one minute posted to the DAO's record: who was present, and for each item, business or no business.
- **Forkable.** A child DAO inherits the template, starts at stage 1 and grows into it. Each DAO can add items by a rules vote; the core items stay.

---

## 3. The agenda template

In growth-model order. *Stage* is the competence path stage ([badges](../proposals/badges.md) 4.1) the item exercises.

| # | Item | Stage | Type | Present from | What is raised |
|---|---|---|---|---|---|
| 0 | **Opening** | — | talk | founding | Who is present (in the room, on the call). Last meeting's minute posted? Anything added to the record since. |
| 1 | **Record** | 1. Found | talk | founding | Is the DAO's site, relay and record working and intact? Unauthorised spends: 0? |
| 2 | **Members** | 2. Learn | do | founding | New members vouched in, members leaving, badges earned. Who has not yet tried a part of the DAO, and who will help them. |
| 3 | **Proposals and treasury** | 3. Pay | do | founding | Drafts read aloud, open votes, results. Payout round: built, checked and signed at the table. |
| 4 | **Council and keys** | 4. Endure | do · **due** | founding | Council health, spare key, recovery sheets confirmed, council change proposed. |
| 5 | **Operators, Agents, Correspondence** | 5. Operate | talk · do | first Operator / module | Infrastructure and credentials (**due**), open Agent tasks and claim codes, inbound mail read aloud, replies drafted as proposals. |
| 6 | **Accounts** | 6. Trade | talk | accounts module | Payment requests issued and received, statement, throughput. |
| 7 | **Mainnet** | 7. Mature | talk | testnet DAOs: founding | On testnet: what stands between us and mainnet. On mainnet: is the treasury structure still sound (descriptor floor, threshold)? |
| 8 | **Lineage** | 8. Reproduce | talk | always | Child DAOs being mentored, forks proposed or completed, setup support offered (only up to the stage held, badges 4.2). |
| 9 | **Rules** | — | talk · **due** | founding | Charter and settings: any change proposed? Funding model review. Is the agenda itself still right? |
| 10 | **Close** | — | do | founding | Next meeting fixed. The minute read back and posted. |

*Lineage* and *Rules* are always near the end, even for a new DAO. Every meeting quietly reminds the group that it can change its rules or split, so forking stays a normal, honourable act rather than something raised only in a falling-out.

---

## 4. Items the DAO has not reached yet

Items 5 and 6 (and 8, in practice) belong to stages a young DAO has not reached. They are not dropped: the chair reads them as one line,

> "Not yet: Operate, Trade."

That costs five seconds and keeps the map in everyone's ear. An item opens as a full item when the DAO reaches its stage or adds its module. A DAO's agenda is short at founding and full when it is mature, and the minute shows the day each item opened.

---

## 5. Due items and cycles

| Item | Due every | Overdue means |
|---|---|---|
| 4 Council and keys | after every council change, and at least every 3 months | recovery sheets not all confirmed, or council not checked |
| 5 Operators | every 3 months, once there is an Operator | credentials and recovery not checked |
| 9 Rules | every 12 months | charter, funding model and agenda not re-read |

On a due item, the chair asks for the check itself, not just for business. Silence on a due item past its cycle is minuted as **overdue**, and stays on the next meeting's opening until done. The cycles are defaults; each DAO sets its own by a rules vote.

---

## 6. Running the meeting

- **The chair rotates.** A different member chairs each meeting, so the meeting does not become one person's voice. Council members can chair; they have no extra say.
- **Call, pause, move on.** The chair reads each item and waits a fixed moment (about ten seconds) before minuting "no business". Silence must be real, not the result of someone speaking for the room.
- **Quiet voices.** A member who does not want to speak up can raise an item beforehand as a draft in the Discussion thread; the chair must read every such draft aloud under its item.
- **Open talk, recorded vote.** Discussion happens in the room; the vote happens in the app, by name, after the meeting or at the table.
- **Remote members.** On the call, the chair asks remote members by name on each item with business.
- **Time.** An item with no business takes seconds; the whole template with no business takes about five minutes. A meeting with nothing to do is short and still held: the habit is the point.

---

## 7. The minute

One minute per meeting, posted to the DAO's record at the close.

- **Content:** date, chair, members present (in the room and remote), and one line per item: *business* (with links to the drafts, proposals or rounds it touched), *no business*, *not yet*, or *overdue*.
- **Heartbeat.** Over time the minutes show which parts of the DAO are active and which are dormant: the off-DAO counterpart of the treasury's "unauthorised spends: 0". The dashboard could show it as a strip per item (to decide).
- **Format:** to be decided. A first version can be a `dao.post` in a "Meetings" thread with a fixed template; a dedicated event kind only if the dashboard needs to read minutes.

---

## 8. Open questions

- Minute format: `dao.post` with a template, or a new event kind for the future NIP.
- Should the app print the agenda (with "not yet" lines filled in from the DAO's stage) as a one-page sheet for the table, in the DAO's language?
- Quorum for a meeting: none (the vote happens in the app), or a minimum for *do* items such as signing at the table.
- How the [meeting scheduler](meeting-scheduler.md) links a fixed meeting to its minute.
- Whether minutes count toward a badge (for example, a DAO badge for twelve consecutive meetings minuted).
- First test: run the template at the ALPHA DAO workshop and its following meetings, and revise from what happens.
