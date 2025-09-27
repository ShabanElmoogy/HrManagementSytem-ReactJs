export interface District {
  id: string | number;
  nameAr: string;
  nameEn: string;
  code: string;
  stateId: number;
  state?: SimpleState;
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

export interface DistrictRequest {
  id: number;
  nameAr: string;
  nameEn: string;
  code: string;
  stateId: number;
}

export interface CreateDistrictRequest {
  nameEn: string;
  nameAr: string;
  code: string;
  stateId: number;
}

export interface UpdateDistrictRequest extends CreateDistrictRequest {
  id: string | number;
}

export interface DistrictResponse {
  id: number;
  nameAr: string;
  nameEn: string;
  code: string;
  stateId: number;
  createdOn: string;
  updatedOn: string | null;
  isDeleted: boolean;
}

export interface DistrictFilters {
  search?: string;
  stateId?: number;
  isActive?: boolean;
}

export interface DistrictQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: DistrictFilters;
}