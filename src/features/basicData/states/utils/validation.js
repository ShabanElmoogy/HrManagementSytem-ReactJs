import {
  arabicOnly,
  englishOnly,
} from "@/constants";
import * as yup from "yup";

export const getStateValidationSchema = (t) => {
  return yup.object({
    // Required: Arabic Name
    nameAr: yup
      .string()
      .trim()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(arabicOnly, t("validation.invalidArabicName")),

    // Required: English Name
    nameEn: yup
      .string()
      .trim()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(100, t("validation.maxLength", { count: 100 }))
      .matches(englishOnly, t("validation.invalidEnglishName")),

    // Required: Code
    code: yup
      .string()
      .trim()
      .required(t("validation.required"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(10, t("validation.maxLength", { count: 10 })),

    // Required: Country ID
    countryId: yup
      .number()
      .required(t("validation.required"))
      .min(1, t("validation.required")),
  });
};

export default getStateValidationSchema;