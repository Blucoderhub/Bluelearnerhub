'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  HardHat,
  Trees,
  Droplets,
  Hammer
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const topics = [
  { id: 'structural-analysis', name: 'Structural Analysis', lessons: ['Introduction', 'Statics', 'Trusses', 'Beams', 'Columns'] },
  { id: 'geotechnical', name: 'Geotechnical', lessons: ['Introduction', 'Soil Properties', 'Bearing Capacity', 'Foundation Types', 'Slope Stability'] },
  { id: 'hydraulics', name: 'Hydraulics', lessons: ['Introduction', 'Fluid Properties', 'Pipe Flow', 'Open Channel', 'Hydrology'] },
  { id: 'construction', name: 'Construction Management', lessons: ['Introduction', 'Planning', 'Scheduling', 'Cost Estimation', 'Quality Control'] },
  { id: 'environmental', name: 'Environmental', lessons: ['Introduction', 'Water Quality', 'Air Pollution', 'Waste Management', 'Sustainability'] }
]

const tutorialContent = {
  'structural-analysis': {
    Introduction: {
      title: 'Structural Analysis Introduction',
      content: `Structural analysis determines the behavior of structures under loads.

Key concepts include forces, moments, equilibrium, and deformation.`,
      code: `// Structural Analysis Basics
class StructuralAnalysis {
    // Basic Forces
    static double axialForce = 10000;  // N
    static double shearForce = 5000;    // N
    static double bendingMoment = 100000; // N.mm
    
    // Stress Calculations
    static double area = 1000;         // mm²
    static double stress = axialForce / area; // MPa
    
    // Strain
    static double length = 1000;       // mm
    static double deltaL = 1;          // mm
    static double strain = deltaL / length;
    
    // Modulus of Elasticity (Steel)
    static double E = 200000; // MPa
    
    // Stress-Strain Relationship
    static double stress_calc = E * strain;
    
    public static void main(String[] args) {
        System.out.println("=== Structural Analysis ===");
        System.out.println("Axial Stress: " + stress + " MPa");
        System.out.println("Strain: " + strain);
        System.out.println("Stress from Strain: " + stress_calc + " MPa");
    }
}`,
      tryIt: true
    },
    Statics: {
      title: 'Statics',
      content: `Statics deals with bodies at rest or in equilibrium.

Key equations: Sum of forces = 0, Sum of moments = 0`,
      code: `// Equilibrium Analysis
class Statics {
    // 2D Static Equilibrium
    // ΣFx = 0, ΣFy = 0, ΣM = 0
    
    // Example: Simply Supported Beam
    static double W = 10000;  // Total load (N)
    static double L = 4000;   // Span (mm)
    
    // Reactions for symmetric loading
    static double R1 = W / 2;  // 5000 N
    static double R2 = W / 2;  // 5000 N
    
    // Example: Cantilever Beam
    static double P = 2000;   // Point load (N)
    static double a = 1000;   // Distance from support (mm)
    static double Lc = 2000;  // Total length
    
    static double Rc = P;           // Reaction at support
    static double Mc = P * a;       // Moment at support
    
    public static void main(String[] args) {
        System.out.println("=== Simply Supported ===");
        System.out.println("R1: " + R1 + " N");
        System.out.println("R2: " + R2 + " N");
        
        System.out.println("\\n=== Cantilever ===");
        System.out.println("Reaction: " + Rc + " N");
        System.out.println("Moment: " + (Mc/1000) + " kN.m");
    }
}`,
      tryIt: true
    },
    Trusses: {
      title: 'Trusses',
      content: `Trusses are structural frameworks made of members connected at joints.

Analysis methods: Method of Joints, Method of Sections.`,
      code: `// Truss Analysis - Method of Joints
class Truss {
    // Example: Simple Truss
    static double F = 10000;  // Load (N)
    
    // Support reactions
    static double Ay = F;     // Vertical reaction at A
    static double By = F;      // Vertical reaction at B
    
    // Joint A
    static double AB;  // Member force
    static double AC;  // Member force
    
    // Using trigonometry
    static double theta = Math.atan(1.0); // 45 degrees
    static double cosTheta = Math.cos(theta);
    static double sinTheta = Math.sin(theta);
    
    // At joint A: ΣFy = 0
    // AC * sin(θ) = Ay
    static double AC_force = Ay / sinTheta;
    
    // At joint A: ΣFx = 0
    // AB = AC * cos(θ)
    static double AB_force = AC_force * cosTheta;
    
    public static void main(String[] args) {
        System.out.println("=== Method of Joints ===");
        System.out.println("Member AC: " + AC_force + " N (Tension)");
        System.out.println("Member AB: " + AB_force + " N (Compression)");
    }
}`,
      tryIt: true
    },
    Beams: {
      title: 'Beams',
      content: `Beams are horizontal structural members that carry loads perpendicular to their axis.

Types: Simply supported, Cantilever, Continuous.`,
      code: `// Beam Analysis
class Beam {
    // Simply Supported Beam with UDL
    static double w = 5;     // UDL (kN/m)
    static double L = 6;     // Span (m)
    
    // Reactions
    static double R1 = w * L / 2;
    static double R2 = w * L / 2;
    
    // Shear Force Diagram (SFD)
    static double V_max = w * L / 2;
    
    // Bending Moment Diagram (BMD)
    static double M_max = w * L * L / 8;
    
    // At x distance from left support
    static double shearForce(double x) {
        return R1 - w * x;
    }
    
    static double bendingMoment(double x) {
        return R1 * x - w * x * x / 2;
    }
    
    public static void main(String[] args) {
        System.out.println("=== Simply Supported Beam ===");
        System.out.println("UDL: " + w + " kN/m");
        System.out.println("Span: " + L + " m");
        System.out.println("Max Shear: " + V_max + " kN");
        System.out.println("Max Moment: " + M_max + " kN.m");
        
        System.out.println("\\nAt midspan (x=3m):");
        System.out.println("Shear: " + shearForce(3) + " kN");
        System.out.println("Moment: " + bendingMoment(3) + " kN.m");
    }
}`,
      tryIt: true
    }
  },
  geotechnical: {
    Introduction: {
      title: 'Geotechnical Engineering Introduction',
      content: `Geotechnical engineering deals with soil and rock behavior.

Key areas: soil mechanics, foundation engineering, slope stability.`,
      code: `// Soil Classification
class Soil {
    // Soil Types
    static String[] types = {
        "Gravel", "Sand", "Silt", "Clay"
    };
    
    // Soil Properties
    static double specificGravity = 2.65;
    static double unitWeight = 18; // kN/m³
    static double waterContent = 15; // %
    
    // Void Ratio and Porosity
    static double e = 0.6;    // Void ratio
    static double n = e / (1 + e) * 100; // Porosity %
    
    // Relative Density (for sands)
    static double e_max = 0.85;
    static double e_min = 0.45;
    static double e_field = 0.55;
    static double Dr = (e_max - e_field) / (e_max - e_min) * 100;
    
    public static void main(String[] args) {
        System.out.println("=== Geotechnical Basics ===");
        System.out.println("Unit Weight: " + unitWeight + " kN/m³");
        System.out.println("Void Ratio: " + e);
        System.out.println("Porosity: " + n + "%");
        System.out.println("Relative Density: " + Dr + "%");
    }
}`,
      tryIt: true
    },
    'Soil Properties': {
      title: 'Soil Properties',
      content: `Key soil properties: index properties, strength parameters, compressibility.`,
      code: `// Soil Property Calculations
class SoilProperties {
    // Atterberg Limits
    static double LL = 40;  // Liquid Limit (%)
    static double PL = 20;  // Plastic Limit (%)
    static double PI = LL - PL;  // Plasticity Index
    
    // Consistency Index
    static double w = 25;  // Natural water content (%)
    static double CI = (LL - w) / PI * 100;
    
    // Shear Strength (Mohr-Coulomb)
    static double c = 5;   // Cohesion (kPa)
    static double phi = 30; // Friction angle (degrees)
    static double sigma = 100; // Normal stress (kPa)
    
    static double tau = c + sigma * Math.tan(Math.toRadians(phi));
    
    // Compressibility
    static double Cc = 0.2; // Compression index
    
    public static void main(String[] args) {
        System.out.println("=== Atterberg Limits ===");
        System.out.println("Liquid Limit: " + LL + "%");
        System.out.println("Plastic Limit: " + PL + "%");
        System.out.println("Plasticity Index: " + PI + "%");
        System.out.println("Consistency Index: " + CI);
        
        System.out.println("\\n=== Shear Strength ===");
        System.out.println("Cohesion: " + c + " kPa");
        System.out.println("Friction Angle: " + phi + "°");
        System.out.println("Shear Strength: " + tau + " kPa");
    }
}`,
      tryIt: true
    },
    'Bearing Capacity': {
      title: 'Bearing Capacity',
      content: `Bearing capacity is the maximum pressure soil can support.

Terzaghi's equation: qu = cNc + qNq + 0.5γBNγ`,
      code: `// Bearing Capacity Calculation
class BearingCapacity {
    // Terzaghi's Equation
    // qu = cNc + qNq + 0.5γBNγ
    
    static double c = 50;      // Cohesion (kPa)
    static double gamma = 18;  // Unit weight (kN/m³)
    static double D = 1.5;      // Foundation depth (m)
    static double B = 2.0;      // Foundation width (m)
    static double q = gamma * D; // Overburden pressure
    
    // Bearing Capacity Factors (φ = 30°)
    static double Nc = 30.14;
    static double Nq = 18.40;
    static double Ngamma = 15.67;
    
    // Ultimate bearing capacity
    static double qu = c * Nc + q * Nq + 0.5 * gamma * B * Ngamma;
    
    // Allowable bearing capacity (FoS = 3)
    static double FoS = 3;
    static double qa = qu / FoS;
    
    public static void main(String[] args) {
        System.out.println("=== Bearing Capacity ===");
        System.out.println("Ultimate: " + qu + " kPa");
        System.out.println("Allowable: " + qa + " kPa");
    }
}`,
      tryIt: true
    },
    'Foundation Types': {
      title: 'Foundation Types',
      content: `Foundations transfer structural loads to soil.

Types: Shallow (strip, pad, raft) and Deep (piles, wells).`,
      code: `// Foundation Design
class Foundation {
    // Load from structure
    static double P = 1000;  // kN
    static double Mx = 100;  // kN.m (moment x)
    static double My = 50;   // kN.m
    
    // Pad Foundation
    static double B = 2.0;   // Width (m)
    static double L = 2.0;   // Length (m)
    static double Area = B * L;
    static double q = P / Area; // Contact pressure
    
    // Check eccentricity
    static double ex = Mx / P;
    static double ey = My / P;
    
    // Pile Foundation
    static int Npiles = 4;
    static double pileCap = P / Npiles;
    
    public static void main(String[] args) {
        System.out.println("=== Foundation Design ===");
        System.out.println("Load: " + P + " kN");
        System.out.println("\\nPad Foundation:");
        System.out.println("Area: " + Area + " m²");
        System.out.println("Contact Pressure: " + q + " kPa");
        
        System.out.println("\\nPile Foundation:");
        System.out.println("Number of Piles: " + Npiles);
        System.out.println("Load per Pile: " + pileCap + " kN");
    }
}`,
      tryIt: true
    }
  },
  hydraulics: {
    Introduction: {
      title: 'Hydraulics Introduction',
      content: `Hydraulics deals with the behavior of water in civil engineering systems.

Key areas: pipe flow, open channel flow, hydrology.`,
      code: `// Hydraulics Fundamentals
class Hydraulics {
    // Fluid Properties
    static double rho = 1000;   // Density (kg/m³)
    static double mu = 0.001;   // Dynamic viscosity (Pa.s)
    static double nu = mu / rho; // Kinematic viscosity (m²/s)
    
    // Hydrostatic Pressure
    static double h = 10;        // Depth (m)
    static double g = 9.81;     // Gravity (m/s²)
    static double p = rho * g * h;
    
    // Buoyancy
    static double V_displaced = 1.0; // m³
    static double Fb = rho * g * V_displaced;
    
    public static void main(String[] args) {
        System.out.println("=== Hydraulics Basics ===");
        System.out.println("Hydrostatic Pressure: " + (p/1000) + " kPa");
        System.out.println("Buoyant Force: " + Fb + " N");
    }
}`,
      tryIt: true
    },
    'Pipe Flow': {
      title: 'Pipe Flow',
      content: `Pipe flow analysis uses Darcy-Weisbach and Hazen-Williams equations.`,
      code: `// Pipe Flow Calculations
class PipeFlow {
    // Darcy-Weisbach Equation
    static double Q = 0.05;    // Discharge (m³/s)
    static double D = 0.3;     // Diameter (m)
    static double L = 1000;   // Length (m)
    static double f = 0.02;   // Friction factor
    
    // Velocity
    static double A = Math.PI * D * D / 4;
    static double V = Q / A;
    
    // Head Loss (Darcy-Weisbach)
    static double hf = f * (L/D) * (V*V)/(2*g);
    
    // Reynolds Number
    static double Re = V * D / nu;
    
    public static void main(String[] args) {
        double nu = 1.0e-6; // kinematic viscosity
        System.out.println("=== Pipe Flow ===");
        System.out.println("Velocity: " + V + " m/s");
        System.out.println("Head Loss: " + hf + " m");
        System.out.println("Reynolds Number: " + Re);
    }
}`,
      tryIt: true
    },
    'Open Channel': {
      title: 'Open Channel Flow',
      content: `Open channel flow is governed by Manning's equation.

Q = (1/n) × A × R^(2/3) × S^(1/2)`,
      code: `// Manning's Equation
class OpenChannel {
    // Given: Rectangular Channel
    static double b = 3.0;    // Width (m)
    static double y = 1.5;    // Depth (m)
    static double n = 0.013;  // Manning's n
    static double S = 0.001;  // Slope
    
    // Flow Area
    static double A = b * y;
    
    // Wetted Perimeter
    static double P = b + 2 * y;
    
    // Hydraulic Radius
    static double R = A / P;
    
    // Discharge (Manning's)
    static double Q = (1.0/n) * A * Math.pow(R, 2.0/3.0) * Math.sqrt(S);
    
    public static void main(String[] args) {
        System.out.println("=== Open Channel Flow ===");
        System.out.println("Flow Area: " + A + " m²");
        System.out.println("Hydraulic Radius: " + R + " m");
        System.out.println("Discharge: " + Q + " m³/s");
    }
}`,
      tryIt: true
    }
  },
  construction: {
    Introduction: {
      title: 'Construction Management Introduction',
      content: `Construction management oversees planning, scheduling, and execution of projects.

Key areas: project planning, cost control, quality management.`,
      code: `// Project Life Cycle
class ConstructionProject {
    static String[] phases = {
        "Initiation",
        "Planning",
        "Execution",
        "Monitoring & Control",
        "Closure"
    };
    
    // Project Stakeholders
    static String[] stakeholders = {
        "Owner",
        "Contractor",
        "Architect/Engineer",
        "Subcontractors",
        "Suppliers"
    };
    
    // Contract Types
    static String[] contractTypes = {
        "Lump Sum",
        "Cost Plus",
        "Time & Materials",
        "Unit Price"
    };
    
    public static void main(String[] args) {
        System.out.println("=== Construction Project ===");
        System.out.println("Phases: " + phases.length);
        System.out.println("Contract Types: " + contractTypes.length);
    }
}`,
      tryIt: true
    },
    Scheduling: {
      title: 'Project Scheduling',
      content: `Scheduling methods: Gantt charts, CPM (Critical Path Method), PERT.`,
      code: `// Critical Path Method (CPM)
class CPM {
    // Project Activities
    static String[] activities = {"A", "B", "C", "D", "E"};
    static int[] duration = {3, 5, 2, 4, 3}; // days
    
    // Activity Relationships
    // A -> B, C
    // B -> D
    // C -> D
    // D -> E
    
    // Calculate Early Start (ES) and Early Finish (EF)
    static int[] ES = {0, 3, 3, 8, 12};
    static int[] EF = {3, 8, 5, 12, 15};
    
    // Critical Path
    static String criticalPath = "A-B-D-E";
    static int projectDuration = 15;
    
    // Float/Slack
    static int[] LS = {0, 3, 5, 8, 12};
    static int[] LF = {3, 8, 7, 12, 15};
    static int[] float = {0, 0, 2, 0, 0};
    
    public static void main(String[] args) {
        System.out.println("=== CPM Analysis ===");
        System.out.println("Project Duration: " + projectDuration + " days");
        System.out.println("Critical Path: " + criticalPath);
        
        System.out.println("\\nActivity Floats:");
        for (int i = 0; i < activities.length; i++) {
            System.out.println(activities[i] + ": " + float[i] + " days");
        }
    }
}`,
      tryIt: true
    },
    'Cost Estimation': {
      title: 'Cost Estimation',
      content: `Cost estimation methods: Analogous, Parametric, Bottom-up.`,
      code: `// Cost Estimation
class CostEstimation {
    // Direct Costs
    static double materialCost = 500000;  // Rs
    static double laborCost = 300000;     // Rs
    static double equipmentCost = 100000; // Rs
    
    // Indirect Costs
    static double overhead = 15; // % of direct
    static double profit = 10;    // % of direct
    
    // Total Cost
    static double direct = materialCost + laborCost + equipmentCost;
    static double indirect = direct * overhead / 100;
    static double total = direct + indirect;
    static double profitAmt = total * profit / 100;
    static double bidPrice = total + profitAmt;
    
    // Cost Breakdown
    static double materialPct = materialCost / direct * 100;
    static double laborPct = laborCost / direct * 100;
    
    public static void main(String[] args) {
        System.out.println("=== Cost Estimation ===");
        System.out.println("Direct Cost: " + direct + " Rs");
        System.out.println("Indirect: " + indirect + " Rs");
        System.out.println("Total Cost: " + total + " Rs");
        System.out.println("Bid Price: " + bidPrice + " Rs");
    }
}`,
      tryIt: true
    }
  },
  environmental: {
    Introduction: {
      title: 'Environmental Engineering Introduction',
      content: `Environmental engineering addresses pollution and sustainability.

Key areas: water treatment, air quality, waste management.`,
      code: `// Environmental Engineering
class Environmental {
    // Environmental Concerns
    static String[] concerns = {
        "Air Pollution",
        "Water Pollution",
        "Soil Contamination",
        "Waste Management",
        "Climate Change"
    };
    
    // Sustainable Development Goals
    static int[] sdgs = {6, 7, 11, 13, 14, 15};
    
    // Environmental Impact Assessment
    static String[] eiaSteps = {
        "Screening",
        "Scoping",
        "Impact Assessment",
        "Mitigation",
        "Reporting"
    };
    
    public static void main(String[] args) {
        System.out.println("=== Environmental Engineering ===");
        System.out.println("Key Concerns: " + concerns.length);
    }
}`,
      tryIt: true
    },
    Sustainability: {
      title: 'Sustainability',
      content: `Sustainable construction minimizes environmental impact.

LEED certification levels: Certified, Silver, Gold, Platinum.`,
      code: `// Sustainable Construction
class Sustainability {
    // LEED Points
    static int sustainableSites = 8;
    static int waterEfficiency = 5;
    static int energyAtmosphere = 17;
    static int materialsResources = 5;
    static int indoorEnvQuality = 6;
    static int innovation = 2;
    
    static int total = sustainableSites + waterEfficiency + 
                      energyAtmosphere + materialsResources + 
                      indoorEnvQuality + innovation;
    
    // Certification Level
    static String getLevel(int points) {
        if (points >= 80) return "Platinum";
        if (points >= 60) return "Gold";
        if (points >= 50) return "Silver";
        if (points >= 40) return "Certified";
        return "None";
    }
    
    // Carbon Footprint
    static double cementCO2 = 0.9;  // kg CO2/kg cement
    static double steelCO2 = 1.85;  // kg CO2/kg steel
    static double concrete = 400;   // kg
    static double steel = 50;       // kg
    
    static double totalCO2 = cementCO2 * concrete + steelCO2 * steel;
    
    public static void main(String[] args) {
        System.out.println("=== Sustainability ===");
        System.out.println("LEED Points: " + total);
        System.out.println("Certification: " + getLevel(total));
        System.out.println("Carbon Footprint: " + totalCO2 + " kg CO2");
    }
}`,
      tryIt: true
    }
  }
}

const sidebarTopics = [
  { id: 'structural-analysis', name: 'Structural Analysis', icon: Building },
  { id: 'geotechnical', name: 'Geotechnical', icon: HardHat },
  { id: 'hydraulics', name: 'Hydraulics', icon: Droplets },
  { id: 'construction', name: 'Construction', icon: Hammer },
  { id: 'environmental', name: 'Environmental', icon: Trees }
]

export default function CivilPage() {
  const [selectedTopic, setSelectedTopic] = useState('structural-analysis')
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Civil Engineering</h1>
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
