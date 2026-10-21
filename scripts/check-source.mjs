import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const projects = fs.readFileSync(new URL('../studio-projects.js', import.meta.url), 'utf8');
assert.match(html, /<!DOCTYPE html>/i);
assert.match(html, /<canvas[^>]*id="chatCanvas"/);
assert.match(html, /src="\.\/studio-projects\.js"/);
assert.match(projects, /indexedDB\.open/);
assert.match(projects, /schemaVersion:\s*1/);
assert.match(projects, /function importJSON/);
assert.match(projects, /function downloadJSON/);

let inlineScripts = 0;
for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (script[1].includes('src=')) continue;
  if (script[2].trim()) {
    new vm.Script(script[2], { filename: 'inline-script.js' });
    inlineScripts++;
  }
}
assert.ok(inlineScripts > 0, 'expected inline application JavaScript');
new vm.Script(projects, { filename: 'studio-projects.js' });

const recorder = html.split('async function renderWithMediaRecorder')[1]?.split('function presentExportedVideo')[0];
assert.ok(recorder, 'expected fallback renderer');
assert.match(recorder, /recorder\.mimeType/);
assert.match(recorder, /extension\s*=\s*actualType\.includes\('mp4'\)/);
assert.doesNotMatch(recorder, /presentExportedVideo\(videoBlob,\s*'mp4'\)/);
assert.match(html, /ناموفق بود/);
console.log('PASS: HTML/JS syntax, project persistence hooks and video format labeling');
