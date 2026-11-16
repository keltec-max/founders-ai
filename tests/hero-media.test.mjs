import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const html = readFileSync(join(distDir, 'index.html'), 'utf8');
const hero = html.match(/<section[^>]*aria-labelledby=["']?hero-title["']?[\s\S]*?<\/section>/i)?.[0] ?? '';

function attribute(tag, name) {
  const match = tag.match(new RegExp(`(?:^|\\s)${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function assertBuiltAsset(url, extension) {
  assert.ok(url, `Expected a local ${extension} asset`);
  assert.match(url, new RegExp(`^/founders-ai/assets/videos/[^/]+\\.${extension}$`));
  assert.ok(existsSync(join(distDir, url.replace(/^\/founders-ai\//, ''))), `${url} must exist in the build`);
}

test('hero video and poster resolve under the deployment base', () => {
  const video = hero.match(/<video\b[^>]*>/i)?.[0] ?? '';
  assert.ok(video, 'Hero should contain a video');
  for (const attribute of ['autoplay', 'loop', 'muted', 'playsinline']) {
    assert.match(video, new RegExp(`\\b${attribute}\\b`, 'i'));
  }
  const source = hero.match(/<source\b[^>]*>/i)?.[0] ?? '';
  assertBuiltAsset(attribute(video, 'src') ?? attribute(source, 'src'), 'mp4');
  assertBuiltAsset(attribute(video, 'poster'), '(?:jpg|png|webp)');
});

test('hero includes a local GIF fallback loaded only when needed', () => {
  const images = hero.match(/<img\b[^>]*>/gi) ?? [];
  const fallback = images.find((tag) => attribute(tag, 'class')?.split(/\s+/).includes('hero-fallback')) ?? '';
  assert.ok(fallback, 'Hero should contain a GIF fallback');
  assert.match(fallback, /\bhidden\b/i);
  assert.equal(attribute(fallback, 'src'), undefined);
  assertBuiltAsset(attribute(fallback, 'data-src'), 'gif');
});
