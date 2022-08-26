import moment from 'moment'
import { fn } from '/utils'
import avaultLp from '/utils/data/leaderboard/avault_lp'

export default fn(
  async ({ timestamp, offset, limit, all, gt0 }) => {
    timestamp = +timestamp || moment().unix()
    offset = +offset || 0
    limit = +limit || 100

    const res = await avaultLp(timestamp)
    let list = res.list.slice(offset, offset + limit)
    let totalCount = res.totalCount

    if (all) list = res.list

    // greater than 0
    if (gt0) {
      const index = res.list.findIndex(i => i.balance == '0')
      if (index > -1) totalCount = index + 1
      const index2 = list.findIndex(i => i.balance == '0')
      if (index2 > -1) list = list.slice(0, index2)
    }

    return { list, totalCount }
  },
  { maxAge: 300 } // 5 minutes
)
