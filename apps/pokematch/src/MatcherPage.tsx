import { useMemo, useState } from 'react'
import { Box, Chip, Container, Stack, Tab, Tabs, Typography } from '@mui/material'
import type { Pokemon } from './types'
import { habitatColors, habitatEmoji } from './habitatColors'
import { computeHabitatGroups } from './matching'
import OverviewTab from './OverviewTab'
import GroupCard from './GroupCard'
import { useStore } from './store'

interface Props {
  activePokemon: Pokemon[]
}

const OVERVIEW_TAB = 0

export default function MatcherPage({ activePokemon }: Props) {
  const { mode } = useStore()
  const [activeTab, setActiveTab] = useState(0)

  const habitatGroups = useMemo(() => computeHabitatGroups(activePokemon), [activePokemon])

  const isOverview = activeTab === OVERVIEW_TAB
  const current = isOverview ? null : habitatGroups[activeTab - 1]

  return (
    <>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          {habitatGroups.map((hg, i) => (
            <Tab
              key={hg.habitat}
              label={
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <span>{habitatEmoji[hg.habitat]}</span>
                  <span>{hg.habitat}</span>
                  <Chip
                    label={hg.pokemon.length}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 11,
                      bgcolor: activeTab === i + 1 ? habitatColors[hg.habitat].bg : undefined,
                    }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {activePokemon.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary" mb={1}>
              No Pokémon available with current settings.
            </Typography>
            {mode === 'custom' && (
              <Typography variant="body2" color="text.secondary">
                Go to Pokédex and unlock some Pokémon first.
              </Typography>
            )}
          </Box>
        ) : isOverview ? (
          <OverviewTab pokemon={activePokemon} />
        ) : current ? (
          <>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                {habitatEmoji[current.habitat]} {current.habitat} Habitat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                — {current.pokemon.length} Pokémon across {current.groups.length} groups
              </Typography>
            </Stack>
            <Stack spacing={2}>
              {current.groups.map((group, gi) => (
                <GroupCard
                  key={gi}
                  group={group}
                  groupNumber={gi + 1}
                  habitat={current.habitat}
                />
              ))}
            </Stack>
          </>
        ) : null}
      </Container>
    </>
  )
}
