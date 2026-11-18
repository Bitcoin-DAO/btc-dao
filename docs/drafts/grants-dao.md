# GRANTS DAO and repayable grants (design draft)

Status: idea agreed 18 November 2026, not yet designed in detail or built
Scope: a kind of DAO built on the existing core, plus a few additions (applications from other DAOs, labelled inflows, repayable grants, programme metrics).

---

## 1. Summary

Activity is separated into DAOs that each do one job, joined up by their public records:

| DAO | Job |
|---|---|
| **GRANTS DAO** | The verification gateway for outside funding. Donors give here; it checks and funds programme DAOs; repayments come back here. Its website shows every project supported. |
| **Programme DAO** (first: **SEEDSIGNER DAO**) | The decision-making DAO for one purpose. It decides which local DAOs receive support, and is measured by how well its repayable grants are repaid. |
| **Local DAOs** | Apply to a programme DAO, use what they receive, and repay the GRANTS DAO when they can. |

Because every step is on a public record, a donor can follow a sat from their wallet into the GRANTS DAO, through the SEEDSIGNER DAO, to a local DAO's kit, and back again as a repayment that funds the next kit.

---

## 2. Principles

- Uses the existing core: proposals, votes, staged payouts, the public record. Each of these DAOs is a btc-dao DAO, not a separate product.
- Money moves only between DAO treasuries, never to a person's wallet.
- Applicants are checked from their public record, not paperwork.
- **Repayable grants are DAO to DAO only.** A DAO does not lend to its own members (`member-loans.md`); members may lend to their DAO.
- Nothing is legally enforceable. Repayment rests on the public record and on reputation: an unpaid grant shows on the local DAO's dashboard, and the next application can be refused.
- The network grows on transparency and badge reputation, not fixed obligations: no fees, levies or required contributions beyond what a repayable grant states.

### 2.1 No authority over branches

The GRANTS DAO is where funds start, not a head office. It can fund or decline; it cannot direct. To be written into its charter:

- **No say over a funded DAO.** Once sats reach a DAO's treasury, they belong to that DAO. The GRANTS DAO has no part in its decisions, rules, members or council, and cannot take funds back.
- **Funding from anywhere.** A local or programme DAO may take donations or grants from any other source, including donors who give to it directly.
- **Forkable.** The GRANTS DAO is a btc-dao DAO like any other. A second gateway with different priorities is welcome, not a split.

---

## 3. Flow

| Stage | Who | What happens |
|---|---|---|
| **Give** | Donors → GRANTS DAO | Sats sent to the GRANTS DAO treasury, optionally labelled (name or nickname, a note). |
| **Fund the programme** | GRANTS DAO → SEEDSIGNER DAO | The SEEDSIGNER DAO applies (signed by its DAO npub); a GRANTS DAO member sponsors it into a payout proposal with tranches. |
| **Apply** | Local DAO → SEEDSIGNER DAO | A local DAO applies for a kit, signed by its DAO npub. |
| **Decide** | SEEDSIGNER DAO | Its members check the applicant's record and vote. This is the decision that counts. |
| **Supply** | SEEDSIGNER DAO → local DAO | A kit (bought and sent by the SEEDSIGNER DAO) or its value in sats to the local DAO's treasury. The amount owed is fixed in sats on the day of delivery. |
| **Repay** | Local DAO → GRANTS DAO | When it can, the local DAO votes a repayment payout to the GRANTS DAO treasury, referencing the grant. Partial repayments count. |
| **Next tranche** | GRANTS DAO → SEEDSIGNER DAO | Later tranches depend on the programme's repayment record (section 5). |

---

## 4. Repayable grants

A repayable grant is a grant with an amount owed and no deadline: "repay when you can."

- **Interest-free**, recorded and repaid in sats.
- **No fixed date.** The record shows what is owed and for how long.
- **Repaid to the GRANTS DAO,** not to the programme DAO, so there is one ledger of what is owed and one story on the website.
- **Pay it forward:** each repayment is labelled with the grant it settles, so the website can show the chain ("kit 3 was paid for by DAO 1's repayment").
- **Forgiving:** the GRANTS DAO can vote to turn what is left of a repayable grant into a gift, for example when a local DAO closes in good standing.
- **Ordinary grants still exist.** A programme says in its application which kind it gives, or a mix (the hybrid model).

---

## 5. How a programme DAO is measured

The SEEDSIGNER DAO makes the decisions, so it is measured by the outcome of its repayable grants. Computed from the records, shown on the GRANTS DAO website and the dashboard:

| Measure | Meaning |
|---|---|
| **Repayment rate** | Sats repaid ÷ sats granted, across all its repayable grants |
| **Fully repaid** | Grants repaid in full, out of all grants made |
| **Time to repay** | Median months from delivery to full repayment |
| **Outstanding** | Sats still owed, and how many grants, by age |
| **Still active** | Local DAOs it supported that are still running (not closed or silent) |

The GRANTS DAO sets, in its rules or charter, what it expects: for example, a new tranche once the programme's repayment rate is above a set level, or once a set number of earlier grants are fully repaid.

Local DAOs build a matching record: grants received, repaid, outstanding, shown as badges.

---

## 6. The GRANTS DAO website

The public front of the gateway, built from the record:

- Projects supported: each programme DAO and each local DAO it funded, with amounts, dates and links to their records.
- Repayment status of every repayable grant, and the pay-it-forward chain.
- The programme measures (section 5).
- Donations received, with labels where given.
- What the GRANTS DAO funds and what it does not.

It can start from the `btc-dao-homepage` wrapper.

---

## 7. Checking an applicant

Shown automatically from the applicant's own record and the dashboard:

- Its descriptor and the floor result (`protocol.md` 6.5).
- "Unauthorised spends: 0" across its descriptor chain.
- Age, members, council and badges.
- Funding model and steady I/O.
- Earlier grants from this network, and what it repaid.

The payout address must belong to the applicant's current descriptor. If the applicant changes council before a payment, the payment goes to the new treasury, and what it owes carries over.

---

## 8. Additions to the core

- **Application event:** a new event kind, signed by the applicant DAO's npub (`discussion-and-comms.md`, section 4), referencing its `dao_id`. A DAO's relay accepts it from outside keys, as it does for discovery.
- **Repayable grant:** a payout field marking an outgoing grant as repayable, with the amount owed and where repayments go.
- **Repayment:** a payout category `grant_repayment` referencing the grant, so both DAOs' records show it settled.
- **Labelled inflows:** a label on an incoming txid ("donation from…", "repayment of…"), shown on the treasury page and in Accounts.
- **Accounts:** the borrowing DAO shows what it owes other DAOs beside what it owes its members; the GRANTS DAO shows what it is owed.
- **Address check:** the payout form checks the address against the applicant's published descriptor.

---

## 9. Keeping it alive

A grants pot runs dry when the gifts stop; repayments slow that down but do not stop it. The GRANTS DAO should set, in its charter or settings:

- a spending rule, for example never more than a quarter of the treasury in one quarter;
- a short public statement of what it funds and what it does not;
- the repayment level it expects from programme DAOs before further tranches.

---

## 10. Open questions

- Only btc-dao DAOs as applicants, or any group with a Bitcoin multisig and a public descriptor? Leaning: btc-dao DAOs; the checks depend on their record.
- Kits or sats: does the SEEDSIGNER DAO buy and ship hardware, or pay sats for the local DAO to buy its own? Leaning: kits, so quality and the SD card ceremony are consistent.
- When does a repayable grant count as defaulted, if ever? Leaning: never formally; the record shows its age, and silence or closing is visible.
- Should the application and repayable-grant events be part of the btc-dao NIP? Leaning: yes.
- Legal: collecting donations from the public and passing them on may carry rules in some countries; check before promoting.
