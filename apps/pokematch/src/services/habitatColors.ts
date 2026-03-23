import type { SvgIconComponent } from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import type { Habitat } from "../types/types";

export const habitatColors: Record<
  Habitat,
  { bg: string; text: string; border: string }
> = {
  Bright: { bg: "#fffde7", text: "#f57f17", border: "#f9a825" },
  Cool: { bg: "#e0f7fa", text: "#006064", border: "#00acc1" },
  Dark: { bg: "#f3e5f5", text: "#4a148c", border: "#7b1fa2" },
  Dry: { bg: "#fbe9e7", text: "#bf360c", border: "#e64a19" },
  Humid: { bg: "#e1f5fe", text: "#01579b", border: "#0288d1" },
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
