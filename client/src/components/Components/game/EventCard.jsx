import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, TrendingUp, TrendingDown, Minus, Pencil } from 'lucide-react';

export default function EventCard({ event, onChoice, stats, player, onCustomAction }) {
  const canSelectChoice = (choice) => {
    if (!choice.requireStat) return true;

    for (const [stat, minValue] of Object.entries(choice.requireStat)) {
      if (stats[stat] < minValue) return false;
    }
    return true;
  };

  const getEffectPreview = (effects) => {
    if (!effects) return null;

    const changes = [];
    const statNames = {
      anxiety: 'Anxiety',
      comfort: 'Comfort',
      energy: 'Energy',
      popularity: 'Popularity',
      academic: 'Academic'
    };

    for (const [stat, change] of Object.entries(effects)) {
      if (statNames[stat]) {
        changes.push({
          stat: statNames[stat],
          change,
          positive: stat === 'anxiety' ? change < 0 : change > 0
        });
      }
    }

    return changes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white shadow-xl border-0">
        {/* Event Header */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
          <motion.h2 
            className="text-2xl font-light mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {event.title}
          </motion.h2>
          <motion.p 
            className="text-white/90 font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {event.description}
          </motion.p>
        </div>

        {/* Choices */}
        <div className="p-4 space-y-3">
          {event.choices.map((choice, index) => {
            const canSelect = canSelectChoice(choice);
            const effects = getEffectPreview(choice.effects);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <button
                  onClick={() => canSelect && onChoice(choice)}
                  disabled={!canSelect}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    canSelect
                      ? 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 active:scale-[0.98]'
                      : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {!canSelect && <Lock className="w-4 h-4 text-slate-400" />}
                        <p className={`font-medium ${canSelect ? 'text-slate-800' : 'text-slate-500'}`}>
                          {choice.text}
                        </p>
                      </div>

                      {/* Effect Preview */}
                      {effects && effects.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {effects.map((effect, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                effect.positive 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {effect.positive ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {effect.stat}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Requirement hint */}
                      {!canSelect && choice.requireStat && (
                        <p className="text-xs text-slate-400 mt-2">
                          Requires: {Object.entries(choice.requireStat).map(([stat, val]) => 
                            `${stat} ${val}+`
                          ).join(', ')}
                        </p>
                      )}
                    </div>

                    {canSelect && (
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}

          {/* Custom Action Button */}
          {onCustomAction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + event.choices.length * 0.1 }}
            >
              <Button
                onClick={onCustomAction}
                variant="outline"
                className="w-full border-purple-500/50 text-purple-600 hover:bg-purple-50 mt-2"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Custom Action
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}