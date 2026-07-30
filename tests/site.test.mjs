import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('usa o domínio oficial em SEO, robots e sitemap', async () => {
  const [html, robots, sitemap] = await Promise.all([
    read('index.html'),
    read('robots.txt'),
    read('sitemap.xml')
  ]);

  assert.match(html, /https:\/\/jsbsmartservices\.com\.br\//);
  assert.doesNotMatch(html, /github\.io\/SITE-JSB-SMART-SERVICE/);
  assert.match(robots, /https:\/\/jsbsmartservices\.com\.br\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/jsbsmartservices\.com\.br\//);
});

test('mantém WhatsApp e canais públicos configurados', async () => {
  const content = await read('data/content.js');
  assert.match(content, /whatsappNumber:\s*'5562984853703'/);
  assert.match(content, /Instagram/);
  assert.match(content, /github\.com\/JonathassBarbosa/);
});

test('inclui privacidade, segurança e recursos essenciais', async () => {
  const [html, headers, privacy] = await Promise.all([
    read('index.html'),
    read('_headers'),
    read('privacidade.html')
  ]);

  assert.match(html, /Política de Privacidade/);
  assert.match(headers, /Content-Security-Policy/);
  assert.match(privacy, /não armazena esses dados em um banco de dados do site/i);

  for (const path of ['assets/jsb-icon-512.png', 'assets/og-jsb-1200.png', '404.html', 'site.webmanifest']) {
    const info = await stat(new URL(`../${path}`, import.meta.url));
    assert.ok(info.size > 0, `${path} deve existir e não estar vazio`);
  }
});

test('não expõe placeholders de contato ao visitante', async () => {
  const content = await read('data/content.js');
  const socialBlock = content.match(/socialLinks:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
  assert.doesNotMatch(socialBlock, /url:\s*''/);
});
