// Discussion (protocol 4.5): the list of threads, a new idea, and the thread itself.
import { useEffect, useState } from 'preact/hooks';
import { signAndPublish, useApp } from '../app';
import { fmtDate, fmtDateTime, t } from '../i18n';
import { KIND, type Event } from '../core/events';
import { POST_MAX, pinnedVersion, proposalFromVersion, type DraftFields, type DraftVersion, type Thread } from '../core/discussion';
import { proposalLabel, proposalSchemaError } from '../core/state';
import { Footer, Header, askConfirm, errText, go } from './parts';
import { Payload, statusText, typeLabel, useNameOf } from './Proposals';

// ---------- "new since your last visit", kept on this device only ----------

const seenKey = (daoId: string, id: string) => `seen:${daoId}:${id}`;
export function lastSeen(daoId: string, id: string): number {
  try {
    return Number(localStorage.getItem(seenKey(daoId, id)) ?? 0) || 0;
  } catch {
    return 0;
  }
}
function markSeen(daoId: string, id: string, at: number) {
  try {
    localStorage.setItem(seenKey(daoId, id), String(at));
  } catch { /* private window: nothing is remembered */ }
}
/** Activity by someone else since this device last opened the thread. A thread never opened counts as new. */
export function isUnread(daoId: string, th: Thread, personOf: (key: string) => string, myPerson?: string): boolean {
  const seen = lastSeen(daoId, th.id);
  if (th.timeline.some(i => i.at > seen && personOf(i.event.pubkey) !== myPerson)) return true;
  return !seen && th.author !== myPerson;
}

export function useUnreadCount(): number {
  const app = useApp();
  if (!app.daoId || !app.discussion || !app.dao) return 0;
  return app.discussion.threads.filter(th => (th.isDraft || th.posts.length > 0) && isUnread(app.daoId!, th, app.dao!.personOf, app.me?.person)).length;
}

// ---------- pieces ----------

export const postCount = (n: number) => (n === 1 ? t('dt.posts1') : t('dt.posts', { n }));

/** Plain text with web links made clickable. */
function Linked({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s<>"]+)/g);
  return (
    <p style="white-space:pre-wrap;overflow-wrap:anywhere">
      {parts.map((x, i) => (i % 2 ? <a href={x} target="_blank" rel="noopener noreferrer nofollow">{x}</a> : x))}
    </p>
  );
}

function ThreadStatus({ th }: { th: Thread }) {
  const app = useApp();
  if (th.proposal) {
    return (
      <>
        <span class="chip">{proposalLabel(app.site!.name, th.proposal.number)}</span>
        <span class={th.proposal.status === 'passed' ? 'chip teal' : 'chip'}>{statusText(th.proposal, app.dao!.now)}</span>
      </>
    );
  }
  if (th.status === 'withdrawn') return <span class="chip">{t('dt.withdrawn')}</span>;
  return <span class="chip teal">{t('dt.draft', { n: th.versions.length })}</span>;
}

function VersionBody({ f }: { f: DraftFields }) {
  return (
    <>
      <strong style="font-size:17px;line-height:1.35">{f.title}</strong>
      {f.summary && <p style="white-space:pre-wrap">{f.summary}</p>}
      {f.type && f.payload ? (
        <>
          <span class="chip" style="align-self:flex-start">{typeLabel(f.type)}</span>
          <Payload c={{ type: f.type, title: f.title, summary: f.summary, lang: f.lang, payload: f.payload }} />
        </>
      ) : (
        <p class="small">{t('dt.ideaOnly')}</p>
      )}
    </>
  );
}

function Share({ th }: { th: Thread }) {
  const app = useApp();
  const [done, setDone] = useState(false);
  const link = `${app.site!.site.replace(/\/$/, '')}/#/d/${th.id}`;
  const share = async () => {
    const text = t('dt.shareText', { dao: app.site!.name, title: th.title, link });
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }
    } catch { /* cancelled */ }
  };
  return <button type="button" class="btn secondary" onClick={share}>{done ? t('home.copied') : t('dt.share')}</button>;
}

// ---------- list ----------

export function DiscussionList() {
  const app = useApp();
  const nameOf = useNameOf();
  const threads = (app.discussion?.threads ?? []).filter(th => th.isDraft || th.posts.length > 0 || th.proposal?.status === 'open');
  return (
    <>
      <Header />
      <main>
        <div class="row">
          <h1>{t('dt.title')}</h1>
          {app.me && app.secret && <button type="button" class="btn dark" onClick={() => go('/idea')}>{t('dt.newIdea')}</button>}
        </div>
        <p class="small">{t('dt.intro')}</p>
        {threads.length === 0 && <p class="small">{t('dt.none')}</p>}
        {threads.map(th => {
          const unread = isUnread(app.daoId!, th, app.dao!.personOf, app.me?.person);
          return (
            <a class="card" style="text-decoration:none;color:inherit;gap:8px" href={`#/d/${th.id}`}>
              <div class="row" style="justify-content:flex-start;gap:8px;flex-wrap:wrap">
                <ThreadStatus th={th} />
                {unread && <span class="chip" style="background:var(--accent);color:var(--accent-ink)">{t('dt.new')}</span>}
              </div>
              <strong style="font-size:17px;line-height:1.35">{th.title}</strong>
              <div class="row small">
                <span>{nameOf(th.authorKey)} · {postCount(th.posts.length)}</span>
                <span>{fmtDateTime(th.lastActivity)}</span>
              </div>
            </a>
          );
        })}
      </main>
      <Footer />
    </>
  );
}

// ---------- new idea ----------

export function NewIdea() {
  const app = useApp();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>();
  if (!app.me || !app.secret) {
    return (
      <>
        <Header />
        <main>
          <p class="lead">{t('np.signIn')}</p>
          <button type="button" class="btn primary" onClick={() => go('/join')}>{t('nav.signin')}</button>
        </main>
      </>
    );
  }
  const open = async () => {
    setMsg(undefined);
    setBusy(true);
    try {
      const f: DraftFields = { version: 1, title: title.trim(), summary: summary.trim(), lang: app.lang };
      const { event } = await signAndPublish(KIND.draft, f);
      go(`/d/${event.id}`);
    } catch (e) {
      setMsg(errText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Header />
      <main>
        <h1>{t('dt.newIdea')}</h1>
        <p class="lead">{t('dt.ideaLead')}</p>
        <label class="field">{t('np.titleField')}<input type="text" maxLength={80} value={title} onInput={e => setTitle((e.target as HTMLInputElement).value)} /></label>
        <label class="field">
          {t('dt.ideaLine')}
          <textarea maxLength={500} value={summary} style="font-family:inherit;font-size:16px" onInput={e => setSummary((e.target as HTMLTextAreaElement).value)} />
        </label>
        <button type="button" class="btn primary" disabled={!title.trim() || busy} onClick={open}>{t('dt.openThread')}</button>
        <button type="button" class="btn link" style="align-self:flex-start" onClick={() => go('/new')}>{t('dt.fullForm')}</button>
        {msg && <p class="warnbox">{msg}</p>}
      </main>
      <Footer />
    </>
  );
}

// ---------- thread ----------

export function ThreadView({ id }: { id: string }) {
  const app = useApp();
  const s = app.dao!;
  const nameOf = useNameOf();
  const th = app.discussion?.threads.find(x => x.id === id);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>();
  const [iAm, setIAm] = useState(false);
  // What was new when the page opened stays marked while it is open.
  const [seenBefore] = useState(() => (app.daoId ? lastSeen(app.daoId, id) : 0));
  useEffect(() => {
    if (app.daoId && th) markSeen(app.daoId, id, Math.max(th.lastActivity, Math.floor(Date.now() / 1000)));
  }, [app.daoId, id, th?.lastActivity]);

  if (!th) {
    return (
      <>
        <Header />
        <main>
          <p class="lead">{t('dt.notFound')}</p>
          <button type="button" class="btn secondary" onClick={() => go('/discussion')}>{t('dt.back')}</button>
        </main>
        <Footer />
      </>
    );
  }
  const signedIn = !!app.me && !!app.secret;
  const mine = signedIn && th.author === app.me!.person;
  const open = th.isDraft && th.status === 'open';
  const pinned = pinnedVersion(th);
  const network = app.site!.network;
  const submittable = (v: DraftVersion) => {
    const c = proposalFromVersion(th.id, v);
    return !!c && !proposalSchemaError(c, network);
  };

  const run = async (f: () => Promise<void>) => {
    setMsg(undefined);
    setBusy(true);
    try {
      await f();
    } catch (e) {
      setMsg(errText(e));
    } finally {
      setBusy(false);
    }
  };
  const post = () => run(async () => {
    await signAndPublish(KIND.post, { text: text.trim() }, [['e', th.id]]);
    setText('');
  });
  const submit = (v: DraftVersion) => run(async () => {
    if (!(await askConfirm(t('dt.submitConfirm', { n: v.version }), t('dt.submitYes', { n: v.version })))) return;
    const content = proposalFromVersion(th.id, v)!;
    const { event } = await signAndPublish(KIND.proposal, content);
    const dest = content.type === 'payout' ? (content.payload.outputs as { address: string }[])[0]?.address : content.type === 'close' ? content.payload.destination : undefined;
    if (iAm && dest) await signAndPublish(KIND.confirm, { address: dest }, [['e', event.id]]);
    go(`/p/${event.id}`);
  });
  const withdraw = () => run(async () => {
    if (!(await askConfirm(t('dt.withdrawConfirm'), t('dt.withdraw'), true))) return;
    await signAndPublish(KIND.withdraw, {}, [['e', th.id]]);
  });
  const isNew = (e: Event) => seenBefore > 0 && e.created_at > seenBefore && s.personOf(e.pubkey) !== app.me?.person;
  const pinnedNeedsRecipient = pinned?.fields.type === 'payout' || pinned?.fields.type === 'close';

  return (
    <>
      <Header />
      <main>
        <div class="row" style="justify-content:flex-start;gap:8px;flex-wrap:wrap"><ThreadStatus th={th} /></div>
        <h1>{th.title}</h1>
        <p class="small">{t(th.isDraft ? 'dt.startedBy' : 'pd.by', { name: nameOf(th.authorKey), date: fmtDate(th.isDraft ? th.versions[0].event.created_at : th.proposal!.event.created_at) })}</p>

        {th.proposal && (
          <a class="card tint" style="text-decoration:none;color:inherit;gap:6px" href={`#/p/${th.proposal.event.id}`}>
            <strong>{t('dt.toProposal', { label: proposalLabel(app.site!.name, th.proposal.number) })} →</strong>
            <span class="small">{th.submittedVersion ? t('dt.submittedVersion', { n: th.submittedVersion }) : th.proposal.content.summary}</span>
          </a>
        )}

        {pinned && (
          <section class="card" aria-label={t('dt.current')}>
            <div class="row small"><strong style="color:var(--ink)">{t('dt.versionN', { n: pinned.version })}</strong><span>{th.submittedVersion ? t('dt.frozen') : t('dt.current')}</span></div>
            <VersionBody f={pinned.fields} />
            {mine && open && (
              <>
                <hr class="divider" />
                {submittable(pinned) ? (
                  <>
                    {pinnedNeedsRecipient && <label class="check"><input type="checkbox" checked={iAm} onChange={e => setIAm((e.target as HTMLInputElement).checked)} />{t('np.iAmRecipient')}</label>}
                    <button type="button" class="btn primary" disabled={busy} onClick={() => submit(pinned)}>{t('dt.submit', { n: pinned.version })}</button>
                  </>
                ) : (
                  <p class="small">{t('dt.notComplete')}</p>
                )}
                <button type="button" class="btn secondary" disabled={busy} onClick={() => go(`/d/${th.id}/edit`)}>{t('dt.newVersion', { n: th.versions.length + 1 })}</button>
                <button type="button" class="btn link" style="align-self:flex-start" disabled={busy} onClick={withdraw}>{t('dt.withdraw')}</button>
              </>
            )}
          </section>
        )}
        {th.status === 'withdrawn' && <p class="warnbox">{t('dt.withdrawnNote', { date: fmtDate(th.withdrawn!.created_at) })}</p>}

        <Share th={th} />

        <h2>{t('dt.timeline')}</h2>
        {th.timeline.length === 0 && <p class="small">{t('dt.noPosts')}</p>}
        <div class="stack">
          {th.timeline.map(item => (
            <article class="card" style={item.kind === 'version' ? 'gap:8px;border-color:var(--teal);' : 'gap:6px'}>
              <div class="row small" style="flex-wrap:wrap">
                <span>
                  <strong style="color:var(--ink)">{nameOf(item.event.pubkey)}</strong>
                  {item.kind === 'version' && <> · {t('dt.postedVersion', { n: item.v.version })}</>}
                  {isNew(item.event) && <> · <span class="ok">{t('dt.new')}</span></>}
                </span>
                <span>{fmtDateTime(item.at)}</span>
              </div>
              {item.kind === 'post' ? <Linked text={item.text} /> : (
                <>
                  {item.v !== pinned && <VersionBody f={item.v.fields} />}
                  {item.v === pinned && <p class="small">{t('dt.shownAbove')}</p>}
                  {mine && open && item.v !== pinned && submittable(item.v) && (
                    <button type="button" class="btn link" style="align-self:flex-start" disabled={busy} onClick={() => submit(item.v)}>{t('dt.submit', { n: item.v.version })}</button>
                  )}
                  {th.submittedVersion === item.v.version && <span class="ok">{t('dt.submittedHere')}</span>}
                </>
              )}
            </article>
          ))}
        </div>

        {signedIn ? (
          <section class="card">
            <label class="field">
              {t('dt.yourPost')}
              <textarea maxLength={POST_MAX} value={text} style="font-family:inherit;font-size:16px" onInput={e => setText((e.target as HTMLTextAreaElement).value)} />
              <span class="small" style="font-weight:400">{t('dt.postHint')} {text.length}/{POST_MAX}</span>
            </label>
            <button type="button" class="btn primary" disabled={!text.trim() || busy} onClick={post}>{t('dt.post')}</button>
          </section>
        ) : (
          <p class="small">{t('dt.readOnly')}</p>
        )}
        {msg && <p class="warnbox">{msg}</p>}
      </main>
      <Footer />
    </>
  );
}
