document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reducedMotion) {
  requestAnimationFrame(() => document.documentElement.classList.add('is-ready'))
}
