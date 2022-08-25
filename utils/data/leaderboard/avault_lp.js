import memoize from 'memoizee'
import { utils, constants } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import moment from 'moment'
import { getGraph } from '/utils'
const LIMIT = 1000
const AVAULT_ADDRESS = '0xd8bc543273b0e19eed34a295614963720c89f9e4'

const avault_lp = memoize(
  async timestamp => {
    timestamp = +timestamp || moment().unix()

    const qStr = offset => `
      swapEvents(orderBy: timestamp_ASC, offset: ${offset}, limit: ${LIMIT}, where: {timestamp_lte: ${timestamp}, swap: {id_eq: "${AVAULT_ADDRESS}"}}) {
        id
        data {
          ... on AddLiquidityEventData {
            provider
            tokenAmounts
          }
          ... on RemoveLiquidityEventData {
            provider
            tokenAmounts
          }
        }
      }`
    const query = `{
      swapEventsConnection(orderBy: id_ASC) { totalCount }
      ${qStr(0)}
    }`
    const result = await getGraph(query)
    const cnt = result?.data?.swapEventsConnection?.totalCount || 0
    let list1 = result?.data?.swapEvents || []
    if (!cnt) return { list: [], totalCount: 0 }

    if (cnt > LIMIT) {
      const offsets = []
      const page = Math.floor(cnt / LIMIT)
      for (let i = 1; i <= page; i++) offsets.push(i * LIMIT)
      const res = await Promise.all(offsets.map(offset => getGraph(`{ ${qStr(offset)} }`)))
      res.map(i => (list1 = list1.concat(i?.data?.swapEvents || [])))
    }

    const obj = {}
    list1.map(i => {
      const address = i.data.provider
      let bal = obj[address] || Zero

      if (i.id.startsWith('remove_liquidity')) {
        bal = i.data.tokenAmounts.reduce((sum, num) => sum.sub(parseUnits(num, 0)), bal)
      } else {
        bal = i.data.tokenAmounts.reduce((sum, num) => sum.add(parseUnits(num, 0)), bal)
      }
      obj[address] = bal
    })

    const list = []
    Object.keys(obj).map(k => list.push({ address: k, balance: formatUnits(obj[k]) }))
    const listDesc = list.sort((a, b) => +b.balance - +a.balance)

    return { list: listDesc, totalCount: listDesc.length }
  },
  {
    promise: true,
    maxAge: 3e5 // 5 minutes
  }
)

export default avault_lp
