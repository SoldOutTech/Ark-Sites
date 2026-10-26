const fs = require('node:fs/promises')
const path = require('node:path')
const { fetchPage, fetchPages } = require('react-bricks/frontend')

async function main() {
  const apiKey = process.env.REACT_BRICKS_SOURCE_API_KEY
  const output = process.argv[2]
  const sourceName = process.argv[3] || 'React Bricks starter'

  if (!apiKey || !output) {
    throw new Error(
      'Usage: REACT_BRICKS_SOURCE_API_KEY=... node scripts/react-bricks/snapshot-published.cjs <output.json> [source name]'
    )
  }

  const listedPages = await fetchPages(apiKey)
  const pages = await Promise.all(
    listedPages.map(async ({ slug }) => {
      const page = await fetchPage(slug, apiKey, 'en')
      if (!page) throw new Error(`Could not fetch page: ${slug}`)

      return {
        type: page.type,
        name: page.name,
        slug: page.slug,
        language: page.language,
        meta: page.meta,
        content: page.content,
        customValues: page.customValues || {},
        category: page.category || null,
        status: page.status,
        isLocked: page.isLocked,
        tags: page.tags || [],
      }
    })
  )

  const snapshot = {
    format: 'ark-sites-react-bricks-pages-v1',
    sourceName,
    capturedAt: new Date().toISOString(),
    pages,
  }
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, JSON.stringify(snapshot, null, 2) + '\n')
  console.log(`Saved ${pages.length} published pages to ${output}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
