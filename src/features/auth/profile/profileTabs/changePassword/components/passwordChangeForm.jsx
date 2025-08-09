/* eslint-disable react/prop-types */
import { MyTextField } from "@/shared/components";
import { Stack } from "@mui/material";

const PasswordChangeForm = ({
  handleChangePassword,
  SnackbarComponent,
  handleSubmit,
  isEditing,
  control,
  errors,
  t,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit(handleChangePassword)}>
        <Stack spacing={3}>
          <MyTextField
            type="password"
            name="currentPassword"
            label={t("auth.currentPassword")}
            control={control}
            errors={errors}
            readOnly={!isEditing}
            showPasswordToggle={true}
            showClearButton={true}
            maxLength={50}
          />

          <MyTextField
            type="password"
            name="newPassword"
            label={t("auth.newPassword")}
            control={control}
            errors={errors}
            readOnly={!isEditing}
            showPasswordToggle={true}
            showClearButton={true}
            maxLength={50}
            showCounter={false}
          />
        </Stack>
      </form>
    </>
  );
};

export default PasswordChangeForm;
