import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { SuggestedPokemon } from "../../../services/matching.service";
import { useStore } from "../../../store/store";
import type { Pokemon } from "../../../types/types";
import { getDisplayHabitat, groupStableKey } from "../group-helpers";
import { AddPokemonToGroupAutocomplete } from "./AddPokemonToGroupAutocomplete";
import GroupCard from "./GroupCard";
import { SuggestedNextPokemonControls } from "./SuggestedNextPokemonControls";

interface CustomGroupsSectionProps {
  customGroups: Pokemon[][];
  suggestions: SuggestedPokemon[][];
  availablePokemon: Pokemon[];
  onAddGroup: () => void;
  onDeleteGroup: (groupIndex: number) => void;
  onAddPokemon: (groupIndex: number, pokemonId: string) => void;
  onRemovePokemon: (groupIndex: number, pokemonId: string) => void;
}

export function CustomGroupsSection({
  customGroups,
  suggestions,
  availablePokemon,
  onAddGroup,
  onDeleteGroup,
  onAddPokemon,
  onRemovePokemon,
}: CustomGroupsSectionProps) {
  const nameLanguage = useStore((state) => state.nameLanguage);

  return (
    <Accordion
      defaultExpanded
      elevation={0}
      sx={{ borderRadius: 1, overflow: "hidden" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon aria-hidden />}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography component="span" fontWeight={700}>
            My Groups
          </Typography>
          <Chip label={`${customGroups.length} groups`} size="small" />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Button
            onClick={onAddGroup}
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
          >
            Add group
          </Button>

          {customGroups.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Add your habitats you have already setup in-game.
            </Typography>
          )}

          {customGroups.map((group, gi) => {
            const groupNumber = gi + 1;
            const groupSuggestions = suggestions[gi] ?? [];
            return (
              <Stack key={`custom-${groupStableKey(group) || gi}`} spacing={1}>
                <GroupCard
                  group={group}
                  groupNumber={groupNumber}
                  habitat={getDisplayHabitat(group)}
                  onRemovePokemon={(pokemonId) =>
                    onRemovePokemon(gi, pokemonId)
                  }
                  footerContent={
                    group.length < 4 ? (
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary">
                          Add Pokémon to Group {groupNumber}
                        </Typography>

                        <AddPokemonToGroupAutocomplete
                          group={group}
                          availablePokemon={availablePokemon}
                          nameLanguage={nameLanguage}
                          onSelect={(pokemonId) => onAddPokemon(gi, pokemonId)}
                        />

                        {group.length > 0 && groupSuggestions.length > 0 && (
                          <SuggestedNextPokemonControls
                            suggestions={groupSuggestions}
                            nameLanguage={nameLanguage}
                            onPick={(pokemonId) => onAddPokemon(gi, pokemonId)}
                          />
                        )}
                      </Stack>
                    ) : null
                  }
                  groupAction={{
                    ariaLabel: `Delete my group ${groupNumber}`,
                    onClick: () => onDeleteGroup(gi),
                    kind: "remove",
                  }}
                />
              </Stack>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
