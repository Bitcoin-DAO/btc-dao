# Council key workshop

For the founding day itself, see the [run sheet](run-sheet.md): roles, timings and the three checks.

How a DAO's council makes its keys together, at a workshop, before the founding meeting. First run for ALPHA DAO (November 2026).

## The cards

`make_cards.py` makes a printable PDF: a page of steps, then one sheet per council member with three cards.

1. **A ready-made key:** a SeedQR made on the computer that prints the cards. Quick to use for a test; never for real funds, since the computer has seen it.
2. **Its words:** lines to copy that key's 12 words onto, from the SeedSigner's screen.
3. **A key of your own:** a blank Compact SeedQR grid and 12 word lines, for a key made on the SeedSigner with dice, as a real DAO's council does.

A key of your own can come from the SeedSigner (dice or camera entropy), or from **eleven d2 dice and the KEY word sheets** ([the KEY route](key/README.md)): the dice and lookups happen at the table, and the SeedSigner only works out word 12, so one SeedSigner can serve the room.

The organiser decides which of the two keys each member gives the DAO. The steps page covers both, then exporting the public key to the DAO's site.

A sample, for the layout: [sample-cards.pdf](sample-cards.pdf).

## Making the cards

```
pip install embit segno reportlab
python3 make_cards.py --name "ALPHA DAO" --keys 5 --out alpha-cards.pdf
```

`--network` (default `testnet4`) is printed on every card. Each run makes new random keys and prints their fingerprints.

**The PDF holds secret keys.** Print it on a printer you trust and delete the file. Never commit it, email it, or keep it online. The cards in the repo are made with `--sample`: their QR codes are crossed out and marked SAMPLE, so they show the layout and nothing else.

## Before the workshop

- One SeedSigner (firmware 0.8.6) per table, set to the DAO's network, with persistent settings on.
- The cards printed single-sided at 100%, and cut out.
- Dice, for the keys of the members' own: casino dice for the SeedSigner, or eleven d2 dice per table for the KEY route.
- For the KEY route: the [step sheet](key/key-d2-steps.pdf) (page 1 per table, page 2 per member), the [dice strip](key/key-dice-strips.pdf) (one per table, cut out) and the [KEY word sheets](key/key-bip39-word-sheets-en.pdf), one set per table.
- Each council member's phone, with the DAO's site open: the founding (guide, section 3) follows the key steps.

## After

The SeedQR card of the key a member gave the DAO is what they bring to sign a round. Its word card is the backup, kept apart. Unused cards are shredded.
