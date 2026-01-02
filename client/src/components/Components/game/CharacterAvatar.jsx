import React from 'react';
import { User, Crown, Sparkles, Zap, BookOpen, Heart, Star, Flame } from 'lucide-react';

const CHARACTER_ICONS = {
  komi: Crown,
  tadano: User,
  najimi: Sparkles,
  yamai: Heart,
  nakanaka: Star,
  katai: Flame,
  onemine: Sparkles,
  otori: User,
  agari: Heart,
  ase: Zap
};

const CHARACTER_COLORS = {
  komi: 'from-purple-500 to-pink-500',
  tadano: 'from-blue-500 to-cyan-500',
  najimi: 'from-amber-500 to-orange-500',
  yamai: 'from-rose-500 to-pink-500',
  nakanaka: 'from-indigo-500 to-purple-500',
  katai: 'from-slate-600 to-slate-800',
  onemine: 'from-emerald-500 to-teal-500',
  otori: 'from-green-400 to-emerald-500',
  agari: 'from-orange-500 to-red-500',
  ase: 'from-blue-400 to-indigo-500'
};

export default function CharacterAvatar({ characterId, size = 'md', showBorder = false }) {
  const Icon = CHARACTER_ICONS[characterId] || User;
  const colorGradient = CHARACTER_COLORS[characterId] || 'from-slate-500 to-slate-700';

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <div 
      className={`
        ${sizes[size]} 
        rounded-full 
        bg-gradient-to-br ${colorGradient}
        flex items-center justify-center
        ${showBorder ? 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-slate-900' : ''}
        shadow-lg
      `}
    >
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  );
}