'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Instagram, ArrowUpRight, Sparkles, Copy, Share2, Check } from 'lucide-react'

const INSTAGRAM_URL = 'https://www.instagram.com/thinkovr?utm_source=qr&igsh=bWxyeHcyemNtNjJp'

export function MotionFooter({ supportEmail = 'zmanschoeman@gmail.com' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.15, once: true })
  const [copied, setCopied] = useState(false)

  const letters = 'THINKOVR'.split('')

  const copyLink = () => {
    navigator.clipboard.writeText(INSTAGRAM_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Thinkovr on Instagram', url: INSTAGRAM_URL })
    } else {
      copyLink()
    }
  }

  return (
    <footer ref={ref} className="relative bg-gradient-to-b from-[#0a0a0b] to-[#050506] border-t border-[rgba(201,168,76,0.25)] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent 60%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pt-24 pb-10">
        {/* Giant brand name */}
        <div className="mb-16 md:mb-24">
          <div className="font-display font-light text-[18vw] md:text-[13rem] leading-[0.85] tracking-tight flex flex-wrap">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 80, rotateX: -40 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
                style={{
                  background: i % 2 === 0 ? 'linear-gradient(180deg, #f0e8d4 0%, #c9a84c 70%, #8a7535 100%)' : 'transparent',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: i % 2 === 0 ? 'transparent' : 'transparent',
                  WebkitTextStroke: i % 2 === 1 ? '1.2px #c9a84c' : 'none',
                  color: 'transparent',
                }}
              >
                {l}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="h-px origin-left bg-gradient-to-r from-[#c9a84c] via-[#b87333] to-transparent mt-6"
          />
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 mb-16">
          <div className="md:col-span-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-serif italic text-xl md:text-2xl leading-[1.4] text-[#f0e8d4]/85"
            >
              We don't give you options.<br />We give you the <span className="text-[#c9a84c]">move.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.55 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/auth" className="btn btn-primary !py-3 !px-6 !text-[11px]">
                <Sparkles size={13} /> Enter Thinkovr
              </Link>
              <a href={`mailto:${supportEmail}`} className="btn btn-ghost !py-3 !px-6 !text-[11px]">
                <Mail size={12} /> Contact
              </a>
            </motion.div>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-5">Navigate</div>
            <ul className="space-y-3 font-serif text-[17px] text-[#f0e8d4]/80">
              {[['Manifesto', '/#manifesto'], ['The Engine', '/#engine'], ['Blueprint Tiers', '/#tiers'], ['Anti-Portfolio', '/#anti-portfolio'], ['Enter Protocol', '/auth']].map(([l, h], i) => (
                <motion.li key={l}
                  initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.06 }}
                >
                  <Link href={h} className="group inline-flex items-center gap-2 transition hover:text-[#c9a84c]">
                    {l}
                    <ArrowUpRight size={13} className="opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Instagram + QR */}
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-5">Follow The Engine</div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex gap-6 items-start"
            >
              {/* QR Code */}
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
                  Scan the code or tap to follow us on Instagram for engine updates, rejected blueprints & more.
                </p>
                {/* Copy + Share buttons */}
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
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-6"
            >
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-3 font-serif text-lg text-[#f0e8d4]/90 hover:text-[#c9a84c] transition break-all"
              >
                <Mail size={16} className="text-[#c9a84c] flex-shrink-0" /> {supportEmail}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom band */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.1 }}
          className="border-t border-[rgba(201,168,76,0.18)] pt-6 flex flex-col md:flex-row gap-4 justify-between items-center"
        >
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50">⬡ The Thinkovr Engine — Est. 2026</div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50 hidden md:inline">© 2026 — One Move, Zero Fluff</span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a9c4a] shadow-[0_0_8px_#4a9c4a]" /> Engine Online
            </span>
          </div>
          {/* Developed by XMQA */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.3 }}
            className="flex items-center gap-2"
          >
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#f0e8d4]/35">Developed by</span>
            <img src="/xmqa-logo.png" alt="XMQA" className="h-5 w-auto opacity-50 hover:opacity-80 transition" style={{ filter: 'invert(1) brightness(0.7)' }} />
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#f0e8d4]/35">XMQA</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export default MotionFooter
