import { TrendingUp } from "@mui/icons-material";
import { alpha, Box, Stack, Typography, useTheme, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Shared components and charts
import { MyHeader } from "@/shared/components";
import Section from "./components/Section";
import QuickInsights from "./QuickInsights";
import KpiRow from "./rows/01KpiRow";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "@/routes";
import AttendanceTrendsRow from "./rows/05AttendanceTrendsRow";
import GlobalPresenceRow from "./rows/03GlobalPresenceRow";
import HealthPipelineRow from "./rows/04HealthPipelineRow";
import TrendsRow from "./rows/02TrendsRow";

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect on mount
    setIsVisible(true);
  }, []);

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 600ms ease-in-out",
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(1200px 300px at 10% -20%, ${alpha(
            theme.palette.primary.main,
            0.18
          )} 0%, transparent 60%), radial-gradient(1000px 300px at 90% -10%, ${alpha(
            theme.palette.secondary.main,
            0.16
          )} 0%, transparent 60%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 12px 40px ${alpha(theme.palette.common.black, 0.5)}`
              : `0 12px 40px ${alpha(theme.palette.primary.main, 0.18)}`,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={2}
        >
          <MyHeader
            isDashboard
            title={t("menu.dashboard") || "Global HR Dashboard"}
            subTitle={
              t("menu.welcomeToYourDashboard") ||
              "Welcome to your centralized HR insights"
            }
          />

          {/* Quick Insights */}
          <QuickInsights />
        </Stack>
      </Box>

      {/* KPI CARDS SECTION */}
      <Section>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6">Key KPIs</Typography>
          <Button size="small" variant="outlined" onClick={() => navigate(appRoutes.kpis)}>
            View all KPIs
          </Button>
        </Stack>
        <KpiRow showAll={false} />
      </Section>

      <Box sx={{ height: 16 }} />

      {/* TRENDS & DISTRIBUTION SECTION */}
      <Section
        title="People Trends & Distribution"
        subtitle="Track workforce growth and department composition"
      >
        <TrendsRow />
      </Section>

      <Box sx={{ height: 16 }} />

      {/* GLOBAL PRESENCE & ACTIVITY */}
      <Section
        title="Global Presence & Activity"
        subtitle="World-wide footprint and the latest HR updates"
      >
        <GlobalPresenceRow />
      </Section>

      <Box sx={{ height: 16 }} />

      {/* HEALTH & PIPELINE */}
      <Section
        title="People Health & Hiring Pipeline"
        subtitle="Engagement, compliance and funnel conversion"
      >
        <HealthPipelineRow />
      </Section>

      <Box sx={{ height: 16 }} />

      {/* ATTENDANCE & MICRO-TRENDS */}
      <Section
        title="Attendance Heatmap & Micro-Trends"
        subtitle="In-office presence and short-term signals"
      >
        <AttendanceTrendsRow />
      </Section>

      {/* Bottom highlight strip */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background: `linear-gradient(90deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 6px 20px ${alpha(theme.palette.common.black, 0.4)}`
              : `0 6px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      >
        <TrendingUp color="primary" />
        <Typography variant="body2">
          Hiring momentum remains strong this quarter. Keep tracking your
          pipeline and upcoming onboarding tasks.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
