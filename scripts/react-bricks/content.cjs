#!/usr/bin/env node
const fs = require('node:fs/promises')
const crypto = require('node:crypto')
const path = require('node:path')

const BASE = 'https://api.reactbricks.com/v2'
const FORMAT = 'ark-react-bricks-snapshot-v2'
const fields = ['type', 'name', 'slug', 'language', 'meta', 'content', 'customValues', 'tags', 'category', 'status', 'isLocked', 'publishedAt', 'scheduledForPublishingOn']
const pick = (p) => Object.fromEntries(fields.filter(k => p[k] !== undefined).map(k => [k, p[k]]))
const stable = (v) => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k])])) : v
const digest = (v) => crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex')
function showDiff(before, after, prefix = '') {
  if (digest(before ?? null) === digest(after ?? null)) return []
  if (before && after && typeof before === 'object' && typeof after === 'object' && Array.isArray(before) === Array.isArray(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().flatMap(k => showDiff(before[k],after[k],prefix ? `${prefix}.${k}` : k))
  }
  return [`  ${prefix}: ${JSON.stringify(before) ?? '(missing)'} -> ${JSON.stringify(after) ?? '(missing)'}`]
}

async function request(token, route, method = 'GET', body, appId) {
  const res = await fetch(`${BASE}${route}`, {method, headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(appId ? {appid: appId} : {})}, ...(body === undefined ? {} : {body: JSON.stringify(body)})})
  if (!res.ok) throw new Error(`${method} ${route}: HTTP ${res.status}`)
  return res.status === 204 ? null : res.json()
}
async function session(token, appId) {
  const data = await request(token, '/admin/session?refreshToken=false', 'GET', undefined, appId)
  if (data?.user?.appId !== appId) throw new Error('Admin session does not match the requested app ID')
  return data.user
}
async function list(token) {
  const data = await request(token, '/admin/pages')
  if (!Array.isArray(data)) throw new Error('Unexpected page list response; no changes made')
  return data
}
async function getPage(token, id, language) {
  return request(token, `/admin/pages/${encodeURIComponent(id)}/translations/${encodeURIComponent(language)}`)
}
function baseline(p) { return digest({page:pick(p), workingContent:p.workingContent ?? null, editStatus:p.editStatus ?? null, updatedAt:p.updatedAt ?? null}) }
function usage() { throw new Error('Usage: content.cjs snapshot <file> --app-id <id> | diff <file> --app-id <id> | publish <file> --app-id <id> --apply | seed <file> --app-id <id> [--apply]. Set REACT_BRICKS_ADMIN_TOKEN for the target app.') }
function parse(args) {
  const [command, file, ...opts] = args
  if (!['snapshot','diff','publish','seed'].includes(command) || !file) usage()
  const at = opts.indexOf('--app-id'), appId = opts[at+1]
  if (at < 0 || !appId || appId.startsWith('--') || opts.some((v,i) => !['--app-id','--apply'].includes(v) && i !== at+1)) usage()
  return {command,file,appId,apply:opts.includes('--apply')}
}
async function readSnapshot(file) {
  const snapshot = JSON.parse(await fs.readFile(file,'utf8'))
  if (snapshot.format !== FORMAT || !snapshot.appId || !Array.isArray(snapshot.pages)) throw new Error('Unsupported snapshot format')
  const ids=new Set(), slugs=new Set()
  for (const p of snapshot.pages) {
    if (!p.id || !p.language || !p.base || !p.original || !p.page || !p.page.name || !p.page.slug || !p.page.type || !p.page.meta || !Array.isArray(p.page.content) || Object.keys(p.page).some(k=>!fields.includes(k))) throw new Error('Invalid snapshot page')
    const id=`${p.id}\0${p.language}`, slug=`${p.page.slug}\0${p.language}`
    if (ids.has(id) || slugs.has(slug)) throw new Error('Duplicate page or slug in snapshot')
    ids.add(id); slugs.add(slug)
  }
  return snapshot
}
async function snapshotCommand(token, appId, file) {
  const pages = []
  for (const p of await list(token)) {
    const translations = Array.isArray(p.translations) && p.translations.length ? p.translations : [{language:p.language || 'en'}]
    for (const t of translations) {
      const page = await getPage(token,p.id,t.language)
      if (page.workingContent && digest(page.workingContent) !== digest(page.content)) throw new Error(`Page ${p.name} has a working copy; export is paused to avoid losing drafts`)
      pages.push({id:p.id,language:t.language,base:baseline(page),original:pick(page),page:pick(page)})
    }
  }
  await fs.writeFile(file,JSON.stringify({format:FORMAT,appId,capturedAt:new Date().toISOString(),pages},null,2)+'\n',{flag:'wx',mode:0o600})
  console.log(`Saved ${pages.length} page translations to ${file}`)
}
async function changes(token, appId, snapshot) {
  if (snapshot.appId !== appId) throw new Error('Snapshot belongs to a different app; use seed for a new app')
  const result=[]
  for (const record of snapshot.pages) {
    if (record.page.language !== record.language) throw new Error('Changing page language is not supported')
    if (digest(record.page) === digest(record.original)) continue
    const current = await getPage(token,record.id,record.language)
    if (baseline(current) !== record.base) throw new Error(`Conflict on ${record.page.name}: page changed since snapshot; export again`)
    const changed = fields.filter(k => digest(record.original[k] ?? null) !== digest(record.page[k] ?? null))
    result.push({record,current,changed})
  }
  return result
}
async function copyImages(token, pages) {
  const uploads = new Map()
  async function walk(value) {
    if (Array.isArray(value)) {
      const result=[]
      for (const child of value) result.push(await walk(child))
      return result
    }
    if (!value || typeof value !== 'object') return value
    if (typeof value.src === 'string' && value.src.startsWith('https://assets.reactbricks.com/')) {
      const source = new URL(value.src)
      const parts = source.pathname.split('/').filter(Boolean)
      if (parts[1] !== 'images' || parts[2] !== 'original' || !value.hashId) throw new Error('Unsupported React Bricks image format')
      const master = value.hashId, cropped = path.parse(parts[3]).name, sourceApp = parts[0]
      const key = `${sourceApp}/${master}/${cropped}`
      if (!uploads.has(key)) {
        const fallbackExt = value.fallbackSrc ? path.extname(new URL(value.fallbackSrc).pathname) : path.extname(source.pathname)
        let masterUrl
        for (const ext of new Set([fallbackExt, '.jpg', '.jpeg', '.png', '.svg', '.webp'])) {
          const candidate = `https://assets.reactbricks.com/${sourceApp}/images/master/${master}${ext}`
          const response = await fetch(candidate, {method:'HEAD'})
          if (response.ok) { masterUrl = candidate; break }
        }
        if (!masterUrl) throw new Error(`Could not find original image ${value.seoName || master}`)
        const created = await request(token, '/admin/media/images/create_from_url', 'POST', {
          url:masterUrl, name:value.seoName || master, title:value.alt || '', alt:value.alt || '', source:'Upload',
          editParams:JSON.stringify({crop:value.crop,transform:value.transform})
        })
        if (!created?.appHashId || !created.hashId || !created.croppedImage?.hashId) throw new Error('Unexpected image upload response')
        uploads.set(key,created)
        console.log(`Copied image ${uploads.size}: ${value.seoName || master}`)
      }
      const created=uploads.get(key)
      let encoded=JSON.stringify(value)
      for (const [from,to] of [[sourceApp,created.appHashId],[master,created.hashId],[cropped,created.croppedImage.hashId]]) encoded=encoded.replaceAll(from,to)
      return JSON.parse(encoded)
    }
    const out={}
    for (const [k,v] of Object.entries(value)) out[k]=await walk(v)
    return out
  }
  const result=[]
  for (const page of pages) result.push({...page,content:await walk(page.content)})
  return result
}
async function main(args=process.argv.slice(2)) {
  const {command,file,appId,apply}=parse(args)
  let token=process.env.REACT_BRICKS_ADMIN_TOKEN
  let dashboardToken=process.env.REACT_BRICKS_DASHBOARD_TOKEN
  if (!token && !dashboardToken) {
    const Configstore=require('configstore')
    const {decryptText,getMacAddress}=require('create-reactbricks-app/lib/helpers/utils')
    const config=new Configstore('create-reactbricks-app')
    if (config.get('isLoggedIn') && config.get('expiresAt') > Date.now() && config.get('authToken')) {
      try { dashboardToken=decryptText(config.get('authToken'),`${getMacAddress()}-RBs`) }
      catch { throw new Error('Cannot read the React Bricks CLI login; sign in again') }
    }
  }
  if (!token && dashboardToken) {
    const result=await request(dashboardToken,'/admin/session/get_admin_token','POST',{appId,appEnv:'main'})
    token=result?.authToken
  }
  if (!token) throw new Error('Sign in with the React Bricks CLI and select keep logged in, or set REACT_BRICKS_ADMIN_TOKEN or REACT_BRICKS_DASHBOARD_TOKEN')
  const user = await session(token,appId)
  if (command === 'snapshot') return snapshotCommand(token,appId,file)
  if (command === 'seed') {
    const snap=await readSnapshot(file)
    if (snap.appId === appId) throw new Error('Source and target app must be different')
    const existing=await list(token)
    if (existing.length) throw new Error(`Target app has ${existing.length} pages; seed only supports empty apps`)
    console.log(`Would seed ${snap.pages.length} pages into ${appId}`)
    if (!apply) return
    const pages=await copyImages(token,snap.pages.map(p=>p.page))
    const createdIds=new Map()
    for (let i=0;i<pages.length;i++) {
      const page=pages[i], sourceId=snap.pages[i].id
      const payload={...page,meta:JSON.stringify(page.meta),content:JSON.stringify(page.content),customValues:JSON.stringify(page.customValues || {})}
      if (!createdIds.has(sourceId)) {
        const created=await request(token,'/admin/pages','POST',payload)
        if (!created?.id) throw new Error(`Page ${page.name} was created but the response did not contain its ID; inspect the target before retrying`)
        createdIds.set(sourceId,created.id)
      } else {
        const id=encodeURIComponent(createdIds.get(sourceId)), language=encodeURIComponent(page.language)
        await request(token,`/admin/pages/${id}/translations`,'POST',{language:page.language})
        delete payload.language
        await request(token,`/admin/pages/${id}/translations/${language}`,'PATCH',payload)
      }
      console.log(`Created ${page.name} (${page.slug})`)
    }
    return
  }
  const snap=await readSnapshot(file), changed=await changes(token,appId,snap)
  for (const c of changed) {
    console.log(`${c.record.page.slug}: ${c.changed.join(', ')}`)
    for (const line of showDiff(c.record.original,c.record.page)) console.log(line)
  }
  console.log(`${changed.length} page(s) changed`)
  if (command === 'diff' || !apply || !changed.length) return
  if (user.useWorkingCopy) throw new Error('Publishing apps with working copies is not yet supported; no pages were changed')
  for (const {record,current} of changed) {
    const p=record.page
    if (baseline(await getPage(token,record.id,record.language)) !== record.base) throw new Error(`Conflict on ${p.name}: page changed during publishing`)
    const data={...pick(current),...p,content:JSON.stringify(p.content),meta:JSON.stringify(p.meta),customValues:JSON.stringify(p.customValues || {}),workingContent:null,authorId:current.authorId}
    delete data.language
    await request(token,`/admin/pages/${encodeURIComponent(record.id)}/translations/${encodeURIComponent(record.language)}`,'PUT',data)
    console.log(`Saved ${p.name}`)
  }
}
if (require.main === module) main().catch(e=>{console.error(e.message);process.exitCode=1})
module.exports={pick,baseline,digest,parse,changes,copyImages,showDiff,main}
