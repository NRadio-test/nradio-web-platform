import { cp, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const webDir = resolve(scriptDir, '..')
const source = resolve(webDir, 'backend', 'functions')
const target = resolve(webDir, 'functions')

await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })
console.log('已准备 Cloudflare Pages Functions 部署目录。')
