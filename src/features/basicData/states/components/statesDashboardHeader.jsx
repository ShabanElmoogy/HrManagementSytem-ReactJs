import { AnimatedStatCard } from "@/shared";
import {
  Assessment,
  LocationOn,
  Public,
  Speed,
  Map,
  Place,
} from "@mui/icons-material";
import {
  Box,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";

const StatesDashboardHeader = ({ states, loading, t }) => {
  const theme = useTheme();

  // Calculate statistics
  const stats = useMemo(() => {
    if (!states || states.length === 0) {
      return {
        totalStates: 0,
        withCountries: 0,
        uniqueCountries: 0,
        completedProfiles: 0,
      };
    }

    const completedProfiles = states.filter(
      (s) =>
        s.nameAr &&
        s.nameEn &&
        s.code &&
        (s.countryId || s.country?.nameEn || s.country?.id)
    ).length;

    const uniqueCountries = new Set(
      states
        .filter(s => s.countryId || s.country?.id)
        .map(s => s.countryId || s.country?.id)
    ).size;

    return {
      totalStates: states.length,
      withCountries: states.filter((s) => s.countryId || s.country?.nameEn || s.country?.id).length,
      uniqueCountries,
      completedProfiles,
    };
  }, [states]);

  // Get completion percentage
  const completionRate = useMemo(() => {
    if (stats.totalStates === 0) return 0;
    return Math.round((stats.completedProfiles / stats.totalStates) * 100);
  }, [stats.completedProfiles, stats.totalStates]);

  // Stats configuration
  const statsConfig = [
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
      icon: <Map />,
      title: t("states.dashboard.withCountries"),
      value: stats.withCountries,
      color: "warning",
    },
    {
      icon: <Place />,
      title: t("states.dashboard.avgStatesPerCountry"),
      value: stats.uniqueCountries > 0 ? Math.round(stats.totalStates / stats.uniqueCountries) : 0,
      color: "secondary",
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
            lg: "repeat(6, 1fr)",
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