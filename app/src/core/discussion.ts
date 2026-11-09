// Discussion (protocol 4.5): drafts with numbered versions, flat posts, withdrawal, and the link from
// a proposal back to the draft and version it was submitted from. Nothing here changes how proposals,
// votes or tallies are counted: a thread is read beside the DAO's state, never fed into it.
import { KIND, tagValue, type Event } from './events';
import { isKey, isStr, PROPOSAL_TYPES, type DaoState, type ProposalContent, type ProposalType, type ProposalView } from './state';
import { jcs, parseJson } from './util';

export const POST_MAX = 2000;

/** The proposal fields a version card holds. An idea is version 1 with only a title and summary. */
export interface DraftFields {
  version: number;
  title: string;
  summary: string;
  lang: string;
  type?: ProposalType;
  payload?: Record<string, any>;
}

export interface DraftVersion {
  event: Event;
  version: number;
  fields: DraftFields;
}

export type ThreadItem =
  | { kind: 'version'; at: number; event: Event; v: DraftVersion }
  | { kind: 'post'; at: number; event: Event; text: string };

export type ThreadStatus = 'open' | 'submitted' | 'withdrawn';

export interface Thread {
  /** The thread's root: version 1 of a draft, or a proposal published without a draft. */
  id: string;
  /** The author's person (first key). Only the author adds versions, submits or withdraws. */
  author: string;
  authorKey: string;
  isDraft: boolean;
  versions: DraftVersion[];
  posts: { event: Event; text: string }[];
  timeline: ThreadItem[];
  status: ThreadStatus;
  withdrawn?: Event;
  /** The proposal this thread belongs to: submitted from the draft, or the root itself. */
  proposal?: ProposalView;
  submittedVersion?: number;
  title: string;
  lastActivity: number;
}

export interface Discussion {
  threads: Thread[];
  /** Thread of each proposal, by proposal id. */
  byProposal: Map<string, Thread>;
  ignored: { event: Event; reason: string }[];
}

export function draftFieldsError(c: DraftFields | undefined): string | undefined {
  if (!c || typeof c !== 'object') return 'not an object';
  if (!Number.isInteger(c.version) || c.version < 1) return 'version';
  if (!isStr(c.title, 80)) return 'title';
  if (typeof c.summary !== 'string' || c.summary.length > 500) return 'summary';
  if (typeof c.lang !== 'string') return 'lang';
  if (c.type !== undefined && !PROPOSAL_TYPES.includes(c.type)) return 'type';
  if (c.payload !== undefined && (!c.payload || typeof c.payload !== 'object')) return 'payload';
  if ((c.type === undefined) !== (c.payload === undefined)) return 'type and payload go together';
  return;
}

/** The proposal a version becomes when submitted: its fields, with the draft reference added. */
export function proposalFromVersion(threadId: string, v: DraftVersion): ProposalContent | undefined {
  const f = v.fields;
  if (!f.type || !f.payload) return;
  return { type: f.type, title: f.title, summary: f.summary, lang: f.lang, payload: f.payload, draft: { id: threadId, version: v.version } };
}

/** The fields a proposal and the version it names must share, so the voted text is the version's text. */
const sameText = (p: ProposalContent, f: DraftFields) =>
  p.type === f.type && p.title === f.title && p.summary === f.summary && jcs(p.payload) === jcs(f.payload ?? null);

export function buildDiscussion(dao: DaoState, events: Event[]): Discussion {
  const ignored: Discussion['ignored'] = [];
  const ofKind = (k: number) => events.filter(e => e.kind === k).sort((a, b) => a.created_at - b.created_at || (a.id < b.id ? -1 : 1));
  const proposalsById = new Map(dao.proposals.map(p => [p.event.id, p]));
  const threads = new Map<string, Thread>();

  // 1. Drafts: version 1 has no `e` tag; later versions name version 1 and come from the same person.
  const drafts = ofKind(KIND.draft);
  for (const e of drafts) {
    if (tagValue(e, 'e') !== undefined) continue;
    const f = parseJson<DraftFields>(e.content);
    const err = draftFieldsError(f) ?? (f!.version !== 1 ? 'first version must be 1' : undefined);
    if (err) { ignored.push({ event: e, reason: `draft: ${err}` }); continue; }
    if (!dao.memberAt(e.pubkey, e.created_at)) { ignored.push({ event: e, reason: 'draft: signer is not a member' }); continue; }
    const v = { event: e, version: 1, fields: f! };
    threads.set(e.id, {
      id: e.id, author: dao.personOf(e.pubkey), authorKey: e.pubkey, isDraft: true, versions: [v], posts: [], timeline: [],
      status: 'open', title: f!.title, lastActivity: e.created_at,
    });
  }

  // 2. Later versions, withdrawal and submission, in time order per draft. The first proposal by the
  // author that carries an existing version's exact text freezes the draft: later versions and a later
  // withdrawal are ignored. At the same second, versions and withdrawals count before a proposal.
  type Step = { at: number; rank: number; id: string; run: () => void };
  const steps = new Map<string, Step[]>();
  const add = (th: Thread, st: Step) => (steps.get(th.id) ?? steps.set(th.id, []).get(th.id)!).push(st);
  const frozen = (th: Thread) => !!th.proposal;
  for (const e of drafts) {
    const id = tagValue(e, 'e');
    if (id === undefined) continue;
    const th = threads.get(id);
    const f = parseJson<DraftFields>(e.content);
    const err = !th ? 'no such draft' : draftFieldsError(f) ?? (dao.personOf(e.pubkey) !== th.author ? 'not the author' : undefined);
    if (err) { ignored.push({ event: e, reason: `draft: ${err}` }); continue; }
    add(th!, { at: e.created_at, rank: 0, id: e.id, run: () => {
      if (frozen(th!)) return void ignored.push({ event: e, reason: 'draft: frozen by the submitted proposal' });
      if (th!.withdrawn) return void ignored.push({ event: e, reason: 'draft: withdrawn' });
      const next = th!.versions.length + 1;
      if (f!.version !== next) return void ignored.push({ event: e, reason: `draft: expected version ${next}` });
      th!.versions.push({ event: e, version: next, fields: f! });
    } });
  }
  for (const e of ofKind(KIND.withdraw)) {
    const th = threads.get(tagValue(e, 'e') ?? '');
    if (!th) { ignored.push({ event: e, reason: 'withdraw: no such draft' }); continue; }
    if (dao.personOf(e.pubkey) !== th.author) { ignored.push({ event: e, reason: 'withdraw: not the author' }); continue; }
    add(th, { at: e.created_at, rank: 0, id: e.id, run: () => {
      if (frozen(th)) return void ignored.push({ event: e, reason: 'withdraw: already submitted' });
      if (!th.withdrawn) th.withdrawn = e;
    } });
  }
  for (const p of dao.proposals) {
    const ref = p.content.draft;
    const th = ref ? threads.get(ref.id) : undefined;
    if (!ref || !th) continue;
    add(th, { at: p.event.created_at, rank: 1, id: p.event.id, run: () => {
      if (frozen(th) || th.withdrawn || dao.personOf(p.event.pubkey) !== th.author) return;
      const v = th.versions.find(x => x.version === ref.version);
      if (!v || !sameText(p.content, v.fields)) return void ignored.push({ event: p.event, reason: 'proposal: does not match the draft version it names' });
      th.proposal = p;
      th.submittedVersion = ref.version;
    } });
  }
  for (const list of steps.values()) {
    list.sort((a, b) => a.at - b.at || a.rank - b.rank || (a.id < b.id ? -1 : 1)).forEach(st => st.run());
  }

  // 3. Proposals published without a draft get a thread of their own.
  const byProposal = new Map<string, Thread>();
  for (const th of threads.values()) if (th.proposal) byProposal.set(th.proposal.event.id, th);
  for (const p of dao.proposals) {
    if (byProposal.has(p.event.id)) continue;
    const th: Thread = {
      id: p.event.id, author: dao.personOf(p.event.pubkey), authorKey: p.event.pubkey, isDraft: false, versions: [], posts: [], timeline: [],
      status: 'submitted', proposal: p, title: p.content.title, lastActivity: p.event.created_at,
    };
    threads.set(p.event.id, th);
    byProposal.set(p.event.id, th);
  }

  // 4. Posts: plain text from members and council, on any thread.
  for (const e of ofKind(KIND.post)) {
    const th = threads.get(tagValue(e, 'e') ?? '');
    const b = parseJson<{ text?: unknown }>(e.content);
    if (!th) { ignored.push({ event: e, reason: 'post: no such thread' }); continue; }
    if (!b || typeof b.text !== 'string' || !b.text.trim() || b.text.length > POST_MAX) { ignored.push({ event: e, reason: 'post: malformed' }); continue; }
    if (!dao.memberAt(e.pubkey, e.created_at)) { ignored.push({ event: e, reason: 'post: signer is not a member' }); continue; }
    th.posts.push({ event: e, text: b.text });
  }

  for (const th of threads.values()) {
    th.status = th.proposal ? 'submitted' : th.withdrawn ? 'withdrawn' : 'open';
    const latest = th.versions[th.versions.length - 1];
    th.title = th.proposal?.content.title ?? latest?.fields.title ?? th.title;
    th.timeline = [
      ...th.versions.map(v => ({ kind: 'version' as const, at: v.event.created_at, event: v.event, v })),
      ...th.posts.map(p => ({ kind: 'post' as const, at: p.event.created_at, event: p.event, text: p.text })),
    ].sort((a, b) => a.at - b.at || (a.event.id < b.event.id ? -1 : 1));
    const times = [
      th.timeline.length ? th.timeline[th.timeline.length - 1].at : 0,
      th.proposal?.event.created_at ?? 0,
      th.proposal?.tally?.events.reduce((m, e) => Math.max(m, e.created_at), 0) ?? 0,
      th.withdrawn?.created_at ?? 0,
      th.lastActivity,
    ];
    th.lastActivity = Math.max(...times);
  }

  const list = [...threads.values()].sort((a, b) => b.lastActivity - a.lastActivity || (a.id < b.id ? -1 : 1));
  return { threads: list, byProposal, ignored };
}

/** The version a thread shows at its top: the submitted one once frozen, else the newest. */
export function pinnedVersion(th: Thread): DraftVersion | undefined {
  if (th.submittedVersion) return th.versions.find(v => v.version === th.submittedVersion);
  return th.versions[th.versions.length - 1];
}

export const validThreadId = (id: string) => isKey(id);
