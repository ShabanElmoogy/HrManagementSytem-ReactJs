import { arabicOnly, englishOnly } from "@/constants";
import * as yup from "yup";

export const getAddressTypeValidationSchema = (t: (key: string, params?: any) => string) => {
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
  });
};

export default getAddressTypeValidationSchema;
