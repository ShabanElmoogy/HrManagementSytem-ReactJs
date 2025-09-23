import {
  arabicOnly,
  englishOnly,
  flexNumber,
  uppercaseCode,
} from "@/constants";
import * as yup from "yup";

export const getCountryValidationSchema = (t) => {
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

    // Optional: Alpha2 Code
    alpha2Code: yup
      .string()
      .nullable()
      .trim()
      .transform((value) => (value ? value.toUpperCase() : null))
      .when([], {
        is: () => true,
        then: (schema) =>
          schema.matches(uppercaseCode(2), t("countries.invalidAlpha2Code")),
      }),

    // Optional: Alpha3 Code
    alpha3Code: yup
      .string()
      .nullable()
      .trim()
      .transform((value) => (value ? value.toUpperCase() : null))
      .when([], {
        is: () => true,
        then: (schema) =>
          schema.matches(uppercaseCode(3), t("countries.invalidAlpha3Code")),
      }),

    // Optional: Phone Code
    phoneCode: yup
      .string()
      .nullable()
      .trim()
      .when([], {
        is: () => true,
        then: (schema) =>
          schema.matches(
            flexNumber.range(1, 5),
            t("countries.invalidPhoneCode")
          ),
      }),

    // Optional: Currency Code
    currencyCode: yup
      .string()
      .nullable()
      .trim()
      .transform((value) => (value ? value.toUpperCase() : null))
      .when([], {
        is: () => true,
        then: (schema) =>
          schema.matches(uppercaseCode(3), t("countries.invalidCurrency")),
      }),
  });
};

export default getCountryValidationSchema;
