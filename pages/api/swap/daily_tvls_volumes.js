import { fn } from '/utils'
import { getAddresses, poolDailyTvls, poolDailyVolumes } from '/utils/data/swap'

export default fn(
  async () => {
    const swaps = await getAddresses()
    if (!swaps?.length) return { list: [] }

    const list = []
    await Promise.all(
      swaps.map(async i => {
        const [res1, res2] = await Promise.all([poolDailyTvls(i.address), poolDailyVolumes(i.address)])
        list.push({
          address: i.address,
          dailyTvls: res1?.list || [],
          dailyVolumes: res2?.list || []
        })
      })
    )

    return { list }
  },
  { maxAge: 300 } // 5 minutes
)
