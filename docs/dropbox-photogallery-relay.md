# Dropbox PhotoGallery Relay (thelondonchurch)

This project uses a server-side relay API for PhotoGallery so the browser never talks directly to Dropbox APIs.

- Route: `/api/dropbox-gallery`
- Route: `/api/dropbox-thumbnail`
- App: `apps/thelondonchurch`
- Input: Dropbox shared folder URL (`https://www.dropbox.com/scl/fo/...`)
- Output: direct image URLs (`raw=1`) for rendering in PhotoGallery
- Output: proxied thumbnails for faster grid loading in PhotoGallery

## Editor workflow

In React Bricks, the `PhotoGallery` brick now uses a one-time load flow:

1. Set `Dropbox URL` and `Max Images` in the Data panel.
2. Click `Load Images`.
3. The brick stores resolved URLs in `resolvedImages` props.
4. Public page renders from saved URLs instead of re-resolving Dropbox on each visit.

If you change `Dropbox URL` or increase `Max Images`, click `Load Images` again.

## Why this relay exists

Dropbox shared folder links do not reliably expose image URLs to browser-side scraping. The relay solves that by:

1. Listing shared-folder files via Dropbox API.
2. Filtering image files.
3. Resolving shared links per image.
4. Returning embeddable direct `raw=1` URLs.

## Dropbox app setup

Create a custom Dropbox app in [Dropbox App Console](https://www.dropbox.com/developers/apps):

1. Click `Create app`.
2. Choose `Scoped access`.
3. Choose the access type required for your workspace.
4. Create the app and open its settings page.

### Required scopes

Enable these scopes in the app permissions:

- `files.metadata.read`
- `files.content.read`
- `sharing.read`
- `sharing.write`

After changing scopes, re-generate/refresh credentials as needed.

## Required environment variables

Set these server-side env vars for `thelondonchurch`:

- `DROPBOX_ACCESS_TOKEN`
- `DROPBOX_REFRESH_TOKEN`
- `DROPBOX_APP_KEY`
- `DROPBOX_APP_SECRET`

Do not expose these via `NEXT_PUBLIC_*`.

## Where to set env vars

### Local development

Set them in:

- `apps/thelondonchurch/.env.local`

Example:

```bash
DROPBOX_ACCESS_TOKEN=...
DROPBOX_REFRESH_TOKEN=...
DROPBOX_APP_KEY=...
DROPBOX_APP_SECRET=...
```

### Production

Set the same four variables in your hosting provider project settings for the London app.

## Verification checklist

1. Start London app (`npm run dev:london`).
2. Call:
   - `/api/dropbox-gallery?dropboxUrl=<your_shared_folder_url>&maxImages=24`
3. Confirm response contains `images` with direct `raw=1` URLs.
4. In React Bricks editor, add the same folder URL to PhotoGallery.
5. Click `Load Images` in the PhotoGallery Data panel.
6. Confirm images render on editor and public page.

## Security notes

1. Keep Dropbox secrets server-only.
2. Rotate access credentials periodically.
3. Use least-privilege scopes only.
4. Do not log secrets or return them in API errors.

## Troubleshooting

### `Missing required environment variable`

At least one Dropbox env var is not configured for the running environment.

### Token refresh or auth errors

Check:

1. `DROPBOX_REFRESH_TOKEN`, `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET` are all valid.
2. App scopes include `files.metadata.read`, `sharing.read`, `sharing.write`.
3. Token belongs to the intended Dropbox app/workspace.

### `Invalid Dropbox folder URL`

Use a shared folder URL format like `https://www.dropbox.com/scl/fo/...`.

### Empty image list

Check:

1. Folder is publicly shared.
2. Folder contains supported image file extensions.
3. Files are accessible in the same Dropbox account context as the API credentials.
