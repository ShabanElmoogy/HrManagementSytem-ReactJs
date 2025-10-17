// Centralized dummy data for the Home dashboard

// KPI core data (icons are assigned in the row component)
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

// Line chart: headcount/hiring/attrition trend
export const monthlyTrend = [
  { month: "Jan", headcount: 1100, hires: 45, attrition: 18 },
  { month: "Feb", headcount: 1120, hires: 38, attrition: 20 },
  { month: "Mar", headcount: 1145, hires: 52, attrition: 22 },
  { month: "Apr", headcount: 1170, hires: 49, attrition: 24 },
  { month: "May", headcount: 1195, hires: 56, attrition: 28 },
  { month: "Jun", headcount: 1210, hires: 44, attrition: 32 },
  { month: "Jul", headcount: 1235, hires: 60, attrition: 35 },
  { month: "Aug", headcount: 1250, hires: 58, attrition: 40 },
  { month: "Sep", headcount: 1265, hires: 55, attrition: 36 },
  { month: "Oct", headcount: 1278, hires: 50, attrition: 42 },
  { month: "Nov", headcount: 1284, hires: 62, attrition: 48 },
  { month: "Dec", headcount: 1290, hires: 48, attrition: 40 },
];

// Series keys (colors are applied in the component via theme)
export const monthlySeriesKeys = [
  { key: "headcount", name: "Headcount" },
  { key: "hires", name: "Hires" },
  { key: "attrition", name: "Attrition" },
];

// Donut: workforce by department
export const departmentDistribution = [
  { name: "Engineering", value: 420 },
  { name: "Sales", value: 240 },
  { name: "Operations", value: 200 },
  { name: "HR", value: 80 },
  { name: "Marketing", value: 160 },
  { name: "Finance", value: 184 },
];

// Timeline: recent HR activity
export const hrTimeline = [
  {
    date: "2025-10-28",
    title: "Leadership Training Completed",
    description: "Completed Q4 leadership development program across EMEA",
    status: "success",
    value: 42,
    category: "Learning",
    priority: "medium",
  },
  {
    date: "2025-10-25",
    title: "Campus Hiring Drive",
    description: "Closed 12 graduate hires in North America",
    status: "info",
    value: 12,
    category: "Hiring",
    priority: "low",
  },
  {
    date: "2025-10-19",
    title: "Policy Update: Remote Work",
    description: "Updated remote work policy with flexible hours guidance",
    status: "warning",
    value: 1,
    category: "Policy",
    priority: "high",
  },
  {
    date: "2025-10-10",
    title: "Attrition Spike Analysis",
    description: "Completed root-cause analysis for APAC attrition spike",
    status: "error",
    value: 6,
    category: "Attrition",
    priority: "high",
  },
];

// World map data
export const worldData = [
  { id: "US", name: "United States", employees: 520, offices: 4, revenue: 1850000, currency: "USD", timezone: "UTC-5 to -8", flag: "🇺🇸" },
  { id: "GB", name: "United Kingdom", employees: 120, offices: 1, revenue: 380000, currency: "GBP", timezone: "UTC+0", flag: "🇬🇧" },
  { id: "DE", name: "Germany", employees: 160, offices: 1, revenue: 420000, currency: "EUR", timezone: "UTC+1", flag: "🇩🇪" },
  { id: "IN", name: "India", employees: 260, offices: 2, revenue: 520000, currency: "INR", timezone: "UTC+5:30", flag: "🇮🇳" },
  { id: "CN", name: "China", employees: 80, offices: 1, revenue: 260000, currency: "CNY", timezone: "UTC+8", flag: "🇨🇳" },
  { id: "JP", name: "Japan", employees: 40, offices: 1, revenue: 210000, currency: "JPY", timezone: "UTC+9", flag: "🇯🇵" },
  { id: "AU", name: "Australia", employees: 28, offices: 1, revenue: 90000, currency: "AUD", timezone: "UTC+10", flag: "🇦🇺" },
  { id: "EG", name: "Egypt", employees: 24, offices: 1, revenue: 82000, currency: "EGP", timezone: "UTC+2", flag: "🇪🇬" },
  { id: "ZA", name: "South Africa", employees: 20, offices: 1, revenue: 76000, currency: "ZAR", timezone: "UTC+2", flag: "🇿🇦" },
  { id: "BR", name: "Brazil", employees: 32, offices: 1, revenue: 110000, currency: "BRL", timezone: "UTC-3", flag: "🇧🇷" },
];

// Recruitment funnel
export const recruitmentFunnel = [
  { name: "Applications", value: 820 },
  { name: "Screening", value: 540 },
  { name: "Interviews", value: 260 },
  { name: "Offers", value: 78 },
  { name: "Hires", value: 46 },
];

// Attendance heatmap (weekday x hour)
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17"];
export const attendanceHeatmap = (() => {
  const heat = [];
  weekdays.forEach((d) => {
    hours.forEach((h, idx) => {
      heat.push({ x: h, y: d, value: 40 + Math.round(Math.abs(Math.sin(idx + d.length) * 60)) });
    });
  });
  return heat;
})();

// Gauges
export const engagementScore = 78; // /100
export const complianceScore = 92; // /100

// Sparklines
export const sparklineSatisfaction = [
  { value: 3.8 }, { value: 4.0 }, { value: 4.1 }, { value: 4.0 }, { value: 4.2 }, { value: 4.3 }, { value: 4.4 }
];
export const sparklineOvertime = [
  { value: 120 }, { value: 110 }, { value: 140 }, { value: 130 }, { value: 150 }, { value: 160 }, { value: 140 }
];
export const sparklineHiring = [
  { value: 36 }, { value: 42 }, { value: 40 }, { value: 48 }, { value: 44 }, { value: 52 }, { value: 46 }
];

// Other quick stats
export const timeToHireDays = 28;
