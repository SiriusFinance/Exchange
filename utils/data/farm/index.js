import memoize from 'memoizee'
import { constants } from 'ethers'
const { Zero } = constants
import { srsContract, gaugeControllerContract } from '/constants/contract'
import { getLastThursday } from '/utils'
const ONE_MINUTE = 6e4
const ONE_HOUR = 36e5

export const getSrsRate = memoize(async () => await srsContract?.rate(), { promise: true, maxAge: ONE_HOUR })

// GaugeRelativeWeight
export const getGRW = memoize(
  async (farmAddress, time) => {
    try {
      if (!farmAddress) return Zero
      time = time || getLastThursday().unix()
      return await gaugeControllerContract?.gaugeRelativeWeight(farmAddress, time)
    } catch (err) {
      console.error('getGRW', err)
      return Zero
    }
  },
  { promise: true, maxAge: ONE_MINUTE }
)
