import memoize from 'memoizee'
import { utils } from 'ethers'
const { parseUnits } = utils
import moment from 'moment'
import { pools, coins, GRAPH_URL, GECKO_URL } from '/constants'
import { PoolTypes } from '/constants/pools'
const ONE_MINUTE = 6e4

export * from './api'

export const getCoinIndex = (pool_id, symbol) => {
  const pool = pools.find(i => (i.addresses.deposit || i.addresses.swap).toLowerCase() == pool_id.toLowerCase())
  if (!pool) throw 'pool is not found by pool_id'
  return pool.coins.findIndex(i => i.symbol == symbol)
}

export const getCoinDecimals = symbol => {
  const coin = Object.values(coins).find(i => i.symbol == symbol)
  if (!coin) throw 'coin is not found by symbol'
  return coin.decimals
}

// cast to 18 decimals
export const castTo18 = (bn, decimals) =>
  parseUnits('10', 0)
    .pow(18 - decimals)
    .mul(bn)

// Fix BN conversion error caused by decimal place greater than 18 digits
export const removeExtraDecimal = num => {
  num = num.toString() || '0'
  const extraDecimal = (num.split('.')[1] || '0').length - 18
  if (extraDecimal > 0) num = num.slice(0, -extraDecimal)
  return num
}

export const getGraph = async query =>
  await (
    await fetch(GRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
  ).json()

// Zero time of this Thursday or last Thursday
export function getLastThursday() {
  const now = moment().utc()
  const day = now.day()
  // Whether today is less than Thursday
  const ltThu = day < 4
  return now.subtract(ltThu ? day + 3 : day - 4, 'd').startOf('day')
}

// Zero time of this Thursday or next Thursday
export function getUpcomingThursday() {
  const now = moment().utc()
  const day = now.day()
  const ltThu = day < 4
  return now.add((ltThu ? 4 : 11) - day, 'd').startOf('day')
}

export const getCoinPrice = memoize(
  async symbol => {
    const coin = Object.values(coins).find(i => i.symbol == symbol && i.geckoId)
    if (!coin) throw 'coin is not found by symbol'

    const url = `${GECKO_URL}/simple/price?ids=${coin.geckoId}&vs_currencies=usd`
    const res = await (await fetch(url)).json()
    return res[coin.geckoId]?.usd || 0
  },
  { promise: true, maxAge: ONE_MINUTE }
)

export const getTokenSymbolForPoolType = poolType => (poolType === PoolTypes.ETH ? 'WETH' : poolType === PoolTypes.USD ? 'USDC' : '')
