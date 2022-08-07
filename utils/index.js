import { utils } from 'ethers'
const { parseUnits } = utils
import { pools, coins } from '../constants'

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
