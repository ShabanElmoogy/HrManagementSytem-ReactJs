// chartExamplesConfig.tsx
import AssessmentIcon from "@mui/icons-material/Assessment";
import { appRoutes } from "../../../../routes/appRoutes";
import { NavigationColors, NavigationTitles, NavigationSectionId } from "../navigationTypes";
import { createColoredIcon, createNavItem, createNavSection } from "../navigationUtils";

export const getChartExamplesConfig = () => {
  const sectionIcon = createColoredIcon(<AssessmentIcon />, NavigationColors.CHART_BLUE);
  const itemIcon = createColoredIcon(<AssessmentIcon />, NavigationColors.CHART_BLUE);

  const chartExamplesItems = [
    createNavItem(NavigationTitles.CHART_LIBRARY, itemIcon, appRoutes.chartExamples),
  ];

  return createNavSection(NavigationSectionId.CHART_EXAMPLES, NavigationTitles.CHART_EXAMPLES, sectionIcon, chartExamplesItems);
};