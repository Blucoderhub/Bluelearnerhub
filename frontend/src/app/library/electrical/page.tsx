'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CircuitBoard, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Zap,
  Cpu,
  Radio,
  Plug
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const topics = [
  { id: 'circuit-analysis', name: 'Circuit Analysis', lessons: ['Introduction', 'Ohm\'s Law', 'Kirchhoff\'s Laws', 'Network Theorems', 'Nodal Analysis'] },
  { id: 'power-systems', name: 'Power Systems', lessons: ['Introduction', 'Power Generation', 'Transmission Lines', 'Distribution', 'Fault Analysis'] },
  { id: 'control-systems', name: 'Control Systems', lessons: ['Introduction', 'Transfer Functions', 'Block Diagrams', 'Time Response', 'Stability'] },
  { id: 'electronics', name: 'Electronics', lessons: ['Introduction', 'Diodes', 'Transistors', 'Op-Amps', 'Digital Electronics'] },
  { id: 'signal-processing', name: 'Signal Processing', lessons: ['Introduction', 'Fourier Series', 'Laplace Transform', 'Filters', 'Sampling'] }
]

const tutorialContent = {
  'circuit-analysis': {
    Introduction: {
      title: 'Circuit Analysis Introduction',
      content: `Circuit analysis is the process of determining the voltages and currents in each element of an electrical circuit.

Key concepts include passive and active elements, sources, and network topology.`,
      code: `// Basic Circuit Elements
class CircuitElements {
    // Passive Elements
    static double R = 100;      // Resistance (Ohms)
    static double L = 0.001;    // Inductance (Henries)
    static double C = 0.000001; // Capacitance (Farads)
    
    // Active Elements
    static double V_source = 12; // Voltage source (Volts)
    static double I_source = 0.5; // Current source (Amps)
    
    // Impedance Calculations
    static double XL = 2 * Math.PI * 1000 * L; // Inductive reactance
    static double XC = 1 / (2 * Math.PI * 1000 * C); // Capacitive reactance
    static double Z = Math.sqrt(R*R + Math.pow(XL - XC, 2)); // Total impedance
    
    public static void main(String[] args) {
        System.out.println("Inductive Reactance: " + XL + " Ohms");
        System.out.println("Capacitive Reactance: " + XC + " Ohms");
        System.out.println("Total Impedance: " + Z + " Ohms");
    }
}

// Circuit Types
CIRCUIT_TYPES = {
    "Series": "Single path for current",
    "Parallel": "Multiple paths for current",
    "Series-Parallel": "Combination of both"
}`,
      tryIt: true
    },
    'Ohm\'s Law': {
      title: 'Ohm\'s Law',
      content: `Ohm's Law states that the current through a conductor is proportional to the voltage across it.

V = I × R

Where:
• V = Voltage (Volts)
• I = Current (Amps)
• R = Resistance (Ohms)`,
      code: `// Ohm's Law Calculator
class OhmsLaw {
    public static double calculateVoltage(double current, double resistance) {
        return current * resistance;
    }
    
    public static double calculateCurrent(double voltage, double resistance) {
        return voltage / resistance;
    }
    
    public static double calculateResistance(double voltage, double current) {
        return voltage / current;
    }
    
    public static void main(String[] args) {
        // Example 1: Find Voltage
        double I = 0.025;  // 25 mA
        double R = 1000;  // 1 kOhm
        double V = calculateVoltage(I, R);
        System.out.println("Voltage: " + V + " V");
        
        // Example 2: Find Current
        V = 9.0;
        R = 330;
        I = calculateCurrent(V, R);
        System.out.println("Current: " + (I*1000) + " mA");
        
        // Power Calculation (P = V × I)
        double P = V * I;
        System.out.println("Power: " + P + " W");
        
        // Ohm's Law Triangle
        System.out.println("\\nV = I × R");
        System.out.println("I = V / R");
        System.out.println("R = V / I");
    }
}`,
      tryIt: true
    },
    'Kirchhoff\'s Laws': {
      title: 'Kirchhoff\'s Laws',
      content: `Kirchhoff's laws form the foundation of circuit analysis:

• KCL (Current Law): The algebraic sum of currents at a node is zero.
• KVL (Voltage Law): The algebraic sum of voltages around a loop is zero.`,
      code: `// Kirchhoff's Laws Implementation
class KirchoffLaws {
    // KCL: Sum of currents entering = Sum of currents leaving
    // I1 + I2 = I3 + I4
    
    // Example: Node Analysis
    static double I1 = 10e-3;  // 10 mA entering
    static double I2 = 5e-3;   // 5 mA entering
    static double I3 = 8e-3;   // 8 mA leaving
    
    static double I4 = I1 + I2 - I3;  // Solve for I4
    
    // KVL: Sum of voltage drops = Sum of voltage rises
    // V1 + V2 + V3 - V_source = 0
    
    // Example: Mesh Analysis
    static double V_source = 12;
    static double R1 = 1000;
    static double R2 = 2000;
    static double R3 = 3000;
    
    // Using KVL: V_source = I*R1 + I*R2 + I*R3
    static double I = V_source / (R1 + R2 + R3);
    static double V_R1 = I * R1;
    static double V_R2 = I * R2;
    static double V_R3 = I * R3;
    
    public static void main(String[] args) {
        System.out.println("KCL Example:");
        System.out.println("I4 = " + (I4*1000) + " mA");
        
        System.out.println("\\nKVL Example:");
        System.out.println("Current: " + (I*1000) + " mA");
        System.out.println("V_R1: " + V_R1 + " V");
        System.out.println("V_R2: " + V_R2 + " V");
        System.out.println("V_R3: " + V_R3 + " V");
    }
}`,
      tryIt: true
    },
    'Network Theorems': {
      title: 'Network Theorems',
      content: `Important network theorems for circuit analysis:

• Superposition: Total response is sum of individual source responses
• Thevenin: Complex circuit can be replaced by equivalent voltage source and resistance
• Norton: Complex circuit can be replaced by equivalent current source and resistance
• Maximum Power Transfer: Maximum power when load = Thevenin resistance`,
      code: `// Network Theorems
class NetworkTheorems {
    // Thevenin's Theorem
    static class Thevenin {
        double Vth;  // Thevenin voltage
        double Rth;  // Thevenin resistance
        
        Thevenin(double v, double r) {
            this.Vth = v;
            this.Rth = r;
        }
        
        double maxPower() {
            // Max power when R_load = Rth
            return (Vth * Vth) / (4 * Rth);
        }
    }
    
    // Superposition Example
    static class Superposition {
        static double solveWithVonly(double R1, double R2, double V) {
            // Only voltage source active
            return V / (R1 + R2);
        }
        
        static double solveWithIonly(double R1, double R2, double I) {
            // Only current source active
            return I * (R1 / (R1 + R2));
        }
    }
    
    public static void main(String[] args) {
        // Thevenin Example
        Thevenin th = new Thevenin(12, 100);
        System.out.println("Thevenin Voltage: " + th.Vth + " V");
        System.out.println("Thevenin Resistance: " + th.Rth + " Ohms");
        System.out.println("Max Power: " + th.maxPower() + " W");
        
        // Superposition Example
        double I_total = Superposition.solveWithVonly(1000, 2000, 12) 
                        + Superposition.solveWithIonly(1000, 2000, 0.01);
        System.out.println("\\nSuperposition Current: " + I_total + " A");
    }
}`,
      tryIt: true
    }
  },
  'power-systems': {
    Introduction: {
      title: 'Power Systems Introduction',
      content: `Power systems encompass the generation, transmission, and distribution of electrical energy.

Key components include generators, transformers, transmission lines, and distribution networks.`,
      code: `// Power System Components
class PowerSystem {
    // Generation
    static double generatorVoltage = 13.8; // kV
    static double generatorPower = 500; // MW
    
    // Step-up Transformer
    static double primaryVoltage = 13.8; // kV
    static double secondaryVoltage = 400; // kV
    static double turnsRatio = secondaryVoltage / primaryVoltage;
    
    // Transmission
    static double lineLength = 200; // km
    static double lineVoltage = 400; // kV
    static double lineCurrent = generatorPower * 1000 / (Math.sqrt(3) * lineVoltage);
    
    // Step-down Transformer
    static double distributionVoltage = 11; // kV
    
    public static void main(String[] args) {
        System.out.println("=== Power System Overview ===");
        System.out.println("Generator: " + generatorVoltage + " kV, " + generatorPower + " MW");
        System.out.println("Turns Ratio: " + turnsRatio);
        System.out.println("Line Current: " + lineCurrent + " A");
        System.out.println("Distribution: " + distributionVoltage + " kV");
    }
}`,
      tryIt: true
    },
    'Transmission Lines': {
      title: 'Transmission Lines',
      content: `Transmission lines transport electrical power from generation to distribution points.

Key parameters include resistance, inductance, capacitance, and characteristic impedance.`,
      code: `// Transmission Line Parameters
class TransmissionLine {
    // Line Parameters (per km)
    static double R = 0.1;    // Resistance (ohm/km)
    static double L = 1.0e-3; // Inductance (H/km)
    static double C = 1.0e-8; // Capacitance (F/km)
    static double G = 0;      // Conductance (S/km)
    
    // Length
    static double length = 200; // km
    
    // Calculate ABCD Parameters
    static double alpha = Math.sqrt(R/2) * Math.sqrt(Math.sqrt(L/C));
    static double beta = Math.sqrt(R/2) * Math.sqrt(Math.sqrt(C/L));
    static double Z0 = Math.sqrt(L/C);  // Characteristic impedance
    static double gamma = alpha + 1j * beta;  // Propagation constant
    
    // Voltage at sending end
    static double V_receiving = 400; // kV
    static double I_receiving = 500; // A
    
    // ABCD Parameters for short line
    static double A = 1;
    static double B = (R + 1j * 2 * Math.PI * 50 * L) * length;
    static double C = 0;
    static double D = 1;
    
    // Sending end voltage (simplified)
    static double V_sending = A * V_receiving + B * I_receiving / 1000;
    
    public static void main(String[] args) {
        System.out.println("Characteristic Impedance: " + Z0 + " Ohms");
        System.out.println("Propagation Constant: " + gamma);
        System.out.println("Sending End Voltage: " + V_sending + " kV");
    }
}`,
      tryIt: true
    },
    'Fault Analysis': {
      title: 'Fault Analysis',
      content: `Fault analysis determines the currents and voltages during abnormal conditions like short circuits.

Types of faults: Symmetrical (3-phase) and Unsymmetrical (L-G, L-L, L-L-G).`,
      code: `// Fault Analysis
class FaultAnalysis {
    // System Parameters
    static double baseMVA = 100; // MVA
    static double baseKV = 400;  // kV
    static double Zsource = 0.1; // p.u. on base
    
    // Fault MVA
    static double faultMVA = baseMVA / Zsource;
    
    // Symmetrical 3-Phase Fault
    static double I_fault_3ph = faultMVA / (Math.sqrt(3) * baseKV);
    
    // Unsymmetrical Faults (approximate)
    static double I_fault_LG = I_fault_3ph * 1.5;  // Line-to-ground
    static double I_fault_LL = I_fault_3ph * 0.87; // Line-to-line
    static double I_fault_LLG = I_fault_3ph * 1.5; // Line-to-line-to-ground
    
    public static void main(String[] args) {
        System.out.println("=== Fault Analysis ===");
        System.out.println("Fault MVA: " + faultMVA + " MVA");
        System.out.println("\\n3-Phase Fault: " + I_fault_3ph + " kA");
        System.out.println("Line-Ground Fault: " + I_fault_LG + " kA");
        System.out.println("Line-Line Fault: " + I_fault_LL + " kA");
        System.out.println("Line-Line-Ground: " + I_fault_LLG + " kA");
    }
}`,
      tryIt: true
    }
  },
  'control-systems': {
    Introduction: {
      title: 'Control Systems Introduction',
      content: `Control systems manage the behavior of other systems using feedback.

Types: Open-loop and Closed-loop (feedback) systems.`,
      code: `// Control System Types
class ControlSystems {
    // Open-Loop System
    // Input → System → Output
    // No feedback
    
    // Closed-Loop System
    // Input → Controller → Actuator → Plant → Sensor → Feedback
    
    // Example: Temperature Control
    static double setPoint = 100; // Desired temperature
    static double actualTemp = 25; // Current temperature
    static double error = setPoint - actualTemp;
    
    // PID Controller
    static double Kp = 2.0;  // Proportional gain
    static double Ki = 0.5;  // Integral gain
    static double Kd = 0.1;  // Derivative gain
    
    public static void main(String[] args) {
        System.out.println("=== Control System ===");
        System.out.println("Set Point: " + setPoint + "°C");
        System.out.println("Actual: " + actualTemp + "°C");
        System.out.println("Error: " + error);
        
        // PID Output
        double output = Kp * error;
        System.out.println("Controller Output: " + output);
    }
}`,
      tryIt: true
    },
    'Transfer Functions': {
      title: 'Transfer Functions',
      content: `A transfer function G(s) is the Laplace transform of the output divided by the Laplace transform of the input.

G(s) = Y(s) / U(s)`,
      code: `// Transfer Function Analysis
class TransferFunction {
    // First-order system: G(s) = K / (τs + 1)
    static double K = 2.0;    // Gain
    static double tau = 0.5;  // Time constant
    
    // For input step of magnitude 5
    static double input = 5.0;
    
    // Output at steady state
    static double y_ss = K * input;
    
    // Output at time t
    static double y_t(double t) {
        return y_ss * (1 - Math.exp(-t / tau));
    }
    
    public static void main(String[] args) {
        System.out.println("=== First-Order System ===");
        System.out.println("Gain (K): " + K);
        System.out.println("Time Constant (τ): " + tau + " s");
        System.out.println("Steady State: " + y_ss);
        
        System.out.println("\\nOutput at different times:");
        System.out.println("t=0: " + y_t(0));
        System.out.println("t=0.5τ: " + y_t(0.5*tau));
        System.out.println("t=τ: " + y_t(tau));
        System.out.println("t=4τ: " + y_t(4*tau));
    }
}`,
      tryIt: true
    },
    'Stability': {
      title: 'Stability Analysis',
      content: `A system is stable if its output returns to equilibrium after a disturbance.

Methods: Routh-Hurwitz, Bode, Nyquist, Root Locus.`,
      code: `// Stability Analysis
class Stability {
    // Characteristic equation: s³ + 2s² + 3s + 2 = 0
    
    // Routh-Hurwitz Criterion
    static double[][] routhTable = {
        {1, 3},    // s³ row
        {2, 2, 0}, // s² row
        {1.33, 0}, // s¹ row
        {2}        // s⁰ row
    };
    
    // System stable if all elements in first column > 0
    static boolean isStable = routhTable[0][0] > 0 && 
                              routhTable[1][0] > 0 && 
                              routhTable[2][0] > 0 && 
                              routhTable[3][0] > 0;
    
    // Phase Margin (from transfer function)
    static double phaseMargin = 45; // degrees
    
    // Gain Margin
    static double gainMargin = 2.5; // (unitless)
    
    public static void main(String[] args) {
        System.out.println("=== Stability Analysis ===");
        System.out.println("System Stable: " + isStable);
        System.out.println("Phase Margin: " + phaseMargin + "°");
        System.out.println("Gain Margin: " + gainMargin);
        
        if (phaseMargin > 0 && gainMargin > 1) {
            System.out.println("Result: STABLE");
        } else {
            System.out.println("Result: UNSTABLE");
        }
    }
}`,
      tryIt: true
    }
  },
  electronics: {
    Introduction: {
      title: 'Electronics Introduction',
      content: `Electronics deals with circuits involving active components like semiconductors.

Key components: Diodes, Transistors, Integrated Circuits.`,
      code: `// Electronics Fundamentals
class Electronics {
    // Semiconductor Materials
    static String[] materials = {"Silicon", "Germanium", "GaAs"};
    
    // Doping Types
    static String nType = "Donor atoms (Phosphorus) - extra electrons";
    static String pType = "Acceptor atoms (Boron) - extra holes";
    
    // PN Junction
    static double Si_forwardVoltage = 0.7; // V
    static double Ge_forwardVoltage = 0.3;   // V
    
    // Diode Equation
    static double I_s = 1e-12; // Saturation current (A)
    static double V = 0.7;      // Forward voltage (V)
    static double I = I_s * (Math.exp(V / 0.026) - 1); // Forward current
    
    public static void main(String[] args) {
        System.out.println("=== Electronics Basics ===");
        System.out.println("N-Type: " + nType);
        System.out.println("P-Type: " + pType);
        System.out.println("Si Forward Voltage: " + Si_forwardVoltage + " V");
        System.out.println("Diode Current: " + I + " A");
    }
}`,
      tryIt: true
    },
    Diodes: {
      title: 'Diodes',
      content: `A diode allows current to flow in one direction only (forward bias).

Key types: Rectifier, Zener, LED, Photodiode.`,
      code: `// Diode Circuits
class DiodeCircuit {
    // Half-Wave Rectifier
    static double V_peak = 12; // V
    static double V_d = 0.7;   // Diode drop
    static double V_out_peak = V_peak - V_d;
    
    // Full-Wave Rectifier
    static double V_out_fw_peak = 2 * V_peak - 2 * V_d;
    
    // Zener Diode
    static double V_z = 5.6;   // Zener voltage
    static double V_in = 12;   // Input voltage
    static double R = 1000;    // Series resistor
    static double I_z = (V_in - V_z) / R; // Zener current
    
    public static void main(String[] args) {
        System.out.println("=== Diode Circuits ===");
        System.out.println("Half-Wave Output: " + V_out_peak + " V peak");
        System.out.println("Full-Wave Output: " + V_out_fw_peak + " V peak");
        System.out.println("Zener Current: " + (I_z*1000) + " mA");
    }
}`,
      tryIt: true
    },
    Transistors: {
      title: 'Transistors',
      content: `Transistors are semiconductor devices used for switching and amplification.

Main types: BJT (Bipolar Junction Transistor) and MOSFET.`,
      code: `// Transistor Analysis
class Transistor {
    // BJT Parameters
    static double Vcc = 12;     // Supply voltage
    static double Vbb = 5;     // Base bias
    static double Vbe = 0.7;   // Base-emitter drop
    static double beta = 100;  // Current gain
    
    // Bias Calculations
    static double Vb = Vbb * 10 / (10 + 10); // Voltage at base
    static double Ve = Vb - Vbe;              // Voltage at emitter
    static double Ie = Ve / 1000;             // Emitter current
    static double Ic = beta / (beta + 1) * Ie; // Collector current
    static double Ib = Ie - Ic;               // Base current
    
    // MOSFET Parameters
    static double Vgs = 5;    // Gate-source voltage
    static double Vt = 1.5;   // Threshold voltage
    static double k = 0.1;    // Transconductance
    static double Id;         // Drain current
    
    public static void main(String[] args) {
        System.out.println("=== BJT Analysis ===");
        System.out.println("Base Current: " + (Ib*1000) + " mA");
        System.out.println("Collector Current: " + (Ic*1000) + " mA");
        System.out.println("Emitter Current: " + (Ie*1000) + " mA");
        
        if (Vgs > Vt) {
            Id = k * Math.pow(Vgs - Vt, 2);
            System.out.println("\\n=== MOSFET Analysis ===");
            System.out.println("Drain Current: " + Id + " A");
        }
    }
}`,
      tryIt: true
    }
  },
  'signal-processing': {
    Introduction: {
      title: 'Signal Processing Introduction',
      content: `Signal processing analyzes and transforms signals to extract information.

Techniques include Fourier analysis, filtering, and sampling.`,
      code: `// Signal Processing Basics
class SignalProcessing {
    // Signal Types
    static String[] signalTypes = {
        "Continuous-time",
        "Discrete-time",
        "Analog",
        "Digital",
        "Periodic",
        "Aperiodic"
    };
    
    // Basic Operations
    static double[] signal = {1, 2, 3, 4, 5};
    
    // Mean (DC component)
    static double mean = 0;
    for (double val : signal) mean += val;
    mean /= signal.length;
    
    // RMS Value
    static double rms = 0;
    for (double val : signal) rms += val * val;
    rms = Math.sqrt(rms / signal.length);
    
    public static void main(String[] args) {
        System.out.println("=== Signal Processing ===");
        System.out.println("Signal Mean: " + mean);
        System.out.println("RMS Value: " + rms);
    }
}`,
      tryIt: true
    },
    Filters: {
      title: 'Filters',
      content: `Filters allow certain frequencies to pass while attenuating others.

Types: Low-pass, High-pass, Band-pass, Band-stop.`,
      code: `// Filter Design
class Filter {
    // First-order Low-pass Filter
    static double fc = 1000;  // Cutoff frequency (Hz)
    static double RC = 1 / (2 * Math.PI * fc);
    
    // Transfer Function: H(s) = 1 / (RC*s + 1)
    // Magnitude at cutoff = 1/sqrt(2) = -3dB
    
    // Attenuation at different frequencies
    static double attenuation(double f) {
        double w = 2 * Math.PI * f;
        double wRC = w * RC;
        return 20 * Math.log10(1 / Math.sqrt(1 + wRC*wRC));
    }
    
    public static void main(String[] args) {
        System.out.println("=== Low-pass Filter ===");
        System.out.println("Cutoff: " + fc + " Hz");
        System.out.println("RC: " + RC + " s");
        
        System.out.println("\\nAttenuation:");
        System.out.println("100 Hz: " + attenuation(100) + " dB");
        System.out.println("1000 Hz: " + attenuation(1000) + " dB");
        System.out.println("10000 Hz: " + attenuation(10000) + " dB");
    }
}`,
      tryIt: true
    }
  }
}

const sidebarTopics = [
  { id: 'circuit-analysis', name: 'Circuit Analysis', icon: Zap },
  { id: 'power-systems', name: 'Power Systems', icon: Plug },
  { id: 'control-systems', name: 'Control Systems', icon: Cpu },
  { id: 'electronics', name: 'Electronics', icon: CircuitBoard },
  { id: 'signal-processing', name: 'Signal Processing', icon: Radio }
]

export default function ElectricalPage() {
  const [selectedTopic, setSelectedTopic] = useState('circuit-analysis')
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
                  <CircuitBoard className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Electrical Engineering</h1>
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
