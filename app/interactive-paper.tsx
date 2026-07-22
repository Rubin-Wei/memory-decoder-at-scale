"use client";

import { useState } from "react";

const generalResults = [
  { backbone: "Pythia 1.4B", base: 31.03, memory: 32.64, gain: 1.61 },
  { backbone: "Pythia 2.8B", base: 32.15, memory: 33.73, gain: 1.58 },
  { backbone: "Pythia 6.9B", base: 34.44, memory: 35.92, gain: 1.48 },
];

const domainResults = [
  { backbone: "Qwen3 0.6B", base: 15.65, memory: 25.53, gain: 9.88 },
  { backbone: "Qwen3 1.7B", base: 19.84, memory: 29.48, gain: 9.64 },
  { backbone: "Qwen3 4B", base: 23.31, memory: 33.3, gain: 10.0 },
  { backbone: "Qwen3 8B", base: 27.0, memory: 36.09, gain: 9.09 },
  { backbone: "Qwen3 14B", base: 27.9, memory: 37.89, gain: 9.99 },
];

const memories = [
  {
    id: "biology",
    label: "Biology",
    corpus: "BioInst memory",
    score: "21.97",
    gain: "+17.96",
    benchmark: "BioInst",
    note: "The largest domain gain on Qwen3-14B, from a memory specialized on biology instructions.",
  },
  {
    id: "law",
    label: "Law",
    corpus: "DISC-Law memory",
    score: "44.42",
    gain: "+8.97",
    benchmark: "LawBench",
    note: "Exchange only the memory module to move the same frozen backbone into legal evaluation.",
  },
  {
    id: "finance",
    label: "Finance",
    corpus: "FinTrain memory",
    score: "47.29",
    gain: "+3.04",
    benchmark: "FinEval",
    note: "A finance-specialized memory raises the score without modifying the reasoning backbone.",
  },
];

type ResultView = "general" | "domain";

export function ResultsExplorer() {
  const [view, setView] = useState<ResultView>("general");
  const [selected, setSelected] = useState(0);
  const results = view === "general" ? generalResults : domainResults;
  const current = results[Math.min(selected, results.length - 1)];
  const ceiling = 40;

  function chooseView(next: ResultView) {
    setView(next);
    setSelected(0);
  }

  return (
    <div className="results-explorer">
      <div className="explorer-heading">
        <div>
          <span>INTERACTIVE RESULT EXPLORER</span>
          <h3>See what the memory adds.</h3>
        </div>
        <div className="explorer-tabs" role="tablist" aria-label="Result family">
          <button type="button" role="tab" aria-selected={view === "general"} onClick={() => chooseView("general")}>General memory</button>
          <button type="button" role="tab" aria-selected={view === "domain"} onClick={() => chooseView("domain")}>Domain memory</button>
        </div>
      </div>

      <div className="model-picker" aria-label="Choose a frozen backbone">
        {results.map((row, index) => (
          <button
            type="button"
            className={index === selected ? "active" : ""}
            key={row.backbone}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            <span>{row.backbone}</span>
            <strong>+{row.gain.toFixed(2)}</strong>
          </button>
        ))}
      </div>

      <div className="score-visual" key={`${view}-${current.backbone}`}>
        <div className="score-context">
          <span>{view === "general" ? "18-task average" : "3-domain average"}</span>
          <h4>{current.backbone}</h4>
          <p>
            Attach {view === "general" ? "a matched general memory" : "the 1.7B domain memory"} to the frozen backbone.
          </p>
          <div className="gain-pill"><strong>+{current.gain.toFixed(2)}</strong><small>absolute gain</small></div>
        </div>

        <div className="bar-comparison" aria-label={`${current.backbone}: base ${current.base.toFixed(2)}, with memory ${current.memory.toFixed(2)}`}>
          <div className="bar-row base-row">
            <div><span>Frozen base</span><strong>{current.base.toFixed(2)}</strong></div>
            <div className="bar-track"><i style={{ width: `${(current.base / ceiling) * 100}%` }} /></div>
          </div>
          <div className="bar-row memory-row">
            <div><span>Base + memory</span><strong>{current.memory.toFixed(2)}</strong></div>
            <div className="bar-track"><i style={{ width: `${(current.memory / ceiling) * 100}%` }} /></div>
          </div>
          <div className="bar-axis" aria-hidden="true"><span>0</span><span>20</span><span>40</span></div>
        </div>
      </div>

      <p className="explorer-hint">Choose a result family and backbone to compare the scores directly.</p>
    </div>
  );
}

export function MemoryBankExplorer() {
  const [selected, setSelected] = useState(0);
  const memory = memories[selected];

  return (
    <section className="memory-bank section-shell" aria-labelledby="transfer-title">
      <div className="memory-bank-heading">
        <p className="kicker">CLICK TO SWAP THE MEMORY</p>
        <h2 id="transfer-title">One frozen backbone.<br />A bank of domain memories.</h2>
        <p>Keep the Qwen3-14B backbone fixed, then change what it remembers by selecting a specialized 1.7B memory.</p>
      </div>

      <div className="memory-tabs" role="tablist" aria-label="Available domain memories">
        {memories.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={index === selected}
            key={item.id}
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>{item.label}
          </button>
        ))}
      </div>

      <div className="memory-architecture" key={memory.id}>
        <article className="backbone-module">
          <span>FROZEN BACKBONE</span>
          <strong>Qwen3-14B</strong>
          <small>reasoning &amp; language</small>
        </article>
        <div className="module-plus" aria-hidden="true">+</div>
        <article className={`memory-module ${memory.id}`}>
          <span>SWAPPABLE MEMORY</span>
          <strong>{memory.corpus}</strong>
          <small>1.7B parameters</small>
        </article>
        <div className="module-arrow" aria-hidden="true">→</div>
        <article className="memory-outcome">
          <span>{memory.benchmark}</span>
          <strong>{memory.score}</strong>
          <b>{memory.gain}</b>
        </article>
      </div>

      <p className="memory-note">{memory.note}</p>
    </section>
  );
}
