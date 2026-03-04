module.exports = {
  async redirects() {
    const rules = []
    const addForOldHosts = (source, destination) => {
      rules.push(
        {
          source,
          has: [{ type: 'host', value: 'londonchurch.org.uk' }],
          destination,
          permanent: true,
        },
        {
          source,
          has: [{ type: 'host', value: 'www.londonchurch.org.uk' }],
          destination,
          permanent: true,
        }
      )
    }

    // --- Specific 1→1 mappings (put BEFORE catch-alls) ---
    addForOldHosts('/meetings', 'https://thelondon.church/events')
    addForOldHosts('/events-2', 'https://thelondon.church/events')
    addForOldHosts('/about-us', 'https://thelondon.church/about')
    addForOldHosts('/what-we-believe', 'https://thelondon.church/about')
    addForOldHosts('/five-core-convictions', 'https://thelondon.church/about')
    addForOldHosts('/leadership', 'https://thelondon.church/team')
    addForOldHosts('/students', 'https://thelondon.church/campus')
    addForOldHosts('/singles', 'https://thelondon.church/thenetwork')
    addForOldHosts('/arts-media-sports-ams', 'https://thelondon.church/ams')
    addForOldHosts('/arts-media-sports', 'https://thelondon.church/ams')
    addForOldHosts('/womens-ministry', 'https://thelondon.church/women')
    addForOldHosts('/youth-teens', 'https://thelondon.church/teens')
    addForOldHosts('/give-online', 'https://thelondon.church/give')
    addForOldHosts('/church-donation', 'https://thelondon.church/give')
    addForOldHosts('/category/gallery', 'https://thelondon.church/events')
    addForOldHosts('/family-of-churches', 'https://thelondon.church/sunday')
    addForOldHosts('/gmc2025', 'https://thelondon.church/gmc')
    addForOldHosts('/worship-service', 'https://thelondon.church/sunday')
    addForOldHosts('/meet-the-sheperds', 'https://thelondon.church/team')
    addForOldHosts('/bible-talks', 'https://thelondon.church/events')
    addForOldHosts(
      '/meet-the-williamsons',
      'https://thelondon.church/meet-the-williamsons'
    )
    addForOldHosts(
      '/baptism-why-all-the-confusion',
      'https://thelondon.church/about'
    )
    addForOldHosts('/contact-us', 'https://www.thelondon.church/study')

    // Optional buckets to home (okay if intentional)
    addForOldHosts('/latest-sermons', 'https://thelondon.church/')
    addForOldHosts('/audio', 'https://thelondon.church/')
    addForOldHosts('/books', 'https://thelondon.church/')

    // --- Host-based catch-alls (both old hosts) ---
    // apex
    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value: 'londonchurch.org.uk' }],
      destination: 'https://thelondon.church/:path*',
      permanent: true,
    })
    // www
    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value: 'www.londonchurch.org.uk' }],
      destination: 'https://thelondon.church/:path*',
      permanent: true,
    })

    return rules
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  transpilePackages: ['@bazel-digital/ark-ui'],
}
