import type { NextApiRequest, NextApiResponse } from 'next'
import { resolveDropboxGallery } from '../../lib/server/dropbox-gallery'

type GallerySuccess = {
  images: Array<{
    src: string
    caption: string
    name: string
    thumbKey?: string
    thumbSrc?: string
  }>
  meta: {
    count: number
    source: 'dropbox-api'
  }
}

type GalleryError = {
  error: string
}

const FIVE_MINUTES_MS = 5 * 60 * 1000
const cache = new Map<string, { expiresAt: number; payload: GallerySuccess }>()

const isDropboxFolderUrl = (value: string) => {
  try {
    const parsed = new URL(value)
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase()
    return hostname === 'dropbox.com' && parsed.pathname.includes('/scl/fo/')
  } catch {
    return false
  }
}

const normalizeMaxImages = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number.parseInt(raw || '', 10)

  if (!Number.isFinite(parsed)) {
    return 24
  }

  return Math.max(1, parsed)
}

const normalizeThumbSize = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const candidate = (raw || '512').trim()
  return ['256', '512', '1024'].includes(candidate) ? candidate : '512'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GallerySuccess | GalleryError>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const dropboxUrl =
    typeof req.query.dropboxUrl === 'string' ? req.query.dropboxUrl.trim() : ''

  if (!dropboxUrl) {
    return res.status(400).json({ error: 'Missing required query param: dropboxUrl' })
  }

  if (!isDropboxFolderUrl(dropboxUrl)) {
    return res.status(400).json({
      error:
        'Invalid Dropbox folder URL. Use a shared folder link like https://www.dropbox.com/scl/fo/...',
    })
  }

  const maxImages = normalizeMaxImages(req.query.maxImages)
  const thumbSize = normalizeThumbSize(req.query.thumbSize)
  const cacheKey = `${dropboxUrl}|${maxImages}|${thumbSize}`
  const now = Date.now()
  const cached = cache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(cached.payload)
  }

  try {
    const images = await resolveDropboxGallery(dropboxUrl, maxImages).then((rows) =>
      rows.map((row) => ({
        ...row,
        thumbSrc: row.thumbKey
          ? `/api/dropbox-thumbnail?key=${encodeURIComponent(row.thumbKey)}&size=${thumbSize}`
          : undefined,
      }))
    )
    const payload: GallerySuccess = {
      images,
      meta: {
        count: images.length,
        source: 'dropbox-api',
      },
    }

    cache.set(cacheKey, {
      payload,
      expiresAt: now + FIVE_MINUTES_MS,
    })

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(payload)
  } catch (error: any) {
    const message = error?.message || String(error)
    return res.status(502).json({
      error: `Dropbox relay failed: ${message}`,
    })
  }
}
