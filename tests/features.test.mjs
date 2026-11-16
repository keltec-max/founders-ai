import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('technology items have data-i18n on tech-name span only (not on li) to preserve logos during language switch', () => {
  const source = read('src/components/Technologies.astro');
  // The data-i18n should be on the .tech-name span, NOT on the parent <li>
  // If it's on <li>, the i18n script will replace entire innerHTML including the logo
  assert.doesNotMatch(source, /<li class="tech-item" data-i18n=\{`tech\.cat\./);
  assert.match(source, /<span class="tech-name" data-i18n=\{`tech\.cat\./);
});

test('contact section lists the confirmed channels and SAP HANA expertise', () => {
  const source = read('src/components/Contact.astro');
  assert.match(source, /https:\/\/wa\.me\/5511978356178/);
  assert.match(source, /mailto:kelvinlener@protonmail\.ch/);
  assert.match(source, /Infraestrutura SAP HANA/);
  assert.doesNotMatch(source, /contato@founders-ai\.com|3000-0000|linkedin\.com\/company\/founders-ai/i);
});
test('hero uses the local video and GIF with the configured deployment base', () => {
  const source = read('src/components/Hero.astro');
  assert.match(source, /import\.meta\.env\.BASE_URL/);
  assert.match(source, /hero-bg\.mp4/);
  assert.match(source, /hero-[\w-]+\.gif/);
  assert.ok(existsSync(new URL('../public/assets/videos/hero-bg.mp4', import.meta.url)));
  assert.ok(existsSync(new URL('../public/assets/videos/hero-fallback.gif', import.meta.url)));
});

test('hero hides both animated media for reduced-motion preferences', () => {
  const source = read('src/components/Hero.astro');
  const reducedMotion = source.split('@media (prefers-reduced-motion: reduce)')[1];
  assert.ok(reducedMotion);
  assert.match(reducedMotion, /\.hero-video/);
  assert.match(reducedMotion, /\.hero-fallback/);
  assert.match(reducedMotion, /display:\s*none/);
});
test('all translation dictionaries compile without syntax errors', () => {
  const result = ts.transpileModule(read('src/i18n/locales.ts'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  assert.deepEqual(result.diagnostics, []);
});
