// Copyright 2026 Quantova Inc
// SPDX-License-Identifier: Apache-2.0 OR MIT

'use strict';

const M = require('./lib/mineral');
const { verify } = require('./lib/verify');
const F = require('./lib/format');

module.exports = {
  generateKey: M.generateKey,
  publicKey: M.publicKey,
  keyId: M.keyId,
  describeKey: M.describeKey,
  rightRef: M.rightRef,
  grant: M.grant,
  report: M.report,
  transfer: M.transfer,
  relinquish: M.relinquish,
  anchor: M.anchor,
  complete: M.complete,
  verify,
  anchorDigest: (envelope) => F.anchorDigest(F.parse(envelope)).toString('hex'),
  recordRef: (envelope) => F.refOf(F.parse(envelope)),
  FORMAT: F.FORMAT,
  ALGORITHM: F.ALGORITHM,
  KIND: F.KIND,
  TYPES: F.TYPES,
  PUBLIC_KEY_BYTES: F.PUBLIC_KEY_BYTES,
  SIGNATURE_BYTES: F.SIGNATURE_BYTES,
};
