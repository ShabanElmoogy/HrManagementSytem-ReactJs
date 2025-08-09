import { useState } from "react";
import { Container, Stack, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";

import ProfileHeader from "./profileHeader/profileHeader";
import ProfileTabs from "./profileTabs/profileTabs";
import { useNotifications } from "@/shared";

const ProfilePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userData, setUserData] = useState({});
  const { showSuccess, showError, showInfo, showWarning, SnackbarComponent } =
    useNotifications();
  const { t } = useTranslation();

  // Handle user info updates from PersonalInfo component
  const handleUserInfoUpdated = (updatedUserData) => {
    setUserData(updatedUserData);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Fade in={true} timeout={800}>
        <Stack spacing={1}>
          {/* Profile Header Card */}
          <ProfileHeader
            userData={userData}
            showSuccess={showSuccess}
            showError={showError}
            showInfo={showInfo}
            showWarning={showWarning}
          />

          {/* Tabs Section */}
          <ProfileTabs
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            userData={userData}
            showSuccess={showSuccess}
            showError={showError}
            showInfo={showInfo}
            showWarning={showWarning}
            onInfoUpdated={handleUserInfoUpdated}
          />
        </Stack>
      </Fade>
      {SnackbarComponent}
    </Container>
  );
};

export default ProfilePage;
