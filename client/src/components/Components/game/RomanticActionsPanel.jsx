import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Heart, Gift, MessageCircle, Coffee, Film, Users, Sparkles, Target, Home } from 'lucide-react';
import { getAvailableRomanticActions } from './enhancedRomanceSystem';
import CharacterAvatar from './CharacterAvatar';

const ACTION_ICONS = {
  compliment: Sparkles,
  spend_time: Users,
  walk_home: Home,
  exchange_messages: MessageCircle,
  small_gift: Gift,
  cafe_date: Coffee,
  movie_date: Film,
  study_together: Users,
  hold_hands: Heart,
  deep_talk: MessageCircle,
  nice_gift: Gift,
  meet_parents: Users,
  plan_future: Target,
  resolve_conflict: Users,
  ask_out: Heart
};

export default function RomanticActionsPanel({ 
  relationship, 
  npc, 
  gameState,
  onAction, 
  onClose 
}) {
  const [confirming, setConfirming] = useState(null);
  const availableActions = getAvailableRomanticActions(relationship, gameState);

  const handleAction = (action) => {
    if (action.id === 'ask_out') {
      setConfirming(action);
    } else {
      onAction(action);
    }
  };

  const confirmAskOut = () => {
    onAction(confirming);
    setConfirming(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CharacterAvatar characterId={npc.id} size="md" />
            <div>
              <h3 className="text-lg font-semibold text-purple-100">Romantic Actions</h3>
              <p className="text-sm text-purple-300/70">{npc.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Relationship Info */}
        <Card className="bg-slate-900/50 border-slate-700 p-4 mb-4">
          <div className="space-y-2">
            <RelationshipStat label="Friendship" value={relationship.friendship} color="emerald" />
            <RelationshipStat label="Trust" value={relationship.trust} color="blue" />
            <RelationshipStat label="Romantic Interest" value={relationship.romanticInterest} color="rose" />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-xs text-purple-300/70 text-center">
              Stage: <span className="text-purple-300 font-medium">{relationship.stage.replace('_', ' ')}</span>
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          {availableActions.length === 0 ? (
            <p className="text-purple-300/60 text-sm text-center py-4">
              Build a closer friendship first to unlock romantic actions.
            </p>
          ) : (
            availableActions.map((action) => {
              const Icon = ACTION_ICONS[action.id] || Heart;
              const canAfford = !action.money || gameState.money >= Math.abs(action.money);
              const hasEnergy = gameState.stats.energy >= Math.abs(action.energy || 0);
              const meetsRequirements = !action.requiresTrust || relationship.trust >= action.requiresTrust;
              const isAvailable = canAfford && hasEnergy && meetsRequirements;

              return (
                <motion.div
                  key={action.id}
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  whileTap={isAvailable ? { scale: 0.98 } : {}}
                >
                  <Card
                    className={`p-3 cursor-pointer transition-all ${
                      isAvailable
                        ? 'bg-slate-700/50 hover:bg-slate-700/70 border-slate-600'
                        : 'bg-slate-800/30 border-slate-700/50 opacity-50 cursor-not-allowed'
                    } ${action.special ? 'border-rose-500/50' : ''}`}
                    onClick={() => isAvailable && handleAction(action)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${
                        action.special ? 'bg-gradient-to-br from-rose-500 to-pink-500' : 'bg-purple-500/20'
                      } flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${action.special ? 'text-white' : 'text-purple-300'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-purple-100 text-sm">{action.label}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {action.energy && (
                            <span className="text-xs text-amber-400">⚡ {action.energy}</span>
                          )}
                          {action.money && (
                            <span className="text-xs text-green-400">💰 ${Math.abs(action.money)}</span>
                          )}
                          {action.successChance !== undefined && (
                            <span className="text-xs text-rose-300">
                              {Math.round(action.successChance)}% success
                            </span>
                          )}
                        </div>
                        {!meetsRequirements && (
                          <p className="text-xs text-red-400 mt-1">Requires {action.requiresTrust} trust</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Recent Memories */}
        {relationship.memories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-purple-300/70 mb-2">Recent Memories</p>
            <div className="space-y-1">
              {relationship.memories.slice(-3).reverse().map((mem, idx) => (
                <p key={idx} className={`text-xs px-2 py-1 rounded ${
                  mem.sentiment === 'positive' ? 'bg-green-500/10 text-green-300' :
                  mem.sentiment === 'negative' ? 'bg-red-500/10 text-red-300' :
                  'bg-slate-700/30 text-purple-300/70'
                }`}>
                  {mem.text}
                </p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Ask Out Confirmation */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirming(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-xl p-6 max-w-sm w-full border border-rose-500/50"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-100 text-center mb-2">
                Ask {npc.name} Out?
              </h3>
              <p className="text-sm text-purple-300/70 text-center mb-4">
                Success chance: {Math.round(confirming.successChance)}%
              </p>
              <p className="text-xs text-purple-300/60 text-center mb-6">
                This is a big moment. Are you ready?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirming(null)}
                  className="flex-1 border-slate-600 text-purple-300 hover:bg-slate-700"
                >
                  Not Yet
                </Button>
                <Button
                  onClick={confirmAskOut}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  Confess
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RelationshipStat({ label, value, color }) {
  const colorClasses = {
    emerald: 'bg-emerald-400',
    blue: 'bg-blue-400',
    rose: 'bg-rose-400'
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-purple-300/70">{label}</span>
        <span className="text-purple-100">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}