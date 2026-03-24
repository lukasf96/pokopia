import {
  ArrowBackOutlined,
  Check,
  ChevronRight,
  DarkModeOutlined,
  InfoOutlined,
  LightModeOutlined,
  PaletteOutlined,
  SettingsBrightnessOutlined,
  SettingsOutlined,
  TranslateOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useStore } from "../../store/store";
import { LayoutInfoDialog } from "./LayoutInfoDialog";

export function LayoutSettingsMenu() {
  const nameLanguage = useStore((s) => s.nameLanguage);
  const themeMode = useStore((s) => s.themeMode);
  const setNameLanguage = useStore((s) => s.setNameLanguage);
  const setThemeMode = useStore((s) => s.setThemeMode);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [settingsView, setSettingsView] = useState<
    "root" | "language" | "theme"
  >("root");
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const isSettingsOpen = Boolean(settingsAnchorEl);

  function openSettingsMenu(event: React.MouseEvent<HTMLElement>) {
    setSettingsAnchorEl(event.currentTarget);
    setSettingsView("root");
  }

  function closeSettingsMenu() {
    setSettingsAnchorEl(null);
    setSettingsView("root");
  }

  function openInfoDialog() {
    setIsInfoDialogOpen(true);
    closeSettingsMenu();
  }

  function handleLanguageChange(language: "en" | "de" | "fr") {
    setNameLanguage(language);
    closeSettingsMenu();
  }

  function handleThemeModeChange(mode: "system" | "light" | "dark") {
    setThemeMode(mode);
    closeSettingsMenu();
  }

  const selectedLanguageLabel =
    nameLanguage === "en"
      ? "English"
      : nameLanguage === "de"
        ? "Deutsch"
        : "Français";
  const selectedThemeLabel =
    themeMode === "system"
      ? "System"
      : themeMode === "light"
        ? "Light"
        : "Dark";

  const menuItemBody2 = { typography: "body2" } as const;

  return (
    <>
      <IconButton
        size="small"
        onClick={openSettingsMenu}
        aria-label="Open settings"
        aria-controls={isSettingsOpen ? "layout-settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isSettingsOpen ? "true" : undefined}
        sx={{ ml: { xs: 0, sm: 0.5 } }}
      >
        <SettingsOutlined fontSize="small" />
      </IconButton>

      <Menu
        id="layout-settings-menu"
        anchorEl={settingsAnchorEl}
        open={isSettingsOpen}
        onClose={closeSettingsMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { mt: 0.5, minWidth: 240 },
          },
        }}
      >
        {settingsView === "root"
          ? [
              <MenuItem
                key="root-language"
                onClick={() => setSettingsView("language")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <TranslateOutlined fontSize="small" />
                  <Box>
                    <Typography variant="body2">Pokemon Language</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedLanguageLabel}
                    </Typography>
                  </Box>
                </Box>
                <ChevronRight fontSize="small" color="action" />
              </MenuItem>,
              <MenuItem
                key="root-theme"
                onClick={() => setSettingsView("theme")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <PaletteOutlined fontSize="small" />
                  <Box>
                    <Typography variant="body2">Theme</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedThemeLabel}
                    </Typography>
                  </Box>
                </Box>
                <ChevronRight fontSize="small" color="action" />
              </MenuItem>,
              <MenuItem
                key="root-info"
                onClick={openInfoDialog}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <InfoOutlined fontSize="small" />
                  <Box>
                    <Typography variant="body2">Info</Typography>
                  </Box>
                </Box>
              </MenuItem>,
            ]
          : null}
        {settingsView === "language"
          ? [
              <MenuItem
                key="language-back"
                onClick={() => setSettingsView("root")}
                sx={{ ...menuItemBody2, mb: 0.5 }}
              >
                <ArrowBackOutlined sx={{ mr: 1 }} fontSize="small" />
                Back
              </MenuItem>,
              <MenuItem
                key="language-en"
                selected={nameLanguage === "en"}
                onClick={() => handleLanguageChange("en")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                English
                {nameLanguage === "en" ? (
                  <Check fontSize="small" color="primary" />
                ) : null}
              </MenuItem>,
              <MenuItem
                key="language-de"
                selected={nameLanguage === "de"}
                onClick={() => handleLanguageChange("de")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                Deutsch
                {nameLanguage === "de" ? (
                  <Check fontSize="small" color="primary" />
                ) : null}
              </MenuItem>,
              <MenuItem
                key="language-fr"
                selected={nameLanguage === "fr"}
                onClick={() => handleLanguageChange("fr")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                Français
                {nameLanguage === "fr" ? (
                  <Check fontSize="small" color="primary" />
                ) : null}
              </MenuItem>,
            ]
          : null}
        {settingsView === "theme"
          ? [
              <MenuItem
                key="theme-back"
                onClick={() => setSettingsView("root")}
                sx={{ ...menuItemBody2, mb: 0.5 }}
              >
                <ArrowBackOutlined sx={{ mr: 1 }} fontSize="small" />
                Back
              </MenuItem>,
              <MenuItem
                key="theme-system"
                selected={themeMode === "system"}
                onClick={() => handleThemeModeChange("system")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <SettingsBrightnessOutlined fontSize="small" />
                  System
                </Box>
                {themeMode === "system" ? (
                  <Check fontSize="small" color="primary" />
                ) : null}
              </MenuItem>,
              <MenuItem
                key="theme-light"
                selected={themeMode === "light"}
                onClick={() => handleThemeModeChange("light")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <LightModeOutlined fontSize="small" />
                  Light
                </Box>
                {themeMode === "light" ? (
                  <Check fontSize="small" color="primary" />
                ) : null}
              </MenuItem>,
              <MenuItem
                key="theme-dark"
                selected={themeMode === "dark"}
                onClick={() => handleThemeModeChange("dark")}
                sx={{
                  ...menuItemBody2,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <DarkModeOutlined fontSize="small" />
                  Dark
                </Box>
                {themeMode === "dark" ? (
                  <Check fontSize="small" color="primary" />
                ) : null}
              </MenuItem>,
            ]
          : null}
      </Menu>
      <LayoutInfoDialog
        isOpen={isInfoDialogOpen}
        onClose={() => setIsInfoDialogOpen(false)}
      />
    </>
  );
}
