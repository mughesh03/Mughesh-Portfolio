import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Must match --bg in styles.css so distant beads fade into the page.
const PAGE_BG = 0xf5f6fb

/**
 * DottedSurface — a Three.js field of round, multi-colour beads riding a
 * sine wave. The palette slowly rotates through the spectrum.
 *
 * If WebGL is unavailable the component renders nothing, so the page still
 * works. With "reduce motion" enabled it draws a single still frame.
 */
export function DottedSurface({ className = '', ...props }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const SEPARATION = 140
    const AMOUNTX = 44
    const AMOUNTY = 64
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch (err) {
      return // No WebGL: skip the backdrop, keep the page.
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(PAGE_BG, 2200, 9000)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(0, 380, 1250)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(PAGE_BG, 0)
    container.appendChild(renderer.domElement)

    // Circular sprite so every point renders as a soft round bead
    // rather than the default square.
    const spriteSize = 64
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = spriteSize
    spriteCanvas.height = spriteSize
    const spriteCtx = spriteCanvas.getContext('2d')
    const gradient = spriteCtx.createRadialGradient(
      spriteSize / 2, spriteSize / 2, 0,
      spriteSize / 2, spriteSize / 2, spriteSize / 2
    )
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.95)')
    gradient.addColorStop(0.85, 'rgba(255,255,255,0.35)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    spriteCtx.fillStyle = gradient
    spriteCtx.fillRect(0, 0, spriteSize, spriteSize)
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas)
    spriteTexture.minFilter = THREE.LinearFilter
    spriteTexture.magFilter = THREE.LinearFilter

    const positions = []
    const colors = []
    const baseHues = []
    const geometry = new THREE.BufferGeometry()
    const color = new THREE.Color()

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        )
        const hue = ((ix / AMOUNTX) * 0.7 + (iy / AMOUNTY) * 0.5) % 1
        baseHues.push(hue)
        color.setHSL(hue, 0.85, 0.55)
        colors.push(color.r, color.g, color.b)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 14,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      map: spriteTexture,
      alphaTest: 0.01,
    })

    scene.add(new THREE.Points(geometry, material))

    let count = 0
    let animationId = 0

    const drawFrame = () => {
      const posArray = geometry.attributes.position.array
      const colArray = geometry.attributes.color.array
      let i = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3
          posArray[index + 1] =
            Math.sin((ix + count) * 0.3) * 60 +
            Math.sin((iy + count) * 0.5) * 60

          color.setHSL((baseHues[i] + count * 0.006) % 1, 0.85, 0.55)
          colArray[index] = color.r
          colArray[index + 1] = color.g
          colArray[index + 2] = color.b
          i++
        }
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
      renderer.render(scene, camera)
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      drawFrame()
      count += 0.1
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      if (reduceMotion) drawFrame()
    }

    window.addEventListener('resize', handleResize)
    if (reduceMotion) drawFrame()
    else animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      geometry.dispose()
      material.dispose()
      spriteTexture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={'dotted-surface ' + className}
      aria-hidden="true"
      {...props}
    />
  )
}
