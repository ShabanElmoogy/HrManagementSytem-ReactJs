// State validation schemas
import * as yup from "yup";

export const getStateValidationSchema = (t: (key: string) => string) => {
  return yup.object().shape({
    nameAr: yup
      .string()
      .trim()
      .required(t("general.required"))
      .min(2, t("validation.minLength", { min: 2 }))
      .max(100, t("validation.maxLength", { max: 100 }))
      .matches(/^[\u0600-\u06FF\s]+$/, t("validation.arabicLettersOnly")),

    nameEn: yup
      .string()
      .trim()
      .required(t("general.required"))
      .min(2, t("validation.minLength", { min: 2 }))
      .max(100, t("validation.maxLength", { max: 100 }))
      .matches(/^[A-Za-z\s]+$/, t("validation.englishLettersOnly")),

    code: yup
      .string()
      .trim()
      .required(t("general.required"))
      .min(2, t("validation.minLength", { min: 2 }))
      .max(10, t("validation.maxLength", { max: 10 })),

    countryId: yup
      .number()
      .required(t("general.required"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerNumber")),
  });
};