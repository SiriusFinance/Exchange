import { utils, constants } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import moment from 'moment'
import { pairs } from '/constants'
import { fn, getCoinIndex, getCoinDecimals, castTo18, getGraph } from '/utils'

const getTicker = async ticker_id => {
  if (!ticker_id) throw 'ticker_id is required'

  const pair = pairs.find(i => i.ticker_id == ticker_id)
  if (!pair) throw 'pair is not found by ticker_id'

  const pool_id = pair.pool_id.toLowerCase()
  const base_id = getCoinIndex(pool_id, pair.base)
  const target_id = getCoinIndex(pool_id, pair.target)
  const base_decimals = getCoinDecimals(pair.base)
  const target_decimals = getCoinDecimals(pair.target)

  let ticker = {
    pool_id: pair.pool_id,
    ticker_id,
    base_currency: pair.base,
    target_currency: pair.target,
    base_decimals,
    target_decimals
  }

  const yesterday = moment().subtract(1, 'd').unix()
  const query = `{
    exchanges(orderBy: timestamp_DESC, limit: 1000, where: {
      timestamp_gte: ${yesterday},
      swap: {id_eq: "${pool_id}" },
      AND: {OR: [
        {data: { soldId_eq: ${base_id}, boughtId_eq: ${target_id} }}
        {data: { soldId_eq: ${target_id}, boughtId_eq: ${base_id} }}
      ]}
    }) {
      timestamp
      swap { id }
      data {
        ... on TokenExchangeData {
          boughtId
          soldId
          tokensSold
          tokensBought
        }
      }
    }
  }`
  const result = await getGraph(query)

  const exchanges = result?.data?.exchanges
  if (!exchanges?.length) return ticker

  const getVolumeAndPrice = data => {
    const baseIsSold = data.soldId == base_id
    const base_bn = baseIsSold ? castTo18(data.tokensSold, base_decimals) : castTo18(data.tokensBought, base_decimals)
    const target_bn = baseIsSold ? castTo18(data.tokensBought, target_decimals) : castTo18(data.tokensSold, target_decimals)
    const price = base_bn.isZero() ? Zero : parseUnits('1').mul(target_bn).div(base_bn)
    return [base_bn, target_bn, price]
  }

  const [last_base, last_target, last_price] = getVolumeAndPrice(exchanges[0].data)

  let base_volume = Zero
  let target_volume = Zero
  let high = Zero
  let low = null

  exchanges.map(i => {
    const [base_bn, target_bn, price] = getVolumeAndPrice(i.data)
    base_volume = base_volume.add(base_bn)
    target_volume = target_volume.add(target_bn)
    if (price.gt(high)) high = price
    if (!low || price.lt(low)) low = price
  })
  if (!low) low = Zero

  ticker = {
    ...ticker,
    last_price: formatUnits(last_price),
    base_volume: formatUnits(base_volume),
    target_volume: formatUnits(target_volume),
    high: formatUnits(high),
    low: formatUnits(low)
  }

  return ticker
}

export default fn(
  async ({ ticker_id }) => {
    if (ticker_id) {
      const ticker = await getTicker(ticker_id)
      return { tickers: [ticker] }
    }

    const tickers = await Promise.all(pairs.map(i => getTicker(i.ticker_id)))
    return { tickers }
  },
  { maxAge: 60 } // 1 min
)
