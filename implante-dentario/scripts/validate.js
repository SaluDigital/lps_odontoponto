const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const errors = [];

function fail(message) {
  errors.push(message);
}

if (!/^<!doctype html>/i.test(html.trimStart())) {
  fail("index.html deve comecar com <!doctype html>.");
}

const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]));
const anchors = Array.from(html.matchAll(/\bhref="#([^"]+)"/g), match => match[1]);
const missingAnchors = anchors.filter(anchor => !ids.has(anchor));

if (missingAnchors.length) {
  fail(`Ancoras sem destino: ${Array.from(new Set(missingAnchors)).join(", ")}.`);
}

const assetRefs = Array.from(
  html.matchAll(/\b(?:src|href)="(assets\/[^"]+)"/g),
  match => match[1]
);
const missingAssets = assetRefs.filter(asset => !fs.existsSync(path.join(root, asset)));

if (missingAssets.length) {
  fail(`Assets ausentes: ${Array.from(new Set(missingAssets)).join(", ")}.`);
}

const scripts = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi), match => match[1]);
scripts.forEach((script, index) => {
  try {
    new Function(script);
  } catch (error) {
    fail(`Script inline ${index + 1} tem erro de sintaxe: ${error.message}.`);
  }
});

const requiredElements = ["siteHeader", "menuToggle", "mobileNav", "yr"];
requiredElements.forEach(id => {
  if (!ids.has(id)) {
    fail(`Elemento obrigatorio ausente: #${id}.`);
  }
});

if (errors.length) {
  console.error("Validacao falhou:");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Validacao concluida: index.html, ancoras, assets e scripts estao OK.");
