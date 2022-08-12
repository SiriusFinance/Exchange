module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS,HEAD' }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/symbol_detail',
        destination: '/symbol_detail/BTC',
        permanent: false
      }
    ]
  }
}
