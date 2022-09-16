import memoize from 'memoizee'
import { utils, constants, Contract } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import { pools, isMetaPool, isCryptoPool, isNativePool, isXTriSwapPool } from '/constants/pools'
import { coins } from '/constants/coins'
import { provider, srsContract, gaugeControllerContract, arthRouterContract } from '/constants/contract'
import ERC20Abi from '/constants/abis/ERC20.json'
import metaSwapAbi from '/constants/abis/metaSwap.json'
import cryptoMetapoolAbi from '/constants/abis/Cryptometapool.json'
// import XTriSwapAbi from '/constants/abis/XTriSwap.json'
import { castTo18, getLastThursday, getCoinPrice, getSrsPrice, getTokenSymbolForPoolType } from '/utils'
import { getSwapContract } from '/utils/contract'
const ONE_MINUTE = 6e4
const ONE_HOUR = 36e5
const ONE_DAY_SECS = 86400
const ONE_YEAR_SECS = ONE_DAY_SECS * 365

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

export const getLPTokenPrice = memoize(
  async poolName => {
    try {
      if (!poolName) throw 'poolName is required'
      const pool = pools.find(i => i.name === poolName)
      const lpTokenAddress = pool?.addresses?.lpToken
      const swapAddress = pool?.addresses?.swap
      if (!pool || !lpTokenAddress || !swapAddress) throw 'farm is not found'

      const isMetaSwap = isMetaPool(poolName)
      const isCryptoSwap = isCryptoPool(poolName)
      const isNativeSwap = isNativePool(poolName)
      // const isXTriSwap = isXTriSwapPool(poolName)
      const lpTokenContract = new Contract(lpTokenAddress, ERC20Abi, provider)
      let metaSwapContract = null
      let cryptoSwapContract = null
      // let xTriSwapContract = null
      if (isMetaSwap) metaSwapContract = new Contract(swapAddress, metaSwapAbi, provider)
      if (isCryptoSwap) cryptoSwapContract = new Contract(swapAddress, cryptoMetapoolAbi, provider)
      // if (isXTriSwap) xTriSwapContract = new Contract(swapAddress, XTriSwapAbi, provider)

      if (isCryptoSwap) {
        const allTokens = pool.underlyingCoins
        if (!allTokens) return 0

        const res = await Promise.all(
          allTokens.map(async (token, index) => {
            const [resBal, price] = await Promise.all([cryptoSwapContract?.balances(index), getCoinPrice(token.symbol).catch(err => 0)])
            const balance = castTo18(resBal, token.decimals)
            return balance.mul(parseUnits(String(price || 0))).div(parseUnits('1'))
          })
        )
        const poolTotalValue = res.reduce((sum, b) => sum.add(b))

        const totalSupply = await lpTokenContract?.totalSupply()
        const result = totalSupply.isZero() ? Zero : poolTotalValue.div(totalSupply)
        return +formatUnits(result, 0)
      }

      if (isNativeSwap) {
        const effectivePoolTokens = pool.underlyingCoins || pool.coins
        const swapContract = getSwapContract(poolName)
        const effectiveSwapContract = metaSwapContract || swapContract

        // Pool token data
        const tokenBalances = await Promise.all(
          effectivePoolTokens.map(async (token, index) => {
            const balance = await effectiveSwapContract.getTokenBalance(index)
            return castTo18(balance, token.decimals)
          })
        )

        const tokenBalancesUSD = await Promise.all(
          effectivePoolTokens.map(async (token, i, arr) => {
            // use another token to estimate USD price of meta LP tokens
            const symbol = isMetaSwap && i === arr.length - 1 ? getTokenSymbolForPoolType(pool.type) : token.symbol
            const balance = tokenBalances[i]
            const price = await getCoinPrice(symbol).catch(err => 0)
            return balance.mul(parseUnits(String(price || 0))).div(parseUnits('1'))
          })
        )
        const reserve = tokenBalancesUSD.reduce((sum, b) => sum.add(b))

        const totalSupply = await lpTokenContract?.totalSupply()
        const result = totalSupply.isZero() ? Zero : reserve.div(totalSupply)
        return +formatUnits(result, 0)
      }

      return 1
    } catch (err) {
      console.error('getLPTokenPrice', err)
      return 0
    }
  },
  { promise: true, maxAge: ONE_MINUTE }
)

export const getBaseAprData = memoize(
  async (poolName, timestamp) => {
    try {
      if (!poolName) throw 'poolName is required'

      const pool = pools.find(i => i.name === poolName)
      const lpTokenAddress = pool?.addresses?.lpToken
      const farmAddress = pool?.addresses?.gauge
      if (!pool || !lpTokenAddress || !farmAddress) throw 'farm is not found'

      const tokenContract = new Contract(lpTokenAddress, ERC20Abi, provider)
      // bn, number, bn, bn, number
      const [bal, lpTokenPrice, rewardRate, rewardSrsPS, srsPrice] = await Promise.all([
        tokenContract.balanceOf(farmAddress),
        getLPTokenPrice(poolName),
        getGRW(farmAddress, timestamp),
        getSrsRate(),
        getSrsPrice()
      ])

      const tvl = bal.mul(parseUnits(String(lpTokenPrice || 1))).div(parseUnits('1'))

      const rewardPerSec = rewardSrsPS
        .mul(parseUnits(String(srsPrice)))
        .mul(rewardRate)
        .div(parseUnits('1', 36))
      const rewardPerDay = rewardPerSec.mul(ONE_DAY_SECS)
      const rewardPerYear = rewardPerSec.mul(ONE_YEAR_SECS)
      const baseApr = tvl.isZero() ? Zero : parseUnits('1').mul(rewardPerYear).div(tvl)

      const rewardSrsPerDay = rewardSrsPS.mul(rewardRate).mul(ONE_DAY_SECS).div(parseUnits('1'))

      return {
        tvl: formatUnits(tvl),
        rewardRate: formatUnits(rewardRate),
        rewardPerSec: formatUnits(rewardPerSec),
        rewardPerDay: formatUnits(rewardPerDay),
        rewardPerYear: formatUnits(rewardPerYear),
        baseApr: formatUnits(baseApr),
        rewardSrsPerDay: formatUnits(rewardSrsPerDay)
      }
    } catch (err) {
      console.error('getBaseAprData', err)
      return {
        tvl: '0',
        rewardRate: '0',
        rewardPerSec: '0',
        rewardPerDay: '0',
        rewardPerYear: '0',
        baseApr: '0',
        rewardSrsPerDay: '0'
      }
    }
  },
  { promise: true, maxAge: ONE_MINUTE }
)

export const getOruPrice = memoize(
  async () => {
    const res = await arthRouterContract?.getAmountsOut(parseUnits('1'), [coins.oru.address, coins.usdc.address])
    return +formatUnits(res[1], coins.usdc.decimals) || 0
  },
  { promise: true, maxAge: ONE_MINUTE }
)
