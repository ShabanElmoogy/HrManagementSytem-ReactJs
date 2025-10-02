// basicDataConfig.tsx
import { appRoutes } from "@/routes/appRoutes";
import {
  NavigationColors,
  NavigationTitles,
  NavigationSectionId,
  UserRoles,
} from "../navigationTypes";
import {
  createColoredIcon,
  createNavItem,
  createNavSection,
} from "../navigationUtils";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import TuneIcon from "@mui/icons-material/Tune";

export const getExtrasConfig = () => {
  const sectionIcon = createColoredIcon(
    <TuneIcon />,
    NavigationColors.PRIMARY_BLUE
  );
  const secondaryIcon = (icon: React.ReactElement) =>
    createColoredIcon(icon, NavigationColors.SECONDARY_BLUE);

  const extrasItems = [
    createNavItem(
      NavigationTitles.FILEMANAGER,
      secondaryIcon(<CloudDownloadIcon />),
      appRoutes.extras.filesManager,
      [UserRoles.ADMIN],
      undefined
    ),
  ];

  return createNavSection(
    NavigationSectionId.EXTRAS,
    NavigationTitles.EXTRAS,
    sectionIcon,
    extrasItems
  );
};
