import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import data from './data.json'
import { DottedSurface } from './DottedSurface.jsx'
import { ensureHttp, sanitizeRichText, extractBullets, plainText } from './utils.js'

const EASE = [0.22, 1, 0.36, 1]

/* Headline figures, taken from the résumé. Edit here when the résumé changes. */
const HIGHLIGHTS = [
  { value: 6656, label: 'Wireless access points surveyed and documented across campus', source: 'UVA ITS', hue: 'blue' },
  { value: 99.4, decimals: 1, suffix: '%', label: 'R² prediction accuracy with a Random Forest model', source: 'IBM', hue: 'violet' },
  { value: 3, label: 'Two IEEE research papers and one granted patent', source: 'IEEE · IP India', hue: 'pink' },
  { value: 10950, prefix: '$', label: 'Chancellor’s Scholarship, selected from 600+ applicants', source: 'UC Berkeley', hue: 'amber' }
]

/* ============================== Icons ============================== */
const Svg = ({ size = 18, children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)
const IconHome = (p) => <Svg {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" /></Svg>
const IconCode = (p) => <Svg {...p}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" /></Svg>
const IconBriefcase = (p) => <Svg {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></Svg>
const IconCap = (p) => <Svg {...p}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c0 1.2 2.7 3 6 3s6-1.8 6-3v-5M22 9v6" /></Svg>
const IconLayers = (p) => <Svg {...p}><path d="m12 3-9 5 9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /></Svg>
const IconFile = (p) => <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>
const IconAward = (p) => <Svg {...p}><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></Svg>
const IconMail = (p) => <Svg {...p}><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 6L2 7" /></Svg>
const IconPhone = (p) => <Svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.91.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" /></Svg>
const IconPin = (p) => <Svg {...p}><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Svg>
const IconCalendar = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>
const IconArrow = (p) => <Svg size={14} strokeWidth="2" {...p}><path d="M7 17 17 7M8 7h9v9" /></Svg>
const IconDownload = (p) => (
  <Svg {...p}>
    <path d="M12 3v10M8 11l4 4 4-4" />
    <path d="M5 17h14" />
  </Svg>
)
const IconGithub = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.07c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.17 1.18a10.96 10.96 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.78.12 3.07.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
  </svg>
)
const IconLinkedIn = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
  </svg>
)

/* ============================= Sections ============================ */
const SECTIONS = [
  { id: 'top', label: 'Intro', Icon: IconHome, hue: 'violet' },
  { id: 'skills', label: 'Skills', Icon: IconCode, hue: 'teal' },
  { id: 'experience', label: 'Experience', Icon: IconBriefcase, hue: 'blue' },
  { id: 'education', label: 'Education', Icon: IconCap, hue: 'green' },
  { id: 'projects', label: 'Projects', Icon: IconLayers, hue: 'orange' },
  { id: 'publications', label: 'Research', Icon: IconFile, hue: 'pink' },
  { id: 'achievements', label: 'Awards', Icon: IconAward, hue: 'amber' },
  { id: 'contact', label: 'Contact', Icon: IconMail, hue: 'violet' }
]
const GROUP_HUES = ['violet', 'blue', 'teal', 'green', 'orange', 'pink', 'amber']

const RESUME_PATH = '/Mughesh_Resume.pdf'
const RESUME_DOWNLOAD_NAME = 'Mughesh_Kumar_Resume.pdf'

/* ============================ Primitives =========================== */

/* Word-by-word reveal. Words are plain inline-blocks joined by real spaces,
   with no clipping mask, so descenders (g, y, p) are never cut and headings
   wrap normally on narrow screens. */
function Words({ text, delay = 0 }) {
  const words = (text || '').trim().split(/\s+/)
  return words.map((w, i) => (
    <React.Fragment key={i}>
      <motion.span
        className="w"
        initial={{ opacity: 0, y: '0.5em', rotate: 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.8, delay: delay + i * 0.08, ease: EASE }}
      >
        {w}
      </motion.span>
      {i < words.length - 1 ? ' ' : null}
    </React.Fragment>
  ))
}

function RichText({ html }) {
  const bullets = useMemo(() => extractBullets(html), [html])
  const clean = useMemo(() => (bullets ? '' : sanitizeRichText(html)), [html, bullets])
  if (!html) return null
  if (bullets && bullets.length > 0) {
    return (
      <motion.ul
        className="rt-list"
        initial="off"
        whileInView="on"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ off: {}, on: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
      >
        {bullets.map((b, i) => (
          <motion.li
            key={i}
            variants={{
              off: { opacity: 0, x: 16 },
              on: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } }
            }}
            dangerouslySetInnerHTML={{ __html: b }}
          />
        ))}
      </motion.ul>
    )
  }
  return <div className="rt-text" dangerouslySetInnerHTML={{ __html: clean }} />
}

function CountUp({ to, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) { setValue(to); return }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v)
    })
    return () => controls.stop()
  }, [inView, reduce, to])
  const text = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  return <span ref={ref}>{prefix}{text}{suffix}</span>
}

/* A section with a kicker, a revealed title, a rule that draws itself, and a
   large ghost word that slides sideways as the page scrolls. */
function Section({ id, hue, ghost, kicker, title, subtitle, flip, className = '', children }) {
  const ghostRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: ghostRef, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], flip ? ['-34%', '4%'] : ['4%', '-34%'])
  return (
    <section id={id} className={'section ' + className} data-hue={hue}>
      <div className="ghost" ref={ghostRef} aria-hidden="true">
        <motion.span style={{ x }}>{ghost}</motion.span>
      </div>
      <div className="wrap">
        <header className="sec-head">
          <motion.span
            className="kicker"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="kicker-dot" /> {kicker}
          </motion.span>
          <h2 className="sec-title"><Words text={title} /></h2>
          {subtitle && (
            <motion.p
              className="sec-sub"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            className="sec-rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          />
        </header>
        {children}
      </div>
    </section>
  )
}

/* =============================== Chrome ============================ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.2 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}

function TopBar({ name }) {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <motion.header
      className="topbar wrap"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <a href="#top" className="brand">
        <span className="brand-mark">{initials}</span>
        <span className="brand-name">{name}</span>
      </a>
      <span className="status"><span className="live-dot" /> Open to opportunities</span>
    </motion.header>
  )
}

function Dock() {
  const [active, setActive] = useState('top')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return (
    <div className="dock-wrap">
      <motion.nav
        className="dock"
        aria-label="Sections"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
      >
        {SECTIONS.map(({ id, label, Icon, hue }) => (
          <a
            key={id}
            href={'#' + id}
            className={'dock-item' + (active === id ? ' is-active' : '')}
            data-hue={hue}
            aria-label={label}
            aria-current={active === id ? 'true' : undefined}
          >
            <Icon />
            <span className="dock-label">{label}</span>
          </a>
        ))}
      </motion.nav>
    </div>
  )
}

/* ================================ Hero ============================= */
function KineticName({ text }) {
  const words = text.split(/\s+/)
  let n = 0
  return (
    <h1 className="hero-name" aria-label={text}>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="kn-word" aria-hidden="true">
            {Array.from(word).map((ch, ci) => {
              const i = n++
              return (
                <motion.span
                  key={ci}
                  className="kn-char"
                  initial={{ opacity: 0, y: '0.45em', rotate: 8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.85, delay: 0.2 + i * 0.045, ease: EASE }}
                >
                  {ch}
                </motion.span>
              )
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </h1>
  )
}

function Rotor({ words }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce || words.length < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [reduce, words.length])
  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span className="rotor" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            className="rotor-word"
            initial={{ y: '70%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-70%', opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}

const rise = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: EASE }
})

function Hero({ profile, name, interests, current }) {
  const summary = useMemo(() => plainText(profile.summary), [profile.summary])
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -46])

  return (
    <section id="top" className="hero" data-hue="violet" ref={ref}>
      <div className="wrap">
        <motion.div
          className="stage"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="hero-copy">
            {current && (
              <motion.p className="hero-kicker" {...rise(0.1)}>
                <span className="kicker-dot" />
                {current.title} · {current.organization}
              </motion.p>
            )}
            <KineticName text={name} />
            {profile.role && (
              <motion.p className="hero-role" {...rise(0.75)}>{profile.role}</motion.p>
            )}
            {interests.length > 0 && (
              <motion.p className="hero-rotor" {...rise(0.85)}>
                Interested in <Rotor words={interests} />
              </motion.p>
            )}
            {summary && <motion.p className="hero-summary" {...rise(0.95)}>{summary}</motion.p>}
            <motion.div className="hero-cta" {...rise(1.05)}>
              {profile.email && (
                <a className="btn btn-primary" href={'mailto:' + profile.email}>
                  <IconMail size={16} /> Email me
                </a>
              )}
              {profile.linkedin && (
                <a className="btn btn-ghost" href={ensureHttp(profile.linkedin)} target="_blank" rel="noreferrer noopener">
                  <IconLinkedIn size={16} /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a className="btn btn-ghost" href={ensureHttp(profile.github)} target="_blank" rel="noreferrer noopener">
                  <IconGithub size={16} /> GitHub
                </a>
              )}
            </motion.div>
            <motion.div className="hero-meta" {...rise(1.15)}>
              {profile.location && <span><IconPin size={15} /> {profile.location}</span>}
              {profile.phone && (
                <a href={'tel:' + profile.phone.replace(/[^+\d]/g, '')}><IconPhone size={15} /> {profile.phone}</a>
              )}
            </motion.div>
          </div>

          {profile.avatar?.dataUrl && (
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
            >
              <motion.div className="portrait" style={{ y: portraitY }}>
                <span className="portrait-glow" aria-hidden="true" />
                <span className="orbit" aria-hidden="true"><i /><i /><i /></span>
                <span className="portrait-ring" aria-hidden="true" />
                <span className="portrait-photo">
                  <img src={profile.avatar.dataUrl} alt={'Portrait of ' + name} />
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        <div className="stats">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.label}
              className="card stat"
              data-hue={h.hue}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.09, ease: EASE }}
              whileHover={{ y: -6 }}
            >
              <span className="stat-value">
                <CountUp to={h.value} decimals={h.decimals} prefix={h.prefix} suffix={h.suffix} />
              </span>
              <span className="stat-label">{h.label}</span>
              <span className="stat-source">{h.source}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =============================== Skills ============================ */
function Skills({ skills }) {
  const groups = useMemo(() => {
    const map = new Map()
    ;(skills || []).forEach((s) => {
      const key = s.category || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(s)
    })
    return [...map]
  }, [skills])
  if (!groups.length) return null
  return (
    <Section
      id="skills"
      hue="teal"
      ghost="Skills"
      kicker="Toolkit"
      title="Skills & Stack"
      subtitle="The languages, frameworks, and tools I work with."
    >
      <div className="skill-grid">
        {groups.map(([category, items], gi) => (
          <motion.article
            key={category}
            className="card skill-card"
            data-hue={GROUP_HUES[gi % GROUP_HUES.length]}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: (gi % 2) * 0.1, ease: EASE }}
            whileHover={{ y: -5 }}
          >
            <h3 className="skill-title"><span className="kicker-dot" /> {category}</h3>
            <motion.ul
              className="chips"
              initial="off"
              whileInView="on"
              viewport={{ once: true, margin: '-40px' }}
              variants={{ off: {}, on: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } } }}
            >
              {items.map((s) => (
                <motion.li
                  key={s.id}
                  className="chip"
                  variants={{
                    off: { opacity: 0, scale: 0.8, y: 10 },
                    on: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 22 } }
                  }}
                >
                  {s.name}
                </motion.li>
              ))}
            </motion.ul>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}

/* ===================== Timeline (Experience / Education) =========== */
function TimelineItem({ item }) {
  return (
    <motion.article
      className="tl-item"
      initial="off"
      whileInView="on"
      viewport={{ once: true, margin: '-70px' }}
    >
      <motion.span
        className="tl-node"
        aria-hidden="true"
        variants={{
          off: { scale: 0 },
          on: { scale: 1, transition: { type: 'spring', stiffness: 300, damping: 16 } }
        }}
      />
      <motion.div
        className="card tl-card"
        variants={{
          off: { opacity: 0, x: 56 },
          on: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } }
        }}
        whileHover={{ y: -5 }}
      >
        <header className="tl-head">
          <div className="tl-headings">
            <h3 className="tl-title">{item.title || 'Untitled'}</h3>
            {item.organization && (
              item.link ? (
                <a className="tl-org" href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener">
                  {item.organization.trim()} <IconArrow />
                </a>
              ) : (
                <span className="tl-org">{item.organization.trim()}</span>
              )
            )}
            <div className="tl-meta">
              {item.date && <span className="pill"><IconCalendar size={13} /> {item.date}</span>}
              {item.location && <span className="pill"><IconPin size={13} /> {item.location}</span>}
            </div>
          </div>
          {item.logo?.dataUrl && (
            <span className="tl-logo">
              <img src={item.logo.dataUrl} alt={(item.organization || '').trim() + ' logo'} />
            </span>
          )}
        </header>
        {item.description && <RichText html={item.description} />}
      </motion.div>
    </motion.article>
  )
}

function Timeline({ items, ...section }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.3 })
  if (!items?.length) return null
  return (
    <Section {...section}>
      <div className="tl" ref={ref}>
        <div className="tl-track" aria-hidden="true">
          <motion.div className="tl-fill" style={{ scaleY: fill }} />
        </div>
        {items.map((item) => <TimelineItem key={item.id} item={item} />)}
      </div>
    </Section>
  )
}

/* ============================== Projects =========================== */
function ProjectCard({ item }) {
  return (
    <motion.article
      className="card case"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
      whileHover={{ y: -6 }}
    >
      <div className="case-mark" aria-hidden="true" />
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
            aria-label={'Visit ' + item.title}
          >
            <IconArrow />
          </a>
        )}
      </div>
      <h3 className="case-title">
        {item.link ? (
          <a href={ensureHttp(item.link)} target="_blank" rel="noreferrer noopener">{item.title}</a>
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
    <Section
      id="projects"
      hue="orange"
      ghost="Projects"
      kicker="Selected Work"
      title="Projects"
      subtitle="Prototypes, systems, and things I've shipped."
    >
      <div className="case-stack">
        {items.map((p) => <ProjectCard key={p.id} item={p} />)}
      </div>
    </Section>
  )
}

/* ============================ Publications ========================= */
function classifyPub(item) {
  const t = ((item.title || '') + ' ' + (item.organization || '')).toLowerCase()
  if (t.includes('patent') || t.includes('intellectual property')) return 'Patent'
  if (t.includes('ieee')) return 'IEEE Paper'
  return 'Paper'
}
function pubLinkLabel(type, url) {
  if (type === 'Patent') return 'View patent'
  if (/ieeexplore\.ieee\.org/i.test(url)) return 'Read on IEEE Xplore'
  return 'Read paper'
}

function PubCard({ item }) {
  const type = classifyPub(item)
  const href = item.link ? ensureHttp(item.link) : ''
  return (
    <motion.article
      className="card paper"
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
      whileHover={{ y: -6 }}
    >
      <div className="paper-head">
        <div className="paper-badges">
          <span className={'badge ' + (type === 'Patent' ? 'badge-patent' : 'badge-paper')}>{type}</span>
          {item.organization && <span className="paper-org">{item.organization.trim()}</span>}
        </div>
        {href && (
          <a className="btn btn-ghost btn-sm" href={href} target="_blank" rel="noreferrer noopener">
            {pubLinkLabel(type, href)} <IconArrow />
          </a>
        )}
      </div>
      <h3 className="paper-title">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer noopener">{item.title.trim()}</a>
        ) : (
          item.title.trim()
        )}
      </h3>
      {item.description && <RichText html={item.description} />}
      {item.image?.dataUrl && (
        <div className="paper-thumb">
          <img src={item.image.dataUrl} alt={type + ' document for ' + item.title.trim()} loading="lazy" />
        </div>
      )}
    </motion.article>
  )
}

function Publications({ items }) {
  if (!items?.length) return null
  return (
    <Section
      id="publications"
      hue="pink"
      ghost="Research"
      kicker="Research"
      title="Publications & Patents"
      subtitle="Peer-reviewed papers and intellectual property."
      flip
    >
      <div className="paper-stack">
        {items.map((p) => <PubCard key={p.id} item={p} />)}
      </div>
    </Section>
  )
}

/* ============================== Awards ============================= */
function AwardCard({ item, index }) {
  return (
    <motion.article
      className="card award"
      initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: EASE }}
      whileHover={{ y: -6 }}
    >
      <span className="award-medal" aria-hidden="true"><IconAward size={22} /></span>
      <h3 className="award-title">{item.title}</h3>
      {item.description && <RichText html={item.description} />}
    </motion.article>
  )
}

function Achievements({ items }) {
  if (!items?.length) return null
  return (
    <Section
      id="achievements"
      hue="amber"
      ghost="Awards"
      kicker="Recognition"
      title="Awards & Achievements"
      subtitle="Highlights and honors along the way."
    >
      <div className="award-grid">
        {items.map((a, i) => <AwardCard key={a.id} item={a} index={i} />)}
      </div>
    </Section>
  )
}

/* ============================== Contact ============================ */
function Contact({ profile }) {
  return (
    <section id="contact" className="section contact" data-hue="violet">
      <div className="wrap">
        <motion.div
          className="contact-panel"
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span className="contact-orb orb-a" aria-hidden="true" />
          <span className="contact-orb orb-b" aria-hidden="true" />
          <span className="contact-kicker">Get in touch</span>
          <h2 className="contact-title">
            <Words text="Let's build something" delay={0.15} />
            <br />
            <Words text="worth remembering." delay={0.4} />
          </h2>
          <p className="contact-sub">
            I'm always up for conversations about machine learning, software engineering, and startups.
          </p>
          <div className="contact-actions">
            {profile.email && (
              <a className="btn btn-light btn-lg" href={'mailto:' + profile.email}>
                <IconMail size={17} /> {profile.email}
              </a>
            )}
            <a
              className="btn btn-ghost btn-lg contact-resume"
              href={RESUME_PATH}
              download={RESUME_DOWNLOAD_NAME}
            >
              <IconDownload size={17} /> Download résumé
            </a>
            <div className="contact-icons">
              {profile.linkedin && (
                <a className="ic-btn" href={ensureHttp(profile.linkedin)} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn"><IconLinkedIn /></a>
              )}
              {profile.github && (
                <a className="ic-btn" href={ensureHttp(profile.github)} target="_blank" rel="noreferrer noopener" aria-label="GitHub"><IconGithub /></a>
              )}
              {profile.phone && (
                <a className="ic-btn" href={'tel:' + profile.phone.replace(/[^+\d]/g, '')} aria-label="Phone"><IconPhone /></a>
              )}
            </div>
          </div>
        </motion.div>
        <footer className="footer">
          <span>© {new Date().getFullYear()} {profile.fullName || profile.name.trim()}</span>
          <a className="footer-resume" href={RESUME_PATH} download={RESUME_DOWNLOAD_NAME}>
            <IconDownload size={14} /> Download résumé (PDF)
          </a>
        </footer>
      </div>
    </section>
  )
}

/* ================================ App ============================== */
export default function App() {
  const profile = data.profile || {}
  const name = (profile.name || '').trim()
  const interests = useMemo(
    () => (data.skills || []).filter((s) => s.category === 'Areas of Interest').map((s) => s.name),
    []
  )
  return (
    <MotionConfig reducedMotion="user">
      <DottedSurface />
      <ScrollProgress />
      <TopBar name={name} />
      <main className="main">
        <Hero profile={profile} name={name} interests={interests} current={data.education?.[0]} />
        <Skills skills={data.skills} />
        <Timeline
          id="experience"
          hue="blue"
          ghost="Experience"
          kicker="Journey"
          title="Experience"
          subtitle="Where I've contributed."
          items={data.experience}
          flip
        />
        <Timeline
          id="education"
          hue="green"
          ghost="Education"
          kicker="Learning"
          title="Education"
          subtitle="Programs and degrees."
          items={data.education}
        />
        <Projects items={data.projects} />
        <Publications items={data.publications} />
        <Achievements items={data.achievements} />
        <Contact profile={profile} />
      </main>
      <Dock />
    </MotionConfig>
  )
}
