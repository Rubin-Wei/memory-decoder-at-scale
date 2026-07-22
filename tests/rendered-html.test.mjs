import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const pagesPrefix = "/memory-decoder-at-scale";

test("exports the complete paper site for GitHub Pages", async () => {
  const html = await readFile(new URL("out/index.html", projectRoot), "utf8");

  assert.match(html, /<title>Memory Decoder at Scale<\/title>/i);
  assert.match(html, /Memory Decoder/);
  assert.match(html, /207B/);
  assert.match(html, /39%/);
  assert.match(html, /A wheel of memories/);
  assert.match(html, /Interactive memory wheel/);
  assert.match(html, /General memory/);
  assert.match(html, /href="\/memory-decoder-at-scale\/paper\.pdf"/);
  assert.match(html, /src="\/memory-decoder-at-scale\/paper\/overview\.png"/);
  assert.match(html, /social-preview\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("every exported GitHub Pages asset reference resolves", async () => {
  const html = await readFile(new URL("out/index.html", projectRoot), "utf8");
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((reference) => reference.startsWith(pagesPrefix));

  assert.ok(references.length > 10);

  await Promise.all(
    references.map((reference) => {
      const exportedPath = reference.slice(pagesPrefix.length).split("?")[0];
      return access(new URL(`out${exportedPath}`, projectRoot));
    }),
  );
});

test("keeps interactive source and the paper assets", async () => {
  const [page, interactive, layout, css, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/interactive-paper.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /ResultsExplorer/);
  assert.match(page, /MemoryWheel/);
  assert.match(page, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(interactive, /generalResults/);
  assert.match(interactive, /domainResults/);
  assert.match(interactive, /wheel-track/);
  assert.match(interactive, /ArrowLeft/);
  assert.match(interactive, /useState/);
  assert.match(layout, /Memory Decoder at Scale/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|vinext|wrangler/);

  await Promise.all([
    access(new URL("public/paper.pdf", projectRoot)),
    access(new URL("public/paper/overview.png", projectRoot)),
    access(new URL("public/paper/construction.png", projectRoot)),
    access(new URL("public/paper/transfer.png", projectRoot)),
    access(new URL("public/social-preview.png", projectRoot)),
  ]);
});
