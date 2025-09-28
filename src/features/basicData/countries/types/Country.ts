import { AddressType } from "../../addressesType";

export interface Country {
  id: string | number;
  nameAr: string;
  nameEn: string;
  alpha2Code: string;
  alpha3Code: string;
  phoneCode: string;
  currencyCode: string | null;
  states?: SimpleState[];
  statesCount?: number;
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
  [key: string]: any;
}

export interface SimpleState {
  id: string | number;
  nameAr: string;
  nameEn: string;
  code?: string;
  isDeleted: boolean;
}

export interface CreateCountryRequest {
  nameEn: string;
  nameAr: string;
  alpha2Code?: string | null;
  alpha3Code?: string | null;
  phoneCode?: string | null;
  currencyCode?: string | null;
}

export interface UpdateCountryRequest extends CreateCountryRequest {
  id: string | number;
}

export interface CountryResponse {
  id: number;
  nameAr: string;
  nameEn: string;
  alpha2Code: string;
  alpha3Code: string;
  phoneCode: string;
  currencyCode: string | null;
  states: SimpleState[];
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
}

export interface CountryFilters {
  search?: string;
  hasStates?: boolean;
  hasCurrency?: boolean;
  hasPhoneCode?: boolean;
  isActive?: boolean;
}

export interface CountryQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: CountryFilters;
}

