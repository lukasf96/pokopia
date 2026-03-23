import { useMemo } from 'react'
import { allPokemon } from './pokemon'
import { Container, Stack, Typography } from '@mui/material'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import { computeHabitatGroups, suggestNextPokemon } from './matching'
import { HabitatSection } from './matcher/habitat-section'
import { CustomGroupsSection } from './matcher/custom-groups-section'
import { useStore } from './store'
import type { Habitat, Pokemon } from './types'

const habitatOrder: Habitat[] = ['Bright', 'Cool', 'Dark', 'Dry', 'Humid', 'Warm']

export default function MatcherPage() {
  const mode = useStore((s) => s.mode)
  const unlockedIds = useStore((s) => s.unlockedIds)
  const customGroups = useStore((s) => s.customGroups)
  const addCustomGroup = useStore((s) => s.addCustomGroup)
  const deleteCustomGroup = useStore((s) => s.deleteCustomGroup)
  const addPokemonToCustomGroup = useStore((s) => s.addPokemonToCustomGroup)
  const removePokemonFromCustomGroup = useStore((s) => s.removePokemonFromCustomGroup)

  const activePokemon = useMemo(() => {
    if (mode !== 'custom') return allPokemon
    return allPokemon.filter((p) => unlockedIds.has(p.id))
  }, [mode, unlockedIds])

  const pokemonById = useMemo(
    () =>
      activePokemon.reduce<Record<string, Pokemon>>((acc, pokemon) => {
        acc[pokemon.id] = pokemon
        return acc
      }, {}),
    [activePokemon],
  )

  const resolvedCustomGroups = useMemo(
    () =>
      customGroups.map((group) =>
        group.map((id) => pokemonById[id]).filter((pokemon): pokemon is Pokemon => Boolean(pokemon)),
      ),
    [customGroups, pokemonById],
  )

  const customAssignedIds = useMemo(() => {
    const ids = new Set<string>()
    for (const group of resolvedCustomGroups) {
      for (const pokemon of group) ids.add(pokemon.id)
    }
    return ids
  }, [resolvedCustomGroups])

  const autoPokemon = useMemo(
    () => activePokemon.filter((pokemon) => !customAssignedIds.has(pokemon.id)),
    [activePokemon, customAssignedIds],
  )
  const autoHabitatGroups = useMemo(() => computeHabitatGroups(autoPokemon), [autoPokemon])
  const autoByHabitat = useMemo(
    () =>
      autoHabitatGroups.reduce<Record<Habitat, Pokemon[][]>>(
        (acc, group) => {
          acc[group.habitat] = group.groups
          return acc
        },
        { Bright: [], Cool: [], Dark: [], Dry: [], Humid: [], Warm: [] },
      ),
    [autoHabitatGroups],
  )
  const activeByHabitat = useMemo(
    () =>
      activePokemon.reduce<Record<Habitat, Pokemon[]>>(
        (acc, pokemon) => {
          acc[pokemon.idealHabitat].push(pokemon)
          return acc
        },
        { Bright: [], Cool: [], Dark: [], Dry: [], Humid: [], Warm: [] },
      ),
    [activePokemon],
  )

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
          <CustomGroupsSection
            customGroups={resolvedCustomGroups}
            suggestions={resolvedCustomGroups.map((group) =>
              suggestNextPokemon(
                group,
                activePokemon.filter(
                  (candidate) =>
                    !customAssignedIds.has(candidate.id) && !group.some((member) => member.id === candidate.id),
                ),
              ),
            )}
            availablePokemon={activePokemon.filter((pokemon) => !customAssignedIds.has(pokemon.id))}
            onAddGroup={addCustomGroup}
            onDeleteGroup={deleteCustomGroup}
            onAddPokemon={addPokemonToCustomGroup}
            onRemovePokemon={removePokemonFromCustomGroup}
          />

          {habitatOrder.map((habitat) => (
            <HabitatSection
              key={habitat}
              habitat={habitat}
              pokemon={activeByHabitat[habitat]}
              autoGroups={autoByHabitat[habitat] ?? []}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
