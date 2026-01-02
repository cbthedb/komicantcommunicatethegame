import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, Users, Coffee, BookOpen, Moon, 
  ArrowRight, Heart, Zap, MessageCircle, Gamepad2, Mic, Briefcase, Edit3, HelpCircle, MapPin, Utensils, CloudRain
} from 'lucide-react';

export default function ContextualActions({ 
  gameState, 
  onAction,
  onFriendSelect,
  availableNpcs 
}) {
  const { timeSlot, stats, relationships, storyFlags, currentClub, money } = gameState;

  const actions = [];

  // Evening actions
  if (timeSlot === 'evening') {
    actions.push({
      id: 'go_home',
      label: 'Go Home',
      icon: Home,
      description: 'End the day and rest',
      effects: { energy: 30, anxiety: -10 },
      color: 'from-blue-500 to-cyan-500'
    });

    const closeFriends = Object.entries(relationships)
      .filter(([_, rel]) => rel.level >= 40)
      .map(([id]) => id);

    if (closeFriends.length > 0) {
      actions.push({
        id: 'walk_home_together',
        label: 'Walk Home with Friend',
        icon: Users,
        description: 'Share the journey home together',
        effects: { energy: 20, comfort: 15, anxiety: -5 },
        needsSelection: true,
        relationChange: 10,
        color: 'from-purple-500 to-pink-500'
      });

      actions.push({
        id: 'call_friend',
        label: 'Call a Friend',
        icon: MessageCircle,
        description: 'Chat on the phone before bed',
        effects: { comfort: 10, anxiety: -8 },
        needsSelection: true,
        relationChange: 8,
        color: 'from-pink-500 to-rose-500'
      });
    }

    if (stats.energy > 30) {
      actions.push({
        id: 'study_late',
        label: 'Study Late',
        icon: BookOpen,
        description: 'Stay at school to study (costs energy)',
        effects: { academic: 15, energy: -25 },
        color: 'from-indigo-500 to-blue-500'
      });
    }

    actions.push({
      id: 'evening_study_home',
      label: 'Study at Home',
      icon: Edit3,
      description: 'Review your notes',
      effects: { academic: 12, energy: -15, anxiety: 5 },
      color: 'from-blue-500 to-indigo-500'
    });
  }

  // Afterschool actions
  if (timeSlot === 'afterschool') {
    if (currentClub) {
      actions.push({
        id: 'attend_club',
        label: 'Attend Club Meeting',
        icon: Heart,
        description: 'Participate in your club activities',
        effects: { energy: -15, popularity: 8, comfort: 12 },
        color: 'from-pink-500 to-rose-500'
      });
    }

    actions.push({
      id: 'go_to_cafe_alone',
      label: 'Visit Café (Solo)',
      icon: Coffee,
      description: 'Relax with a drink alone',
      effects: { energy: 15, comfort: 18, anxiety: -10, money: -150 },
      color: 'from-emerald-500 to-teal-500'
    });

    const goodFriends = Object.entries(relationships)
      .filter(([_, rel]) => rel.level >= 40)
      .map(([id]) => id);

    if (goodFriends.length > 0) {
      actions.push({
        id: 'cafe_with_friend',
        label: 'Café with Friend',
        icon: Coffee,
        description: 'Hang out at a café together',
        effects: { comfort: 25, energy: 12, anxiety: -12, popularity: 5, money: -200 },
        needsSelection: true,
        relationChange: 15,
        color: 'from-emerald-400 to-teal-400'
      });

      actions.push({
        id: 'arcade_hangout',
        label: 'Arcade Together',
        icon: Gamepad2,
        description: 'Play games with someone',
        effects: { comfort: 20, energy: -15, popularity: 8, money: -250 },
        needsSelection: true,
        relationChange: 18,
        color: 'from-amber-500 to-orange-500'
      });

      actions.push({
        id: 'karaoke_session',
        label: 'Karaoke',
        icon: Mic,
        description: 'Sing your heart out!',
        effects: { comfort: 25, energy: -20, anxiety: 15, popularity: 10, money: -300 },
        needsSelection: true,
        relationChange: 20,
        color: 'from-pink-500 to-purple-500'
      });
    }

    actions.push({
      id: 'part_time_job',
      label: 'Part-time Work',
      icon: Briefcase,
      description: 'Earn some money (tough work)',
      effects: { energy: -30, money: 500, academic: -5, anxiety: 10 },
      color: 'from-green-600 to-emerald-600'
    });

    actions.push({
      id: 'tutoring_job',
      label: 'Tutoring',
      icon: BookOpen,
      description: 'Teach and earn money',
      effects: { energy: -15, money: 400, academic: 5 },
      color: 'from-blue-600 to-indigo-600'
    });

    actions.push({
      id: 'explore_town',
      label: 'Explore Town',
      icon: MapPin,
      description: 'Walk around and see what happens',
      effects: { energy: -10, comfort: 12, popularity: 3 },
      color: 'from-cyan-500 to-blue-500'
    });
  }

  // Class time special actions
  if (timeSlot === 'class') {
    if (stats.energy > 30) {
      actions.push({
        id: 'focus_on_lesson',
        label: 'Focus on Lesson',
        icon: BookOpen,
        description: 'Pay attention to the teacher',
        effects: { academic: 15, energy: -10 },
        color: 'from-blue-500 to-indigo-500'
      });
    }

    if (stats.anxiety > 60) {
      actions.push({
        id: 'skip_class',
        label: 'Skip Class',
        icon: Moon,
        description: 'Hide somewhere to avoid class (risky!)',
        effects: { anxiety: -20, academic: -10, energy: 10 },
        color: 'from-slate-600 to-slate-500'
      });
    }

    const classmates = Object.entries(relationships)
      .filter(([_, rel]) => rel.level >= 20)
      .map(([id]) => id);

    if (classmates.length > 0 && stats.anxiety < 40) {
      actions.push({
        id: 'pass_note',
        label: 'Pass a Note',
        icon: MessageCircle,
        description: 'Send a secret message',
        effects: { anxiety: 8, comfort: 10 },
        needsSelection: true,
        relationChange: 8,
        color: 'from-purple-500 to-indigo-500'
      });
    }

    actions.push({
      id: 'doodle',
      label: 'Doodle',
      icon: Edit3,
      description: 'Let your mind wander',
      effects: { comfort: 12, anxiety: -8, academic: -5 },
      color: 'from-pink-500 to-purple-500'
    });

    if (stats.academic >= 60 && classmates.length > 0) {
      actions.push({
        id: 'help_classmate',
        label: 'Help Classmate',
        icon: HelpCircle,
        description: 'Explain the material to someone',
        effects: { academic: 5, popularity: 10, energy: -8 },
        needsSelection: true,
        relationChange: 12,
        color: 'from-blue-400 to-cyan-400'
      });
    }
  }

  // Lunch special actions
  if (timeSlot === 'lunch') {
    const lunchmates = Object.entries(relationships)
      .filter(([_, rel]) => rel.level >= 30)
      .map(([id]) => id);

    if (lunchmates.length > 0) {
      actions.push({
        id: 'share_lunch',
        label: 'Share Your Lunch',
        icon: Heart,
        description: 'Offer food to a friend',
        effects: { comfort: 15, popularity: 5 },
        needsSelection: true,
        relationChange: 12,
        color: 'from-rose-500 to-pink-500'
      });

      actions.push({
        id: 'eat_together',
        label: 'Eat Together',
        icon: Utensils,
        description: 'Have lunch with someone',
        effects: { comfort: 18, energy: 20, anxiety: -5 },
        needsSelection: true,
        relationChange: 10,
        color: 'from-amber-500 to-orange-500'
      });
    }

    actions.push({
      id: 'buy_snacks',
      label: 'Buy Snacks',
      icon: Coffee,
      description: 'Get something from the school store',
      effects: { energy: 20, comfort: 10, popularity: 3, money: -100 },
      color: 'from-yellow-500 to-amber-500'
    });

    actions.push({
      id: 'eat_alone_roof',
      label: 'Eat on Rooftop',
      icon: CloudRain,
      description: 'Enjoy peaceful solitude',
      effects: { comfort: 20, anxiety: -15, energy: 25 },
      color: 'from-sky-500 to-blue-500'
    });

    actions.push({
      id: 'library_lunch',
      label: 'Lunch in Library',
      icon: BookOpen,
      description: 'Read while eating',
      effects: { comfort: 15, academic: 8, energy: 18 },
      color: 'from-indigo-500 to-purple-500'
    });
  }

  if (actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h3 className="text-lg font-medium text-purple-200 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="p-4 bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group"
                onClick={() => action.needsSelection ? onFriendSelect(action) : onAction(action)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-purple-100 mb-1 flex items-center justify-between">
                      {action.label}
                      <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-slate-400 mb-2">{action.description}</p>
                    {action.effects && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(action.effects).map(([stat, value]) => (
                          <span 
                            key={stat}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              value > 0 
                                ? 'bg-emerald-500/20 text-emerald-300' 
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {value > 0 ? '+' : ''}{value} {stat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}