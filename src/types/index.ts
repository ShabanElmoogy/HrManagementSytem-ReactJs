// Common types for the HR Management System

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Employee Types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  manager?: string;
  hireDate: string;
  salary?: number;
  status: EmployeeStatus;
  avatar?: string;
}

export type EmployeeStatus = 'active' | 'inactive' | 'terminated' | 'on-leave';

// Department Types
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  employeeCount: number;
  budget?: number;
}

// Leave Management Types
export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  status: AttendanceStatus;
  notes?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'holiday';

// Payroll Types
export interface PayrollRecord {
  id: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  generatedAt: string;
}

export type PayrollStatus = 'draft' | 'processed' | 'paid';

// Performance Types
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  goals: Goal[];
  overallRating: number;
  comments: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  achievement: string;
  rating: number;
}

export type ReviewStatus = 'draft' | 'in-progress' | 'completed' | 'approved';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: any;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Chart/Dashboard Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  todayAttendance: number;
}

// Filter and Search Types
export interface FilterOptions {
  department?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Component Props Types
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Store/State Types
export interface AppState {
  auth: AuthState;
  employees: Employee[];
  departments: Department[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;