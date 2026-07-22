import { MemoryBankExplorer, ResultsExplorer } from "./interactive-paper";

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
    <main>
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Memory Decoder at Scale, home">
          <span className="wordmark-mark" aria-hidden="true">M</span>
          <span>MEMORY DECODER</span>
        </a>
        <div className="nav-links">
          <a href="#method">Method</a>
          <a href="#results">Results</a>
          <a href="#analysis">Analysis</a>
          <a className="nav-paper" href={asset("/paper.pdf")}>Paper <Arrow /></a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="memory-orbit orbit-one" aria-hidden="true"><i /><i /><i /></div>
        <div className="memory-orbit orbit-two" aria-hidden="true"><i /><i /></div>

        <div className="hero-copy">
          <p className="eyebrow"><span /> PARAMETRIC LONG-TERM MEMORY PRETRAINING</p>
          <h1>Memory Decoder<br /><em>at Scale</em></h1>
          <p className="hero-deck">
            Pretrain memory independently. Attach it to frozen language models.
            Scale knowledge without scaling the reasoning backbone.
          </p>

          <div className="authors" aria-label="Authors">
            {authors.map((author, index) => (
              <span key={author}>{author}{index === authors.length - 1 ? "‡" : ""}</span>
            ))}
          </div>
          <p className="affiliations">
            LUMIA Lab, Shanghai Jiao Tong University · Shanghai AI Laboratory · Tsinghua University
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href={asset("/paper.pdf")}>Read the paper <Arrow /></a>
            <a className="button button-secondary" href="https://github.com/LUMIA-Group/MemoryPretrain">View code <Arrow /></a>
            <a className="text-link" href="https://huggingface.co/collections/Rubin-Wei/memorypretrain">Models on Hugging Face <Arrow /></a>
          </div>
        </div>

        <aside className="hero-thesis" aria-label="Paper thesis">
          <p className="thesis-number">01 / THESIS</p>
          <p>
            Long-term knowledge and general computation do not have to live in the same parameters.
          </p>
          <div className="mini-architecture" aria-hidden="true">
            <div><span>Frozen base</span><b>Reason</b></div>
            <i>+</i>
            <div className="memory-chip"><span>Swappable</span><b>Remember</b></div>
          </div>
        </aside>

        <div className="hero-stats" aria-label="Study scale">
          <div><strong>207B</strong><span>corpus tokens</span></div>
          <div><strong>300B</strong><span>training tokens</span></div>
          <div><strong>6.9B</strong><span>memory parameters</span></div>
          <div><strong>18</strong><span>benchmarks</span></div>
        </div>
      </header>

      <section className="paper-summary section-shell" aria-labelledby="summary-title">
        <div className="section-index">00</div>
        <div className="summary-lead">
          <p className="kicker">THE IDEA</p>
          <h2 id="summary-title">A standalone model component for long-term knowledge.</h2>
        </div>
        <div className="summary-copy">
          <p>
            Today&apos;s language models use one parameter set both to retain knowledge and to support language modeling and reasoning. That coupling makes the two capabilities impossible to scale independently.
          </p>
          <p>
            We train a memory decoder to approximate the output distribution of a <i>k</i>NN retriever while retaining a next-token objective. At inference, the frozen base model and memory run in parallel; their predictions are interpolated with no datastore access.
          </p>
        </div>
      </section>

      <section className="overview-panel section-shell" aria-labelledby="overview-title">
        <div className="panel-heading">
          <div>
            <p className="kicker">ONE CONTEXT · TWO SPECIALISTS</p>
            <h2 id="overview-title">Decouple reasoning from remembering.</h2>
          </div>
          <p>Train separately. Run in parallel. Swap memory without changing the backbone.</p>
        </div>
        <figure className="paper-figure overview-figure">
          <img src={asset("/paper/overview.png")} alt="Overview comparing conventional language model pretraining, memory pretraining with a retriever teacher, and parallel inference through distribution interpolation." />
          <figcaption>
            The base model learns general computation through next-token prediction. The memory learns retrieval-shaped knowledge, then joins the frozen base only at the output distribution.
          </figcaption>
        </figure>
      </section>

      <section className="method section-shell" id="method" aria-labelledby="method-title">
        <div className="section-index">01</div>
        <div className="section-heading">
          <p className="kicker">METHOD</p>
          <h2 id="method-title">Retriever behavior,<br />made parametric.</h2>
          <p className="section-intro">
            The training pipeline turns sparse nearest-neighbor evidence into a reusable decoder memory.
          </p>
        </div>

        <div className="method-steps" aria-label="Expandable method steps">
          <details open>
            <summary><span>1</span><h3>Construct targets</h3><i aria-hidden="true">+</i></summary>
            <p>Retrieve nearest context states and aggregate their next tokens into a sparse target distribution. This turns non-parametric evidence into corpus-scale supervision.</p>
          </details>
          <details>
            <summary><span>2</span><h3>Pretrain memory</h3><i aria-hidden="true">+</i></summary>
            <p>Align the decoder with the retrieval distribution while preserving next-token likelihood, so factual storage does not erase its language-model interface.</p>
          </details>
          <details>
            <summary><span>3</span><h3>Attach at inference</h3><i aria-hidden="true">+</i></summary>
            <p>Run the frozen base and memory in parallel, then interpolate their predictions. The training datastore is no longer needed and memories can be exchanged independently.</p>
          </details>
        </div>

        <div className="equation-card" aria-label="Inference interpolation equation">
          <span>INFERENCE</span>
          <p><i>p</i><sub>final</sub> = (1 − α) <i>p</i><sub>base</sub> + α <i>p</i><sub>memory</sub></p>
          <small>two independent forward passes · one final distribution</small>
        </div>
      </section>

      <section className="construction section-shell" aria-labelledby="construction-title">
        <div className="construction-copy">
          <p className="kicker">PRETRAINING-SCALE CONSTRUCTION</p>
          <h2 id="construction-title">Make corpus-scale supervision tractable.</h2>
          <p>
            A 207B-token corpus creates an indexing and search bottleneck. We compress 4096-dimensional hidden states to 256 dimensions, route through HNSW centroids, and search centroid-range shards independently on GPUs.
          </p>
          <dl>
            <div><dt>4096 → 256</dt><dd>OPQ compression</dd></div>
            <div><dt>Two levels</dt><dd>centroid-to-shard routing</dd></div>
            <div><dt>Distributed</dt><dd>GPU shard search</dd></div>
          </dl>
        </div>
        <figure className="paper-figure construction-figure">
          <img src={asset("/paper/construction.png")} alt="Three-stage pretraining-scale construction pipeline with OPQ compression, two-level HNSW centroid routing, and independently searched centroid-range shards." />
          <figcaption>Compression, routing, and sharding convert one oversized search problem into parallel query batches.</figcaption>
        </figure>
      </section>

      <section className="results section-shell" id="results" aria-labelledby="results-title">
        <div className="section-index">02</div>
        <div className="section-heading results-heading">
          <p className="kicker">RESULTS</p>
          <h2 id="results-title">More knowledge.<br /><em>Fewer total parameters.</em></h2>
        </div>

        <div className="headline-result">
          <div className="result-score">
            <span>Pythia-410M + Memory-6.9B</span>
            <strong>35.58</strong>
            <small>average score across 18 tasks</small>
          </div>
          <div className="versus" aria-hidden="true">beats</div>
          <div className="result-score muted-score">
            <span>Frozen Pythia-12B</span>
            <strong>35.38</strong>
            <small>with a monolithic backbone</small>
          </div>
          <div className="savings-badge">
            <strong>39%</strong>
            <span>fewer total<br />parameters</span>
          </div>
        </div>

        <figure className="paper-figure transfer-figure">
          <img src={asset("/paper/transfer.png")} alt="Scatter plot showing base plus memory configurations above the frozen-base scaling trend, with parameter savings at matched scores." />
          <figcaption>
            General memories transfer across backbone scales. Larger memories are especially effective when paired with compact frozen backbones.
          </figcaption>
        </figure>

        <ResultsExplorer />

        <div className="result-notes">
          <article><strong>51 / 54</strong><p>task–scale combinations improve with general memory; two more match the base.</p></article>
          <article><strong>15 / 15</strong><p>Qwen3 domain evaluations improve across five backbone sizes and three domains.</p></article>
          <article><strong>20%</strong><p>of the standard memory budget transfers Qwen memories to OLMo vocabularies.</p></article>
        </div>
      </section>

      <section className="analysis section-shell" id="analysis" aria-labelledby="analysis-title">
        <div className="section-index">03</div>
        <div className="section-heading">
          <p className="kicker">ANALYSIS</p>
          <h2 id="analysis-title">Memory stays useful<br />when the setting changes.</h2>
        </div>

        <div className="analysis-grid">
          <article className="analysis-card analysis-wide">
            <div className="analysis-card-copy">
              <span>FEW-SHOT ROBUSTNESS</span>
              <h3>Complementary to in-context examples.</h3>
              <p>Memory improves the same 14-task average in zero-, three-, and five-shot settings at every tested model scale.</p>
            </div>
            <img src={asset("/paper/fewshot.png")} alt="Bar charts showing memory gains in zero-shot, three-shot, five-shot, and three knowledge-intensive QA settings." />
          </article>

          <article className="analysis-card">
            <div className="analysis-card-copy">
              <span>CAPACITY</span>
              <h3>Larger memory, larger gains.</h3>
              <p>With each backbone fixed, increasing memory capacity generally improves both broad and domain performance.</p>
            </div>
            <img src={asset("/paper/memory-size.png")} alt="Plots showing performance gains as general and domain memory sizes increase." />
          </article>

          <article className="analysis-card case-card">
            <div className="analysis-card-copy">
              <span>TRACEABILITY</span>
              <h3>Stronger factual evidence.</h3>
              <p>The memory assigns larger probability share to many entities and attributes in a supporting HotpotQA passage.</p>
            </div>
            <img src={asset("/paper/case-study.png")} alt="HotpotQA case study with words colored by the probability share assigned by the memory model." />
          </article>
        </div>
      </section>

      <MemoryBankExplorer />

      <section className="resources section-shell" aria-labelledby="resources-title">
        <div className="section-index">04</div>
        <div className="section-heading">
          <p className="kicker">EXPLORE</p>
          <h2 id="resources-title">Paper, code,<br />and models.</h2>
        </div>
        <div className="resource-links">
          <a href={asset("/paper.pdf")}><span>01</span><div><small>50-PAGE MANUSCRIPT</small><strong>Read the paper</strong></div><Arrow /></a>
          <a href="https://github.com/LUMIA-Group/MemoryPretrain"><span>02</span><div><small>IMPLEMENTATION</small><strong>Browse the code</strong></div><Arrow /></a>
          <a href="https://huggingface.co/collections/Rubin-Wei/memorypretrain"><span>03</span><div><small>CHECKPOINT COLLECTION</small><strong>Use the memories</strong></div><Arrow /></a>
        </div>
      </section>

      <footer>
        <div className="footer-title">
          <img src={asset("/lumia.png")} alt="LUMIA Lab" />
          <div><strong>Memory Decoder at Scale</strong><span>A Pretrained, Parametric Long-Term Memory</span></div>
        </div>
        <p>‡ Corresponding author · weirubinn@gmail.com · lin.zhouhan@gmail.com</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
