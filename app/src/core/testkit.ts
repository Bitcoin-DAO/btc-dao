// Shared by the unit tests: a founded DAO on testnet4 and helpers to sign its events.
import { p2wpkh, TEST_NETWORK } from '@scure/btc-signer';
import { secp256k1 } from '@noble/curves/secp256k1';
import { hexToBytes } from '@noble/hashes/utils';
import { buildGenesis, type SiteConfig } from './config';
import { buildDescriptor, parseDescriptor, treasuryAddress } from './descriptor';
import { KIND, sign, template, type Event } from './events';
import { newSecret, pubkeyOf, treasuryKeyFromMnemonic } from './identity';
import { rebuild, type DaoState, type ProposalContent, type TallyContent } from './state';
import { hashJson, parseJson } from './util';

export const MNEMONICS = [
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  'letter advice cage absurd amount doctor acoustic avoid letter advice cage above',
  'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong',
  'ozone drill grab fiber curtain grace pudding thank cruise elder eight picnic',
];
export const DAY = 86400;
export const ADDR = p2wpkh(secp256k1.getPublicKey(hexToBytes('11'.repeat(32)), true), TEST_NETWORK).address!;

export const site: SiteConfig = {
  configVersion: 1, name: 'UNO', description: 'x', languages: ['it'], network: 'testnet4',
  site: 'https://bitcoin-dao.github.io/uno-testnet', passkeyDomain: 'bitcoin-dao.github.io',
  council: [], founders: [], threshold: 3, descriptor: '', relays: [], chainApi: [],
  rules: {
    votingPeriodDays: 7, quorum: '1/3', simpleMajority: ['payout', 'statement', 'addMember'],
    twoThirdsMajority: ['removeMember', 'changeRules', 'changeCouncil', 'close'], payoutRound: 'monthly',
    timezone: 'Europe/Rome', lapseAfterRounds: 2, maxFeeRateSatVb: 20, treasuryCapSats: 5_000_000,
    remoteVerification: {}, minimumAge: 18, charterSha256: 'ab'.repeat(32),
  },
};

/** A founded DAO: 5 council (c0..c4), 4 founders (f0..f3). 9 members, quorum 3. */
export function dao(rules: Partial<SiteConfig['rules']> = {}) {
  const c = MNEMONICS.map(() => newSecret());
  const f = [0, 1, 2, 3].map(() => newSecret());
  const tk = MNEMONICS.map(m => treasuryKeyFromMnemonic(m, 'testnet4'));
  const descriptor = buildDescriptor(3, tk, 'testnet4');
  const genesis = buildGenesis({ ...site, rules: { ...site.rules, ...rules } }, {
    name: 'UNO', description: 'd',
    council: c.map((s, i) => ({ label: `@c${i}`, identityKey: pubkeyOf(s), fingerprint: tk[i].fingerprint, xpub: tk[i].xpub })),
    founders: f.map((s, i) => ({ name: `@f${i}`, identityKey: pubkeyOf(s), verified: 'in_person' as const })),
    threshold: 3, descriptor, charterSha256: 'ab'.repeat(32),
  });
  const daoId = hashJson(genesis);
  const events: Event[] = [];
  const ev = (kind: number, content: unknown, secret: string, at: number, tags: string[][] = []) => {
    const e = sign(template(kind, daoId, content, tags, at), secret);
    events.push(e);
    return e;
  };
  const g = ev(KIND.genesis, genesis, c[0], 1000);
  [0, 1, 2].forEach(i => ev(KIND.endorse, { object: 'genesis', hash: daoId }, c[i], 1001 + i, [['e', g.id]]));
  const T = 2000; // after founding
  const state = (now: number) => rebuild(site, events, undefined, now);
  const propose = (secret: string, content: Partial<ProposalContent> & { type: ProposalContent['type'] }, at: number) =>
    ev(KIND.proposal, { title: 'T', summary: 'S', lang: 'it', payload: {}, ...content }, secret, at);
  const vote = (secret: string, p: Event, choice: string, at: number) => ev(KIND.vote, { choice }, secret, at, [['e', p.id]]);
  const tally = (secret: string, s: DaoState, p: Event, at: number, override?: Partial<TallyContent>) => {
    const view = s.proposals.find(x => x.event.id === p.id)!;
    return ev(KIND.tally, { ...view.recount, ...override }, secret, at, [['e', p.id]]);
  };
  const endorse = (secret: string, target: Event, object: string, at: number) =>
    ev(KIND.endorse, { object, hash: hashJson(parseJson(target.content)) }, secret, at, [['e', target.id]]);
  const treasury0 = treasuryAddress(parseDescriptor(descriptor, 'testnet4'), 'testnet4', 0, 0).address;
  return { c, f, daoId, events, ev, state, propose, vote, tally, endorse, T, treasury0 };
}

