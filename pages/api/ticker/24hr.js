import { utils, constants } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import moment from 'moment'
import { pairs, GRAPH_URL } from '/constants'
import { fn, getCoinIndex, getCoinDecimals, castTo18 } from '/utils'

const getTicker = async ticker_id => {
  if (!ticker_id) throw 'ticker_id is required'

  const pair = pairs.find(i => i.ticker_id == ticker_id)
  if (!pair) throw 'pair is not found by ticker_id'

  const pool_id = pair.pool_id.toLowerCase()
  const base_id = getCoinIndex(pool_id, pair.base)
  const target_id = getCoinIndex(pool_id, pair.target)

  let ticker = {
    pool_id,
    ticker_id,
    base_currency: pair.base,
    target_currency: pair.target
  }

  const yesterday = moment().subtract(1, 'd').unix()
  const query = `{
    tokenExchanges(orderBy: timestamp, orderDirection: desc, first: 1000, where: {
      swap: "${pool_id}",
      soldId: ${base_id},
      boughtId: ${target_id},
      timestamp_gte: ${yesterday}
    }) {
      soldId
      boughtId
      tokensSold
      tokensBought
      timestamp
      swap { id }
    }
  }`
  const result = await (await fetch(GRAPH_URL, { method: 'POST', body: JSON.stringify({ query }) })).json()
  const tokenExchanges = result?.data?.tokenExchanges
  if (!tokenExchanges?.length) return ticker

  const { tokensSold, tokensBought } = tokenExchanges[0]
  const decimal0 = getCoinDecimals(pair.base)
  const decimal1 = getCoinDecimals(pair.target)

  const base_bn = castTo18(tokensSold, decimal0)
  const target_bn = castTo18(tokensBought, decimal1)
  const last_price = base_bn.isZero() ? Zero : parseUnits('1').mul(target_bn).div(base_bn)

  let base_volume = Zero
  let target_volume = Zero
  let high = Zero
  let low = null

  tokenExchanges.map(i => {
    const base_bn = castTo18(i.tokensSold, decimal0)
    const target_bn = castTo18(i.tokensBought, decimal1)
    base_volume = base_volume.add(base_bn)
    target_volume = target_volume.add(target_bn)
    const price = base_bn.isZero() ? Zero : parseUnits('1').mul(target_bn).div(base_bn)
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
  {
    maxAge: 60 // 1 min
  }
)
