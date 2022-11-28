import { pools } from '/constants'
import { fn, getUpcomingThursday } from '/utils'
import { getBaseAprData, getExtraRewards } from '/utils/data/farm'

export default fn(
  async () => {
    const availablePools = pools.filter(i => i?.addresses?.gauge)
    const upcomThu = getUpcomingThursday().unix()

    const farms = await Promise.all(
      availablePools.map(async pool => {
        const [res1, res2, res3] = await Promise.all([getBaseAprData(pool.name), getBaseAprData(pool.name, upcomThu), getExtraRewards(pool.name)])
        return {
          contract: pool.addresses.gauge,
          name: pool.name,
          tvl: res1.tvl,
          baseApr: res1.baseApr,
          rewardRate: res1.rewardRate,
          rewardSrsPerDay: res1.rewardSrsPerDay,
          baseAprUpcom: res2.baseApr,
          rewardRateUpcom: res2.rewardRate,
          rewardSrsPerDayUpcom: res2.rewardSrsPerDay,
          extraRewards: res3
        }
      })
    )

    return { farms }
  },
  { maxAge: 300 } // 5 minutes
)
