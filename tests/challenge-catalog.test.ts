import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { OFFICIAL_CHALLENGES } from '../src/server/db/challengesData.js';

test('every playable challenge has a unique, decodable image and scoring data', async () => {
  assert.equal(OFFICIAL_CHALLENGES.length, 50);
  const ids = new Set<string>();
  const urls = new Set<string>();
  const hashes = new Set<string>();
  for (const challenge of OFFICIAL_CHALLENGES) {
    assert.equal(ids.has(challenge.id), false, `duplicate challenge: ${challenge.id}`);
    assert.equal(urls.has(challenge.imageUrl), false, `shared image: ${challenge.imageUrl}`);
    assert.match(challenge.imageUrl, /^\/challenges\/[a-z0-9_-]+\.(webp|png|jpg|svg)$/);
    const image = await fs.readFile(new URL(`../public${challenge.imageUrl}`, import.meta.url));
    const hash = crypto.createHash('sha256').update(image).digest('hex');
    assert.equal(hashes.has(hash), false, `duplicate image bytes: ${challenge.id}`);
    const metadata = await sharp(image).metadata();
    assert.ok(metadata.width && metadata.height, `invalid image: ${challenge.id}`);
    for (const layer of ['subject', 'style', 'environment'] as const) {
      assert.ok(challenge.keywords[layer].length > 0);
      assert.ok(challenge.keywords[layer].every((group) => group.synonyms.length > 0 && group.weight > 0));
    }
    assert.ok(challenge.fullPrompt && challenge.subjectLayer && challenge.styleLayer && challenge.environmentLayer);
    assert.ok(challenge.hint1 && challenge.hint2 && challenge.keywords.botPrompts.length > 0);
    ids.add(challenge.id); urls.add(challenge.imageUrl); hashes.add(hash);
  }
});
