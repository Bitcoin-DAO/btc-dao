# The KEY route: a council key from eleven d2 dice

A third way for a council member to make their key at the [council key workshop](../README.md), beside the ready-made card and the SeedSigner's own entropy: eleven two-sided dice and printed word sheets, from the KEY design. The rolling and looking up happen at the table with no device; the SeedSigner is used only for word 12 (its checksum), so one SeedSigner serves a whole room.

| File | What it is |
| --- | --- |
| `key-d2-steps.pdf` | The step sheet (page 1) and a roll log for one member (page 2). Print page 1 per table, page 2 per member on this route |
| `make_key_steps.py` | Makes the step sheet: `python3 make_key_steps.py [--network testnet4]` (needs `embit reportlab`) |
| `key-dice-strips.pdf` | The dice strip (A4 landscape, wordless, cut out): one slot per die by colour and dots, two row strips and one for row 12. The dice are placed the same way up as they landed |
| `key-dice.pdf` | The eleven dice explained on one page |
| `key-bip39-word-sheets-en.pdf` | KEY word sheets A–D: the 2048 BIP39 words in official order, by sheet (orange dice), row (white) and column (black), each with its number from 0000 |
| `key-bip39-number-sheets-en.pdf` | KEY number sheets A–D: the same positions as numbers only, for stamping numbers rather than words |

**The dice:** 2 orange (sheet A–D), 5 white (row 0–31), 4 black (column 0–15), each placed in its slot on the dice strip, the same way up as it landed: colour gives the group, the number of dots the place, fewest on the left. Read together they are an 11-bit number: a word's position in the BIP39 list, counting from 0000.

**Word 12:** one more roll; its 2 orange and 5 white faces are entered on the SeedSigner as 7 coin flips (Tools → Calc 12th/24th word), which works out the checksum. Word 12 is always on the sheet and in the row those 7 dice give.

**Secrets:** the sheets and the step sheet hold none. A filled-in roll log holds the key: shred it once the SeedSigner's 12 words match card 3.
