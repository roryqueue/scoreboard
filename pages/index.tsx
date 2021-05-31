import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { NBAEvents, Tradeable } from '../src/types'
import Scoreboard from '../components/Scoreboard'

type OrganizationPageProps = {
  tradeables: Tradeable[]
}

export async function getStaticProps() {
  const nbaEvents: NBAEvents = require('../public/nba_event.json')

  const tradeables: Tradeable[] = nbaEvents.event.tradeables.map((rawTradeble) => {
    const {
      price: { estimated }, points: { projected, scored }, entity: { name, image_url },
    } = rawTradeble
    return {
      estimatedPrice: estimated || 0,
      projectedPoints: projected || 0,
      actualPoints: scored || 0,
      name: name || null,
      imageUrl: image_url || null,
    }
  })
  return { props: { tradeables } }
}

export default function Home({ tradeables }: OrganizationPageProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>NBA Daily Fantasy Scoreboard</title>
        <meta name="description" content="Browse NBA Daily Fantasy Points and Price" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <main className={styles.main}>
      <Scoreboard tradeables={tradeables} />
      </main>
    </div>
  )
}
