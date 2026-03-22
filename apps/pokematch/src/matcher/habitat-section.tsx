import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { habitatColors, habitatEmoji } from '../habitatColors'
import type { PokemonGroup } from '../types'
import GroupCard from '../GroupCard'

interface HabitatSectionProps {
  habitatGroup: PokemonGroup
}

function groupStableKey(group: { id: string }[]): string {
  return group.map((p) => p.id).join('|')
}

export function HabitatSection({ habitatGroup: hg }: HabitatSectionProps) {
  const colors = habitatColors[hg.habitat]
  const summaryId = `habitat-${hg.habitat}-summary`

  return (
    <Accordion
      defaultExpanded
      variant="outlined"
      aria-labelledby={summaryId}
      sx={{
        borderColor: colors.border,
        borderRadius: '10px !important',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        id={summaryId}
        expandIcon={<ExpandMoreIcon aria-hidden />}
        sx={{
          bgcolor: colors.bg,
          borderRadius: 'inherit',
          minHeight: 48,
          '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography component="span" sx={{ fontSize: 20, lineHeight: 1 }} aria-hidden>
            {habitatEmoji[hg.habitat]}
          </Typography>
          <Typography component="span" fontWeight={700} color={colors.text}>
            {hg.habitat}
          </Typography>
          <Chip
            label={`${hg.pokemon.length} Pokémon`}
            size="small"
            sx={{
              height: 20,
              fontSize: 11,
              bgcolor: 'background.paper',
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          />
          <Chip
            label={`${hg.groups.length} groups`}
            size="small"
            sx={{ height: 20, fontSize: 11, bgcolor: colors.border, color: 'common.white' }}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Stack spacing={2}>
          {hg.groups.map((group, gi) => (
            <GroupCard
              key={groupStableKey(group)}
              group={group}
              groupNumber={gi + 1}
              habitat={hg.habitat}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
