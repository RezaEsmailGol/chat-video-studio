import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /<!DOCTYPE html>/i);
assert.match(html, /<canvas[^>]*id="chatCanvas"/);
assert.doesNotMatch(html, /studio-projects\.js/);

const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((script) => !script[1].includes('src=') && script[2].trim())
  .map((script) => script[2]);
assert.equal(scripts.length, 2, 'expected editor and projects code embedded in the HTML');
scripts.forEach((script, index) => new vm.Script(script, { filename: 'inline-' + index + '.js' }));
const all = scripts.join('\n');
assert.match(all, /indexedDB\.open/);
assert.match(all, /schemaVersion:\s*1/);
assert.match(all, /function importJSON/);
assert.match(all, /function downloadJSON/);
assert.match(all, /recorder\.mimeType/);
assert.match(all, /extension\s*=\s*actualType\.includes\('mp4'\)/);
assert.doesNotMatch(all, /presentExportedVideo\(videoBlob,\s*'mp4'\)/);
assert.match(all, /ناموفق بود/);
console.log('PASS: single-page JavaScript syntax, embedded persistence, and honest video format labeling');
