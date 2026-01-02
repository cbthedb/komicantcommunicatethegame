import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Star, Users, BookOpen, Sparkles, Home } from 'lucide-react';
import { ENDINGS } from './gameData';

export default function EndingScreen({ gameState, onReturnToTitle }) {
  const { ending, player, day, stats, relationships, friendCount } = gameState;
  const endingData = ENDINGS[ending] || ENDINGS.default;

  const endingIcons = {
    quiet_happy: '🌸',
    popular: '⭐',
    komi_friend: '💜',
    romantic: '💕',
    chaotic: '🎭',
    academic: '📚',
    loner: '🌙',
    default: '🏫'
  };

  const endingColors = {
    quiet_happy: 'from-pink-400 to-purple-400',
    popular: 'from-amber-400 to-orange-400',
    komi_friend: 'from-purple-500 to-pink-500',
    romantic: 'from-rose-400 to-pink-400',
    chaotic: 'from-yellow-400 to-red-400',
    academic: 'from-blue-400 to-indigo-400',
    loner: 'from-slate-400 to-purple-400',
    default: 'from-slate-400 to-blue-400'
  };

  const trueEndingsUnlocked = Object.keys(ENDINGS).filter(e => e !== 'default').length;
  const friendsMade = Object.values(relationships).filter(r => r.level >= 50).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-pink-200/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * -100],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="overflow-hidden bg-white shadow-2xl border-0">
          {/* Ending Banner */}
          <div className={`bg-gradient-to-br ${endingColors[ending] || endingColors.default} p-8 text-white text-center`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {endingIcons[ending] || '🏫'}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-light mb-2"
            >
              {endingData.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 font-light"
            >
              {endingData.description}
            </motion.p>
          </div>

          {/* Stats Summary */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-slate-800 mb-4 text-center">Your Journey</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatSummary
                icon={<Sparkles className="w-5 h-5" />}
                label="Days at Itan"
                value={day}
                color="purple"
              />
              <StatSummary
                icon={<Users className="w-5 h-5" />}
                label="Friends Made"
                value={friendsMade}
                color="pink"
              />
              <StatSummary
                icon={<Heart className="w-5 h-5" />}
                label="Final Comfort"
                value={stats.comfort}
                color="emerald"
              />
              <StatSummary
                icon={<Star className="w-5 h-5" />}
                label="Popularity"
                value={stats.popularity}
                color="amber"
              />
            </div>

            {/* Character Summary */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-3xl">
                  {player?.avatar}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{player?.name}</p>
                  <p className="text-sm text-slate-500">
                    {ending === 'default' 
                      ? 'Had a memorable school year'
                      : `Achieved: ${endingData.title}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={onReturnToTitle}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Title
              </Button>

              <p className="text-center text-xs text-slate-400">
                Try different choices to unlock all {trueEndingsUnlocked} endings!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function StatSummary({ icon, label, value, color }) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-3 border border-slate-100"
    >
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-light text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </motion.div>
  );
}