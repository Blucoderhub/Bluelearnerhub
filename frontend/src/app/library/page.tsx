'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Code2, 
  Layers, 
  CircuitBoard, 
  Building, 
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const domains = [
  {
    name: 'Computer Science',
    slug: 'computer-science',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Master programming, algorithms, data structures, and cutting-edge technologies.',
    topics: ['Python', 'JavaScript', 'Data Structures', 'Algorithms', 'Web Development', 'Machine Learning'],
    lessons: 245,
    cardClass: 'domain-card-cs'
  },
  {
    name: 'Mechanical',
    slug: 'mechanical',
    icon: Layers,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    description: 'Explore thermodynamics, fluid mechanics, CAD/CAM, and manufacturing processes.',
    topics: ['Thermodynamics', 'Fluid Mechanics', 'CAD/CAM', 'Manufacturing', 'Automobile Engineering'],
    lessons: 189,
    cardClass: 'domain-card-mech'
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    icon: CircuitBoard,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    description: 'Learn circuit analysis, power systems, electronics, and signal processing.',
    topics: ['Circuit Analysis', 'Power Systems', 'Control Systems', 'Electronics', 'Signal Processing'],
    lessons: 176,
    cardClass: 'domain-card-elec'
  },
  {
    name: 'Civil',
    slug: 'civil',
    icon: Building,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    description: 'Study structural analysis, geotechnical engineering, hydraulics, and construction.',
    topics: ['Structural Analysis', 'Geotechnical', 'Hydraulics', 'Construction Management', 'Environmental'],
    lessons: 156,
    cardClass: 'domain-card-civil'
  },
  {
    name: 'Management',
    slug: 'management',
    icon: Briefcase,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Develop skills in marketing, finance, operations, HR, and business strategy.',
    topics: ['Marketing', 'Finance', 'Operations', 'HR', 'Business Strategy'],
    lessons: 198,
    cardClass: 'domain-card-mgmt'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">


      {/* Domains Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {domains.map((domain) => (
            <motion.div key={domain.slug} variants={itemVariants}>
              <Link href={`/library/${domain.slug}`}>
                <Card className={cn("domain-card group h-full cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg", domain.cardClass)}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110', domain.color)}>
                        <domain.icon className="h-7 w-7" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {domain.lessons} lessons
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
                      {domain.name}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {domain.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domain.topics.slice(0, 4).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Explore tutorials
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
