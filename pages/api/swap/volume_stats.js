import { utils, constants } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import moment from 'moment'
import { fn, removeExtraDecimal } from '/utils'
import { getAddresses, poolDailyVolumes } from '/utils/data/swap'

export default fn(
  async () => {
    const swaps = await getAddresses()
    if (!swaps?.length) return { list: [] }

    const d30 = moment().subtract(30, 'd')
    const d7 = moment().subtract(7, 'd')
    const d1 = moment().subtract(1, 'd')
    const list = []

    await Promise.all(
      swaps.map(async i => {
        const res = await poolDailyVolumes(i.address)
        if (!res?.list?.length) return

        let last24h = Zero
        let last7d = Zero
        let lastMonth = Zero
        let total = Zero

        res.list.map(j => {
          const bn = parseUnits(removeExtraDecimal(j.volume))
          const time = moment.unix(j.timestamp)

          total = total.add(bn)
          if (time.isAfter(d30)) {
            lastMonth = lastMonth.add(bn)
            if (time.isAfter(d7)) {
              last7d = last7d.add(bn)
              if (time.isAfter(d1)) last24h = last24h.add(bn)
            }
          }
        })

        list.push({
          address: i.address,
          last24h: formatUnits(last24h),
          last7d: formatUnits(last7d),
          lastMonth: formatUnits(lastMonth),
          total: formatUnits(total)
        })
      })
    )

    return { list }
  },
  { maxAge: 300 } // 5 minutes
)
