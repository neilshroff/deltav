/* global React, DeviceMotif */
const { useState, useEffect, useRef } = React;

// Reveal-on-scroll: adds .in when the element enters the viewport.
function useReveal(opts = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: opts.threshold ?? 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}
window.useReveal = useReveal;

// One portfolio cell — index + sector meta, abstract device artwork, name + location.
// Renders as an external link when the company has a url (and isn't stealth).
function Cell({ c, i }) {
  const [ref, seen] = useReveal();
  const clickable = c.url && !c.stealth;
  const Tag = clickable ? "a" : "article";
  const linkProps = clickable
    ? { href: c.url, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Tag
      ref={ref}
      {...linkProps}
      className={"cell" + (seen ? " in" : "") + (c.stealth ? " stealth" : "") + (clickable ? " clickable" : "")}
      style={{ "--d": (i % 3) * 70 + "ms" }}
      data-screen-label={"Cell " + c.n}
    >
      <header className="cell-top">
        <span className="meta num">{c.n}</span>
        <span className="meta sector">{c.sector}</span>
      </header>

      <div className="stage">
        <div className="art">
          <DeviceMotif type={c.motif} />
        </div>
        <div className="scanline" aria-hidden="true"></div>
        {c.stealth && <div className="stealth-veil"><span className="meta">IN STEALTH</span></div>}
        <span className="slot-tag meta">▣ {c.name.replace("[ IN STEALTH ]", "STEALTH")} · DEVICE FILM</span>
      </div>

      <footer className="cell-bot">
        <span className="cname">{c.name}</span>
        <span className="meta loc">{c.loc}{clickable ? " ↗" : ""}</span>
      </footer>
    </Tag>
  );
}
window.Cell = Cell;
