/* eslint-disable react/prop-types */
import { Stack } from "@mui/material";
import { MyTextField } from "@/shared/components";

const PersonalInfoForm = ({
  isEditing,
  control,
  errors,
  handleSubmit,
  handleSave,
}) => {
  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Stack spacing={3}>
        <MyTextField
          name="userName"
          labelKey="auth.userName"
          control={control}
          errors={errors}
          showCounter={false}
          readOnly={!isEditing}
        />

        <MyTextField
          name="firstName"
          labelKey="auth.firstName"
          control={control}
          errors={errors}
          showCounter={false}
          readOnly={!isEditing}
        />

        <MyTextField
          name="lastName"
          labelKey="auth.lastName"
          control={control}
          errors={errors}
          showCounter={false}
          readOnly={!isEditing}
        />
      </Stack>
    </form>
  );
};

export default PersonalInfoForm;
