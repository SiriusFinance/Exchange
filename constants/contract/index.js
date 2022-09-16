import { providers, Contract } from 'ethers'
import { RPC_URL } from '../'
export const provider = new providers.JsonRpcProvider(RPC_URL)

import address from './address'
import veTokenAbi from '../abis/VotingEscrow.json'
import srsAbi from '../abis/SRS.json'
import gaugeControllerAbi from '../abis/GaugeController.json'
import arthRouterAbi from '/constants/abis/ArthRouter.json'

export const veTokenContract = new Contract(address.veToken, veTokenAbi, provider)
export const srsContract = new Contract(address.srsToken, srsAbi, provider)
export const gaugeControllerContract = new Contract(address.gaugeController, gaugeControllerAbi, provider)
export const arthRouterContract = new Contract(address.arthRouter, arthRouterAbi, provider)
