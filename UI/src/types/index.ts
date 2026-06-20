export interface EmployeeFeatures {
  Age: number;
  BusinessTravel: number;
  DailyRate: number;
  Department: number;
  DistanceFromHome: number;
  Education: number;
  EducationField: number;
  EnvironmentSatisfaction: number;
  Gender: number;
  HourlyRate: number;
  JobInvolvement: number;
  JobLevel: number;
  JobRole: number;
  JobSatisfaction: number;
  MaritalStatus: number;
  MonthlyIncome: number;
  MonthlyRate: number;
  NumCompaniesWorked: number;
  OverTime: number;
  PercentSalaryHike: number;
  PerformanceRating: number;
  RelationshipSatisfaction: number;
  StockOptionLevel: number;
  TotalWorkingYears: number;
  TrainingTimesLastYear: number;
  WorkLifeBalance: number;
  YearsAtCompany: number;
  YearsInCurrentRole: number;
  YearsSinceLastPromotion: number;
  YearsWithCurrManager: number;
}

export interface PredictionResponse {
  attrition_prediction: number;
  attrition_label: string;
  attrition_probability: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_uri: string;
}

export interface ApiState {
  connected: boolean;
  modelLoaded: boolean;
  responseTime: number | null;
  error: string | null;
}
