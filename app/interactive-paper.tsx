"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";

const tocItems = [
  { id: "overview", number: "00", label: "Overview" },
  { id: "idea", number: "01", label: "The idea" },
  { id: "swap", number: "02", label: "Memory bank" },
  { id: "architecture", number: "03", label: "Architecture" },
  { id: "construction", number: "04", label: "Data construction" },
  { id: "figure3", number: "05", label: "Figure 3" },
  { id: "results", number: "06", label: "More results" },
  { id: "resources", number: "07", label: "Resources" },
];

export function SectionToc() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const sections = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.1, 0.25] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="page-toc" aria-label="Page contents">
      <strong>CONTENTS</strong>
      <nav>
        {tocItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
            <span>{item.number}</span>{item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

const memories = [
  {
    id: "general",
    label: "General",
    short: "GEN",
    corpus: "Pile general memory",
    size: "6.9B parameters",
    pairing: "Pythia-410M + memory",
    benchmark: "18-task AVG",
    score: "35.58",
    gain: "+7.30",
    color: "#e4edff",
    accent: "#5279b8",
    description: "Pretrained on the deduplicated Pile for broad corpus knowledge.",
  },
  {
    id: "biology",
    label: "Biology",
    short: "BIO",
    corpus: "BioInst memory",
    size: "1.7B parameters",
    pairing: "Qwen3-14B + memory",
    benchmark: "BioInst",
    score: "21.97",
    gain: "+17.96",
    color: "#dff3ec",
    accent: "#3f8d79",
    description: "Specialized on biology instructions and factual relations.",
  },
  {
    id: "law",
    label: "Law",
    short: "LAW",
    corpus: "DISC-Law memory",
    size: "1.7B parameters",
    pairing: "Qwen3-14B + memory",
    benchmark: "LawBench",
    score: "44.42",
    gain: "+8.97",
    color: "#e7efff",
    accent: "#5279b8",
    description: "Swap in legal knowledge while the reasoning backbone stays frozen.",
  },
  {
    id: "finance",
    label: "Finance",
    short: "FIN",
    corpus: "FinTrain memory",
    size: "1.7B parameters",
    pairing: "Qwen3-14B + memory",
    benchmark: "FinEval",
    score: "47.29",
    gain: "+3.04",
    color: "#fff0df",
    accent: "#bf7846",
    description: "A finance-specialized memory for terminology and domain facts.",
  },
];

const generalResults = [
  { model: "Pythia 1.4B", base: 31.03, memory: 32.64, gain: 1.61 },
  { model: "Pythia 2.8B", base: 32.15, memory: 33.73, gain: 1.58 },
  { model: "Pythia 6.9B", base: 34.44, memory: 35.92, gain: 1.48 },
];

const domainResults = [
  { model: "Qwen3 0.6B", base: 15.65, memory: 25.53, gain: 9.88 },
  { model: "Qwen3 1.7B", base: 19.84, memory: 29.48, gain: 9.64 },
  { model: "Qwen3 4B", base: 23.31, memory: 33.3, gain: 10.0 },
  { model: "Qwen3 8B", base: 27.0, memory: 36.09, gain: 9.09 },
  { model: "Qwen3 14B", base: 27.9, memory: 37.89, gain: 9.99 },
];

function nextIndex(index: number, direction: number) {
  return (index + direction + memories.length) % memories.length;
}

export function MemoryWheel() {
  const [selected, setSelected] = useState(0);
  const [rotation, setRotation] = useState(0);
  const memory = memories[selected];

  function chooseMemory(index: number) {
    if (index === selected) return;
    let delta = index - selected;
    if (delta > memories.length / 2) delta -= memories.length;
    if (delta < -memories.length / 2) delta += memories.length;
    setRotation((current) => current - delta * 90);
    setSelected(index);
  }

  function rotate(direction: number) {
    chooseMemory(nextIndex(selected, direction));
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      rotate(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      rotate(1);
    }
  }

  return (
    <section className="swap-section" id="swap" aria-labelledby="swap-title">
      <div className="section-shell">
        <div className="section-label">02 · SWAP MEMORY</div>
        <div className="section-heading swap-heading">
          <h2 id="swap-title">One base model.<br /><em>A wheel of memories.</em></h2>
          <p>Rotate the wheel to change the knowledge module. The frozen Qwen3-14B backbone remains untouched.</p>
        </div>

        <div
          className="memory-stage"
          tabIndex={0}
          onKeyDown={handleKey}
          aria-label="Interactive memory wheel. Use left and right arrow keys to change memory."
        >
          <article className="fixed-base">
            <span>FIXED</span>
            <small>BASE MODEL</small>
            <strong>Frozen backbone</strong>
            <p>language modeling<br />&amp; reasoning</p>
            <em className="base-families">Pythia · Qwen3</em>
            <div><i /> frozen parameters</div>
          </article>

          <div className="stage-connector" aria-hidden="true">
            <span>parallel</span><i /><b>+</b>
          </div>

          <div className="wheel-panel">
            <div className="wheel-pointer" aria-hidden="true">SELECTED</div>
            <div className="memory-wheel">
              <div className="wheel-track" style={{ transform: `rotate(${rotation}deg)` }}>
                {memories.map((item, index) => {
                  const nodeAngle = 180 + index * 90;
                  const nodeStyle = {
                    "--node-color": item.color,
                    "--node-accent": item.accent,
                    "--node-angle": `${nodeAngle}deg`,
                    "--node-counter-angle": `${-nodeAngle}deg`,
                  } as CSSProperties;
                  const labelStyle = { transform: `rotate(${-rotation}deg)` };

                  return (
                    <button
                      type="button"
                      className={`wheel-node ${index === selected ? "selected" : ""}`}
                      style={nodeStyle}
                      key={item.id}
                      aria-pressed={index === selected}
                      onClick={() => chooseMemory(index)}
                    >
                      <span className="wheel-node-label" style={labelStyle}>
                        <small>{item.short}</small>
                        <strong>{item.label}</strong>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="wheel-center" style={{ "--active-accent": memory.accent } as CSSProperties}>
                <small>ACTIVE MEMORY</small>
                <strong>{memory.label}</strong>
                <span>{memory.size}</span>
              </div>
            </div>

            <div className="wheel-controls">
              <button type="button" onClick={() => rotate(-1)} aria-label="Previous memory">←</button>
              <span>{selected + 1} / {memories.length}</span>
              <button type="button" onClick={() => rotate(1)} aria-label="Next memory">→</button>
            </div>
          </div>
        </div>

        <div className="memory-readout" key={memory.id} style={{ "--active-accent": memory.accent } as CSSProperties}>
          <div><small>ATTACHED KNOWLEDGE MODULE</small><strong>{memory.corpus}</strong><span>{memory.description}</span></div>
          <i aria-hidden="true">→</i>
          <div className="readout-score"><small>{memory.pairing}</small><span>{memory.benchmark}</span><strong>{memory.score}</strong><b>{memory.gain}</b></div>
        </div>
        <p className="interaction-hint">Click a memory, use the arrows, or press ← / → on the wheel.</p>
      </div>
    </section>
  );
}

type ResultView = "general" | "domain";

export function ResultsExplorer() {
  const [view, setView] = useState<ResultView>("general");
  const rows = view === "general" ? generalResults : domainResults;
  const ceiling = 40;

  return (
    <div className="results-explorer">
      <div className="result-tabs" role="tablist" aria-label="Result family">
        <button type="button" role="tab" aria-selected={view === "general"} onClick={() => setView("general")}>General memory</button>
        <button type="button" role="tab" aria-selected={view === "domain"} onClick={() => setView("domain")}>Domain memory</button>
      </div>

      <div className="chart-key" aria-hidden="true"><span><i /> Frozen base</span><span><i /> Base + memory</span></div>
      <div className="result-chart" key={view}>
        {rows.map((row) => (
          <article className="chart-row" key={row.model} aria-label={`${row.model}, frozen base ${row.base.toFixed(2)}, base plus memory ${row.memory.toFixed(2)}`}>
            <div className="chart-model"><strong>{row.model}</strong><span>+{row.gain.toFixed(2)}</span></div>
            <div className="bar-stack">
              <div className="result-bar base-bar" style={{ width: `${(row.base / ceiling) * 100}%` }}><span>{row.base.toFixed(2)}</span></div>
              <div className="result-bar memory-bar" style={{ width: `${(row.memory / ceiling) * 100}%` }}><span>{row.memory.toFixed(2)}</span></div>
            </div>
          </article>
        ))}
      </div>
      <div className="chart-axis" aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span></div>
      <p className="chart-note">{view === "general" ? "Average across 18 general benchmarks with matched-size memory." : "Average across biology, law, and finance with a 1.7B domain memory."}</p>
    </div>
  );
}
