import { utils } from 'ethers'
const { parseUnits, formatUnits } = utils
import moment from 'moment'
import { fn, getSquid } from '/utils'
import { veTokenContract } from '/constants/contract'
const LIMIT = 1000

export default fn(
  async ({ timestamp, top }) => {
    timestamp = +timestamp || moment().unix()
    top = +top || 100

    const query = `{
      veHolders(offset: 0, limit: ${LIMIT}) { id }
      veHoldersConnection(orderBy:id_ASC) { totalCount }
    }`
    const result = await getSquid(query)
    let idList = result?.data?.veHolders || []
    const cnt = result?.data?.veHoldersConnection?.totalCount || 0
    if (!cnt) return { list: [] }

    if (cnt > LIMIT) {
      const offsets = []
      const page = ~~(cnt / LIMIT)
      for (let i = 1; i <= page; i++) offsets.push(i * LIMIT)
      const res = await Promise.all(offsets.map(offset => getSquid(`{ veHolders(offset: ${offset}, limit: ${LIMIT}) { id } }`)))
      res.map(i => (idList = idList.contat(i?.data?.veHolders || [])))
    }

    const list = []
    await Promise.all(
      idList.map(i =>
        veTokenContract['balanceOf(address,uint256)'](i.id, timestamp)
          .then(res => list.push({ address: i.id, balance: res }))
          .catch(err => console.error('balanceOf', err))
      )
    )
    if (!list.length) return { list: [] }

    const listDesc = list.sort((a, b) => +formatUnits(parseUnits(b.balance, 0).sub(a.balance)))
    const data = listDesc.slice(0, top)

    return { list: data }
  },
  { maxAge: 3600 } // one hour
)
