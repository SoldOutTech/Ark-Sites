import crypto from 'crypto'
import { Dropbox } from 'dropbox'

const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token'

export interface DropboxEnv {
  accessToken: string
  refreshToken: string
  appKey: string
  appSecret: string
}

export type DropboxOperation = (client: Dropbox) => Promise<any>
export type ThumbResource =
  | {
      tag: 'path'
      path: string
    }
  | {
      tag: 'link'
      url: string
    }

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value.trim()
}

export const readDropboxEnv = (): DropboxEnv => {
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

export const createDropboxCaller = (env: DropboxEnv) => {
  let activeToken = env.accessToken
  let dbx = new Dropbox({ accessToken: activeToken })

  return async (operation: DropboxOperation) => {
    try {
      return await operation(dbx)
    } catch (error: any) {
      if (!isAuthExpiredError(error)) {
        throw error
      }

      activeToken = await refreshAccessToken(env.refreshToken, env.appKey, env.appSecret)
      dbx = new Dropbox({ accessToken: activeToken })
      return operation(dbx)
    }
  }
}

const toBase64Url = (value: string) =>
  Buffer.from(value, 'utf8').toString('base64url')

const fromBase64Url = (value: string) =>
  Buffer.from(value, 'base64url').toString('utf8')

const signPayload = (payload: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url')

export const createThumbKey = (resource: ThumbResource, appSecret: string) => {
  const payload = toBase64Url(JSON.stringify(resource))
  const signature = signPayload(payload, appSecret)
  return `${payload}.${signature}`
}

export const resolveThumbKey = (key: string, appSecret: string): ThumbResource => {
  const [payload, signature] = key.split('.')
  if (!payload || !signature) {
    throw new Error('Invalid thumbnail key format.')
  }

  const expectedSignature = signPayload(payload, appSecret)
  const expectedBuffer = Buffer.from(expectedSignature)
  const receivedBuffer = Buffer.from(signature)

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new Error('Invalid thumbnail key signature.')
  }

  let parsed: any = null
  try {
    parsed = JSON.parse(fromBase64Url(payload))
  } catch {
    throw new Error('Invalid thumbnail key payload.')
  }

  // Backward compatibility for early keys with shape: { path: "..." }
  if (parsed?.path && typeof parsed.path === 'string') {
    return { tag: 'path', path: parsed.path }
  }

  if (parsed?.tag === 'path' && typeof parsed.path === 'string') {
    return { tag: 'path', path: parsed.path }
  }

  if (parsed?.tag === 'link' && typeof parsed.url === 'string') {
    return { tag: 'link', url: parsed.url }
  }

  throw new Error('Invalid thumbnail key payload resource.')
}
