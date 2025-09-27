export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
  position: string;
  department: string;
  managerId?: string;
  hireDate: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  nationality: string;
  address: EmployeeAddress;
  emergencyContact: EmergencyContact;
  employmentDetails: EmploymentDetails;
  salaryInfo: SalaryInfo;
  documents: EmployeeDocument[];
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface EmploymentDetails {
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: string;
  workSchedule: string;
  probationEndDate?: string;
  contractEndDate?: string;
}

export interface SalaryInfo {
  baseSalary: number;
  currency: string;
  payFrequency: 'monthly' | 'weekly' | 'bi-weekly';
  allowances: Allowance[];
  deductions: Deduction[];
  bankDetails: BankDetails;
}

export interface Allowance {
  type: string;
  amount: number;
  description?: string;
}

export interface Deduction {
  type: string;
  amount: number;
  description?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  accountType: 'checking' | 'savings';
}

export interface EmployeeDocument {
  id: string;
  type: 'contract' | 'id' | 'certificate' | 'resume' | 'other';
  name: string;
  fileUrl: string;
  uploadedAt: string;
  expiryDate?: string;
}

export interface EmployeeFilters {
  department?: string;
  position?: string;
  status?: Employee['status'];
  country?: string;
  city?: string;
  hireDateFrom?: string;
  hireDateTo?: string;
  search?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: { name: string; count: number }[];
  countries: { name: string; count: number }[];
  newHiresThisMonth: number;
  turnoverRate: number;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  nationality: string;
  address: EmployeeAddress;
  emergencyContact: EmergencyContact;
  employmentDetails: EmploymentDetails;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string;
  status?: Employee['status'];
}