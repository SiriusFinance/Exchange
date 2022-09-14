import memoize from 'memoizee'
import { utils, constants, Contract } from 'ethers'
const { parseUnits, formatUnits } = utils
const { Zero } = constants
import { pools, isMetaPool, isCryptoPool, isNativePool, isXTriSwapPool } from '/constants/pools'
import { provider, srsContract, gaugeControllerContract } from '/constants/contract'
import ERC20Abi from '/constants/abis/ERC20.json'
import metaSwapAbi from '/constants/abis/metaSwap.json'
import cryptoMetapoolAbi from '/constants/abis/Cryptometapool.json'
// import XTriSwapAbi from '/constants/abis/XTriSwap.json'
import { castTo18, getLastThursday, getCoinPrice, getTokenSymbolForPoolType } from '/utils'
import { getSwapContract } from '/utils/contract'
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
