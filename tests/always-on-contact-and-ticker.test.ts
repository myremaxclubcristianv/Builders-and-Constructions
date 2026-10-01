import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('1. LiveRollingTicker component exists and contains verified navigation anchors', () => {
  const filePath = path.join(process.cwd(), 'components', 'LiveRollingTicker.tsx');
  assert.ok(fs.existsSync(filePath), 'LiveRollingTicker.tsx must exist');
  
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('CONSTRUCTIONS by AiXLuxury'), 'Must include platform brand');
  assert.ok(content.includes('/intelligence'), 'Must link to /intelligence');
  assert.ok(content.includes('/projects'), 'Must link to /projects');
  assert.ok(content.includes('/services'), 'Must link to /services');
  assert.ok(content.includes('/knowledge/concrete'), 'Must link to concrete knowledge');
  assert.ok(content.includes('/signals'), 'Must link to signals');
  assert.ok(content.includes('open-quick-contact'), 'Must integrate with quick contact event');
  assert.ok(!content.includes('FAKE_'), 'No synthetic markers in ticker');
});

test('2. Ticker CSS animation uses hardware-accelerated transform with reduced motion support', () => {
  const cssPath = path.join(process.cwd(), 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  assert.ok(css.includes('@keyframes rollingTicker'), 'Must define rollingTicker keyframes');
  assert.ok(css.includes('animate-rolling-ticker'), 'Must define ticker animation class');
  assert.ok(css.includes('prefers-reduced-motion'), 'Must respect prefers-reduced-motion');
});

test('3. QuickContactModal component exists and provides all requested fields', () => {
  const filePath = path.join(process.cwd(), 'components', 'QuickContactModal.tsx');
  assert.ok(fs.existsSync(filePath), 'QuickContactModal.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('Spune-ne cu ce te putem ajuta'), 'Must have correct Romanian title');
  assert.ok(content.includes('Trimite-ne câteva detalii și revenim către tine'), 'Must have supporting copy');
  assert.ok(content.includes('Mesaj trimis'), 'Must have success state headline');
  assert.ok(content.includes('LEAD-'), 'Must format Request ID');
  assert.ok(content.includes('website_hp'), 'Must include honeypot field');
  assert.ok(content.includes('/api/intake'), 'Must submit to existing /api/intake endpoint');
  assert.ok(content.includes('general-contact'), 'Must use general-contact service ID');
  assert.ok(content.includes('Nu am putut trimite solicitarea'), 'Must have friendly error message');
});

test('4. SiteHeader mounts both LiveRollingTicker and QuickContactModal globally', () => {
  const headerPath = path.join(process.cwd(), 'components', 'SiteHeader.tsx');
  const header = fs.readFileSync(headerPath, 'utf8');
  assert.ok(header.includes('<LiveRollingTicker />'), 'SiteHeader must render LiveRollingTicker');
  assert.ok(header.includes('<QuickContactModal />'), 'SiteHeader must render QuickContactModal');
  assert.ok(header.includes('open-quick-contact'), 'SiteHeader must trigger open-quick-contact');
});
