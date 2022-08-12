import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import detailList from '../../constants/coins/detail'
import styles from './symbol.module.scss'

export default function Page() {
  const router = useRouter()
  const { symbol } = router.query
  const [info, setInfo] = useState({})
  const goPage = id => router.push(`/symbol_detail/${id}`, undefined, { shallow: true })

  useEffect(() => setInfo(detailList[symbol] || detailList['BTC']), [symbol])

  return (
    <>
      <Head>
        <title>{info.symbol} Introduction</title>
      </Head>

      <div className={styles.container}>
        <ul className={styles.list}>
          {Object.values(detailList).map((i, index) => (
            <li className={`${styles.item} ${i.symbol == symbol ? styles.itemActive : ''}`} key={index} onClick={() => goPage(i.symbol)}>
              {i.symbol}
              {i.name && ` (${i.name})`}
            </li>
          ))}
        </ul>
        <div className={styles.rightbar}>
          <div className={styles.title}>
            {info.symbol}
            {info.name && ` (${info.name})`}
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Issue Time</div>
            <div className={styles.val}>{info.issueTime || '--'}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Total Supply</div>
            <div className={styles.val}>{info.totalSupply || '--'}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Circulation</div>
            <div className={styles.val}>{info.circulation || '--'}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>White paper</div>
            <div className={styles.val}>{info.whitePaper || '--'}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Website</div>
            <div className={styles.val}>{info.website || '--'}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>Block Explorer</div>
            <div className={styles.val}>{info.blockExplorer || '--'}</div>
          </div>
          {info.desc && <div className={styles.desc}>{info.desc}</div>}
        </div>
      </div>
    </>
  )
}
