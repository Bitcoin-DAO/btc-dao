// Founding guard (v0.9.9): before the DAO id is pinned, a site that names an organiser accepts only the organiser's
// founding, so nobody can found a DAO at the DAO's address first; and the council's "Pin the DAO id" task.
import { describe, expect, it } from 'vitest';
import { buildGenesis, foundingAllowed, needsPin, organiserOf, pinEditUrl, type SiteConfig } from './config';
import { buildDescriptor } from './descriptor';
import { KIND, sign, template, type Event } from './events';
import { newSecret, pubkeyOf, treasuryKeyFromMnemonic } from './identity';
import { rebuild } from './state';
import { hashJson } from './util';

const MNEMONICS = [
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  'legal winner thank year wave sausage worth useful legal winner thank yellow',
  'letter advice cage absurd amount doctor acoustic avoid letter advice cage above',
];
const base: SiteConfig = {
  configVersion: 1, name: 'T', description: 'x', languages: ['it'], network: 'testnet4',
  site: 'https://example.org/t', passkeyDomain: 'example.org', council: [], founders: [], threshold: 2, descriptor: '', relays: [], chainApi: [],
  rules: {
    votingPeriodDays: 7, quorum: '1/3', simpleMajority: ['payout', 'statement', 'addMember'],
    twoThirdsMajority: ['removeMember', 'changeRules', 'changeCouncil', 'close'], payoutRound: 'monthly',
    timezone: 'Europe/Rome', lapseAfterRounds: 2, maxFeeRateSatVb: 20, treasuryCapSats: 5_000_000,
    remoteVerification: {}, minimumAge: 18, charterSha256: 'ab'.repeat(32),
  },
};

/** A complete founding (genesis plus two endorsements) for this site, published by the first council key. */
function found(site: SiteConfig, name: string, at: number, events: Event[]) {
  const c = MNEMONICS.map(() => newSecret());
  const tk = MNEMONICS.map(m => treasuryKeyFromMnemonic(m, 'testnet4'));
  const genesis = buildGenesis(site, {
    name, description: 'd',
    council: c.map((s, i) => ({ label: `@c${i}`, identityKey: pubkeyOf(s), fingerprint: tk[i].fingerprint, xpub: tk[i].xpub })),
    founders: [], threshold: 2, descriptor: buildDescriptor(2, tk, 'testnet4'), charterSha256: 'ab'.repeat(32),
  });
  const daoId = hashJson(genesis);
  const g = sign(template(KIND.genesis, daoId, genesis, [], at), c[0]);
  events.push(g);
  [0, 1].forEach(i => events.push(sign(template(KIND.endorse, daoId, { object: 'genesis', hash: daoId }, [['e', g.id]], at + 1 + i), c[i])));
  return { daoId, organiser: pubkeyOf(c[0]) };
}

describe('founding guard', () => {
  it('without an organiser, the first founding at the address counts (as before)', () => {
    const events: Event[] = [];
    const squat = found(base, 'SQUAT', 1000, events);
    found(base, 'REAL', 2000, events);
    expect(rebuild(base, events, undefined, 3000).founded?.daoId).toBe(squat.daoId);
  });

  it('with an organiser named, only the organiser’s founding counts, even if another came first', () => {
    const events: Event[] = [];
    found(base, 'SQUAT', 1000, events);
    // The real founding's first council key is the organiser.
    const probe: Event[] = [];
    const real = found(base, 'REAL', 2000, probe);
    events.push(...probe);
    const site = { ...base, organiser: real.organiser };
    const s = rebuild(site, events, undefined, 3000);
    expect(s.founded?.daoId).toBe(real.daoId);
    expect(s.conflict).toBe(false);
    expect(s.rejected.some(r => r.reason === 'genesis: not published by the organiser')).toBe(true);
  });

  it('nothing is founded while only someone else has published', () => {
    const events: Event[] = [];
    found(base, 'SQUAT', 1000, events);
    const s = rebuild({ ...base, organiser: 'cd'.repeat(32) }, events, undefined, 3000);
    expect(s.founded).toBeUndefined();
  });

  it('a placeholder organiser is ignored; once pinned, the DAO id decides', () => {
    expect(organiserOf({ organiser: '[organiser identity key, hex]' })).toBeUndefined();
    expect(foundingAllowed({ organiser: '[x]' }, 'ab'.repeat(32))).toBe(true);
    expect(foundingAllowed({ organiser: 'cd'.repeat(32) }, 'ab'.repeat(32))).toBe(false);
    expect(foundingAllowed({ organiser: 'cd'.repeat(32), daoId: 'ef'.repeat(32) }, 'ab'.repeat(32))).toBe(true);
  });

  it('organiser, invitation and repo never go into the genesis', () => {
    const g = buildGenesis({ ...base, organiser: 'cd'.repeat(32), foundingByInvitation: true, repo: 'https://github.com/o/r' }, {
      name: 'T', description: 'd', council: [], founders: [], threshold: 1, descriptor: '', charterSha256: 'ab'.repeat(32),
    }) as unknown as Record<string, unknown>;
    expect(g.organiser).toBeUndefined();
    expect(g.foundingByInvitation).toBeUndefined();
    expect(g.repo).toBeUndefined();
  });
});

describe('pin the DAO id', () => {
  const id = 'ab'.repeat(32);
  it('is a task until the site carries the founded id', () => {
    expect(needsPin({}, undefined)).toBe(false);
    expect(needsPin({}, id)).toBe(true);
    expect(needsPin({ daoId: 'cd'.repeat(32) }, id)).toBe(true);
    expect(needsPin({ daoId: id }, id)).toBe(false);
  });
  it('links to the site file on GitHub when the repository is known', () => {
    expect(pinEditUrl({ repo: 'https://github.com/byob-zone/alpha-dao' })).toBe('https://github.com/byob-zone/alpha-dao/edit/main/config/dao.json');
    expect(pinEditUrl({ repo: 'https://github.com/byob-zone/alpha-dao/' })).toBe('https://github.com/byob-zone/alpha-dao/edit/main/config/dao.json');
    expect(pinEditUrl({ repo: 'javascript:alert(1)' })).toBeUndefined();
    expect(pinEditUrl({})).toBeUndefined();
  });
});
