import { createDropboxCaller, createThumbKey, readDropboxEnv } from './dropbox-server'

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'])

export interface DropboxGalleryImage {
  src: string
  name: string
  caption: string
  thumbKey?: string
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

const listFolderPage = async (
  callDropbox: (operation: (client: any) => Promise<any>) => Promise<any>,
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
  callDropbox: (operation: (client: any) => Promise<any>) => Promise<any>,
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
  callDropbox: (operation: (client: any) => Promise<any>) => Promise<any>,
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
  const env = readDropboxEnv()
  const { appSecret } = env
  const callDropbox = createDropboxCaller(env)
  const limit = clampMaxImages(maxImages)

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
      thumbKey: createThumbKey({ tag: 'link', url: sharedLink }, appSecret),
    })
  }

  rows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  return rows.slice(0, limit)
}
