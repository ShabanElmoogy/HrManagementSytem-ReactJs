export interface AddressType {
  id: number;
  nameAr: string;
  nameEn: string;
  createdOn?: string;
  updatedOn?: string;
  isDeleted?: boolean;
}

export interface CreateAddressTypeRequest {
  nameAr: string;
  nameEn: string;
}

export interface UpdateAddressTypeRequest {
  id: number;
  nameAr: string;
  nameEn: string;
}