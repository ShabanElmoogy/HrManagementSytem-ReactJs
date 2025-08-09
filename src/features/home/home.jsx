import { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MyHeader } from "@/shared/components";
import useCountryStore from "../../features/basicData/countries/store/useCountryStore";

const Home = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect immediately on mount
    setIsVisible(true);
  }, []); // Runs once on mount

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0, // Fade from 0 to 1
        transition: "opacity 1s ease-in-out", // 1-second fade effect
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <MyHeader
          isDashboard={true}
          title={t("menu.dashboard")}
          subTitle={t("menu.welcomeToYourDashboard")}
        />
      </Stack>
    </Box>
  );
};

export default Home;
