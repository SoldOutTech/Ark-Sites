const fs = require('node:fs/promises')
const path = require('node:path')

const API = 'https://api.reactbricks.com/v2'
const ASSETS = 'assets.reactbricks.com'

function visit(value, callback) {
  if (!value || typeof value !== 'object') return
  callback(value)
  for (const child of Object.values(value)) visit(child, callback)
}

function collectImages(pages) {
  const images = new Map()
  let appHashId

  for (const page of pages) {
    visit(page.content, (value) => {
      if (typeof value.src !== 'string' || !value.src.includes(ASSETS)) return
      const url = new URL(value.fallbackSrc || value.src)
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts[1] !== 'images' || parts[2] !== 'original') return

      const currentAppHashId = parts[0]
      const masterImageHashId = path.parse(parts[3]).name
      if (appHashId && currentAppHashId !== appHashId) {
        throw new Error('The snapshot contains images from multiple React Bricks apps')
      }
      appHashId = currentAppHashId

      const existing = images.get(masterImageHashId)
      if (existing) {
        existing.croppedImageHashIds.add(value.hashId)
        return
      }

      images.set(masterImageHashId, {
        url: url.toString(),
        name: value.seoName || masterImageHashId,
        title: value.alt || '',
        alt: value.alt || '',
        maxWidth: value.width,
        editParams: JSON.stringify({ crop: value.crop, transform: value.transform }),
        masterImageHashId,
        croppedImageHashIds: new Set([value.hashId]),
      })
    })
  }

  return { appHashId, images: [...images.values()] }
}

async function request(endpoint, token, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${endpoint}: ${response.status} ${await response.text()}`)
  }
  return response.json()
}

async function main() {
  const snapshotPath = process.argv[2]
  const dryRun = process.argv.includes('--dry-run')
  const token = process.env.REACT_BRICKS_ADMIN_TOKEN

  if (!snapshotPath || (!dryRun && !token)) {
    throw new Error('Usage: REACT_BRICKS_ADMIN_TOKEN=... node scripts/react-bricks/import-seed.cjs <snapshot.json> [--dry-run]')
  }

  const snapshot = JSON.parse(await fs.readFile(snapshotPath, 'utf8'))
  if (snapshot.format !== 'ark-sites-react-bricks-pages-v1' || !Array.isArray(snapshot.pages)) {
    throw new Error('Unsupported seed snapshot')
  }

  const slugs = snapshot.pages.map(({ slug }) => slug)
  if (new Set(slugs).size !== slugs.length) throw new Error('Duplicate page slugs in snapshot')

  const { appHashId, images } = collectImages(snapshot.pages)
  console.log(`Seed: ${snapshot.pages.length} pages, ${images.length} unique React Bricks images`)
  if (dryRun) return

  // Never append the seed to an app that already has content.
  const currentPages = await request('/admin/pages', token)
  if (currentPages.length) {
    throw new Error(`Target app already has ${currentPages.length} pages. Use an empty React Bricks app.`)
  }

  const replacements = new Map()
  let targetAppHashId
  let copiedImages = 0
  for (const image of images) {
    const created = await request('/admin/media/images/create_from_url', token, {
      method: 'POST',
      body: JSON.stringify({
        url: image.url,
        name: image.name,
        title: image.title,
        alt: image.alt,
        mediaFolderName: 'Dublin starter',
        source: 'Upload',
        maxWidth: image.maxWidth,
        editParams: image.editParams,
      }),
    })
    if (!created.appHashId || !created.hashId || !created.croppedImage?.hashId) {
      throw new Error(`Unexpected image response for ${image.name}`)
    }
    targetAppHashId = created.appHashId
    replacements.set(image.masterImageHashId, created.hashId)
    for (const croppedHashId of image.croppedImageHashIds) {
      if (croppedHashId) replacements.set(croppedHashId, created.croppedImage.hashId)
    }
    copiedImages += 1
    console.log(`Copied image ${copiedImages}/${images.length}: ${image.name}`)
  }
  if (appHashId && targetAppHashId) replacements.set(appHashId, targetAppHashId)

  for (const page of snapshot.pages) {
    let content = JSON.stringify(page.content)
    for (const [from, to] of replacements) content = content.replaceAll(from, to)
    const payload = {
      type: page.type,
      name: page.name,
      slug: page.slug,
      language: page.language,
      meta: JSON.stringify(page.meta),
      content,
      status: page.status,
      isLocked: page.isLocked,
      tags: page.tags,
      publishedAt: page.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    }
    await request('/admin/pages', token, { method: 'POST', body: JSON.stringify(payload) })
    console.log(`Created ${page.name} (${page.slug})`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
