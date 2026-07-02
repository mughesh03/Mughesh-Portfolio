import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * DottedSurface — Three.js animated grid of dots with sine-wave motion
 * and a multi-color HSL gradient across the surface.
 * Adapted for a Vite + React (JSX, no Tailwind, no next-themes) project.
 */
export function DottedSurface({ className = '', ...props }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const SEPARATION = 140
    const AMOUNTX = 44
    const AMOUNTY = 64

    const scene = new THREE.Scene()
    // Fog color matches the page paper color so distant dots blend cleanly.
    scene.fog = new THREE.Fog(0xf7f3e9, 2200, 9000)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(0, 380, 1250)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(scene.fog.color, 0)

    containerRef.current.appendChild(renderer.domElement)

    // Build a circular sprite texture so each point renders as a soft
    // round bead instead of the default square.
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

    // Give each dot a base hue from a smooth 2-D gradient across the grid.
    // We'll rotate the whole palette over time in the animation loop.
    const color = new THREE.Color()
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
        const y = 0
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        positions.push(x, y, z)
        const hue = ((ix / AMOUNTX) * 0.7 + (iy / AMOUNTY) * 0.5) % 1
        baseHues.push(hue)
        color.setHSL(hue, 0.85, 0.55)
        colors.push(color.r, color.g, color.b)
      }
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )

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

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let count = 0
    let animationId = 0
    const tmpColor = new THREE.Color()

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const positionAttribute = geometry.attributes.position
      const colorAttribute = geometry.attributes.color
      const posArray = positionAttribute.array
      const colArray = colorAttribute.array

      let i = 0
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3
          // Sine-wave undulation
          posArray[index + 1] =
            Math.sin((ix + count) * 0.3) * 60 +
            Math.sin((iy + count) * 0.5) * 60

          // Slowly rotate the hue of every dot so the whole surface breathes color
          const hue = (baseHues[i] + count * 0.006) % 1
          tmpColor.setHSL(hue, 0.85, 0.55)
          colArray[index] = tmpColor.r
          colArray[index + 1] = tmpColor.g
          colArray[index + 2] = tmpColor.b

          i++
        }
      }
      positionAttribute.needsUpdate = true
      colorAttribute.needsUpdate = true

      renderer.render(scene, camera)
      count += 0.1
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    animate()

    sceneRef.current = { scene, camera, renderer, points, animationId, spriteTexture }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
        if (sceneRef.current.spriteTexture) sceneRef.current.spriteTexture.dispose()
        sceneRef.current.renderer.dispose()
        if (containerRef.current && sceneRef.current.renderer.domElement) {
          try {
            containerRef.current.removeChild(
              sceneRef.current.renderer.domElement
            )
          } catch (_) { /* already removed */ }
        }
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={'dotted-surface ' + className}
      aria-hidden
      {...props}
    />
  )
}
