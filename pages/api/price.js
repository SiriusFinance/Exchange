import { fn } from '../../utils'

export async function getTokenPrice(pairAddress) {
  const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/astar/0xde2edaa0cd4afd59d9618c31a060eab93ce45e01")
  const pair = (await res.json()).pair
  return { priceUsd: pair.priceUsd, priceNative: pair.priceNative }
}

export default fn(async () => {
  return await getTokenPrice("0xde2EDAa0cD4aFd59d9618c31A060EAb93Ce45e01")
}, { maxAge: 5 })