import memoize from 'memoizee'
import { getGraph } from '/utils'
const LIMIT = 1e3
const FIVE_MINUTES = 3e5
const ONE_DAY = 864e5

export const getAddresses = memoize(
  async () => {
    const query = '{swaps { address }}'
    const res = await getGraph(query)
    return res?.data?.swaps || []
  },
  { promise: true, maxAge: ONE_DAY }
)

export const poolDailyTvls = memoize(
  async address => {
    const qStr = offset => `dailyTvls(orderBy: timestamp_DESC, offset: ${offset}, limit: ${LIMIT}, where: {swap: {id_eq: "${address}"}})`
    const query = `{
      ${qStr(0)} { timestamp tvl }
      dailyTvlsConnection(orderBy: id_ASC, where: {swap: {id_eq: "${address}"}}) { totalCount }
    }`
    const res = await getGraph(query)
    let list = res?.data?.dailyTvls || []
    const cnt = res?.data?.dailyTvlsConnection?.totalCount || 0
    if (!cnt) return { list: [], totalCount: 0 }

    if (cnt > LIMIT) {
      const offsets = []
      const page = Math.floor(cnt / LIMIT)
      for (let i = 1; i <= page; i++) offsets.push(i * LIMIT)
      const res2 = await Promise.all(offsets.map(offset => getGraph(`{${qStr(offset)} { timestamp tvl }}`)))
      res2.map(i => (list = list.concat(i?.data?.dailyTvls || [])))
    }

    return { list, totalCount: cnt }
  },
  { promise: true, maxAge: FIVE_MINUTES }
)

export const poolDailyVolumes = memoize(
  async address => {
    const qStr = offset => `dailyVolumes(orderBy: timestamp_DESC, offset: ${offset}, limit: ${LIMIT}, where: {swap: {id_eq: "${address}"}})`
    const query = `{
      ${qStr(0)} { timestamp volume }
      dailyVolumesConnection(orderBy: id_ASC, where: {swap: {id_eq: "${address}"}}) { totalCount }
    }`
    const res = await getGraph(query)
    let list = res?.data?.dailyVolumes || []
    const cnt = res?.data?.dailyVolumesConnection?.totalCount || 0
    if (!cnt) return { list: [], totalCount: 0 }

    if (cnt > LIMIT) {
      const offsets = []
      const page = Math.floor(cnt / LIMIT)
      for (let i = 1; i <= page; i++) offsets.push(i * LIMIT)
      const res2 = await Promise.all(offsets.map(offset => getGraph(`{${qStr(offset)} { timestamp volume }}`)))
      res2.map(i => (list = list.concat(i?.data?.dailyVolumes || [])))
    }

    return { list, totalCount: cnt }
  },
  { promise: true, maxAge: FIVE_MINUTES }
)
