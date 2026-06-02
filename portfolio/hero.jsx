/* global React */
// Hero — faithful to the Delta V mockup. Background is a user-fillable image
// slot (drop the rocket film/photo); falls back to a tasteful dark field.
function Hero({ b }) {
  return (
    <header className="hero" data-screen-label="Hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-slot hero-img"></div>
        <div className="hero-grain"></div>
        <div className="hero-shade"></div>
      </div>

      <div className="hero-top">
        <div className="wordmark">{b.name}<sup>©</sup></div>
      </div>

      <div className="hero-mid">
        <div className="tagrow">
          {b.tags.map((t, i) => <span key={i} className="meta tag">{t}</span>)}
        </div>
        <h1 className="headline">{b.headLead}<strong>{b.headEmph}</strong></h1>
        <p className="sub">{b.subLead}<strong>{b.subEmph}</strong></p>
      </div>

      <div className="hero-foot">
        <span className="meta">{b.foot}</span>
        <span className="meta portfolio-cue">PORTFOLIO ↓</span>
      </div>
    </header>
  );
}
window.Hero = Hero;
