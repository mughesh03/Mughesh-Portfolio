import React from 'react'
import { createRoot } from 'react-dom/client'
import { motion } from 'framer-motion'
import data from './data.json'
import './styles.css'


const ensureHttp = (value) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  if (/^mailto:|^tel:/i.test(value)) return value
  return 'https://' + value
}

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.07c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.17 1.18a10.96 10.96 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.78.12 3.07.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/>
  </svg>
)
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/></svg>
)
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.91.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
)
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>
)
const ChevronIcon = () => (
  <svg className="acc-toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6"/></svg>
)

function ContactRow({ profile }) {
  const items = []
  if (profile.email) items.push({ key: 'email', value: profile.email, href: 'mailto:' + profile.email, type: 'text', icon: <MailIcon /> })
  if (profile.phone) items.push({ key: 'phone', value: profile.phone, href: 'tel:' + profile.phone, type: 'text', icon: <PhoneIcon /> })
  if (profile.location) items.push({ key: 'location', value: profile.location, href: '', type: 'text', icon: <PinIcon /> })
  if (profile.website) items.push({ key: 'website', value: profile.website, href: ensureHttp(profile.website), type: 'text', icon: <GlobeIcon /> })
  if (profile.github) items.push({ key: 'github', value: profile.github, href: ensureHttp(profile.github), type: 'icon', icon: <GithubIcon /> })
  if (profile.linkedin) items.push({ key: 'linkedin', value: profile.linkedin, href: ensureHttp(profile.linkedin), type: 'icon', icon: <LinkedInIcon /> })
  if (!items.length) return null
  return (
    <div className="contact-row">
      {items.map(item => {
        if (item.type === 'icon') {
          return item.href
            ? <a key={item.key} href={item.href} target="_blank" rel="noreferrer noopener" aria-label={item.key} title={item.value} className="contact-icon">{item.icon}</a>
            : <span key={item.key} className="contact-icon" title={item.value}>{item.icon}</span>
        }
        return item.href
          ? <a key={item.key} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener">{item.icon}<span>{item.value}</span></a>
          : <span key={item.key}>{item.icon}<span>{item.value}</span></span>
      })}
    </div>
  )
}

function LinkedTitle({ link, className, children }) {
  if (link && link.trim()) {
    return <a className={'linked-title ' + (className || '')} href={ensureHttp(link)} target="_blank" rel="noreferrer noopener">{children}</a>
  }
  return <span className={className}>{children}</span>
}

function CredentialCard({ item, shape }) {
  return (
    <article className="credential-card">
      <div className="credential-body">
        <LinkedTitle link={item.link} className="credential-title">{item.title}</LinkedTitle>
        {item.organization && <strong>{item.organization}</strong>}
        {item.location && <em>{item.location}</em>}
        {item.description && <p className="credential-desc">{item.description}</p>}
      </div>
      <div className="credential-side">
        {item.logo && item.logo.dataUrl
          ? <img className={'credential-logo ' + (shape || 'rounded')} src={item.logo.dataUrl} alt="" />
          : null}
        {item.date && <span className="credential-date">{item.date}</span>}
      </div>
    </article>
  )
}

function AccordionList({ items }) {
  return (
    <div className="accordion">
      {items.map((item, idx) => (
        <details key={item.id} className="acc-item" open={idx === 0}>
          <summary className="acc-head">
            <span className="acc-title">
              <LinkedTitle link={item.link}>{item.title || 'Untitled'}</LinkedTitle>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              {item.date && <span className="acc-date">{item.date}</span>}
              <ChevronIcon />
            </span>
          </summary>
          <div className="acc-body">
            {item.image && item.image.dataUrl && (
              <div className="acc-media"><img src={item.image.dataUrl} alt="" loading="lazy" /></div>
            )}
            {item.description && <p>{item.description}</p>}
          </div>
        </details>
      ))}
    </div>
  )
}


const accordionSectionsList = [
  ['Projects', data.projects || []],
  ['Certifications', data.certifications || []],
  ['Achievements', data.achievements || []],
  ['Publications', data.publications || []],
]

function App() {
  const shape = 'rounded'
  return (
    <main>
      <motion.section className="hero" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
        <div>
          <span className="pill">Available for new work</span>
          <h1>{data.profile.name}</h1>
          <h2>{data.profile.role}</h2>
          <p>{data.profile.summary}</p>
          <ContactRow profile={data.profile} />
        </div>
        {data.profile.avatar && <img src={data.profile.avatar.dataUrl} alt={data.profile.name}/>}
      </motion.section>
      <section className="section"><h3>Skills</h3><div className="skills">{data.skills.map(s => <span key={s.id}>{s.name}</span>)}</div></section>
      {data.experience && data.experience.length > 0 && (
        <section className="section"><h3>Experience</h3><div className="credentials">{data.experience.map(item => <CredentialCard key={item.id} item={item} shape={shape} />)}</div></section>
      )}
      {data.education && data.education.length > 0 && (
        <section className="section"><h3>Education</h3><div className="credentials">{data.education.map(item => <CredentialCard key={item.id} item={item} shape={shape} />)}</div></section>
      )}
      {accordionSectionsList.map(([title, items]) => items.length > 0 && (
        <section className="section" key={title}><h3>{title}</h3><AccordionList items={items} /></section>
      ))}
    </main>
  )
}
createRoot(document.getElementById('root')).render(<App/>)
