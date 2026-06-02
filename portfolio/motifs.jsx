/* global React */
// Delta V — abstract device motifs. Each broadly evokes a company's product,
// drawn in one shared edge-glow language (thin luminous strokes on near-black).
// Built from geometric primitives only — meant as a placeholder/abstraction for
// the company's real device film or render.
const { useMemo } = React;

// ---- small helpers -------------------------------------------------------
const R = (cx, cy, r, n, start = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = start + (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

function Glow({ children }) {
  return (
    <svg className="motif-svg" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="mg-bloom" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="var(--edge-blue)" stopOpacity="0.28" />
          <stop offset="60%" stopColor="var(--edge-blue)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--edge-blue)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mg-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect className="motif-bloom" x="0" y="0" width="260" height="200" fill="url(#mg-bloom)" />
      {children}
    </svg>
  );
}

// ---- the motifs ----------------------------------------------------------
function KuboMotif() {
  // Kubocare — ambient care sensor mounted in a room corner, sensing a person:
  // signal waves radiate to a human figure; vitals (heartbeat) pulse; sense loop.
  const ox = 56, oy = 74; // signal origin (sensor mouth)
  const waveD = "M71.7 75.6 A16 16 0 0 1 53.2 89.8"; // ~90° arc facing into room
  return (
    <g className="motif-ink" fill="none">
      {/* corner-mounted sensor (implied corner, no walls drawn) */}
      <rect x="40" y="40" width="28" height="36" rx="6" className="face ln" />
      <rect x="46" y="46" width="16" height="22" rx="3" className="ln faint" />
      <circle cx="54" cy="72" r="2" className="dot hot sensor-led" />
      {/* sensing waves */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={waveD} className="kwave" vectorEffect="non-scaling-stroke"
          style={{ "--i": i, transformOrigin: `${ox}px ${oy}px` }} />
      ))}
      {/* elderly person — hunched forward, facing RIGHT, leaning on a walking stick */}
      <g className="figure">
        <circle cx="198" cy="100" r="6" className="ln" />{/* head, forward-right */}
        <path d="M194 105 Q184 116 178 130" className="ln" />{/* hunched back */}
        <path d="M178 130 L174 142 L175 154" className="ln" />{/* rear leg */}
        <path d="M178 130 L186 141 L187 154" className="ln" />{/* front leg */}
        <line x1="189" y1="112" x2="203" y2="130" className="ln" />{/* arm to cane */}
        <line x1="206" y1="126" x2="209" y2="154" className="ln" />{/* walking stick */}
        <line x1="200" y1="126" x2="208" y2="126" className="ln faint" />{/* cane handle */}
        <circle cx="186" cy="116" r="8" className="vital" />
        <circle cx="186" cy="116" r="2.3" className="dot hot heart" />
      </g>
    </g>
  );
}

function LatticeMotif() {
  // Neocambrian — DexUMI dexterous robotic hand doing pick-and-place: grips a
  // cube at the left pad, lifts and carries it to the right pad, sets it down.
  const handRef = React.useRef(null);
  const fRefs = React.useRef([]);
  const thumbRef = React.useRef(null);
  const sqRef = React.useRef(null);
  const knuckles = [104, 111, 118, 125];
  React.useEffect(() => {
    const lerp = (a, b, k) => a + (b - a) * k;
    const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    const KX = [[0, 0], [0.12, 0], [0.20, 0], [0.34, 0], [0.50, 90], [0.58, 90], [0.72, 90], [0.92, 0], [1, 0]];
    const KY = [[0, -16], [0.12, -16], [0.20, 0], [0.28, 0], [0.34, -16], [0.50, -16], [0.58, 0], [0.66, 0], [0.72, -16], [0.92, -16], [1, -16]];
    const KG = [[0, 0], [0.20, 0], [0.28, 1], [0.58, 1], [0.66, 0], [1, 0]];
    const samp = (tbl, t) => {
      for (let i = 0; i < tbl.length - 1; i++) {
        const a = tbl[i], b = tbl[i + 1];
        if (t >= a[0] && t <= b[0]) return lerp(a[1], b[1], ease((t - a[0]) / ((b[0] - a[0]) || 1)));
      }
      return tbl[tbl.length - 1][1];
    };
    const frame = (t) => {
      const dx = samp(KX, t), dy = samp(KY, t), g = samp(KG, t);
      if (handRef.current) handRef.current.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
      const fang = g * 22;
      fRefs.current.forEach((el, i) => {
        if (!el) return;
        const kx = knuckles[i], sign = kx < 114.5 ? 1 : -1;
        el.setAttribute("transform", `rotate(${(sign * fang).toFixed(2)} ${kx} 86)`);
      });
      if (thumbRef.current) thumbRef.current.setAttribute("transform", `rotate(${(g * 30).toFixed(2)} 97 82)`);
      let sx = 0, sy = 0;
      if (t >= 0.22 && t < 0.59) { sx = dx; sy = dy; } else if (t >= 0.59) { sx = 90; sy = 0; }
      if (sqRef.current) {
        sqRef.current.setAttribute("transform", `translate(${sx.toFixed(2)} ${sy.toFixed(2)})`);
        sqRef.current.style.opacity = t < 0.05 ? t / 0.05 : t > 0.93 ? Math.max(0, 1 - (t - 0.93) / 0.07) : 1;
      }
    };
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { frame(0.3); return; }
    let raf, last = performance.now(), vt = 0;
    const PERIOD = 6.5;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const treat = (document.querySelector(".app") || {}).dataset?.treat;
      vt += dt * (treat === "signal" ? 1.5 : treat === "trace" ? 0.7 : 1);
      frame((vt / PERIOD) % 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <g className="motif-ink" fill="none" transform="translate(-12 16)">
      {/* work surface + two pads */}
      <line x1="92" y1="134" x2="228" y2="134" className="ln faint" />
      <line x1="103" y1="134" x2="123" y2="134" className="ln" />
      <line x1="193" y1="134" x2="213" y2="134" className="ln" />
      {/* the cube being moved */}
      <g ref={sqRef}>
        <rect x="106" y="117" width="16" height="16" rx="2" className="cube" />
      </g>
      {/* DexUMI hand */}
      <g ref={handRef}>
        <line x1="114" y1="18" x2="114" y2="40" className="ln" />{/* forearm */}
        <rect x="97" y="40" width="36" height="26" rx="7" className="face ln" />{/* wrist module */}
        <circle cx="125" cy="53" r="3" className="dot hot sensor-led" />
        <rect x="100" y="64" width="30" height="22" rx="6" className="face ln" />{/* palm */}
        <g ref={thumbRef}>
          <rect x="92" y="78" width="5.5" height="17" rx="2.7" className="face ln" />
        </g>
        {knuckles.map((kx, i) => (
          <g key={i} ref={(el) => (fRefs.current[i] = el)}>
            <rect x={kx - 2.7} y="86" width="5.4" height="15" rx="2.7" className="face ln" />
            <rect x={kx - 2.4} y="100" width="4.8" height="11" rx="2.4" className="face ln" />
            <circle cx={kx} cy="86" r="1.7" className="dot" />
          </g>
        ))}
      </g>
    </g>
  );
}

function BlinqMotif() {
  // Blinq — boxy swappable-battery EV. Old pack drops down + exits left while a
  // fresh pack slides in from the right and lifts up into the slot. Repeat.
  const wheel = (cx) => (
    <g>
      <circle cx={cx} cy="143" r="17" className="ln" />
      <circle cx={cx} cy="143" r="6.5" className="ln faint" />
      <circle cx={cx} cy="143" r="2" className="dot" />
    </g>
  );
  const bars = [0, 1, 2, 3];
  const pack = (cls) => (
    <g className={cls}>
      <rect x="102" y="130" width="58" height="15" rx="3" className="bat" />
      {bars.map((b) => (
        <rect key={b} x={107 + b * 12} y="133" width="7" height="9" rx="1.5" className="bat-bar" style={{ "--i": b }} />
      ))}
      <line x1="131" y1="130" x2="131" y2="145" className="ln faint" />
    </g>
  );
  return (
    <g className="motif-ink" fill="none">
      <line x1="16" y1="160" x2="248" y2="160" className="ln faint" />
      {/* Blinq body — tall stubby microcar: short low nose, huge domed glasshouse */}
      <path className="face ln" d="M44 132 L44 119 Q44 110 53 107 L196 107 Q210 108 212 119 L212 132 Z" />
      {/* huge domed dark greenhouse, cab-forward long raked windshield */}
      <path className="cabin ln" d="M62 106 L88 57 Q108 45 140 44 Q176 45 195 62 L198 106 Z" />
      <line x1="58" y1="107" x2="206" y2="107" className="ln faint" />{/* belt line */}
      <path className="ln faint" d="M168 47 L171 106" />{/* B-pillar */}
      <path className="ln faint" d="M50 125 Q130 130 206 125" />{/* dark rocker cladding */}
      <line x1="150" y1="98" x2="150" y2="106" className="ln faint" />{/* door handle */}
      {/* wheel arches */}
      <path className="ln faint" d="M62 132 A18 18 0 0 1 98 132" />
      <path className="ln faint" d="M166 132 A18 18 0 0 1 202 132" />
      {/* signature hex light bar (front) */}
      <rect x="40" y="110" width="9" height="17" rx="3.5" className="ln" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={44.5} cy={113.5 + i * 3} r="1.2" className="dot hex" style={{ "--i": i }} />)}
      {/* battery slot */}
      <line x1="102" y1="130" x2="160" y2="130" className="ln faint" />
      <path className="charge-sweep" d="M53 107 L88 57 Q108 45 140 44 Q176 45 195 62 L198 106" />
      {pack("bat-out")}
      {pack("bat-in")}
      {wheel(80)}{wheel(184)}
    </g>
  );
}

function ArmatrixMotif() {
  // Armatrix — continuum "snake" robot arm, real-time driven: emerges from the
  // base canister, head looks around (sinuous), then threads into the access hole.
  const N = 16;
  const B = [74, 120];
  const segRefs = React.useRef([]);
  const headRef = React.useRef(null);
  // head trajectory: t 0→1 = emerge, look around, aim, then threaded fully in.
  // The loop ping-pongs this so it reverses OUT along the exact same path.
  const WP = [
    [0.00, 74, 120], [0.16, 76, 58], [0.30, 104, 46], [0.44, 138, 56],
    [0.57, 112, 44], [0.67, 152, 50], [0.85, 179, 104], [1.00, 181, 128]
  ];
  React.useEffect(() => {
    const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    const headPos = (t) => {
      for (let i = 0; i < WP.length - 1; i++) {
        const a = WP[i], b = WP[i + 1];
        if (t >= a[0] && t <= b[0]) {
          const k = ease((t - a[0]) / (b[0] - a[0]));
          return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
        }
      }
      return [WP[WP.length - 1][1], WP[WP.length - 1][2]];
    };
    const draw = (t, vt) => {
      const H = headPos(t);
      const C = [(B[0] + H[0]) / 2, Math.max(38, Math.min(B[1], H[1]) - 40)];
      // calm the wiggle while aiming/threading in
      const amp = 7.5 * (t < 0.58 ? 1 : Math.max(0.12, 1 - (t - 0.58) / 0.22));
      const phase = vt * 3.4;
      const pts = [];
      for (let i = 0; i < N; i++) {
        const s = i / (N - 1), mt = 1 - s;
        const bx = mt * mt * B[0] + 2 * mt * s * C[0] + s * s * H[0];
        const by = mt * mt * B[1] + 2 * mt * s * C[1] + s * s * H[1];
        const tx = 2 * mt * (C[0] - B[0]) + 2 * s * (H[0] - C[0]);
        const ty = 2 * mt * (C[1] - B[1]) + 2 * s * (H[1] - C[1]);
        const tl = Math.hypot(tx, ty) || 1;
        const off = amp * Math.sin(s * 7.5 - phase) * Math.sin(Math.PI * s);
        pts.push([bx - (ty / tl) * off, by + (tx / tl) * off]);
      }
      for (let i = 0; i < N; i++) {
        const g = segRefs.current[i]; if (!g) continue;
        const p = pts[i], q = pts[Math.min(N - 1, i + 1)];
        const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
        g.setAttribute("transform", `translate(${p[0].toFixed(2)} ${p[1].toFixed(2)}) rotate(${ang.toFixed(1)})`);
      }
      if (headRef.current) {
        const p = pts[N - 1], q = pts[N - 2];
        const ang = Math.atan2(p[1] - q[1], p[0] - q[0]) * 180 / Math.PI;
        headRef.current.setAttribute("transform", `translate(${p[0].toFixed(2)} ${p[1].toFixed(2)}) rotate(${ang.toFixed(1)})`);
      }
    };
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { draw(0.5, 0); return; }
    let raf, last = performance.now(), vt = 0;
    const PERIOD = 9;
    // ping-pong with brief dwells at the deepest point and back home
    const shape = (p) => {
      if (p < 0.44) return ease(p / 0.44);          // going in
      if (p < 0.50) return 1;                        // dwell inside
      if (p < 0.94) return ease(1 - (p - 0.50) / 0.44); // reverse out, same path
      return 0;                                      // dwell home
    };
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const treat = (document.querySelector(".app") || {}).dataset?.treat;
      const sf = treat === "signal" ? 1.5 : treat === "trace" ? 0.7 : 1;
      vt += dt * sf;
      const p = (vt / PERIOD) % 1;
      draw(shape(p), vt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <g className="motif-ink" fill="none">
      <line x1="20" y1="158" x2="244" y2="158" className="ln faint" />
      {/* base canister */}
      <ellipse cx="74" cy="120" rx="19" ry="6" className="ln" />
      <line x1="55" y1="120" x2="55" y2="148" className="ln" />
      <line x1="93" y1="120" x2="93" y2="148" className="ln" />
      <path d="M55 148 A 19 6 0 0 0 93 148" className="ln faint" />
      {/* machine box + access hole */}
      <polygon className="face ln" points="150,104 196,94 234,106 188,116" />
      <polygon className="face ln" points="150,104 188,116 188,158 150,148" />
      <polygon className="face ln" points="188,116 234,106 234,148 188,158" />
      <ellipse cx="179" cy="104" rx="9" ry="3.4" className="ln hot access" />
      {/* the continuum arm (driven each frame) */}
      <g className="arm">
        {Array.from({ length: N }).map((_, i) => (
          <g key={i} ref={(el) => (segRefs.current[i] = el)} transform="translate(74 120)">
            <rect x="-4.5" y="-3.2" width="9" height="6.4" rx="2.2" className="vertebra" />
          </g>
        ))}
        <g ref={headRef} transform="translate(74 120)">
          <polygon points="-3,-4 6,0 -3,4" className="tool" />
          <circle cx="7" cy="0" r="2.4" className="dot hot tool-spark" />
        </g>
      </g>
    </g>
  );
}

function MatrixMotif() {
  // robotics matrix — grid of actuators, a focus cell sweeps across
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push([78 + c * 32, 60 + r * 32, r * 4 + c]);
  return (
    <g className="motif-ink" fill="none">
      {cells.map(([x, y, i]) => (
        <rect key={i} x={x} y={y} width="22" height="22" rx="3"
              className="cellbox scan-cell" style={{ "--i": i }} />
      ))}
      <line x1="64" y1="44" x2="64" y2="156" className="ln faint" />
      <line x1="64" y1="156" x2="196" y2="156" className="ln faint" />
    </g>
  );
}

function PlutoMotif() {
  // Pluto — covered electric delivery scooter: arched weather canopy, faceted
  // body, big rear cargo box, twin headlights, leaning trike wheels. Drives left.
  const wheel = (cx, cy, dir) => {
    const sp = R(cx, cy, 15, 6);
    return (
      <g className="wheel-spin" style={{ transformOrigin: `${cx}px ${cy}px`, animationDirection: dir }}>
        <circle cx={cx} cy={cy} r="20" className="ln" />
        <circle cx={cx} cy={cy} r="6" className="ln faint" />
        {sp.map(([x, y], i) => <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="ln faint" />)}
      </g>
    );
  };
  return (
    <g className="motif-ink" fill="none">
      <line x1="22" y1="158" x2="244" y2="158" className="ln faint" />
      {/* motion trail behind */}
      <line x1="220" y1="150" x2="250" y2="150" className="veh-streak" style={{ "--i": 0 }} />
      <line x1="222" y1="92" x2="252" y2="92" className="veh-streak" style={{ "--i": 1 }} />
      <line x1="224" y1="120" x2="250" y2="120" className="veh-streak" style={{ "--i": 2 }} />

      <g className="drive">
        {/* lower body / fairing / floor / seat */}
        <polygon className="face ln" points="54,140 62,114 82,104 98,108 104,120 138,120 146,102 182,102 192,120 206,122 206,140" />
        {/* front pillar + roof canopy */}
        <path className="ln" d="M82 104 L96 52 L86 46 L114 44 L150 43" />
        {/* windshield glass */}
        <polygon className="glass" points="84,104 96,54 132,52 120,104" />
        {/* rear cargo box (the 6x volume signature) */}
        <polygon className="face ln" points="150,57 162,43 212,50 216,118 150,118" />
        <line x1="150" y1="43" x2="150" y2="118" className="ln" />
        {/* cargo smart-delivery pulse */}
        <rect className="cargo-pulse" x="160" y="62" width="46" height="48" rx="3" />
        {/* twin headlights */}
        <circle cx="58" cy="120" r="3" className="dot hot" />
        <circle cx="64" cy="124" r="3" className="dot hot" />
        {wheel(80, 138, "reverse")}
        {wheel(188, 138, "reverse")}
      </g>
    </g>
  );
}

function FlowMotif() {
  // payments — network of nodes with pulses travelling the edges
  const nodes = [[70, 100], [130, 56], [130, 144], [190, 80], [190, 130], [150, 100]];
  const edges = [[0, 1], [0, 2], [1, 5], [2, 5], [5, 3], [5, 4]];
  return (
    <g className="motif-ink" fill="none">
      {edges.map(([a, b], i) => (
        <g key={i}>
          <line x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} className="ln faint" />
          <circle r="3" className="dot hot pulse-move" style={{ "--i": i,
            offsetPath: `path('M ${nodes[a][0]} ${nodes[a][1]} L ${nodes[b][0]} ${nodes[b][1]}')` }} />
        </g>
      ))}
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 5 ? 7 : 5} className="dot node" style={{ "--i": i }} />)}
    </g>
  );
}

function GyroMotif() {
  // inertial nav — gimballed rings + radar sweep
  return (
    <g className="motif-ink" fill="none">
      <g className="spin-slow" style={{ transformOrigin: "130px 100px" }}>
        <ellipse cx="130" cy="100" rx="56" ry="56" className="ln" />
      </g>
      <g className="spin" style={{ transformOrigin: "130px 100px" }}>
        <ellipse cx="130" cy="100" rx="56" ry="22" className="ln" />
      </g>
      <g className="spin-rev" style={{ transformOrigin: "130px 100px" }}>
        <ellipse cx="130" cy="100" rx="22" ry="56" className="ln" />
      </g>
      <g className="sweep-rot" style={{ transformOrigin: "130px 100px" }}>
        <line x1="130" y1="100" x2="130" y2="44" className="ln hot" />
      </g>
      <circle cx="130" cy="100" r="4" className="dot hot" />
    </g>
  );
}

function GantryMotif() {
  // Lagann teleoperation — robot HERO on the LEFT, VR operator (faint) at the
  // RIGHT-back. Both face left and perform the exact same arm motion in sync.
  return (
    <g className="motif-ink" fill="none">
      {/* modular robot HERO — bright, left, faces left */}
      <g className="robot">
        <polygon points="98,150 134,150 128,132 104,132" className="face ln" />{/* base */}
        <rect x="102" y="108" width="24" height="24" rx="4" className="face ln" />{/* torso mod */}
        <rect x="105" y="90" width="18" height="18" rx="3" className="face ln" />{/* torso mod */}
        <rect x="107" y="73" width="15" height="15" rx="3" className="face ln" />{/* head */}
        <circle cx="114.5" cy="80.5" r="2.2" className="dot hot sensor-led" />{/* camera (faces left) */}
        <g className="ra-shoulder" style={{ transformOrigin: "101px 100px" }}>
          <rect x="73" y="95.5" width="28" height="9" rx="4.5" className="face ln" />{/* upper arm */}
          <circle cx="101" cy="100" r="3.5" className="dot" />
          <g className="ra-elbow" style={{ transformOrigin: "73px 100px" }}>
            <rect x="49" y="96" width="24" height="8" rx="4" className="face ln" />{/* forearm */}
            <circle cx="73" cy="100" r="3" className="dot" />
            <line x1="49" y1="96" x2="44" y2="92" className="ln" />{/* gripper */}
            <line x1="49" y1="104" x2="44" y2="108" className="ln" />
          </g>
        </g>
      </g>

      {/* VR operator — faint, seated at right-back, faces left, same motion */}
      <g className="operator">
        <circle cx="190" cy="62" r="6" className="ln ghost" />
        <rect x="181" y="59" width="12" height="6" rx="2" className="ln ghost" />{/* VR visor */}
        <line x1="190" y1="68" x2="190" y2="92" className="ln ghost" />
        <path d="M190 92 L206 92 L206 110" className="ln ghost" />{/* seated */}
        <line x1="182" y1="112" x2="210" y2="112" className="ln ghost" />{/* chair */}
        <g className="ha-shoulder" style={{ transformOrigin: "190px 80px" }}>
          <line x1="190" y1="80" x2="174" y2="80" className="ln ghost" />
          <g className="ha-elbow" style={{ transformOrigin: "174px 80px" }}>
            <line x1="174" y1="80" x2="160" y2="80" className="ln ghost" />
            <circle cx="160" cy="80" r="2.5" className="ln ghost" />
          </g>
        </g>
      </g>
    </g>
  );
}

// Dirac Labs — GPS-free nav module. "Environment ping": the module pings the
// space around it (concentric pulses + rotating sweep), detections light up.
function DiracMotif() {
  const cx = 130, cy = 104;
  const iso = (x, y, z) => [cx + (x - y) * 1.04, cy + (x + y) * 0.52 - z];
  const faces = (hw, hd, zb, zt) => {
    const t = (x, y) => iso(x, y, zt).join(",");
    const b = (x, y) => iso(x, y, zb).join(",");
    return {
      top: [t(-hw, -hd), t(hw, -hd), t(hw, hd), t(-hw, hd)].join(" "),
      front: [t(-hw, hd), t(hw, hd), b(hw, hd), b(-hw, hd)].join(" "),
      right: [t(hw, -hd), t(hw, hd), b(hw, hd), b(hw, -hd)].join(" ")
    };
  };
  const base = faces(40, 27, 0, 16);
  const lid = faces(22, 16, 16, 25);
  const board = faces(33, 21, 16, 16);
  const led = iso(34, 24, 8);
  const conn = iso(0, 27, 7);
  const dets = [[66, 64], [198, 66], [186, 150], [60, 148]];
  const orig = `${cx}px ${cy}px`;
  return (
    <g className="motif-ink" fill="none">
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="22" ry="11" className="ping"
          style={{ "--i": i, transformOrigin: orig }} />
      ))}
      <g className="radar-sweep" style={{ transformOrigin: orig }}>
        <polygon points={`${cx},${cy} ${cx + 88},${cy - 24} ${cx + 88},${cy + 24}`} className="sweep-sector" />
        <line x1={cx} y1={cy} x2={cx + 94} y2={cy} className="ln hot" />
      </g>
      {dets.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="dot det" style={{ "--i": i }} />)}
      <g className="dv-module" style={{ transformOrigin: orig }}>
        <polygon points={base.top} className="face" />
        <polygon points={base.front} className="face ln" />
        <polygon points={base.right} className="face ln" />
        <polygon points={base.top} className="ln" />
        <polygon points={board.top} className="board-plane" />
        <line x1={conn[0]} y1={conn[1]} x2={conn[0]} y2={conn[1] + 9} className="ln hot" />
        <circle cx={led[0]} cy={led[1]} r="3" className="led" />
        <polygon points={lid.top} className="face ln" />
        <polygon points={lid.front} className="face ln" />
        <polygon points={lid.right} className="face ln" />
      </g>
    </g>
  );
}

function RotorMotif() {
  // drone — central hub, spinning rotor discs
  const arms = R(130, 100, 50, 4, Math.PI / 4);
  return (
    <g className="motif-ink" fill="none">
      <rect x="120" y="90" width="20" height="20" rx="3" className="cellbox" />
      {arms.map(([x, y], i) => (
        <g key={i}>
          <line x1="130" y1="100" x2={x} y2={y} className="ln" />
          <ellipse cx={x} cy={y} rx="22" ry="6" className="ln rotor-disc" style={{ "--i": i, transformOrigin: `${x}px ${y}px` }} />
          <circle cx={x} cy={y} r="3" className="dot" />
        </g>
      ))}
    </g>
  );
}

const MOTIFS = {
  kubo: KuboMotif, lattice: LatticeMotif, blinq: BlinqMotif,
  armatrix: ArmatrixMotif, pluto: PlutoMotif, flow: FlowMotif,
  dirac: DiracMotif, gantry: GantryMotif, rotor: RotorMotif
};

function DeviceMotif({ type }) {
  const M = MOTIFS[type] || ArmMotif;
  return <Glow><M /></Glow>;
}

window.DeviceMotif = DeviceMotif;
