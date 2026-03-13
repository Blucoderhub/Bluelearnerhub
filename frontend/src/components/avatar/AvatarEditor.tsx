import React, { useState, useEffect } from 'react';
import { AvatarPreview } from './AvatarPreview';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '@/utils/generateAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { RefreshCw, Save, RotateCcw } from 'lucide-react';

interface AvatarEditorProps {
  initialConfig?: AvatarConfig;
  onSave: (config: AvatarConfig) => Promise<void>;
  username: string;
}

const STYLES = ['adventurer', 'avataaars', 'bottts', 'pixel-art', 'big-smile', 'croodles'];
const HAIR_TYPES = ['long', 'short', 'bob', 'curly', 'buzz', 'none'];
const EYE_TYPES = ['default', 'happy', 'wink', 'surprised', 'closed'];
const MOUTH_TYPES = ['default', 'smile', 'tongue', 'sad', 'open'];

export const AvatarEditor: React.FC<AvatarEditorProps> = ({ 
  initialConfig, 
  onSave, 
  username 
}) => {
  const [config, setConfig] = useState<AvatarConfig>(
    initialConfig || { ...DEFAULT_AVATAR_CONFIG, seed: username } as AvatarConfig
  );
  const [loading, setLoading] = useState(false);

  const updateConfig = (updates: Partial<AvatarConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleRandomize = () => {
    updateConfig({ seed: Math.random().toString(36).substring(7) });
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_AVATAR_CONFIG, seed: username } as AvatarConfig);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(config);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
      {/* Preview Section */}
      <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-black/20 rounded-2xl border border-white/5">
        <motion.div
          key={config.seed + config.style}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AvatarPreview config={config} size={240} className="shadow-[0_0_50px_rgba(var(--primary),0.15)]" />
        </motion.div>
        
        <div className="flex gap-3 w-full max-w-xs">
          <Button 
            variant="outline" 
            onClick={handleRandomize} 
            className="flex-1 h-11 border-white/10 bg-white/5 hover:bg-white/10 font-mono text-[10px] uppercase tracking-wider"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Randomize
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="h-11 border-white/10 bg-white/5 hover:bg-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Editor Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase tracking-tight font-mono">Custom_Identity</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avatar Terminal Configuration</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-mono font-bold uppercase text-white/40 ml-1">Style_Protocol</Label>
            <Select 
              onValueChange={(val) => updateConfig({ style: val })} 
              defaultValue={config.style}
            >
              <SelectTrigger className="h-11 bg-black/40 border-white/10 rounded-xl font-mono text-xs">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10 text-white font-mono">
                {STYLES.map(s => (
                  <SelectItem key={s} value={s} className="uppercase text-[10px]">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-mono font-bold uppercase text-white/40 ml-1">Identity_Seed</Label>
            <Input 
              value={config.seed}
              onChange={(e) => updateConfig({ seed: e.target.value })}
              className="h-11 bg-black/40 border-white/10 rounded-xl font-mono text-xs placeholder:text-white/10"
              placeholder="Unique identifier..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-mono font-bold uppercase text-white/40 ml-1">Base_Hue</Label>
              <Input 
                type="color"
                value={config.backgroundColor ? `#${config.backgroundColor}` : '#b6e3f4'}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="h-11 bg-black/40 border-white/10 rounded-xl p-1 overflow-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-mono font-bold uppercase text-white/40 ml-1">Scale_Factor</Label>
              <Input 
                type="number"
                min="50"
                max="150"
                value={config.scale || 100}
                onChange={(e) => updateConfig({ scale: parseInt(e.target.value) })}
                className="h-11 bg-black/40 border-white/10 rounded-xl font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full h-12 bg-primary text-primary-foreground font-mono font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all duration-300"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Update_Core_Identity
        </Button>
      </div>
    </div>
  );
};
