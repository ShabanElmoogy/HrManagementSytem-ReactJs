// KPI Row dummy data
export const kpisCore = [
  {
    title: "Total Employees",
    value: 1284,
    previousValue: 1210,
    target: 1300,
    color: "primary",
    description: "Global headcount across all regions",
  },
  {
    title: "Open Positions",
    value: 46,
    previousValue: 52,
    target: 40,
    color: "secondary",
    description: "Active requisitions company-wide",
  },
  {
    title: "Monthly Payroll",
    value: 3_780_000,
    previousValue: 3_650_000,
    target: 4_000_000,
    color: "success",
    description: "Gross payroll for current month",
  },
  {
    title: "Countries",
    value: 12,
    previousValue: 10,
    target: 15,
    color: "info",
    description: "Operating countries globally",
  },
];

// Mini charts data for KPI row
export const payrollTrend6m = [
  { month: "May", value: 3_650_000 },
  { month: "Jun", value: 3_690_000 },
  { month: "Jul", value: 3_720_000 },
  { month: "Aug", value: 3_740_000 },
  { month: "Sep", value: 3_760_000 },
  { month: "Oct", value: 3_780_000 },
];

export const openPositionsByDept = [
  { name: "Engineering", value: 18 },
  { name: "Sales", value: 10 },
  { name: "Operations", value: 7 },
  { name: "Marketing", value: 6 },
  { name: "HR", value: 3 },
  { name: "Finance", value: 2 },
];
