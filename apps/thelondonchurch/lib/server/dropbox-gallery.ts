import { Dropbox } from 'dropbox'

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'])
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token'

export interface DropboxGalleryImage {
  src: string
  name: string
  caption: string
}

interface DropboxEnv {
  accessToken: string
  refreshToken: string
  appKey: string
  appSecret: string
}

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value.trim()
}

const readDropboxEnv = (): DropboxEnv => {
  const accessToken = requireEnv('DROPBOX_ACCESS_TOKEN')
  const refreshToken = requireEnv('DROPBOX_REFRESH_TOKEN')
  const appKey = requireEnv('DROPBOX_APP_KEY')
  const appSecret = requireEnv('DROPBOX_APP_SECRET')

  return {
    accessToken,
    refreshToken,
    appKey,
    appSecret,
  }
}

const isImageFile = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  return Boolean(ext && IMAGE_EXTENSIONS.has(ext))
}

const toRawUrl = (sharedUrl: string) => {
  if (sharedUrl.includes('raw=1')) {
    return sharedUrl
  }

  if (sharedUrl.includes('?')) {
    return `${sharedUrl}&raw=1`
  }

  return `${sharedUrl}?raw=1`
}

const toCaption = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()

const isAuthExpiredError = (error: any) => {
  if (error?.status === 401) {
    return true
  }

  const textParts = [
    typeof error?.error === 'string' ? error.error : '',
    error?.error?.error_summary || '',
    error?.error_summary || '',
    error?.message || '',
  ]
  const text = textParts.join(' ').toLowerCase()
  return text.includes('expired_access_token') || text.includes('invalid_access_token')
}

const refreshAccessToken = async (
  refreshToken: string,
  appKey: string,
  appSecret: string
) => {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: appKey,
    client_secret: appSecret,
  })

  const response = await fetch(DROPBOX_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })

  const responseText = await response.text()
  let parsed: any = null
  try {
    parsed = JSON.parse(responseText)
  } catch {
    parsed = null
  }

  if (!response.ok) {
    const detail = parsed?.error_description || parsed?.error || responseText
    throw new Error(`Failed to refresh Dropbox access token: ${detail}`)
  }

  const newAccessToken = parsed?.access_token
  if (!newAccessToken) {
    throw new Error('Dropbox token refresh succeeded but no access_token was returned.')
  }

  return newAccessToken
}

const listFolderPage = async (
  callDropbox: (operation: (client: Dropbox) => Promise<any>) => Promise<any>,
  sharedFolderUrl: string,
  folderPath: string
) => {
  const initial = await callDropbox((client) =>
    client.filesListFolder({
      path: folderPath,
      recursive: false,
      shared_link: { url: sharedFolderUrl },
    })
  )

  let entries = [...initial.result.entries]
  let cursor = initial.result.cursor
  let hasMore = initial.result.has_more

  while (hasMore) {
    const next = await callDropbox((client) => client.filesListFolderContinue({ cursor }))
    entries = entries.concat(next.result.entries)
    cursor = next.result.cursor
    hasMore = next.result.has_more
  }

  return entries
}

const listAllEntriesFromSharedFolder = async (
  callDropbox: (operation: (client: Dropbox) => Promise<any>) => Promise<any>,
  sharedFolderUrl: string
) => {
  const allEntries: any[] = []
  const queue = ['']
  const seenFolders = new Set([''])

  while (queue.length > 0) {
    const folderPath = queue.shift() || ''
    const entries = await listFolderPage(callDropbox, sharedFolderUrl, folderPath)
    allEntries.push(...entries)

    for (const entry of entries) {
      if (entry['.tag'] !== 'folder') {
        continue
      }

      const childPath = entry.path_lower || entry.id
      if (!childPath || seenFolders.has(childPath)) {
        continue
      }

      seenFolders.add(childPath)
      queue.push(childPath)
    }
  }

  return allEntries
}

const getOrCreateFileSharedLink = async (
  callDropbox: (operation: (client: Dropbox) => Promise<any>) => Promise<any>,
  pathOrId: string
) => {
  const existing = await callDropbox((client) =>
    client.sharingListSharedLinks({
      path: pathOrId,
      direct_only: true,
    })
  )

  const existingUrl = existing.result.links?.[0]?.url
  if (existingUrl) {
    return existingUrl
  }

  const created = await callDropbox((client) =>
    client.sharingCreateSharedLinkWithSettings({ path: pathOrId })
  )

  return created.result.url
}

const clampMaxImages = (maxImages?: number) => {
  if (!Number.isFinite(maxImages as number)) {
    return 24
  }

  return Math.max(1, Math.floor(maxImages as number))
}

export const resolveDropboxGallery = async (
  sharedFolderUrl: string,
  maxImages?: number
): Promise<DropboxGalleryImage[]> => {
  const { accessToken, refreshToken, appKey, appSecret } = readDropboxEnv()

  let activeToken = accessToken
  let dbx = new Dropbox({ accessToken: activeToken })
  const limit = clampMaxImages(maxImages)

  const callDropbox = async (operation: (client: Dropbox) => Promise<any>) => {
    try {
      return await operation(dbx)
    } catch (error: any) {
      if (!isAuthExpiredError(error)) {
        throw error
      }

      activeToken = await refreshAccessToken(refreshToken, appKey, appSecret)
      dbx = new Dropbox({ accessToken: activeToken })
      return operation(dbx)
    }
  }

  const allEntries = await listAllEntriesFromSharedFolder(callDropbox, sharedFolderUrl)
  const imageEntries = allEntries.filter(
    (entry) => entry['.tag'] === 'file' && typeof entry.name === 'string' && isImageFile(entry.name)
  )

  const rows: DropboxGalleryImage[] = []
  for (const entry of imageEntries) {
    const pathOrId = entry.path_lower || entry.id
    if (!pathOrId) {
      continue
    }

    const sharedLink = await getOrCreateFileSharedLink(callDropbox, pathOrId)
    rows.push({
      src: toRawUrl(sharedLink),
      name: entry.name,
      caption: toCaption(entry.name),
    })
  }

  rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  return rows.slice(0, limit)
}
