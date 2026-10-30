# QMineral

QMineral is a live production post quantum registry tool for mineral and extraction rights on the Quantova network. It proves the grant, production reporting, transfer and relinquishment of mining concessions, and it lets any third party confirm that history without trusting the party that created it.

Only a salted cryptographic commitment is written to the chain. Right identities and holder details stay private on the systems of the party that holds them.

## What it records

1. grant, an authority grants a concession over an area for a named mineral to a holder.
2. report, a holder or inspector reports the production of a period in whole units.
3. transfer, the holder transfers the right to another party.
4. relinquish, an authority ends the right and states why.

Every record is signed with ML-DSA-65 under FIPS 204 by the party whose role it names.

## Install

```
npm install @quantovainc/qmineral
```

## License

Apache-2.0 OR MIT
