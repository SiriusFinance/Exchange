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
  },
  srs4: {
    id: 'srs4',
    geckoId: 'binance-usd',
    symbol: '4SRS',
    decimals: 18,
    address: '0xB6Df5baFdcDCE7AEb49af6172143E1942999ef14'
  },
  srs: {
    id: 'srs',
    geckoId: 'sirius-finance',
    symbol: 'SRS',
    decimals: 18,
    address: '0x9448610696659de8F72e1831d392214aE1ca4838'
  },
  oru: {
    id: 'oru',
    geckoId: 'orcus-ousd',
    symbol: 'ORU',
    decimals: 18,
    address: '0xCdB32eEd99AA19D39e5d6EC45ba74dC4afeC549F'
  },
  pusdt: {
    id: 'pusdt',
    geckoId: 'tether',
    symbol: 'USDT',
    decimals: 6,
    address: '0xFFFFFFFF000000000000000000000001000007C0'
  }
}
export default coins

export const stableCoins = [coins.dai, coins.usdc, coins.usdt, coins.busd]

export const stableSwapCoin = coins.srs4

export const extraCoins = [coins.srs, coins.oru]
