# Language of DAO content (idea to test)

Status: idea, 20 November 2026. Not decided; to be tested before anything is built.
Scope: proposals, drafts, discussion posts, announcements, incoming email. The app's own interface is already bilingual (`config/dao.json` `languages`); this draft is about what members write.

---

## 1. The question

The app speaks Italian and English, but what members write stays in the language they wrote it in. Should a DAO's content follow the reader's language too, or should a DAO simply work in one language?

One principle holds whichever way is chosen: **the signed original is the record.** Members vote on the words the author signed. A translation can help people read, but it never quietly replaces the original, unless the author signs both languages themselves.

---

## 2. Option A: one working language, chosen at founding

The simplest option, and the one many forums and global projects use ("English only").

- At founding, the DAO chooses its **working language**: Italian or English. All proposals, posts and announcements are written in it.
- The app's interface still follows each member's own language; only the content is in the working language.
- The working language is shown on the DAO's home page and on the dashboard, so people know before they join.
- Changing it is a rules change, like any other.

It fits naturally beside the existing `charterLanguage` setting: a DAO might simply use the same language for both, or the working language could become the default for `charterLanguage`.

**Good for:** local DAOs (Italian), international DAOs (English). Nothing to build beyond the setting and where it is shown.
**Cost:** members who don't read the working language rely on their browser's page translation.

---

## 3. Option B: bilingual content

For a DAO that wants both languages in its content. Possible approaches:

| Approach | How it works | Good for | Catch |
|---|---|---|---|
| **Author writes both** | Two fields, signed together | Binding text | Work for the author |
| **Author-approved draft** | A button fills in a machine translation; the author corrects it and signs both | Proposals, charter changes | One extra step when proposing |
| **Browser's built-in translator** | The app calls Chrome's on-device Translator API | Private, no server | Desktop Chrome and Edge only; not on phones |
| **Browser page translation** | "Translate this page" in Chrome or Firefox | Works today, nothing to build | In Chrome the text goes to Google; the app has no control |
| **Translation through the DAO's gateway** | A "Translate" button sends the text through the DAO's Worker to a translation service, with a self-hostable second provider (for example LibreTranslate) for the exit test | Discussion, announcements, incoming email | Machine quality; depends on a provider |
| **Member translations** | A member posts a signed translation of a text, earning a Translator badge | Important texts, the charter | Slow; needs willing members |

A layered version of option B:

1. **Proposals (binding):** the author-approved draft. Both versions are signed; if they differ, the binding language (`charterLanguage`) decides.
2. **Discussion, announcements, incoming email (not binding):** a "Translate" button, labelled "machine translation", with "show original" one tap away. Translations are never published to the record.
3. **Later:** member translations for texts the group wants translated by a person.

---

## 4. Useful either way: a language tag

Whichever option a DAO takes, every text event (proposal, draft, post, announcement) carries a language tag, set from the app's language with an option for the author to change it, and the app marks displayed text with that language (`lang` attribute).

- With option A, the app can gently warn an author writing in a language other than the working language.
- With option B, it tells the app what to translate from.
- Either way, browser page translation works properly, because the browser knows what language each text is in.

Best added before the event kinds are written up as a NIP.

---

## 5. Testing it

- Run one testnet4 DAO with option A (Italian), and note how non-Italian members cope with browser translation.
- If option B is wanted, try the gateway "Translate" button on Discussion first: it changes nothing in the record and is easy to remove.

---

## 6. Open questions

- Is option A the default for every new DAO, with option B as a module a DAO can add?
- Should the working language and `charterLanguage` be one setting or two?
- For option B, which translation service, and does the DAO's gateway pay for it or use a free tier?
