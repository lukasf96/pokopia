import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { SettingsOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { appRoutes } from "./router/routes";
import { allPokemon } from "./services/pokemon";
import { useStore } from "./store/store";

const TOTAL_POKEMON = allPokemon.length;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const unlockedCount = useStore((s) => s.unlockedIds.size);
  const nameLanguage = useStore((s) => s.nameLanguage);
  const setNameLanguage = useStore((s) => s.setNameLanguage);
  const { pathname } = useLocation();
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const isMatchMakerActive = pathname === appRoutes.matchmaker;
  const isOverviewActive = pathname === appRoutes.overview;
  const isPokedexActive = pathname === appRoutes.pokedex;
  const isSettingsOpen = Boolean(settingsAnchorEl);

  function openSettingsMenu(event: React.MouseEvent<HTMLElement>) {
    setSettingsAnchorEl(event.currentTarget);
  }

  function closeSettingsMenu() {
    setSettingsAnchorEl(null);
  }

  function handleLanguageChange(language: "en" | "de" | "fr") {
    setNameLanguage(language);
    closeSettingsMenu();
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: "0 1px 0 0 rgb(15 23 42 / 0.04)",
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: 1.5,
        }}
      >
        <Typography variant="h5" fontWeight={700} letterSpacing={-0.5}>
          Pokopia Match-Maker
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ minWidth: 0, overflowX: "auto", pb: 0.25, ml: "auto" }}
        >
          <NavItem active={isMatchMakerActive} to={appRoutes.matchmaker}>
            Match-Maker
          </NavItem>
          <NavItem active={isOverviewActive} to={appRoutes.overview}>
            Overview
          </NavItem>
          <NavItem active={isPokedexActive} to={appRoutes.pokedex}>
            Pokédex
            <Chip
              label={`${unlockedCount}/${TOTAL_POKEMON}`}
              size="small"
              sx={{ ml: 0.75, height: 16, fontSize: 10 }}
            />
          </NavItem>
          <IconButton
            size="small"
            onClick={openSettingsMenu}
            aria-label="Open settings"
            aria-controls={isSettingsOpen ? "layout-settings-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isSettingsOpen ? "true" : undefined}
            sx={{ ml: 0.5 }}
          >
            <SettingsOutlined fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Menu
        id="layout-settings-menu"
        anchorEl={settingsAnchorEl}
        open={isSettingsOpen}
        onClose={closeSettingsMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { mt: 0.5, minWidth: 160 },
          },
        }}
      >
        <MenuItem
          selected={nameLanguage === "en"}
          onClick={() => handleLanguageChange("en")}
        >
          Language: EN
        </MenuItem>
        <MenuItem
          selected={nameLanguage === "de"}
          onClick={() => handleLanguageChange("de")}
        >
          Language: DE
        </MenuItem>
        <MenuItem
          selected={nameLanguage === "fr"}
          onClick={() => handleLanguageChange("fr")}
        >
          Language: FR
        </MenuItem>
      </Menu>

      {children}
    </Box>
  );
}

function NavItem({
  active,
  to,
  children,
}: {
  active: boolean;
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        textDecoration: "none",
        cursor: "pointer",
        py: 0.5,
        px: 1,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        color: active ? "text.primary" : "text.secondary",
        borderRadius: 1,
        bgcolor: active ? "action.selected" : "transparent",
        display: "flex",
        alignItems: "center",
        transition: "background-color 0.15s ease, color 0.15s ease",
        whiteSpace: "nowrap",
        "&:hover": {
          color: "text.primary",
          bgcolor: active ? "action.selected" : "action.hover",
        },
      }}
    >
      {children}
    </Box>
  );
}
