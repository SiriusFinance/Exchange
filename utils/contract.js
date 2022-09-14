import { providers, Contract } from 'ethers'
import { RPC_URL } from '/constants'
const provider = new providers.JsonRpcProvider(RPC_URL)
import { pools, isMetaPool, isCryptoPool, isNativePool, isXTriSwapPool } from '/constants/pools'

import metaSwapDepositAbi from '/constants/abis/metaSwapDeposit.json'
import cryptoMetapoolDepositAbi from '/constants/abis/CryptometapoolDeposit.json'
import swapETHAbi from '/constants/abis/swapETH.json'

export const getSwapContract = poolName => {
  try {
    if (!poolName) return null
    const pool = pools.find(i => i.name === poolName)
    if (!pool) return null
    const poolAddress = pool.addresses?.deposit || pool.addresses?.swap
    if (!poolAddress) return null

    if (isMetaPool(poolName)) return new Contract(poolAddress, metaSwapDepositAbi, provider)
    if (isCryptoPool(poolName)) return new Contract(poolAddress, cryptoMetapoolDepositAbi, provider)
    if (isNativePool(poolName)) return new Contract(poolAddress, swapETHAbi, provider)

    return null
  } catch (err) {
    console.error('Failed to get contract', err)
    return null
  }
}
