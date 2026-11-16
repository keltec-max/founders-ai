async page => {
  const results = [];
  const languages = { pt: 'pt-BR', en: 'en-US', de: 'de-DE', es: 'es-ES' };
  const countries = { pt: 'br', en: 'us', de: 'de', es: 'es' };
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [lang, htmlLang] of Object.entries(languages)) {
      const button = page.locator(`[data-lang="${lang}"]`);
      await button.click();
      const actual = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        viewport: document.documentElement.clientWidth,
        pageWidth: document.documentElement.scrollWidth,
        container: document.querySelector('.container').getBoundingClientRect().width,
        active: document.querySelectorAll('[data-lang][aria-pressed="true"]').length,
        title: document.querySelector('h1').textContent,
      }));
      const flag = await button.locator('img').evaluate(img => ({
        loaded: img.complete && img.naturalWidth > 0,
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
      }));
      if (
        actual.lang !== htmlLang ||
        actual.active !== 1 ||
        (await button.getAttribute('aria-pressed')) !== 'true'
      ) {
        throw new Error(`Seleção de idioma incorreta: ${lang} / ${width}px`);
      }
      if (!flag.loaded || !flag.src.endsWith(`/flags/${countries[lang]}.svg`) || flag.alt !== '') {
        throw new Error(`Bandeira incorreta ou não carregada: ${lang}`);
      }
      if (!(await button.getAttribute('aria-label')))
        throw new Error(`Botão sem nome acessível: ${lang}`);
      if (actual.pageWidth > actual.viewport || actual.container > 1280) {
        throw new Error(`Dimensões incorretas: ${JSON.stringify(actual)}`);
      }
      results.push({ width, ...actual });
    }
  }
  await page.reload();
  if ((await page.locator('html').getAttribute('lang')) !== 'es-ES')
    throw new Error('Idioma não persistiu após recarregar');
  await page.locator('[data-lang="pt"]').click();
  return results;
};
