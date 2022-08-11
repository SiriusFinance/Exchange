import moment from 'moment'
import { fn } from '/utils'
import veLdb from '/utils/data/leaderboard/ve'

export default fn(
  async ({ timestamp, offset, limit }) => {
    timestamp = +timestamp || moment({ hour: new Date().getHours() }).unix()
    offset = +offset || 0
    limit = +limit || 100

    const res = await veLdb(timestamp)
    const list = res.list.slice(offset, offset + limit)
    return { list, totalCount: res.totalCount }
  },
  { maxAge: 3600 } // one hour
)
