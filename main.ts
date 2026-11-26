// NusaStat entrypoint (Node 22, standard library only).
//
// The entry is the static site in app/ beside this file: plain HTML, CSS and
// ES-module JavaScript, no build step, nothing fetched over the network. This
// program hands it in: it stages app/ and screenshots/ under the output
// directory and writes dossier.json there with the vendored make.fun
// library, which is the summary the judge reads — the screenshots, the
// first load's files and bytes, and the source.
//
// Leave vendor/makefun-frontend.ts alone: the scorer requires dossier.json
// to be byte for byte what its own copy of that library writes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the rest refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB, more than 993 files and directories in
// app/ or 16 MiB of app files (app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

// Fail fast, before anything is copied, when the screenshots break the
// caps above: a bad set here would only be refused by the scorer later.
function checkScreenshots() {
  const dir = join(here, 'screenshots');
  if (!existsSync(dir)) return;
  const shots = readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (shots.length > DOSSIER_CAPS.screenshots.max) {
    throw new Error(`too many screenshots: ${shots.length} (max ${DOSSIER_CAPS.screenshots.max})`);
  }
  for (const shot of shots) {
    const bytes = statSync(join(dir, shot)).size;
    if (bytes > DOSSIER_CAPS.screenshots.max_bytes) {
      throw new Error(`screenshot ${shot} is ${bytes} bytes (max ${DOSSIER_CAPS.screenshots.max_bytes})`);
    }
  }
}

function checkApp() {
  if (!existsSync(join(here, 'app', 'index.html'))) {
    throw new Error('app/index.html is missing — nothing to hand in');
  }
}

function stageEntry() {
  checkApp();
  checkScreenshots();
  mkdirSync(out, { recursive: true });
  cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  if (existsSync(join(here, 'screenshots'))) {
    cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
  }
}

function writeDossier() {
  const dossier = buildDossier(out, DOSSIER_CAPS);
  writeFileSync(join(out, 'dossier.json'), dossier);
  return dossier.length;
}

stageEntry();
const dossierBytes = writeDossier();
console.log(`NusaStat staged to ${out} (dossier.json ${dossierBytes} bytes)`);
