import { createHash } from 'node:crypto'

// Bump this when the coordinate formula changes; data_version only fingerprints source entries.
export const GALAXY_VERSION = 1

const digest = (value) => createHash('sha256').update(value).digest()
const unit = (value) => {
  const bytes = digest(value)
  const vector = [0, 4, 8].map((offset) => bytes.readUInt32BE(offset) / 0xffffffff * 2 - 1)
  const length = Math.hypot(...vector) || 1
  return vector.map((component) => component / length)
}

const add = (target, vector, weight) => {
  for (let index = 0; index < 3; index += 1) target[index] += vector[index] * weight
}

const normalize = (value) => String(value).normalize('NFKC').trim().toLowerCase()

export function galaxyPosition(entry) {
  const center = [0, 0, 0]
  const tags = [...new Set(entry.tags.map(normalize))].slice(0, 5)
  const tagWeights = [3.2, 1.15, 0.85, 0.65, 0.5]
  tags.forEach((tag, index) => add(center, unit(`tag:${tag}`), tagWeights[index]))
  add(center, unit(`source:${normalize(entry.source_url)}`), 0.9)

  const centerLength = Math.hypot(...center) || 1
  const jitter = unit(`info-id:${entry.id}`)
  const direction = center.map((component, index) => component / centerLength + jitter[index] * 0.27)
  const directionLength = Math.hypot(...direction) || 1
  const radialSeed = digest(`radius:${entry.id}`).readUInt32BE(0) / 0xffffffff
  const radius = 0.55 + radialSeed * 0.43

  return Object.fromEntries(['x', 'y', 'z'].map((axis, index) => [
    axis,
    Number((direction[index] / directionLength * radius).toFixed(6))
  ]))
}

export function dataVersion(entries) {
  return createHash('sha256').update(JSON.stringify(entries)).digest('hex')
}

export function validateKnowledgeEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('knowledge.jsonl 没有可同步的知识条目。')
  }

  const seen = new Map()
  const required = ['id', 'title', 'text', 'source_url', 'source_type', 'uploaded_by', 'verified_at', 'confidence']
  entries.forEach((entry, index) => {
    const row = index + 1
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`knowledge.jsonl 第 ${row} 条必须是对象。`)
    }
    for (const field of required) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        throw new Error(`knowledge.jsonl 第 ${row} 条缺少有效 ${field}。`)
      }
    }
    if (!Array.isArray(entry.tags) || entry.tags.length === 0 || entry.tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
      throw new Error(`knowledge.jsonl 第 ${row} 条缺少有效 tags。`)
    }
    if (seen.has(entry.id)) {
      throw new Error(`knowledge.jsonl InfoID ${entry.id} 重复（第 ${seen.get(entry.id)} 和 ${row} 条）。`)
    }
    seen.set(entry.id, row)
  })
}
