// Steve Mohr · Exposing Deception (modern editorial)
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "h1Variant": "sounds-right",
  "showQuiz": true
}/*EDITMODE-END*/;

// === HEADLINE VARIANTS (mixed case, modern) ===
const H1_VARIANTS = {
  "sounds-right": {
    tagline: "Stand firm · Speak truth · Live free",
    headline: (
      <>Not everything that <em className="em">sounds right</em> is true.</>
    ),
    lede: (
      <>The lies are subtle. The consequences are real. <em>Exposing Deception</em> is a wake-up call for the Church to discern, return to Scripture, and stand firm.</>
    )
  },
  "wake-up": {
    tagline: "A new book from Steve Mohr",
    headline: (
      <>It's time to <em className="em">wake up</em>, discern, and stand firm.</>
    ),
    lede: (
      <>A wake-up call for believers and leaders, revealing how subtle lies and compromised convictions can lead even sincere hearts astray.</>
    )
  },
  "battle": {
    tagline: "The battle for truth is real",
    headline: (
      <>The truth is worth <em className="em">fighting for</em>, and you don't fight alone.</>
    ),
    lede: (
      <>In an age of confusion and compromise, <em>Exposing Deception</em> challenges the Church to return to Scripture, test everything, and courageously defend the truth that sets us free.</>
    )
  }
};

// === REVIEWS ===
const REVIEWS = [
  {
    body: "This book is a wake-up call for both believers and leaders, revealing how subtle lies, compromised convictions, and distorted teachings can lead even sincere hearts astray.",
    name: "Amazon Editorial",
    org: "Featured Description"
  },
  {
    body: "A courageous and timely work that speaks directly to the heart of today's Church.",
    name: "Rev. Samuel Ortieno Rama",
    org: "Aflame of Joy Ministries, Nairobi, Kenya",
    image: "assets/exposing-deception-book.webp",
    imageAlt: "Rev. Samuel Ortieno Rama holding a copy of Exposing Deception"
  }
];

// === DISCERNMENT QUIZ ===
const QUIZ = [
  {
    stmt: "A message that emphasizes love and unity but never names sin or calls for repentance reflects the full Gospel.",
    answer: false,
    explain: "The Gospel Jesus preached began with the word \"repent.\" A message that strips away conviction in the name of comfort isn't more loving. It's a half-truth, and a half-truth is the most dangerous kind of lie.",
    verse: { text: "Repent, for the kingdom of heaven is at hand.", ref: "Matthew 4:17" }
  },
  {
    stmt: "If a teaching contradicts what most people in the culture believe today, it is probably outdated and should be reconsidered.",
    answer: false,
    explain: "Truth is not decided by majority. The Church has always been called to be set apart, not conformed to the patterns of the world, but transformed by the renewing of the mind.",
    verse: { text: "Do not be conformed to this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2" }
  },
  {
    stmt: "Even the most respected teacher's words should be tested against Scripture.",
    answer: true,
    explain: "The Bereans were called \"more noble\" precisely because they tested Paul's preaching against the Scriptures every day. No teacher, pastor, or tradition stands above God's Word.",
    verse: { text: "Test all things; hold fast what is good.", ref: "1 Thessalonians 5:21" }
  }
];

const QUIZ_RESULTS = {
  3: { title: <>A <em>discerning</em> spirit.</>, copy: "You see through the fog. But the work doesn't stop. Every day brings a new subtle lie. Sharpen what you already have." },
  2: { title: <>Almost <em>there</em>.</>, copy: "Your discernment is awake, but the subtler lies still slip through. Chapter 1 of Exposing Deception shows the pattern behind them all." },
  1: { title: <>The lies are <em>working</em>.</>, copy: "Today's culture has trained you to second-guess the truth. The good news: discernment is a gift God promises to those who ask. This book is a map." },
  0: { title: <>Time to <em>wake up</em>.</>, copy: "You're not alone. Most believers today miss these. This isn't shame, it's an invitation. Chapter 1 begins the way back." }
};

const TAKEAWAYS = [
  "How deception enters the Church in subtle, accepted ways",
  "Why sound doctrine and discernment matter now more than ever",
  "Practical ways to test everything and hold fast to the truth",
  "Encouragement to live courageously and speak truth in love"
];

// === ICONS (line, modern) ===
const Icons = {
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L20 5 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V5 Z"/><path d="M12 8 V14 M9.5 11 H14.5"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5 C6 4 9 4.5 12 6 C15 4.5 18 4 21 5 V19 C18 18 15 18.5 12 20 C9 18.5 6 18 3 19 Z"/><path d="M12 6 V20"/></svg>,
  compass: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9 L13 13 L9 15 L11 11 Z" fill="currentColor" fillOpacity="0.2"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5 L11 15.5 L16 9.5"/></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11 V7.5 a4 4 0 0 1 8 0 V11"/></svg>,
  arrow: <span style={{ fontWeight: 500 }}>→</span>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7 L12 13 L21 7"/></svg>,
  retake: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 a9 9 0 1 0 3-6.7"/><path d="M3 4 V8 H7"/></svg>
};

// === NAV ===
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-name">Steve <span className="accent">Mohr</span></span>
          <span className="brand-tag">Stand firm. Speak truth. Live free.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#top" className="active">Home</a></li>
          <li><a href="#about">About Steve</a></li>
          <li><a href="#book">The Book</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

const CHAPTER_ONE_URL = "https://drive.google.com/file/d/1xFiWvFQgY7X4vpJAIp-OzL_kKo-GIfuh/view?usp=sharing";
const SUBSCRIBE_ENDPOINT = "/api/subscribe";

// === EMAIL CAPTURE (reusable) ===
function EmailCapture({
  card = true,
  buttonLabel = "Send me Chapter 1",
  placeholder = "Enter your email address"
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | sent | error

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || status === "submitting") return;
    setStatus("submitting");
    // Fire-and-await the subscribe call, but always open Chapter 1 so the
    // visitor gets the file even if the backend hiccups.
    try {
      await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exposing-deception-site" })
      });
    } catch (err) {
      // swallow — we still show success and open the PDF
    }
    window.open(CHAPTER_ONE_URL, '_blank', 'noopener,noreferrer');
    setStatus("sent");
  };

  const formContents = (
    <>
      <input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
        required
        disabled={status === "submitting"}
      />
      <button type="submit" className="btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : buttonLabel}
      </button>
    </>
  );

  if (status === "sent") {
    return (
      <div className={card ? "capture-card" : "capture"}>
        <div className="capture-success">
          ✦ Chapter 1 is opening in a new tab.
          <small>
            If it didn't open, <a href={CHAPTER_ONE_URL} target="_blank" rel="noopener noreferrer">click here</a> to view it.
          </small>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <form className="capture" onSubmit={submit}>
        <div className="capture-row">{formContents}</div>
        <div className="capture-trust">
          <span className="item">{Icons.lock} No spam. Unsubscribe anytime.</span>
        </div>
      </form>
    );
  }

  return (
    <form className="capture-card" onSubmit={submit}>
      <div className="capture-icon" aria-hidden="true">{Icons.book}</div>
      <h3 className="capture-title">
        Get <span className="accent">Chapter 1</span> <span className="accent">Free</span>
      </h3>
      <div className="capture-rule" />
      <p className="capture-sub">
        Enter your email and I'll send you Chapter 1, <span className="accent">free.</span>
      </p>
      <div className="capture-row">{formContents}</div>
      <div className="capture-trust">
        <span className="item">{Icons.lock} No spam. Unsubscribe anytime.</span>
      </div>
    </form>
  );
}

// === HERO ===
function Hero({ tweaks }) {
  const variant = H1_VARIANTS[tweaks.h1Variant] || H1_VARIANTS["sounds-right"];
  const embersRef = useRef(null);

  // Spawn floating embers, anchored to the bright diamond point
  useEffect(() => {
    const root = embersRef.current;
    if (!root) return;
    if (window.matchMedia('(max-width: 720px)').matches) return;
    root.innerHTML = '';
    const n = 60;
    for (let i = 0; i < n; i++) {
      const e = document.createElement('span');
      e.className = 'ember';
      const angle = Math.random() * Math.PI * 2;
      const bias = (Math.random() < 0.55)
        ? (Math.PI * 1.05 + (Math.random() - 0.5) * 0.9)
        : angle;
      const dist = 30 + Math.random() * 90;
      const tx = Math.cos(bias) * dist;
      const ty = Math.sin(bias) * dist;
      const dur = 6 + Math.random() * 8;
      const delay = -Math.random() * dur;
      const size = 2 + Math.random() * 3;
      e.style.setProperty('--tx', tx + 'vw');
      e.style.setProperty('--ty', ty + 'vw');
      e.style.setProperty('--d', dur + 's');
      e.style.setProperty('--delay', delay + 's');
      e.style.width = size + 'px';
      e.style.height = size + 'px';
      root.appendChild(e);
    }
  }, []);

  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      {/* SVG fire-wave displacement filter — animates the corona rim & filaments */}
      <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="firewave" x="-25%" y="-25%" width="150%" height="150%" filterUnits="objectBoundingBox">
            <feTurbulence id="firewave-turb" type="fractalNoise" baseFrequency="0.014 0.022" numOctaves="2" seed="1" result="t">
              <animate id="firewave-anim" attributeName="seed" from="1" to="80" dur="6s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap id="firewave-disp" in="SourceGraphic" in2="t" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <img className="hero__img" src="assets/eclipse.webp" alt="" />

      {/* Additive light layers, anchored to the bright spot */}
      <div className="wash" />
      <div className="glow aura" />

      {/* Corona ring around the eclipse disc */}
      <div className="ring ring--halo" />
      <div className="ring ring--rim" />
      <div className="ring ring--hotspot" />
      <div className="ring ring--hotspot ring--hotspot-2" />
      <div className="ring ring--filaments" />

      <div className="glow corona" />
      <div className="glow rays" />
      <div className="glow rays rays--fine" />
      <div className="glow streak" />
      <div className="glow streak streak--v" />
      <div className="glow core" />

      <div className="embers" ref={embersRef} />
      <div className="hero-vignette" />
      <div className="hero-scrim" />

      <div className="wrap" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span>"The lies are subtle.</span>
              <span>The consequences are real.</span>
              <span className="eyebrow-accent">The truth still matters."</span>
            </div>
            <h1 className="h1">
              <span className="book-title">Exposing</span>
              <span className="book-title book-title--accent">Deception</span>
            </h1>
            <p className="book-subtitle">Biblical Discernment<br />&amp; The Battle for Truth</p>
            <div className="title-rule" />
          </div>

          <div className="hero-right">
            <EmailCapture buttonLabel="Send me Chapter 1" />
          </div>
        </div>
      </div>
    </section>
  );
}

// === PILLARS ===
function Pillars() {
  return (
    <section className="pillars">
      <div className="wrap">
        <div className="pillars-grid">
          <div className="pillar">
            <div className="ico">{Icons.compass}</div>
            <div>
              <h4>Discern</h4>
              <p>Recognize falsehood where it lives.</p>
            </div>
          </div>
          <div className="pillar">
            <div className="ico">{Icons.book}</div>
            <div>
              <h4>Stand firm</h4>
              <p>Anchor in God's unchanging Word.</p>
            </div>
          </div>
          <div className="pillar">
            <div className="ico">{Icons.shield}</div>
            <div>
              <h4>Defend</h4>
              <p>Speak the truth, in love.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === REVIEWS ===
function Reviews() {
  return (
    <section className="reviews" id="endorsements" data-screen-label="02 Reviews">
      <div className="wrap">
        <div className="reviews-head reveal">
          <div className="eyebrow">The response</div>
          <h2>What <em>readers</em> are saying.</h2>
        </div>
        <div className="reviews-grid">
          <div className="review-card rating reveal">
            <div className="big">5.0</div>
            <div className="stars">★★★★★</div>
            <div className="meta">Based on reader ratings</div>
            <div className="source">Goodreads · Amazon</div>
          </div>
          {REVIEWS.map((r, i) => (
            <div className={`review-card reveal${r.image ? ' has-photo' : ''}`} key={i}>
              <div className="qmark">"</div>
              <p className="qbody">{r.body}</p>
              <p className="qattr">
                {r.image && (
                  <span className="review-photo">
                    <img src={r.image} alt={r.imageAlt || ''} loading="lazy" />
                  </span>
                )}
                <span>
                  <strong>{r.name}</strong>
                  {r.org}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// === DISCERNMENT QUIZ ===
function Discernment() {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const done = idx >= QUIZ.length;

  const pick = (val) => {
    if (revealed) return;
    setPicks([...picks, val]);
    setRevealed(true);
  };
  const next = () => {
    setRevealed(false);
    setIdx(idx + 1);
  };
  const restart = () => {
    setIdx(0);
    setPicks([]);
    setRevealed(false);
  };

  const score = picks.filter((p, i) => p === QUIZ[i].answer).length;
  const current = QUIZ[idx];
  const isCorrect = revealed && picks[picks.length - 1] === current?.answer;

  return (
    <section className="discernment" id="quiz" data-screen-label="03 Discernment">
      <div className="wrap">
        <div className="disc-head reveal">
          <div className="eyebrow">An interactive test</div>
          <h2>Can you spot the <em>deception</em>?</h2>
          <p>Three statements. Each one is something you might hear today, from a pulpit, a podcast, or a friend. Read each one and decide: truth, or a subtle lie?</p>
        </div>

        <div className="disc-card reveal">
          {!done ? (
            <>
              <div className="disc-progress">
                {QUIZ.map((_, i) => (
                  <div key={i} className={`step ${i < idx ? 'done' : i === idx ? 'active' : ''}`} />
                ))}
              </div>

              <div className="disc-q">
                <div className="qnum">Statement {idx + 1} of {QUIZ.length}</div>
                <p className="qstmt">{current.stmt}</p>

                <div className="disc-choices">
                  <button
                    className={`disc-btn ${revealed ? (picks[picks.length-1] === true ? (current.answer === true ? 'picked-correct' : 'picked-wrong') : '') : ''}`}
                    onClick={() => pick(true)}
                    disabled={revealed}
                  >
                    Truth
                  </button>
                  <button
                    className={`disc-btn ${revealed ? (picks[picks.length-1] === false ? (current.answer === false ? 'picked-correct' : 'picked-wrong') : '') : ''}`}
                    onClick={() => pick(false)}
                    disabled={revealed}
                  >
                    Deception
                  </button>
                </div>

                {revealed && (
                  <>
                    <div className="disc-reveal">
                      <span className={`verdict ${isCorrect ? '' : 'wrong'}`}>
                        {isCorrect ? "You discerned it correctly." : "This is a subtle deception."}
                      </span>
                      {current.explain}
                      <span className="verse">
                        "{current.verse.text}"
                        <span className="ref">{current.verse.ref}</span>
                      </span>
                    </div>
                    <div className="disc-next">
                      <button onClick={next}>
                        {idx === QUIZ.length - 1 ? 'See your result' : 'Next statement'}
                        <span style={{fontSize: 16}}>→</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="disc-result">
              <div className="score">{score}<em>/{QUIZ.length}</em></div>
              <div className="score-lbl">Statements discerned</div>
              <h3>{QUIZ_RESULTS[score].title}</h3>
              <p>{QUIZ_RESULTS[score].copy}</p>
              <a href="#final-cta" className="btn-primary" style={{textDecoration: 'none'}}>
                Get Chapter 1 free <span className="arr">→</span>
              </a>
              <div>
                <button onClick={restart} className="retake">
                  <span style={{width: 14, height: 14, display: 'inline-flex'}}>{Icons.retake}</span>
                  Retake the test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// === ABOUT ===
function About() {
  return (
    <section className="about" id="about" data-screen-label="04 About">
      <div className="about-bg" />
      <div className="wrap about-inner">
        <div className="about-grid">
          <div className="about-photo reveal">
            <img src="assets/steve-and-wife.webp" alt="Steve Mohr and his wife Linda" />
            <div className="frame" />
          </div>
          <div className="about-text reveal">
            <div className="eyebrow">About the author</div>
            <h2>Meet <em>Steve Mohr</em>.</h2>
            <p>Steve has ministered in churches throughout the U.S. since 1978, serving as both a youth and senior pastor. He and his wife Linda now live in Oregon. Together they have 7 children and 11 grandchildren.</p>
            <p>After nearly fifty years of ministry, Steve writes from the conviction that the most loving thing a pastor can do today is to name the lies that dress themselves up as truth, and call the Church back to Scripture.</p>
            <p className="first-book">Exposing Deception is his first book.</p>

            <div className="checklist" id="book">
              <div className="checklist-label">In this book, you'll discover:</div>
              <ul>
                {TAKEAWAYS.map((t, i) => (
                  <li key={i}>
                    <span className="check">{Icons.check}</span>
                    <p>{t}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === FINAL CTA ===
function FinalCTA() {
  return (
    <section className="final-cta" id="final-cta" data-screen-label="05 Final CTA">
      <div className="final-cta-bg" />
      <div className="wrap">
        <div className="final-cta-inner reveal">
          <div className="eyebrow">Your invitation</div>
          <h2>The battle for truth is real, but you don't have to <em>fight it alone</em>.</h2>
          <p>Enter your email and I'll send you Chapter 1 of <em>Exposing Deception</em>, free.</p>
          <EmailCapture card={false} buttonLabel="Send me Chapter 1" placeholder="Enter your email" />
        </div>
      </div>
    </section>
  );
}

// === FOOTER ===
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand brand">
            <span className="brand-name">Steve <span className="accent">Mohr</span></span>
            <span className="brand-tag">Stand firm. Speak truth. Live free.</span>
          </div>
          <ul className="footer-links">
            <li><a href="#top">Home</a></li>
            <li><a href="#about">About Steve</a></li>
            <li><a href="#book">The Book</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-base">
          <span>© 2026 Steve Mohr. All rights reserved.</span>
          <span>Published by Pagefire Press · ISBN 979-8270859084</span>
        </div>
      </div>
    </footer>
  );
}

// === SCROLL REVEAL ===
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// === TWEAKS ===
function StevePanel({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Headline">
        <TweakRadio
          label="Variant"
          value={tweaks.h1Variant}
          onChange={(v) => setTweak('h1Variant', v)}
          options={[
            { value: 'sounds-right', label: 'Sounds right' },
            { value: 'wake-up', label: 'Wake up' },
            { value: 'battle', label: 'Battle' },
          ]}
        />
      </TweakSection>
      <TweakSection label="Interactivity">
        <TweakToggle
          label="Discernment quiz"
          value={tweaks.showQuiz}
          onChange={(v) => setTweak('showQuiz', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// === APP ===
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useScrollReveal();

  return (
    <>
      <Nav />
      <Hero tweaks={tweaks} />
      <Pillars />
      <Reviews />
      {tweaks.showQuiz && <Discernment />}
      <About />
      <FinalCTA />
      <Footer />
      <StevePanel tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
