# I AM Amsterdam

Dutch Ark Sites website for the Amsterdam International Christian Church. Based on the published Template Church composition and shared `@bazel-digital/ark-ui` bricks.

- React Bricks app: `ab6a1490-46af-4acc-868c-a34860a4b56c`, main environment, Dutch (`nl`).
- Vercel project: `the-amsterdam-church`, root `apps/theamsterdamchurch`, Node.js 22.
- Website: https://the-amsterdam-church-ews-techs-projects.vercel.app
- Editor: `/admin`.

Copy `.env.example` to `.env.local` and supply this app's own `NEXT_PUBLIC_APP_ID` and `API_KEY`. Run `npm run dev:amsterdam` or `npm run build:amsterdam` from the repository root.

## Content and sources

Dutch page content is managed in the church’s own React Bricks app. Local content exports are excluded from Git.

Amsterdam facts and assets were checked on 28 October 2026:

- https://iamsterdamkerk.nl/ — church identity, community photographs and circular I AM logo.
- https://iamsterdamkerk.nl/contact/ — Frank and Genae Simelane, current contact details, language and visiting information.
- https://iamsterdamkerk.nl/events/ — Sunday 11:00, Wednesday 19:30 and Friday student gathering 19:30. Locations may vary.
- https://iamsterdamkerk.nl/leadership/ — leadership background and photograph.
- https://iamsterdamkerk.nl/donate/ — verified SumUp destination, RSIN and financial documents.

The Zuiderkerk address is explicitly dated **1 November 2026**. Confirm future venues before updating the editable page content. The older Amstelveen footer address is not presented as a worship venue. Financial documents, safeguarding and privacy information remain linked to the existing site.

The circular logo is used for editor branding, navigation, footer and browser icons. The editor side image shows five congregation members inside the church (`DSCF1261.jpg` from the existing website). Content photos are copied into Amsterdam's own React Bricks media library during setup. Neutral background graphics and MERCY images retain the template composition.

This Vercel staging site retains `noindex, nofollow` and a disallowing robots.txt until the church is ready for a domain launch. No custom domain has been connected.
