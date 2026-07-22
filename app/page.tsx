import Image from "next/image";
import { MemoryWheel, ResultsExplorer } from "./interactive-paper";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function asset(path: string) {
  return `${basePath}${path}`;
}

const authors = [
  "Rubin Wei",
  "Jiaqi Cao",
  "Jiarui Wang",
  "Junming Zhang",
  "Qipeng Guo",
  "Bowen Zhou",
  "Zhouhan Lin",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main id="top">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Memory Decoder at Scale">
          <span className="brand-mark">M</span>
          <span>Memory Decoder</span>
        </a>
        <div className="nav-links">
          <a href="#idea">Idea</a>
          <a href="#swap">Swap memory</a>
          <a href="#results">Results</a>
          <a className="nav-paper" href={asset("/paper.pdf")}>Paper <Arrow /></a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A PARAMETRIC LONG-TERM MEMORY PRETRAINED AT SCALE</p>
          <h1>Memory Decoder<br /><em>at Scale</em></h1>
          <p className="hero-deck">
            Pretrain knowledge as a standalone memory. Attach it to a frozen language model.
            Swap what the model remembers without retraining how it reasons.
          </p>

          <div className="hero-actions">
            <a className="button primary-button" href={asset("/paper.pdf")}>Read the paper <Arrow /></a>
            <a className="button quiet-button" href="https://github.com/LUMIA-Group/MemoryPretrain">GitHub <Arrow /></a>
            <a className="text-link" href="https://huggingface.co/collections/Rubin-Wei/memorypretrain">Hugging Face <Arrow /></a>
          </div>

          <p className="authors">
            {authors.map((author, index) => (
              <span key={author}>{author}{index === authors.length - 1 ? "‡" : ""}</span>
            ))}
          </p>
          <p className="affiliations">LUMIA Lab · Shanghai Jiao Tong University · Shanghai AI Laboratory · Tsinghua University</p>
        </div>

        <div className="hero-idea" aria-label="Core architecture">
          <div className="hero-module base-module">
            <small>FROZEN BASE</small>
            <strong>Reason</strong>
            <span>language &amp; computation</span>
          </div>
          <div className="parallel-mark" aria-hidden="true"><i /><b>+</b><i /></div>
          <div className="hero-module memory-module">
            <small>SWAPPABLE MEMORY</small>
            <strong>Remember</strong>
            <span>corpus knowledge</span>
          </div>
          <div className="distribution-line"><span>run separately</span><i /><span>combine once</span></div>
        </div>
      </header>

      <section className="idea-section section-shell" id="idea" aria-labelledby="idea-title">
        <div className="section-label">01 · THE IDEA</div>
        <div className="idea-copy">
          <h2 id="idea-title">Knowledge and reasoning do not need to live in the same parameters.</h2>
          <p>
            Standard language models use one parameter set both to retain long-term knowledge and to perform language modeling and reasoning. We separate those roles: a frozen base model computes, while an independently pretrained memory supplies corpus knowledge.
          </p>
        </div>
        <div className="study-stats" aria-label="Study scale">
          <article><strong>207B</strong><span>corpus tokens indexed</span></article>
          <article><strong>300B</strong><span>memory training tokens</span></article>
          <article><strong>6.9B</strong><span>largest memory</span></article>
          <article><strong>18</strong><span>general benchmarks</span></article>
        </div>
      </section>

      <MemoryWheel />

      <section className="method-section section-shell" id="method" aria-labelledby="method-title">
        <div className="section-label">03 · HOW IT WORKS</div>
        <div className="section-heading compact-heading">
          <h2 id="method-title">Retriever behavior,<br />made parametric.</h2>
          <p>Three steps turn corpus-scale nearest-neighbor evidence into a reusable decoder memory.</p>
        </div>

        <div className="method-grid">
          <details open>
            <summary><span>01</span><strong>Construct targets</strong><b aria-hidden="true">+</b></summary>
            <p>Retrieve nearby context states and aggregate their next tokens into a sparse target distribution.</p>
          </details>
          <details>
            <summary><span>02</span><strong>Pretrain memory</strong><b aria-hidden="true">+</b></summary>
            <p>Train a decoder to approximate the retrieval distribution while retaining a next-token objective.</p>
          </details>
          <details>
            <summary><span>03</span><strong>Attach at inference</strong><b aria-hidden="true">+</b></summary>
            <p>Run base and memory in parallel, then interpolate their predictions without accessing the datastore.</p>
          </details>
        </div>

        <div className="equation-band" aria-label="Inference interpolation equation">
          <span>INFERENCE</span>
          <p><i>p</i><sub>final</sub> = (1 − α) <i>p</i><sub>base</sub> + α <i>p</i><sub>memory</sub></p>
          <small>two forward passes · one final distribution</small>
        </div>

        <details className="paper-diagram">
          <summary>See the full architecture from the paper <span aria-hidden="true">↓</span></summary>
          <figure>
            <Image
              src={asset("/paper/overview.png")}
              alt="The Memory Decoder training and inference architecture."
              width={1489}
              height={850}
            />
            <figcaption>The original paper overview: retrieval-shaped pretraining on the left, datastore-free parallel inference on the right.</figcaption>
          </figure>
        </details>
      </section>

      <section className="results-section" id="results" aria-labelledby="results-title">
        <div className="section-shell">
          <div className="section-label">04 · RESULTS</div>
          <div className="section-heading results-heading">
            <h2 id="results-title">Scale memory,<br /><em>not the backbone.</em></h2>
            <p>Interactive views replace dense tables: switch between general and domain memory to see the gain at every tested scale.</p>
          </div>

          <div className="headline-result">
            <div><small>PYTHIA-410M + MEMORY-6.9B</small><strong>35.58</strong><span>18-task average</span></div>
            <p>beats</p>
            <div className="muted-result"><small>FROZEN PYTHIA-12B</small><strong>35.38</strong><span>18-task average</span></div>
            <aside><strong>39%</strong><span>fewer total parameters</span></aside>
          </div>

          <ResultsExplorer />

          <div className="evidence-row">
            <article><strong>51 / 54</strong><p>general-memory task–scale combinations improve.</p></article>
            <article><strong>15 / 15</strong><p>domain evaluations improve across all Qwen3 scales.</p></article>
            <article><strong>20%</strong><p>of the standard budget transfers memory across vocabularies.</p></article>
          </div>
        </div>
      </section>

      <section className="resources section-shell" aria-labelledby="resources-title">
        <div className="section-label">05 · EXPLORE</div>
        <div className="section-heading compact-heading">
          <h2 id="resources-title">Read, reproduce,<br />and reuse.</h2>
          <p>The manuscript, implementation, and released memory checkpoints.</p>
        </div>
        <div className="resource-links">
          <a href={asset("/paper.pdf")}><span>Paper</span><strong>Read the manuscript</strong><Arrow /></a>
          <a href="https://github.com/LUMIA-Group/MemoryPretrain"><span>GitHub</span><strong>Browse the code</strong><Arrow /></a>
          <a href="https://huggingface.co/collections/Rubin-Wei/memorypretrain"><span>Models</span><strong>Use the memories</strong><Arrow /></a>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">M</span><span>Memory Decoder at Scale</span></a>
        <p>A Pretrained, Parametric Long-Term Memory</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
