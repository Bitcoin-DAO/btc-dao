# v0.3.0 — Discussion & Outward Comms (handover)

Status: design agreed, not yet built
Scope: btc-dao core build. No changes to the voting or treasury layer.

---

## 1. Summary

Two additions:

1. **Discussion**: an in-app front flow onto the existing proposal architecture: **idea → draft → discuss → proposal**. One public thread per proposal, hosted on the DAO's own Nostr relay. This replaces the external forum role SputnikDAOs relied on, so the reasoning behind every decision stays in the DAO's own record.
2. **Outward comms**: each DAO gets its own Nostr identity (DAO npub). It is held by the DAO's gateway, not by any person, and speaks only through:
   - an **automatic feed** of the DAO's own record, and
   - **Announcement** proposals that have passed a vote.

X is out of scope for now.

---

## 2. Principles

- Minimal: as few new event kinds, fields and screens as possible.
- Everything public, consistent with the existing rule that all DAO data is public.
- No moderation, no editing, no deletion. Corrections are new posts.
- Uses btc-dao's own event kinds, to be included in the future btc-dao NIP.
- The DAO's official voice is either automatic fact or collectively approved words, never one person's opinion.

---

## 3. Discussion

### 3.1 Flow

| Stage | What happens |
|---|---|
| **Idea** | Any member starts a draft with just a title and a line or two. The thread opens immediately. |
| **Draft** | The author fills in the proposal fields (amount, payout address, category, etc.), posting new versions as the discussion shapes it. |
| **Discuss** | Members post in the thread. |
| **Proposal** | The author submits a chosen version. A normal proposal event is created exactly as now, referencing the thread and the version. Voting opens; the same thread continues through the vote. |

"Idea" and "draft" are the same object. An idea is a draft with only a title filled in.

### 3.2 Thread contents

One thread per proposal, from first idea to result. It holds two kinds of entry, shown interleaved in plain chronological order:

- **Version card** (author only): a complete snapshot of the proposal fields, numbered v1, v2, v3 and so on. The newest card is the current draft.
- **Post** (any member): flat, chronological, with no nesting, reactions or attachments. Links are allowed.

A post's position in the timeline shows which version it responded to; no tagging is needed.

### 3.3 Rules

- **Submit:** only the author can submit a draft as a proposal.
- **Freeze:** once a proposal is opened, no further version cards can be added, so the voted text is frozen. Posts can continue.
- **Withdraw:** the author can withdraw a draft. It stays visible, marked closed.
- **Stale drafts:** no protocol rule. They remain as history; the app sorts drafts by last activity so quiet ones sink.
- **Draft status** (open / submitted / withdrawn) is derived from events, not stored separately.

### 3.4 Relay rules

- **Write:** member keys only (same membership check as proposals and votes; confirm current implementation).
- **Read:** anyone.
- No edits or deletions are accepted.

### 3.5 UI

- **New "Discussion" tab** listing drafts and proposals by last activity.
- **Thread view:** the latest version card is pinned at the top, followed by the full chronological timeline.
- **Share button** on every draft and thread, giving a public read-only link.
- **"Submit as proposal"** button for the author, pre-filling the proposal from the chosen version.
- **Unread indicator:** "new since your last visit", using a timestamp stored on the device. No server notifications.
- **Proposal page:** replace the external link box with two auto-filled fields:
  - **Discussion:** link to the thread
  - **Version:** the version number that was submitted (e.g. "v3")

### 3.6 New event kinds

Allocate from btc-dao's own range alongside 3570–3586 (exact numbers to be confirmed against the repo):

| Kind | Purpose | Key content |
|---|---|---|
| Draft version | Version card | Draft id, version number, title, proposal fields |
| Thread post | Discussion post | Reference to draft/thread, text |
| Draft withdraw | Author closes a draft | Reference to draft |

The existing proposal event gains a reference to the draft id and the submitted version number.

---

## 4. Outward comms

### 4.1 DAO npub

- One Nostr keypair per DAO, consistent with the per-DAO keys principle.
- Its profile carries the DAO name, picture, description and website link.
- **Key custody:** the nsec is held by the DAO's chain gateway (Worker), not by any member.
- Posts go to a configured list of public Nostr relays as well as the DAO relay.

### 4.2 Automatic feed

The gateway posts notes for DAO record events, each linking to the app or the transaction:

- Proposal opened (title and link)
- Proposal passed or failed (with the vote result)
- Payout sent (amount and transaction link)
- Council change completed

It posts facts only, with no commentary.

### 4.3 Announcement proposal category

- New proposal category: **Announcement**.
- The text goes through the normal idea → draft → discuss → proposal flow.
- If passed, the gateway publishes the submitted version's text word for word from the DAO npub, and links it back to the proposal.

### 4.4 Trust anchor and key rotation

- Publish the DAO npub as a NIP-05 identifier on the DAO's domain (e.g. `dao@btcdao.tech`). The domain is what proves which npub is the DAO.
- If the key is compromised:
  1. Generate a new keypair.
  2. Update the NIP-05 record.
  3. Post a move notice from the new key.

---

## 5. Out of scope (v0.3.0)

- X / other platforms
- Likes, reactions, nested replies, edits, attachments, rich formatting
- Moderation tools (if ever needed: an optional charter module, not core)
- Push notifications
- Threshold signing for the DAO npub
- Private / members-only discussion

---

## 6. Open items

- Confirm how the relay currently checks membership for writes.
- Confirm the new kind numbers within btc-dao's range.
- Whether testnet4 DAOs publish the automatic feed to public relays, or only to their own relay.
- Default list of public relays for the DAO npub.
- Include the three new kinds and the Announcement flow in the NIP draft.
