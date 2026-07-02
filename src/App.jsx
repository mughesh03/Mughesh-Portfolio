import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import data from './data.json'
import { DottedSurface } from './DottedSurface.jsx'
import {
  ensureHttp,
  sanitizeRichText,
  extractBullets,
  plainText
} from './utils.js'

/* ============================ Icons ============================= */
const IconGithub = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...p}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.07c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.17 1.18a10.96 10.96 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.78.12 3.07.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/>
  </svg>
)
const IconLinkedIn = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/>
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/></svg>
)
const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.91.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>
)
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7 17 17 7M8 7h9v9"/></svg>
)
const IconMedal = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 3 4 8l4 3M17 3l3 5-4 3"/>
    <circle cx="12" cy="15" r="6"/>
    <path d="M12 12v6M9 15h6"/>
  </svg>
)
const IconSpark = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>
  </svg>
)
const IconQuote = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
    <path d="M9 7c-3 0-5 2.5-5 6v4h6v-6H6c0-2 1.3-3 3-3V7Zm10 0c-3 0-5 2.5-5 6v4h6v-6h-4c0-2 1.3-3 3-3V7Z"/>
  </svg>
)


/* ============================ Rich text ========================= */
function RichText({ html, className, tight }) {
  const bullets = useMemo(() => extractBullets(html), [html])
  if (!html) return null
  if (bullets && bullets.length > 0) {
    return (
      <ul className={'rt-list ' + (tight ? 'tight ' : '') + (className || '')}>
        {bullets.map((b, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
        ))}
      </ul>
    )
  }
  return (
    <div
      className={'rt-text ' + (className || '')}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  )
}

/* Word-by-word reveal for viewport-triggered headings */
function RevealHeading({ text, className, delay = 0 }) {
  const words = (text || '').trim().split(/\s+/)
  return (
    <span className={'rh-wrap ' + (className || '')}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="rh-word">
            <motion.span
              className="rh-inner"
              initial={{ y: '115%', rotate: 4 }}
              whileInView={{ y: '0%', rotate: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                delay: delay + 0.06 * i,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </React.Fragment>
      ))}
    </span>
  )
}

/* ============================ Nav =============================== */
const NAV_ITEMS = [
  { id: 'top', label: 'Intro' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Research' },
  { id: 'achievements', label: 'Awards' },
  { id: 'contact', label: 'Contact' }
]

function Nav({ name }) {
  const [active, setActive] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40)
    onS()
    window.addEventListener('scroll', onS, { passive: true })
    return () => window.removeEventListener('scroll', onS)
  }, [])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  const initials = (name || 'M').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <header className={'nav ' + (scrolled ? 'is-scrolled' : '')}>
      <a href="#top" className="nav-brand">
        <span className="nav-mark">{initials}</span>
        <div className="nav-titles">
          <span className="nav-title">{name.trim()}</span>
          <span className="nav-sub">Portfolio</span>
        </div>
      </a>
      <nav className="nav-links">
        {NAV_ITEMS.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''}>
            <span className="dotlink" /> {n.label}
          </a>
        ))}
      </nav>
      <a href="#contact" className="nav-cta">
        Get in touch <IconArrow />
      </a>
    </header>
  )
}

/* ============================ Ticker ============================ */
function Ticker() {
  const parts = [
    { k: 'Status', v: 'Open to opportunities' },
    { k: 'Discipline', v: 'Software Engineering / Machine Learning' },
    { k: 'Currently', v: 'MS CS · University of Virginia' },
    { k: 'Location', v: 'California, USA' },
    { k: 'Portfolio', v: '2026' }
  ]
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">
        {[...parts, ...parts, ...parts].map((p, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-k">{p.k}</span>
            <span className="ticker-v">{p.v}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ============================ Hero ============================== */
function AnimatedHeading({ text }) {
  const words = text.trim().split(/\s+/)
  return (
    <span className="ah-wrap">
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="ah-word">
            <motion.span
              initial={{ y: '115%', rotate: 6 }}
              animate={{ y: '0%', rotate: 0 }}
              transition={{ duration: 1.0, delay: 0.08 * i, ease: [0.19, 1, 0.22, 1] }}
              className="ah-inner"
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </React.Fragment>
      ))}
    </span>
  )
}

function Hero({ profile }) {
  const summary = plainText(profile.summary)
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit'
  })
  // Parallax on hero as user scrolls
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 700], [0, -70])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.35])

  return (
    <section id="top" className="hero" ref={heroRef}>
      <motion.div style={{ y: heroY, opacity: heroOpacity }}>
        <div className="hero-header">
          <div className="hh-left">
            <span className="tag">Portfolio · 2026</span>
          </div>
          <div className="hh-right">
            <span className="tag">{today}</span>
            <span className="dot" />
            <span className="tag available"><span className="live-dot" /> Available for work</span>
          </div>
        </div>

        <h1 className="hero-title">
          <AnimatedHeading text={profile.name} />
        </h1>

        <div className="hero-sub">
          <motion.p
            className="hero-role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <em>{profile.role}</em>
          </motion.p>
          <motion.div
            className="hero-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.9 }}
          />
        </div>
      </motion.div>

      <div className="bento">
        <motion.div
          className="bento-cell bio-cell"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.65 }}
        >
          <div className="cell-kicker"><IconQuote /> Introduction</div>
          <p className="bio-text">{summary}</p>
          <div className="bio-cta">
            {profile.email && (
              <a className="btn btn-ink" href={`mailto:${profile.email}`}>
                <IconMail /> Write to me
              </a>
            )}
            {profile.linkedin && (
              <a className="btn btn-outline" href={ensureHttp(profile.linkedin)} target="_blank" rel="noreferrer noopener">
                <IconLinkedIn /> LinkedIn
              </a>
            )}
            {profile.github && (
              <a className="btn btn-outline" href={ensureHttp(profile.github)} target="_blank" rel="noreferrer noopener">
                <IconGithub /> GitHub
              </a>
            )}
          </div>
        </motion.div>

        {profile.avatar?.dataUrl && (
          <motion.div
            className="bento-cell portrait-cell"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.65 }}
          >
            <div className="portrait-frame">
              <div className="portrait-ring ring-1" aria-hidden />
              <div className="portrait-ring ring-2" aria-hidden />
              <div className="portrait-ring ring-3" aria-hidden />
              <div className="portrait-circle">
                <img src={profile.avatar.dataUrl} alt={profile.name.trim()} />
              </div>
            </div>
            <div className="portrait-badge">
              <span className="live-dot" /> Available
            </div>
          </motion.div>
        )}

        <motion.div
          className="bento-cell fact-cell"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.65 }}
        >
          <div className="fact">
            <span className="fact-k">Currently</span>
            <span className="fact-v">MS in Computer Science, University of Virginia</span>
          </div>
          <div className="fact">
            <span className="fact-k">Focus</span>
            <span className="fact-v">Machine Learning, Software Engineering, Systems</span>
          </div>
          <div className="fact">
            <span className="fact-k">Formerly</span>
            <span className="fact-v">UVA ITS · IBM · UC Berkeley (GLOBE)</span>
          </div>
        </motion.div>

        <motion.a
          className="bento-cell contact-cell"
          href={profile.email ? `mailto:${profile.email}` : '#contact'}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.65 }}
        >
          <span className="cell-kicker">Say hello</span>
          <div className="contact-big">{profile.email || 'hello@'}</div>
          <span className="contact-arrow"><IconArrow /></span>
        </motion.a>

        <motion.div
          className="bento-cell loc-cell"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.65 }}
        >
          <span className="cell-kicker">Located</span>
          <div className="loc-big"><IconPin /> {profile.location || '—'}</div>
          {profile.phone && (
            <a className="loc-phone" href={`tel:${profile.phone}`}><IconPhone /> {profile.phone}</a>
          )}
        </motion.div>
      </div>

      <div className="scroll-cue">
        <div className="cue-line" />
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}

/* ============================ Section head ====================== */
function SectionHead({ kicker, title, subtitle }) {
  return (
    <motion.div
      className="sec-head"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4 }}
    >
      <motion.span
        className="sec-kicker"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="sec-kicker-line" /> {kicker}
      </motion.span>
      <h2 className="sec-title">
        <RevealHeading text={title} />
      </h2>
      {subtitle && (
        <motion.p
          className="sec-sub"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

/* ============================ Skills ============================ */
function Skills({ skills }) {
  if (!skills?.length) return null
  const half = Math.ceil(skills.length / 2)
  const laneA = skills.slice(0, half)
  const laneB = skills.slice(half)
  const render = (arr) => [...arr, ...arr, ...arr].map((s, i) => (
    <span key={s.id + '-' + i} className="lane-item">
      <IconSpark /> {s.name}
    </span>
  ))
  return (
    <section id="skills" className="section skills-section">
      <SectionHead kicker="Toolkit" title="Skills & Stack" subtitle="A snapshot of the tools I reach for." />
      <motion.div
        className="lanes"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="lane"><div className="lane-track lane-left">{render(laneA)}</div></div>
        <div className="lane"><div className="lane-track lane-right">{render(laneB)}</div></div>
      </motion.div>
    </section>
  )
}

/* ============================ Credentials (Exp/Edu) ============= */
function CredCard({ item, index, tone }) {
  return (
    <motion.article
      className={'cred-card ' + (tone === 'edu' ? 'is-edu' : '')}
      initial={{ opacity: 0, y: 60, x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="cred-side">
        {item.logo?.dataUrl ? (
          <div className="cred-logo-frame">
            <img src={item.logo.dataUrl} alt={item.organization || ''} />
          </div>
        ) : (
          <div className="cred-logo-frame placeholder">
            {(item.organization || item.title || '?').charAt(0).toUpperCase()}
          </div>
        )}
        {item.date && <div className="cred-date">{item.date}</div>}
      </div>
      <div className="cred-main">
        <div className="cred-top">
          {item.link ? (
            <a className="cred-title" href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener">
              {item.title} <IconArrow />
            </a>
          ) : (
            <span className="cred-title">{item.title}</span>
          )}
          <div className="cred-meta">
            {item.organization && <span className="cred-org">{item.organization}</span>}
            {item.location && <><span className="mid-dot" /><span>{item.location}</span></>}
          </div>
        </div>
        {item.description && <RichText html={item.description} />}
      </div>
    </motion.article>
  )
}

function CredList({ id, kicker, title, subtitle, items, tone }) {
  if (!items?.length) return null
  return (
    <section id={id} className="section">
      <SectionHead kicker={kicker} title={title} subtitle={subtitle} />
      <div className="cred-stack">
        {items.map((item, i) => (
          <CredCard key={item.id} item={item} index={i} tone={tone} />
        ))}
      </div>
    </section>
  )
}

/* ============================ Projects ========================== */
function ProjectCard({ item, index }) {
  return (
    <motion.article
      className="case"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="case-mark" aria-hidden />
      <div className="case-head">
        <div className="case-badges">
          <span className="badge">Case Study</span>
          {item.link && <span className="badge badge-live">Live</span>}
        </div>
        {item.link && (
          <a
            className="case-view"
            href={ensureHttp(item.link)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Visit ${item.title}`}
          >
            <IconArrow />
          </a>
        )}
      </div>
      <h3 className="case-title">
        {item.link ? (
          <a href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
      {item.description && <RichText html={item.description} />}
      {item.link && (
        <a className="case-cta" href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener">
          <span>Visit project</span>
          <span className="cta-arrow"><IconArrow /></span>
        </a>
      )}
    </motion.article>
  )
}

function Projects({ items }) {
  if (!items?.length) return null
  return (
    <section id="projects" className="section">
      <SectionHead kicker="Selected Work" title="Projects" subtitle="Prototypes, systems, and things I've shipped." />
      <div className="case-stack">
        {items.map((p, i) => <ProjectCard key={p.id} item={p} index={i} />)}
      </div>
    </section>
  )
}

/* ============================ Publications ====================== */
function classifyPub(item) {
  const t = (item.title + ' ' + (item.organization || '')).toLowerCase()
  if (t.includes('patent') || t.includes('intellectual property')) return 'Patent'
  if (t.includes('ieee')) return 'IEEE Paper'
  return 'Paper'
}

function PubCard({ item, index }) {
  const type = classifyPub(item)
  return (
    <motion.article
      className="paper"
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="paper-head">
        <div className="paper-badges">
          <span className={'badge badge-' + type.replace(/\s+/g, '-').toLowerCase()}>{type}</span>
          {item.organization && <span className="paper-org">{item.organization}</span>}
        </div>
        {item.link && (
          <a className="paper-view" href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener">
            Read <IconArrow />
          </a>
        )}
      </div>
      <div className="paper-body">
        <h3 className="paper-title">
          {item.link ? (
            <a href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener"><em>{item.title}</em></a>
          ) : (
            <em>{item.title}</em>
          )}
        </h3>
        {item.description && <RichText html={item.description} />}
      </div>
      {item.image?.dataUrl && (
        <div className="paper-thumb">
          <img src={item.image.dataUrl} alt="" loading="lazy" />
        </div>
      )}
    </motion.article>
  )
}
function Publications({ items }) {
  if (!items?.length) return null
  return (
    <section id="publications" className="section">
      <SectionHead kicker="Research" title="Publications & Patents" subtitle="Peer-reviewed papers and intellectual property." />
      <div className="paper-stack">
        {items.map((p, i) => <PubCard key={p.id} item={p} index={i} />)}
      </div>
    </section>
  )
}

/* ============================ Achievements ====================== */
function AwardCard({ item, index }) {
  return (
    <motion.article
      className="award"
      initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="award-ornament">
        <span className="award-medal"><IconMedal /></span>
      </div>
      <h4 className="award-title"><em>{item.title}</em></h4>
      <div className="award-rule" aria-hidden>
        <span /><span className="award-rule-dot" /><span />
      </div>
      {item.description && <RichText html={item.description} />}
    </motion.article>
  )
}
function Achievements({ items }) {
  if (!items?.length) return null
  return (
    <section id="achievements" className="section">
      <SectionHead kicker="Recognition" title="Awards & Achievements" subtitle="Highlights and honors along the way." />
      <div className="award-grid">
        {items.map((a, i) => <AwardCard key={a.id} item={a} index={i} />)}
      </div>
    </section>
  )
}

/* ============================ Contact =========================== */
function Contact({ profile }) {
  return (
    <section id="contact" className="section contact-section">
      <div className="contact-shell">
        <motion.span
          className="sec-kicker"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="sec-kicker-line" /> Get in touch
        </motion.span>
        <h2 className="contact-title">
          <RevealHeading text="Let's build something" />
          <br />
          <em><RevealHeading text="worth remembering." delay={0.15} /></em>
        </h2>
        <motion.p
          className="contact-sub"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          I'm always up for conversations about machine learning, software engineering, and startups.
        </motion.p>
        <motion.div
          className="contact-actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {profile.email && (
            <a className="btn btn-ink btn-lg" href={`mailto:${profile.email}`}>
              <IconMail /> {profile.email}
            </a>
          )}
          <div className="contact-icons">
            {profile.github && (
              <a className="ic-btn" href={ensureHttp(profile.github)} target="_blank" rel="noreferrer noopener" aria-label="GitHub"><IconGithub /></a>
            )}
            {profile.linkedin && (
              <a className="ic-btn" href={ensureHttp(profile.linkedin)} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn"><IconLinkedIn /></a>
            )}
            {profile.phone && (
              <a className="ic-btn" href={`tel:${profile.phone}`} aria-label="Phone"><IconPhone /></a>
            )}
          </div>
        </motion.div>
        <footer className="footer">
          <span>© {new Date().getFullYear()} {profile.name.trim()}.</span>
          <span>Handcrafted with React, Framer Motion & a lot of coffee.</span>
        </footer>
      </div>
    </section>
  )
}

/* ============================ Progress ========================== */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.2 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

/* ============================ App =============================== */
export default function App() {
  const profile = data.profile || {}
  return (
    <>
      <DottedSurface />
      <ScrollProgress />
      <Nav name={profile.name || 'M'} />
      <Ticker />
      <motion.main
        className="main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero profile={profile} />
        <Skills skills={data.skills} />
        <CredList
          id="experience"
          kicker="Journey"
          title="Experience"
          subtitle="Where I've contributed."
          items={data.experience}
        />
        <CredList
          id="education"
          kicker="Learning"
          title="Education"
          subtitle="Programs and degrees."
          items={data.education}
          tone="edu"
        />
        <Projects items={data.projects} />
        <Publications items={data.publications} />
        <Achievements items={data.achievements} />
        <Contact profile={profile} />
      </motion.main>
    </>
  )
}
