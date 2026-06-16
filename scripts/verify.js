#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const ASSETS = path.join(PUBLIC, 'assets');

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const raster = walk(ASSETS).filter(function (f) {
  return /\.(jpe?g|png|gif)$/i.test(f);
});

const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
const badRefs = html.match(/assets\/[^"')\s]+\.(?:jpe?g|png|gif)/gi) || [];

if (raster.length) {
  console.error('[verify] ERRO: imagens raster em assets/:');
  raster.forEach(function (f) {
    console.error('  ' + path.relative(PUBLIC, f));
  });
  process.exit(1);
}

if (badRefs.length) {
  console.error('[verify] ERRO: referências não-webp no HTML:');
  badRefs.forEach(function (r) {
    console.error('  ' + r);
  });
  process.exit(1);
}

if (!fs.existsSync(path.join(PUBLIC, 'index.html'))) {
  console.error('[verify] ERRO: public/index.html ausente');
  process.exit(1);
}

console.log('[verify] Site pronto para deploy em public/');
