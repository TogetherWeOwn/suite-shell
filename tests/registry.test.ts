import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAppRegistry, defaultRegistry } from '../src/registry.ts';

test('the defaults list the launched apps in order', () => {
  assert.deepEqual(defaultRegistry.map(({ id }) => id), ['mail', 'drive', 'account']);
  assert.equal(defaultRegistry[0].href, 'https://mail.riaklo.com');
  assert.equal(defaultRegistry[1].href, 'https://drive.riaklo.com');
});

test('a consumer can add an app without modifying the defaults', () => {
  const docs = { id: 'docs', label: 'Docs', href: 'https://docs.example.com' };
  const apps = createAppRegistry([...defaultRegistry, docs]);
  assert.deepEqual(apps.at(-1), docs);
  assert.equal(defaultRegistry.length, 3);
});

test('the registry rejects duplicate IDs and destinations that are not plain HTTPS URLs', () => {
  assert.throws(() => createAppRegistry([defaultRegistry[0], defaultRegistry[0]]), /Duplicate app ID/);
  for (const href of ['javascript:void(0)', '//docs.example.com', 'https:docs.example.com', 'https://user@docs.example.com']) {
    assert.throws(
      () => createAppRegistry([{ id: 'docs', label: 'Docs', href }]),
      /App URL must be an absolute HTTPS URL without credentials/,
    );
  }
});
