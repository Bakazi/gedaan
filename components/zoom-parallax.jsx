'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────
   ALL ANIMATIONS: pure CSS keyframes + transitions
   NO framer-motion. No eval(). No CSP issues.
   ───────────────────────────────────────────── */

const STYLES = `
@keyframes hg-float-left {
  0%,100% { transform: translate(0px, 0px) rotate(-18deg); }
  25%      { transform: translate(-18px, -10px) rotate(-21deg); }
  50%      { transform: translate(6px, 4px) rotate(-15deg); }
  75%      { transform: translate(-12px, -6px) rotate(-20deg); }
}
@keyframes hg-float-right {
  0%,100% { transform: translate(0px, 0px) rotate(18deg); }
  25%      { transform: translate(18px, -10px) rotate(21deg); }
  50%      { transform: translate(-6px, 4px) rotate(15deg); }
  75%      { transform: translate(12px, -6px) rotate(20deg); }
}
@keyframes hg-drip {
  0%,100% { opacity: 1; transform: scaleY(1); }
  50%      { opacity: 0.1; transform: scaleY(0.7); }
}
@keyframes hg-orb {
  0%,100% { opacity: 0.8; r: 3.5; }
  50%      { opacity: 1; r: 4.5; }
}
@keyframes sand-drain {
  0%   { opacity: 0.3; }
  50%  { opacity: 0.15; }
  100% { opacity: 0.3; }
}
@keyframes ripple-out {
  from { r: 10; opacity: 0.9; }
  to   { r: 55; opacity: 0; }
}
@keyframes chevron-fade {
  0%,100% { opacity: 0; }
  50%      { opacity: 1; }
}
@keyframes chevron-bob {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(5px); }
}
@keyframes gold-shift {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@keyframes card-enter {
  from { opacity: 0; transform: perspective(1000px) rotateX(20deg) scale(1.05); }
  to   { opacity: 1; transform: perspective(1000px) rotateX(0deg) scale(1); }
}
@keyframes section-reveal {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hg-left  { animation: hg-float-left  7s ease-in-out infinite; }
.hg-right { animation: hg-float-right 7s ease-in-out infinite; }

.hg-left:hover  { animation: none; transform: translate(-4px, -6px) rotate(-26deg) scale(1.08); transition: transform 0.3s ease; }
.hg-right:hover { animation: none; transform: translate(4px, -6px) rotate(26deg) scale(1.08); transition: transform 0.3s ease; }
.hg-left:active, .hg-right:active { transform: scale(0.94) !important; }

.hg-drip { animation: hg-drip 1.2s ease-in-out infinite; transform-origin: center; }

.chevron-arrow { animation: chevron-fade 3s ease-in-out infinite 1.5s, chevron-bob 2s ease-in-out infinite; }
.chevron-arrow:nth-child(2) { animation-delay: 1.8s, 0.3s; }
.chevron-arrow:nth-child(3) { animation-delay: 2.1s, 0.6s; }

.gold-text {
  background: linear-gradient(90deg, #e5c968, #c9a84c, #b87333, #c9a84c, #e5c968);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gold-shift 4s ease-in-out infinite;
}
.gold-text-delayed { animation-delay: 0.5s; }

.card-3d-enter { animation: card-enter 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
.section-reveal { animation: section-reveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
.section-reveal-delay { animation-delay: 0.15s; }
`

/* ─── SVG HOURGLASS ─── */
function Hourglass({ side = 'left' }) {
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const glow = hovered ? '#e5c968' : '#c9a84c'
  const id = side

  const handleClick = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 650)
  }, [])

  return (
    <div
      className={`cursor-pointer select-none hg-${side}`}
      style={{ width: 'min(22vw, 180px)', height: 'min(36vw, 290px)', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
      onClick={handleClick}
    >
      <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 32px rgba(201,168,76,0.3))' }}
      >
        <defs>
          <linearGradient id={`hg-g-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={glow} stopOpacity="1"/>
            <stop offset="40%" stopColor={glow} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={glow} stopOpacity="0.9"/>
          </linearGradient>
          <filter id={`hg-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={hovered ? '6' : '3'} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id={`hg-outer-${id}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={hovered ? '12' : '6'} result="blur"/>
            <feMerge><feMergeNode in="blur"/></feMerge>
          </filter>
          <clipPath id={`hg-clip-top-${id}`}>
            <path d="M14 8 Q50 72 50 72 Q50 72 86 8 Z"/>
          </clipPath>
        </defs>

        <ellipse cx="50" cy="80" rx="48" ry="78" fill={glow}
          opacity={hovered ? '0.12' : '0.05'}
          filter={`url(#hg-outer-${id})`}/>

        <rect x="8" y="4" width="84" height="8" rx="4" fill={glow} opacity="0.95" filter={`url(#hg-glow-${id})`}/>
        <rect x="8" y="148" width="84" height="8" rx="4" fill={glow} opacity="0.95" filter={`url(#hg-glow-${id})`}/>

        <line x1="14" y1="12" x2="50" y2="72" stroke={glow} strokeWidth="2" strokeOpacity="0.8"/>
        <line x1="86" y1="12" x2="50" y2="72" stroke={glow} strokeWidth="2" strokeOpacity="0.8"/>
        <line x1="14" y1="148" x2="50" y2="88" stroke={glow} strokeWidth="2" strokeOpacity="0.8"/>
        <line x1="86" y1="148" x2="50" y2="88" stroke={glow} strokeWidth="2" strokeOpacity="0.8"/>

        {/* Top sand */}
        <path d="M18 12 Q50 68 50 68 Q50 68 82 12 Z"
          fill={`url(#hg-g-${id})`}
          style={{ animation: 'sand-drain 3s ease-in-out infinite', opacity: 0.3 }}
          clipPath={`url(#hg-clip-top-${id})`}/>
        <path d="M18 12 Q50 50 50 50 Q50 50 82 12 Z"
          fill={glow} opacity="0.18"
          clipPath={`url(#hg-clip-top-${id})`}/>

        {/* Bottom sand */}
        <path d="M16 148 Q50 92 50 92 Q50 92 84 148 Z" fill={glow} opacity={hovered ? '0.55' : '0.4'}
          style={{ transition: 'opacity 0.3s' }}/>
        <path d="M22 148 Q50 105 50 105 Q50 105 78 148 Z" fill={glow} opacity="0.25"/>

        {/* Drip */}
        <line x1="50" y1="72" x2="50" y2="88"
          stroke={glow} strokeWidth="2.5" strokeLinecap="round"
          className="hg-drip"/>

        {/* Center orb */}
        <circle cx="50" cy="80" r={hovered ? '5' : '3.5'}
          fill={glow} filter={`url(#hg-glow-${id})`}
          style={{ transition: 'r 0.3s', animation: 'hg-orb 2s ease-in-out infinite' }}/>

        {/* Click ripple — CSS animation triggered by key change */}
        {clicked && (
          <circle key={Date.now()} cx="50" cy="80" r="10"
            stroke={glow} strokeWidth="1.5" fill="none"
            style={{ animation: 'ripple-out 0.65s ease-out forwards' }}/>
        )}

        <rect x="6" y="2" width="88" height="156" rx="5"
          stroke={glow} strokeWidth="1"
          strokeOpacity={hovered ? '0.6' : '0.3'} fill="none"
          style={{ transition: 'stroke-opacity 0.3s' }}/>
      </svg>
    </div>
  )
}

/* ─── SCROLL CHEVRONS ─── */
function ScrollArrow() {
  return (
    <div className="flex flex-col items-center gap-1 mt-10 pointer-events-none select-none"
      style={{ animation: 'chevron-fade 3s ease-in-out infinite 1.5s', opacity: 0 }}
    >
      <span className="font-mono text-[9px] tracking-[0.35em] uppercase mb-3"
        style={{ color: 'rgba(201,168,76,0.6)' }}>
        Continue
      </span>
      {[0, 1, 2].map(i => (
        <svg key={i} width="36" height="20" viewBox="0 0 36 20"
          className="chevron-arrow"
          style={{ animationDelay: `${i * 0.3}s`, opacity: 0 }}
        >
          <defs>
            <filter id="cglow">
              <feGaussianBlur stdDeviation="2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polyline points="4,4 18,16 32,4" fill="none" stroke="#c9a84c"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cglow)"/>
        </svg>
      ))}
      <span className="font-serif italic mt-2"
        style={{ fontSize: '11px', color: 'rgba(201,168,76,0.5)' }}>
        Keep going — the engine stirs below.
      </span>
    </div>
  )
}

/* ─── SCROLL-DRIVEN 3D CARD ─── */
function ScrollCard({ children }) {
  const cardRef = useRef(null)
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const onScroll = () => {
      const rect = card.getBoundingClientRect()
      const vh = window.innerHeight
      // 1 at top of viewport → 0 when centered → past bottom ignored
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      const rotateX = 20 - progress * 20      // 20deg → 0deg
      const scale   = 1.05 - progress * 0.05  // 1.05 → 1
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${scale})`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
      <div
        ref={cardRef}
        className="max-w-5xl -mt-12 mx-auto w-full"
        style={{
          height: 'clamp(28rem, 46vw, 46rem)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '24px',
          background: '#0d0d0e',
          boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{
          height: '100%', width: '100%', overflow: 'hidden',
          borderRadius: '20px', background: '#0a0a0b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Gold grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
            backgroundImage:
              'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}/>
          {/* Corner accents */}
          {[['top-4 left-4','border-t border-l'],['top-4 right-4','border-t border-r'],
            ['bottom-4 left-4','border-b border-l'],['bottom-4 right-4','border-b border-r']].map(([pos, cls]) => (
            <div key={pos} className={`absolute ${pos} w-8 h-8 ${cls}`}
              style={{ borderColor: 'rgba(201,168,76,0.3)' }}/>
          ))}
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── MOUSE PARALLAX WRAPPER ─── */
function MouseParallax({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handle = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const x = ((e.clientX - cx) / cx) * 8
      const y = ((e.clientY - cy) / cy) * 6
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return (
    <div ref={ref} style={{ transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 'clamp(2rem, 4vw, 4rem)', width: '100%', height: '100%', padding: '1rem',
    }}>
      {children}
    </div>
  )
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ visible }) {
  return (
    <div className="max-w-5xl mx-auto text-center mb-4"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
        style={{ color: '#c9a84c' }}>
        ⬡ The Parameters We Respect
      </div>
      <h2 className="font-display font-light leading-[1.05] text-[#f0e8d4]"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
        Every directive starts with{' '}
        <em className="gold-text not-italic">honesty.</em>
      </h2>
      <p className="font-serif italic text-[#f0e8d4]/55 mt-4 max-w-xl mx-auto"
        style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
        Before a single word is written, your blueprint passes through five
        reality filters — capital, time, skill, geography, fear.
      </p>
    </div>
  )
}

/* ─── MAIN EXPORT ─── */
export function ZoomParallax() {
  const wrapRef = useRef(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{STYLES}</style>
      <div
        ref={wrapRef}
        className="flex items-center justify-center relative bg-[#0a0a0b]"
        style={{
          minHeight: 'clamp(52rem, 80vh, 80rem)',
          padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 3vw, 3rem)',
        }}
      >
        <div className="w-full relative" style={{ perspective: '1000px' }}>
          <SectionHeader visible={headerVisible} />
          <ScrollCard>
            <MouseParallax>
              <Hourglass side="left" />

              <div className="flex-shrink-0 text-center" style={{ maxWidth: 'clamp(180px, 30vw, 340px)' }}>
                <h3 className="font-display font-light text-[#f0e8d4] leading-[1.0]"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 2.8rem)' }}>
                  Capital. Time. Skill.
                </h3>
                <em className="block font-serif not-italic gold-text gold-text-delayed mt-2"
                  style={{ fontSize: 'clamp(1rem, 2.5vw, 2.2rem)' }}>
                  Geography. Fear.
                </em>
                <p className="font-serif italic text-[#f0e8d4]/55 mt-3"
                  style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)' }}>
                  Your five real constraints.<br />Our single deliverable.
                </p>
                <ScrollArrow />
              </div>

              <Hourglass side="right" />
            </MouseParallax>
          </ScrollCard>
        </div>
      </div>
    </>
  )
}

export default ZoomParallax
