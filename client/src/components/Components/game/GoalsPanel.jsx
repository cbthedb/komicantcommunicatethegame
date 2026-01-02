import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, CheckCircle2, Circle } from 'lucide-react';

const GOALS = [
  { id: 'make_friend', label: 'Make your first friend', check: (gs) => Object.values(gs.relationships).some(r => r.level >= 50) },
  { id: 'make_5_friends', label: 'Make 5 friends', check: (gs) => Object.values(gs.relationships).filter(r => r.level >= 50).length >= 5 },
  { id: 'confess', label: 'Confess to someone', check: (gs) => gs.storyFlags.includes('confessed_feelings') },
  { id: 'start_dating', label: 'Start dating someone', check: (gs) => gs.romanceStatus === 'dating' },
  { id: 'join_club', label: 'Join a club', check: (gs) => !!gs.currentClub },
  { id: 'high_academic', label: 'Reach 80+ academic stat', check: (gs) => gs.stats.academic >= 80 },
  { id: 'high_popularity', label: 'Reach 80+ popularity', check: (gs) => gs.stats.popularity >= 80 },
  { id: 'manage_anxiety', label: 'Lower anxiety below 30', check: (gs) => gs.stats.anxiety < 30 },
  { id: 'survive_week', label: 'Survive your first week', check: (gs) => gs.day >= 7 },
  { id: 'reach_day_20', label: 'Reach day 20', check: (gs) => gs.day >= 20 }
];

export default function GoalsPanel({ gameState, onClose }) {
  const completedGoals = GOALS.filter(goal => goal.check(gameState));
  const progress = Math.round((completedGoals.length / GOALS.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-purple-100">Goals</h2>
            <p className="text-sm text-purple-300/60">{completedGoals.length}/{GOALS.length} completed ({progress}%)</p>
          </div>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          {GOALS.map((goal) => {
            const completed = goal.check(gameState);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border transition-all ${
                  completed
                    ? 'bg-purple-500/20 border-purple-500'
                    : 'bg-slate-900/50 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${completed ? 'text-purple-100' : 'text-purple-300/80'}`}>
                    {goal.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}