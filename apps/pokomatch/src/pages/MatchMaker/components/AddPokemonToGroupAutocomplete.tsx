import StarsIcon from "@mui/icons-material/Stars";
import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, type HTMLAttributes, type Key } from "react";
import {
  getHabitatColors,
  habitatIcons,
} from "../../../services/habitatColors";
import {
  getPokemonDisplayName,
  type PokemonNameLanguage,
} from "../../../services/pokemon-localization";
import type { Pokemon } from "../../../types/types";

function formatDexSegment(dexNumber: string): string {
  const trimmed = dexNumber.trim();
  if (/^\d+$/.test(trimmed)) return trimmed.padStart(3, "0");
  return trimmed;
}

interface AddPokemonToGroupAutocompleteProps {
  group: Pokemon[];
  availablePokemon: Pokemon[];
  nameLanguage: PokemonNameLanguage;
  onSelect: (pokemonId: string) => void;
}

export function AddPokemonToGroupAutocomplete({
  group,
  availablePokemon,
  nameLanguage,
  onSelect,
}: AddPokemonToGroupAutocompleteProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const options = useMemo(() => {
    const ids = new Set(group.map((m) => m.id));
    return availablePokemon.filter((p) => !ids.has(p.id));
  }, [group, availablePokemon]);

  const habitatColors = useMemo(() => getHabitatColors(theme), [theme]);

  const specialtyChipSx = useMemo(
    () => ({
      height: 20,
      fontSize: 10,
      fontWeight: 600,
      bgcolor: isDark
        ? alpha(theme.palette.primary.main, 0.15)
        : alpha(theme.palette.primary.main, 0.08),
      color: "primary.main",
      border: "1px solid",
      borderColor: alpha(theme.palette.primary.main, 0.2),
      "& .MuiChip-icon": { color: "inherit" },
    }),
    [theme, isDark],
  );

  const getOptionLabel = useCallback(
    (option: Pokemon) =>
      `#${formatDexSegment(option.dexNumber)} - ${getPokemonDisplayName(option, nameLanguage)}`,
    [nameLanguage],
  );

  const renderOption = useCallback(
    (props: HTMLAttributes<HTMLLIElement> & { key: Key }, option: Pokemon) => {
      const { key, ...optionProps } = props;
      const hc = habitatColors[option.idealHabitat];
      const HabitatIcon = habitatIcons[option.idealHabitat];

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
            <Typography variant="body2" fontWeight={700}>
              {getOptionLabel(option)}
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap gap={0.75}>
              <Chip
                icon={<HabitatIcon />}
                label={option.idealHabitat}
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
                <Chip
                  key={specialty}
                  label={specialty}
                  size="small"
                  icon={
                    <StarsIcon sx={{ fontSize: "14px !important" }} />
                  }
                  sx={specialtyChipSx}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      );
    },
    [getOptionLabel, habitatColors, specialtyChipSx],
  );

  return (
    <Autocomplete
      options={options}
      disabled={options.length === 0}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField {...params} size="small" label="Choose Pokémon" />
      )}
      onChange={(_, value) => {
        if (value) onSelect(value.id);
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
}
