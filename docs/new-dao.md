# Starting a new DAO: checklist

Everything a new DAO needs, from the first decisions to the days after its founding, in order. Each step links to where the guide explains it. Worked out on ALPHA DAO (November 2026); until the fork kit (spec, phase 4) turns it into a guided setup, an organiser with GitHub and DNS access works through it.

Tick each box in a copy of this list for your DAO.

## A. Decide

- [ ] **Name and purpose,** and the stage: practice, testnet or mainnet ([guide 8](guide.md#8-the-three-stages-practice-testnet-mainnet)).
- [ ] **Council and threshold.** At least **2 council members**, the hard minimum to found; a spare key (fewer signatures needed than seats, such as 3 of 5) is safer, and a smaller council can grow later by a council change ([guide 2.2](guide.md#22-choose-the-council-and-the-founders), [7.3](guide.md#73-changing-the-council)).
- [ ] **Languages and charter** ([guide 2.1](guide.md#21-agree-the-purpose-and-the-charter)). For mainnet also the **funding model** ([funding models](funding-models.md)).

## B. A web address of its own

Every DAO, trial stages included, gets its **own origin** (a host name of its own), so its members' keys and passkeys are kept apart from every other DAO's ([code review I-1](reviews/2026-11-14-code-review.md)). Never put two DAOs on paths of one host.

- [ ] **Address:** a subdomain of a domain you control (ALPHA: `alpha.byob.zone`), or, for mainnet, the DAO's own domain ([guide 2.3](guide.md#23-choose-the-addresses-and-hosting)).
- [ ] **GitHub organisation** for the DAO's site (ALPHA: `byob-zone`), and in its Settings → Pages, **verify the domain** (a TXT record), so no one else can claim its subdomains.
- [ ] **DNS:** a CNAME from the subdomain to `<organisation>.github.io`. No wildcard (`*`) records on the domain.
- [ ] **Repository:** an empty public repository, filled from btc-dao at a released version (`git archive` of the release), with a README note saying which version it runs ([guide 2.5](guide.md#25-set-up-the-software)).
- [ ] **`config/dao.json`:** stage, name, purpose, network; `site` and `passkeyDomain` set to the DAO's own host; relays and chain sources; the starting rules; the testnet treasury's return address (trial stages); `branding`; and `group` (step C). Council, founders and descriptor stay placeholders: the founding fills them in.
- [ ] **Founding guard,** in `config/dao.json`, before the site goes public: `"organiser"` (the organiser's identity key: they sign up as a founder with a council seat on their own phone, then **Copy the key** on the code page), `"foundingByInvitation": true` (no sign-up buttons; invited founders get the `#/founder` link), and `"repo"` (this repository's address, for the Council page's pin link). Until the DAO id is pinned, only the organiser's founding counts at this address ([guide 4](guide.md#4-the-founding-meeting)).
- [ ] **Pages:** Settings → Pages → Source: **GitHub Actions**; Custom domain: the DAO's host; once the certificate is issued, **Enforce HTTPS**.
- [ ] **Chain gateway:** add the DAO's origin (`https://alpha.byob.zone`) to `ALLOWED_ORIGINS` in btc-dao's `gateway/wrangler.toml` and push to btc-dao's main branch; Cloudflare redeploys the gateway ([chain gateway](chain-gateway.md)). Without it the site cannot read the treasury.
- [ ] **Listing on byob.zone** (optional): add the DAO to `src/daos.ts` in the byob.zone site (its site, network, and its relays and chain sources for the page's policy), and a news post in `content/news.json`.

## C. People and communication

- [ ] **A chat group** (WhatsApp, Signal…) for the DAO's members: remote founders and candidates post their codes there, and the video calls in which a short code is read happen there. **Turn on admin approval** for new members: the link is public on the site. Give it a picture (ALPHA: `a▪`). Name it in `config/dao.json` as `"group": {"name": "…", "url": "…"}`; it is a site setting, never part of the record ([guide 4](guide.md#4-the-founding-meeting)).
- [ ] **A testnet wallet on every member's phone** for the trial stages (Mycelium Testnet Wallet): the DAO's payouts arrive there. Real wallets come with the mainnet stage.
- [ ] **A printer the phones can reach** for identity cards: AirPrint (iPhone) or Mopria (Android), on the same WiFi, A4, ink or toner (not thermal paper, which fades). Test one iPhone and one Android before the day.

## D. Council keys

- [ ] **SeedSigners:** one per table, firmware checked, network set, persistent settings on ([guide 2.4](guide.md#24-get-the-equipment), [seedsigner.md](seedsigner.md)).
- [ ] **Workshop cards:** `python3 docs/workshop/make_cards.py --name "<DAO name>" --keys <n>`; print single-sided at 100% and **delete the PDF**: it holds secret keys ([workshop](workshop/README.md)). Dice for keys of the members' own.
- [ ] **KEY route** (if members make keys from eleven d2 dice): per table, the dice, the [dice strip](workshop/key/key-dice-strips.pdf) (cut out), the [word sheets](workshop/key/key-bip39-word-sheets-en.pdf) A–D and page 1 of the [step sheet](workshop/key/key-d2-steps.pdf); per KEY member, its page 2 (the roll log). None of these hold secrets until a roll log is filled in.

## E. The founding meeting

On the day, the organiser works from the [run sheet](workshop/run-sheet.md).

- [ ] **Founders sign up** on their own phones. **Council members tick "I request a council seat"**, then scan their treasury key from the SeedSigner.
- [ ] **Codes:** in person, the organiser scans the QR and both read the short code aloud. Remote founders tap **Share**, post the message in the group, and read their short code on a **video call**. A council member's code is never added without the call.
- [ ] **Before publishing,** the setup page shows the council planned in the site file beside the one added (for example **3 of 5**), and asks before publishing a different one. If fewer council members signed up with the box ticked, stop: they sign up again.
- [ ] **Council approvals:** each council member's phone checks that the treasury key listed for them is their own before it lets them approve.
- [ ] **Identity cards:** every member prints theirs, and keeps it apart from any SeedQR card.
- [ ] **Wallets:** every member adds their address from the **Add your bitcoin address** card on the home page (Mycelium Testnet on a trial DAO).

## F. After the founding

- [ ] **The DAO id** into `config/dao.json` (`daoId`), from the **Pin the DAO id** task on the Council page (Copy, or the link that opens the file on GitHub), the same day ([guide 4.1](guide.md#41-pinning-the-dao-id)). This also switches the DAO's pulse on byob.zone from "founding" to live. If any phone then shows **Wrong DAO id**, fix the file at once.
- [ ] **Pin the relay:** add the DAO id to `ALLOWED_DAO_IDS` in btc-dao's `relay/src/config.ts`, **with the ids of every other DAO still using the relay**, build and push to main; Cloudflare redeploys the relay ([relay README](../relay/README.md)).
- [ ] **The group as the DAO's notice board:** on an open vote, and on a round waiting for council signatures, **Share in the group** sends a ready message with the link.
- [ ] **Fund the treasury** (trial stages: from the [testnet treasury](testnet-treasury.md)), and run the first rounds ([guide 5](guide.md#5-funding-the-treasury), [6.4](guide.md#64-payout-rounds-and-signing-sessions)).
- [ ] **Badges:** the members' four (Wallet, Voice, Proposer, Builder) come by doing, shown on each member's Profile; a "badge bounties" payout, if the DAO wants one, is an ordinary vote ([proposal](proposals/badges.md)).

## Planned: making this list shorter

From the review of this checklist against what was built (16 November 2026). Done in v0.9.4: the planned council shown at setup, the wallet prompt, **Share in the group**, and the [run sheet](workshop/run-sheet.md); in v0.9.5, the members' badges on their Profile. Agreed for after ALPHA DAO's founding:

- [ ] **Config-only DAO repositories:** a DAO's repository holds only `config/dao.json` and its README; its build takes the app from a btc-dao release, so updating a DAO is changing one version number (replaces the `git archive` step in B).
- [ ] **Gateway by pattern:** the chain gateway accepts any DAO host under a verified domain (`https://*.byob.zone`), so a new DAO needs no gateway push (B).
- [ ] **Config check:** a command that checks `config/dao.json` before the first deploy: hosts match, relays and chain sources reachable, council and threshold within the minimums, `group` a link.
- [ ] **Record export for the council:** a council member can save the DAO's whole record as a file, a copy that needs no relay.

Notifications stay with the chat group (**Share in the group**) until there is a reason to build more.

## Later: the next stage

A DAO moves to the next stage by being **founded again**, with every member listed as a founder: new keys, new site, new record; then the earlier one is closed ([guide 8](guide.md#8-the-three-stages-practice-testnet-mainnet)). Mainnet adds new seeds from a new key ceremony, SeedSigner keys only, and the DAO's own domain and relay.
