'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Download,
  MapPin,
  Mail,
  Trophy,
  Code,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const candidates = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    location: 'Bangalore, India',
    level: 15,
    xp: 15420,
    score: 94,
    rank: 1,
    streak: 45,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'NLP'],
    hackathonsJoined: 8,
    hackathonsWon: 3,
    avgScore: 91.5,
    completedChallenges: 156,
    bio: 'Passionate ML engineer with 3 years of experience in building AI solutions.',
    availability: 'Available for hire',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    email: 'rahul.v@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    location: 'Delhi, India',
    level: 12,
    xp: 11200,
    score: 91,
    rank: 2,
    streak: 32,
    skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'GraphQL'],
    hackathonsJoined: 5,
    hackathonsWon: 1,
    avgScore: 88.2,
    completedChallenges: 98,
    bio: 'Full-stack developer specializing in modern web technologies.',
    availability: 'Open to opportunities',
  },
  {
    id: '3',
    name: 'Ananya Patel',
    email: 'ananya.p@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    location: 'Mumbai, India',
    level: 10,
    xp: 8950,
    score: 88,
    rank: 3,
    streak: 28,
    skills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'Kubernetes'],
    hackathonsJoined: 6,
    hackathonsWon: 2,
    avgScore: 85.7,
    completedChallenges: 124,
    bio: 'Backend engineer with expertise in scalable distributed systems.',
    availability: 'Available for hire',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.s@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    location: 'Pune, India',
    level: 8,
    xp: 7200,
    score: 85,
    rank: 5,
    streak: 15,
    skills: ['Go', 'Kubernetes', 'Docker', 'CI/CD', 'DevOps'],
    hackathonsJoined: 4,
    hackathonsWon: 0,
    avgScore: 82.3,
    completedChallenges: 67,
    bio: 'DevOps engineer passionate about automation and infrastructure.',
    availability: 'Not looking',
  },
  {
    id: '5',
    name: 'Sneha Reddy',
    email: 'sneha.r@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    location: 'Hyderabad, India',
    level: 11,
    xp: 9800,
    score: 89,
    rank: 4,
    streak: 22,
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    hackathonsJoined: 5,
    hackathonsWon: 1,
    avgScore: 86.8,
    completedChallenges: 89,
    bio: 'Backend developer with a focus on clean architecture and performance.',
    availability: 'Open to opportunities',
  },
  {
    id: '6',
    name: 'Arjun Nair',
    email: 'arjun.n@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    location: 'Chennai, India',
    level: 9,
    xp: 8100,
    score: 83,
    rank: 8,
    streak: 18,
    skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Development', 'UI/UX'],
    hackathonsJoined: 3,
    hackathonsWon: 0,
    avgScore: 79.5,
    completedChallenges: 45,
    bio: 'Mobile developer passionate about creating beautiful cross-platform apps.',
    availability: 'Available for hire',
  },
]

const skillOptions = ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'AWS', 'Docker', 'Kubernetes']
const locationOptions = ['Bangalore', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai']
const availabilityOptions = ['Available for hire', 'Open to opportunities', 'Not looking']

export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('score')

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesLocation = location === 'all' || c.location.includes(location)
    const matchesAvailability = availability === 'all' || c.availability.includes(availability)
    const matchesSkills = skills.length === 0 || skills.some(s => c.skills.includes(s))
    return matchesSearch && matchesLocation && matchesAvailability && matchesSkills
  })

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'score': return b.score - a.score
      case 'level': return b.level - a.level
      case 'streak': return b.streak - a.streak
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">Browse and discover talented developers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">2,847</p>
              <p className="text-xs text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold">1,234</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold">892</p>
              <p className="text-xs text-muted-foreground">Hackathon Winners</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">78%</p>
              <p className="text-xs text-muted-foreground">Avg. Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Skills Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    Skills
                    {skills.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                        {skills.length}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {skillOptions.map((skill) => (
                    <DropdownMenuCheckboxItem
                      key={skill}
                      checked={skills.includes(skill)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSkills([...skills, skill])
                        } else {
                          setSkills(skills.filter(s => s !== skill))
                        }
                      }}
                    >
                      {skill}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Location */}
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Availability */}
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Availability</SelectItem>
                  {availabilityOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Highest Score</SelectItem>
                  <SelectItem value="level">Level</SelectItem>
                  <SelectItem value="streak">Streak</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(skills.length > 0 || location !== 'all' || availability !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSkills([])
                    setLocation('all')
                    setAvailability('all')
                  }}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Skills:</span>
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => setSkills(skills.filter(s => s !== skill))}
                >
                  {skill}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedCandidates.length} of {candidates.length} candidates
        </p>
      </div>

      {/* Candidates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedCandidates.map((candidate, i) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background">
                      {candidate.rank}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/corporate/candidates/${candidate.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors truncate">
                        {candidate.name}
                      </h3>
                    </Link>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {candidate.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={candidate.availability === 'Available for hire' ? 'default' : 'secondary'} className="text-xs">
                        {candidate.availability}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {candidate.bio}
                </p>

                {/* Skills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{candidate.level}</p>
                    <p className="text-[10px] text-muted-foreground">Level</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">{candidate.score}%</p>
                    <p className="text-[10px] text-muted-foreground">Score</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{candidate.streak}</p>
                    <p className="text-[10px] text-muted-foreground">Streak</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-500">{candidate.hackathonsWon}</p>
                    <p className="text-[10px] text-muted-foreground">Wins</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                    <Link href={`/corporate/candidates/${candidate.id}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1 gap-1">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
