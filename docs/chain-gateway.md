# Chain gateway

**Status:** design, 8 November 2026. Not built yet. Testnet4 only.

## Why

The app reads the treasury and broadcasts payouts through public chain services. UNO's practice run (6–8 November 2026) showed the limits:

- mempool.space's testnet4 service stopped answering for hours at a time;
- Zelcore's testnet4 Blockbook answers browsers but does not let web pages read its API (no CORS header), so the app could never use it;
- public services throttle bursts, and every open page of every member reads the treasury.

With no source the app could read, UNO's closing round could not be prepared (finding 25 in `MAINNET-READINESS.md`).

## What

One small Cloudflare Worker per DAO, next to the DAO's relay: the **chain gateway**. The app talks to the DAO's own gateway first. What sits behind the gateway can change without touching the app.

```
member's phone (app) ──► DAO's chain gateway (Cloudflare Worker, free plan)
                              │  holds the provider key as a secret
                              │  adds CORS for the DAO's site
                              │  caches, rate-limits
                              ▼
                         node provider (now): QuickNode testnet4 + Blockbook add-on
                         own node (later, optional): pruned Bitcoin Core with a watch-only
                         wallet for the DAO's descriptor, behind a Cloudflare Tunnel
```

Like the relay, it is a self-managed tool per DAO, deployable from the kit, and fits a free tier.

## The app's side

No new protocol. The gateway answers in **Blockbook's format**, which the app already reads since v0.1.5 (`blockbook:` entries in `chainApi`). A DAO's config lists:

```json
"chainApi": [
  "blockbook:https://<dao>-chain.<account>.workers.dev",
  "https://mempool.space/testnet4/api"
]
```

The gateway first; mempool.space as a fallback. A source shows data but never moves coins: every payment is still checked against the treasury's descriptor on each phone.

## The gateway's side

It answers only the six requests the app makes, for the DAO's own treasury:

| App request (Blockbook path) | Behind it (QuickNode Blockbook add-on) |
| --- | --- |
| `GET /api/v2/address/{a}?details=basic` | `bb_getAddress` |
| `GET /api/v2/address/{a}?details=txs` | `bb_getAddress` with transactions |
| `GET /api/v2/utxo/{a}` | `bb_getUTXOs` |
| `GET /api/v2/tx/{txid}` | `bb_getTx` |
| `GET /api/v2/estimatefee/3` | `estimatesmartfee` (Bitcoin RPC) |
| `POST /api/v2/sendtx/` | `sendrawtransaction` (Bitcoin RPC) |

Exact method names and parameters to be confirmed against QuickNode's add-on documentation when the account exists.

**Rules**

- **Only the DAO's addresses.** The gateway reads the DAO's descriptor from its own settings (a Worker variable at first; later from the DAO's published settings, so a council change needs no redeploy) and refuses address requests for anything else. Transactions are answered only if they touch a DAO address. This keeps the free quota for the DAO and stops the gateway being used as a general explorer.
- **CORS:** allowed for the DAO's site origin only (and `http://localhost` for development).
- **Cache:** address and coin answers for 15 seconds, fee estimates for 60, transactions with confirmations for a day. Several open pages share one answer.
- **Rate limit:** per visitor, generous for a DAO's members (for example 60 requests a minute), so a stranger cannot spend the quota.
- **Broadcast:** passed straight through, and also sent to mempool.space, so a transaction reaches more than one node (finding 6).
- **Secrets:** the provider's endpoint URL and key live in Worker secrets, never in the repository or the app.
- **No keys, no spending:** the gateway never holds anything that can sign.

## Deployment (per DAO, once)

1. Create a QuickNode account (free plan) and a Bitcoin **testnet4** endpoint; enable the Blockbook add-on.
2. Cloudflare: create a Worker from the `gateway/` folder (the same way as the relay), name it after the DAO.
3. Set the Worker secrets: provider URL; variables: the DAO's site origin and descriptor.
4. Add the gateway to `chainApi` in the DAO's `config/dao.json`, first in the list, and publish the site.
5. Check from a phone: the treasury reads "via <gateway>".

## Later

- **Own node behind the same gateway:** pruned Bitcoin Core (about 2–3 GB on testnet4), watch-only wallet loaded with the DAO's descriptor at founding, reached through a Cloudflare Tunnel. The gateway uses it first and the provider as a fallback.
- **Mainnet:** the same design; the own node grows to 10–15 GB and days of sync, and the provider may need a paid plan.

## Open questions

- Is the Blockbook add-on available on QuickNode's free plan for testnet4? If not: Blockdaemon's free tier (its own address methods), translated by the gateway.
- Free-tier limits against a DAO's real load: about 15 requests per treasury reading, a reading every few minutes per open page. The cache and finding 24 (one reading shared between pages) keep this low.
