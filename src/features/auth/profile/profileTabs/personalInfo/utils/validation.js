import * as yup from "yup";
import { englishOnly } from "@/constants/regex";

// Function to generate the schema with translations
const getPersonalDetailsSchema = (t) =>
  yup.object({
    firstName: yup
      .string()
      .required(t("validation.required"))
      .min(2, t("validation.minLengthError", { count: 2 }))
      .max(50, t("validation.maxLengthError", { count: 50 })),

    lastName: yup
      .string()
      .required(t("validation.required"))
      .min(2, t("validation.minLengthError", { count: 2 }))
      .max(50, t("validation.maxLengthError", { count: 50 })),

    userName: yup
      .string()
      .required(t("validation.required"))
      .min(2, t("validation.minLengthError", { count: 2 }))
      .max(50, t("validation.maxLengthError", { count: 50 }))
      .matches(englishOnly, t("validation.englishOnly")),
  });

export default getPersonalDetailsSchema;
