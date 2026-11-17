# Draft: payment requests and DAO accounts

17 November 2026 · **design discussion, not yet built.** Nothing here changes `protocol.md` until a later draft names the events and rules. Companion to [`action-gateway.md`](action-gateway.md): the email module carries payment requests, and Agents buy from the companies section 1 describes.

---

## 1. Background: how registered companies take bitcoin

Researched 17 November 2026. On-chain bitcoin is accepted by registered companies and public bodies, but mostly **as a way of paying, not as the currency of the bill**: the bill is in fiat, a processor quotes a BTC amount, and the payment is converted at once.

- **Lugano** (Plan ₿): all municipal bills (taxes, fines, tuition) payable in BTC by the QR code on standard Swiss invoices; over 400 businesses accept it; payments converted to Swiss francs at once through Bitcoin Suisse. Zug (city and canton) and Zermatt also accept it.
- **Italy:** the utility NordOvest Energie accepted bitcoin through the processor Tinkl.it, converted to euros. BPay is an Italian non-custodial, open-source processor built for companies' accounting rules.
- **Invoicing services** (BTCPay Server, Zaprite, OpenNode) mostly price in fiat and fix the BTC amount when payment starts. BTCPay can price in sats; Zaprite reads an xpub or multisig vault.

**Consequences for a DAO:**

| The DAO as | What happens | Fit |
| --- | --- | --- |
| **Seller** | The DAO prices in sats; a company pays the exact amount and records the fiat value on its own books | Good |
| **Buyer** | A company's processor quotes a BTC amount and address that expire within minutes; a SeedSigner council signs in hours or days | Poor, unless the counterparty accepts a fixed sats amount with a longer window |

## 2. Principles (decided)

- **Bitcoin only.** Every payment request is denominated in BTC (sats). Fiat values appear only as information.
- **On-chain only.** Lightning is out of scope here.
- **A PDF** payment request, attachable to email.
- **A DAO Accounts section** in the app.

## 3. Payment requests

### 3.1 Name

*Proposed:* **payment request** (*richiesta di pagamento*), and once paid, **receipt** (*ricevuta*), never "invoice" or *fattura*. A DAO with no legal identity cannot issue a fiscal invoice, and no company should mistake its document for one.

### 3.2 Contents

A record event, from which the PDF is generated in the app, so nothing exists that is not also on the record:

- the DAO's name, domain and npub; a reference number (`<DAO>-PR-0001`);
- the counterparty (as given) and description;
- the amount **in sats**; the fiat value at issue, marked as information only;
- a **fresh treasury receive address** and its BIP21 QR (`bitcoin:<address>?amount=<btc>&label=<ref>`);
- due date and terms: confirmations counted as paid, what happens if underpaid or overpaid;
- the **verification link and hash**, as on the DAO's emails (action gateway 9.4): the recipient checks it is genuine and follows its status;
- the line: *"Payment request from an unincorporated DAO. Not a fiscal invoice."*

### 3.3 Matching and status

- The treasury descriptor is public, so the app derives fresh addresses with no keys, no server and no processor. One address per request; a payment is matched by its address.
- Status, derived from the chain: **open → seen (mempool) → paid (N confirmations) → closed**, or **underpaid**, **overpaid**, **expired**.
- On payment, a **receipt** PDF with the transaction id.
- **Gap limit:** a standard wallet restoring from the recovery sheet stops looking after about 20 unused addresses in a row (protocol 6.4). Open requests reserve addresses, so the number of open requests must stay below the gap limit, and an expired request's address is reused only if it never received anything.
- Requests share the receive branch with the donation address and pledge addresses; the treasury page keeps them apart.

### 3.4 Sending

As an email attachment once attachments exist (action gateway 9.6), or as a link until then. Sending is correspondence: it goes through the proposal process.

## 4. Paying companies: the payment window

*Proposed rule for suppliers and Agent tasks:* a counterparty must accept a **fixed sats amount** with a **payment window of several days**, or a plain on-chain address without a processor quote. Otherwise: prepaid account credit where possible, or no deal. The same problem affects the domain's renewal (action gateway 6).

## 5. DAO Accounts

A section of the app, computed from the record and the chain, with no data entry.

| View | Contents | Source |
| --- | --- | --- |
| Balance | DAO funds, held for members, committed | exists (decisions: member assets; protocol 4.6.5) |
| Income | payment requests paid, donations, by category | new: payment requests |
| Spending | payouts by category: general, operations, distribution, Agent tasks, module costs | payout categories (4.1.1), extended |
| Owed to the DAO | open payment requests and their age | new |
| Owed by the DAO | passed payouts not yet paid | committed (4.6.5) |
| Fiat values | each transaction's value on its date, information only | new: a price source, named on every statement |
| Statements | monthly and yearly, PDF and spreadsheet export | new |
| Health | steady I/O (median monthly inflow ÷ outflow, 12 months) | funding models |

Statements are for members, their accountants, and counterparties checking the DAO.

## 6. Payment Request #0001: DAO to DAO

Decided 17 November 2026: the first payment request is **DAO to DAO**. A parent DAO (ALPHA DAO, say) sells **setup support** to a DAO forked from it: forking, deploying, the founding workshop, Operator setup.

- **Why services, and why another DAO:** no physical goods; a digital, recordable delivery; neither side needs a fiscal invoice, both being unincorporated and bitcoin-only; a real need every new DAO has.
- **It runs every part:** fork → founding → Enable email → correspondence vote → payment request #0001 (PDF, verification link) → the buyer's vote → a round signed on SeedSigners → payment matched on-chain → receipt → the Agent's tranches paid → both DAOs' accounts.
- **Proved from both records:** the buyer's treasury pays an address of the seller's treasury, both descriptors public; the request on one record, the vote to pay on the other.
- **Badges:** First sale, First purchase, Trading partner, Mentor ([`proposals/badges.md`](../proposals/badges.md) 3.3), and Agent for whoever delivers (1.3).
- **Like the pizza:** the Bitcoin pizza (22 May 2010) proved bitcoin could buy something real; #0001 would show a group with no legal existence can sell something real. Kept small and ordinary, and marked: #0001, its receipt and txid, its hash timestamped (OpenTimestamps).
- **Later:** corporate clients from #0002 on: technical support with a fixed scope rather than open-ended consultancy (less professional liability), first to bitcoin-native companies, since a registered company usually needs a fiscal invoice.

### 6.1 The mentoring package

Decided 17 November 2026. How the setup support behind #0001 works in practice.

- **Who mentors:** the parent DAO's **Agents**, not its council. Mentoring is an Agent task in the parent (claimed, delivered in tranches, reported, paid); the parent's council stays home and signs the parent's treasury, including the round that pays the mentoring Agents.
- **From outside:** the mentor does not join the child as a member. The child's record is public, so the mentor can follow it without membership, and the child's competence stays its own ([`proposals/badges.md`](../proposals/badges.md) 4.2).
- **Never the child's keys:** no council seat, no Operator role, never a seed seen. In the key ceremony the mentor runs the workshop; the child's members cut their own keys.
- **The channel:** the parent DAO creates a **Mentoring WhatsApp group** and invites the new DAO's council. When the support period ends they are removed from the group, and the process repeats for the next child.

| Tranche | Milestone | Done by |
| --- | --- | --- |
| 1 | **Plan:** purpose, funding model, charter choices; the child decides, the mentor explains | call, in the Mentoring group |
| 2 | **Fork and deploy:** repo, domain or subdomain, site live; if the mentor's Agent does it, a handover ceremony ([`action-gateway.md`](action-gateway.md) 5.3) passes it to the child's Operator, so the child owns everything | Agent, then the child's Operator |
| 3 | **Founding workshop:** the key ceremony on the child's SeedSigners; the genesis names its parent | the child's founders, the mentor guiding |
| 4 | **First round:** a proposal, a vote and a payout round signed, the mentor watching | the child's council |
| 5 | **Modules:** Enable email and the rest | the child's Operator |

**Paying for it closes the loop.** The child's first payout can be the one that pays the parent's payment request: its first real act pays for its own founding, and earns it **First payout** and **First purchase** together (stage 3 of the path). The parent issues one payment request per tranche, or one for the package with the tranches as its terms; until the child has an email module, the request reaches it as a link in the Mentoring group.

**To decide before #0001:** the scope and deliverables; the price in sats and its tranches; the delivering Agent; who accepts delivery on the buyer's side.

## 7. Open questions

- [ ] **Does every payment request need its own vote?** All comms go through proposals; voting each sale could slow selling. Alternative: one vote on a price list or an agreement, within which requests are issued without a further vote
- [ ] The name: payment request / receipt (3.1)
- [ ] The supplier payment-window rule (4)
- [ ] Confirmations counted as paid; underpayment and overpayment handling; default due date
- [ ] Price source for fiat values, and how it is named
- [ ] Protocol: event kind(s) for payment requests and their status; new spending categories
- [ ] Optional: the child votes the mentor in as a plain member for the mentoring period (barred from council and Operator, marked "mentor", planned exit), so the mentor can post in its discussion threads; default is the Mentoring group only
- [ ] Legal check (Italy, UK): an unincorporated DAO selling for bitcoin, and what the counterparty's accountant needs
