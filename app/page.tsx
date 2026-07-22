import Image from "next/image";
import { MemoryWheel, ResultsExplorer, SectionToc } from "./interactive-paper";

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
        <a className="brand" href="#overview" aria-label="Memory Decoder at Scale">
          <span className="brand-mark">M</span>
          <span>Memory Decoder</span>
        </a>
        <div className="nav-links">
          <a href="#architecture">Architecture</a>
          <a href="#figure3">Figure 3</a>
          <a href="#results">Results</a>
          <a className="nav-paper" href={asset("/paper.pdf")}>Paper <Arrow /></a>
        </div>
      </nav>

      <SectionToc />

      <header className="hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">A PARAMETRIC LONG-TERM MEMORY PRETRAINED AT SCALE</p>
          <h1>Memory Decoder<br /><em>at Scale</em></h1>
          <p className="hero-deck">
            Separate reasoning from knowledge. Keep reasoning in a frozen language model,
            pretrain knowledge as a standalone memory, and scale either component independently.
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
            <small>FROZEN BASE MODEL</small>
            <strong>Reasoning</strong>
            <span>language modeling &amp; computation</span>
          </div>
          <div className="parallel-mark" aria-hidden="true"><i /><b>+</b><i /></div>
          <div className="hero-module memory-module">
            <small>SWAPPABLE MEMORY</small>
            <strong>Knowledge</strong>
            <span>general or domain corpus knowledge</span>
          </div>
          <div className="distribution-line"><span>run separately</span><i /><span>combine once</span></div>
        </div>
      </header>

      <section className="idea-section section-shell" id="idea" aria-labelledby="idea-title">
        <div className="section-label">01 · THE IDEA</div>
        <div className="idea-copy">
          <h2 id="idea-title">Knowledge and reasoning do not need to live in the same parameters.</h2>
          <p>
            A standard language model uses one parameter set both to retain long-term knowledge and to reason.
            We factor those roles into a frozen base model for reasoning and an independently pretrained decoder memory for knowledge.
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

      <section className="architecture-section section-shell" id="architecture" aria-labelledby="architecture-title">
        <div className="section-label">03 · ARCHITECTURE</div>
        <div className="section-heading compact-heading">
          <h2 id="architecture-title">Two objectives.<br /><em>One prediction.</em></h2>
          <p>The base model learns to reason; the memory learns retrieval-shaped corpus knowledge. At inference, both process the same context in parallel.</p>
        </div>

        <figure className="paper-feature architecture-figure">
          <div className="figure-kicker"><span>FIGURE 1</span><strong>Training and inference architecture</strong></div>
          <Image
            src={asset("/paper/overview.png")}
            alt="The base model is trained for next-token prediction, the parametric memory aligns with a retriever distribution, and their predictions are interpolated at inference."
            width={1489}
            height={850}
          />
          <figcaption>Independent pretraining preserves role separation; inference requires no online datastore.</figcaption>
        </figure>

        <div className="architecture-principles">
          <article><span>θ</span><div><small>REASONING PARAMETERS</small><strong>Frozen base model</strong><p>Standard next-token pretraining supplies language modeling, computation, and reasoning.</p></div></article>
          <article><span>ψ</span><div><small>KNOWLEDGE PARAMETERS</small><strong>Standalone memory</strong><p>A decoder learns the retrieval-induced distribution while retaining a next-token objective.</p></div></article>
          <article><span>α</span><div><small>PLUG-AND-PLAY INFERENCE</small><strong>Parallel composition</strong><p>Exchange the active memory, then interpolate two next-token distributions.</p></div></article>
        </div>

        <div className="equation-band" aria-label="Inference interpolation equation">
          <span>INFERENCE</span>
          <p><i>p</i><sub>final</sub> = (1 − α) <i>p</i><sub>reasoning</sub> + α <i>p</i><sub>knowledge</sub></p>
          <small>two forward passes · one final distribution</small>
        </div>
      </section>

      <section className="construction-section" id="construction" aria-labelledby="construction-title">
        <div className="section-shell">
          <div className="section-label">04 · DATA CONSTRUCTION</div>
          <div className="section-heading construction-heading">
            <h2 id="construction-title">Turn retrieval into<br /><em>pretraining targets.</em></h2>
            <p>A naive pipeline requires every corpus position to search an index built from every other position. Compression and centroid-range sharding make this practical at 207B-token scale.</p>
          </div>

          <div className="construction-steps" aria-label="Retrieval target construction steps">
            <article><span>01</span><strong>Encode</strong><p>Use the frozen Pythia-6.9B final hidden state as a 4096-d key for each context.</p></article>
            <article><span>02</span><strong>Compress</strong><p>OPQ256 projects every key from 4096 to 256 dimensions before indexing.</p></article>
            <article><span>03</span><strong>Route</strong><p>HNSW selects IVF centroids, then maps each query to centroid-range shards.</p></article>
            <article><span>04</span><strong>Search &amp; merge</strong><p>GPU shards search independently; workers merge neighbors into a sparse next-token target.</p></article>
          </div>

          <figure className="paper-feature construction-figure">
            <div className="figure-kicker"><span>FIGURE 2</span><strong>Pretraining-scale retrieval-target construction</strong></div>
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
        <div className="section-label">05 · THE MAIN RESULT</div>
        <div className="section-heading figure3-heading">
          <h2 id="figure3-title">Scale knowledge,<br /><em>not reasoning.</em></h2>
          <p>Figure 3 compares frozen backbones with Base + Memory systems under matched training budgets. The memory allocation consistently shifts the efficiency frontier upward.</p>
        </div>

        <div className="figure3-layout">
          <figure className="paper-feature transfer-figure">
            <div className="figure-kicker"><span>FIGURE 3</span><strong>General memory transfer across backbones</strong></div>
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
            <div className="main-takeaway"><small>PYTHIA-410M + MEMORY-6.9B</small><strong>35.58</strong><p>beats the frozen Pythia-12B score of 35.38 with <b>39% fewer total parameters</b>.</p></div>
            <article><strong>18 / 18</strong><p>Base + Memory configurations outperform their frozen backbone alone.</p></article>
            <article><strong>34–44%</strong><p>fewer parameters at matched scores along the two scaling curves.</p></article>
            <div className="figure-guide"><span><i /> circle area</span> total parameters<br /><span><i /> split fill</span> base / memory fractions</div>
          </aside>
        </div>
      </section>

      <section className="results-section" id="results" aria-labelledby="results-title">
        <div className="section-shell">
          <div className="section-label">06 · MORE RESULTS</div>
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
        <div className="section-label">07 · EXPLORE</div>
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
        <a className="brand footer-brand" href="#overview"><span className="brand-mark">M</span><span>Memory Decoder at Scale</span></a>
        <p>Separating reasoning from knowledge</p>
        <a href="#overview">Back to top ↑</a>
      </footer>
    </main>
  );
}
