'use client';

import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  ShieldAlert,
  Cpu,
  Database,
  Globe,
  Server,
  Terminal,
  Lock,
  Zap,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const systemVitals = [
    { label: 'CPU_LOAD', value: '42%', status: 'nominal', color: 'text-foreground/80' },
    { label: 'MEMORY_USAGE', value: '8.4GB', status: 'optimal', color: 'text-primary/80' },
    { label: 'NET_THROUGHPUT', value: '1.2GB/s', status: 'peak', color: 'text-purple-500' },
    { label: 'LATENCY_GLOBAL', value: '24ms', status: 'ultra-low', color: 'text-foreground/80' },
  ];

  return (
    <div className="space-y-12 pb-32 font-mono">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
            SYS_MASTER <span className="text-red-600 ai-glow">ONLINE</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest max-w-xl leading-relaxed">
            Centralized Command for BLUELEARNERHUB Global Infrastructure. Monitoring 1.2M Concurrent User Vectors.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-card border border-border text-white hover:bg-secondary h-14 px-8 font-black italic tracking-tight uppercase">
            SECURITY_LOGS
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white h-14 px-10 font-black italic tracking-widest uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            INIT_MAINTENANCE_MODE
          </Button>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total_Users_Live', value: '12,456', change: '+12.4%', icon: Users, color: 'text-primary/80' },
          { label: 'Course_Engagements', value: '842,001', change: '+8.2%', icon: BookOpen, color: 'text-purple-500' },
          { label: 'Hackathons_Hosted', value: '1,248', change: '+15.1%', icon: Trophy, color: 'text-foreground/80' },
          { label: 'Total_XP_Awarded', value: '4.2M', change: '+22.4%', icon: Zap, color: 'text-foreground/80' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-background/60 border-slate-900 hover:border-red-600/30 transition-all p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{metric.label}</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-white">{metric.value}</span>
                <span className={`text-[10px] font-black ${metric.color} italic mb-1`}>{metric.change}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time System Vitals */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
            <Activity className="w-5 h-5 text-red-600" /> INFRASTRUCTURE_PULSE_v4.2.1
          </h3>
          <Card className="bg-background/40 border border-slate-900 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {systemVitals.map(vital => (
              <div key={vital.label} className="space-y-4">
                <p className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">{vital.label}</p>
                <p className={`text-2xl font-black ${vital.color}`}>{vital.value}</p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase">{vital.status}</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Theoretical Network Map / Server Clusters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'EDGE_01_MUNICH', status: 'Online', load: '12%' },
              { name: 'EDGE_02_BANGALORE', status: 'Online', load: '65%' },
              { name: 'EDGE_03_NYC', status: 'Online', load: '24%' }
            ].map(edge => (
              <div key={edge.name} className="p-4 bg-background border border-slate-900 rounded-xl space-y-3 hover:border-red-600/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <Globe className="w-3.5 h-3.5 text-primary/80" />
                  <span className="text-[8px] font-black text-foreground/80 uppercase">{edge.status}</span>
                </div>
                <p className="text-[9px] font-black text-white uppercase">{edge.name}</p>
                <div className="w-full bg-card h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-1000" style={{ width: edge.load }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Alerts Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600" /> SECURITY_VECTORS
          </h3>
          <Card className="bg-background border-red-600/20 p-8 space-y-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent" />
            <div className="space-y-4">
              {[
                { msg: 'Abnormal Login Origin: XYZ_882', time: '2m ago', type: 'warn' },
                { msg: 'DDoS Mitigation Level 2 Engaged', time: '14m ago', type: 'critical' },
                { msg: 'New Root Key Generated by S_01', time: '1h ago', type: 'info' }
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-4 bg-card/50 rounded-xl border border-border hover:border-red-600/30 transition-all">
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${alert.type === 'critical' ? 'text-red-500' : 'text-foreground/80'}`} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase leading-tight italic">{alert.msg}</p>
                    <p className="text-[8px] text-muted-foreground font-bold uppercase">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full h-12 bg-red-600/10 text-red-500 border border-red-600/30 font-black italic uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
              VIEW_FULL_SECURITY_STACK
            </Button>
          </Card>
        </div>
      </div>

      {/* Admin Quick Commands */}
      <div className="space-y-6">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
          <Terminal className="w-5 h-5 text-red-600" /> QUICK_COMMAND_EXECUTOR
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { n: 'SYNCHRONIZE_DB', c: 'database' },
            { n: 'CLEAR_CACHES', c: 'activity' },
            { n: 'REFRESH_ASSETS', c: 'file-text' },
            { n: 'VERIFY_TOKENS', c: 'shield' },
            { n: 'EXPORT_ANALYTICS', c: 'trending' }
          ].map(cmd => (
            <button key={cmd.n} className="p-4 bg-slate-900/40 border border-border rounded-xl text-center space-y-2 hover:bg-card transition-all hover:border-red-600/20">
              <p className="text-[9px] font-black text-white uppercase italic tracking-tighter">{cmd.n}</p>
              <ChevronRight className="w-3 h-3 text-red-500 mx-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
