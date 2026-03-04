/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.theberlin.church',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  // 👇 This disables locale prefixing in sitemap
  trailingSlash: false,
  alternateRefs: [], // <- this disables hreflang/locale alt links
  exclude: [
    '/admin',
    '/admin/**',
    '/blog',
    '/blog/**',
    '/preview',
    '/header',
    '/footer',
  ],
}
