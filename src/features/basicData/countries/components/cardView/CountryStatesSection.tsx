import React, { useState } from "react";
import { Box } from "@mui/system";
import { Button, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { ExpandLess, ExpandMore, LocationOn } from "@mui/icons-material";
import type { Country } from "../../types/Country";
import { AppChip } from "@/shared/components";
import { getActiveStates, formatStatesForDisplay } from "../../utils/statesUtils";

const paletteKeys = ["primary", "secondary", "success", "info", "warning", "error"] as const;
type ColorKey = typeof paletteKeys[number];

const hashString = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // Convert to 32bit integer
  }
  return Math.abs(h);
};

const colorKeyForState = (id: string | number, index: number): ColorKey => {
  const base = typeof id === "number" ? id : hashString(String(id));
  const idx = Math.abs((base + index) % paletteKeys.length);
  return paletteKeys[idx];
};

export interface CountryStatesSectionProps {
  country: Country;
  t: (key: string) => string;
}

export const CountryStatesSection: React.FC<CountryStatesSectionProps> = ({ country, t }) => {
  const theme = useTheme();
  const [showAllStates, setShowAllStates] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
        <Typography variant="body2" fontWeight="medium">
          {t("countries.states") || "States"}
        </Typography>
        {(() => {
          const activeStates = getActiveStates(country.states || []);
          const totalStates = country.states?.length || 0;
          const activeCount = activeStates.length;
          return (
            <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
              <AppChip
                label={`${activeCount} ${t("countries.active") || "Active"}`}
                colorKey="success"
                variant="outlined"
              />
              {totalStates > activeCount && (
                <AppChip
                  label={`${t("countries.total") || "Total"}: ${totalStates}`}
                  colorKey="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          );
        })()}
      </Stack>

      {country.states && getActiveStates(country.states).length > 0 && (
        <Box sx={{ ml: 3 }}>
          {(() => {
            const activeStates = getActiveStates(country.states || []);
            const defaultMaxDisplay = 6; // show more by default to better visualize colors
            const { displayStates, hasMore, moreCount } = formatStatesForDisplay(country.states, defaultMaxDisplay);
            const statesToRender = showAllStates ? activeStates : displayStates;

            return (
              <Stack spacing={0.75}>
                {statesToRender.map((state, idx) => {
                  const colorKey = colorKeyForState(state.id, idx);
                  const colorMain = theme.palette[colorKey].main;
                  return (
                    <Tooltip
                      key={state.id}
                      title={`${state.nameEn}${state.nameAr ? ` / ${state.nameAr}` : ""}${state.code ? ` (${state.code})` : ""}`}
                      arrow
                    >
                      <Stack direction="row" spacing={0.6} alignItems="center">
                        <AppChip
                          size="small"
                          icon={<Box sx={{ width: 8, height: 8, bgcolor: colorMain, borderRadius: "50%" }} />}
                          label={state.nameEn || state.nameAr || "N/A"}
                          colorKey={colorKey}
                          variant="outlined"
                          sx={{
                            px: 0.5,
                            height: 22,
                            fontSize: "0.72rem",
                            bgcolor: alpha(colorMain, 0.08),
                            borderColor: alpha(colorMain, 0.35),
                            "& .MuiChip-icon": { color: colorMain },
                            "&:hover": { bgcolor: alpha(colorMain, 0.16) },
                          }}
                        />
                        {state.code && (
                          <AppChip
                            label={state.code}
                            size="small"
                            colorKey={colorKey}
                            variant="outlined"
                            monospace
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              bgcolor: alpha(colorMain, 0.04),
                              borderColor: alpha(colorMain, 0.35),
                            }}
                          />
                        )}
                      </Stack>
                    </Tooltip>
                  );
                })}

                {(hasMore || showAllStates) && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setShowAllStates((v) => !v)}
                    startIcon={showAllStates ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: "0.75rem" }}
                  >
                    {showAllStates
                      ? (t("countries.showLessStates") || "Show less")
                      : (t("countries.showAllStates") || `Show all${hasMore ? ` (+${moreCount})` : ""}`)}
                  </Button>
                )}
              </Stack>
            );
          })()}
        </Box>
      )}
    </Box>
  );
};

export default CountryStatesSection;
