'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Layers,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  ChevronRight,
  Thermometer,
  Droplets,
  Cog,
  Wrench,
  Car,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const topics = [
  { id: 'thermodynamics', name: 'Thermodynamics', lessons: ['Introduction', 'Laws of Thermodynamics', 'Heat Transfer', 'Entropy', 'Thermodynamic Processes'] },
  { id: 'fluid-mechanics', name: 'Fluid Mechanics', lessons: ['Introduction', 'Fluid Properties', 'Bernoulli\'s Equation', 'Flow Types', 'Pressure'] },
  { id: 'cad-cam', name: 'CAD/CAM', lessons: ['Introduction', 'SolidWorks Basics', 'AutoCAD 2D', '3D Modeling', 'CNC Programming'] },
  { id: 'manufacturing', name: 'Manufacturing', lessons: ['Introduction', 'Casting', 'Forging', 'Machining', 'Welding'] },
  { id: 'automobile', name: 'Automobile Engineering', lessons: ['Introduction', 'Engine Types', 'Transmission', 'Suspension Systems', 'Braking Systems'] }
]

const tutorialContent = {
  thermodynamics: {
    Introduction: {
      title: 'Thermodynamics Introduction',
      content: `Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, entropy, and properties of matter.

Key concepts include system, boundary, surroundings, and state variables (pressure, volume, temperature).`,
      code: `// Thermodynamic System Types
// 1. Open System: Mass and energy transfer
// 2. Closed System: Only energy transfer  
// 3. Isolated System: No transfer

// Example: Closed System
class ClosedSystem {
    private double mass = 1.0; // kg
    private double temperature = 300; // K
    private double pressure = 101325; // Pa
    
    public double getInternalEnergy() {
        // U = m * cv * T (for ideal gas)
        double cv = 718; // J/kg.K (air)
        return mass * cv * temperature;
    }
    
    public void addHeat(double Q) {
        // Q = m * cp * dT
        double cp = 1005; // J/kg.K
        double dT = Q / (mass * cp);
        temperature += dT;
    }
}`,
      tryIt: true
    },
    'Laws of Thermodynamics': {
      title: 'Laws of Thermodynamics',
      content: `The four laws of thermodynamics form the foundation of this field:

• Zeroth Law: If two systems are in thermal equilibrium with a third, they are in thermal equilibrium with each other.
• First Law: Energy cannot be created or destroyed, only transformed (ΔU = Q - W).
• Second Law: Entropy of an isolated system always increases.
• Third Law: Absolute zero cannot be reached.`,
      code: `// First Law of Thermodynamics
// ΔU = Q - W
// Where:
//   ΔU = change in internal energy
//   Q = heat added to system
//   W = work done by system

class FirstLawExample {
    public static void main(String[] args) {
        double Q = 1000;  // Heat added (J)
        double W = 300;   // Work done (J)
        
        double deltaU = Q - W;
        System.out.println("ΔU = " + deltaU + " J");
        
        // For isochoric process (W = 0)
        double Q_iso = 500;
        double W_iso = 0;
        double deltaU_iso = Q_iso - W_iso;
        System.out.println("Isochoric: ΔU = " + deltaU_iso + " J");
    }
}

// Second Law - Entropy
// ΔS ≥ Q/T (for reversible/irreversible processes)
class EntropyCalculation {
    public static void main(String[] args) {
        double Q = 1000;  // J
        double T = 300;  // K
        
        double deltaS = Q / T;
        System.out.println("ΔS = " + deltaS + " J/K");
    }
}`,
      tryIt: true
    },
    'Heat Transfer': {
      title: 'Heat Transfer',
      content: `Heat transfer occurs through three mechanisms:

1. Conduction: Heat transfer through materials (Q = kA(dT/dx))
2. Convection: Heat transfer between surface and fluid (Q = hA(Ts - T∞))
3. Radiation: Heat transfer through electromagnetic waves (Q = εσAT⁴)`,
      code: `// Heat Transfer Calculations

// Conduction: Q = k * A * (dT/dx)
class Conduction {
    public static void main(String[] args) {
        double k = 0.026;  // Thermal conductivity (W/m.K) - air
        double A = 1.0;    // Area (m²)
        double dT = 100;   // Temperature difference (K)
        double dx = 0.05;  // Thickness (m)
        
        double Q = k * A * dT / dx;
        System.out.println("Conduction Q = " + Q + " W");
    }
}

// Convection: Q = h * A * (Ts - T∞)
class Convection {
    public static void main(String[] args) {
        double h = 10.0;   // Heat transfer coefficient (W/m².K)
        double A = 2.0;    // Surface area (m²)
        double Ts = 350;   // Surface temperature (K)
        double T_inf = 300; // Fluid temperature (K)
        
        double Q = h * A * (Ts - T_inf);
        System.out.println("Convection Q = " + Q + " W");
    }
}

// Radiation: Q = εσA(Ts⁴ - T∞⁴)
class Radiation {
    public static void main(String[] args) {
        double epsilon = 0.9;  // Emissivity
        double sigma = 5.67e-8; // Stefan-Boltzmann constant
        double A = 1.0;        // Area (m²)
        double Ts = 500;       // Surface temperature (K)
        double T_inf = 300;   // Surrounding temperature (K)
        
        double Q = epsilon * sigma * A * 
                   (Math.pow(Ts,4) - Math.pow(T_inf,4));
        System.out.println("Radiation Q = " + Q + " W");
    }
}`,
      tryIt: true
    }
  },
  'fluid-mechanics': {
    Introduction: {
      title: 'Fluid Mechanics Introduction',
      content: `Fluid mechanics is the study of fluids (liquids and gases) and the forces on them.

It is divided into:
• Fluid Statics: Study of fluids at rest
• Fluid Dynamics: Study of fluids in motion`,
      code: `// Fluid Properties
class FluidProperties {
    public static void main(String[] args) {
        // Water at 20°C
        double rho = 998;     // Density (kg/m³)
        double mu = 1.002e-3; // Dynamic viscosity (Pa.s)
        double nu = mu / rho;  // Kinematic viscosity (m²/s)
        
        System.out.println("Density: " + rho + " kg/m³");
        System.out.println("Dynamic Viscosity: " + mu + " Pa.s");
        System.out.println("Kinematic Viscosity: " + nu + " m²/s");
        
        // Specific Weight
        double g = 9.81;  // Gravity (m/s²)
        double gamma = rho * g;
        System.out.println("Specific Weight: " + gamma + " N/m³");
        
        // Bulk Modulus
        double K = 2.2e9;  // Bulk modulus (Pa)
        System.out.println("Bulk Modulus: " + K + " Pa");
    }
}`,
      tryIt: true
    },
    'Bernoulli\'s Equation': {
      title: 'Bernoulli\'s Equation',
      content: `Bernoulli's equation describes the relationship between pressure, velocity, and elevation in a flowing fluid.

P/ρg + V²/2g + z = constant

Where:
• P = pressure
• ρ = fluid density
• V = velocity
• g = gravitational acceleration
• z = elevation head`,
      code: `// Bernoulli's Equation Calculator
class Bernoulli {
    public static void main(String[] args) {
        // Given: Pipe with varying cross-section
        // Section 1: diameter = 0.1m, pressure = 100 kPa
        // Section 2: diameter = 0.05m, pressure = ?
        
        double d1 = 0.1;    // m
        double d2 = 0.05;   // m
        double P1 = 100000; // Pa (pressure at section 1)
        double V1 = 2.0;    // m/s (velocity at section 1)
        double g = 9.81;    // m/s²
        
        // Continuity: A1*V1 = A2*V2
        double A1 = Math.PI * d1 * d1 / 4;
        double A2 = Math.PI * d2 * d2 / 4;
        double V2 = (A1 * V1) / A2;
        
        // Bernoulli: P1/ρ + V1²/2 = P2/ρ + V2²/2
        double rho = 1000; // kg/m³ (water)
        double P2 = P1 + (rho/2) * (V1*V1 - V2*V2);
        
        System.out.println("Velocity at section 2: " + V2 + " m/s");
        System.out.println("Pressure at section 2: " + (P2/1000) + " kPa");
    }
}`,
      tryIt: true
    },
    'Flow Types': {
      title: 'Flow Types',
      content: `Flow can be classified into two main types:

1. Laminar Flow: Fluid particles move in smooth, parallel layers. Occurs at low Reynolds numbers (Re < 2000).

2. Turbulent Flow: Fluid particles move in random, chaotic patterns. Occurs at high Reynolds numbers (Re > 4000).

Reynolds Number: Re = ρVL/μ = VL/ν`,
      code: `// Reynolds Number Calculation
class ReynoldsNumber {
    public static void main(String[] args) {
        // Calculate Reynolds Number
        // Re = ρVD/μ or Re = VD/ν
        
        double rho = 1000;    // Density (kg/m³)
        double V = 1.0;       // Velocity (m/s)
        double D = 0.05;      // Diameter (m)
        double mu = 1.002e-3; // Dynamic viscosity (Pa.s)
        
        double Re = (rho * V * D) / mu;
        
        System.out.println("Reynolds Number: " + Re);
        
        // Flow type determination
        if (Re < 2000) {
            System.out.println("Flow Type: LAMINAR");
        } else if (Re > 4000) {
            System.out.println("Flow Type: TURBULENT");
        } else {
            System.out.println("Flow Type: TRANSITION");
        }
        
        // Friction factor for laminar flow
        double f = 64 / Re;
        System.out.println("Friction Factor: " + f);
    }
}`,
      tryIt: true
    }
  },
  'cad-cam': {
    Introduction: {
      title: 'CAD/CAM Introduction',
      content: `CAD (Computer-Aided Design) and CAM (Computer-Aided Manufacturing) are essential technologies in modern mechanical engineering.

CAD software is used to create 2D drawings and 3D models, while CAM software converts designs into machine instructions.`,
      code: `// Common CAD Commands (Pseudo-code)
// These follow similar patterns across AutoCAD, SolidWorks, etc.

COMMANDS = {
    // Drawing
    "LINE": "Creates straight line segments",
    "CIRCLE": "Creates circles",
    "ARC": "Creates arcs",
    "POLYLINE": "Creates connected lines",
    
    // Editing
    "MOVE": "Translates objects",
    "ROTATE": "Rotates objects",
    "SCALE": "Resizes objects",
    "MIRROR": "Creates mirrored copies",
    "ARRAY": "Creates multiple copies in pattern",
    "OFFSET": "Creates parallel copies",
    
    // 3D
    "EXTRUDE": "Creates 3D from 2D profile",
    "REVOLVE": "Creates symmetric 3D objects",
    "LOFT": "Creates transitional shapes",
    "SWEEP": "Creates shapes along path"
}

// Example: Creating a simple part
STEPS = [
    "1. Draw 2D sketch on plane",
    "2. Add dimensions and constraints",
    "3. Extrude to create 3D model",
    "4. Add fillets and chamfers",
    "5. Create holes with hole wizard",
    "6. Export for manufacturing"
]`,
      tryIt: true
    },
    'SolidWorks Basics': {
      title: 'SolidWorks Basics',
      content: `SolidWorks is a popular 3D CAD software used for creating parametric parts, assemblies, and drawings.

Key concepts include sketches, features, relations, and dimensions.`,
      code: `// SolidWorks Feature Script (Syntax Overview)
FEATURES = {
    // Base Feature - Extruded Boss
    "Extrude": {
        "type": "boss",
        "depth": 50,  // mm
        "direction": "up",
        "draft_angle": 0
    },
    
    // Cut Feature
    "ExtrudeCut": {
        "type": "cut",
        "depth": 20,
        "through_all": true
    },
    
    // Revolved Feature
    "Revolve": {
        "axis": "center_axis",
        "angle": 360
    },
    
    // Fillet
    "Fillet": {
        "radius": 5,
        "edges": ["selected"]
    },
    
    // Shell
    "Shell": {
        "thickness": 3,
        "faces": ["top"]
    }
}

// Common Workflow
WORKFLOW = [
    "Sketch → Define 2D profile",
    "Features → Add 3D operations",
    "Relations → Maintain design intent",
    "Dimensions → Control size",
    "Configurations → Variant designs"
]`,
      tryIt: true
    },
    'CNC Programming': {
      title: 'CNC Programming',
      content: `CNC (Computer Numerical Control) programming uses G-codes and M-codes to control machine tools.

G-codes control movement and cutting, while M-codes control machine functions.`,
      code: `// CNC Milling Program Example
PROGRAM = """
O1001 (PART PROGRAM)
(Pocket Milling - 50mm x 50mm)

G90 G54 (Absolute, Work Offset)
G00 Z100 (Safe Z)
M03 S3000 (Spindle On - 3000 RPM)

; Roughing Pass
G00 X0 Y0
G00 Z5
G01 Z-10 F500 (Cut to depth)
G01 X50 F1000 (Linear move)
G01 Y50
G01 X0
G01 Y0

; Finishing Pass
G00 Z5
G01 Z-10 F500
G41 D1 (Cutter Compensation Left)
G01 X5 Y5 F800
G01 X45
G01 Y45
G01 X5
G01 Y5
G40 (Cancel Compensation)

G00 Z100 (Return to Safe Z)
M05 (Spindle Off)
M30 (Program End)
"""

// Common G-Codes
G_CODES = {
    "G00": "Rapid positioning",
    "G01": "Linear interpolation",
    "G02": "Clockwise circular",
    "G03": "Counter-clockwise circular",
    "G17": "XY plane selection",
    "G90": "Absolute programming",
    "G91": "Incremental programming"
}

// Common M-Codes
M_CODES = {
    "M03": "Spindle on clockwise",
    "M04": "Spindle on counter-clockwise",
    "M05": "Spindle stop",
    "M06": "Tool change",
    "M30": "Program end"
}`,
      tryIt: true
    }
  },
  manufacturing: {
    Introduction: {
      title: 'Manufacturing Introduction',
      content: `Manufacturing processes transform raw materials into finished products.

Main categories include:
• Casting: Pouring material into molds
• Forming: Shaping through deformation
• Machining: Material removal
• Joining: Connecting parts together`,
      code: `// Manufacturing Process Classification
MANUFACTURING_PROCESSES = {
    "Casting": {
        "description": "Pouring molten material into mold",
        "methods": [
            "Sand Casting",
            "Die Casting",
            "Investment Casting",
            "Continuous Casting"
        ],
        "materials": ["Metals", "Plastics", "Ceramics"]
    },
    
    "Forming": {
        "description": "Shaping through deformation",
        "methods": [
            "Forging",
            "Rolling",
            "Extrusion",
            "Drawing"
        ],
        "materials": ["Metals", "Plastics"]
    },
    
    "Machining": {
        "description": "Material removal",
        "methods": [
            "Turning",
            "Milling",
            "Drilling",
            "Grinding"
        ],
        "tools": ["Lathe", "Mill", "Drill", "Grinder"]
    },
    
    "Joining": {
        "description": "Connecting parts",
        "methods": [
            "Welding",
            "Brazing",
            "Soldering",
            "Adhesive Bonding"
        ]
    }
}`,
      tryIt: true
    },
    Casting: {
      title: 'Casting',
      content: `Casting is a manufacturing process where molten metal is poured into a mold cavity and allowed to solidify.

Types include sand casting, die casting, investment casting, and continuous casting.`,
      code: `// Sand Casting Process
class SandCasting {
    // Pattern Making
    static String patternType = "Split Pattern";
    static double shrinkage = 1.02; // 2% shrinkage
    
    // Mold Preparation
    static String moldMaterial = "Sand + Clay + Water";
    static String cope = "Upper mold half";
    static String drag = "Lower mold half";
    
    // Core Making
    static String coreMaterial = "Oil Sand";
    static boolean useCores = true;
    
    // Pouring Parameters
    static double pouringTemp = 1450; // °C
    static double pouringHeight = 300; // mm
    
    // Process Steps
    static String[] steps = {
        "1. Pattern Making",
        "2. Mold Preparation",
        "3. Core Making (if needed)",
        "4. Assembling Mold",
        "5. Pouring Metal",
        "6. Cooling & Solidification",
        "7. Shakeout",
        "8. Cleaning & Finishing"
    };
    
    public static void main(String[] args) {
        System.out.println("=== Sand Casting Process ===");
        for (String step : steps) {
            System.out.println(step);
        }
    }
}

// Die Casting Comparison
DIE_CASTING = {
    "pressure": "High (30-200 MPa)",
    "mold_material": "Steel",
    "surface_finish": "Excellent",
    "production_rate": "High",
    "applications": [
        "Automotive parts",
        "Appliance components",
        "Electronic housings"
    ]
}`,
      tryIt: true
    },
    Welding: {
      title: 'Welding',
      content: `Welding is a fabrication process that joins materials by causing coalescence.

Common welding processes include MIG, TIG, Stick, and Flux-cored arc welding.`,
      code: `// Welding Process Parameters
WELDING_PROCESSES = {
    "MIG (GMAW)": {
        "full_name": "Gas Metal Arc Welding",
        "shielding_gas": "Argon + CO2",
        "applications": ["Steel", "Stainless", "Aluminum"],
        "advantages": [
            "High deposition rate",
            "No slag",
            "Easy automation"
        ]
    },
    
    "TIG (GTAW)": {
        "full_name": "Gas Tungsten Arc Welding",
        "shielding_gas": "Argon or Helium",
        "applications": ["Stainless", "Aluminum", "Titanium"],
        "advantages": [
            "High quality weld",
            "No spatter",
            "Precise control"
        ]
    },
    
    "Stick (SMAW)": {
        "full_name": "Shielded Metal Arc Welding",
        "electrode": "Consumable coated rod",
        "applications": ["Construction", "Repair"],
        "advantages": [
            "Portable",
            "Versatile",
            "No gas needed"
        ]
    }
}

// Weld Symbols
WELD_SYMBOLS = {
    "---": "Field weld (both sides)",
    "---|": "Arrow side weld",
    "|---": "Other side weld",
    "∆": "Fillet weld",
    "V": "V-groove",
    "O": "Spot weld"
}

// Weld Strength Calculation
function calculateWeldStrength() {
    // Shear strength = 0.3 × tensile strength (for mild steel)
    const tensileStrength = 410; // MPa
    const shearStrength = 0.3 * tensileStrength;
    
    // Allowable stress = shear strength / safety factor
    const safetyFactor = 3;
    const allowableStress = shearStrength / safetyFactor;
    
    return allowableStress; // MPa
}`,
      tryIt: true
    }
  },
  automobile: {
    Introduction: {
      title: 'Automobile Engineering Introduction',
      content: `Automobile engineering combines mechanical, electrical, and automotive engineering to design and develop vehicles.

Key systems include engine, transmission, suspension, steering, and braking.`,
      code: `// Major Automobile Systems
AUTOMOTIVE_SYSTEMS = {
    "Powertrain": {
        "components": [
            "Engine",
            "Transmission",
            "Differentials",
            "Drive Shafts"
        ],
        "function": "Transmit power to wheels"
    },
    
    "Suspension": {
        "components": [
            "Springs",
            "Shock Absorbers",
            "Control Arms",
            "Stabilizer Bars"
        ],
        "function": "Provide ride comfort & handling"
    },
    
    "Steering": {
        "components": [
            "Steering Wheel",
            "Steering Column",
            "Rack & Pinion",
            "Tie Rods"
        ],
        "function": "Control vehicle direction"
    },
    
    "Braking": {
        "components": [
            "Brake Pedal",
            "Master Cylinder",
            "Brake Calipers",
            "Brake Pads"
        ],
        "function": "Reduce speed or stop vehicle"
    },
    
    "Electrical": {
        "components": [
            "Battery",
            "Alternator",
            "Starter Motor",
            "ECU"
        ],
        "function": "Power & control systems"
    }
}`,
      tryIt: true
    },
    'Engine Types': {
      title: 'Engine Types',
      content: `Internal combustion engines are classified by arrangement of cylinders and combustion process.

Main types: Spark Ignition (SI) and Compression Ignition (CI) engines.`,
      code: `// Engine Classification
ENGINE_TYPES = {
    "By Ignition": {
        "SI Engine": {
            "name": "Spark Ignition",
            "fuel": "Petrol/Gasoline",
            "compression_ratio": "6:1 to 12:1",
            "example": "Honda, Toyota engines"
        },
        "CI Engine": {
            "name": "Compression Ignition",
            "fuel": "Diesel",
            "compression_ratio": "14:1 to 25:1",
            "example": "John Deere, Cummins"
        }
    },
    
    "By Cycle": {
        "4-Stroke": {
            "intake": "Intake stroke",
            "compression": "Compression stroke",
            "power": "Power stroke",
            "exhaust": "Exhaust stroke"
        },
        "2-Stroke": {
            "intake": "Intake + Compression",
            "power": "Power + Exhaust"
        }
    },
    
    "By Arrangement": {
        "Inline": "Cylinders in a row",
        "V": "Cylinders at angle",
        "Boxer": "Horizontally opposed",
        "Rotary": "Rotary engine"
    }
}

// Four Stroke Cycle
class EngineCycle {
    static void fourStrokeCycle() {
        System.out.println("=== 4-Stroke Cycle ===");
        System.out.println("1. INTAKE: Piston down, valve opens");
        System.out.println("2. COMPRESSION: Piston up, valves closed");
        System.out.println("3. POWER: Spark ignites, piston down");
        System.out.println("4. EXHAUST: Piston up, exhaust opens");
    }
}`,
      tryIt: true
    },
    Transmission: {
      title: 'Transmission Systems',
      content: `Transmission systems transfer engine power to wheels through various gear ratios.

Types include Manual, Automatic, CVT, and Dual-clutch transmissions.`,
      code: `// Transmission Types
TRANSMISSION_TYPES = {
    "Manual Transmission (MT)": {
        "gears": "5-6 forward gears",
        "clutch": "Driver-operated",
        "control": "Manual gear selection",
        "efficiency": "~95%",
        "pros": ["Better fuel efficiency", "More control"],
        "cons": ["Requires skill", "More effort"]
    },
    
    "Automatic Transmission (AT)": {
        "gears": "4-10 forward gears",
        "clutch": "Torque converter",
        "control": "Hydraulic/electronic",
        "efficiency": "~85%",
        "pros": ["Easy to drive", "Smooth shifting"],
        "cons": ["Lower efficiency", "Complex"]
    },
    
    "CVT": {
        "name": "Continuously Variable Transmission",
        "gears": "Infinite ratios",
        "belt": "Metal belt/push belt",
        "efficiency": "~90%",
        "pros": ["Smooth power", "Good economy"],
        "cons": ["Limited torque capacity"]
    },
    
    "DCT": {
        "name": "Dual Clutch Transmission",
        "gears": "6-10 forward gears",
        "clutches": "Two separate clutches",
        "efficiency": "~92%",
        "pros": ["Fast shifting", "Efficient"],
        "cons": ["Complex", "Expensive"]
    }
}

// Gear Ratio Calculation
function gearRatio() {
    const engineRPM = 3000;
    const wheelRPM = 500;
    const gearRatio = engineRPM / wheelRPM;
    
    const finalDriveRatio = 3.5;
    const overallRatio = gearRatio * finalDriveRatio;
    
    return overallRatio;
}`,
      tryIt: true
    }
  }
}

const sidebarTopics = [
  { id: 'thermodynamics', name: 'Thermodynamics', icon: Thermometer },
  { id: 'fluid-mechanics', name: 'Fluid Mechanics', icon: Droplets },
  { id: 'cad-cam', name: 'CAD/CAM', icon: Cog },
  { id: 'manufacturing', name: 'Manufacturing', icon: Wrench },
  { id: 'automobile', name: 'Automobile', icon: Car },
]

export default function MechanicalPage() {
  const [selectedTopic, setSelectedTopic] = useState('thermodynamics')
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

  const currentLessons = topics.find(t => t.id === selectedTopic)?.lessons ?? []
  const currentIndex   = currentLessons.indexOf(selectedLesson)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex pt-14">
        {/* ── Sidebar ── */}
        <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-card overflow-y-auto scrollbar-thin z-20">
          <div className="p-4">
            <Link href="/library" className="mb-5 flex items-center gap-2 text-sm font-mono font-medium text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Link>

            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'hsl(30 100% 50% / 0.10)' }}>
                <Layers className="h-4 w-4" style={{ color: 'hsl(30 100% 50%)' }} />
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Domain</p>
                <p className="text-sm font-bold text-foreground">Mechanical</p>
              </div>
            </div>

            <div className="mb-4 border-t border-border" />

            <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground px-1">Topics</p>
            <nav className="space-y-0.5">
              {sidebarTopics.map((topic) => {
                const Icon = topic.icon
                const isActive = selectedTopic === topic.id
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id)
                      const firstLesson = topics.find(t => t.id === topic.id)?.lessons[0]
                      if (firstLesson) setSelectedLesson(firstLesson)
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all text-left ${
                      isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{topic.name}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary" />}
                  </button>
                )
              })}
            </nav>

            <div className="mt-5">
              <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground px-1">
                {sidebarTopics.find(t => t.id === selectedTopic)?.name} Lessons
              </p>
              <div className="space-y-0.5">
                {topics.find(t => t.id === selectedTopic)?.lessons.map((lesson) => (
                  <button
                    key={lesson}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-mono ${
                      selectedLesson === lesson ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                  >
                    {lesson}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="ml-64 flex-1 min-h-[calc(100vh-3.5rem)]">
          <div className="mx-auto max-w-4xl px-6 py-8">

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mb-1">
                  <Link href="/library" className="hover:text-primary transition-colors">Library</Link>
                  <span>/</span>
                  <span>Mechanical</span>
                  <span>/</span>
                  <span className="text-foreground">{sidebarTopics.find(t => t.id === selectedTopic)?.name}</span>
                </div>
                <h1 className="text-2xl font-bold">{lessonData?.title ?? selectedLesson}</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Free
                </span>
                <span className="badge border border-border text-muted-foreground font-mono">
                  <BookOpen className="h-3 w-3 mr-1" /> No Login
                </span>
              </div>
            </div>

            {lessonData ? (
              <motion.div
                key={`${selectedTopic}-${selectedLesson}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="card p-7">
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-mono)' }}>
                    {lessonData.content}
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border" style={{ background: 'hsl(222 47% 9%)' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: 'hsl(222 47% 12%)', borderColor: 'hsl(222 47% 20%)' }}>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <span className="inline-block h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="inline-block h-3 w-3 rounded-full bg-[#28c840]" />
                      <span className="ml-2 text-xs font-mono text-gray-400">Example</span>
                    </div>
                    <button onClick={copyCode} className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-sm scrollbar-thin" style={{ color: '#e6edf3', fontFamily: 'var(--font-mono)', lineHeight: 1.75 }}>
                    <code>{lessonData.code}</code>
                  </pre>
                </div>

                {lessonData.tryIt && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link href="/ide" className="btn btn-primary flex items-center gap-2">
                      <Play className="h-4 w-4" /> Try it Yourself
                    </Link>
                    <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Free to use — no login required
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => { if (currentIndex > 0) setSelectedLesson(currentLessons[currentIndex - 1]) }}
                    disabled={currentIndex === 0}
                    className="btn btn-outline flex items-center gap-2 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </button>
                  <span className="text-xs font-mono text-muted-foreground">{currentIndex + 1} / {currentLessons.length}</span>
                  <button
                    onClick={() => { if (currentIndex < currentLessons.length - 1) setSelectedLesson(currentLessons[currentIndex + 1]) }}
                    disabled={currentIndex === currentLessons.length - 1}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-40"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="card p-10 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-mono text-muted-foreground">Select a topic and lesson from the sidebar to start learning.</p>
              </div>
            )}
          </div>

          <div className="px-6 pb-8"><Footer /></div>
        </main>
      </div>
    </div>
  )
}
