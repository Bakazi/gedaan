'use client'

import { useEffect, useRef } from 'react'

export function SmokeCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Smoke particle class
    class Particle {
      constructor(x, y, fromMouse = false) {
        this.x = x ?? Math.random() * canvas.width
        this.y = y ?? Math.random() * canvas.height
        this.fromMouse = fromMouse
        this.size = fromMouse ? Math.random() * 80 + 40 : Math.random() * 120 + 60
        this.speedX = (Math.random() - 0.5) * (fromMouse ? 1.8 : 0.4)
        this.speedY = -(Math.random() * (fromMouse ? 1.5 : 0.6) + 0.2)
        this.life = 0
        this.maxLife = fromMouse ? Math.random() * 80 + 60 : Math.random() * 200 + 120
        this.opacity = fromMouse ? 0.22 : 0.12
        this.rotation = Math.random() * Math.PI * 2
        this.rotSpeed = (Math.random() - 0.5) * 0.008
        this.gold = Math.random() > 0.65 // some particles have gold tint
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.speedX *= 0.995
        this.speedY *= 0.996
        this.life++
        this.rotation += this.rotSpeed
        this.size += 0.3
      }
      get alpha() {
        const p = this.life / this.maxLife
        return this.opacity * Math.sin(p * Math.PI)
      }
      get dead() { return this.life >= this.maxLife }
    }

    // Spawn ambient particles
    const spawnAmbient = () => {
      const x = Math.random() * canvas.width
      const y = canvas.height * (0.3 + Math.random() * 0.7)
      particlesRef.current.push(new Particle(x, y))
    }

    // Initial burst
    for (let i = 0; i < 60; i++) spawnAmbient()

    let frame = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      frame++

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new ambient particles
      if (frame % 4 === 0) spawnAmbient()
      if (frame % 3 === 0 && particlesRef.current.filter(p => p.fromMouse).length < 80) {
        // Spawn near mouse occasionally
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        if (mx > 0) {
          particlesRef.current.push(new Particle(mx + (Math.random() - 0.5) * 60, my + (Math.random() - 0.5) * 60, true))
        }
      }

      // Keep total under control
      if (particlesRef.current.length > 280) {
        particlesRef.current = particlesRef.current.filter(p => !p.dead).slice(-280)
      }

      particlesRef.current.forEach((p, i) => {
        p.update()
        if (p.dead) return

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
        if (p.gold) {
          grad.addColorStop(0, `rgba(201,168,76,${p.alpha * 0.7})`)
          grad.addColorStop(0.4, `rgba(184,115,51,${p.alpha * 0.35})`)
          grad.addColorStop(1, `rgba(201,168,76,0)`)
        } else {
          grad.addColorStop(0, `rgba(30,25,20,${p.alpha})`)
          grad.addColorStop(0.5, `rgba(20,16,12,${p.alpha * 0.5})`)
          grad.addColorStop(1, `rgba(10,10,11,0)`)
        }

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Remove dead
      particlesRef.current = particlesRef.current.filter(p => !p.dead)
    }
    animate()

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', handleMouse)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
