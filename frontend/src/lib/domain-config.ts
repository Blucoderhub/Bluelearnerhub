// src/lib/domain-config.ts

export const DOMAINS = {
  // ENGINEERING DOMAINS
  COMPUTER_SCIENCE: {
    id: 'computer-science',
    name: 'Computer Science & IT',
    icon: '💻',
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-500',
    categories: [
      'Programming',
      'Data Structures & Algorithms',
      'Web Development',
      'Mobile Development',
      'Machine Learning',
      'Artificial Intelligence',
      'Cloud Computing',
      'DevOps',
      'Cybersecurity',
      'Database Management',
      'System Design',
      'Blockchain'
    ],
    tools: ['code-editor', 'terminal', 'debugger', 'compiler'],
    problemTypes: ['coding', 'algorithm', 'system-design', 'debugging']
  },

  MECHANICAL: {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    icon: '⚙️',
    color: '#f59e0b',
    gradient: 'from-orange-500 to-yellow-500',
    categories: [
      'Thermodynamics',
      'Fluid Mechanics',
      'Machine Design',
      'Manufacturing Processes',
      'Materials Science',
      'Heat Transfer',
      'Robotics',
      'Automotive Engineering',
      'CAD/CAM',
      'FEA & CFD',
      'Mechanics of Materials',
      'Vibrations & Dynamics'
    ],
    tools: ['cad-viewer', 'fea-simulator', 'cfd-analyzer', 'calculator'],
    problemTypes: ['design', 'analysis', 'optimization', 'simulation']
  },

  ELECTRICAL: {
    id: 'electrical',
    name: 'Electrical & Electronics',
    icon: '⚡',
    color: '#eab308',
    gradient: 'from-yellow-500 to-amber-500',
    categories: [
      'Circuit Theory',
      'Power Systems',
      'Control Systems',
      'Electronics',
      'Digital Electronics',
      'Signals & Systems',
      'Electromagnetics',
      'Power Electronics',
      'Microprocessors',
      'Communication Systems',
      'VLSI Design',
      'Embedded Systems'
    ],
    tools: ['circuit-simulator', 'oscilloscope', 'pcb-designer', 'spice'],
    problemTypes: ['circuit-design', 'signal-analysis', 'system-design', 'pcb-layout']
  },

  CIVIL: {
    id: 'civil',
    name: 'Civil Engineering',
    icon: '🏗️',
    color: '#84cc16',
    gradient: 'from-green-500 to-lime-500',
    categories: [
      'Structural Analysis',
      'Geotechnical Engineering',
      'Transportation Engineering',
      'Environmental Engineering',
      'Construction Management',
      'Hydraulics',
      'Surveying',
      'Concrete Technology',
      'Steel Structures',
      'Foundation Design',
      'Highway Engineering',
      'Water Resources'
    ],
    tools: ['autocad-viewer', 'structural-analyzer', 'load-calculator', 'survey-plotter'],
    problemTypes: ['structural-design', 'load-analysis', 'foundation-design', 'surveying']
  },

  CHEMICAL: {
    id: 'chemical',
    name: 'Chemical Engineering',
    icon: '🧪',
    color: '#a855f7',
    gradient: 'from-purple-500 to-pink-500',
    categories: [
      'Chemical Reaction Engineering',
      'Thermodynamics',
      'Mass Transfer',
      'Heat Transfer',
      'Process Control',
      'Fluid Mechanics',
      'Process Design',
      'Chemical Plant Design',
      'Safety & Hazards',
      'Biochemical Engineering',
      'Polymer Engineering',
      'Petroleum Refining'
    ],
    tools: ['process-simulator', 'reactor-designer', 'flow-diagram', 'calculator'],
    problemTypes: ['process-design', 'reaction-analysis', 'optimization', 'safety']
  },

  ELECTRONICS: {
    id: 'electronics',
    name: 'Electronics & Communication',
    icon: '📡',
    color: '#86efac',
    gradient: 'from-green-400 to-green-100',
    categories: [
      'Analog Electronics',
      'Digital Electronics',
      'Communication Systems',
      'Microprocessors',
      'Embedded Systems',
      'VLSI Design',
      'Antenna Design',
      'Signal Processing',
      'Wireless Communication',
      'Fiber Optics',
      'RF Engineering',
      'IoT'
    ],
    tools: ['circuit-simulator', 'fpga-designer', 'spectrum-analyzer', 'pcb-designer'],
    problemTypes: ['circuit-design', 'fpga-programming', 'signal-processing', 'communication']
  },

  AEROSPACE: {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    icon: '✈️',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-500',
    categories: [
      'Aerodynamics',
      'Flight Mechanics',
      'Aircraft Structures',
      'Propulsion',
      'Control Systems',
      'Avionics',
      'Spacecraft Design',
      'Orbital Mechanics',
      'Composite Materials',
      'CFD',
      'Aircraft Design',
      'Rocket Propulsion'
    ],
    tools: ['cfd-simulator', 'flight-simulator', 'cad-viewer', 'trajectory-plotter'],
    problemTypes: ['aerodynamic-design', 'trajectory-analysis', 'structural-analysis']
  },

  BIOMEDICAL: {
    id: 'biomedical',
    name: 'Biomedical Engineering',
    icon: '🏥',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-500',
    categories: [
      'Medical Devices',
      'Biomechanics',
      'Biomaterials',
      'Tissue Engineering',
      'Medical Imaging',
      'Bioinformatics',
      'Biosensors',
      'Rehabilitation Engineering',
      'Clinical Engineering',
      'Neural Engineering',
      'Drug Delivery',
      'Prosthetics'
    ],
    tools: ['signal-analyzer', 'image-processor', 'bio-simulator', 'data-analyzer'],
    problemTypes: ['device-design', 'signal-processing', 'image-analysis', 'biomechanics']
  },

  INDUSTRIAL: {
    id: 'industrial',
    name: 'Industrial Engineering',
    icon: '🏭',
    color: '#64748b',
    gradient: 'from-slate-500 to-gray-500',
    categories: [
      'Operations Research',
      'Supply Chain Management',
      'Quality Control',
      'Production Planning',
      'Ergonomics',
      'Facility Layout',
      'Work Study',
      'Six Sigma',
      'Lean Manufacturing',
      'Inventory Management',
      'Project Management',
      'Simulation'
    ],
    tools: ['optimizer', 'simulator', 'gantt-chart', 'flowchart-designer'],
    problemTypes: ['optimization', 'scheduling', 'quality-analysis', 'simulation']
  },

  // MANAGEMENT DOMAINS
  MANAGEMENT: {
    id: 'management',
    name: 'Business & Management',
    icon: '💼',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-500',
    categories: [
      'Marketing Management',
      'Financial Management',
      'Human Resource Management',
      'Operations Management',
      'Strategic Management',
      'Project Management',
      'Business Analytics',
      'Entrepreneurship',
      'Supply Chain Management',
      'Organizational Behavior',
      'Business Law',
      'International Business'
    ],
    tools: ['business-simulator', 'analytics-dashboard', 'roi-calculator', 'gantt-chart'],
    problemTypes: ['case-study', 'simulation', 'data-analysis', 'strategy']
  },

  DATA_SCIENCE: {
    id: 'data-science',
    name: 'Data Science & Analytics',
    icon: '📊',
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-500',
    categories: [
      'Statistics',
      'Machine Learning',
      'Data Mining',
      'Big Data',
      'Data Visualization',
      'Predictive Analytics',
      'Business Intelligence',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Time Series Analysis',
      'A/B Testing'
    ],
    tools: ['jupyter-notebook', 'data-visualizer', 'ml-playground', 'sql-editor'],
    problemTypes: ['data-analysis', 'ml-modeling', 'visualization', 'prediction']
  }
} as const

export type DomainId = keyof typeof DOMAINS

// Helper to get domain config
export function getDomain(id: DomainId) {
  return DOMAINS[id]
}

// Get all domains as array
export function getAllDomains() {
  return Object.values(DOMAINS)
}

// Get engineering domains
export function getEngineeringDomains() {
  return Object.values(DOMAINS).filter(d => 
    !['MANAGEMENT', 'DATA_SCIENCE'].includes(d.id.toUpperCase().replace(/-/g, '_'))
  )
}

// Get management domains
export function getManagementDomains() {
  return Object.values(DOMAINS).filter(d => 
    ['MANAGEMENT', 'DATA_SCIENCE'].includes(d.id.toUpperCase().replace(/-/g, '_'))
  )
}
