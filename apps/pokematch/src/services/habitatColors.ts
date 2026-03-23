import type { Habitat } from "../types/types";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import type { SvgIconComponent } from "@mui/icons-material";

export const habitatColors: Record<
  Habitat,
  { bg: string; text: string; border: string }
> = {
  Bright: { bg: "#fffde7", text: "#f57f17", border: "#f9a825" },
  Cool: { bg: "#e3f2fd", text: "#0277bd", border: "#0288d1" },
  Dark: { bg: "#ede7f6", text: "#4527a0", border: "#5e35b1" },
  Dry: { bg: "#fbe9e7", text: "#bf360c", border: "#e64a19" },
  Humid: { bg: "#e8f5e9", text: "#1b5e20", border: "#388e3c" },
  Warm: { bg: "#fff3e0", text: "#e65100", border: "#f57c00" },
};

export const habitatIcons: Record<Habitat, SvgIconComponent> = {
  Bright: WbSunnyIcon,
  Cool: AcUnitIcon,
  Dark: DarkModeIcon,
  Dry: LandscapeIcon,
  Humid: WaterDropIcon,
  Warm: LocalFireDepartmentIcon,
};
