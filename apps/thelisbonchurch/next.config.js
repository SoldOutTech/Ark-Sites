const path = require('path')

module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  transpilePackages: ['@bazel-digital/ark-ui'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}
