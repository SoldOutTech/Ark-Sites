# Igreja Cristã Internacional de Lisboa

Lisbon church site based on the Ark Sites template. The React Bricks app is `abe88206-b21d-44cc-a473-874da2205bbc`; its editor is at `/admin`. Portuguese page content is managed in the church’s own React Bricks app. Local content exports are excluded from Git. The app currently uses the React Bricks `en` content slot, while the document language is Portuguese.

Copy `.env.example` to `.env.local` and provide the app ID and its own React Bricks read `API_KEY`. From the repository root, run `npm run dev:lisbon` or `npm run build:lisbon`. The Vercel project is `the-lisbon-church` in EWS Tech’s projects, rooted at `apps/thelisbonchurch`. The initial deployment was uploaded from local source; connect the repository for automatic deployments after the changes are reviewed and merged. The starter retains noindex until launch.

The circular logo and admin welcome photograph come from the church’s [Facebook page](https://www.facebook.com/icilisboa). The SVG logo embeds the original Facebook image with a circular clip, preserving the artwork and transparent corners. The original community image comes from Instagram. The profile states that Sunday service is at 10:00 and the venue is posted in its feed. Confirm the schedule, venue, imagery and all content with the church before public launch.
