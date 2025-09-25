import { AnimatedStatCard } from "@/shared";
import {
  Assessment,
  AttachMoney,
  Language,
  Phone,
  Public,
  Speed,
} from "@mui/icons-material";
import {
  Box,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { ReactElement } from "react";

interface Country {
  id: number;
  nameAr?: string;
  nameEn?: string;
  alpha2Code?: string;
  alpha3Code?: string;
  phoneCode?: string;
  currencyCode?: string;
}

interface CountryStats {
  totalCountries: number;
  withPhoneCodes: number;
  withCurrencies: number;
  withAlphaCodes: number;
  completedProfiles: number;
}

interface StatConfig {
  icon: ReactElement;
  title: string;
  value: number | string;
  color: "primary" | "success" | "info" | "warning" | "secondary" | "error";
}

interface CountriesDashboardHeaderProps {
  countries: Country[];
  loading: boolean;
  t: (key: string) => string;
}

const CountriesDashboardHeader = ({ countries, loading, t }: CountriesDashboardHeaderProps) => {
  const theme = useTheme();

  // Calculate statistics
  const stats = useMemo((): CountryStats => {
    if (!countries || countries.length === 0) {
      return {
        totalCountries: 0,
        withPhoneCodes: 0,
        withCurrencies: 0,
        withAlphaCodes: 0,
        completedProfiles: 0,
      };
    }

    const completedProfiles = countries.filter(
      (c: Country) =>
        c.nameAr &&
        c.nameEn &&
        c.alpha2Code &&
        c.alpha3Code &&
        c.phoneCode &&
        c.currencyCode
    ).length;

    return {
      totalCountries: countries.length,
      withPhoneCodes: countries.filter((c: Country) => c.phoneCode && c.phoneCode.trim())
        .length,
      withCurrencies: countries.filter(
        (c: Country) => c.currencyCode && c.currencyCode.trim()
      ).length,
      withAlphaCodes: countries.filter((c: Country) => c.alpha2Code && c.alpha3Code)
        .length,
      completedProfiles,
    };
  }, [countries]);

  // Get completion percentage
  const completionRate = useMemo((): number => {
    if (stats.totalCountries === 0) return 0;
    return Math.round((stats.completedProfiles / stats.totalCountries) * 100);
  }, [stats.completedProfiles, stats.totalCountries]);

  // Stats configuration
  const statsConfig: StatConfig[] = [
    {
      icon: <Public />,
      title: t("countries.dashboard.totalCountries"),
      value: stats.totalCountries,
      color: "primary",
    },
    {
      icon: <Assessment />,
      title: t("countries.dashboard.completedProfiles"),
      value: stats.completedProfiles,
      color: "success",
    },
    {
      icon: <Language />,
      title: t("countries.dashboard.withAlphaCodes"),
      value: stats.withAlphaCodes,
      color: "info",
    },
    {
      icon: <Phone />,
      title: t("countries.dashboard.withPhoneCodes"),
      value: stats.withPhoneCodes,
      color: "warning",
    },
    {
      icon: <AttachMoney />,
      title: t("countries.dashboard.withCurrencies"),
      value: stats.withCurrencies,
      color: "secondary",
    },
    {
      icon: <Speed />,
      title: t("countries.dashboard.dataQuality"),
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

export default CountriesDashboardHeader;
