// Protocol 4.5: drafts, versions, posts, withdrawal and submission.
import { describe, expect, it } from 'vitest';
import { buildDiscussion, pinnedVersion, proposalFromVersion, type DraftFields } from './discussion';
import { KIND, type Event } from './events';
import { newSecret } from './identity';
import { dao } from './testkit';

const idea = (title = 'Un forno solare'): DraftFields => ({ version: 1, title, summary: 'Una riga.', lang: 'it' });
const full = (version: number, title = 'Un forno solare'): DraftFields => ({ version, title, summary: 'Testo completo.', lang: 'it', type: 'statement', payload: {} });

function setup() {
  const d = dao();
  const draft = (secret: string, f: DraftFields, at: number, root?: Event) => d.ev(KIND.draft, f, secret, at, root ? [['e', root.id]] : []);
  const post = (secret: string, root: string, text: string, at: number) => d.ev(KIND.post, { text }, secret, at, [['e', root]]);
  const withdraw = (secret: string, root: Event, at: number) => d.ev(KIND.withdraw, {}, secret, at, [['e', root.id]]);
  const discussion = (now: number) => {
    const s = d.state(now);
    return { s, disc: buildDiscussion(s, d.events) };
  };
  return { d, draft, post, withdraw, discussion };
}

describe('discussion (4.5)', () => {
  it('opens a thread from an idea, adds versions from the author only, and posts from members only', () => {
    const { d, draft, post, discussion } = setup();
    const v1 = draft(d.f[0], idea(), d.T);
    post(d.c[1], v1.id, 'Dove lo mettiamo?', d.T + 10);
    draft(d.f[0], full(2), d.T + 20, v1);
    draft(d.f[1], full(3), d.T + 30, v1); // not the author
    post(newSecret(), v1.id, 'spam', d.T + 40); // not a member
    post(d.f[2], v1.id, 'Sì, ma con un tetto.', d.T + 50);
    const { disc } = discussion(d.T + 100);
    const th = disc.threads.find(t => t.id === v1.id)!;
    expect(th.status).toBe('open');
    expect(th.versions.map(v => v.version)).toEqual([1, 2]);
    expect(th.posts.map(p => p.text)).toEqual(['Dove lo mettiamo?', 'Sì, ma con un tetto.']);
    expect(th.timeline.map(i => i.kind)).toEqual(['version', 'post', 'version', 'post']);
    expect(pinnedVersion(th)!.version).toBe(2);
    expect(th.lastActivity).toBe(d.T + 50);
    expect(disc.ignored.map(x => x.reason)).toEqual(expect.arrayContaining(['draft: not the author', 'post: signer is not a member']));
  });

  it('ignores a draft from a non-member and versions out of sequence', () => {
    const { d, draft, discussion } = setup();
    draft(newSecret(), idea(), d.T);
    const v1 = draft(d.f[0], idea(), d.T + 1);
    draft(d.f[0], full(3), d.T + 2, v1); // skips 2
    draft(d.f[0], full(2), d.T + 3, v1);
    const { disc } = discussion(d.T + 100);
    expect(disc.threads.filter(t => t.isDraft)).toHaveLength(1);
    expect(disc.threads[0].versions.map(v => v.version)).toEqual([1, 2]);
  });

  it('links a submitted proposal to its draft and version, and freezes the draft', () => {
    const { d, draft, post, discussion } = setup();
    const v1 = draft(d.f[0], idea(), d.T);
    const v2 = draft(d.f[0], full(2), d.T + 10, v1);
    const { s, disc: before } = discussion(d.T + 20);
    const v = before.threads[0].versions[1];
    expect(v.event.id).toBe(v2.id);
    const content = proposalFromVersion(v1.id, v)!;
    const p = d.ev(KIND.proposal, content, d.f[0], d.T + 20);
    draft(d.f[0], full(3, 'Cambiato dopo'), d.T + 30, v1); // frozen
    post(d.c[0], v1.id, 'Voto sì.', d.T + 40); // posts continue through the vote
    const { s: s2, disc } = discussion(d.T + 100);
    const th = disc.threads.find(t => t.id === v1.id)!;
    expect(s.proposals).toHaveLength(0);
    expect(s2.proposals).toHaveLength(1);
    expect(th.status).toBe('submitted');
    expect(th.proposal!.event.id).toBe(p.id);
    expect(th.submittedVersion).toBe(2);
    expect(th.versions).toHaveLength(2);
    expect(th.posts).toHaveLength(1);
    expect(disc.byProposal.get(p.id)).toBe(th);
    expect(disc.threads.filter(t => t.proposal?.event.id === p.id)).toHaveLength(1); // no second thread
  });

  it('does not link a proposal whose text differs from the version it names, or one from another member', () => {
    const { d, draft, discussion } = setup();
    const v1 = draft(d.f[0], idea(), d.T);
    draft(d.f[0], full(2), d.T + 10, v1);
    d.ev(KIND.proposal, { type: 'statement', title: 'Altro titolo', summary: 'Testo completo.', lang: 'it', payload: {}, draft: { id: v1.id, version: 2 } }, d.f[0], d.T + 20);
    d.ev(KIND.proposal, { type: 'statement', title: 'Un forno solare', summary: 'Testo completo.', lang: 'it', payload: {}, draft: { id: v1.id, version: 2 } }, d.f[1], d.T + 30);
    const { s, disc } = discussion(d.T + 100);
    expect(s.proposals).toHaveLength(2); // both are valid proposals: votes are not affected
    const th = disc.threads.find(t => t.id === v1.id)!;
    expect(th.status).toBe('open');
    expect(th.proposal).toBeUndefined();
    expect(disc.threads.filter(t => !t.isDraft)).toHaveLength(2); // each gets a thread of its own
  });

  it('lets the author withdraw an open draft; later versions and submissions are ignored', () => {
    const { d, draft, withdraw, post, discussion } = setup();
    const v1 = draft(d.f[0], full(1), d.T);
    withdraw(d.f[1], v1, d.T + 5); // not the author
    withdraw(d.f[0], v1, d.T + 10);
    draft(d.f[0], full(2), d.T + 20, v1);
    d.ev(KIND.proposal, { type: 'statement', title: 'Un forno solare', summary: 'Testo completo.', lang: 'it', payload: {}, draft: { id: v1.id, version: 1 } }, d.f[0], d.T + 30);
    post(d.f[1], v1.id, 'Peccato.', d.T + 40);
    const { disc } = discussion(d.T + 100);
    const th = disc.threads.find(t => t.id === v1.id)!;
    expect(th.status).toBe('withdrawn');
    expect(th.versions).toHaveLength(1);
    expect(th.proposal).toBeUndefined();
    expect(th.posts).toHaveLength(1);
  });

  it('ignores a withdrawal after submission', () => {
    const { d, draft, withdraw, discussion } = setup();
    const v1 = draft(d.f[0], full(1), d.T);
    d.ev(KIND.proposal, { type: 'statement', title: 'Un forno solare', summary: 'Testo completo.', lang: 'it', payload: {}, draft: { id: v1.id, version: 1 } }, d.f[0], d.T + 10);
    withdraw(d.f[0], v1, d.T + 20);
    const { disc } = discussion(d.T + 100);
    expect(disc.threads.find(t => t.id === v1.id)!.status).toBe('submitted');
  });

  it('counts a version and a submission in the same second in that order', () => {
    const { d, draft, discussion } = setup();
    const v1 = draft(d.f[0], idea(), d.T);
    draft(d.f[0], full(2), d.T + 10, v1);
    d.ev(KIND.proposal, { type: 'statement', title: 'Un forno solare', summary: 'Testo completo.', lang: 'it', payload: {}, draft: { id: v1.id, version: 2 } }, d.f[0], d.T + 10);
    const { disc } = discussion(d.T + 100);
    expect(disc.threads.find(t => t.id === v1.id)!.submittedVersion).toBe(2);
  });

  it('gives a proposal published without a draft its own thread, and sorts threads by last activity', () => {
    const { d, draft, post, discussion } = setup();
    const p = d.propose(d.f[0], { type: 'statement', title: 'Diretta' }, d.T);
    const v1 = draft(d.f[1], idea(), d.T + 10);
    post(d.f[2], p.id, 'Commento sulla proposta.', d.T + 20);
    const { disc } = discussion(d.T + 100);
    expect(disc.threads.map(t => t.id)).toEqual([p.id, v1.id]);
    const th = disc.byProposal.get(p.id)!;
    expect(th.isDraft).toBe(false);
    expect(th.posts).toHaveLength(1);
  });

  it('rejects a proposal with a malformed draft reference (schema)', () => {
    const { d, discussion } = setup();
    d.ev(KIND.proposal, { type: 'statement', title: 'X', summary: 'S', lang: 'it', payload: {}, draft: { id: 'nope', version: 1 } }, d.f[0], d.T);
    const { s } = discussion(d.T + 100);
    expect(s.proposals).toHaveLength(0);
  });
});
