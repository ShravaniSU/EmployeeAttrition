import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent, CSSProperties } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, DollarSign, TrendingUp, Zap, Loader2 } from "lucide-react";
import type { EmployeeFeatures } from "../types";

interface PredictionFormProps {
  onSubmit: (features: EmployeeFeatures) => void;
  isLoading: boolean;
}

const DEFAULT_FEATURES: EmployeeFeatures = {
  Age: 35,
  BusinessTravel: 1,
  DailyRate: 800,
  Department: 2,
  DistanceFromHome: 5,
  Education: 3,
  EducationField: 2,
  EnvironmentSatisfaction: 3,
  Gender: 1,
  HourlyRate: 65,
  JobInvolvement: 3,
  JobLevel: 2,
  JobRole: 4,
  JobSatisfaction: 3,
  MaritalStatus: 1,
  MonthlyIncome: 5000,
  MonthlyRate: 14000,
  NumCompaniesWorked: 2,
  OverTime: 0,
  PercentSalaryHike: 13,
  PerformanceRating: 3,
  RelationshipSatisfaction: 3,
  StockOptionLevel: 1,
  TotalWorkingYears: 10,
  TrainingTimesLastYear: 3,
  WorkLifeBalance: 3,
  YearsAtCompany: 5,
  YearsInCurrentRole: 3,
  YearsSinceLastPromotion: 1,
  YearsWithCurrManager: 3,
};

const SectionLabel = ({ text }: { text: string }) => (
  <div style={{ display: "flex", alignItems: "flex-end", marginTop: "28px", marginBottom: "16px" }}>
    <span
      style={{
        fontSize: "10px",
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#F3EFE6",
        backgroundColor: "#8B5E3C",
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: "0.1em",
        padding: "4px 12px",
        borderTopLeftRadius: "3px",
        borderTopRightRadius: "3px",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
    <div
      style={{
        height: "1.5px",
        flexGrow: 1,
        background: "#8B5E3C",
      }}
    />
  </div>
);

export default function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<Record<keyof EmployeeFeatures, string>>(() => {
    const initial = {} as Record<keyof EmployeeFeatures, string>;
    for (const key in DEFAULT_FEATURES) {
      initial[key as keyof EmployeeFeatures] = String(DEFAULT_FEATURES[key as keyof EmployeeFeatures]);
    }
    return initial;
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (e.target.tagName === "INPUT") {
      let cleanValue = value;
      // Strip leading zeros unless the new value is just "0" (e.g. "06" -> "6")
      if (/^0+(\d)/.test(cleanValue)) {
        cleanValue = cleanValue.replace(/^0+/, "");
      }
      setFormData((prev) => ({
        ...prev,
        [name]: cleanValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      const defaultValue = DEFAULT_FEATURES[name as keyof EmployeeFeatures];
      setFormData((prev) => ({
        ...prev,
        [name]: String(defaultValue),
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedData = {} as EmployeeFeatures;
    for (const key in DEFAULT_FEATURES) {
      const k = key as keyof EmployeeFeatures;
      const value = formData[k];
      if (value.trim() === "") {
        parsedData[k] = DEFAULT_FEATURES[k];
      } else {
        parsedData[k] = parseInt(value, 10) || 0;
      }
    }
    onSubmit(parsedData);
  };

  const dossierSheetStyle: CSSProperties = {
    background: "#FCFBF9",
    border: "1px solid #C9C0AC",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "none",
  };

  const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  };

  const labelStyle: CSSProperties = {
    fontSize: "10px",
    color: "#7f7766",
    fontFamily: "'IBM Plex Mono', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit}
      style={dossierSheetStyle}
    >
      {/* SECTION 1: Personal Info */}
      <SectionLabel text="EMPLOYEE PROFILE" />
      <motion.div variants={sectionVariants} style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px dashed #C9C0AC", paddingBottom: "6px" }}>
          <User size={14} style={{ color: "#8B5E3C" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2620", fontFamily: "'IBM Plex Serif', serif", margin: 0 }}>
            Personal Details
          </h3>
          <span style={{ fontSize: "11px", color: "#7f7766", fontFamily: "'IBM Plex Sans', sans-serif", marginLeft: "auto" }}>
            Demographics and background
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div style={fieldStyle}>
            <label style={labelStyle}>Age</label>
            <input
              type="number"
              name="Age"
              min="18"
              max="100"
              value={formData.Age}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Gender</label>
            <select name="Gender" value={formData.Gender} onChange={handleChange} className="dossier-select">
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Marital Status</label>
            <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} className="dossier-select">
              <option value="0">Single</option>
              <option value="1">Married</option>
              <option value="2">Divorced</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Education Level (1-5)</label>
            <input
              type="number"
              name="Education"
              min="1"
              max="5"
              value={formData.Education}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div className="sm:col-span-2" style={fieldStyle}>
            <label style={labelStyle}>Education Field</label>
            <select name="EducationField" value={formData.EducationField} onChange={handleChange} className="dossier-select">
              <option value="0">Human Resources</option>
              <option value="1">Life Sciences</option>
              <option value="2">Marketing</option>
              <option value="3">Medical</option>
              <option value="4">Other</option>
              <option value="5">Technical Field</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: Job Details */}
      <SectionLabel text="JOB PROFILE" />
      <motion.div variants={sectionVariants} style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px dashed #C9C0AC", paddingBottom: "6px" }}>
          <Briefcase size={14} style={{ color: "#8B5E3C" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2620", fontFamily: "'IBM Plex Serif', serif", margin: 0 }}>
            Position & Environment
          </h3>
          <span style={{ fontSize: "11px", color: "#7f7766", fontFamily: "'IBM Plex Sans', sans-serif", marginLeft: "auto" }}>
            Role, satisfaction metrics and department
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div style={fieldStyle}>
            <label style={labelStyle}>Department</label>
            <select name="Department" value={formData.Department} onChange={handleChange} className="dossier-select">
              <option value="0">Human Resources</option>
              <option value="1">Research & Development</option>
              <option value="2">Sales</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Job Role</label>
            <select name="JobRole" value={formData.JobRole} onChange={handleChange} className="dossier-select">
              <option value="0">Healthcare Representative</option>
              <option value="1">Human Resources</option>
              <option value="2">Laboratory Technician</option>
              <option value="3">Manager</option>
              <option value="4">Manufacturing Director</option>
              <option value="5">Research Director</option>
              <option value="6">Research Scientist</option>
              <option value="7">Sales Executive</option>
              <option value="8">Sales Representative</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Job Level (1-5)</label>
            <input
              type="number"
              name="JobLevel"
              min="1"
              max="5"
              value={formData.JobLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Job Involvement (1-4)</label>
            <input
              type="number"
              name="JobInvolvement"
              min="1"
              max="4"
              value={formData.JobInvolvement}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Job Satisfaction (1-4)</label>
            <input
              type="number"
              name="JobSatisfaction"
              min="1"
              max="4"
              value={formData.JobSatisfaction}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Environment Satisfaction (1-4)</label>
            <input
              type="number"
              name="EnvironmentSatisfaction"
              min="1"
              max="4"
              value={formData.EnvironmentSatisfaction}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Relationship Satisfaction (1-4)</label>
            <input
              type="number"
              name="RelationshipSatisfaction"
              min="1"
              max="4"
              value={formData.RelationshipSatisfaction}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Work Life Balance (1-4)</label>
            <input
              type="number"
              name="WorkLifeBalance"
              min="1"
              max="4"
              value={formData.WorkLifeBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div className="sm:col-span-2" style={fieldStyle}>
            <label style={labelStyle}>Performance Rating (1-4)</label>
            <input
              type="number"
              name="PerformanceRating"
              min="1"
              max="4"
              value={formData.PerformanceRating}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: Compensation */}
      <SectionLabel text="COMPENSATION" />
      <motion.div variants={sectionVariants} style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px dashed #C9C0AC", paddingBottom: "6px" }}>
          <DollarSign size={14} style={{ color: "#8B5E3C" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2620", fontFamily: "'IBM Plex Serif', serif", margin: 0 }}>
            Financials
          </h3>
          <span style={{ fontSize: "11px", color: "#7f7766", fontFamily: "'IBM Plex Sans', sans-serif", marginLeft: "auto" }}>
            Salary, hourly rates and stock options
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div style={fieldStyle}>
            <label style={labelStyle}>Monthly Income ($)</label>
            <input
              type="number"
              name="MonthlyIncome"
              min="0"
              value={formData.MonthlyIncome}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Daily Rate ($)</label>
            <input
              type="number"
              name="DailyRate"
              min="0"
              value={formData.DailyRate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Hourly Rate ($)</label>
            <input
              type="number"
              name="HourlyRate"
              min="0"
              value={formData.HourlyRate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Monthly Rate ($)</label>
            <input
              type="number"
              name="MonthlyRate"
              min="0"
              value={formData.MonthlyRate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Percent Salary Hike (%)</label>
            <input
              type="number"
              name="PercentSalaryHike"
              min="0"
              value={formData.PercentSalaryHike}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Stock Option Level</label>
            <select name="StockOptionLevel" value={formData.StockOptionLevel} onChange={handleChange} className="dossier-select">
              <option value="0">None</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* SECTION 4: Experience */}
      <SectionLabel text="EXPERIENCE" />
      <motion.div variants={sectionVariants} style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", borderBottom: "1px dashed #C9C0AC", paddingBottom: "6px" }}>
          <TrendingUp size={14} style={{ color: "#8B5E3C" }} />
          <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1F2620", fontFamily: "'IBM Plex Serif', serif", margin: 0 }}>
            History & Tenure
          </h3>
          <span style={{ fontSize: "11px", color: "#7f7766", fontFamily: "'IBM Plex Sans', sans-serif", marginLeft: "auto" }}>
            Working years, job tenure and travel profile
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div style={fieldStyle}>
            <label style={labelStyle}>Total Working Years</label>
            <input
              type="number"
              name="TotalWorkingYears"
              min="0"
              value={formData.TotalWorkingYears}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Years At Company</label>
            <input
              type="number"
              name="YearsAtCompany"
              min="0"
              value={formData.YearsAtCompany}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Years In Current Role</label>
            <input
              type="number"
              name="YearsInCurrentRole"
              min="0"
              value={formData.YearsInCurrentRole}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Years Since Last Promotion</label>
            <input
              type="number"
              name="YearsSinceLastPromotion"
              min="0"
              value={formData.YearsSinceLastPromotion}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Years With Curr Manager</label>
            <input
              type="number"
              name="YearsWithCurrManager"
              min="0"
              value={formData.YearsWithCurrManager}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Num Companies Worked</label>
            <input
              type="number"
              name="NumCompaniesWorked"
              min="0"
              value={formData.NumCompaniesWorked}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Training Times Last Year</label>
            <input
              type="number"
              name="TrainingTimesLastYear"
              min="0"
              value={formData.TrainingTimesLastYear}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Distance From Home (miles)</label>
            <input
              type="number"
              name="DistanceFromHome"
              min="0"
              value={formData.DistanceFromHome}
              onChange={handleChange}
              onBlur={handleBlur}
              className="dossier-input"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Business Travel</label>
            <select name="BusinessTravel" value={formData.BusinessTravel} onChange={handleChange} className="dossier-select">
              <option value="0">Non-Travel</option>
              <option value="1">Travel Rarely</option>
              <option value="2">Travel Frequently</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Overtime</label>
            <select name="OverTime" value={formData.OverTime} onChange={handleChange} className="dossier-select">
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={sectionVariants} style={{ marginTop: "24px" }}>
        <button
          type="submit"
          disabled={isLoading}
          className="dossier-button"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing employee dossier...</span>
            </>
          ) : (
            <>
              <Zap size={16} fill="currentColor" />
              <span>Stamp Verdict / Predict Attrition Risk</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
