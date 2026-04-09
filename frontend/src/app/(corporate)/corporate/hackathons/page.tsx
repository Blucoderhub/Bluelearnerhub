'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Trophy,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Download,
  Clock,
  Code,
  MoreHorizontal,
  MapPin,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const hackathons = [
  {
    id: '1',
    title: 'AI Innovators Challenge 2026',
    description: 'Build innovative AI solutions for real-world problems using cutting-edge machine learning technologies.',
    status: 'active',
    participants: 342,
    submissions: 89,
    prize: '$10,000',
    startDate: '2026-03-15',
    endDate: '2026-04-05',
    location: 'Online',
    domain: 'AI/ML',
    difficulty: 'Advanced',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Green Tech Sustainability',
    description: 'Create solutions that address environmental challenges and promote sustainable practices.',
    status: 'upcoming',
    participants: 156,
    submissions: 0,
    prize: '$5,000',
    startDate: '2026-04-10',
    endDate: '2026-04-25',
    location: 'Hybrid',
    domain: 'Sustainability',
    difficulty: 'Intermediate',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'FinTech Revolution',
    description: 'Revolutionize the financial industry with innovative payment and banking solutions.',
    status: 'completed',
    participants: 523,
    submissions: 156,
    prize: '$15,000',
    startDate: '2026-02-01',
    endDate: '2026-02-20',
    location: 'Online',
    domain: 'FinTech',
    difficulty: 'Advanced',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
  },
  {
    id: '4',
    title: 'Healthcare Innovation',
    description: 'Develop digital health solutions that improve patient care and healthcare delivery.',
    status: 'draft',
    participants: 0,
    submissions: 0,
    prize: '$8,000',
    startDate: '2026-05-01',
    endDate: '2026-05-15',
    location: 'Online',
    domain: 'HealthTech',
    difficulty: 'Intermediate',
    rating: 0,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop',
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    upcoming: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-muted text-muted-foreground',
    draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  }
  return (
    <Badge variant="outline" className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    Beginner: 'bg-green-500/10 text-green-500',
    Intermediate: 'bg-blue-500/10 text-blue-500',
    Advanced: 'bg-red-500/10 text-red-500',
  }
  return (
    <Badge className={styles[difficulty]}>
      {difficulty}
    </Badge>
  )
}

export default function HackathonsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [domainFilter] = useState('all')

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter
    const matchesDomain = domainFilter === 'all' || h.domain === domainFilter
    return matchesSearch && matchesStatus && matchesDomain
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hackathons</h1>
          <p className="text-muted-foreground">Manage your hackathons and track participation</p>
        </div>
        <Link href="/corporate/hackathons/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Hackathon
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{hackathons.length}</p>
              <p className="text-sm text-muted-foreground">Total Hackathons</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,021</p>
              <p className="text-sm text-muted-foreground">Total Participants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <Code className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">245</p>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
              <DollarSign className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">$38,000</p>
              <p className="text-sm text-muted-foreground">Total Prize Pool</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hackathons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Hackathon Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredHackathons.map((hackathon, i) => (
          <motion.div
            key={hackathon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-muted">
                <img
                  src={hackathon.image}
                  alt={hackathon.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <StatusBadge status={hackathon.status} />
                  <DifficultyBadge difficulty={hackathon.difficulty} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/corporate/hackathons/${hackathon.id}`} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardContent className="p-4">
                <Link href={`/corporate/hackathons/${hackathon.id}`}>
                  <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                    {hackathon.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {hackathon.description}
                </p>
                
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {hackathon.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    {hackathon.submissions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(hackathon.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {hackathon.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      {hackathon.rating}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                    <p className="font-semibold text-primary">{hackathon.prize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" />
                      {hackathon.location}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />
                      {hackathon.domain}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
