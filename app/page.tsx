import Image from "next/image";
import { MemoryWheel, ResultsExplorer, SectionToc } from "./interactive-paper";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function asset(path: string) {
  return `${basePath}${path}`;
}

const authors = [
  { name: "Rubin Wei", affiliations: "1,2" },
  { name: "Jiaqi Cao", affiliations: "1" },
  { name: "Jiarui Wang", affiliations: "1,2" },
  { name: "Junming Zhang", affiliations: "1" },
  { name: "Qipeng Guo", affiliations: "2" },
  { name: "Bowen Zhou", affiliations: "2,3" },
  { name: "Zhouhan Lin", affiliations: "1,2", corresponding: true },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function BrandLockup({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand brand-lockup${footer ? " footer-brand" : ""}`} href="#overview" aria-label="Memory Decoder at Scale">
      <span className="final-memory-word" aria-hidden="true">
        <strong><span>M</span><i /></strong>
        <span>emory</span>
      </span>
      <span className="brand-suffix">Decoder at Scale</span>
    </a>
  );
}

export default function Home() {
  return (
    <main id="top">
      <nav className="site-nav" aria-label="Primary navigation">
        <BrandLockup />
        <div className="nav-links">
          <a href="#swap">Swap Memory</a>
          <a href="#architecture">Architecture</a>
          <a href="#figure3">Scale Memory</a>
          <a href="#results">Results</a>
          <a className="nav-paper" href={asset("/paper.pdf")}>Paper <Arrow /></a>
        </div>
      </nav>

      <SectionToc />

      <header className="hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">A Parametric Long-Term Memory Pretrained at Scale</p>
          <h1><span className="hero-title-line">Memory Decoder</span><br /><em>at Scale</em></h1>
          <p className="hero-deck">
            Separate reasoning from knowledge. Keep reasoning in a frozen language model,
            pretrain knowledge as a standalone memory, and scale either component independently.
          </p>

          <div className="hero-actions">
            <a className="button primary-button" href={asset("/paper.pdf")}>Read the Paper <Arrow /></a>
            <a className="button quiet-button" href="https://github.com/LUMIA-Group/MemoryPretrain">GitHub <Arrow /></a>
            <a className="button quiet-button" href="https://huggingface.co/collections/Rubin-Wei/memorypretrain">Hugging Face <Arrow /></a>
          </div>

          <p className="authors">
            {authors.map((author) => (
              <span key={author.name}>
                {author.name}<sup>{author.affiliations}{author.corresponding ? "‡" : ""}</sup>
              </span>
            ))}
          </p>
          <div className="affiliations">
            <p><span>1</span><span>LUMIA Lab, School of Artificial Intelligence, Shanghai Jiao Tong University</span></p>
            <p><span>2</span><span>Shanghai Artificial Intelligence Laboratory</span></p>
            <p><span>3</span><span>Electronic Engineering, Tsinghua University</span></p>
          </div>
        </div>

        <div className="hero-idea" aria-label="Core architecture">
          <div className="hero-module base-module">
            <small>Frozen Base Model</small>
            <strong>Reasoning</strong>
            <span>language modeling &amp; reasoning</span>
          </div>
          <div className="parallel-mark" aria-hidden="true"><i /><b>+</b><i /></div>
          <div className="hero-module memory-module">
            <small>Swappable Memory</small>
            <strong>Knowledge</strong>
            <span>general or domain corpus knowledge</span>
          </div>
          <div className="distribution-line"><span>Run Separately</span><i /><span>Combine Once</span></div>
        </div>
      </header>

      <section className="idea-section section-shell" id="idea" aria-labelledby="idea-title">
        <div className="section-label">01 · The Idea</div>
        <div className="idea-copy">
          <h2 id="idea-title">Knowledge and reasoning do not need to live in the same parameters.</h2>
          <p>
            A standard language model uses one parameter set both to retain long-term knowledge and to reason.
            We factor those roles into a frozen base model for reasoning and an independently pretrained decoder memory for knowledge.
          </p>
        </div>
        <div className="study-stats" aria-label="Study scale">
          <article><strong>300B</strong><span>Memory Training Tokens</span></article>
          <article><strong>6.9B</strong><span>Largest Memory</span></article>
          <article><strong>18</strong><span>General Benchmarks</span></article>
          <article><strong>3</strong><span>Domain Memories</span></article>
        </div>
      </section>

      <MemoryWheel />

      <section className="architecture-section section-shell" id="architecture" aria-labelledby="architecture-title">
        <div className="section-label">03 · Architecture</div>
        <div className="section-heading compact-heading">
          <h2 id="architecture-title">Two objectives.<br /><em>One prediction.</em></h2>
          <p>The base model learns language modeling and reasoning; the memory distills retrieval-induced next-token distributions into parametric knowledge. At inference, both process the same context in parallel.</p>
        </div>

        <figure className="paper-feature architecture-figure">
          <div className="figure-kicker"><span>Figure 1</span><strong>Training and inference architecture</strong></div>
          <Image
            src={asset("/paper/overview.png")}
            alt="The base model is trained for next-token prediction, the parametric memory aligns with a retriever distribution, and their predictions are interpolated at inference."
            width={1489}
            height={850}
          />
          <figcaption>Independent pretraining preserves role separation; inference requires no online datastore.</figcaption>
        </figure>

        <div className="architecture-principles">
          <article><span>θ</span><div><small>Reasoning Parameters</small><strong>Frozen base model</strong><p>Standard next-token pretraining supplies language modeling, computation, and reasoning.</p></div></article>
          <article><span>ψ</span><div><small>Knowledge Parameters</small><strong>Standalone memory</strong><p>A decoder learns the retrieval-induced distribution while retaining a next-token objective.</p></div></article>
          <article><span>α</span><div><small>Plug-and-Play Inference</small><strong>Parallel composition</strong><p>Exchange the active memory, then interpolate two next-token distributions.</p></div></article>
        </div>

        <div className="equation-band" aria-label="Inference interpolation equation">
          <span>Inference</span>
          <p><i>p</i><sub>final</sub> = (1 − α) <i>p</i><sub>reasoning</sub> + α <i>p</i><sub>knowledge</sub></p>
          <small>Two Forward Passes · One Final Distribution</small>
        </div>
      </section>

      <section className="construction-section" id="construction" aria-labelledby="construction-title">
        <div className="section-shell">
          <div className="section-label">04 · Data Construction</div>
          <div className="section-heading construction-heading">
            <h2 id="construction-title">Turn retrieval into<br /><em>pretraining targets.</em></h2>
            <p>At pretraining scale, a corpus with <i>N</i> tokens yields <i>N</i> keys and <i>N</i> training queries, creating a joint indexing-and-search bottleneck. Compression, centroid-range sharding, and parallel GPU search enable memory pretraining over 300B training tokens.</p>
          </div>

          <div className="construction-steps" aria-label="Retrieval target construction steps">
            <article><span>01</span><strong>Encode</strong><p>Use the frozen Pythia-6.9B final hidden state as a 4096-d key for each context.</p></article>
            <article><span>02</span><strong>Compress</strong><p>OPQ256 projects every key from 4096 to 256 dimensions before indexing.</p></article>
            <article><span>03</span><strong>Route</strong><p>HNSW selects IVF centroids, then maps each query to centroid-range shards.</p></article>
            <article><span>04</span><strong>Search &amp; merge</strong><p>GPU shards search independently; workers merge neighbors into a sparse next-token target.</p></article>
          </div>

          <figure className="paper-feature construction-figure">
            <div className="figure-kicker"><span>Figure 2</span><strong>Pretraining-scale retrieval-target construction</strong></div>
            <Image
              src={asset("/paper/construction.png")}
              alt="OPQ compression, HNSW and IVF two-level routing, and independent search over centroid-range shards."
              width={1410}
              height={532}
            />
            <figcaption>Queries are grouped by shard ID so each selected shard can search its batch independently with GPU acceleration.</figcaption>
          </figure>
        </div>
      </section>

      <section className="figure3-section section-shell" id="figure3" aria-labelledby="figure3-title">
        <div className="section-label">05 · Scale Memory</div>
        <div className="section-heading figure3-heading">
          <h2 id="figure3-title">Scale memory,<br /><em>not reasoning.</em></h2>
          <p>Our results show that a small frozen base model paired with a large memory offers a clear performance–efficiency advantage. Under matched training budgets, allocating capacity to memory consistently shifts the scaling frontier upward.</p>
        </div>

        <div className="figure3-layout">
          <figure className="paper-feature transfer-figure">
            <div className="figure-kicker"><span>Figure 3</span><strong>General memory transfer across backbones</strong></div>
            <a href={asset("/paper/transfer.png")} target="_blank" rel="noreferrer" aria-label="Open Figure 3 at full size">
              <Image
                src={asset("/paper/transfer.png")}
                alt="Average score across 18 tasks versus total parameters, comparing frozen base models with base plus memory configurations."
                width={1195}
                height={710}
              />
              <span>Open full size <Arrow /></span>
            </a>
          </figure>

          <aside className="figure3-notes" aria-label="Figure 3 takeaways">
            <div className="main-takeaway">
              <small>Pythia-410M + Memory-6.9B</small>
              <strong>35.58</strong>
              <p>beats the frozen Pythia-12B score of 35.38 with</p>
              <div className="parameter-saving"><b>39%</b><span>fewer total<br />parameters</span></div>
            </div>
            <article><strong>18 / 18</strong><p>Base + Memory configurations outperform their frozen backbone alone.</p></article>
            <article className="range-saving-card">
              <strong className="range-saving"><b>34–44%</b><span>fewer parameters</span></strong>
              <p>at matched scores along the two scaling curves.</p>
            </article>
            <div className="figure-guide"><span><i /> circle area</span> total parameters<br /><span><i /> split fill</span> base / memory fractions</div>
          </aside>
        </div>
      </section>

      <section className="results-section" id="results" aria-labelledby="results-title">
        <div className="section-shell">
          <div className="section-label">06 · More Results</div>
          <div className="section-heading results-heading">
            <h2 id="results-title">The gain persists<br /><em>across settings.</em></h2>
            <p>Switch between general and domain memory to see how the same knowledge module idea behaves across backbone scales.</p>
          </div>

          <ResultsExplorer />

          <div className="evidence-row">
            <article><strong>51 / 54</strong><p>general-memory task–scale combinations improve.</p></article>
            <article><strong>15 / 15</strong><p>domain evaluations improve across all Qwen3 scales.</p></article>
            <article><strong>20%</strong><p>of the standard budget transfers memory across vocabularies.</p></article>
          </div>
        </div>
      </section>

      <section className="resources section-shell" id="resources" aria-labelledby="resources-title">
        <div className="section-label">07 · Explore</div>
        <h2 id="resources-title" className="visually-hidden">Paper, code, and models</h2>
        <div className="resource-links simple-resource-links">
          <a href={asset("/paper.pdf")}><strong>Paper</strong><Arrow /></a>
          <a href="https://github.com/LUMIA-Group/MemoryPretrain"><strong>Code</strong><Arrow /></a>
          <a href="https://huggingface.co/collections/Rubin-Wei/memorypretrain"><strong>Models</strong><Arrow /></a>
        </div>
      </section>

      <footer>
        <BrandLockup footer />
        <p>Separating reasoning from knowledge</p>
        <a href="#overview">Back to top ↑</a>
      </footer>
    </main>
  );
}
