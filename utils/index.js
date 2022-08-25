import { utils } from 'ethers'
const { parseUnits } = utils
import { pools, coins, GRAPH_URL } from '/constants'

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
