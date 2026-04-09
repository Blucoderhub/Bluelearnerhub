'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Target
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const topics = [
  { id: 'marketing', name: 'Marketing', lessons: ['Introduction', 'Market Research', 'Brand Management', 'Digital Marketing', 'Customer Behavior'] },
  { id: 'finance', name: 'Finance', lessons: ['Introduction', 'Financial Statements', 'Time Value of Money', 'Capital Budgeting', 'Working Capital'] },
  { id: 'operations', name: 'Operations', lessons: ['Introduction', 'Process Analysis', 'Inventory Management', 'Supply Chain', 'Quality Management'] },
  { id: 'hr', name: 'Human Resources', lessons: ['Introduction', 'Recruitment', 'Performance Management', 'Training & Development', 'Compensation'] },
  { id: 'strategy', name: 'Business Strategy', lessons: ['Introduction', 'SWOT Analysis', 'Porter\'s Five Forces', 'BCG Matrix', 'Strategy Implementation'] }
]

const tutorialContent = {
  marketing: {
    Introduction: {
      title: 'Marketing Introduction',
      content: `Marketing is the process of exploring, creating, and delivering value to meet target market needs.

Key concepts include the 4 Ps: Product, Price, Place, Promotion.`,
      code: `// Marketing Mix (4 Ps)
class MarketingMix {
    // Product
    static String productName = "Smartphone Pro";
    static String[] features = {"5G", "48MP Camera", "All-day Battery"};
    static double quality = 9.0; // out of 10
    
    // Price
    static double basePrice = 999; // USD
    static double discount = 15; // %
    static double finalPrice = basePrice * (1 - discount/100);
    
    // Place (Distribution)
    static String[] channels = {
        "Online Store",
        "Retail Partners",
        "Authorized Dealers"
    };
    
    // Promotion
    static String[] tactics = {
        "Social Media Ads",
        "Influencer Marketing",
        "TV Commercials",
        "Email Campaigns"
    };
    
    public static void main(String[] args) {
        System.out.println("=== Marketing Mix ===");
        System.out.println("Product: " + productName);
        System.out.println("Price: $" + finalPrice);
        System.out.println("Channels: " + channels.length);
        System.out.println("Promotions: " + tactics.length);
    }
}`,
      tryIt: true
    },
    'Market Research': {
      title: 'Market Research',
      content: `Market research gathers information about target customers and competitors.

Methods include surveys, focus groups, interviews, and data analysis.`,
      code: `// Market Research Process
class MarketResearch {
    // Research Types
    static String[] types = {
        "Primary Research",
        "Secondary Research"
    };
    
    // Primary Methods
    static String[] primaryMethods = {
        "Surveys",
        "Focus Groups",
        "Interviews",
        "Observations"
    };
    
    // Sample Size Calculation
    static double confidenceLevel = 0.95; // 95%
    static double marginError = 0.05; // 5%
    static double proportion = 0.5; // 50%
    
    // Sample formula: n = (Z² × p × (1-p)) / e²
    static double Z = 1.96; // for 95% confidence
    static double n = (Z*Z * proportion * (1-proportion)) / (marginError * marginError);
    
    // Market Size Estimation (TAM, SAM, SOM)
    static double TAM = 1000000000; // Total Addressable Market
    static double SAM = 200000000;  // Serviceable Available Market
    static double SOM = 50000000;   // Serviceable Obtainable Market
    
    public static void main(String[] args) {
        System.out.println("=== Market Research ===");
        System.out.println("Required Sample Size: " + Math.ceil(n));
        System.out.println("\\nMarket Size:");
        System.out.println("TAM: $" + TAM/1e9 + "B");
        System.out.println("SAM: $" + SAM/1e6 + "M");
        System.out.println("SOM: $" + SOM/1e6 + "M");
    }
}`,
      tryIt: true
    },
    'Digital Marketing': {
      title: 'Digital Marketing',
      content: `Digital marketing uses online channels to reach target audiences.

Key channels: SEO, SEM, Social Media, Email, Content Marketing.`,
      code: `// Digital Marketing Channels
class DigitalMarketing {
    // SEO Metrics
    static double organicTraffic = 50000; // monthly visits
    static double conversionRate = 3.5; // %
    static double[] keywordRankings = {3, 8, 12, 15, 22};
    
    // Social Media
    static int followers = 100000;
    static double engagementRate = 4.5; // %
    static String[] platforms = {
        "Facebook", "Instagram", "LinkedIn", "Twitter"
    };
    
    // Email Marketing
    static int subscribers = 50000;
    static double openRate = 22; // %
    static double clickRate = 3.2; // %
    
    // PPC Advertising
    static double adSpend = 10000; // monthly
    static double CPC = 0.50; // Cost per click
    static double CTR = 2.5; // Click through rate
    static double conversions = 500;
    static double CPA = adSpend / conversions; // Cost per acquisition
    
    public static void main(String[] args) {
        System.out.println("=== Digital Marketing ===");
        System.out.println("Organic Traffic: " + organicTraffic);
        System.out.println("Social Followers: " + followers);
        System.out.println("Email Subscribers: " + subscribers);
        System.out.println("CPA: $" + CPA);
    }
}`,
      tryIt: true
    },
    'Customer Behavior': {
      title: 'Customer Behavior',
      content: `Understanding customer behavior helps create effective marketing strategies.

Key models: AIDA, Buyer's Journey, Customer Decision Journey.`,
      code: `// Customer Behavior Models
class CustomerBehavior {
    // AIDA Model
    static String[] awarness = {"Ads", "Social Media", "Word of Mouth"};
    static String[] interest = {"Website Visit", "Product Demo"};
    static String[] desire = {"Add to Cart", "Wishlist"};
    static String[] action = {"Purchase", "Subscribe"};
    
    // Customer Journey Stages
    static String[] journey = {
        "Awareness",
        "Consideration",
        "Decision",
        "Loyalty"
    };
    
    // Customer Lifetime Value (CLV)
    static double avgPurchaseValue = 100; // $
    static double purchaseFrequency = 5; // per year
    static double customerLifespan = 3; // years
    static double CLV = avgPurchaseValue * purchaseFrequency * customerLifespan;
    
    // Customer Acquisition Cost (CAC)
    static double marketingSpend = 50000;
    static double newCustomers = 1000;
    static double CAC = marketingSpend / newCustomers;
    
    // CLV:CAC Ratio
    static double ratio = CLV / CAC;
    
    public static void main(String[] args) {
        System.out.println("=== Customer Behavior ===");
        System.out.println("Customer Lifetime Value: $" + CLV);
        System.out.println("Customer Acquisition Cost: $" + CAC);
        System.out.println("CLV:CAC Ratio: " + ratio);
        if (ratio > 3) {
            System.out.println("Status: Healthy business model");
        }
    }
}`,
      tryIt: true
    }
  },
  finance: {
    Introduction: {
      title: 'Finance Introduction',
      content: `Finance deals with the management of money and investments.

Key areas: Corporate Finance, Investment Finance, Financial Markets.`,
      code: `// Finance Fundamentals
class Finance {
    // Financial Goals
    static String[] goals = {
        "Profit Maximization",
        "Wealth Maximization",
        "Liquidity Management",
        "Risk Management"
    };
    
    // Time Value of Money
    static double presentValue = 10000;
    static double rate = 10; // % per year
    static double time = 5; // years
    
    // Future Value: FV = PV × (1 + r)^n
    static double futureValue = presentValue * Math.pow(1 + rate/100, time);
    
    // Present Value: PV = FV / (1 + r)^n
    static double pvCalc = futureValue / Math.pow(1 + rate/100, time);
    
    // Investment Metrics
    static double ROI = (futureValue - presentValue) / presentValue * 100;
    
    public static void main(String[] args) {
        System.out.println("=== Finance Basics ===");
        System.out.println("Present Value: $" + presentValue);
        System.out.println("Future Value: $" + futureValue);
        System.out.println("ROI: " + ROI + "%");
    }
}`,
      tryIt: true
    },
    'Financial Statements': {
      title: 'Financial Statements',
      content: `Financial statements report a company's financial performance.

Three main statements: Balance Sheet, Income Statement, Cash Flow Statement.`,
      code: `// Financial Statement Analysis
class FinancialStatements {
    // Income Statement
    static double revenue = 1000000;
    static double cogs = 600000;
    static double grossProfit = revenue - cogs;
    static double operatingExpenses = 250000;
    static double operatingIncome = grossProfit - operatingExpenses;
    static double interest = 50000;
    static double tax = 45000;
    static double netIncome = operatingIncome - interest - tax;
    
    // Balance Sheet
    static double totalAssets = 2000000;
    static double totalLiabilities = 1200000;
    static double equity = totalAssets - totalLiabilities;
    
    // Key Ratios
    static double grossMargin = grossProfit / revenue * 100;
    static double netMargin = netIncome / revenue * 100;
    static double currentRatio = 2.0;
    static double debtToEquity = totalLiabilities / equity;
    
    public static void main(String[] args) {
        System.out.println("=== Financial Statements ===");
        System.out.println("Revenue: $" + revenue);
        System.out.println("Gross Profit: $" + grossProfit);
        System.out.println("Net Income: $" + netIncome);
        System.out.println("\\nRatios:");
        System.out.println("Gross Margin: " + grossMargin + "%");
        System.out.println("Net Margin: " + netMargin + "%");
        System.out.println("Current Ratio: " + currentRatio);
    }
}`,
      tryIt: true
    },
    'Time Value of Money': {
      title: 'Time Value of Money',
      content: `The time value of money states that money available now is worth more than the same amount in the future.

Key formulas: FV, PV, Annuities, NPV, IRR.`,
      code: `// Time Value of Money Calculations
class TVM {
    // Future Value
    static double PV = 10000;
    static double r = 8; // annual rate %
    static double n = 10; // years
    static double FV = PV * Math.pow(1 + r/100, n);
    
    // Present Value
    static double FV_target = 20000;
    static double PV_calc = FV_target / Math.pow(1 + r/100, n);
    
    // Annuity - Future Value
    static double PMT = 1000; // annual payment
    static double annuityFV = PMT * ((Math.pow(1 + r/100, n) - 1) / (r/100));
    
    // Net Present Value
    static double[] cashFlows = {-100000, 30000, 40000, 50000, 60000};
    static double npv = 0;
    for (int i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + r/100, i);
    }
    
    // IRR (approximation)
    static double irr = 15.2; // %
    
    public static void main(String[] args) {
        System.out.println("=== Time Value of Money ===");
        System.out.println("Future Value: $" + FV);
        System.out.println("Present Value: $" + Math.round(PV_calc));
        System.out.println("Annuity FV: $" + Math.round(annuityFV));
        System.out.println("NPV: $" + Math.round(npv));
        System.out.println("IRR: " + irr + "%");
    }
}`,
      tryIt: true
    },
    'Capital Budgeting': {
      title: 'Capital Budgeting',
      content: `Capital budgeting evaluates long-term investment projects.

Methods: NPV, IRR, Payback Period, Profitability Index.`,
      code: `// Capital Budgeting Methods
class CapitalBudgeting {
    // Project Data
    static double initialInvestment = 500000;
    static double[] annualCashFlows = {150000, 180000, 200000, 150000, 100000};
    static double requiredReturn = 12; // %
    
    // Payback Period
    static double payback = 0;
    static double cumCash = 0;
    for (int i = 0; i < annualCashFlows.length; i++) {
        cumCash += annualCashFlows[i];
        if (cumCash >= initialInvestment) {
            payback = i + (initialInvestment - (cumCash - annualCashFlows[i])) / annualCashFlows[i];
            break;
        }
    }
    
    // NPV
    static double npv = -initialInvestment;
    for (int i = 0; i < annualCashFlows.length; i++) {
        npv += annualCashFlows[i] / Math.pow(1 + requiredReturn/100, i + 1);
    }
    
    // Profitability Index
    static double pi = (npv + initialInvestment) / initialInvestment;
    
    // Accept if NPV > 0, PI > 1
    static boolean accept = npv > 0;
    
    public static void main(String[] args) {
        System.out.println("=== Capital Budgeting ===");
        System.out.println("Initial Investment: $" + initialInvestment);
        System.out.println("Payback Period: " + payback + " years");
        System.out.println("NPV: $" + npv);
        System.out.println("Profitability Index: " + pi);
        System.out.println("Accept Project: " + accept);
    }
}`,
      tryIt: true
    }
  },
  operations: {
    Introduction: {
      title: 'Operations Management Introduction',
      content: `Operations management oversees the production of goods and services.

Key areas: process design, inventory control, quality management.`,
      code: `// Operations Management
class Operations {
    // Operations Strategy
    static String[] strategies = {
        "Cost Leadership",
        "Differentiation",
        "Focus Strategy"
    };
    
    // Production Metrics
    static double productionRate = 1000; // units/day
    static double defectRate = 2.5; // %
    static double efficiency = 85; // %
    
    // Cycle Time
    static double taktTime = 480; // minutes (8 hour shift)
    static int demand = 800; // units/day
    static double cycleTime = taktTime / demand;
    
    // Capacity
    static double designCapacity = 1200;
    static double effectiveCapacity = 1000;
    static double utilization = effectiveCapacity / designCapacity * 100;
    
    public static void main(String[] args) {
        System.out.println("=== Operations ===");
        System.out.println("Production Rate: " + productionRate);
        System.out.println("Defect Rate: " + defectRate + "%");
        System.out.println("Cycle Time: " + cycleTime + " min/unit");
        System.out.println("Utilization: " + utilization + "%");
    }
}`,
      tryIt: true
    },
    'Process Analysis': {
      title: 'Process Analysis',
      content: `Process analysis identifies bottlenecks and improves efficiency.

Tools: Flow Charts, Process Mapping, Cycle Time Analysis.`,
      code: `// Process Analysis
class ProcessAnalysis {
    // Process Steps
    static String[] steps = {"Receive", "Process", "Pack", "Ship"};
    static double[] times = {2, 5, 1, 3}; // minutes
    
    // Bottleneck (longest time)
    static double bottleneckTime = times[2]; // max value
    
    // Process Capacity
    static double capacity = 60 / bottleneckTime; // units/hour
    
    // Efficiency
    static double idealTime = 8; // sum of all times
    static double actualTime = bottleneckTime * steps.length;
    static double efficiency = idealTime / actualTime * 100;
    
    // Throughput Time
    static double throughputTime = 0;
    for (double t : times) throughputTime += t;
    
    public static void main(String[] args) {
        System.out.println("=== Process Analysis ===");
        System.out.println("Bottleneck: Step " + (2+1) + " (" + bottleneckTime + " min)");
        System.out.println("Capacity: " + capacity + " units/hour");
        System.out.println("Efficiency: " + efficiency + "%");
        System.out.println("Throughput Time: " + throughputTime + " min");
    }
}`,
      tryIt: true
    },
    'Inventory Management': {
      title: 'Inventory Management',
      content: `Inventory management balances holding costs and stockouts.

Key models: EOQ, ABC Analysis, JIT.`,
      code: `// Inventory Management
class InventoryManagement {
    // EOQ Model
    static double D = 10000; // annual demand
    static double S = 50; // ordering cost
    static double H = 2; // holding cost per unit
    
    // Economic Order Quantity
    static double EOQ = Math.sqrt(2 * D * S / H);
    
    // Reorder Point
    static double leadTime = 5; // days
    static double dailyDemand = D / 365;
    static double ROP = dailyDemand * leadTime;
    
    // Safety Stock
    static double stdDevDemand = 10; // units/day
    static double serviceLevel = 95; // %
    static double z = 1.65; // for 95%
    static double safetyStock = z * stdDevDemand * Math.sqrt(leadTime);
    
    // ABC Analysis
    static int totalSKUs = 1000;
    static int aItems = 50; // 20% items, 80% value
    static int bItems = 150; // 30% items, 15% value
    static int cItems = 800; // 50% items, 5% value
    
    public static void main(String[] args) {
        System.out.println("=== Inventory Management ===");
        System.out.println("EOQ: " + Math.round(EOQ) + " units");
        System.out.println("Reorder Point: " + Math.round(ROP) + " units");
        System.out.println("Safety Stock: " + Math.round(safetyStock) + " units");
    }
}`,
      tryIt: true
    },
    'Quality Management': {
      title: 'Quality Management',
      content: `Quality management ensures products meet customer requirements.

Tools: Six Sigma, TQM, Control Charts, Kaizen.`,
      code: `// Quality Management
class QualityManagement {
    // Six Sigma Metrics
    static double DPMO = 500; // Defects per million opportunities
    static double sigma = 4.5; // sigma level
    
    // Process Capability
    static double USL = 10.0; // Upper specification limit
    static double LSL = 8.0;  // Lower specification limit
    static double mean = 9.0;
    static double stdDev = 0.5;
    
    static double Cp = (USL - LSL) / (6 * stdDev);
    static double Cpk = Math.min((USL - mean), (mean - LSL)) / (3 * stdDev);
    
    // Control Chart
    static double[] sampleMeans = {10.1, 9.8, 10.2, 9.9, 10.0};
    static double xDoubleBar = 10.0; // average
    static double A2 = 0.577; // for n=5
    static double R = 0.5; // range
    static double UCL = xDoubleBar + A2 * R;
    static double LCL = xDoubleBar - A2 * R;
    
    // Cost of Quality
    static double preventionCost = 50000;
    static double appraisalCost = 30000;
    static double internalFailure = 20000;
    static double externalFailure = 40000;
    static double totalCOQ = preventionCost + appraisalCost + internalFailure + externalFailure;
    
    public static void main(String[] args) {
        System.out.println("=== Quality Management ===");
        System.out.println("Process Capability (Cp): " + Cp);
        System.out.println("Process Capability (Cpk): " + Cpk);
        System.out.println("Control Limits: " + UCL + ", " + LCL);
        System.out.println("Cost of Quality: $" + totalCOQ);
    }
}`,
      tryIt: true
    }
  },
  hr: {
    Introduction: {
      title: 'Human Resources Introduction',
      content: `HR manages employee recruitment, development, and retention.

Key functions: Recruitment, Training, Compensation, Performance Management.`,
      code: `// HR Functions
class HR {
    // Core Functions
    static String[] functions = {
        "Recruitment & Selection",
        "Training & Development",
        "Performance Management",
        "Compensation & Benefits",
        "Employee Relations",
        "Compliance"
    };
    
    // Workforce Metrics
    static int totalEmployees = 500;
    static int newHires = 50;
    static int departures = 30;
    static double turnoverRate = (double)departures / totalEmployees * 100;
    
    // Time to Fill
    static double avgDaysToFill = 45;
    
    // Cost per Hire
    static double recruitingCost = 100000;
    static double costPerHire = recruitingCost / newHires;
    
    public static void main(String[] args) {
        System.out.println("=== Human Resources ===");
        System.out.println("Total Employees: " + totalEmployees);
        System.out.println("Turnover Rate: " + turnoverRate + "%");
        System.out.println("Cost per Hire: $" + costPerHire);
        System.out.println("Time to Fill: " + avgDaysToFill + " days");
    }
}`,
      tryIt: true
    },
    Recruitment: {
      title: 'Recruitment',
      content: `Recruitment attracts and selects qualified candidates.

Process: Job Analysis → Sourcing → Screening → Interview → Selection.`,
      code: `// Recruitment Process
class Recruitment {
    // Job Description Elements
    static String[] jdElements = {
        "Job Title",
        "Job Summary",
        "Duties & Responsibilities",
        "Qualifications",
        "Skills Required",
        "Reporting Structure"
    };
    
    // Sourcing Channels
    static String[] channels = {
        "Job Boards",
        "LinkedIn",
        "Employee Referrals",
        "Campus Recruitment",
        "Headhunters"
    };
    
    // Interview Process
    static int[] stages = {1, 2, 3}; // rounds
    static String[] interviewTypes = {
        "Phone Screen",
        "Technical Interview",
        "Managerial Interview"
    };
    
    // Selection Metrics
    static int applicants = 200;
    static int screened = 50;
    static int interviewed = 20;
    static int offered = 5;
    static double yieldRate = (double)offered / applicants * 100;
    
    public static void main(String[] args) {
        System.out.println("=== Recruitment ===");
        System.out.println("Applicants: " + applicants);
        System.out.println("Screened: " + screened);
        System.out.println("Interviewed: " + interviewed);
        System.out.println("Offered: " + offered);
        System.out.println("Yield Rate: " + yieldRate + "%");
    }
}`,
      tryIt: true
    },
    'Performance Management': {
      title: 'Performance Management',
      content: `Performance management evaluates and improves employee performance.

Components: Goal Setting, Continuous Feedback, Performance Appraisal.`,
      code: `// Performance Management
class PerformanceManagement {
    // Performance Appraisal Methods
    static String[] methods = {
        "Management by Objectives (MBO)",
        "360-Degree Feedback",
        "Behaviorally Anchored Rating Scales (BARS)",
        "Graphic Rating Scales"
    };
    
    // Rating Scale
    static String[] ratings = {"1", "2", "3", "4", "5"};
    static double[] distribution = {10, 20, 40, 20, 10}; // %
    
    // Performance Score
    static double[] scores = {85, 72, 91, 68, 79};
    static double avgScore = 79;
    
    // Competency Framework
    static String[] competencies = {
        "Technical Skills",
        "Communication",
        "Leadership",
        "Problem Solving",
        "Teamwork"
    };
    
    // Performance Distribution
    static int outstanding = 10;
    static int meetsExpectations = 70;
    static int needsImprovement = 15;
    static int unsatisfactory = 5;
    
    public static void main(String[] args) {
        System.out.println("=== Performance Management ===");
        System.out.println("Average Score: " + avgScore);
        System.out.println("\\nDistribution:");
        System.out.println("Outstanding: " + outstanding + "%");
        System.out.println("Meets Expectations: " + meetsExpectations + "%");
        System.out.println("Needs Improvement: " + needsImprovement + "%");
    }
}`,
      tryIt: true
    }
  },
  strategy: {
    Introduction: {
      title: 'Business Strategy Introduction',
      content: `Business strategy defines how organizations achieve their goals.

Frameworks: SWOT, Porter's Five Forces, BCG Matrix.`,
      code: `// Strategic Frameworks
class BusinessStrategy {
    // Strategy Types
    static String[] genericStrategies = {
        "Cost Leadership",
        "Differentiation",
        "Focus (Cost)",
        "Focus (Differentiation)"
    };
    
    // Strategic Levels
    static String[] levels = {
        "Corporate Strategy",
        "Business Unit Strategy",
        "Functional Strategy",
        "Operational Strategy"
    };
    
    // Competitive Advantage
    static boolean sustainableAdvantage = true;
    static String[] sources = {
        "Economies of Scale",
        "Brand Loyalty",
        "Switching Costs",
        "Network Effects",
        "Proprietary Technology"
    };
    
    public static void main(String[] args) {
        System.out.println("=== Business Strategy ===");
        System.out.println("Generic Strategies: " + genericStrategies.length);
        System.out.println("Strategy Levels: " + levels.length);
        System.out.println("Advantage Sources: " + sources.length);
    }
}`,
      tryIt: true
    },
    'SWOT Analysis': {
      title: 'SWOT Analysis',
      content: `SWOT evaluates internal Strengths/Weaknesses and external Opportunities/Threats.`,
      code: `// SWOT Analysis
class SWOT {
    // Internal Factors
    static String[] strengths = {
        "Strong Brand Recognition",
        "Extensive Distribution Network",
        "R&D Capabilities",
        "Experienced Management Team"
    };
    
    static String[] weaknesses = {
        "Limited Online Presence",
        "High Production Costs",
        "Small Market Share in Asia",
        "Aging IT Infrastructure"
    };
    
    // External Factors
    static String[] opportunities = {
        "Growing E-commerce Market",
        "Emerging Markets Expansion",
        "New Technology Adoption",
        "Strategic Partnerships"
    };
    
    static String[] threats = {
        "Intense Competition",
        "Economic Downturn",
        "Regulatory Changes",
        "Supply Chain Disruptions"
    };
    
    // Strategy Formulation
    static String[][] strategies = {
        {"SO", "Use R&D for new products in emerging markets"},
        {"WO", "Invest in IT to improve online presence"},
        {"ST", "Leverage brand for competitive pricing"},
        {"WT", "Reduce costs through automation"}
    };
    
    public static void main(String[] args) {
        System.out.println("=== SWOT Analysis ===");
        System.out.println("Strengths: " + strengths.length);
        System.out.println("Weaknesses: " + weaknesses.length);
        System.out.println("Opportunities: " + opportunities.length);
        System.out.println("Threats: " + threats.length);
    }
}`,
      tryIt: true
    },
    "Porter's Five Forces": {
      title: "Porter's Five Forces",
      content: `Porter's Five Forces analyze industry competition and profitability.

Forces: Threat of New Entrants, Bargaining Power of Suppliers/Buyers, Threat of Substitutes, Rivalry.`,
      code: `// Porter's Five Forces
class PortersFiveForces {
    // 1. Threat of New Entrants
    static String entryBarriers = "High";
    static String[] barriers = {
        "High Capital Requirements",
        "Economies of Scale",
        "Brand Loyalty",
        "Regulatory Requirements"
    };
    
    // 2. Bargaining Power of Suppliers
    static String supplierPower = "Moderate";
    static int numSuppliers = 50;
    static boolean switchingCost = true;
    
    // 3. Bargaining Power of Buyers
    static String buyerPower = "High";
    static int numBuyers = 1000;
    static boolean priceSensitivity = true;
    
    // 4. Threat of Substitutes
    static String substituteThreat = "Moderate";
    static int numSubstitutes = 5;
    
    // 5. Competitive Rivalry
    static String rivalry = "High";
    static int numCompetitors = 10;
    static boolean industryGrowth = false;
    
    // Industry Attractiveness
    static String attractiveness = "Moderate";
    
    public static void main(String[] args) {
        System.out.println("=== Porter's Five Forces ===");
        System.out.println("New Entrants: " + entryBarriers);
        System.out.println("Supplier Power: " + supplierPower);
        System.out.println("Buyer Power: " + buyerPower);
        System.out.println("Substitutes: " + substituteThreat);
        System.out.println("Rivalry: " + rivalry);
    }
}`,
      tryIt: true
    },
    'BCG Matrix': {
      title: 'BCG Matrix',
      content: `BCG Matrix categorizes business units by market growth and share.

Categories: Stars, Cash Cows, Question Marks, Dogs.`,
      code: `// BCG Matrix Analysis
class BCGMatrix {
    // Business Units
    static class BusinessUnit {
        String name;
        double marketShare;
        double marketGrowth;
        String category;
        
        BusinessUnit(String n, double ms, double mg) {
            this.name = n;
            this.marketShare = ms;
            this.marketGrowth = mg;
            this.category = categorize(ms, mg);
        }
        
        String categorize(double ms, double mg) {
            if (ms > 0.4 && mg > 0.10) return "Star";
            if (ms > 0.4 && mg < 0.10) return "Cash Cow";
            if (ms < 0.4 && mg > 0.10) return "Question Mark";
            return "Dog";
        }
    }
    
    static BusinessUnit unit1 = new BusinessUnit("Product A", 0.5, 0.15);
    static BusinessUnit unit2 = new BusinessUnit("Product B", 0.6, 0.05);
    static BusinessUnit unit3 = new BusinessUnit("Product C", 0.2, 0.20);
    static BusinessUnit unit4 = new BusinessUnit("Product D", 0.1, 0.03);
    
    // Strategy Recommendations
    static String[] starStrategy = {"Invest heavily", "Expand capacity"};
    static String[] cowStrategy = {"Maintain position", "Harvest profits"};
    static String[] questionStrategy = {"Invest or divest", "Analyze potential"};
    static String[] dogStrategy = {"Divest", "Liquidate assets"};
    
    public static void main(String[] args) {
        System.out.println("=== BCG Matrix ===");
        System.out.println(unit1.name + ": " + unit1.category);
        System.out.println(unit2.name + ": " + unit2.category);
        System.out.println(unit3.name + ": " + unit3.category);
        System.out.println(unit4.name + ": " + unit4.category);
    }
}`,
      tryIt: true
    }
  }
}

const sidebarTopics = [
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'operations', name: 'Operations', icon: Target },
  { id: 'hr', name: 'Human Resources', icon: Users },
  { id: 'strategy', name: 'Business Strategy', icon: Briefcase }
]

export default function ManagementPage() {
  const [selectedTopic, setSelectedTopic] = useState('marketing')
  const [selectedLesson, setSelectedLesson] = useState('Introduction')
  const [copied, setCopied] = useState(false)

  const currentContent = tutorialContent[selectedTopic as keyof typeof tutorialContent]
  const lessonData = currentContent?.[selectedLesson as keyof typeof currentContent]

  const copyCode = () => {
    if (lessonData?.code) {
      navigator.clipboard.writeText(lessonData.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex pt-16">
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background overflow-y-auto">
          <div className="p-4">
            <Link href="/library" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Link>
            
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Topics</h2>
            
            <nav className="space-y-1">
              {sidebarTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic.id)
                    const firstLesson = topics.find(t => t.id === topic.id)?.lessons[0]
                    if (firstLesson) setSelectedLesson(firstLesson)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-left ${
                    selectedTopic === topic.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <topic.icon className="h-4 w-4" />
                  {topic.name}
                </button>
              ))}
            </nav>

            <div className="mt-6">
              <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {sidebarTopics.find(t => t.id === selectedTopic)?.name} Lessons
              </h3>
              <div className="space-y-0.5">
                {topics.find(t => t.id === selectedTopic)?.lessons.map((lesson) => (
                  <button
                    key={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedLesson === lesson
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {lesson}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="ml-64 min-h-[calc(100vh-4rem)] flex-1 p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Management</h1>
                  <p className="text-sm text-muted-foreground">{tutorialContent[selectedTopic as keyof typeof tutorialContent] ? Object.keys(tutorialContent[selectedTopic as keyof typeof tutorialContent]).length : 0} tutorials in {selectedTopic}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Free
                </Badge>
                <Badge variant="outline">
                  <BookOpen className="h-3 w-3 mr-1" />
                  No Login
                </Badge>
              </div>
            </div>

            {lessonData ? (
              <motion.div
                key={`${selectedTopic}-${selectedLesson}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-8">
                    <h2 className="mb-4 text-2xl font-bold">{lessonData.title}</h2>
                    
                    <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
                      <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {lessonData.content}
                      </div>
                    </div>

                    <div className="relative rounded-xl bg-[#1e1e1e] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
                        <span className="text-sm font-medium text-muted-foreground">Example</span>
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-foreground">
                          {lessonData.code}
                        </code>
                      </pre>
                    </div>

                    {lessonData.tryIt && (
                      <div className="mt-6 flex items-center justify-between">
                        <Button className="gap-2">
                          <Play className="h-4 w-4" />
                          Try it Yourself
                        </Button>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Free to use
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-6 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => {
                      const currentLessons = topics.find(t => t.id === selectedTopic)?.lessons || []
                      const currentIndex = currentLessons.indexOf(selectedLesson)
                      if (currentIndex > 0) {
                        setSelectedLesson(currentLessons[currentIndex - 1])
                      }
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      const currentLessons = topics.find(t => t.id === selectedTopic)?.lessons || []
                      const currentIndex = currentLessons.indexOf(selectedLesson)
                      if (currentIndex < currentLessons.length - 1) {
                        setSelectedLesson(currentLessons[currentIndex + 1])
                      }
                    }}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Select a topic to start learning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
