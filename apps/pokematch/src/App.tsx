import { useMemo, useState } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { useStore } from './store'
import { allPokemon, standardPokemon } from './pokemon'
import Layout from './Layout'
import MatcherPage from './MatcherPage'
import PokedexPage from './PokedexPage'

type Page = 'matcher' | 'pokedex'

export default function App() {
  const { mode, setMode, includeEvents, unlockedIds } = useStore()
  const [page, setPage] = useState<Page>('matcher')

  const activePokemon = useMemo(() => {
    const base = includeEvents ? allPokemon : standardPokemon
    if (mode === 'custom') return base.filter((p) => unlockedIds.has(p.id))
    return base
  }, [mode, includeEvents, unlockedIds])

  const customUnlockedCount = useMemo(
    () => allPokemon.filter((p) => unlockedIds.has(p.id)).length,
    [unlockedIds],
  )

  return (
    <Layout
      activePokemonCount={activePokemon.length}
      customUnlockedCount={customUnlockedCount}
      page={page}
      onPageChange={setPage}
    >
      {page === 'matcher' && <MatcherPage activePokemon={activePokemon} />}

      {page === 'pokedex' && (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {mode === 'standard' ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" mb={1}>
                Pokédex selection is only available in <strong>Custom</strong> mode.
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setMode('custom')}
                sx={{ mt: 1 }}
              >
                Switch to Custom mode
              </Button>
            </Box>
          ) : (
            <PokedexPage pokemon={includeEvents ? allPokemon : standardPokemon} />
          )}
        </Container>
      )}
    </Layout>
  )
}
