// Copyright 2026 Quantova Inc
// SPDX-License-Identifier: Apache-2.0 OR MIT
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const Q = require('..');
const key = () => Q.generateKey();
const mk = (k, h) => Q.grant({ key: k, concession: 'Block 44', mineral: 'copper', areaHa: 5000, jurisdiction: 'cl', holder: Q.keyId(h), authorityLabel: 'Ministry of Mines' });

test('a granted right is a well formed signed record of the authority', () => {
  const a = key(); const h = key(); const g = mk(a, h);
  assert.strictEqual(g.format, 'qmineral/1');
  assert.strictEqual(g.type, 'grant');
  assert.strictEqual(g.signer.id, Q.keyId(a));
  assert.strictEqual(g.statement.holderKeyId, Q.keyId(h));
  assert.strictEqual(g.statement.mineral, 'copper');
  assert.match(g.statement.rightId, /^[0-9a-f]{32}$/);
});

test('report transfer relinquish chain to the same right', () => {
  const a = key(); const h = key(); const buyer = key();
  const g = mk(a, h);
  const r = Q.report({ key: h, right: g, period: '2026Q1', quantity: 12000, unit: 'tonne' });
  const moved = Q.transfer({ key: h, right: g, to: Q.keyId(buyer) });
  const end = Q.relinquish({ key: a, right: moved, reason: 'expired' });
  assert.strictEqual(r.statement.rightId, g.statement.rightId);
  assert.strictEqual(r.statement.quantity, 12000);
  assert.strictEqual(moved.statement.toKeyId, Q.keyId(buyer));
  assert.strictEqual(end.statement.reason, 'expired');
});

test('invalid inputs are refused before anything is signed', () => {
  const k = key(); const h = key();
  const base = { key: k, concession: 'B1', mineral: 'gold', areaHa: 1, jurisdiction: 'cl', holder: Q.keyId(h) };
  assert.throws(() => Q.grant(Object.assign({}, base, { mineral: 'Gold' })), /mineral must be/);
  assert.throws(() => Q.grant(Object.assign({}, base, { areaHa: 0 })), /areaHa must be a whole number/);
  assert.throws(() => Q.grant(Object.assign({}, base, { jurisdiction: 'CL' })), /jurisdiction must be/);
  assert.throws(() => Q.grant(Object.assign({}, base, { zzz: 1 })), /is not an option of grant/);
});

test('a well formed record verifies and a type mismatch or tamper is invalid', async () => {
  const a = key(); const h = key(); const g = mk(a, h);
  const OPTS = { network: 'testnet', requireAnchor: false, strict: false };
  const ok = await Q.verify(g, Object.assign({ type: 'grant' }, OPTS));
  assert.strictEqual(ok.status, 'valid');
  assert.strictEqual(ok.rightId, g.statement.rightId);
  assert.strictEqual((await Q.verify(g, Object.assign({ type: 'transfer' }, OPTS))).status, 'invalid');
  const f = JSON.parse(JSON.stringify(g)); f.statement.areaHa = 1;
  assert.strictEqual((await Q.verify(f, Object.assign({ type: 'grant' }, OPTS))).status, 'invalid');
});

test('the prior link binds and the kind and constants are pinned', async () => {
  const a = key(); const h = key();
  const g = mk(a, h);
  const r = Q.report({ key: h, right: g, period: '2026Q1', quantity: 100, unit: 'tonne' });
  const good = await Q.verify(r, { type: 'report', network: 'testnet', requireAnchor: false, strict: false, prior: g });
  assert.ok(good.checks.some((c) => c.name === 'prior' && c.ok));
  assert.strictEqual(Q.KIND, 1308);
  assert.strictEqual(Q.FORMAT, 'qmineral/1');
  assert.deepStrictEqual([...Q.TYPES], ['grant', 'report', 'transfer', 'relinquish']);
});
