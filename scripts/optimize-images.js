#!/usr/bin/env node
/**
 * Otimiza imagens do site Nátalis Persianas:
 * - Redimensiona conforme contexto
 * - Converte raster para WebP
 * - Renomeia logo para assets/natalis-logo.webp
 * - Atualiza referências em index.html
 */
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(PUBLIC, 'assets');
const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const TEXT_EXT = new Set(['.html', '.js', '.css']);

const MAX_WIDTH = {
  hero: 1920,
  logo: 840,
  gallery: 1200,
  card: 800,
  default: 1200,
};

const LOGO_OLD = 'NATALIS-PERSIANAS.png.webp';
const LOGO_NEW = 'assets/natalis-logo.webp';

function log(msg) {
  console.log('[images] ' + msg);
}

function walkFiles(dir, filterFn) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      out.push(...walkFiles(full, filterFn));
    } else if (!filterFn || filterFn(full)) {
      out.push(full);
    }
  }
  return out;
}

function posixRel(file) {
  return path.relative(PUBLIC, file).split(path.sep).join('/');
}

function getMaxWidth(relPath) {
  const n = relPath.replace(/\\/g, '/');
  if (/hero-background|madeira-escritorio/i.test(n)) return MAX_WIDTH.hero;
  if (/natalis-logo/i.test(n)) return MAX_WIDTH.logo;
  return MAX_WIDTH.gallery;
}

function toWebpPath(relPath) {
  return relPath.replace(/\.(jpe?g|png|gif|webp)$/i, '.webp');
}

async function processRaster(filePath) {
  const rel = posixRel(filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.webp') {
    const meta = await sharp(filePath).metadata();
    const maxW = getMaxWidth(rel);
    if (meta.width && meta.width > maxW) {
      const tmp = filePath + '.tmp';
      await sharp(filePath)
        .resize({ width: maxW, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(tmp);
      fs.renameSync(tmp, filePath);
      return { rel, action: 'resized-webp' };
    }
    return { rel, action: 'kept-webp' };
  }

  const webpRel = toWebpPath(rel);
  const webpAbs = path.join(PUBLIC, webpRel);
  const maxW = getMaxWidth(rel);

  ensureDir(path.dirname(webpAbs));
  await sharp(filePath)
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(webpAbs);

  if (webpAbs !== filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return { rel, webpRel, action: 'converted' };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function processLogo() {
  const oldPath = path.join(PUBLIC, LOGO_OLD);
  const newAbs = path.join(PUBLIC, LOGO_NEW);
  if (!fs.existsSync(oldPath)) return null;

  ensureDir(path.dirname(newAbs));
  await sharp(oldPath)
    .resize({ width: MAX_WIDTH.logo, withoutEnlargement: true })
    .webp({ quality: 90, effort: 4 })
    .toFile(newAbs);
  fs.unlinkSync(oldPath);
  return { from: LOGO_OLD, to: LOGO_NEW };
}

function buildReplacementMap(results, logoRename) {
  const map = new Map();

  results.forEach(function (r) {
    if (!r.webpRel) return;
    const stem = path.basename(r.rel, path.extname(r.rel));
    const webpStem = path.basename(r.webpRel, '.webp');
    const fromNames = [
      path.basename(r.rel),
      r.rel,
      'assets/' + path.basename(r.rel),
    ];
    const toPaths = [
      path.basename(r.webpRel),
      r.webpRel,
      'assets/' + path.basename(r.webpRel),
    ];
    fromNames.forEach(function (from, i) {
      map.set(from, toPaths[i] || ('assets/' + path.basename(r.webpRel)));
    });
  });

  if (logoRename) {
    map.set(logoRename.from, logoRename.to);
    map.set('/' + logoRename.from, logoRename.to);
  }

  return map;
}

function replaceReferences(map) {
  const files = walkFiles(PUBLIC, function (file) {
    return TEXT_EXT.has(path.extname(file).toLowerCase());
  });

  const sortedKeys = Array.from(map.keys()).sort(function (a, b) {
    return b.length - a.length;
  });

  let updatedFiles = 0;
  files.forEach(function (file) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    sortedKeys.forEach(function (key) {
      if (content.includes(key)) {
        content = content.split(key).join(map.get(key));
      }
    });
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      updatedFiles += 1;
      log('refs: ' + path.relative(ROOT, file));
    }
  });
  return updatedFiles;
}

function verify() {
  const rasterLeft = walkFiles(ASSETS, function (file) {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });

  const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
  const badRefs = html.match(/assets\/[^"')\s]+\.(?:jpe?g|png|gif)/gi) || [];
  const rootBad = html.match(/[^/][^"')\s]+\.(?:jpe?g|png)(?!\.webp)/gi) || [];

  log('verificação — raster legado em assets/: ' + rasterLeft.length);
  log('verificação — refs assets não-webp: ' + badRefs.length);

  if (rasterLeft.length || badRefs.length) {
    rasterLeft.slice(0, 5).forEach(function (f) {
      log('  raster: ' + posixRel(f));
    });
    badRefs.slice(0, 5).forEach(function (r) {
      log('  ref: ' + r);
    });
    throw new Error('Verificação de imagens falhou.');
  }
}

async function main() {
  const logoRename = await processLogo();
  if (logoRename) log('logo renomeado: ' + logoRename.from + ' → ' + logoRename.to);

  const rasterFiles = walkFiles(ASSETS, function (file) {
    return RASTER_EXT.has(path.extname(file).toLowerCase());
  });

  log('processando ' + rasterFiles.length + ' arquivos em assets/…');
  const results = [];
  for (const file of rasterFiles) {
    results.push(await processRaster(file));
  }

  const converted = results.filter(function (r) {
    return r.action === 'converted';
  }).length;
  log(converted + ' convertidos para WebP');

  const map = buildReplacementMap(results, logoRename);
  const refFiles = replaceReferences(map);
  log(refFiles + ' arquivo(s) com referências atualizadas');

  verify();
  log('concluído — imagens em WebP, redimensionadas e referenciadas');
}

main().catch(function (err) {
  console.error('[images] ERRO:', err.message);
  process.exit(1);
});
