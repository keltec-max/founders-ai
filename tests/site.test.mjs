import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

function readAllCss() {
  const cssDir = join(DIST_DIR, '_astro');
  let cssContent = '';
  try {
    const files = readdirSync(cssDir);
    for (const file of files) {
      if (file.endsWith('.css')) {
        cssContent += readFileSync(join(cssDir, file), 'utf-8') + '\n';
      }
    }
  } catch {
    // CSS directory might not exist yet (RED phase: build not run)
  }
  return cssContent;
}

const normalizeText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('Founders AI - Build Verification Tests', () => {
  let indexHtml;
  let manifestJson;
  let allCss;
  let navHtml;
  let contatoSection;
  let heroSection;
  let techSection;

  before(() => {
    indexHtml = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8');
    manifestJson = JSON.parse(readFileSync(join(DIST_DIR, 'manifest.json'), 'utf-8'));
    allCss = readAllCss() + '\n' + indexHtml;
    const navMatch = indexHtml.match(/<nav[\s\S]*?<\/nav>/i);
    navHtml = navMatch ? navMatch[0] : '';
    const contatoMatch = indexHtml.match(/id=["']?contato["']?[^]*?(?=<section|<footer|<\/main|$)/i);
    contatoSection = contatoMatch ? contatoMatch[0] : '';
    const heroMatch = indexHtml.match(/<section[\s\S]*?aria-labelledby=["']?hero-title["']?[\s\S]*?<\/section>/i);
    heroSection = heroMatch ? heroMatch[0] : '';
    const techMatch = indexHtml.match(/<section[\s\S]*?aria-labelledby=["']?tech-title["']?[\s\S]*?<\/section>/i);
    techSection = techMatch ? techMatch[0] : '';
  });

  describe('HTML Structure', () => {
    test('has exactly one h1 element', () => {
      const h1Matches = indexHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
      assert.ok(h1Matches, 'Should have at least one h1');
      assert.strictEqual(h1Matches.length, 1, 'Should have exactly one h1 element');
    });

    test('has header and nav elements', () => {
      assert.ok(/<(header|nav)[^>]*>/i.test(indexHtml), 'Should have <header> or <nav> element');
    });

    test('navigation links are inside nav', () => {
      assert.ok(/<nav/i.test(navHtml), 'Should have a <nav> element');
      const requiredAnchors = ['#servicos', '#sobre', '#tecnologias', '#contato'];
      for (const anchor of requiredAnchors) {
        const regex = new RegExp(`href=["']?${anchor}["']?`, 'i');
        assert.ok(regex.test(navHtml), `Should have nav link with href="${anchor}" inside <nav>`);
      }
    });

    test('has no ISO 27001 claim (even split across tags)', () => {
      const normalized = normalizeText(indexHtml);
      assert.ok(!/ISO\s*27001/i.test(normalized), 'Should not contain "ISO 27001" claim');
    });

    test('has no AWS Advanced Consulting Partner claim', () => {
      const normalized = normalizeText(indexHtml);
      assert.ok(
        !/AWS\s+Advanced\s+Consulting\s+Partner/i.test(normalized),
        'Should not contain "AWS Advanced Consulting Partner" claim'
      );
    });

    test('has no 500+ claim', () => {
      const normalized = normalizeText(indexHtml);
      assert.ok(!/500\s*\+/i.test(normalized), 'Should not contain "500+" claim');
    });

    test('has no 99.9% claim', () => {
      const normalized = normalizeText(indexHtml);
      assert.ok(!/99\.9%/i.test(normalized), 'Should not contain "99.9%" claim');
    });

    test('has no tech-card custom element', () => {
      assert.ok(!/<tech-card/i.test(indexHtml), 'Should not contain tech-card custom element');
    });

    test('has no cert-badge custom element', () => {
      assert.ok(!/<cert-badge/i.test(indexHtml), 'Should not contain cert-badge custom element');
    });

    test('has no /termos link', () => {
      assert.ok(!/href=["']\/termos["']/i.test(indexHtml), 'Should not contain link to /termos');
    });

    test('has no /privacidade link', () => {
      assert.ok(!/href=["']\/privacidade["']/i.test(indexHtml), 'Should not contain link to /privacidade');
    });

    test('has no SEU_FORM_ID placeholder', () => {
      assert.ok(!/SEU_FORM_ID/i.test(indexHtml), 'Should not contain SEU_FORM_ID placeholder');
    });

    test('has no functional contact form', () => {
      assert.ok(!/<form/i.test(indexHtml), 'Should not contain a <form> element');
      assert.ok(
        !/action=["'][^"']*formspree/i.test(indexHtml),
        'Should not have form action pointing to Formspree'
      );
    });

    test('contact section is marked as under setup', () => {
      assert.ok(/id=["']?contato["']?/i.test(indexHtml), 'Should have contact section with id="contato"');
      assert.ok(/configuração/i.test(contatoSection), 'Contact section should state it is under setup ("configuração")');
    });

    test('has canonical URL set to https://keltec-max.github.io/founders-ai/', () => {
      const linkTags = indexHtml.match(/<link\b[^>]*>/gi) || [];
      assert.ok(
        linkTags.some(
          (tag) =>
            /href=["']?https:\/\/keltec-max\.github\.io\/founders-ai\/["']?/i.test(tag) &&
            /rel=["']?canonical["']?/i.test(tag)
        ),
        'Should have canonical link to https://keltec-max.github.io/founders-ai/'
      );
    });

    test('references stylesheet from /founders-ai/_astro/', () => {
      const linkTags = indexHtml.match(/<link\b[^>]*>/gi) || [];
      assert.ok(
        linkTags.some(
          (tag) =>
            /href=["']?\/founders-ai\/_astro\//i.test(tag) &&
            /rel=["']?stylesheet["']?/i.test(tag)
        ),
        'Should reference stylesheet from /founders-ai/_astro/'
      );
    });

    test('has language selector with four flag buttons (pt, en, de, es)', () => {
      assert.ok(/language-selector/i.test(indexHtml), 'Should have a language selector');
      const flags = indexHtml.match(/data-lang=["']?(pt|en|de|es)["']?/gi) || [];
      assert.strictEqual(flags.length, 4, 'Should have exactly 4 language buttons');
    });

    test('each language button has an accessible aria-label', () => {
      const selectorMatch = indexHtml.match(/<div class=["']?language-selector["']?[\s\S]*?<\/div>/i);
      assert.ok(selectorMatch, 'Should have a language-selector div');
      assert.ok(/aria-label=/i.test(selectorMatch[0]), 'Language buttons should have aria-label');
    });

    test('language button pt has img with br.svg flag, empty alt, and non-empty aria-label', () => {
      const ptButtonMatch = indexHtml.match(/<button[^>]*data-lang=["']?pt["']?[^>]*>[\s\S]*?<\/button>/i);
      assert.ok(ptButtonMatch, 'Should have a button with data-lang="pt"');
      const ptButton = ptButtonMatch[0];
      assert.ok(/<img[^>]*src=["']?\/founders-ai\/flags\/br\.svg["']?[^>]*>/i.test(ptButton), 'PT button should have img with src="/founders-ai/flags/br.svg"');
      assert.ok(/<img[^>]*alt=["']?["'][^>]*>/i.test(ptButton), 'PT button img should have empty alt');
      assert.ok(/aria-label=["'][^"']+["']/i.test(ptButton), 'PT button should have non-empty aria-label');
    });

    test('language button en has img with us.svg flag, empty alt, and non-empty aria-label', () => {
      const enButtonMatch = indexHtml.match(/<button[^>]*data-lang=["']?en["']?[^>]*>[\s\S]*?<\/button>/i);
      assert.ok(enButtonMatch, 'Should have a button with data-lang="en"');
      const enButton = enButtonMatch[0];
      assert.ok(/<img[^>]*src=["']?\/founders-ai\/flags\/us\.svg["']?[^>]*>/i.test(enButton), 'EN button should have img with src="/founders-ai/flags/us.svg"');
      assert.ok(/<img[^>]*alt=["']?["'][^>]*>/i.test(enButton), 'EN button img should have empty alt');
      assert.ok(/aria-label=["'][^"']+["']/i.test(enButton), 'EN button should have non-empty aria-label');
    });

    test('language button de has img with de.svg flag, empty alt, and non-empty aria-label', () => {
      const deButtonMatch = indexHtml.match(/<button[^>]*data-lang=["']?de["']?[^>]*>[\s\S]*?<\/button>/i);
      assert.ok(deButtonMatch, 'Should have a button with data-lang="de"');
      const deButton = deButtonMatch[0];
      assert.ok(/<img[^>]*src=["']?\/founders-ai\/flags\/de\.svg["']?[^>]*>/i.test(deButton), 'DE button should have img with src="/founders-ai/flags/de.svg"');
      assert.ok(/<img[^>]*alt=["']?["'][^>]*>/i.test(deButton), 'DE button img should have empty alt');
      assert.ok(/aria-label=["'][^"']+["']/i.test(deButton), 'DE button should have non-empty aria-label');
    });

    test('language button es has img with es.svg flag, empty alt, and non-empty aria-label', () => {
      const esButtonMatch = indexHtml.match(/<button[^>]*data-lang=["']?es["']?[^>]*>[\s\S]*?<\/button>/i);
      assert.ok(esButtonMatch, 'Should have a button with data-lang="es"');
      const esButton = esButtonMatch[0];
      assert.ok(/<img[^>]*src=["']?\/founders-ai\/flags\/es\.svg["']?[^>]*>/i.test(esButton), 'ES button should have img with src="/founders-ai/flags/es.svg"');
      assert.ok(/<img[^>]*alt=["']?["'][^>]*>/i.test(esButton), 'ES button img should have empty alt');
      assert.ok(/aria-label=["'][^"']+["']/i.test(esButton), 'ES button should have non-empty aria-label');
    });
  });

  describe('Manifest.json', () => {
    test('has start_url set to /founders-ai/', () => {
      assert.strictEqual(manifestJson.start_url, '/founders-ai/', 'Manifest start_url should be /founders-ai/');
    });

    test('has no unverified experience claim in description', () => {
      assert.ok(!/15\s*\+\s*anos/i.test(manifestJson.description), 'Manifest description should not contain unverified "15+ anos" claim');
    });

    test('has favicon and icons with base /founders-ai/', () => {
      for (const icon of manifestJson.icons) {
        assert.ok(icon.src.startsWith('/founders-ai/'), `Icon src "${icon.src}" should start with /founders-ai/`);
      }
    });
  });

  describe('CSS/Styles', () => {
    test('CSS includes --color-bg custom property token', () => {
      assert.ok(/--color-bg\s*:/i.test(allCss), 'Should contain --color-bg CSS custom property');
    });

    test('CSS includes prefers-reduced-motion media query', () => {
      assert.ok(
        /@media\s*\(prefers-reduced-motion\s*:\s*reduce\)/i.test(allCss),
        'Should contain @media (prefers-reduced-motion: reduce) query'
      );
    });

    test('prefers-reduced-motion hides the hero video', () => {
      assert.ok(
        /@media\s*\(prefers-reduced-motion\s*:\s*reduce\)[\s\S]*?\.hero-video(?:\[[^\]]+\])?\s*\{[^}]*display\s*:\s*none/i.test(allCss),
        'Should hide the hero video for reduced-motion preferences'
      );
    });
  });

  describe('Hero Video', () => {
    test('hero section has video element', () => {
      assert.ok(/<video\b/i.test(heroSection), 'Hero section should contain a <video> element');
    });

    test('hero video uses the local background asset', () => {
      const videoMatch = heroSection.match(/<video[\s\S]*?<\/video>/i);
      assert.ok(videoMatch, 'Should have a video element');
      assert.ok(/<source[^>]*src=["']?\/assets\/videos\/hero-bg\.mp4["']?/i.test(videoMatch[0]), 'Video should use the deployed local asset');
    });

    test('hero video has muted attribute', () => {
      const videoMatch = heroSection.match(/<video[\s\S]*?<\/video>/i);
      assert.ok(videoMatch, 'Should have a video element');
      const videoHtml = videoMatch[0];
      assert.ok(/\bmuted\b/i.test(videoHtml), 'Video should have muted attribute');
    });

    test('hero video has loop attribute', () => {
      const videoMatch = heroSection.match(/<video[\s\S]*?<\/video>/i);
      assert.ok(videoMatch, 'Should have a video element');
      const videoHtml = videoMatch[0];
      assert.ok(/\bloop\b/i.test(videoHtml), 'Video should have loop attribute');
    });

    test('hero video has playsinline attribute', () => {
      const videoMatch = heroSection.match(/<video[\s\S]*?<\/video>/i);
      assert.ok(videoMatch, 'Should have a video element');
      const videoHtml = videoMatch[0];
      assert.ok(/\bplaysinline\b/i.test(videoHtml), 'Video should have playsinline attribute');
    });

    test('hero video poster uses the local background asset', () => {
      const videoMatch = heroSection.match(/<video[\s\S]*?<\/video>/i);
      assert.ok(videoMatch, 'Should have a video element');
      assert.ok(/poster=["']?\/assets\/videos\/hero-bg\.mp4["']?/i.test(videoMatch[0]), 'Video poster should use the local asset');
    });

    test('decorative hero video is hidden from assistive technologies', () => {
      assert.ok(/class=["']?hero-visual["']?[^>]*aria-hidden=["']?true/i.test(heroSection), 'Decorative hero visual should be aria-hidden');
      const videoMatch = heroSection.match(/<video[\s\S]*?<\/video>/i);
      assert.ok(videoMatch && /\bmuted\b/i.test(videoMatch[0]), 'Decorative video should be muted');
    });
  });

  describe('Technology Logos', () => {
    test('technology items have inline SVG logos and translated names', () => {
      const itemMatches = techSection.match(/<li\b[^>]*class=["']?tech-item["']?[^>]*>[\s\S]*?<\/li>/gi) || [];
      assert.strictEqual(itemMatches.length, 15, 'Should have 15 technology items');
      for (const item of itemMatches) {
        assert.ok(/data-i18n=/i.test(item), 'Technology item should have a translation key');
        assert.ok(/<span[^>]*class=["']?tech-logo["']?[^>]*>\s*<svg/i.test(item), 'Technology item should contain an inline SVG logo');
        assert.ok(/<span[^>]*class=["']?tech-name["']?/i.test(item), 'Technology item should contain a name');
      }
    });
  });
});
