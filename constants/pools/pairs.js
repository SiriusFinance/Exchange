const pairs = [
  // 4Pool
  {
    pool_id: '0x417E9d065ee22DFB7CC6C63C403600E27627F333',
    ticker_id: 'DAI_USDC'
  },
  {
    pool_id: '0x417E9d065ee22DFB7CC6C63C403600E27627F333',
    ticker_id: 'USDT_USDC'
  },
  {
    pool_id: '0x417E9d065ee22DFB7CC6C63C403600E27627F333',
    ticker_id: 'BUSD_USDC'
  },
  // nASTR/ASTR Pool
  {
    pool_id: '0xEEa640c27620D7C448AD655B6e3FB94853AC01e3',
    ticker_id: 'ASTR_nASTR'
  },
  // BAI Metapool
  {
    pool_id: '0xD18aD1e2992Da974b5A8d69377e6aB3b16e30F29',
    ticker_id: 'BAI_DAI'
  },
  {
    pool_id: '0xD18aD1e2992Da974b5A8d69377e6aB3b16e30F29',
    ticker_id: 'BAI_USDC'
  },
  {
    pool_id: '0xD18aD1e2992Da974b5A8d69377e6aB3b16e30F29',
    ticker_id: 'BAI_USDT'
  },
  {
    pool_id: '0xD18aD1e2992Da974b5A8d69377e6aB3b16e30F29',
    ticker_id: 'BAI_BUSD'
  },
  // JPYC Metapool
  {
    pool_id: '0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c',
    ticker_id: 'JPYC_DAI'
  },
  {
    pool_id: '0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c',
    ticker_id: 'JPYC_USDC'
  },
  {
    pool_id: '0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c',
    ticker_id: 'JPYC_USDT'
  },
  {
    pool_id: '0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c',
    ticker_id: 'JPYC_BUSD'
  },
  // WBTC Metapool
  {
    pool_id: '0xD25Cf814EeE54840A08Db8dfAbFE445B1DE37f0f',
    ticker_id: 'WBTC_DAI'
  },
  {
    pool_id: '0xD25Cf814EeE54840A08Db8dfAbFE445B1DE37f0f',
    ticker_id: 'WBTC_USDC'
  },
  {
    pool_id: '0xD25Cf814EeE54840A08Db8dfAbFE445B1DE37f0f',
    ticker_id: 'WBTC_USDT'
  },
  {
    pool_id: '0xD25Cf814EeE54840A08Db8dfAbFE445B1DE37f0f',
    ticker_id: 'WBTC_BUSD'
  },
  // WETH Metapool
  {
    pool_id: '0x2d5Da7c463B3E8f4CF1AF08a1aA0a5DB9BB644F7',
    ticker_id: 'WETH_DAI'
  },
  {
    pool_id: '0x2d5Da7c463B3E8f4CF1AF08a1aA0a5DB9BB644F7',
    ticker_id: 'WETH_USDC'
  },
  {
    pool_id: '0x2d5Da7c463B3E8f4CF1AF08a1aA0a5DB9BB644F7',
    ticker_id: 'WETH_USDT'
  },
  {
    pool_id: '0x2d5Da7c463B3E8f4CF1AF08a1aA0a5DB9BB644F7',
    ticker_id: 'WETH_BUSD'
  },
  // WBNB Metapool
  {
    pool_id: '0xC9d4f937Fa8e0193b46817a41435a262867ff090',
    ticker_id: 'WBNB_DAI'
  },
  {
    pool_id: '0xC9d4f937Fa8e0193b46817a41435a262867ff090',
    ticker_id: 'WBNB_USDC'
  },
  {
    pool_id: '0xC9d4f937Fa8e0193b46817a41435a262867ff090',
    ticker_id: 'WBNB_USDT'
  },
  {
    pool_id: '0xC9d4f937Fa8e0193b46817a41435a262867ff090',
    ticker_id: 'WBNB_BUSD'
  },
  // oUSD Metapool
  {
    pool_id: '0x535406b90E8Df2Cf2168E8579ea3d1D7A0e0AdDC',
    ticker_id: 'oUSD_DAI'
  },
  {
    pool_id: '0x535406b90E8Df2Cf2168E8579ea3d1D7A0e0AdDC',
    ticker_id: 'oUSD_USDC'
  },
  {
    pool_id: '0x535406b90E8Df2Cf2168E8579ea3d1D7A0e0AdDC',
    ticker_id: 'oUSD_USDT'
  },
  {
    pool_id: '0x535406b90E8Df2Cf2168E8579ea3d1D7A0e0AdDC',
    ticker_id: 'oUSD_BUSD'
  }
]

pairs.map(i => {
  const [base, target] = i.ticker_id.split('_')
  i.base = base
  i.target = target
})

export default pairs
