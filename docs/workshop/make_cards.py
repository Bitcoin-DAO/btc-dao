"""Council key workshop cards for a btc-dao DAO.

Makes a printable PDF: a page of steps, then one sheet per council member with three cards:
  1. a ready-made SeedQR (a fresh random key, made on this computer: for practice, never for real funds),
  2. a card to copy that key's 12 words onto,
  3. a blank Compact SeedQR grid and word lines for a key of the member's own, made on the SeedSigner with dice.

Every run makes new random keys. The PDF holds secret keys: print it, never commit it, share it or keep it online.
--sample makes a copy for showing the layout: its ready-made QR codes are crossed out and marked SAMPLE.

Usage: python3 make_cards.py --name "ALPHA DAO" --keys 5 [--network testnet4] [--out cards.pdf] [--sample]
Needs: pip install embit segno reportlab
"""
import argparse, io, secrets, segno
from embit import bip39, bip32
from embit.wordlists.bip39 import WORDLIST
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor, black

TEAL = HexColor('#1f6f6b'); RED = HexColor('#a3341b'); GREY = HexColor('#666666'); LIGHT = HexColor('#f3e9e1'); FAINT = HexColor('#b8b8b8')
W, H = A4

ap = argparse.ArgumentParser(description='Council key workshop cards')
ap.add_argument('--name', required=True); ap.add_argument('--keys', type=int, default=5)
ap.add_argument('--network', default='testnet4'); ap.add_argument('--out', default='council-key-cards.pdf')
ap.add_argument('--sample', action='store_true')
a = ap.parse_args()
NAME, N, NET = a.name, a.keys, a.network.upper() + ' ONLY'

# Fresh random keys: 16 bytes of entropy each, as 12 words. The card's SeedQR is the standard one:
# the 12 word indexes as 4 digits each (48 digits), which the SeedSigner scans.
keys = []
for n in range(1, N + 1):
    words = bip39.mnemonic_from_bytes(secrets.token_bytes(16)).split()
    digits = ''.join(f'{WORDLIST.index(w):04d}' for w in words)
    qr = segno.make(digits, version=2, error='l', mode='numeric', boost_error=False)
    fp = bip32.HDKey.from_seed(bip39.mnemonic_to_seed(' '.join(words))).my_fingerprint.hex()
    keys.append(dict(n=n, qr=qr, fp=fp))

c = canvas.Canvas(a.out, pagesize=A4)
c.setTitle(f'{NAME} workshop: council key cards ({a.network} only)' + (' · SAMPLE' if a.sample else ''))

def header(sub):
    c.setFillColor(black); c.setFont('Helvetica-Bold', 14)
    c.drawString(15*mm, H-16*mm, f'{NAME} · council key workshop' + ('   ·   SAMPLE' if a.sample else ''))
    c.setFillColor(RED); c.setFont('Helvetica-Bold', 9.5)
    c.drawRightString(W-15*mm, H-16*mm, NET)
    c.setFillColor(GREY); c.setFont('Helvetica', 9)
    c.drawString(15*mm, H-22*mm, sub)
    c.setFillColor(black)

def para(x, y, text, font='Helvetica', size=9, width=180*mm, lead=4.3*mm, color=black):
    c.setFont(font, size); c.setFillColor(color)
    line = ''
    for word in text.split():
        t = (line + ' ' + word).strip()
        if c.stringWidth(t, font, size) > width:
            c.drawString(x, y, line); y -= lead; line = word
        else: line = t
    if line: c.drawString(x, y, line); y -= lead
    c.setFillColor(black)
    return y

def section(title, steps, y):
    c.setFont('Helvetica-Bold', 11); c.setFillColor(TEAL); c.drawString(15*mm, y, title); c.setFillColor(black)
    y -= 6*mm
    for i, (bold, rest) in enumerate(steps, 1):
        c.setFont('Helvetica-Bold', 9); c.drawString(15*mm, y, f'{i}.')
        bw = c.stringWidth(bold + ' ', 'Helvetica-Bold', 9)
        c.drawString(21*mm, y, bold)
        # First line after the bold words, wrapped lines back at the margin.
        words = rest.split(); first = ''
        while words and c.stringWidth((first + ' ' + words[0]).strip(), 'Helvetica', 9) <= W-36*mm-bw:
            first = (first + ' ' + words.pop(0)).strip()
        c.setFont('Helvetica', 9); c.drawString(21*mm + bw, y, first)
        y -= 4.3*mm
        if words: y = para(21*mm, y, ' '.join(words), width=W-36*mm)
        y -= 1.6*mm
    return y - 2.5*mm

# ---- Page 1: steps
header('Step by step, for the organiser and each council member. Print single-sided at 100%, then cut out the cards.')
y = H - 30*mm
c.setFillColor(LIGHT); c.roundRect(15*mm, y-19*mm, W-30*mm, 21*mm, 3*mm, fill=1, stroke=0); c.setFillColor(black)
para(19*mm, y-4*mm, f'Each sheet has three cards. Cards 1 and 2 are a ready-made key, made on a computer for this test: quick to use, never for real funds. Card 3 is for a key of your own, made on the SeedSigner with dice, as a real DAO\'s council does. The organiser says which of the two keys each council member gives {NAME}.', size=8.8, width=W-38*mm, lead=4.1*mm)
y -= 26*mm

y = section('Before the workshop (organiser)', [
    ('SeedSigner ready.', 'Firmware 0.8.6. Settings → Advanced → Bitcoin network: Testnet, and turn on Persistent settings so it stays on Testnet after a restart.'),
    ('Cards and dice.', 'Print this file single-sided at 100%. Cut out each sheet\'s three cards. One die (or five) for the key of your own.'),
    ('Phones.', f'Each council member brings the phone and browser they will use for the DAO. The organiser prepares the founding on the {NAME} site.'),
], y)

y = section('A. The ready-made key (cards 1 and 2), about 10 minutes', [
    ('Load it.', 'Main menu → Scan, and hold card 1 under the camera. Check the fingerprint shown is the one printed on card 1. Choose Done.'),
    ('Copy the words.', 'Seeds → your fingerprint → Backup Seed → View Seed Words. Write each word on card 2 against its number, in capitals; then check all 12 again. Write the fingerprint on card 2.'),
], y)

y = section('B. A key of your own (card 3), about 30 minutes', [
    ('Roll the dice.', 'Tools → New Seed → Dice rolls → 12 words: 50 rolls, entered one by one. The SeedSigner shows your 12 words: write them on card 3, against their numbers, in capitals.'),
    ('Check the words.', 'The SeedSigner asks some of them back. Then it shows the new key\'s fingerprint: write it on card 3.'),
    ('Copy the SeedQR.', 'Seeds → that fingerprint → Backup Seed → Export as SeedQR → Compact SeedQR. The screen shows the grid a section at a time, with its letters and numbers: fill in the same squares on card 3, in pen.'),
    ('Check the card.', 'Seeds → Discard, then Scan card 3: the fingerprint must be the one you wrote. If not, compare the grid square by square.'),
], y)

y = section(f'C. Give {NAME} your key (either A or B, as the organiser says)', [
    ('Export the public key.', f'With that key loaded: Seeds → its fingerprint → Export Xpub → Multisig → Native Segwit → Sparrow. Scan the moving QR with your phone when the {NAME} site asks for your treasury key. The phone shows the fingerprint: it must match.'),
    ('Clear the device.', 'Seeds → your fingerprint → Discard, or switch the SeedSigner off. It keeps nothing. Pass it on.'),
], y)

y = section('After the workshop', [
    ('Keep the cards apart,', 'at home, never photographed. Never type the words into a phone or computer. To sign a round, bring only the SeedQR card of the key you gave the DAO; its word card is the backup.'),
], y)

c.setFont('Helvetica', 7.5); c.setFillColor(GREY)
c.drawString(15*mm, 11*mm, 'Ready-made keys:  ' + '   '.join(f"Key {k['n']}: {k['fp']}" for k in keys))
c.showPage()

def cutbox(x, y, w, h):
    c.setDash(3, 3); c.setStrokeColor(GREY); c.rect(x, y, w, h); c.setDash(); c.setStrokeColor(black)
def title(x, y, text, w):
    c.setFont('Helvetica-Bold', 10.5); c.drawString(x+5*mm, y-8*mm, text)
    c.setFillColor(RED); c.setFont('Helvetica-Bold', 7.5); c.drawRightString(x+w-5*mm, y-8*mm, NET); c.setFillColor(black)
def lines(x, y, n0, n1, width, step=8.2*mm):
    for j in range(n0, n1):
        ly = y - (j - n0) * step
        c.setFont('Helvetica-Bold', 9); c.drawRightString(x+5*mm, ly, f'{j+1}.')
        c.setStrokeColor(FAINT); c.line(x+7*mm, ly-1*mm, x+width, ly-1*mm); c.setStrokeColor(black)

CW, CH, GAP = 88*mm, 92*mm, 6*mm
for k in keys:
    header(f"Council key {k['n']} of {N} · three cards · cut along the dotted lines")
    x0 = (W - 2*CW - GAP) / 2; top = H - 27*mm
    # Card 1: ready-made key
    cutbox(x0, top-CH, CW, CH); title(x0, top, f"1 · Council key {k['n']}", CW)
    buf = io.BytesIO(); k['qr'].save(buf, kind='png', scale=24, border=4); buf.seek(0)
    q = 56*mm; qx, qy = x0+(CW-q)/2, top-12*mm-q; c.drawImage(ImageReader(buf), qx, qy, q, q)
    if a.sample:
        c.setStrokeColor(RED); c.setLineWidth(3); c.line(qx, qy, qx+q, qy+q); c.line(qx, qy+q, qx+q, qy)
        c.setFillColor(HexColor('#ffffff')); c.rect(qx+q/2-15*mm, qy+q/2-5*mm, 30*mm, 10*mm, fill=1, stroke=0)
        c.setFillColor(RED); c.setFont('Helvetica-Bold', 16); c.drawCentredString(qx+q/2, qy+q/2-2.2*mm, 'SAMPLE')
        c.setFillColor(black); c.setStrokeColor(black); c.setLineWidth(1)
    c.setFont('Helvetica', 8); c.drawString(x0+6*mm, top-CH+14*mm, 'Ready-made SeedQR · fingerprint')
    c.setFont('Courier-Bold', 13); c.drawString(x0+6*mm, top-CH+8*mm, k['fp'])
    c.setFont('Helvetica', 7); c.setFillColor(GREY); c.drawRightString(x0+CW-5*mm, top-CH+8*mm, 'Made on a computer: never for real funds'); c.setFillColor(black)
    # Card 2: its words
    x1 = x0 + CW + GAP
    cutbox(x1, top-CH, CW, CH); title(x1, top, f"2 · Key {k['n']} · its words", CW)
    lines(x1+2*mm, top-19*mm, 0, 6, 38*mm); lines(x1+44*mm, top-19*mm, 6, 12, 38*mm)
    c.setFont('Helvetica', 8); c.drawString(x1+6*mm, top-CH+16*mm, 'Fingerprint'); c.setStrokeColor(FAINT); c.line(x1+24*mm, top-CH+15*mm, x1+CW-6*mm, top-CH+15*mm)
    c.drawString(x1+6*mm, top-CH+8*mm, 'Name'); c.line(x1+16*mm, top-CH+7*mm, x1+CW-6*mm, top-CH+7*mm); c.setStrokeColor(black)
    # Card 3: a key of your own
    W3, H3 = 2*CW + GAP, 158*mm; top3 = top - CH - 7*mm
    cutbox(x0, top3-H3, W3, H3); title(x0, top3, f"3 · Council key {k['n']} · a key of your own (Compact SeedQR, 12 words)", W3)
    cell = 5.1*mm; gx = x0 + 9*mm; gy = top3 - 19*mm  # top-left of the grid
    c.setStrokeColor(FAINT); c.setLineWidth(0.4)
    for i in range(22):
        c.line(gx + i*cell, gy, gx + i*cell, gy - 21*cell)
        c.line(gx, gy - i*cell, gx + 21*cell, gy - i*cell)
    c.setStrokeColor(black); c.setLineWidth(1); c.rect(gx, gy - 21*cell, 21*cell, 21*cell); c.setLineWidth(1)
    c.setFont('Helvetica', 6.5); c.setFillColor(GREY)
    for i in range(21):
        c.drawCentredString(gx + (i+0.5)*cell, gy + 1.5*mm, chr(65+i))
        c.drawRightString(gx - 1.2*mm, gy - (i+0.72)*cell, str(i+1))
    c.setFillColor(black)
    rx = gx + 21*cell + 9*mm; rw = x0 + W3 - 6*mm - rx
    c.setFont('Helvetica-Bold', 8.5); c.drawString(rx, top3-15*mm, 'Its 12 words')
    lines(rx, top3-23*mm, 0, 12, rw, 8*mm)
    c.setFont('Helvetica', 8); c.drawString(rx, top3-H3+24*mm, 'Fingerprint'); c.setStrokeColor(FAINT); c.line(rx+18*mm, top3-H3+23*mm, rx+rw, top3-H3+23*mm)
    c.drawString(rx, top3-H3+15*mm, 'Name'); c.line(rx+10*mm, top3-H3+14*mm, rx+rw, top3-H3+14*mm); c.setStrokeColor(black)
    para(x0+6*mm, top3-H3+6*mm, 'Made on the SeedSigner: steps on page 1, section B. Fill the grid in pen, square by square from the screen. Keep this card apart from cards 1 and 2.', size=7, width=W3-12*mm, lead=3.4*mm, color=GREY)
    c.showPage()
c.save()
print(a.out, 'SAMPLE' if a.sample else '', [k['fp'] for k in keys])
