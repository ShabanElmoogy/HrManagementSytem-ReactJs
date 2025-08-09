//write suitable regex for email and password
export const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const password =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const englishOnly = /^[a-zA-Z0-9-_ ]*$/;

export const arabicOnly = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF ]*$/;

export const uppercaseCode = (length) => new RegExp(`^$|^[A-Z]{${length}}$`);

export const flexNumber = {
  // Exact length
  exact: (length) => new RegExp(`^$|^\\d{${length}}$`),

  // Range
  range: (min, max) => new RegExp(`^$|^\\d{${min},${max}}$`),

  // Minimum length
  min: (minLength) => new RegExp(`^$|^\\d{${minLength},}$`),

  // Maximum length
  max: (maxLength) => new RegExp(`^$|^\\d{1,${maxLength}}$`),

  // Required (no empty)
  required: (min = 1, max = 10) => new RegExp(`^\\d{${min},${max}}$`),
};

//how to use
//flexNumber.exact(3);
