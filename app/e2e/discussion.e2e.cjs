// End-to-end, discussion (protocol 4.5): idea → versions → posts → submit → vote, read-only visitors,
// "new since your last visit", the frozen draft, and withdrawal.
const { chromium } = require('playwright');
const fs = require('fs');

const URL0 = 'http://localhost:4173/';
const SHOTS = __dirname + '/out/shots-disc';
fs.mkdirSync(SHOTS, { recursive: true });
const log = (...a) => console.log('•', ...a);
let failures = 0;
const check = (cond, what) => {
  console.log(cond ? '  ✓' : '  ✗', what);
  if (!cond) failures++;
};
const ALL = [];
const shot = (page, name) => page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });

async function phone(browser, label) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'it-IT', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { protocol: 'ctap2', ctap2Version: 'ctap2_1', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true, hasPrf: true },
  });
  page.on('pageerror', e => console.log(`  [${label}] pageerror`, e.message));
  page.on('dialog', d => d.accept());
  ALL.push({ page, label });
  return { ctx, page, label };
}

const seen = loc => loc.first().waitFor({ timeout: 20000 }).then(() => true, () => false);
const copied = page => page.evaluate(() => navigator.clipboard.readText());

async function signUp(page, name, council) {
  await page.goto(URL0 + '#/founder');
  await page.getByRole('textbox').fill(name);
  if (council) await page.getByLabel('Chiedo un posto nel Consiglio').check();
  await page.getByLabel(/Ho almeno 18 anni/).check();
  await page.getByRole('button', { name: 'Avanti' }).click();
  await page.getByRole('button', { name: 'Crea con impronta o volto' }).click();
  await page.getByRole('button', { name: 'Copia il codice' }).click();
  return copied(page);
}

async function paste(page, code) {
  await page.getByText('La fotocamera non è disponibile').waitFor();
  await page.locator('.scanner textarea').fill(code);
  await page.getByRole('button', { name: 'Usa', exact: true }).click();
}

async function open(page, hash) {
  await page.goto(URL0 + hash);
  await page.reload();
}

async function vote(page, id, choice) {
  await open(page, `#/p/${id}`);
  await page.getByRole('button', { name: choice, exact: true }).click();
  // Wait for this vote, not any earlier one still on the page.
  await page.getByText(new RegExp(`Il tuo voto: ${choice}\\.`)).waitFor({ timeout: 15000 });
}

async function councilAction(page, buttonName) {
  await open(page, '#/council');
  const b = page.getByRole('button', { name: buttonName, exact: true });
  await b.waitFor({ timeout: 20000 });
  await b.click();
  await b.waitFor({ state: 'detached', timeout: 20000 }); // approved, or in effect once the last approval lands
}

(async () => {
  const browser = await chromium.launch();
  const [A, B, C, F1] = await Promise.all(['@anna', '@marco', '@luca', '@elena'].map(n => phone(browser, n)));

  log('Founding: 3 council, 1 founder');
  const codes = {};
  for (const [p, n, c] of [[A, '@anna', 1], [B, '@marco', 1], [C, '@luca', 1], [F1, '@elena', 0]]) codes[n] = await signUp(p.page, n, !!c);
  const a = A.page;
  await a.goto(URL0 + '#/setup');
  await a.getByRole('button', { name: '2 · Consiglio' }).click();
  for (const n of ['@marco', '@luca']) {
    await a.getByRole('button', { name: 'Scansiona un membro del Consiglio' }).click();
    await paste(a, codes[n]);
    await a.getByRole('button', { name: 'Coincide: aggiungi' }).click();
  }
  await a.getByRole('button', { name: '3 · Fondatori' }).click();
  await a.getByRole('button', { name: 'Scansiona un fondatore' }).click();
  await paste(a, codes['@elena']);
  await a.getByRole('button', { name: 'Coincide: aggiungi' }).click();
  await a.getByRole('button', { name: '4 · Pubblica' }).click();
  await a.getByRole('button', { name: 'Firma e pubblica' }).click();
  await a.getByText('Pubblicate ✓').waitFor({ timeout: 20000 });
  for (const p of [B, C]) {
    await open(p.page, '#/founder');
    await p.page.getByRole('button', { name: 'Approva e firma' }).click();
    await p.page.getByText(/Hai approvato ✓|è fondata ✓/).first().waitFor({ timeout: 15000 });
  }
  for (const p of [A, B, F1]) {
    await open(p.page, '#/founder');
    await p.page.getByRole('button', { name: 'Proteggi la chiave e continua' }).click({ timeout: 20000 });
    await p.page.getByText('Stampa la tua tessera d\'identità').waitFor({ timeout: 20000 });
  }
  check(true, 'founded');

  log('Idea: a title and a line open a thread');
  const f = F1.page;
  await open(f, '#/proposals');
  await f.getByRole('button', { name: 'Nuova idea' }).click();
  await f.getByLabel('Titolo', { exact: true }).fill('Un forno solare per la piazza');
  await f.getByLabel('Una riga o due').fill('Da usare alle feste del quartiere.');
  await f.getByRole('button', { name: 'Apri la discussione' }).click();
  await f.waitForURL(/#\/d\/[0-9a-f]{64}$/);
  const threadId = f.url().split('/d/')[1];
  check(await seen(f.getByText('Bozza v1')), 'thread opens as draft v1');
  check(await seen(f.getByText(/Per ora solo un'idea/)), 'an idea cannot be submitted yet');
  await shot(f, '01-idea');

  log('A visitor reads, without a post box');
  const visitor = await phone(browser, 'visitor');
  await visitor.page.goto(URL0 + `#/d/${threadId}`);
  check(await seen(visitor.page.getByRole('heading', { name: 'Un forno solare per la piazza' })), 'visitor reads the thread');
  check(await seen(visitor.page.getByText('Chiunque può leggere. Commentano solo i membri')), 'visitor is told only members post');
  check(await visitor.page.getByRole('button', { name: 'Firma e pubblica il commento' }).count() === 0, 'no post box for a visitor');

  log('Council member posts; the author sees it as new');
  await open(a, `#/d/${threadId}`);
  check(await a.getByRole('button', { name: /Presenta la v/ }).count() === 0, 'only the author can submit');
  await a.getByLabel('Il tuo commento').fill('Dove lo mettiamo? Info: https://example.org/forno');
  await a.getByRole('button', { name: 'Firma e pubblica il commento' }).click();
  await a.getByText('Dove lo mettiamo?').waitFor({ timeout: 15000 });
  check(await seen(a.getByRole('link', { name: 'https://example.org/forno' })), 'links in posts are clickable');
  await open(f, '#/discussion');
  check(await seen(f.locator('.footer').getByText('1', { exact: true })), 'footer shows one thread with news');
  check(await seen(f.locator('a.card').filter({ hasText: 'Un forno solare' }).getByText('Nuovo')), 'thread marked new in the list');
  await shot(f, '02-list');
  await f.locator('a.card').filter({ hasText: 'Un forno solare' }).click();
  check(await seen(f.locator('article').filter({ hasText: 'Dove lo mettiamo?' }).getByText('Nuovo')), 'new post marked in the thread');

  log('Author posts v2 with the proposal fields');
  await f.getByRole('button', { name: 'Scrivi la versione v2' }).click();
  await f.waitForURL(/\/edit$/);
  check(await f.getByLabel('Titolo', { exact: true }).inputValue() === 'Un forno solare per la piazza', 'v2 starts from v1');
  await f.getByLabel('Tipo di proposta').selectOption('statement');
  await f.getByLabel('Testo vincolante').fill('Il DAO sostiene un forno solare in piazza, nel cortile della scuola.');
  await f.getByRole('button', { name: 'Pubblica la versione v2' }).click();
  await f.waitForURL(/#\/d\/[0-9a-f]{64}$/);
  check(await seen(f.getByText('Bozza v2')), 'draft is at v2');
  check(await seen(f.getByText('ha pubblicato la v2')), 'v2 in the timeline');
  await shot(f, '03-v2');

  log('Submit v2: proposal opens, draft freezes, thread continues');
  await f.getByRole('button', { name: 'Presenta la v2 come proposta' }).click();
  await f.getByRole('button', { name: 'Presenta la v2', exact: true }).click();
  await f.waitForURL(/#\/p\/[0-9a-f]{64}$/);
  const pid = f.url().split('/p/')[1];
  check(await seen(f.getByRole('link', { name: 'Apri (1 commento) →' })), 'proposal page links the discussion');
  check(await seen(f.locator('.kv').filter({ hasText: 'Versione' }).getByText('v2')), 'proposal page shows the version');
  check(await f.getByText('Approfondimento').count() === 0, 'no external link box');
  await shot(f, '04-proposal');
  await f.getByRole('link', { name: /Apri \(1 commento\)/ }).click();
  check(await seen(f.getByText(/Presentata dalla versione v2/)), 'thread shows the submitted version');
  check(await f.getByRole('button', { name: /Scrivi la versione/ }).count() === 0, 'frozen: no new versions');
  const b = B.page;
  await open(b, `#/d/${threadId}`);
  await b.getByLabel('Il tuo commento').fill('Voto sì.');
  await b.getByRole('button', { name: 'Firma e pubblica il commento' }).click();
  check(await seen(b.getByText('Voto sì.')), 'posts continue through the vote');
  await open(b, `#/p/${pid}`);
  await b.getByRole('button', { name: 'Sì', exact: true }).click();
  check(await seen(b.getByText(/Il tuo voto: Sì\./)), 'vote works as before');

  log('Withdraw a second draft');
  await open(f, '#/idea');
  await f.getByLabel('Titolo', { exact: true }).fill('Idea da ritirare');
  await f.getByRole('button', { name: 'Apri la discussione' }).click();
  await f.waitForURL(/#\/d\/[0-9a-f]{64}$/);
  await f.getByRole('button', { name: 'Ritira la bozza' }).first().click();
  await f.locator('.dialog').getByRole('button', { name: 'Ritira la bozza' }).click();
  check(await seen(f.getByText('Ritirata')), 'draft withdrawn');
  check(await f.getByRole('button', { name: /Scrivi la versione/ }).count() === 0, 'withdrawn: no new versions');
  await shot(f, '05-withdrawn');

  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})().catch(async e => {
  console.error(e);
  for (const { page, label } of ALL) {
    try {
      await page.screenshot({ path: `${SHOTS}/fail-${label.replace(/[^a-z0-9-]/gi, '')}.png`, fullPage: true });
      console.log(`--- ${label}:`, (await page.locator('main').innerText()).slice(0, 600).replace(/\n+/g, ' | '));
    } catch {}
  }
  process.exit(1);
});
