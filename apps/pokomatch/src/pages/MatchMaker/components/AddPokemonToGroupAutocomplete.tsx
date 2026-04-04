import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type Key,
} from "react";
import { SpecialtyChip } from "../../../components/SpecialtyChip";
import {
  getHabitatColors,
  habitatIcons,
} from "../../../services/habitatColors";
import {
  getPokemonDisplayName,
  type PokemonNameLanguage,
} from "../../../services/pokemon-localization";
import type { Pokemon } from "../../../types/types";
import { formatDexSegment } from "../group-helpers";

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** All substrings we match against (accent-insensitive, lowercased). */
function buildPokemonSearchHaystack(pokemon: Pokemon): string {
  const dex = pokemon.dexNumber.trim();
  const padded = formatDexSegment(dex);
  const numeric =
    /^\d+$/.test(dex) ? String(Number.parseInt(dex, 10)) : "";

  const nameParts = [
    pokemon.name,
    pokemon.localizedNames?.de,
    pokemon.localizedNames?.fr,
  ].filter((s): s is string => Boolean(s?.length));

  const pieces = [
    ...nameParts,
    dex,
    padded,
    numeric,
    `#${padded}`,
    pokemon.id,
    pokemon.idealHabitat,
    ...pokemon.specialties,
  ];

  return normalizeForSearch(pieces.join(" "));
}

function pokemonMatchesInput(haystack: string, inputValue: string): boolean {
  const normalizedQuery = normalizeForSearch(inputValue.trim());
  if (!normalizedQuery) return true;
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  let [curStart, curEnd] = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    if (s <= curEnd) curEnd = Math.max(curEnd, e);
    else {
      out.push([curStart, curEnd]);
      curStart = s;
      curEnd = e;
    }
  }
  out.push([curStart, curEnd]);
  return out;
}

function searchTokensFromInput(inputValue: string): string[] {
  return inputValue
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function matchRangesInPlainText(text: string, tokens: string[]): [number, number][] {
  const ranges: [number, number][] = [];
  for (const token of tokens) {
    let re: RegExp;
    try {
      re = new RegExp(escapeRegExp(token), "gi");
    } catch {
      continue;
    }
    for (const m of text.matchAll(re)) {
      if (m.index !== undefined) ranges.push([m.index, m.index + m[0].length]);
    }
  }
  return mergeIntervals(ranges);
}

interface TextSegment {
  highlight: boolean;
  text: string;
}

function segmentsFromMatchRanges(
  text: string,
  ranges: [number, number][],
): TextSegment[] {
  if (!text) return [];
  if (ranges.length === 0) return [{ highlight: false, text }];
  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) {
      segments.push({ highlight: false, text: text.slice(cursor, start) });
    }
    if (end > start) {
      segments.push({ highlight: true, text: text.slice(start, end) });
    }
    cursor = Math.max(cursor, end);
  }
  if (cursor < text.length) {
    segments.push({ highlight: false, text: text.slice(cursor) });
  }
  return segments;
}

function MatchHighlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const theme = useTheme();
  const segments = useMemo(() => {
    const tokens = searchTokensFromInput(query);
    const ranges = matchRangesInPlainText(text, tokens);
    return segmentsFromMatchRanges(text, ranges);
  }, [text, query]);

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <Box
            key={i}
            component="mark"
            sx={{
              background: `linear-gradient(
                110deg,
                ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.42 : 0.2)} 0%,
                ${alpha(theme.palette.secondary.main, theme.palette.mode === "dark" ? 0.35 : 0.16)} 100%
              )`,
              color: "inherit",
              borderRadius: "4px",
              px: 0.125,
              fontWeight: 800,
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            {seg.text}
          </Box>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

interface AddPokemonToGroupAutocompleteProps {
  group: Pokemon[];
  availablePokemon: Pokemon[];
  nameLanguage: PokemonNameLanguage;
  onSelect: (pokemonId: string) => void;
}

export const AddPokemonToGroupAutocomplete = memo(
  function AddPokemonToGroupAutocomplete({
    group,
    availablePokemon,
    nameLanguage,
    onSelect,
  }: AddPokemonToGroupAutocompleteProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = useState("");

    const options = useMemo(() => {
      const ids = new Set(group.map((m) => m.id));
      return availablePokemon.filter((p) => !ids.has(p.id));
    }, [group, availablePokemon]);

    const habitatColors = useMemo(() => getHabitatColors(theme), [theme]);

    const searchHaystackById = useMemo(() => {
      const map = new Map<string, string>();
      for (const p of options) {
        map.set(p.id, buildPokemonSearchHaystack(p));
      }
      return map;
    }, [options]);

    const filterOptions = useCallback(
      (
        opts: Pokemon[],
        state: { inputValue: string },
      ): Pokemon[] => {
        const trimmed = state.inputValue.trim();
        if (!trimmed) return opts;
        return opts.filter((p) =>
          pokemonMatchesInput(
            searchHaystackById.get(p.id) ?? "",
            trimmed,
          ),
        );
      },
      [searchHaystackById],
    );

    const getOptionLabel = useCallback(
      (option: Pokemon) =>
        `#${formatDexSegment(option.dexNumber)} ${getPokemonDisplayName(option, nameLanguage)}`,
      [nameLanguage],
    );

    const renderOption = useCallback(
      (
        props: HTMLAttributes<HTMLLIElement> & { key: Key },
        option: Pokemon,
      ) => {
        const { key, ...optionProps } = props;
        const hc = habitatColors[option.idealHabitat];
        const HabitatIcon = habitatIcons[option.idealHabitat];
        const dexLabel = `#${formatDexSegment(option.dexNumber)}`;
        const displayName = getPokemonDisplayName(option, nameLanguage);

        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{
              py: 0.75,
              alignItems: "flex-start !important",
              contentVisibility: "auto",
              containIntrinsicSize: "auto 72px",
            }}
          >
            <Stack spacing={0.75} width="100%">
              <Typography variant="body2" fontWeight={700} component="div">
                <Box
                  component="span"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  <MatchHighlight text={dexLabel} query={inputValue} />
                </Box>
                <Box component="span">
                  {" "}
                  <MatchHighlight text={displayName} query={inputValue} />
                </Box>
              </Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.75}>
                <Chip
                  icon={<HabitatIcon />}
                  label={
                    <MatchHighlight
                      text={option.idealHabitat}
                      query={inputValue}
                    />
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    bgcolor: "background.paper",
                    color: hc.text,
                    borderColor: hc.border,
                    "& .MuiChip-icon": {
                      color: hc.text,
                      ml: 0.5,
                      fontSize: 14,
                    },
                  }}
                />
                {option.specialties.map((specialty) => (
                  <SpecialtyChip
                    key={specialty}
                    label={
                      <MatchHighlight text={specialty} query={inputValue} />
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        );
      },
      [nameLanguage, habitatColors, inputValue],
    );

    return (
      <Autocomplete
        options={options}
        disabled={options.length === 0}
        value={null}
        inputValue={inputValue}
        onInputChange={(_, newValue, reason) => {
          if (reason === "reset") return;
          setInputValue(newValue);
        }}
        openOnFocus
        autoHighlight
        selectOnFocus
        clearOnBlur={false}
        getOptionLabel={getOptionLabel}
        filterOptions={filterOptions}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        noOptionsText="No Pokémon match your search"
        renderOption={renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Choose Pokémon"
            placeholder="Name, #, habitat, specialty…"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment
                    position="start"
                    sx={{ ml: 0.25, mr: -0.5 }}
                  >
                    <SearchIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                      aria-hidden
                    />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        onChange={(_, value) => {
          if (!value) return;
          onSelect(value.id);
          setInputValue("");
        }}
        slotProps={{
          popper: {
            sx: {
              "& .MuiPaper-root": {
                transition: "none",
              },
            },
          },
          listbox: {
            sx: { maxHeight: 360 },
          },
        }}
      />
    );
  },
);
