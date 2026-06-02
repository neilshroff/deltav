/* global React, ReactDOM, Hero, Cell, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakColor, TweakToggle */
const { useState } = React;

const TREATMENTS = [
  { id: "trace",      label: "Trace",      note: "Blueprint draw-on. Calm, technical — closest to your current renders." },
  { id: "volumetric", label: "Volumetric", note: "Turntable bloom + light sweep across each device. Cinematic." },
  { id: "signal",     label: "Signal",     note: "Telemetry scan + nodes lighting up. Most energetic." }
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "edge": "#cdddfb",
  "accent": "#5b82ff",
  "glow": 7,
  "lineWeight": 1.25,
  "mono": true
}/*EDITMODE-END*/;

function App() {
  const b = window.DELTAV.brand;
  const companies = window.DELTAV.companies;
  const [treat, setTreat] = useState(
    () => localStorage.getItem("dv-treat") || "trace"
  );
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const pick = (id) => { setTreat(id); localStorage.setItem("dv-treat", id); };
  const cur = TREATMENTS.find((x) => x.id === treat) || TREATMENTS[0];

  const rootStyle = {
    "--edge": t.edge,
    "--edge-blue": t.accent,
    "--glow-amt": t.glow,
    "--lw": t.lineWeight + "px"
  };

  return (
    <div className="app" data-treat={treat} data-mono={t.mono ? "1" : "0"} style={rootStyle}>
      <Hero b={b} />

      <section className="portfolio" id="portfolio">
        <div className="port-head">
          <div className="ph-left">
            <span className="meta">PORTFOLIO</span>
            <h2 className="ph-title">Select companies</h2>
          </div>
        </div>

        <div className="grid">
          {companies.map((c, i) => <Cell key={c.n} c={c} i={i} />)}
        </div>
      </section>

      <TweaksPanel>
        <TweakSection label="Motion" />
        <TweakRadio label="Treatment" value={treat}
          options={TREATMENTS.map((x) => ({ label: x.label, value: x.id }))}
          onChange={pick} />
        <TweakSection label="Edge-glow" />
        <TweakColor label="Edge line" value={t.edge}
          options={["#cdddfb", "#e8eefc", "#9fe8ff", "#bfe7d2"]}
          onChange={(v) => setTweak("edge", v)} />
        <TweakColor label="Glow accent" value={t.accent}
          options={["#5b82ff", "#2fe6ff", "#7a5af0", "#3aa0ff"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSlider label="Glow strength" value={t.glow} min={0} max={14} step={1}
          onChange={(v) => setTweak("glow", v)} />
        <TweakSlider label="Line weight" value={t.lineWeight} min={0.75} max={2.5} step={0.25} unit="px"
          onChange={(v) => setTweak("lineWeight", v)} />
        <TweakSection label="Type" />
        <TweakToggle label="Mono meta labels" value={t.mono}
          onChange={(v) => setTweak("mono", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
