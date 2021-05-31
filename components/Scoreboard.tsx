import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { Tradeable } from '../src/types'

type SearchInputs = { searchTerm: string }

enum SortKey { projectedPoints = 'projectedPoints', actualPoints = 'actualPoints', estimatedPrice = 'estimatedPrice' }
enum SortDirection { ASC = 'ASC', DESC = 'DESC' }
type SortRules = {
  key: SortKey
  direction: SortDirection
}

function getPlayerList(playerList: Tradeable[], sortRules: SortRules, searchTerm: string): Tradeable[] {
  const tableFilter = (player: Tradeable): boolean =>
    searchTerm ? (player.name || '').toLowerCase().includes(searchTerm.toLowerCase()) : true
  const tableSort = (t: Tradeable): number =>
    sortRules.direction === SortDirection.ASC ? t[sortRules.key] : -t[sortRules.key]
  return playerList.filter(tableFilter).sort(tableSort)
}

const Scoreboard = ({ tradeables }: { tradeables: Tradeable[] }) => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<SearchInputs>()

  const startingSortRules: SortRules = { key: SortKey.projectedPoints, direction: SortDirection.DESC }
  const [sortRules, setSortRules] = useState(startingSortRules)
  const findAndSetSortRules = (key: SortKey) => {
    const sameKey = sortRules.key === key
    const direction = (sameKey && sortRules.direction === SortDirection.DESC)
      ? SortDirection.ASC
      : SortDirection.DESC
    setSortRules({ key, direction })
  }
  const printSortArrow = (key: string) => {
    if (key === sortRules.key) {
      return sortRules.direction === 'ASC' ? ' ▲' : ' ▼'
    } else return ''
  }
  const searchTerm = watch('searchTerm')

  const currentPlayerList = useMemo(
    () => getPlayerList(tradeables, sortRules, searchTerm),
    [sortRules, searchTerm]
  )

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>NBA Scoreboard</h1>

      <form onSubmit={handleSubmit(() => undefined)}>
        <input
          style={{ margin: '4px 16px 16px 60px'}}
          placeholder="Search player name" {...register('searchTerm', { required: true })}
        />
        {errors.searchTerm && <span>Enter a player's name to search.</span>}
      </form>

      <table style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            <th/>
            <th>Name</th>
            <th>
              <button type="button" onClick={() => findAndSetSortRules(SortKey.projectedPoints)}>
                Projected Points{printSortArrow(SortKey.projectedPoints)}
              </button>
            </th>
            <th>
              <button type="button" onClick={() => findAndSetSortRules(SortKey.actualPoints)}>
                Actual Points{printSortArrow(SortKey.actualPoints)}
              </button>
            </th>
            <th>
              <button type="button" onClick={() => findAndSetSortRules(SortKey.estimatedPrice)}>
                Estimated Price{printSortArrow(SortKey.estimatedPrice)}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPlayerList.map((tradeable: Tradeable) => (
              <tr key={tradeable.name}>
                <td>
                  <Image
                    src={tradeable.imageUrl || ''}
                    alt={`${tradeable.name} headshot`}
                    width={50}
                    height={50}
                  />
                </td>
                <td>{tradeable.name}</td>
                <td>{tradeable.projectedPoints}</td>
                <td>{tradeable.actualPoints}</td>
                <td>{tradeable.estimatedPrice}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Scoreboard
