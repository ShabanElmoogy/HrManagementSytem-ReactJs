import * as yup from "yup";
import { password } from "@/constants/regex";

const getPasswordChangeSchema = (t) =>
  yup.object({
    currentPassword: yup.string().required(t("validation.required")),

    newPassword: yup
      .string()
      .required(t("validation.required"))
      .min(8, t("validation.minLength", { count: 8 }))
      .matches(password, t("validation.invalidPassword"))
      .notOneOf(
        [yup.ref("currentPassword")],
        t("validation.passwordMustNotBeCurrent")
      ),
  });

export default getPasswordChangeSchema;
