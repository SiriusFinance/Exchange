import memoize from 'memoizee'
import { utils } from 'ethers'
const { parseUnits, formatUnits } = utils
import moment from 'moment'
import { getGraph } from '/utils'
import { veTokenContract } from '/constants/contract'
const LIMIT = 1000

const leaderboard = memoize(
  async timestamp => {
    timestamp = +timestamp || moment().unix()

    const query = `{
      veHolders(offset: 0, limit: ${LIMIT}) { id }
      veHoldersConnection(orderBy:id_ASC) { totalCount }
    }`
    const result = await getGraph(query)
    let idList = result?.data?.veHolders || []
    const cnt = result?.data?.veHoldersConnection?.totalCount || 0
    if (!cnt) return { list: [], totalCount: 0 }

    if (cnt > LIMIT) {
      const offsets = []
      const page = Math.floor(cnt / LIMIT)
      for (let i = 1; i <= page; i++) offsets.push(i * LIMIT)
      const res = await Promise.all(offsets.map(offset => getGraph(`{ veHolders(offset: ${offset}, limit: ${LIMIT}) { id } }`)))
      res.map(i => (idList = idList.concat(i?.data?.veHolders || [])))
    }

    const list = []
    await Promise.all(
      idList.map(i =>
        veTokenContract['balanceOf(address,uint256)'](i.id, timestamp)
          .then(res => list.push({ address: i.id, balance: (res || Zero).toString() }))
          .catch(err => console.error('balanceOf', err))
      )
    )
    if (!list.length) return { list: [], totalCount: cnt }

    const listDesc = list.sort((a, b) => +formatUnits(parseUnits(b.balance, 0).sub(a.balance)))

    return { list: listDesc, totalCount: cnt }
  },
  {
    promise: true,
    maxAge: 36e5 // one hour
  }
)

export default leaderboard
