import { utils, constants, Contract } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import moment from 'moment'
import { fn, getGraph, removeExtraDecimal } from '/utils'
import XSwapAbi from '/constants/abis/XSwap.json'
import XSwapDepositAbi from '/constants/abis/XSwapDeposit.json'
import { provider } from '/constants/contract'
const FEE_DECIMALS = 10

const JPYC_METAPOOL = '0x3cd1Fa4EeeFdf6c30E66c66A474e8E4dd509f54c'
const WBTC_METAPOOL = '0xD25Cf814EeE54840A08Db8dfAbFE445B1DE37f0f'
const WETH_METAPOOL = '0x2d5Da7c463B3E8f4CF1AF08a1aA0a5DB9BB644F7'
const WBNB_METAPOOL = '0xC9d4f937Fa8e0193b46817a41435a262867ff090'
const metaPools = [JPYC_METAPOOL, WBTC_METAPOOL, WETH_METAPOOL, WBNB_METAPOOL].map(i => i.toLowerCase())

const getFee = async poolAddress => {
  if (!metaPools.includes(poolAddress)) return Zero
  const swapDepositContract = new Contract(poolAddress, XSwapDepositAbi, provider)
  const swapContract = new Contract(await swapDepositContract.META_POOL(), XSwapAbi, provider)
  return await swapContract.fee()
}

export default fn(
  async () => {
    const query = '{swaps { address tvl apy }}'
    const res = await getGraph(query)
    const swaps = res?.data?.swaps
    if (!swaps?.length) return { data: {} }

    const d1 = moment().subtract(1, 'd')
    const obj = {}

    await Promise.all(
      swaps.map(async i => {
        let last24h = Zero
        let apy = i.apy ? parseUnits(removeExtraDecimal(i.apy)) : Zero

        const query = `{
          dailyVolumes(orderBy: timestamp_DESC, limit: 2, where: {swap: {id_eq: "${i.address}"}}) {
            timestamp
            volume
          }
        }`
        const res = await getGraph(query)
        const list = res?.data?.dailyVolumes || []
        list.map(j => {
          const volume = parseUnits(removeExtraDecimal(j.volume))
          const time = moment.unix(j.timestamp)
          if (time.isAfter(d1)) last24h = last24h.add(volume)
        })

        if (apy.gt(Zero)) {
          // not handle
        } else if (i.tvl == 0) {
          apy = Zero
        } else {
          // for crypto metapools only
          const fee = await getFee(i.address)
          const tvl = parseUnits(removeExtraDecimal(i.tvl))
          apy = last24h
            .mul(365)
            .mul(fee)
            .mul(parseUnits('1', 18 - FEE_DECIMALS))
            .div(tvl)
        }

        obj[i.address] = {
          oneDayVolume: formatUnits(last24h),
          TVL: i.tvl,
          APY: formatUnits(apy)
        }
      })
    )

    return { data: obj }
  },
  { maxAge: 180 } // 3 minutes
)
