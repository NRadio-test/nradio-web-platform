const TRANSITION_KEY = 'nradio:galaxy-entry-transition'
const TRANSITION_TTL = 5000
const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const orbSize = () => Math.min(innerWidth, innerHeight) * .92

const makeOrb = (image, className) => {
  const orb = document.createElement('div')
  orb.className = `galaxy-transition-orb ${className}`
  orb.setAttribute('aria-hidden', 'true')
  const frame = document.createElement('img')
  frame.src = image
  frame.alt = ''
  frame.decoding = 'sync'
  orb.append(frame)
  return orb
}

const captureOrb = (canvas) => {
  if (!canvas.width || !canvas.height) return null
  const size = Math.round(Math.min(canvas.width, canvas.height) * .96)
  const frame = document.createElement('canvas')
  frame.width = size
  frame.height = size
  const context = frame.getContext('2d')
  if (!context) return null
  context.drawImage(canvas, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size, 0, 0, size, size)
  return frame.toDataURL('image/png')
}

export const installGalaxyDeparture = (anchor, canvas, getOrientation = () => null) => {
  if (!anchor || !canvas) return
  let inFlight = false
  anchor.addEventListener('click', async (event) => {
    if (inFlight || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (anchor.target && anchor.target !== '_self') return
    if (!canvas.dataset.galaxyReady || document.hidden || matchMedia(MOTION_QUERY).matches || !Element.prototype.animate) return

    const destination = new URL(anchor.href)
    if (destination.origin !== location.origin || destination.pathname !== '/knowledge/galaxy/') return
    const rect = canvas.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return

    let image
    try {
      image = captureOrb(canvas)
      if (!image) return
      const orientation = getOrientation()
      const view = Number.isFinite(orientation?.yaw) && Number.isFinite(orientation?.pitch)
        ? { yaw: orientation.yaw, pitch: orientation.pitch } : null
      sessionStorage.setItem(TRANSITION_KEY, JSON.stringify({ image, view, createdAt: Date.now() }))
    } catch { return }

    event.preventDefault()
    inFlight = true

    const diameter = Math.min(rect.width, rect.height) * .96
    const left = rect.left + (rect.width - diameter) / 2
    const top = rect.top + (rect.height - diameter) / 2
    const deltaX = innerWidth / 2 - (left + diameter / 2)
    const deltaY = innerHeight / 2 - (top + diameter / 2)
    const scale = orbSize() / diameter
    const veil = document.createElement('div')
    veil.className = 'galaxy-transition-veil'
    veil.setAttribute('aria-hidden', 'true')
    const orb = makeOrb(image, 'galaxy-transition-departure')
    orb.style.left = `${left}px`
    orb.style.top = `${top}px`
    orb.style.width = `${diameter}px`
    orb.style.height = `${diameter}px`
    document.body.append(veil, orb)

    let cancelled = false
    let orbAnimation
    let veilAnimation
    const onEscape = (keyEvent) => {
      if (keyEvent.key !== 'Escape') return
      keyEvent.preventDefault()
      cancelled = true
      orbAnimation?.cancel()
      veilAnimation?.cancel()
      sessionStorage.removeItem(TRANSITION_KEY)
    }
    const cleanup = () => {
      document.removeEventListener('keydown', onEscape)
      veil.remove()
      orb.remove()
      inFlight = false
    }
    document.addEventListener('keydown', onEscape)

    try {
      orbAnimation = orb.animate([
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1, offset: 0 },
        { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale * 1.025})`, opacity: 1, offset: .78 },
        { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`, opacity: 1, offset: 1 }
      ], { duration: 620, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' })
      veilAnimation = veil.animate([
        { opacity: 0, offset: 0 },
        { opacity: .65, offset: .4 },
        { opacity: 1, offset: 1 }
      ], { duration: 620, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' })
      await Promise.all([orbAnimation.finished, veilAnimation.finished])
    } catch {
      cleanup()
      if (!cancelled) location.assign(destination.href)
      return
    }
    if (cancelled) { cleanup(); return }
    location.assign(destination.href)
  })
}

export const prepareGalaxyArrival = () => {
  let payload
  try {
    const saved = sessionStorage.getItem(TRANSITION_KEY)
    sessionStorage.removeItem(TRANSITION_KEY)
    if (!saved) return () => {}
    payload = JSON.parse(saved)
  } catch { return () => {} }
  if (matchMedia(MOTION_QUERY).matches || !Element.prototype.animate ||
      !payload || typeof payload.image !== 'string' || !payload.image.startsWith('data:image/png;base64,') ||
      !Number.isFinite(payload.createdAt) || Date.now() - payload.createdAt > TRANSITION_TTL ||
      Date.now() < payload.createdAt) return () => {}

  const view = Number.isFinite(payload.view?.yaw) && Number.isFinite(payload.view?.pitch)
    ? { yaw: payload.view.yaw, pitch: payload.view.pitch } : null

  const canvas = document.querySelector('#galaxy-canvas')
  const controls = [...document.querySelectorAll('.galaxy-topbar, .galaxy-explorer, .galaxy-view-controls')]
  const hints = [...document.querySelectorAll('.galaxy-help')]
  const arrival = document.createElement('div')
  arrival.className = 'galaxy-transition-arrival'
  arrival.setAttribute('aria-hidden', 'true')
  arrival.append(makeOrb(payload.image, 'galaxy-transition-arrival-orb'))
  document.body.append(arrival)
  canvas.style.opacity = '0'
  for (const control of controls) {
    control.style.opacity = '0'
    control.style.transform = 'translate3d(0, 14px, 0)'
  }
  for (const hint of hints) hint.style.opacity = '0'

  let finished = false
  const fallback = window.setTimeout(() => finish(), 2200)
  function finish() {
    if (finished) return
    finished = true
    clearTimeout(fallback)
    const sceneAnimation = canvas.animate([
      { opacity: 0 }, { opacity: 1 }
    ], { duration: 480, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' })
    const curtainAnimation = arrival.animate([
      { opacity: 1 }, { opacity: 0 }
    ], { duration: 360, delay: 90, easing: 'cubic-bezier(.32, 0, .67, 1)', fill: 'forwards' })
    const controlAnimations = controls.map((control) => control.animate([
      { opacity: 0, transform: 'translate3d(0, 14px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    ], { duration: 390, delay: 110, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' }))
    const hintAnimations = hints.map((hint) => hint.animate([
      { opacity: 0 }, { opacity: 1 }
    ], { duration: 320, delay: 190, easing: 'ease-out', fill: 'forwards' }))
    Promise.allSettled([sceneAnimation.finished, curtainAnimation.finished,
      ...controlAnimations.map((item) => item.finished), ...hintAnimations.map((item) => item.finished)])
      .then(() => {
        canvas.style.opacity = ''
        sceneAnimation.cancel()
        for (let index = 0; index < controls.length; index++) {
          controls[index].style.opacity = ''
          controls[index].style.transform = ''
          controlAnimations[index].cancel()
        }
        for (let index = 0; index < hints.length; index++) {
          hints[index].style.opacity = ''
          hintAnimations[index].cancel()
        }
        curtainAnimation.cancel()
        arrival.remove()
      })
  }
  finish.view = view
  return finish
}
