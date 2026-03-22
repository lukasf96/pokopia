import { useMemo } from 'react'
import { allPokemon, standardPokemon } from './pokemon'
import { Container, Stack, Typography } from '@mui/material'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { computeHabitatGroups } from './matching'
import { HabitatSection } from './matcher/habitat-section'
import { useStore } from './store'

export default function MatcherPage() {
  const mode = useStore((s) => s.mode)
  const includeEvents = useStore((s) => s.includeEvents)
  const unlockedIds = useStore((s) => s.unlockedIds)

  const activePokemon = useMemo(() => {
    const base = includeEvents ? allPokemon : standardPokemon
    if (mode !== 'custom') return base
    return base.filter((p) => unlockedIds.has(p.id))
  }, [mode, includeEvents, unlockedIds])

  const habitatGroups = useMemo(() => computeHabitatGroups(activePokemon), [activePokemon])

  if (activePokemon.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <GroupsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} aria-hidden />
        <Typography color="text.secondary" mb={1}>
          No Pokémon available with current settings.
        </Typography>
        {mode === 'custom' && (
          <Typography variant="body2" color="text.secondary">
            Go to Pokédex and unlock some Pokémon first.
          </Typography>
        )}
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6" component="h1" fontWeight={700}>
            Habitat groups
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth="sm">
            Pokémon are grouped by ideal habitat. Each group of up to four is chosen to maximize
            shared favorite activities between members.
          </Typography>
        </Stack>

        <Stack spacing={1.5}>
          {habitatGroups.map((hg) => (
            <HabitatSection key={hg.habitat} habitatGroup={hg} />
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
