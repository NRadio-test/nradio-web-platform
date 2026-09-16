const TAU = Math.PI * 2
const ROTATION_PERIOD_MS = 300_000
const MIN_DISTANCE = 2.15
const MAX_DISTANCE = 5.5
const BASE_DISTANCE = 3.35
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const shortestAngle = (from, to) => from + Math.atan2(Math.sin(to - from), Math.cos(to - from))

const seededRandom = (seed) => {
  let state = seed >>> 0 || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 4294967296
  }
}

const seedFrom = (text) => {
  let seed = 2166136261
  for (const character of text) seed = Math.imul(seed ^ character.codePointAt(0), 16777619)
  return seed >>> 0
}

// Astronomy photographs are mostly near-neutral starlight, with a sparse mix
// of warmer and colder sources. Keep the colour variation low enough that the
// actual data points read as stars rather than uniformly coloured LEDs.
const DUST_RGB = [[235, 234, 229], [190, 211, 232], [244, 202, 166], [197, 150, 157]]
const DUST_FILLS = DUST_RGB.map(([r, g, b]) =>
  Array.from({ length: 17 }, (_, index) => `rgba(${r}, ${g}, ${b}, ${index / 16})`))

const buildDust = (version) => {
  const random = seededRandom(seedFrom(version || 'nradio-galaxy'))
  return Array.from({ length: 3600 }, () => {
    const family = random()
    const layer = family < .41 ? 0 : family < .83 ? 1 : 2
    const theta = random() * TAU
    const shell = layer === 0
      ? .035 + Math.pow(random(), 2.15) * .71
      : layer === 1 ? .23 + random() * .82 : .57 + random() * .47
    let x, y, z
    if (layer === 1) {
      x = shell * Math.cos(theta)
      z = shell * Math.sin(theta)
      // A thin tilted dust disk crosses the dense core; it is never pickable.
      y = clamp(-.25 * x + .13 * z + (random() - .5) * .17, -1, 1)
    } else {
      const vertical = random() * 2 - 1
      const plane = Math.sqrt(1 - vertical * vertical)
      x = shell * plane * Math.cos(theta)
      y = shell * vertical
      z = shell * plane * Math.sin(theta)
    }
    const toneRoll = random()
    return {
      x, y, z, layer,
      tone: toneRoll < .025 ? 3 : toneRoll < .105 ? 2 : toneRoll < .285 ? 1 : 0,
      sparkle: random() < .008,
      size: .22 + random() * .64
    }
  })
}

const buildFarStars = (version) => {
  const random = seededRandom(seedFrom(`far-field:${version || 'nradio-galaxy'}`))
  return Array.from({ length: 1650 }, () => {
    const x = random()
    const inMilkyWay = random() < .56
    const y = inMilkyWay
      ? clamp(.69 - .32 * x + (random() + random() + random() - 1.5) * .23, .02, .98)
      : random()
    const toneRoll = random()
    return {
      x, y,
      tone: toneRoll < .02 ? 3 : toneRoll < .11 ? 2 : toneRoll < .28 ? 1 : 0,
      alpha: .11 + random() * (inMilkyWay ? .33 : .24),
      size: .34 + random() * .69,
      sparkle: random() < .008
    }
  })
}

const pointColor = (entry) => {
  if (entry.source_type?.startsWith('official')) return [223, 234, 235]
  if (entry.source_type?.startsWith('douyin')) return [202, 218, 236]
  if (entry.source_type === 'user_upload') {
    const theme = seedFrom(entry.tags[0] || entry.source_url || entry.id) % 6
    return [
      [244, 220, 189], [232, 229, 221], [211, 225, 235],
      [224, 212, 202], [220, 227, 228], [226, 215, 231]
    ][theme]
  }
  return [226, 228, 230]
}

const relatedEntries = (selected, entries) => entries
  .filter((entry) => entry.id !== selected.id)
  .map((entry) => {
    const sharedTags = entry.tags.filter((tag) => selected.tags.includes(tag))
    const sameSource = Boolean(selected.source_url && entry.source_url === selected.source_url)
    return { entry, sharedTags, sameSource, score: (sameSource ? 8 : 0) + sharedTags.length }
  })
  .filter((item) => item.sameSource || item.sharedTags.length >= 2)
  .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
  .slice(0, 9)

export const getGalaxyRelations = relatedEntries

export class GalaxyScene {
  constructor(canvas, { preview = false, onPick = () => {}, onHover = () => {} } = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: true })
    this.preview = preview
    this.onPick = onPick
    this.onHover = onHover
    this.entries = []
    this.dust = buildDust('nradio-galaxy')
    this.farStars = buildFarStars('nradio-galaxy')
    this.farFieldCanvas = null
    this.projected = []
    this.matchIds = null
    this.selectedId = null
    this.hoveredId = null
    this.yaw = -.35
    this.pitch = -.13
    this.distance = BASE_DISTANCE
    this.offset = { x: 0, y: 0 }
    this.target = null
    this.dragging = false
    this.lastAction = 0
    this.resumeAt = performance.now() - 1800
    this.lastTick = 0
    this.lastDraw = 0
    this.frame = 0
    this.visible = true
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    this.motionQuery.addEventListener('change', (event) => {
      this.reducedMotion = event.matches
      this.lastTick = 0
      this.updateVisibility()
      this.requestDraw()
    })
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    document.addEventListener('visibilitychange', () => this.updateVisibility())
    if (preview) {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting
        this.updateVisibility()
      }, { threshold: .02 })
      this.intersectionObserver.observe(canvas)
    }
    this.resize()
    this.updateVisibility()
  }

  setEntries(entries, version = '') {
    this.entries = entries
    this.entryMap = new Map(entries.map((entry) => [entry.id, entry]))
    this.pointStyles = new Map(entries.map((entry) => {
      const signature = seedFrom(entry.id)
      return [entry.id, {
        color: pointColor(entry),
        bloom: signature % 17 === 0,
        diffraction: signature % 47 === 0
      }]
    }))
    this.dust = buildDust(version)
    this.farStars = buildFarStars(version)
    this.renderFarField()
    this.requestDraw()
  }

  setMatches(ids) { this.matchIds = ids; this.requestDraw() }
  setSelected(id) { this.selectedId = id; this.lastAction = performance.now(); this.requestDraw() }
  setHovered(id) {
    if (id === this.hoveredId) return
    this.hoveredId = id
    if (id) this.lastAction = performance.now()
    this.onHover(id ? this.entryMap.get(id) : null)
    this.requestDraw()
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.width = Math.max(1, rect.width)
    this.height = Math.max(1, rect.height)
    const pixelRatio = Math.min(devicePixelRatio || 1, this.preview ? 2 : 1.75)
    this.canvas.width = Math.round(this.width * pixelRatio)
    this.canvas.height = Math.round(this.height * pixelRatio)
    this.pixelRatio = pixelRatio
    this.renderFarField()
    this.requestDraw()
  }

  renderFarField() {
    if (!this.width || !this.height || !this.farStars) return
    // Static distant stars are cached at CSS-pixel resolution, not repainted every frame.
    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(this.width)
    canvas.height = Math.ceil(this.height)
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    const stride = this.preview ? 5 : Math.min(this.width, this.height) < 720 ? 2 : 1
    for (let index = 0; index < this.farStars.length; index += stride) {
      const star = this.farStars[index]
      const x = star.x * this.width, y = star.y * this.height
      const alpha = star.alpha * (this.preview ? .78 : 1)
      const size = star.size * (this.preview ? .7 : 1)
      if (star.sparkle) {
        ctx.beginPath()
        ctx.arc(x, y, size * 1.8, 0, TAU)
        ctx.fillStyle = DUST_FILLS[star.tone][clamp(Math.round(alpha * 2), 1, 2)]
        ctx.fill()
      }
      ctx.fillStyle = DUST_FILLS[star.tone][clamp(Math.round(alpha * 16), 1, 16)]
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
    this.farFieldCanvas = canvas
  }

  updateVisibility() {
    const shouldRun = Boolean(this.ctx) && this.visible && !document.hidden && !this.reducedMotion
    if (shouldRun) {
      if (!this.frame) {
        if (!this.lastTick) this.lastTick = performance.now()
        this.frame = requestAnimationFrame((time) => this.tick(time))
      }
      return
    }
    const hadFrame = Boolean(this.frame)
    if (this.frame) cancelAnimationFrame(this.frame)
    this.frame = 0
    this.lastTick = 0
    if (hadFrame && !document.hidden && this.visible) this.draw()
  }

  requestDraw() {
    if (document.hidden || !this.visible) return
    if (this.reducedMotion) this.draw()
    else if (!this.frame) this.updateVisibility()
  }

  tick(now) {
    this.frame = 0
    const delta = Math.max(0, now - (this.lastTick || now))
    this.lastTick = now
    if (this.target) {
      const progress = clamp((now - this.target.start) / 680, 0, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      this.yaw = this.target.fromYaw + (this.target.yaw - this.target.fromYaw) * eased
      this.pitch = this.target.fromPitch + (this.target.pitch - this.target.fromPitch) * eased
      this.distance = this.target.fromDistance + (this.target.distance - this.target.fromDistance) * eased
      this.offset.x = this.target.fromX + (this.target.x - this.target.fromX) * eased
      this.offset.y = this.target.fromY + (this.target.y - this.target.fromY) * eased
      if (progress === 1) this.target = null
    } else if (!this.preview && (this.dragging || this.hoveredId || this.selectedId || (this.lastAction > 0 && now - this.lastAction < 1800))) {
      this.resumeAt = now
    } else {
      const ramp = this.preview ? 1 : clamp((now - this.resumeAt) / 1800, 0, 1)
      this.yaw += TAU * delta / ROTATION_PERIOD_MS * ramp
    }
    // Pointer motion and focus transitions use display-rate redraws; the five-
    // minute idle orbit can remain at a lower cadence without changing speed.
    const drawInterval = this.dragging || this.target || now - this.lastAction < 350 ? 16 : 30
    if (now - this.lastDraw >= drawInterval) { this.lastDraw = now; this.draw() }
    this.updateVisibility()
  }

  rotatePoint(point) {
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw)
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch)
    const x = point.x * cy + point.z * sy
    const z = -point.x * sy + point.z * cy
    return { x, y: point.y * cp - z * sp, z: point.y * sp + z * cp }
  }

  project(point) {
    const rotated = this.rotatePoint(point)
    const focus = 3.35 / (this.distance - rotated.z * .66)
    const radius = Math.min(this.width, this.height) * (this.preview ? .39 : .42)
    return {
      x: this.width / 2 + this.offset.x + rotated.x * radius * focus,
      y: this.height / 2 + this.offset.y + rotated.y * radius * focus,
      z: rotated.z,
      focus
    }
  }

  draw() {
    if (!this.ctx || !this.width || !this.height) return
    const ctx = this.ctx
    ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    ctx.clearRect(0, 0, this.width, this.height)
    if (this.farFieldCanvas) ctx.drawImage(this.farFieldCanvas, 0, 0, this.width, this.height)
    const cx = this.width / 2 + this.offset.x, cy = this.height / 2 + this.offset.y
    const radius = Math.min(this.width, this.height) * (this.preview ? .42 : .46)
    const atmosphere = ctx.createRadialGradient(cx - radius * .08, cy + radius * .03, radius * .02, cx, cy, radius * 1.25)
    atmosphere.addColorStop(0, 'rgba(246, 231, 212, .14)')
    atmosphere.addColorStop(.13, 'rgba(230, 218, 208, .095)')
    atmosphere.addColorStop(.38, 'rgba(147, 169, 193, .065)')
    atmosphere.addColorStop(.73, 'rgba(106, 133, 164, .018)')
    atmosphere.addColorStop(1, 'rgba(106, 133, 164, 0)')
    ctx.fillStyle = atmosphere
    ctx.fillRect(cx - radius * 1.25, cy - radius * 1.25, radius * 2.5, radius * 2.5)

    // More particles on desktop, but tiny micro-stars use fillRect rather than a path.
    const dustStride = this.preview ? 3 : Math.min(this.width, this.height) < 720 ? 2 : 1
    for (let index = 0; index < this.dust.length; index += dustStride) {
      const particle = this.dust[index]
      const point = this.project(particle)
      const depth = clamp((point.z + 1) / 2, 0, 1)
      const layerWeight = particle.layer === 0 ? 1.12 : particle.layer === 1 ? .76 : .56
      const alpha = (.085 + depth * .43) * layerWeight * (this.preview ? .88 : 1)
      const minSize = particle.layer === 0 ? (this.preview ? .42 : .51) : .3
      const size = Math.min(1.55, Math.max(minSize, particle.size * point.focus * (.52 + depth * .58) * (this.preview ? .73 : 1)))
      if (particle.sparkle && depth > .48 && !this.preview) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, size * 2.2, 0, TAU)
        ctx.fillStyle = DUST_FILLS[particle.tone][clamp(Math.round(alpha * 2), 1, 3)]
        ctx.fill()
      }
      ctx.fillStyle = DUST_FILLS[particle.tone][clamp(Math.round(alpha * 16), 1, 16)]
      ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size)
    }

    this.projected = this.entries.map((entry) => ({ entry, ...this.project(entry.galaxy) }))
      .sort((a, b) => a.z - b.z)
    if (this.selectedId) this.drawConnections(ctx)
    for (const point of this.projected) {
      const selected = point.entry.id === this.selectedId
      const hovered = point.entry.id === this.hoveredId
      const matched = !this.matchIds || this.matchIds.has(point.entry.id)
      const front = point.z > .025
      const depth = clamp((point.z + .85) / 1.7, 0, 1)
      const alpha = (front ? .72 + depth * .26 : .055 + depth * .17) * (matched ? 1 : .12)
      // The optical core is deliberately smaller than its invisible hit target.
      // A separate legacy radius preserves pointer accuracy after this redraw.
      const hitSize = clamp((front ? 2.35 : 1.1) * point.focus + depth * 1.45, 1, this.preview ? 5.5 : 8)
      const size = clamp((front ? 1.18 : .64) * point.focus + depth * .52, .48, this.preview ? 3.25 : 4.1)
      const style = this.pointStyles.get(point.entry.id)
      const [r, g, b] = style.color
      const featured = front && matched && (selected || hovered || style.bloom)
      if (featured) {
        const bloomRadius = size * (selected || hovered ? 6.8 : 4.3)
        const bloom = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, bloomRadius)
        const strength = selected || hovered ? .34 : .19
        bloom.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${strength})`)
        bloom.addColorStop(.22, `rgba(${r}, ${g}, ${b}, ${strength * .39})`)
        bloom.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = bloom
        ctx.fillRect(point.x - bloomRadius, point.y - bloomRadius, bloomRadius * 2, bloomRadius * 2)
      }
      // A narrow dark optical edge separates website data from stars already
      // present in the photograph, without turning every node into a glowing LED.
      if (front && matched && !this.preview) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, size + .9, 0, TAU)
        ctx.fillStyle = 'rgba(7, 12, 18, .57)'
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(point.x, point.y, selected ? size * 1.23 : hovered ? size * 1.12 : size, 0, TAU)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${selected || hovered ? 1 : alpha})`
      ctx.fill()
      if (front && matched && size > 1.45) {
        ctx.fillStyle = `rgba(251, 248, 242, ${selected || hovered ? .85 : alpha * .63})`
        ctx.fillRect(point.x - .36, point.y - .36, .72, .72)
      }
      if (front && matched && style.diffraction && !this.preview && !selected && !hovered) {
        ctx.beginPath()
        ctx.moveTo(point.x - size * 2.4, point.y)
        ctx.lineTo(point.x + size * 2.4, point.y)
        ctx.moveTo(point.x, point.y - size * 2.4)
        ctx.lineTo(point.x, point.y + size * 2.4)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, .2)`
        ctx.lineWidth = .55
        ctx.stroke()
      }
      if (selected || hovered) {
        const markerRadius = Math.max(selected ? 12 : 10, size * (selected ? 4.6 : 4))
        ctx.beginPath()
        ctx.arc(point.x, point.y, markerRadius, 0, TAU)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${selected ? .66 : .43})`
        ctx.lineWidth = .7
        ctx.stroke()
        ctx.beginPath()
        for (let angle = 0; angle < TAU; angle += Math.PI / 2) {
          const cos = Math.cos(angle), sin = Math.sin(angle)
          ctx.moveTo(point.x + cos * (markerRadius + 2), point.y + sin * (markerRadius + 2))
          ctx.lineTo(point.x + cos * (markerRadius + 5), point.y + sin * (markerRadius + 5))
        }
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${selected ? .8 : .55})`
        ctx.stroke()
      }
      point.hitRadius = clamp(hitSize * 2.3, 7, 16)
      point.hittable = front && matched && !this.preview
    }
  }

  drawConnections(ctx) {
    const selected = this.entryMap.get(this.selectedId)
    if (!selected) return
    const origin = this.project(selected.galaxy)
    for (const item of relatedEntries(selected, this.entries)) {
      const end = this.project(item.entry.galaxy)
      if (origin.z <= 0 || end.z <= 0) continue
      const alpha = item.sameSource ? .29 : .19
      ctx.beginPath()
      ctx.moveTo(origin.x, origin.y)
      ctx.lineTo(end.x, end.y)
      ctx.strokeStyle = item.sameSource ? `rgba(236, 198, 151, ${alpha})` : `rgba(186, 211, 226, ${alpha})`
      ctx.lineWidth = item.sameSource ? .85 : .7
      ctx.stroke()
    }
  }

  pick(x, y) {
    let winner = null
    let bestDistance = Infinity
    for (const point of this.projected) {
      if (!point.hittable) continue
      const squared = (point.x - x) ** 2 + (point.y - y) ** 2
      if (squared > point.hitRadius ** 2) continue
      // At overlap, the front-most knowledge point owns the hit.
      const rank = squared / point.hitRadius ** 2 - point.z * .22
      if (rank < bestDistance) { winner = point; bestDistance = rank }
    }
    return winner
  }

  pointerHover(x, y) { this.setHovered(this.pick(x, y)?.entry.id || null) }
  pointerPick(x, y) {
    // A drag or wheel event can precede the next animation frame.
    this.draw()
    const point = this.pick(x, y)
    if (point) this.onPick(point.entry)
    return point?.entry || null
  }

  rotate(dx, dy) {
    this.target = null
    this.yaw += dx / Math.max(230, this.width) * 2.8
    this.pitch = clamp(this.pitch + dy / Math.max(230, this.height) * 2.8, -1.42, 1.42)
    this.lastAction = performance.now()
    this.requestDraw()
  }

  zoomAt(factor, x = this.width / 2, y = this.height / 2) {
    this.target = null
    const oldDistance = this.distance
    const nextDistance = clamp(oldDistance * factor, MIN_DISTANCE, MAX_DISTANCE)
    if (nextDistance === oldDistance) return
    const beforeX = x - this.width / 2 - this.offset.x
    const beforeY = y - this.height / 2 - this.offset.y
    const ratio = oldDistance / nextDistance
    this.offset.x = clamp(this.offset.x + beforeX * (1 - ratio), -this.width * .32, this.width * .32)
    this.offset.y = clamp(this.offset.y + beforeY * (1 - ratio), -this.height * .32, this.height * .32)
    this.distance = nextDistance
    this.lastAction = performance.now()
    this.requestDraw()
  }

  focusEntry(id) {
    const entry = this.entryMap.get(id)
    if (!entry) return false
    const { x, y, z } = entry.galaxy
    const yaw = -Math.atan2(x, z)
    const horizontalDepth = Math.hypot(x, z)
    const pitch = Math.atan2(y, horizontalDepth)
    const mobileFocusY = matchMedia('(max-width: 700px)').matches ? -this.height * .20 : 0
    this.animateView(shortestAngle(this.yaw, yaw), clamp(pitch, -1.42, 1.42), 2.65, 0, mobileFocusY)
    return true
  }

  resetView() { this.animateView(shortestAngle(this.yaw, -.35), -.13, BASE_DISTANCE, 0, 0) }

  animateView(yaw, pitch, distance, x, y) {
    if (this.reducedMotion) {
      Object.assign(this, { yaw, pitch, distance, offset: { x, y } })
      this.requestDraw()
      return
    }
    this.target = {
      start: performance.now(), fromYaw: this.yaw, fromPitch: this.pitch,
      fromDistance: this.distance, fromX: this.offset.x, fromY: this.offset.y,
      yaw, pitch, distance, x, y
    }
    this.lastAction = performance.now()
    this.requestDraw()
  }
}
