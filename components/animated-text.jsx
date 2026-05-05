'use client'

import { useRef, useEffect, useState } from 'react'

/* ─────────────────────────────────────────────────────────────
   animated-text.jsx — zero framer-motion
   All effects via CSS @keyframes + IntersectionObserver
   ───────────────────────────────────────────────────────────── */

const ANIM_STYLES = `
@keyframes word-rise {
  from { opacity: 0; transform: translateY(14px); filter: blur(6px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
}
@keyframes char-rise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-up-blur {
  from { opacity: 0; transform: translateY(30px); filter: blur(8px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
}
`

function useIntersect(opts = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: opts.amount ?? 0.15, ...opts })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

let _stylesInjected = false
function injectStyles() {
  if (_stylesInjected || typeof document === 'undefined') return
  const tag = document.createElement('style')
  tag.textContent = ANIM_STYLES
  document.head.appendChild(tag)
  _stylesInjected = true
}

/* ── Word-by-word fade-in with blur ── */
export function FadeWords({
  text,
  className = '',
  delay = 0,
  stagger = 0.06,
  el: Element = 'span',
}) {
  injectStyles()
  const [ref, visible] = useIntersect({ amount: 0.2 })
  const words = text.split(' ')

  return (
    <Element ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            marginRight: '0.25em',
            opacity: 0,
            animation: visible
              ? `word-rise 0.85s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}s forwards`
              : 'none',
          }}
        >
          {w}
        </span>
      ))}
    </Element>
  )
}

/* ── Character-by-character rise ── */
export function FadeChars({
  text,
  className = '',
  delay = 0,
  stagger = 0.02,
}) {
  injectStyles()
  const [ref, visible] = useIntersect({ amount: 0.2 })

  return (
    <span ref={ref} className={className}>
      {text.split('').map((c, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: 0,
            animation: visible
              ? `char-rise 0.6s cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}s forwards`
              : 'none',
          }}
        >
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  )
}

/* ── Generic reveal-in container ── */
export function FadeUp({
  children,
  delay = 0,
  duration = 0.9,
  className = '',
}) {
  injectStyles()
  const [ref, visible] = useIntersect({ amount: 0.15 })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        animation: visible
          ? `fade-up-blur ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards`
          : 'none',
      }}
    >
      {children}
    </div>
  )
}
