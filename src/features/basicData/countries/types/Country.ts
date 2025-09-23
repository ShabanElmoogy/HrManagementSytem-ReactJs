export interface Country {
  id: string | number;
  nameAr: string;
  nameEn: string;
  alpha2Code: string;
  alpha3Code: string;
  phoneCode: string;
  currencyCode: string;
  createdOn: string;
  updatedOn: string;
  [key: string]: any;
}

export interface CreateCountryRequest {
  nameEn: string;
  nameAr: string;
  alpha2Code?: string | null;
  alpha3Code?: string | null;
  phoneCode?: string | null;
  currencyCode?: string | null;
}
