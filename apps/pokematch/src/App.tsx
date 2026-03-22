import { useState } from 'react'
import { useStore } from './store'
import { allPokemon } from './pokemon'
import Layout from './Layout'
import MatcherPage from './MatcherPage'
import OverviewPage from './OverviewPage'
import PokedexPage from './PokedexPage'

type Page = 'matcher' | 'overview' | 'pokedex'

export default function App() {
  const activePokemonCount = useStore((s) => {
    if (s.mode !== 'custom') return allPokemon.length
    return allPokemon.reduce((acc, p) => acc + (s.unlockedIds.has(p.id) ? 1 : 0), 0)
  })

  const customUnlockedCount = useStore((s) =>
    allPokemon.reduce((acc, p) => acc + (s.unlockedIds.has(p.id) ? 1 : 0), 0),
  )

  const [page, setPage] = useState<Page>('matcher')

  return (
    <Layout
      activePokemonCount={activePokemonCount}
      customUnlockedCount={customUnlockedCount}
      page={page}
      onPageChange={setPage}
    >
      {page === 'matcher' && <MatcherPage />}

      {page === 'overview' && <OverviewPage />}

      {page === 'pokedex' && <PokedexPage />}
    </Layout>
  )
}
