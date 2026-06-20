import { useState } from "react";
import type { ChangeEvent, FormEvent, CSSProperties } from "react";
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
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", marginBottom: "12px" }}>
    <span
      style={{
        fontSize: "11px",
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#7c3aed",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
    <div
      style={{
        height: "1px",
        flexGrow: 1,
        background: "linear-gradient(90deg, rgba(139, 92, 246, 0.3), transparent)",
      }}
    />
  </div>
);

export default function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<EmployeeFeatures>(DEFAULT_FEATURES);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const cardStyle: CSSProperties = {
    background: "rgba(255, 255, 255, 0.72)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
  };

  const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelStyle: CSSProperties = {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 500,
  };

  const inputClassName =
    "bg-[rgba(255,255,255,0.8)] border border-[rgba(139,92,246,0.2)] rounded-lg py-[7px] px-[10px] text-xs w-full outline-none focus:border-[#8b5cf6] focus:ring-[3px] focus:ring-[rgba(139,92,246,0.12)] transition-all text-[#1e293b]";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "4px" }}
    >
      {/* CARD 1: Personal Info */}
      <SectionLabel text="EMPLOYEE PROFILE" />
      <motion.div variants={cardVariants} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7c3aed",
            }}
          >
            <User size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b", margin: 0 }}>Personal info</h3>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>Demographics and background</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          <div style={fieldStyle}>
            <label style={labelStyle}>Age</label>
            <input
              type="number"
              name="Age"
              min="18"
              max="100"
              value={formData.Age}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Gender</label>
            <select name="Gender" value={formData.Gender} onChange={handleChange} className={inputClassName}>
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Marital Status</label>
            <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} className={inputClassName}>
              <option value="0">Single</option>
              <option value="1">Married</option>
              <option value="2">Divorced</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Education (1-5)</label>
            <input
              type="number"
              name="Education"
              min="1"
              max="5"
              value={formData.Education}
              onChange={handleChange}
              className={inputClassName}
              required
            />
          </div>

          <div className="sm:col-span-2" style={fieldStyle}>
            <label style={labelStyle}>Education Field</label>
            <select name="EducationField" value={formData.EducationField} onChange={handleChange} className={inputClassName}>
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

      {/* CARD 2: Job Details */}
      <SectionLabel text="JOB PROFILE" />
      <motion.div variants={cardVariants} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#ffe4e6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e11d48",
            }}
          >
            <Briefcase size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b", margin: 0 }}>Job details</h3>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>Role, satisfaction and environment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          <div style={fieldStyle}>
            <label style={labelStyle}>Department</label>
            <select name="Department" value={formData.Department} onChange={handleChange} className={inputClassName}>
              <option value="0">Human Resources</option>
              <option value="1">Research & Development</option>
              <option value="2">Sales</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Job Role</label>
            <select name="JobRole" value={formData.JobRole} onChange={handleChange} className={inputClassName}>
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
              required
            />
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Compensation */}
      <SectionLabel text="COMPENSATION" />
      <motion.div variants={cardVariants} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#fef3c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d97706",
            }}
          >
            <DollarSign size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b", margin: 0 }}>Compensation</h3>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>Salary and financial details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          <div style={fieldStyle}>
            <label style={labelStyle}>Monthly Income ($)</label>
            <input
              type="number"
              name="MonthlyIncome"
              min="0"
              value={formData.MonthlyIncome}
              onChange={handleChange}
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Stock Option Level</label>
            <select name="StockOptionLevel" value={formData.StockOptionLevel} onChange={handleChange} className={inputClassName}>
              <option value="0">None</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Experience */}
      <SectionLabel text="EXPERIENCE" />
      <motion.div variants={cardVariants} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#d1fae5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0d9488",
            }}
          >
            <TrendingUp size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b", margin: 0 }}>Experience</h3>
            <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>Tenure and career history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          <div style={fieldStyle}>
            <label style={labelStyle}>Total Working Years</label>
            <input
              type="number"
              name="TotalWorkingYears"
              min="0"
              value={formData.TotalWorkingYears}
              onChange={handleChange}
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Business Travel</label>
            <select name="BusinessTravel" value={formData.BusinessTravel} onChange={handleChange} className={inputClassName}>
              <option value="0">Non-Travel</option>
              <option value="1">Travel Rarely</option>
              <option value="2">Travel Frequently</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Overtime</label>
            <select name="OverTime" value={formData.OverTime} onChange={handleChange} className={inputClassName}>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={cardVariants} style={{ marginTop: "8px" }}>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-shimmer"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "white",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
            outline: "none",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing employee data...</span>
            </>
          ) : (
            <>
              <Zap size={16} fill="white" />
              <span>Predict Attrition Risk</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
