export const coins = {
  // stable
  dai: {
    id: 'dai',
    geckoId: 'dai',
    symbol: 'DAI',
    decimals: 18,
    address: '0x6De33698e9e9b787e09d3Bd7771ef63557E148bb'
  },
  usdc: {
    id: 'usdc',
    geckoId: 'usd-coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98'
  },
  usdt: {
    id: 'usdt',
    geckoId: 'tether',
    symbol: 'USDT',
    decimals: 6,
    address: '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283'
  },
  busd: {
    id: 'busd',
    geckoId: 'binance-usd',
    symbol: 'BUSD',
    decimals: 18,
    address: '0x4Bf769b05E832FCdc9053fFFBC78Ca889aCb5E1E'
  },
  // starlay
  ldai: {
    id: 'ldai',
    geckoId: 'dai',
    symbol: 'lDAI',
    decimals: 18,
    address: '0x4dd9c468A44F3FEF662c35c1E9a6108B70415C2c'
  },
  lusdc: {
    id: 'lusdc',
    geckoId: 'usd-coin',
    symbol: 'lUSDC',
    decimals: 18,
    address: '0xc404e12d3466accb625c67dbab2e1a8a457def3c'
  },
  lusdt: {
    id: 'lusdt',
    geckoId: 'tether',
    symbol: 'lUSDT',
    decimals: 18,
    address: '0x430D50963d9635bBef5a2fF27BD0bDDc26ed691F'
  },
  lbusd: {
    id: 'lbusd',
    geckoId: 'binance-usd',
    symbol: 'lBUSD',
    decimals: 18,
    address: '0xb7aB962c42A8Bb443e0362f58a5A43814c573FFb'
  },
  astr: {
    id: 'astr',
    geckoId: 'astar',
    symbol: 'ASTR',
    decimals: 18,
    address: '0xaeaaf0e2c81af264101b9129c00f4440ccf0f720'
  },
  nastr: {
    id: 'nastr',
    geckoId: 'astar',
    symbol: 'nASTR',
    decimals: 18,
    address: '0xE511ED88575C57767BAfb72BfD10775413E3F2b0'
  },
  bai: {
    id: 'bai',
    geckoId: 'bai-stablecoin',
    symbol: 'BAI',
    decimals: 18,
    address: '0x733ebcC6DF85f8266349DEFD0980f8Ced9B45f35'
  },
  jpyc: {
    id: 'jpyc',
    geckoId: 'jpy-coin',
    symbol: 'JPYC',
    decimals: 18,
    address: '0x431d5dff03120afa4bdf332c61a6e1766ef37bdb'
  },
  wbtc: {
    id: 'wbtc',
    geckoId: 'wrapped-bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    address: '0xad543f18cff85c77e140e3e5e3c3392f6ba9d5ca'
  },
  weth: {
    id: 'weth',
    geckoId: 'weth',
    symbol: 'WETH',
    decimals: 18,
    address: '0x81ecac0d6be0550a00ff064a4f9dd2400585fe9c'
  },
  wbnb: {
    id: 'wbnb',
    geckoId: 'wbnb',
    symbol: 'WBNB',
    decimals: 18,
    address: '0x7f27352d5f83db87a5a3e00f4b07cc2138d8ee52'
  },
  ousd: {
    id: 'ousd',
    geckoId: 'nusd',
    symbol: 'oUSD',
    decimals: 18,
    address: '0x29F6e49c6E3397C3A84F715885F9F233A441165C'
  }
}
export default coins

export const stableCoins = [coins.dai, coins.usdc, coins.usdt, coins.busd]
