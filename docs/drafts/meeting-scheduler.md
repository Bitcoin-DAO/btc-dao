# Meeting scheduler (design draft)

Status: idea agreed 18 November 2026, not yet designed in detail or built
Scope: btc-dao core build. No changes to the voting or treasury layer.

---

## 1. Summary

A light way for members to find a time to meet: someone proposes a few time slots, members tick the ones that suit them, and the organiser fixes the meeting. The result is a meeting entry with its time and how to join.

It sits beside proposals, not inside them. A meeting poll decides nothing for the DAO: it has no council step, no quorum, no tally and no treasury effect. It replaces the separate scheduling tools (Doodle-style polls, chat-group back-and-forth) a group otherwise uses to arrange calls such as the founding meeting, remote verification calls and council signing sessions.

It is also a gentle first feature: members can try the app on something that involves no money.

Background: the 18 November 2026 comparison with Loomio, which positions btc-dao as an alternative to a coop for small community organising. Loomio's meeting-time poll was the one decision tool worth carrying over. Its separate "Outcome" step was not: in btc-dao the proposal record (submitted version, votes by name, transaction) already is the outcome, and the Discussion thread shows the reasoning.

---

## 2. Principles

- Not a decision: it never appears in the proposal list, the tally or the DAO history.
- Same rules as Discussion: everything public, no editing, no deletion, no moderation. To change the slots, withdraw the poll and start a new one.
- As few new event kinds as possible; reuse `dao.post` and `dao.withdraw` where they fit.
- Uses btc-dao's own event kinds, to be included in the future btc-dao NIP.

---

## 3. Flow

| Stage | What happens |
|---|---|
| **Propose** | Any member opens a meeting poll: a title, an optional line on what it's for, 2 to 10 time slots with a duration, and a closing time they choose. |
| **Tick** | Members mark each slot *yes*, *if need be* or leave it blank. They can change their ticks until the poll closes: the latest set counts. |
| **Discuss** | The poll is a thread in Discussion, with a "Meeting" chip. Members can post in it with the usual `dao.post`. |
| **Fix** | After closing (or earlier, if everyone has answered), the organiser fixes one slot. The app suggests the slot with the most *yes*, then the most *if need be*; the organiser decides ties. |
| **Meet** | The fixed meeting shows on Home as "Next meeting" until it has passed, then stays in the thread as history. |

The organiser is the member who opened the poll. Only the organiser can fix or withdraw it.

---

## 4. Time

- Slots are stored in UTC.
- The app shows each slot in the viewer's own time zone, with the DAO's time zone (`rules.timezone`) beside it when they differ, since members may be spread across countries.
- A poll whose closing time has passed takes no more ticks.

---

## 5. How to join

The fixed meeting carries a **where** field: a place, a call link, or "link in the group chat".

The record is public, so a call link written here can be used by anyone who reads it. For calls that should stay among members (verification calls, signing sessions), the organiser picks "link in the group chat" and posts the link in the DAO's chat group (`config/dao.json` `group`), which already has admin approval for new members.

---

## 6. Events (provisional)

Next numbers in the provisional block, to be checked with the rest of the block before v1:

| Kind | Name | Signed by | Content |
|---|---|---|---|
| 3593 | `dao.meeting` | Member (the organiser) | title, note, slots (UTC start, duration), closes at |
| 3594 | `dao.avail` | Member | the meeting's id, one answer per slot (`yes`, `maybe`); the latest per member counts |
| 3595 | `dao.meetset` | The organiser | the meeting's id, the chosen slot, where |

Reused:

- `dao.post` (3588) for posts in the meeting thread, referencing the meeting instead of a draft.
- `dao.withdraw` (3589) for a withdrawn poll, signed by the organiser.

The relay's accepted range grows from 3570–3592 to 3570–3595. Clients keep only events from members, as for Discussion.

---

## 7. Later

- **Notifications:** "new meeting poll" and "meeting fixed" go to the member notification layer once it exists (Nostr, or email to verified addresses under the action gateway, stage 3).
- **Calendars:** the DAO npub could publish the fixed meeting as a NIP-52 calendar event, so it shows in Nostr calendar clients, and the app could offer an `.ics` download. Only for meetings whose **where** is safe to make public.
- **Recurring meetings** (a weekly members' call): not in the first build. A new poll each time is fine to start with.

---

## 8. Open questions

- Should council-only polls exist (signing sessions), or is any member ticking a council poll harmless? Leaning: one kind of poll, the title says who it's for.
- Does the dashboard show anything? Leaning: no; meetings are internal life, not a DAO-quality metric.
