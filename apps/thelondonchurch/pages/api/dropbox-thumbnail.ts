import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createDropboxCaller,
  readDropboxEnv,
  resolveThumbKey,
} from '../../lib/server/dropbox-server'

type ThumbnailError = {
  error: string
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const cache = new Map<string, { expiresAt: number; contentType: string; body: Buffer }>()

const THUMBNAIL_SIZES = new Set([
  'w32h32',
  'w64h64',
  'w128h128',
  'w256h256',
  'w480h320',
  'w640h480',
  'w960h640',
  'w1024h768',
  'w2048h1536',
])

const normalizeSize = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const candidate = (raw || 'w640h480').trim()

  if (candidate === '256') {
    return 'w256h256'
  }
  if (candidate === '512') {
    return 'w640h480'
  }
  if (candidate === '1024') {
    return 'w1024h768'
  }

  return THUMBNAIL_SIZES.has(candidate) ? candidate : 'w256h256'
}

const readBinary = (payload: any): Buffer | null => {
  if (Buffer.isBuffer(payload)) {
    return payload
  }

  if (payload?.fileBinary && Buffer.isBuffer(payload.fileBinary)) {
    return payload.fileBinary
  }

  if (payload?.result?.fileBinary && Buffer.isBuffer(payload.result.fileBinary)) {
    return payload.result.fileBinary
  }

  if (payload?.fileBlob) {
    return Buffer.from(payload.fileBlob)
  }

  if (payload?.result?.fileBlob) {
    return Buffer.from(payload.result.fileBlob)
  }

  return null
}

const getErrorTag = (error: any) => {
  const tag = error?.error?.['.tag'] || error?.error?.error?.['.tag']
  return typeof tag === 'string' ? tag : ''
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ThumbnailError | Buffer>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const key = typeof req.query.key === 'string' ? req.query.key.trim() : ''
  if (!key) {
    return res.status(400).json({ error: 'Missing required query param: key' })
  }

  const size = normalizeSize(req.query.size)
  const cacheKey = `${key}|${size}`
  const now = Date.now()
  const cached = cache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.setHeader('Content-Type', cached.contentType)
    res.status(200).send(cached.body)
    return
  }

  try {
    const env = readDropboxEnv()
    const resource = resolveThumbKey(key, env.appSecret)
    const callDropbox = createDropboxCaller(env)
    let dropboxResource =
      resource.tag === 'link'
        ? {
            '.tag': 'link' as const,
            url: resource.url,
          }
        : {
            '.tag': 'path' as const,
            path: resource.path,
          }

    // Legacy key compatibility: convert id-based paths to an actual file path.
    if (resource.tag === 'path' && resource.path.startsWith('id:')) {
      const metadata = await callDropbox((client) =>
        client.filesGetMetadata({
          path: resource.path,
        })
      )

      const resolvedPath = metadata?.result?.path_lower || metadata?.result?.path_display
      if (resolvedPath) {
        dropboxResource = {
          '.tag': 'path',
          path: resolvedPath,
        }
      }
    }

    const response = await callDropbox((client) =>
      client.filesGetThumbnailV2({
        resource: dropboxResource,
        format: { '.tag': 'jpeg' },
        size: { '.tag': size as any },
      })
    )

    const body = readBinary(response)
    if (!body) {
      throw new Error('Dropbox did not return thumbnail binary data.')
    }

    const payload = {
      body,
      contentType: 'image/jpeg',
      expiresAt: now + ONE_DAY_MS,
    }

    cache.set(cacheKey, payload)

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.setHeader('Content-Type', payload.contentType)
    res.status(200).send(payload.body)
    return
  } catch (error: any) {
    const tag = getErrorTag(error)
    const message = error?.message || String(error)
    const summary = error?.error?.error_summary || error?.error_summary || ''

    if (
      message.toLowerCase().includes('thumbnail key') ||
      message.toLowerCase().includes('missing required environment variable')
    ) {
      return res.status(400).json({ error: message })
    }

    if (tag === 'not_found' || tag === 'unsupported_extension' || tag === 'unsupported_image') {
      return res.status(404).json({ error: `Thumbnail unavailable: ${tag}` })
    }

    return res
      .status(502)
      .json({ error: `Dropbox thumbnail relay failed: ${message}${summary ? ` (${summary})` : ''}` })
  }
}
