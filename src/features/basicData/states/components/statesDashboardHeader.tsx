import { AnimatedStatCard } from "@/shared";
import {
  Assessment,
  LocationOn,
  Public,
  Speed,
} from "@mui/icons-material";
import {
  Box,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { ReactElement } from "react";

interface State {
  id: number;
  nameAr?: string;
  nameEn?: string;
  code?: string;
  countryId?: number;
  country?: {
    id: number;
    nameAr: string;
    nameEn: string;
  };
}

interface StateStats {
  totalStates: number;
  withCodes: number;
  uniqueCountries: number;
  completedProfiles: number;
}

interface StatConfig {
  icon: ReactElement;
  title: string;
  value: number | string;
  color: "primary" | "success" | "info" | "warning" | "secondary" | "error";
}

interface StatesDashboardHeaderProps {
  states: State[];
  loading: boolean;
  t: (key: string) => string;
}

const StatesDashboardHeader = ({ states, loading, t }: StatesDashboardHeaderProps) => {
  const theme = useTheme();

  // Calculate statistics
  const stats = useMemo((): StateStats => {
    if (!states || states.length === 0) {
      return {
        totalStates: 0,
        withCodes: 0,
        uniqueCountries: 0,
        completedProfiles: 0,
      };
    }

    const completedProfiles = states.filter(
      (s: State) =>
        s.nameAr &&
        s.nameEn &&
        s.code &&
        s.countryId
    ).length;

    const uniqueCountries = new Set(states.map(s => s.countryId)).size;

    return {
      totalStates: states.length,
      withCodes: states.filter((s: State) => s.code && s.code.trim()).length,
      uniqueCountries,
      completedProfiles,
    };
  }, [states]);

  // Get completion percentage
  const completionRate = useMemo((): number => {
    if (stats.totalStates === 0) return 0;
    return Math.round((stats.completedProfiles / stats.totalStates) * 100);
  }, [stats.completedProfiles, stats.totalStates]);

  // Stats configuration
  const statsConfig: StatConfig[] = [
    {
      icon: <LocationOn />,
      title: t("states.dashboard.totalStates"),
      value: stats.totalStates,
      color: "primary",
    },
    {
      icon: <Assessment />,
      title: t("states.dashboard.completedProfiles"),
      value: stats.completedProfiles,
      color: "success",
    },
    {
      icon: <Public />,
      title: t("states.dashboard.uniqueCountries"),
      value: stats.uniqueCountries,
      color: "info",
    },
    {
      icon: <LocationOn />,
      title: t("states.dashboard.withCodes"),
      value: stats.withCodes,
      color: "warning",
    },
    {
      icon: <Speed />,
      title: t("states.dashboard.dataQuality"),
      value: `${completionRate}%`,
      color:
        completionRate >= 80
          ? "success"
          : completionRate >= 50
            ? "warning"
            : "error",
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        {statsConfig.map((stat, index) => (
          <AnimatedStatCard
            onClick={undefined}
            key={index}
            loading={loading}
            theme={theme}
            {...stat} />
        ))}
      </Box>
    </Box>
  );
};

export default StatesDashboardHeader;