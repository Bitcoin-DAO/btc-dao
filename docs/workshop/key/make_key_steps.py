"""KEY route step sheet for the council key workshop: a key made from eleven two-sided (d2) dice.

Makes a printable PDF, no secrets in it:
  page 1: the steps (dice at the table with the KEY word sheets, then the SeedSigner for word 12),
  page 2: a roll log for one council member (print one per member on this route).

The dice and sheets are the KEY design: eleven dice, 2 orange (sheet A-D), 5 white (row 0-31),
4 black (column 0-15); read together they are an 11-bit number, a word's position in the
official BIP39 list counting from 0000. The word sheets are key-bip39-word-sheets-en.pdf.

Usage: python3 make_key_steps.py [--network testnet4] [--out key-d2-steps.pdf]
Needs: pip install embit reportlab (embit only to check the worked example against the word list)
"""
import argparse
from embit.wordlists.bip39 import WORDLIST
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, black, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('Sym', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('SymB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

TEAL = HexColor('#1f6f6b'); RED = HexColor('#a3341b'); GREY = HexColor('#666666'); LIGHT = HexColor('#f3e9e1')
ORANGE = HexColor('#e8834a'); WHITE_DIE = HexColor('#ffffff'); BLACK_DIE = HexColor('#222222')
W, H = A4

ap = argparse.ArgumentParser(description='KEY route step sheet')
ap.add_argument('--network', default='testnet4'); ap.add_argument('--out', default='key-d2-steps.pdf')
a = ap.parse_args()
NET = a.network.upper() + ' ONLY'

# Worked example, checked against the word list: orange ○●, white ○○○●○, black ●○●●.
EX = '01' + '00010' + '1011'
EX_N = int(EX, 2)
EX_WORD = WORDLIST[EX_N]
SHEETS = 'ABCD'
assert EX_N == 555 and EX_WORD == WORDLIST[555]

def dots(bits):
    return ''.join('●' if b == '1' else '○' for b in bits)

c = canvas.Canvas(a.out, pagesize=A4)
c.setTitle(f'Council key workshop: the KEY route, eleven d2 dice ({a.network} only)')

def header(title, sub):
    c.setFillColor(black); c.setFont('SymB', 14); c.drawString(15*mm, H-16*mm, title)
    c.setFillColor(RED); c.setFont('SymB', 9.5); c.drawRightString(W-15*mm, H-16*mm, NET)
    c.setFillColor(GREY); c.setFont('Sym', 9); c.drawString(15*mm, H-22*mm, sub); c.setFillColor(black)

def para(x, y, text, font='Sym', size=9, width=180*mm, lead=4.3*mm, color=black):
    c.setFont(font, size); c.setFillColor(color); line = ''
    for word in text.split():
        t = (line + ' ' + word).strip()
        if c.stringWidth(t, font, size) > width:
            c.drawString(x, y, line); y -= lead; line = word
        else:
            line = t
    if line:
        c.drawString(x, y, line); y -= lead
    c.setFillColor(black); return y

def section(title, steps, y, start=1):
    c.setFont('SymB', 11); c.setFillColor(TEAL); c.drawString(15*mm, y, title); c.setFillColor(black)
    y -= 6*mm
    for i, (bold, rest) in enumerate(steps, start):
        c.setFont('SymB', 9); c.drawString(15*mm, y, f'{i}.')
        bw = c.stringWidth(bold + ' ', 'SymB', 9); c.drawString(21*mm, y, bold)
        words = rest.split(); first = ''
        while words and c.stringWidth((first + ' ' + words[0]).strip(), 'Sym', 9) <= W-36*mm-bw:
            first = (first + ' ' + words.pop(0)).strip()
        c.setFont('Sym', 9); c.drawString(21*mm + bw, y, first); y -= 4.3*mm
        if words:
            y = para(21*mm, y, ' '.join(words), width=W-36*mm)
        y -= 1.2*mm
    return y - 2*mm, start + len(steps)

def die(x, y, fill, bit, s=6*mm):
    c.setFillColor(fill); c.setStrokeColor(GREY); c.roundRect(x, y, s, s, 1.2*mm, fill=1, stroke=1)
    if bit == '1':
        c.setFillColor(black if fill != BLACK_DIE else white); c.circle(x+s/2, y+s/2, 1.2*mm, fill=1, stroke=0)
    c.setFillColor(black); c.setStrokeColor(black)

# ---------- Page 1: the steps ----------
header('The KEY route: eleven d2 dice',
       'Council key workshop · a key of your own from eleven two-sided dice and the KEY word sheets, then the SeedSigner.')
y = H - 32*mm
y = para(15*mm, y, 'Use this sheet with card 3 ("A key of your own") from your card sheet. The rolling and the looking up '
         'happen at the table, with no device; you go to the SeedSigner only for word 12. When the SeedSigner shows '
         'your 12 words, carry on with step B on page 1 of the cards (the SeedQR onto the grid, scanned back), then step C.')
y -= 3*mm

y, n = section('At the table: what you need', [
    ('Eleven dice:', '2 orange, 5 white, 4 black. Line them up left to right: orange, white, black. Within each colour, '
                     'the die with the fewest dots on its dotted face goes on the left. Keep this order for every roll.'),
    ('The KEY word sheets A to D', '(one set per table), card 3, a pen, and the roll log overleaf.'),
], y)

y, n = section('Words 1 to 11, at the table', [
    ('Roll all eleven', 'and put them back in their places without turning them. Read only the top faces: ● dots, ○ blank.'),
    ('Write the pattern', 'in the roll log: 2 orange, 5 white, 4 black.'),
    ('Orange picks the sheet:', '○○ A, ○● B, ●○ C, ●● D. White picks the row, black the column: both are printed on the sheet.'),
    ('Write the word', 'and its four-digit number in the log, and the word on card 3. The number is its place in the official list, from 0000.'),
    ('Repeat', 'until you have 11 words.'),
], y, n)

y, n = section('Word 12, then the SeedSigner (one person at a time)', [
    ('Roll once more', 'and write only the 2 orange and 5 white faces: 7 results. The black dice are not used. '
                       'Word 12 holds 7 bits of your dice; its last 4 bits are a checksum the SeedSigner works out.'),
    ('On the SeedSigner:', 'Tools → Calc 12th/24th word → 12 words. Type words 1 to 11 from card 3.'),
    ('Choose coin flips', 'and enter the 7 results left to right, orange first: ● as 1, ○ as 0. Check the screen\'s own labels before you start.'),
    ('Write word 12', 'on card 3. Check it: it must be on the sheet and in the row your 7 dice give (orange and white), in any column.'),
    ('Finish the seed,', 'check all 12 words on screen against card 3, and write the fingerprint on card 3. Then go to step B on the cards.'),
], y, n)

# Worked example box
bx, bh = 15*mm, 30*mm
by = y - bh
c.setFillColor(LIGHT); c.roundRect(bx, by, W-30*mm, bh, 2*mm, fill=1, stroke=0); c.setFillColor(black)
c.setFont('SymB', 9.5); c.drawString(bx+4*mm, by+bh-6*mm, 'Worked example')
xx = bx+4*mm; yy = by+bh-16*mm
for i, b in enumerate(EX):
    fill = ORANGE if i < 2 else (WHITE_DIE if i < 7 else BLACK_DIE)
    die(xx + i*7.2*mm + (3*mm if i >= 2 else 0) + (3*mm if i >= 7 else 0), yy, fill, b)
c.setFont('Sym', 9)
tx = xx + 11*7.2*mm + 10*mm
c.drawString(tx, yy+3.5*mm, f'orange {dots(EX[:2])} → sheet {SHEETS[int(EX[:2],2)]}   ·   white {dots(EX[2:7])} → row {int(EX[2:7],2)}')
c.drawString(tx, yy-1*mm, f'black {dots(EX[7:])} → column {int(EX[7:],2)}   ·   word {EX_N:04d}: {EX_WORD}')
para(bx+4*mm, by+5*mm, 'The eleven faces read as one binary number: 01 00010 1011 = 555, the 556th word, since the list counts from 0000.',
     size=8.5, width=W-38*mm, color=GREY)
y = by - 7*mm

c.setFont('SymB', 11); c.setFillColor(TEAL); c.drawString(15*mm, y, 'After'); c.setFillColor(black); y -= 6*mm
y = para(15*mm, y, 'The roll log holds your key, exactly as card 3 does. Once the SeedSigner has shown your 12 words and they match card 3, '
         'shred the log. Never photograph the log, card 3 or a SeedQR. The KEY sheets hold no secrets: keep them for the next workshop.')
c.setFont('Sym', 7.5); c.setFillColor(GREY)
c.drawString(15*mm, 10*mm, 'btc-dao · docs/workshop/key · KEY word sheets: official BIP39 English list, zero-based')
c.showPage()

# ---------- Page 2: the roll log ----------
header('Roll log · the KEY route', 'One per council member on this route. It holds a secret key once filled in: shred it after the words are checked.')
y = H - 32*mm
c.setFont('Sym', 9); c.drawString(15*mm, y, 'Name: ____________________________      Fingerprint (from the SeedSigner): ______________'); y -= 9*mm
cols = [('Roll', 12*mm), ('Orange', 18*mm), ('White', 34*mm), ('Black', 28*mm), ('Sheet', 13*mm), ('Row', 12*mm), ('Col', 12*mm), ('Number', 18*mm), ('Word', 33*mm)]
x0 = 15*mm; rh = 15*mm
c.setFillColor(LIGHT); c.rect(x0, y-7*mm, sum(w for _, w in cols), 7*mm, fill=1, stroke=0); c.setFillColor(black)
x = x0
for name, w in cols:
    c.setFont('SymB', 8.5); c.drawString(x+1.5*mm, y-5*mm, name); x += w
y -= 7*mm
for r in range(1, 13):
    x = x0
    c.setStrokeColor(GREY); c.line(x0, y-rh, x0+sum(w for _, w in cols), y-rh); c.setStrokeColor(black)
    for ci, (name, w) in enumerate(cols):
        if ci == 0:
            c.setFont('SymB', 10); c.drawString(x+3*mm, y-9*mm, str(r))
        elif ci in (1, 2, 3):
            k = (2, 5, 4)[ci-1]
            if r == 12 and ci == 3:
                c.setFont('Sym', 7.5); c.setFillColor(GREY); c.drawString(x+1.5*mm, y-9*mm, 'not used'); c.setFillColor(black)
            else:
                for j in range(k):
                    c.setStrokeColor(GREY); c.circle(x + 4*mm + j*6*mm, y-rh/2, 2.2*mm, stroke=1, fill=0); c.setStrokeColor(black)
        elif r == 12 and ci in (6, 7, 8):
            pass
        x += w
    if r == 12:
        c.setFont('Sym', 7.5); c.setFillColor(GREY)
        c.drawString(x0 + sum(w for _, w in cols[:6]) + 1.5*mm, y-6*mm, 'Word 12: from the SeedSigner')
        c.drawString(x0 + sum(w for _, w in cols[:6]) + 1.5*mm, y-10*mm, '(coin flips: ● 1, ○ 0)')
        c.setFillColor(black)
    y -= rh
c.setFont('Sym', 8.5); c.setFillColor(GREY)
para(15*mm, y-6*mm, 'Fill each circle you rolled with dots: ● for a dotted face, leave ○ for a blank one. '
     'Words 1 to 11 go on card 3 too. Before you leave the SeedSigner: all 12 words on its screen match card 3.', size=8.5, color=GREY)
c.setFont('Sym', 7.5); c.drawString(15*mm, 10*mm, 'btc-dao · docs/workshop/key · shred once the words are checked')
c.save()
print('done', a.out, f'example {EX} = {EX_N:04d} {EX_WORD}')
