// Appends a content-hash version (?v=xxxxxxxx) to shared asset links in every
// HTML page so browsers and the Sucuri cache pick up changes after a deploy.
// Run via `npm run build` (or `npm run stamp`). Lives in src/, which is not deployed.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const assets = ['site.js', 'site.css', 'tailwind.css'];
const skipDirs = new Set(['.git', 'node_modules', 'docs', 'src', '.playwright-mcp']);

const hashes = Object.fromEntries(
  assets.map((a) => [a, createHash('sha256').update(readFileSync(join(root, a))).digest('hex').slice(0, 8)])
);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return skipDirs.has(name) ? [] : htmlFiles(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let changed = 0;
for (const file of htmlFiles(root)) {
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const [asset, hash] of Object.entries(hashes)) {
    const re = new RegExp(`((?:href|src)="(?:\\.\\./)*${escape(asset)})(?:\\?v=[0-9a-f]*)?"`, 'g');
    after = after.replace(re, `$1?v=${hash}"`);
  }
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`stamped ${changed} page(s):`, Object.entries(hashes).map(([a, h]) => `${a}?v=${h}`).join(' '));
