# Member loans to the DAO (design draft)

Status: idea agreed 18 November 2026, not yet designed in detail or built
Scope: proposals, treasury page, Accounts, closing. No change to signing or the descriptor.

---

## 1. Summary

A member lends sats to the DAO, interest-free, and the DAO pays them back. It is the DAO version of the Italian co-op's *prestito sociale*: members fund the group's work without giving the money away.

**One direction only.** Members lend to the DAO. The DAO does not lend to members: an unwrapped DAO cannot enforce repayment, and a public record of a member's default is a poor substitute. The `revolving` funding model (advances to projects) is unchanged by this draft.

---

## 2. Principles

- **Interest-free.** Nothing is paid beyond the amount lent. This keeps it a members' arrangement, not a lending business.
- **Sats in, sats out.** A loan is recorded and repaid in sats, so neither side carries currency risk.
- **Members only.** Only members on the roster can lend. Outsiders give donations, not loans.
- **Honest balances.** Money owed to members is shown wherever the treasury balance is shown, so the DAO never looks richer than it is.
- **Repayment comes first.** Repayments rank before ordinary payouts, and every loan is repaid before a DAO closes.

---

## 3. Flow

| Stage | What happens |
|---|---|
| **Offer** | A member opens a `member_loan` proposal: amount, repayment terms (on demand with notice, or a fixed date), and their repayment address. It goes through Discussion and a vote like any other proposal. |
| **Fund** | Once it passes, the lender sends the amount to the treasury and posts the txid on the proposal. A council member confirms it against the chain; the loan is then **outstanding**. A loan not funded within a set time lapses. |
| **Owe** | The treasury page and Accounts show the loan: lender, amount, date, terms, and what is still owed. |
| **Repay** | On the fixed date, or when the lender asks (after the notice period), the repayment joins the next payout round **without a further vote**: the members already agreed the terms. Partial repayments are allowed. |
| **Settled** | When the full amount is repaid, the loan shows as settled and stays in the history. |

The lender trusts the council: they cannot take the money back alone. What protects them is the public record of what is owed and the rule that repayments come first.

---

## 4. Rules (settings)

New entries in `rules`, changed by a rules vote like any other:

- `memberLoans`: on or off (off by default).
- `loanNoticeDays`: notice an on-demand loan needs before repayment (for example 30).
- `maxLoanSats`: largest single loan; and optionally `maxLoansOutstandingSats`, the most the DAO may owe members in total.
- `loanFundingDays`: how long a passed loan has to be funded before it lapses.

---

## 5. Where it touches the existing design

- **Proposal type:** `member_loan` as a new proposal type (protocol 4.1), and `loan_repayment` as a payout category (4.1.1) so repayments are totalled separately from spending.
- **Rounds (6.1):** a due repayment is included in the next round before other payouts. If the treasury cannot cover all due repayments, they are paid in order of due date, then smaller first.
- **Treasury cap (6.4):** loans count towards the balance. Members decide whether to raise the cap or refuse loans that would breach it.
- **Closing (6.1, closing round):** a `close` proposal cannot be tallied as passed while any loan is outstanding, unless the closing round repays every lender first and sends only the rest to the destination.
- **Accounts** (`payments-and-accounts.md`): a "Owed to members" line, and "free balance = treasury − owed to members".
- **Dashboard:** a listed DAO shows its free balance beside the treasury, and the total owed to members.
- **Steady I/O** (`funding-models.md`): loans in and repayments out are left out of the inflow and outflow medians, so borrowing does not look like income.
- **Council change (6.1):** outstanding loans carry over to the new treasury; nothing changes for the lender.

---

## 6. Open questions

- Should a lender be able to vote on their own loan? Leaning: yes, as with a payout to oneself; the vote is public.
- Does the DAO need a way to refuse an on-demand repayment it cannot afford, or simply pay as funds arrive? Leaning: pay as funds arrive, in due order.
- Can a loan be turned into a donation by the lender later (a "forgive" step)? Leaning: yes, by a signed statement from the lender; no vote needed.
- Legal: interest-free loans among the members of a closed group are a different matter from lending to the public, but this needs checking per country before it is promoted.
