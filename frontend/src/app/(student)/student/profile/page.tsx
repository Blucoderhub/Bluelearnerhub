'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AvatarEditor } from '@/components/avatar/AvatarEditor'
import { AvatarConfig } from '@/utils/generateAvatar'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { User, Shield, Bell, CreditCard } from 'lucide-react'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()

  const handleSaveAvatar = async (config: AvatarConfig) => {
    try {
      await api.post('/avatar/save', { config })
      await refreshUser()
    } catch (error) {
      console.error('Failed to save avatar:', error)
      throw error
    }
  }

  if (!user) return null

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase"
          >
            User_Profile
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-mono text-xs uppercase tracking-[0.3em]"
          >
            Terminal ID: {user.id} // System Status: Active
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-2 bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl">
            <nav className="space-y-1">
              {[
                { name: 'Avatar Customization', icon: User, active: true },
                { name: 'Account Security', icon: Shield },
                { name: 'Notifications', icon: Bell },
                { name: 'Subscription', icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    item.active 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <h4 className="text-sm font-bold uppercase tracking-tight mb-2">Pro Member</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have access to elite avatar styles and exclusive platform features.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AvatarEditor 
              username={user.fullName || user.email.split('@')[0]} 
              initialConfig={user.avatarConfig}
              onSave={handleSaveAvatar}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
