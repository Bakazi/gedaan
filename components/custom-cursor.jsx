'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    const down = () => setClicking(true)
    const up = () => setClicking(false)

    const checkHover = (e) => {
      const el = e.target
      const isClickable = el.closest('a, button, [role="button"], input, textarea, select, label')
      setHovering(!!isClickable)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousemove', checkHover, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', checkHover)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      >
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width: clicking ? '6px' : hovering ? '10px' : '8px',
            height: clicking ? '6px' : hovering ? '10px' : '8px',
            background: hovering ? '#e5c968' : '#c9a84c',
            boxShadow: `0 0 ${hovering ? '12px' : '6px'} rgba(201,168,76,${hovering ? '0.9' : '0.6'})`,
            marginLeft: clicking ? '1px' : hovering ? '-1px' : '0',
            marginTop: clicking ? '1px' : hovering ? '-1px' : '0',
          }}
        />
      </div>
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      >
        <div
          className="rounded-full border transition-all duration-300"
          style={{
            width: clicking ? '28px' : hovering ? '44px' : '36px',
            height: clicking ? '28px' : hovering ? '44px' : '36px',
            borderColor: hovering ? 'rgba(229,201,104,0.7)' : 'rgba(201,168,76,0.4)',
            boxShadow: hovering ? '0 0 20px rgba(201,168,76,0.3)' : 'none',
            marginLeft: '-18px',
            marginTop: '-18px',
          }}
        />
      </div>
    </>
  )
}
