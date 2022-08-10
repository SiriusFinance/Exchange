import { providers, Contract } from 'ethers'
import { RPC_URL } from '../'
const provider = new providers.JsonRpcProvider(RPC_URL)

import address from './address'
import veTokenAbi from '../abis/VotingEscrow.json'

export const veTokenContract = new Contract(address.veToken, veTokenAbi, provider)
