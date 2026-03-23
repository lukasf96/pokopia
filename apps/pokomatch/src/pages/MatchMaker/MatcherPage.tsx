import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Container, Link, Paper, Stack, Typography } from "@mui/material";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { appRoutes } from "../../router/routes";
import {
  computeAutoGroups,
  type SuggestedPokemon,
  suggestNextPokemon,
} from "../../services/matching.service";
import { habitablePokemon } from "../../services/pokemon";
import { useStore } from "../../store/store";
import type { Pokemon } from "../../types/types";
import { AutoGroupsSection } from "./components/AutoGroupsSection";
import { CustomGroupsSection } from "./components/CustomGroupsSection";

function groupKeyFromPokemon(group: Pokemon[]): string {
  return group
    .map((pokemon) => pokemon.id)
    .sort()
    .join("|");
}

export default function MatcherPage() {
  const unlockedIds = useStore((s) => s.unlockedIds);
  const customGroups = useStore((s) => s.customGroups);
  const addCustomGroup = useStore((s) => s.addCustomGroup);
  const addSuggestedGroupToCustomGroups = useStore(
    (s) => s.addSuggestedGroupToCustomGroups,
  );
  const deleteCustomGroup = useStore((s) => s.deleteCustomGroup);
  const addPokemonToCustomGroup = useStore((s) => s.addPokemonToCustomGroup);
  const removePokemonFromCustomGroup = useStore(
    (s) => s.removePokemonFromCustomGroup,
  );

  const activePokemon = useMemo(() => {
    return habitablePokemon.filter((p) => unlockedIds.has(p.id));
  }, [unlockedIds]);

  const pokemonById = useMemo(
    () =>
      activePokemon.reduce<Record<string, Pokemon>>((acc, pokemon) => {
        acc[pokemon.id] = pokemon;
        return acc;
      }, {}),
    [activePokemon],
  );

  const resolvedCustomGroups = useMemo(
    () =>
      customGroups.map((group) =>
        group
          .map((id) => pokemonById[id])
          .filter((pokemon): pokemon is Pokemon => Boolean(pokemon)),
      ),
    [customGroups, pokemonById],
  );

  const customAssignedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const group of resolvedCustomGroups) {
      for (const pokemon of group) ids.add(pokemon.id);
    }
    return ids;
  }, [resolvedCustomGroups]);

  const autoPokemon = useMemo(
    () => activePokemon.filter((pokemon) => !customAssignedIds.has(pokemon.id)),
    [activePokemon, customAssignedIds],
  );
  const deferredAutoPokemon = useDeferredValue(autoPokemon);
  const autoGroups = useMemo(
    () => computeAutoGroups(deferredAutoPokemon),
    [deferredAutoPokemon],
  );
  const [frozenSuggestedGroups, setFrozenSuggestedGroups] = useState<
    Pokemon[][] | null
  >(null);
  const [adoptedSuggestedGroupKeys, setAdoptedSuggestedGroupKeys] = useState<
    Set<string>
  >(() => new Set());

  const availablePokemon = useMemo(
    () => activePokemon.filter((p) => !customAssignedIds.has(p.id)),
    [activePokemon, customAssignedIds],
  );

  const suggestions = useMemo<SuggestedPokemon[][]>(
    () =>
      resolvedCustomGroups.map((group) =>
        suggestNextPokemon(
          group,
          availablePokemon.filter(
            (candidate) => !group.some((member) => member.id === candidate.id),
          ),
        ),
      ),
    [resolvedCustomGroups, availablePokemon],
  );

  const resetSuggestedFreeze = useCallback(() => {
    setFrozenSuggestedGroups(null);
    setAdoptedSuggestedGroupKeys(new Set());
  }, []);

  const displayedSuggestedGroups = useMemo(() => {
    if (!frozenSuggestedGroups) return autoGroups;
    return frozenSuggestedGroups.filter(
      (group) => !adoptedSuggestedGroupKeys.has(groupKeyFromPokemon(group)),
    );
  }, [autoGroups, frozenSuggestedGroups, adoptedSuggestedGroupKeys]);

  if (activePokemon.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <GroupsOutlinedIcon
          sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
          aria-hidden
        />
        <Typography color="text.secondary" mb={1}>
          No Pokémon available with current settings.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Go to Pokédex and unlock some Pokémon first.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Stack spacing={2.5}>
        <Typography variant="h6" component="h1" fontWeight={700}>
          Match-Maker
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.75, sm: 2 },
            borderRadius: 2,
            bgcolor: "action.hover",
            borderColor: "divider",
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700} component="p">
              Roommates who actually click - in Pokopia
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              Building a happy world in Pokémon Pokopia means filling every
              habitat with the right roommates. With a huge Pokédex and picky
              ideal habitats, it is tough to spot who belongs together - let
              alone a full house of four who share the same likes.
            </Typography>
            <Typography variant="body2" color="text.secondary" component="p">
              PokoMatch is your shortcut: we respect who can room together, then
              steer you toward groups with overlapping favorites - so you spend
              less time second-guessing and more time enjoying Pokopia.
              Everything below updates as your Pokédex or groups change.
            </Typography>
            <Stack
              component="ul"
              spacing={0.75}
              sx={{
                m: 0,
                pl: 2.25,
                color: "text.secondary",
                typography: "body2",
              }}
            >
              <Typography component="li" variant="body2" color="text.secondary">
                <strong>My Groups</strong> — Shape your own households; we
                suggest habitat-safe picks that boost shared favorites.
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                <strong>Suggested groups</strong> — Fresh ideas for whoever is
                still looking for a home.
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" component="p">
              Only Pokémon you have unlocked in the{" "}
              <Link
                component={RouterLink}
                to={appRoutes.pokedex}
                underline="hover"
              >
                Pokédex
              </Link>{" "}
              appear here—tune unlocks there so the app matches your current
              save.
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={1.5}>
          <CustomGroupsSection
            customGroups={resolvedCustomGroups}
            suggestions={suggestions}
            availablePokemon={availablePokemon}
            onAddGroup={() => {
              resetSuggestedFreeze();
              addCustomGroup();
            }}
            onDeleteGroup={(groupIndex) => {
              resetSuggestedFreeze();
              deleteCustomGroup(groupIndex);
            }}
            onAddPokemon={(groupIndex, pokemonId) => {
              resetSuggestedFreeze();
              addPokemonToCustomGroup(groupIndex, pokemonId);
            }}
            onRemovePokemon={(groupIndex, pokemonId) => {
              resetSuggestedFreeze();
              removePokemonFromCustomGroup(groupIndex, pokemonId);
            }}
          />

          <AutoGroupsSection
            groups={displayedSuggestedGroups}
            onQuickAddGroup={(group) => {
              if (!frozenSuggestedGroups) {
                setFrozenSuggestedGroups(autoGroups);
              }
              setAdoptedSuggestedGroupKeys((prev) => {
                const next = new Set(prev);
                next.add(groupKeyFromPokemon(group));
                return next;
              });
              addSuggestedGroupToCustomGroups(
                group.map((pokemon) => pokemon.id),
              );
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
