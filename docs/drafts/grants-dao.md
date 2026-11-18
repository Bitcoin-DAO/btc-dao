# GRANTS DAO (design draft)

Status: idea agreed 18 November 2026, not yet designed in detail or built
Scope: a kind of DAO built on the existing core, plus a few additions (applications from other DAOs, labelled inflows).

---

## 1. Summary

A GRANTS DAO is an intermediary: people give to it, other DAOs apply to it, and its members decide what to fund.

- **Person to DAO (P2DAO):** donations come into the GRANTS DAO's treasury.
- **DAO to DAO (DAO2DAO):** other btc-dao DAOs apply, and funded grants are paid into their treasuries.

Because both ends are on a public record, a donor can follow a sat from their wallet into the GRANTS DAO, out to the receiving DAO, and on to what that DAO spent it on. The receiving DAO writes no report: its spending is the report.

**First instance:** the SeedSigner DAO, which raises funds for hardware kits for local DAOs. A narrow purpose is the right way to start.

---

## 2. Principles

- Uses the existing core: proposals, votes, staged payouts, the public record. A GRANTS DAO is a btc-dao DAO with `fundingModel: grant`, not a separate product.
- Grants go to **DAO treasuries only**, never to a person's wallet.
- Checking an applicant uses its public record, not paperwork.
- Its own weakness is stated up front: it lives only as long as donors give.

---

## 3. Flow

| Stage | What happens |
|---|---|
| **Give** | Anyone sends sats to the treasury. A donor may label a gift (name or nickname, a note); unlabelled gifts are fine. |
| **Apply** | An applicant DAO publishes an application signed by its DAO npub: what for, how much, tranches, and its treasury descriptor. |
| **Sponsor** | A GRANTS DAO member sponsors the application into a normal payout proposal, with `schedule` tranches. Applications nobody sponsors stay visible but go no further. |
| **Check** | The app shows the applicant's record beside the proposal (section 4). Members discuss in the thread. |
| **Vote** | A normal vote. |
| **Pay** | Tranches go to the applicant's current treasury address. A later tranche is released when the applicant's record shows the earlier one in use. |

---

## 4. Checking an applicant

Shown automatically from the applicant's own record and the dashboard:

- Its descriptor and the floor result (`protocol.md` 6.5): is the treasury shaped safely?
- "Unauthorised spends: 0" across its descriptor chain.
- Age, members, council, and badges.
- Funding model and steady I/O.
- What it did with any earlier grant from this DAO.

The payout address must belong to the applicant's current descriptor. If the applicant changes council before a tranche is paid, the tranche goes to the new treasury.

---

## 5. Additions to the core

- **Application event:** a new event kind, signed by the applicant DAO's npub (`docs/drafts/discussion-and-comms.md`, section 4), referencing its `dao_id`. The GRANTS DAO's relay accepts it from outside keys, as it does for discovery.
- **Labelled inflows:** a donor or a member can attach a label to an incoming txid ("grant from…", "donation from…"), shown on the treasury page and in Accounts. The dashboard can then separate gift income from earned income.
- **Address check:** the payout form checks the address against the applicant's published descriptor.

---

## 6. Keeping it alive

A grants pot runs dry when the gifts stop. A GRANTS DAO should set, in its charter or settings:

- a spending rule, for example never more than a quarter of the treasury in one quarter;
- a short public statement of what it funds and what it does not;
- whether it closes when a goal is met (a narrow GRANTS DAO like the SeedSigner DAO can simply wind up).

---

## 7. Open questions

- Only btc-dao DAOs as applicants, or any group with a Bitcoin multisig and a public descriptor? Leaning: btc-dao DAOs first; the checks depend on their record.
- Should the application event be part of the btc-dao NIP? Leaning: yes.
- Matching gifts (a donor pledges to match others up to an amount): later, if at all.
- Legal: collecting donations from the public and passing them on may carry rules in some countries; check before promoting.
