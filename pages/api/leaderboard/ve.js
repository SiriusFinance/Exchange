import moment from 'moment'
import { fn } from '/utils'
import veLdb from '/utils/data/leaderboard/ve'

export default fn(
  async ({ timestamp, offset, limit, all, gl0 }) => {
    timestamp = +timestamp || moment({ hour: new Date().getHours() }).unix()
    offset = +offset || 0
    limit = +limit || 100

    const res = await veLdb(timestamp)
    let list = res.list.slice(offset, offset + limit)
    let totalCount = res.totalCount

    if (all) list = res.list

    // greater than 0
    if (gl0) {
      const index = res.list.findIndex(i => i.balance == '0')
      if (index > -1) totalCount = index + 1
      const index2 = list.findIndex(i => i.balance == '0')
      if (index2 > -1) list = list.slice(0, index2)
    }

    return { list, totalCount }
  },
  { maxAge: 3600 } // one hour
)
