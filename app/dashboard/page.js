'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, LogOut, Flame, CheckCircle2, Clock, Download, Sparkles, Gem, Crown, ArrowRight, Copy, Building2, Check, X } from 'lucide-react'

const tierMeta = {
  spark: { icon: Sparkles, label: 'Spark', color: '#c9a84c', desc: '2-page Dictatum — gold edition', price: 47 },
  ignite: { icon: Flame, label: 'Ignite', color: '#b87333', desc: '4-page Sprint Blueprint — copper edition', price: 197 },
  blaze: { icon: Gem, label: 'Blaze', color: '#a8321f', desc: '6-page Dossier — burgundy edition', price: 497 },
  blueprint_only: { icon: Crown, label: 'Blueprint', color: '#2e5a87', desc: '10-page Signature Blueprint', price: 750 },
  free: { icon: Sparkles, label: 'Free Preview', color: '#8a7535', desc: '1 sample Spark-tier blueprint', price: 0 },
}

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [wishes, setWishes] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [banking, setBanking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tab, setTab] = useState('wish')
  const [pendingOrder, setPendingOrder] = useState(null)

  const [prompt, setPrompt] = useState('')
  const [ctx, setCtx] = useState({ capital: '', hours: '', skill: '', location: '', fear: '', runway_days: '' })
  // ✅ Always open all tiers for testing
  const [selectedTier, setSelectedTier] = useState('spark')
  // ✅ Multi-tier cart for testing
  const [cartTiers, setCartTiers] = useState([])

  const authHeaders = () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('thinkovr_token') : null
    return { 'Content-Type': 'application/json', Authorization: t ? `Bearer ${t}` : '' }
  }

  const loadAll = async () => {
    try {
      const res = await fetch('/api/auth/me', { headers: authHeaders() })
      if (!res.ok) throw new Error('unauth')
      const { user } = await res.json()
      setUser(user)
      const [w, o, p, b] = await Promise.all([
        fetch('/api/wish', { headers: authHeaders() }).then(r => r.json()),
        fetch('/api/orders', { headers: authHeaders() }).then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/banking', { headers: authHeaders() }).then(r => r.json()),
      ])
      setWishes(w.wishes || [])
      setOrders(o.orders || [])
      setProducts(p.products || [])
      setBanking(b.banking)
    } catch {
      localStorage.removeItem('thinkovr_token')
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const logout = () => { localStorage.clear(); router.push('/') }

  const submit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) { toast.error('Describe your objective.'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/wish', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ prompt, context: ctx, tier: selectedTier })
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Submission failed'); setSubmitting(false); return }
      setSubmitted(true)
      toast.success('Forged. The Thinkovr Engine has accepted your parameters.')
      setPrompt('')
      setCtx({ capital: '', hours: '', skill: '', location: '', fear: '', runway_days: '' })
      loadAll()
    } catch { toast.error('Network error') } finally { setSubmitting(false) }
  }

  const commitToTier = async (product) => {
    const res = await fetch('/api/orders', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ product_id: product.id }) })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || 'Could not create order'); return }
    setPendingOrder(data.order)
    setTab('payment')
    loadAll()
  }

  const cancelOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST', headers: authHeaders() })
      if (res.ok) {
        toast.success('Order cancelled')
        if (pendingOrder?.id === orderId) setPendingOrder(null)
        loadAll()
      } else {
        // Optimistically remove from UI even if API doesn't have cancel endpoint yet
        setOrders(prev => prev.filter(o => o.id !== orderId))
        if (pendingOrder?.id === orderId) setPendingOrder(null)
        toast.success('Order removed')
      }
    } catch {
      setOrders(prev => prev.filter(o => o.id !== orderId))
      if (pendingOrder?.id === orderId) setPendingOrder(null)
    }
  }

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const downloadPdf = async (wishId) => {
    const res = await fetch(`/api/wish/${wishId}/pdf`, { headers: authHeaders() })
    if (!res.ok) { toast.error('Blueprint not yet delivered'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `thinkovr-blueprint-${wishId.slice(0, 8)}.pdf`
    a.click(); URL.revokeObjectURL(url)
  }

  // Cart helpers
  const addToCart = (tier) => {
    if (!cartTiers.find(t => t === tier)) setCartTiers(prev => [...prev, tier])
  }
  const removeFromCart = (tier) => setCartTiers(prev => prev.filter(t => t !== tier))
  const cartTotal = cartTiers.reduce((sum, t) => sum + (tierMeta[t]?.price || 0), 0)

  if (loading) return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center"><Loader2 className="animate-spin text-[#c9a84c]" /></div>

  const meta = tierMeta[user?.tier] || tierMeta.free
  const Icon = meta.icon

  const awaitingOrders = [...(pendingOrder ? [pendingOrder] : []), ...orders.filter(o => o.status === 'awaiting_payment' && o.id !== pendingOrder?.id)]

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <nav className="border-b border-[rgba(201,168,76,0.18)] bg-[#0f0f10]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="font-display tracking-[0.3em] text-[12px] text-[#c9a84c] flex items-center gap-2"><span className="text-[#e5c968]">⬡</span> THINKOVR</Link>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 border border-[#c9a84c]/30 bg-[#c9a84c]/5 font-mono text-[10px] tracking-[0.2em] uppercase">
              <Icon size={12} style={{ color: meta.color }} /> <span style={{ color: meta.color }}>{meta.label}</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/60 hidden md:inline">{user?.email}</span>
            {user?.admin && <Link href="/admin" className="btn btn-ghost !py-2 !px-3 !text-[10px]">Admin</Link>}
            <button onClick={logout} className="btn btn-ghost !py-2 !px-3 !text-[10px]"><LogOut size={12} /> Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 pt-8">
        <div className="flex gap-2 mb-8 border-b border-[rgba(201,168,76,0.15)]">
          {[['wish', 'Submit Wish'], ['tiers', 'Upgrade Tier'], ['payment', 'Payment'], ['history', 'My Blueprints']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase border-b-2 transition ${tab === k ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-[#f0e8d4]/50 hover:text-[#f0e8d4]'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">

        {/* ── WISH TAB ── */}
        {tab === 'wish' && (submitted ? (
          <div className="card-dark !p-16 text-center max-w-2xl mx-auto !border-[#c9a84c] bg-[rgba(201,168,76,0.04)] glow-gold">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-[#c9a84c] rounded-full mb-6 glow-gold"><Flame className="text-[#c9a84c]" size={28} /></div>
            <div className="section-label justify-center">Accepted</div>
            <h2 className="font-display font-light text-3xl mb-4">Your request is in the forge.</h2>
            <p className="font-serif text-lg text-[#f0e8d4]/80 mb-8">The Thinkovr Engine is processing your parameters. Your <span className="text-[#c9a84c]">{tierMeta[selectedTier]?.label || meta.label}</span> blueprint will be reviewed and delivered to <span className="text-[#c9a84c]">{user?.email}</span> within 48 hours.</p>
            <button onClick={() => { setSubmitted(false); setTab('history') }} className="btn btn-ghost">View My Blueprints</button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-10">
            <div className="space-y-5">
              <div className="section-label">Your Wish</div>
              <h1 className="font-display font-light text-4xl md:text-5xl leading-tight -mt-4">Describe your<br /><em className="line-gold">objective.</em></h1>
              <p className="font-serif text-lg text-[#f0e8d4]/75">Be precise. The Thinkovr Engine processes your real parameters — vagueness produces vague blueprints.</p>

              {/* ✅ Always open all tiers for testing */}
              <div className="p-4 border border-[#c9a84c]/40 bg-[rgba(201,168,76,0.06)]">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#c9a84c] mb-3">⚡ Select Blueprint Tier</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[['spark', 'Spark — $47'], ['ignite', 'Ignite — $197'], ['blaze', 'Blaze — $497'], ['blueprint_only', 'Blueprint — $750']].map(([v, l]) => (
                    <button key={v} type="button" onClick={() => setSelectedTier(v)}
                      className={`px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase border transition relative ${selectedTier === v ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0b]' : 'border-[rgba(240,232,212,0.2)] text-[#f0e8d4]/70 hover:border-[#c9a84c]/60'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="wish-prompt" className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#c9a84c] mb-2">The Wish</label>
                <textarea id="wish-prompt" required value={prompt} onChange={e => setPrompt(e.target.value)} rows={8} className="input resize-none font-serif" placeholder="What outcome do you want? Be specific about timeframe and end-state." />
              </div>
              <button disabled={submitting} type="submit" className="btn btn-primary w-full justify-center">
                {submitting ? <><Loader2 className="animate-spin" size={14} /> Processing through the five filters...</> : <><Flame size={14} /> Forge My {tierMeta[selectedTier]?.label || 'Spark'} Blueprint</>}
              </button>
            </div>
            <div className="space-y-4">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]">Your Real Parameters</div>
              <p className="font-serif text-[15px] text-[#f0e8d4]/70 -mt-2">Fill in what you honestly have — not what you wish you had.</p>
              {[
                { k: 'capital', l: '01 — Liquid Capital (USD or local)', ph: 'e.g. 5000 USD / R50 000' },
                { k: 'hours', l: '02 — Weekly Defendable Hours', ph: 'e.g. 12 hours/week' },
                { k: 'skill', l: '03 — Strongest Skill', ph: 'e.g. Backend engineering (10 years)' },
                { k: 'location', l: '04 — Location / Market', ph: 'e.g. Cape Town, South Africa' },
                { k: 'fear', l: '05 — Deepest Fear', ph: 'Poverty / Obscurity / Regret — which hurts most?' },
                { k: 'runway_days', l: '⬡ Exact Runway (days)', ph: 'e.g. 180' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block font-mono text-[9px] tracking-[0.18em] uppercase text-[#f0e8d4]/50 mb-1">{f.l}</label>
                  <input value={ctx[f.k]} onChange={e => setCtx({ ...ctx, [f.k]: e.target.value })} className="input !py-3" placeholder={f.ph} />
                </div>
              ))}
            </div>
          </form>
        ))}

        {/* ── TIERS TAB ── */}
        {tab === 'tiers' && (
          <div>
            <div className="section-label">Blueprint Tiers</div>
            <h1 className="font-display font-light text-4xl md:text-5xl mb-2">Commit to a <em className="line-gold">blueprint.</em></h1>
            <p className="font-serif text-lg text-[#f0e8d4]/75 mb-6 max-w-2xl">Pick one or more tiers. Tap a tier to add it to your order. You'll receive EFT payment instructions next.</p>

            {/* ✅ Cart summary */}
            {cartTiers.length > 0 && (
              <div className="mb-8 p-5 border border-[#c9a84c]/40 bg-[rgba(201,168,76,0.05)]">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#c9a84c] mb-3">Selected Tiers</div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {cartTiers.map(t => {
                    const M = tierMeta[t]
                    return (
                      <div key={t} className="flex items-center gap-2 px-3 py-2 border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)] font-mono text-[10px] tracking-[0.15em] uppercase">
                        <span style={{ color: M.color }}>{M.label}</span>
                        <span className="text-[#f0e8d4]/60">${M.price}</span>
                        {/* ✅ X cancel button */}
                        <button onClick={() => removeFromCart(t)} className="text-[#c0392b]/70 hover:text-[#c0392b] transition ml-1">
                          <X size={12} />
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#f0e8d4]/70">
                    Total: <span className="text-[#c9a84c] font-bold">${cartTotal}</span>
                  </div>
                  <button
                    onClick={() => { setTab('payment') }}
                    className="btn btn-primary !py-2 !px-5 !text-[10px]"
                  >
                    Proceed to Payment <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map(p => {
                const M = tierMeta[p.tier] || tierMeta.spark
                const PIcon = M.icon
                const isCurrent = user?.tier === p.tier
                const inCart = cartTiers.includes(p.tier)
                return (
                  <div key={p.id} className={`card-dark flex flex-col card-electric ${p.featured ? '!border-[#c9a84c] glow-gold' : ''} ${isCurrent ? '!border-[#4a9c4a] bg-[rgba(74,156,74,0.05)]' : ''} ${inCart ? '!border-[#c9a84c] bg-[rgba(201,168,76,0.06)]' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: M.color }}>{M.label}</div>
                      <div className="flex items-center gap-2">
                        <PIcon size={18} style={{ color: M.color }} />
                        {inCart && (
                          <button onClick={() => removeFromCart(p.tier)} className="text-[#c0392b]/70 hover:text-[#c0392b] transition">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="font-display text-4xl mb-1">${p.price}</div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f0e8d4]/50 mb-6">{p.per}</div>
                    <ul className="space-y-2 font-serif text-[14px] text-[#f0e8d4]/85 mb-6 flex-1">
                      {p.features.map((f, j) => <li key={j} className="flex gap-2"><Check size={12} className="text-[#c9a84c] mt-1 flex-shrink-0" />{f}</li>)}
                    </ul>
                    {isCurrent ? (
                      <div className="text-center font-mono text-[10px] tracking-[0.2em] uppercase text-[#4a9c4a]">✓ Your current tier</div>
                    ) : inCart ? (
                      <button onClick={() => removeFromCart(p.tier)} className="btn btn-ghost justify-center !border-[#c0392b]/40 !text-[#c0392b]/80 hover:!text-[#c0392b]">
                        <X size={12} /> Remove
                      </button>
                    ) : (
                      <button onClick={() => addToCart(p.tier)} className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} justify-center`}>
                        Add to Order — ${p.price} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── PAYMENT TAB ── */}
        {tab === 'payment' && (
          <div className="max-w-4xl">
            <div className="section-label">Payment</div>
            <h1 className="font-display font-light text-4xl md:text-5xl mb-8">Complete your <em className="line-gold">order.</em></h1>

            {/* Cart total if coming from tier selection */}
            {cartTiers.length > 0 && (
              <div className="card-dark !p-6 mb-8 !border-[#c9a84c]/40">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#c9a84c] mb-4">Your Order</div>
                <div className="space-y-2 mb-4">
                  {cartTiers.map(t => {
                    const M = tierMeta[t]
                    return (
                      <div key={t} className="flex items-center justify-between font-mono text-[12px]">
                        <div className="flex items-center gap-3">
                          <span style={{ color: M.color }}>{M.label}</span>
                          <span className="text-[#f0e8d4]/50 text-[10px]">{M.desc}</span>
                          <button onClick={() => removeFromCart(t)} className="text-[#c0392b]/60 hover:text-[#c0392b] transition">
                            <X size={11} />
                          </button>
                        </div>
                        <span className="text-[#f0e8d4]">${M.price}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-[rgba(201,168,76,0.2)] pt-3 flex justify-between font-mono text-[13px]">
                  <span className="text-[#f0e8d4]/70">Total</span>
                  <span className="text-[#c9a84c] font-bold">${cartTotal}</span>
                </div>
              </div>
            )}

            {(awaitingOrders.length === 0 && cartTiers.length === 0) ? (
              <div className="card-dark"><p className="font-serif text-[#f0e8d4]/75">No open orders. Go to <button onClick={() => setTab('tiers')} className="text-[#c9a84c] underline">Upgrade Tier</button> to commit to a blueprint.</p></div>
            ) : (
              <div className="space-y-6">

                {/* Payment methods side by side */}
                <div className="grid md:grid-cols-2 gap-5">

                  {/* ── CAPITEC EFT ── */}
                  <div className="card-dark !p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Building2 size={20} className="text-[#c9a84c]" />
                      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#c9a84c]">Capitec Bank — EFT</span>
                    </div>
                    {banking ? (
                      <div className="space-y-3 font-mono text-[12px]">
                        {[
                          ['Bank', banking.bank],
                          ['Account Name', banking.account_name],
                          ['Account Number', banking.account_number],
                          ['Branch Code', banking.branch_code],
                          ['SWIFT (Intl)', banking.swift || '—'],
                          ['Amount', cartTotal > 0 ? `$${cartTotal}` : (awaitingOrders[0] ? `$${awaitingOrders[0].amount}` : '—')],
                          ['Reference', awaitingOrders[0]?.reference || 'See order below'],
                        ].filter(([, v]) => v && v !== '—').map(([k, v]) => (
                          <div key={k} className="p-3 border border-[rgba(201,168,76,0.15)] bg-[rgba(0,0,0,0.3)] flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[#f0e8d4]/50 text-[9px] tracking-[0.2em] uppercase">{k}</div>
                              <div className="text-[#f0e8d4] mt-1 break-all">{v}</div>
                            </div>
                            <button onClick={() => copy(v)} className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition flex-shrink-0"><Copy size={13} /></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 border border-[rgba(192,57,43,0.3)] bg-[rgba(192,57,43,0.05)] font-mono text-[11px] text-[#f0e8d4]/70">
                        Banking details not yet configured. Contact us directly for EFT details.
                      </div>
                    )}
                  </div>

                  {/* ── PAYPAL (COMING SOON) ── */}
                  <div className="card-dark !p-8 flex flex-col items-center justify-center text-center opacity-60 relative overflow-hidden">
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[rgba(201,168,76,0.15)] border border-[#c9a84c]/30 font-mono text-[8px] tracking-[0.25em] uppercase text-[#c9a84c]">Coming Soon</div>
                    {/* PayPal logo SVG */}
                    <svg className="w-24 mb-4" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text y="24" fontFamily="Arial" fontSize="22" fontWeight="bold" fill="#009cde">Pay</text>
                      <text x="40" y="24" fontFamily="Arial" fontSize="22" fontWeight="bold" fill="#003087">Pal</text>
                    </svg>
                    <p className="font-serif text-[#f0e8d4]/60 text-[14px] leading-relaxed mb-3">PayPal payments are currently being integrated for international clients.</p>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#c9a84c]/60">Available soon</div>
                  </div>
                </div>

                {/* Open orders with X cancel */}
                {awaitingOrders.length > 0 && (
                  <div className="space-y-4">
                    <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#f0e8d4]/50">Open Orders</div>
                    {awaitingOrders.map(o => {
                      const M = tierMeta[o.tier] || tierMeta.spark
                      return (
                        <div key={o.id} className="card-dark !p-6 flex items-center justify-between gap-6">
                          <div>
                            <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: M.color }}>{M.label} Blueprint</div>
                            <div className="font-display text-2xl">${o.amount} {o.currency}</div>
                            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#f0e8d4]/50 mt-1">Ref: {o.reference}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="badge badge-awaiting"><Clock size={10} /> Awaiting Payment</span>
                            <button
                              onClick={() => cancelOrder(o.id)}
                              className="w-8 h-8 border border-[rgba(192,57,43,0.4)] flex items-center justify-center text-[#c0392b]/70 hover:bg-[rgba(192,57,43,0.1)] hover:text-[#c0392b] transition"
                              title="Cancel order"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="p-4 border border-[#c9a84c]/30 bg-[#c9a84c]/5 font-serif text-[14px] text-[#f0e8d4]/85">
                  <strong className="text-[#c9a84c]">Important:</strong> Use your order reference for your EFT. Once we confirm payment, your tier unlocks automatically. Turnaround: 48 hours after tier unlock.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 'history' && (
          <div>
            <div className="section-label">My Blueprints</div>
            <h1 className="font-display font-light text-4xl mb-8">Your blueprint <em className="line-gold">history.</em></h1>
            {wishes.length === 0 ? (
              <div className="card-dark text-center py-16"><p className="font-serif text-[#f0e8d4]/70">No blueprints yet. Submit your first wish to begin.</p></div>
            ) : (
              <div className="space-y-3">
                {wishes.map(w => {
                  const M = tierMeta[w.tier] || tierMeta.spark
                  const WIcon = M.icon
                  return (
                    <div key={w.id} className="card-dark flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <WIcon size={14} style={{ color: M.color }} />
                          <span className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: M.color }}>{M.label}</span>
                          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#f0e8d4]/40">• {new Date(w.created_at).toLocaleString()}</span>
                        </div>
                        <div className="font-serif italic text-[#f0e8d4]/90">"{(w.user_prompt || '').slice(0, 220)}{w.user_prompt?.length > 220 ? '…' : ''}"</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`badge ${w.status === 'delivered' ? 'badge-delivered' : 'badge-pending'}`}>
                          {w.status === 'delivered' ? <><CheckCircle2 size={10} /> Delivered</> : <><Clock size={10} /> In Forge</>}
                        </span>
                        {w.status === 'delivered' && (
                          <button onClick={() => downloadPdf(w.id)} className="btn btn-ghost !py-2 !px-3 !text-[10px]"><Download size={10} /> PDF</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
