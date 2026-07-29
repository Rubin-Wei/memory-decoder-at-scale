import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const pagesPrefix = "/memory-decoder-at-scale";

test("exports the complete paper site for GitHub Pages", async () => {
  const html = await readFile(new URL("out/index.html", projectRoot), "utf8");

  assert.match(html, /<title>Memory Decoder at Scale<\/title>/i);
  assert.match(html, /Memory Decoder at Scale/);
  assert.match(html, /A Pretrained, Parametric Long-Term Memory/);
  assert.match(html, /Disentangle long-term memory and reasoning/);
  assert.match(html, /entangle long-term memory and reasoning/);
  assert.match(html, /Long-Term Memory/);
  assert.match(html, /Base Model Parameters/);
  assert.match(html, /Memory Parameters/);
  assert.match(html, /<sub>base<\/sub>/);
  assert.match(html, /<sub>memory<\/sub>/);
  assert.match(html, /Attached Memory Module/);
  assert.doesNotMatch(html, /Separate reasoning from knowledge\.|Knowledge Parameters|Attached Knowledge Module/);
  assert.match(html, /final-memory-word/);
  assert.match(html, /brand-suffix/);
  assert.match(html, /brand-scale/);
  assert.match(html, /standalone memory that can be scaled/);
  assert.match(html, /standalone memory is trained to approximate retrieval-induced next-token distributions\./);
  assert.doesNotMatch(html, /standalone Memory Decoder that can be scaled/);
  assert.doesNotMatch(html, /retrieval-induced next-token distributions while retaining a next-token objective/);
  assert.doesNotMatch(html, /Choose a Memory Decoder logo|Option [A-F]:/);
  assert.match(html, /300B/);
  assert.doesNotMatch(html, /207B/);
  assert.match(html, /39%/);
  assert.match(html, /parameter-saving/);
  assert.match(html, /34～44%/);
  assert.match(html, /fewer parameters/);
  assert.match(html, /range-saving/);
  assert.match(html, /18/);
  assert.match(html, /Diverse Benchmarks/);
  assert.doesNotMatch(html, /General Benchmarks/);
  assert.match(html, /A wheel of memories/);
  assert.match(html, /Two base settings/);
  assert.match(html, /General memory pairs with Pythia-410M/);
  assert.match(html, /Interactive memory wheel/);
  assert.match(html, /General/);
  assert.match(html, /Two objectives/);
  assert.match(html, /Data Construction/);
  assert.match(html, /<mark class="distributed-faiss">Distributed Faiss<\/mark> pipeline for constructing pretraining-scale <i>k<\/i>NN distributions/);
  assert.doesNotMatch(html, /Faiss-powered/);
  assert.doesNotMatch(html, /Faiss-based distributed high-concurrency retrieval system/);
  assert.doesNotMatch(html, /Distributed high-concurrency search/);
  assert.doesNotMatch(html, /Pretraining-scale <i>k<\/i>NN Distribution construction/);
  assert.doesNotMatch(html, /Pretraining-scale retrieval-target construction/);
  assert.match(html, /Figure 3/);
  assert.match(html, /Scale memory/);
  assert.match(html, /small frozen base model paired with a large memory/i);
  assert.match(html, /Page contents/);
  assert.match(html, /General memory/);
  assert.match(html, /href="\/memory-decoder-at-scale\/paper\.pdf"/);
  assert.match(html, /src="\/memory-decoder-at-scale\/paper\/overview\.png"/);
  assert.match(html, /src="\/memory-decoder-at-scale\/paper\/construction\.png"/);
  assert.match(html, /src="\/memory-decoder-at-scale\/paper\/transfer\.png"/);
  assert.match(html, /og\.png/);
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
  assert.match(page, /SectionToc/);
  assert.match(page, /BrandLockup/);
  assert.match(page, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(page, /overview\.png[\s\S]*?width=\{1800\}[\s\S]*?height=\{1013\}/);
  assert.match(page, /construction\.png[\s\S]*?width=\{1800\}[\s\S]*?height=\{884\}/);
  assert.match(page, /transfer\.png[\s\S]*?width=\{1800\}[\s\S]*?height=\{1070\}/);
  assert.match(interactive, /generalResults/);
  assert.match(interactive, /domainResults/);
  assert.match(interactive, /wheel-track/);
  assert.match(interactive, /Pile General Memory/);
  assert.match(interactive, /General Pairing/);
  assert.match(interactive, /Shared Domain Base/);
  assert.match(interactive, /Attached Memory Module/);
  assert.doesNotMatch(interactive, /Attached Knowledge Module|reasoning backbone/);
  assert.match(interactive, /18 diverse benchmarks/);
  assert.doesNotMatch(interactive, /18 general benchmarks/);
  assert.match(interactive, /IntersectionObserver/);
  assert.match(interactive, /The Idea/);
  assert.match(interactive, /Swap Memory/);
  assert.match(interactive, /Data Construction/);
  assert.match(interactive, /Scale Memory/);
  assert.match(interactive, /Globe2/);
  assert.match(interactive, /Dna/);
  assert.match(interactive, /Scale/);
  assert.match(interactive, /ChartNoAxesCombined/);
  assert.doesNotMatch(interactive, /BrandPicker|brandOptions|chooseBrand/);
  assert.match(interactive, /ArrowLeft/);
  assert.match(interactive, /useState/);
  assert.match(layout, /Memory Decoder at Scale/);
  assert.match(layout, /entangle long-term memory and reasoning/);
  assert.doesNotMatch(layout, /Scale knowledge without scaling the reasoning backbone/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.hero h1 em\s*{[^}]*linear-gradient\([^}]*background-clip:\s*text/s);
  assert.match(css, /\.hero h1 em\s*{[^}]*padding-right:\s*0\.14em/s);
  assert.match(css, /\.brand-lockup\s*{[^}]*gap:\s*4px/s);
  assert.match(css, /\.brand-scale\s*{[^}]*linear-gradient\(90deg,\s*var\(--blue-dark\)[^}]*background-clip:\s*text[^}]*-webkit-text-fill-color:\s*transparent/s);
  assert.match(css, /\.compact-heading,[\s\S]*?\.figure3-heading\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*0\.9fr\)\s*minmax\(0,\s*1\.1fr\)/s);
  assert.match(css, /\.figure3-notes\s*{[^}]*align-content:\s*space-between/s);
  assert.match(css, /\.distributed-faiss\s*{[^}]*color:\s*var\(--blue-dark\)[^}]*linear-gradient\(90deg,\s*#e8f0ff,\s*#f3f7ff\)[^}]*font-weight:\s*800/s);
  assert.match(css, /\.fixed-base\s*{[^}]*align-items:\s*center/s);
  assert.match(css, /\.fixed-base div\s*{[^}]*justify-content:\s*center/s);
  assert.match(packageJson, /lucide-react/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|vinext|wrangler/);

  await Promise.all([
    access(new URL("public/paper.pdf", projectRoot)),
    access(new URL("public/paper/overview.png", projectRoot)),
    access(new URL("public/paper/construction.png", projectRoot)),
    access(new URL("public/paper/transfer.png", projectRoot)),
    access(new URL("public/og.png", projectRoot)),
  ]);
});
