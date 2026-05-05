'use client'

import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'
import { Mail, Instagram, ArrowUpRight, Sparkles, Copy, Share2, Check } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   motion-footer.jsx — zero framer-motion
   Giant THINKOVR reveal + staggered nav + gold line sweep
   Pure CSS keyframes + IntersectionObserver
   ───────────────────────────────────────────────────────────── */

const FOOTER_STYLES = `
@keyframes letter-vault {
  from { opacity: 0; transform: translateY(80px) rotateX(-40deg); }
  to   { opacity: 1; transform: translateY(0)    rotateX(0deg); }
}
@keyframes line-sweep {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulse-dot {
  0%,100% { box-shadow: 0 0 8px #4a9c4a; opacity: 1; }
  50%      { box-shadow: 0 0 16px #4a9c4a, 0 0 32px #4a9c4a44; opacity: 0.7; }
}
@keyframes gold-glow-in {
  from { opacity: 0; text-shadow: 0 0 0px transparent; }
  to   { opacity: 1; text-shadow: 0 0 40px rgba(201,168,76,0.3); }
}
.footer-link-arrow {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}
.footer-nav-item:hover .footer-link-arrow {
  opacity: 1;
  transform: translateX(0);
}
.footer-nav-item { transition: color 0.2s; }
.footer-nav-item:hover { color: #c9a84c; }
`

const INSTAGRAM_URL = 'https://www.instagram.com/thinkovr?utm_source=qr&igsh=bWxyeHcyemNtNjJp'

function useIntersect(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

const LETTERS = 'THINKOVR'.split('')
const NAV_LINKS = [
  ['Manifesto',       '/#manifesto'],
  ['The Engine',      '/#engine'],
  ['Blueprint Tiers', '/#tiers'],
  ['Anti-Portfolio',  '/#anti-portfolio'],
  ['Enter Protocol',  '/auth'],
]

export function MotionFooter({ supportEmail = 'zmanschoeman@gmail.com' }) {
  const [ref, visible] = useIntersect(0.08)
  const [copied, setCopied] = useState(false)

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(INSTAGRAM_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const shareLink = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Thinkovr on Instagram', url: INSTAGRAM_URL })
    } else {
      copyLink()
    }
  }, [copyLink])

  /* animation helpers */
  const anim = (keyframe, delay, extra = '') =>
    visible ? `${keyframe} ${extra} ${delay}s forwards` : 'none'

  return (
    <>
      <style>{FOOTER_STYLES}</style>

      <footer
        ref={ref}
        className="relative bg-gradient-to-b from-[#0a0a0b] to-[#050506] border-t border-[rgba(201,168,76,0.25)] overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent 60%)', filter: 'blur(60px)' }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-10">

          {/* ── Giant THINKOVR ── */}
          <div className="mb-16 md:mb-24">
            <div
              className="font-display font-light leading-[0.85] tracking-tight flex flex-wrap"
              style={{ fontSize: 'clamp(13vw, 18vw, 13rem)', perspectiveOrigin: 'center bottom', perspective: '600px' }}
            >
              {LETTERS.map((l, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    opacity: 0,
                    animation: anim('letter-vault', (0.04 + i * 0.06).toFixed(2), '0.9s cubic-bezier(0.16,1,0.3,1)'),
                    background: i % 2 === 0
                      ? 'linear-gradient(180deg, #f0e8d4 0%, #c9a84c 70%, #8a7535 100%)'
                      : 'none',
                    WebkitBackgroundClip: i % 2 === 0 ? 'text' : undefined,
                    backgroundClip:       i % 2 === 0 ? 'text' : undefined,
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: i % 2 === 1 ? '1.2px #c9a84c' : 'none',
                    color: 'transparent',
                  }}
                >
                  {l}
                </span>
              ))}
            </div>

            {/* Gold sweep line */}
            <div
              className="h-px origin-left bg-gradient-to-r from-[#c9a84c] via-[#b87333] to-transparent mt-6"
              style={{
                transform: 'scaleX(0)',
                opacity: 0,
                animation: anim('line-sweep', '0.7', '1.5s cubic-bezier(0.16,1,0.3,1)'),
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* ── Content grid ── */}
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 mb-16">

            {/* Col 1 — tagline + CTA */}
            <div className="md:col-span-4">
              <p
                className="font-serif italic text-xl md:text-2xl leading-[1.4] text-[#f0e8d4]/85"
                style={{ opacity: 0, animation: anim('fade-in-up', '0.4', '1s ease-out') }}
              >
                We don&apos;t give you options.<br />
                We give you the <span className="text-[#c9a84c]">move.</span>
              </p>
              <div
                className="mt-8 flex flex-wrap items-center gap-3"
                style={{ opacity: 0, animation: anim('fade-in-up', '0.55', '1s ease-out') }}
              >
                <Link href="/auth" className="btn btn-primary !py-3 !px-6 !text-[11px]">
                  <Sparkles size={13} /> Enter Thinkovr
                </Link>
                <a href={`mailto:${supportEmail}`} className="btn btn-ghost !py-3 !px-6 !text-[11px]">
                  <Mail size={12} /> Contact
                </a>
              </div>
            </div>

            {/* Col 2 — nav */}
            <div className="md:col-span-3">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-5">Navigate</div>
              <ul className="space-y-3 font-serif text-[17px] text-[#f0e8d4]/80">
                {NAV_LINKS.map(([label, href], i) => (
                  <li
                    key={label}
                    style={{
                      opacity: 0,
                      animation: anim('slide-in-left', (0.5 + i * 0.06).toFixed(2), '0.6s ease-out'),
                    }}
                  >
                    <Link
                      href={href}
                      className="footer-nav-item group inline-flex items-center gap-2"
                    >
                      {label}
                      <ArrowUpRight size={13} className="footer-link-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Instagram + QR */}
            <div className="md:col-span-5">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-5">Follow The Engine</div>
              <div
                className="flex gap-6 items-start"
                style={{ opacity: 0, animation: anim('fade-in-up', '0.65', '0.8s ease-out') }}
              >
                <div className="flex-shrink-0">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <img
                      src="/instagram-qr.jpg"
                      alt="Instagram QR Code @THINKOVR"
                      className="w-28 h-28 object-contain border border-[rgba(201,168,76,0.3)] p-1 hover:border-[#c9a84c] transition"
                      style={{ background: '#fff' }}
                    />
                  </a>
                </div>
                <div className="flex-1">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-display text-xl text-[#f0e8d4] hover:text-[#c9a84c] transition mb-2"
                  >
                    <Instagram size={18} className="text-[#c9a84c]" />
                    @THINKOVR
                  </a>
                  <p className="font-serif text-[13px] text-[#f0e8d4]/55 mb-4 leading-relaxed">
                    Scan the code or tap to follow us on Instagram for engine updates, rejected blueprints &amp; more.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={copyLink}
                      className="flex items-center gap-2 px-3 py-2 border border-[rgba(201,168,76,0.3)] hover:border-[#c9a84c] font-mono text-[9px] tracking-[0.2em] uppercase text-[#f0e8d4]/70 hover:text-[#c9a84c] transition"
                    >
                      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy Link</>}
                    </button>
                    <button
                      onClick={shareLink}
                      className="flex items-center gap-2 px-3 py-2 border border-[rgba(201,168,76,0.3)] hover:border-[#c9a84c] font-mono text-[9px] tracking-[0.2em] uppercase text-[#f0e8d4]/70 hover:text-[#c9a84c] transition"
                    >
                      <Share2 size={11} /> Share
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="mt-6"
                style={{ opacity: 0, animation: anim('fade-in-up', '0.85', '0.8s ease-out') }}
              >
                <a
                  href={`mailto:${supportEmail}`}
                  className="inline-flex items-center gap-3 font-serif text-lg text-[#f0e8d4]/90 hover:text-[#c9a84c] transition break-all"
                >
                  <Mail size={16} className="text-[#c9a84c] flex-shrink-0" />
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom band ── */}
          <div
            className="border-t border-[rgba(201,168,76,0.18)] pt-6 flex flex-col md:flex-row gap-4 justify-between items-center"
            style={{ opacity: 0, animation: anim('fade-in', '1.1', '1s ease-out') }}
          >
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50">
              ⬡ The Thinkovr Engine — Est. 2026
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50 hidden md:inline">
                © 2026 — One Move, Zero Fluff
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50 flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#4a9c4a]"
                  style={{ animation: 'pulse-dot 2.5s ease-in-out infinite' }}
                />
                Engine Online
              </span>
            </div>
            <div
              className="flex items-center gap-2"
              style={{ opacity: 0, animation: anim('fade-in', '1.3', '1s ease-out') }}
            >
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#f0e8d4]/35">Developed by</span>
              <img
                src="/xmqa-logo.png"
                alt="XMQA"
                className="h-5 w-auto opacity-50 hover:opacity-80 transition"
                style={{ filter: 'invert(1) brightness(0.7)' }}
              />
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#f0e8d4]/35">XMQA</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default MotionFooter
