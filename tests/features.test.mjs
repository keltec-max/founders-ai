import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('technology items include inline logos and translated names', () => {
  const source = read('src/components/Technologies.astro');
  assert.equal((source.match(/\{ name: '[^']+', logo: \w+ \}/g) || []).length, 16);
  assert.match(source, /<li class="tech-item" data-i18n=\{`tech\.cat\./);
  assert.match(source, /<span class="tech-logo" set:html=\{item\.logo\}><\/span>/);
  assert.match(source, /<span class="tech-name">\{item\.name\}<\/span>/);
});

test('contact section lists the confirmed channels and SAP HANA expertise', () => {
  const source = read('src/components/Contact.astro');
  assert.match(source, /https:\/\/wa\.me\/5511978356178/);
  assert.match(source, /mailto:kelvinlener@protonmail\.ch/);
  assert.match(source, /Infraestrutura SAP HANA/);
  assert.doesNotMatch(source, /contato@founders-ai\.com|3000-0000|linkedin\.com\/company\/founders-ai/i);
});
test('hero video is local and hidden for reduced-motion preferences', () => {
  const source = read('src/components/Hero.astro');
  assert.match(source, /<video class="hero-video" autoplay loop muted playsinline poster="\/assets\/videos\/hero-bg\.mp4">/);
  assert.match(source, /<source src="\/assets\/videos\/hero-bg\.mp4" type="video\/mp4">/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.hero-video \{\s*display: none;/);
  assert.ok(existsSync(new URL('../public/assets/videos/hero-bg.mp4', import.meta.url)));
});

test('all translation dictionaries compile without syntax errors', () => {
  const result = ts.transpileModule(read('src/i18n/locales.ts'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  assert.deepEqual(result.diagnostics, []);
});
