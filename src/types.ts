export type NBAEvents = {
  event: {
    tradeables: {
      price: { estimated: number }
      points: { projected: number, scored: number }
      entity: { name: string, image_url: string }
    }[]
  }
}

export type Tradeable = {
  estimatedPrice: number
  projectedPoints: number
  actualPoints: number
  name: string | null
  imageUrl: string | null
}