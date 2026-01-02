import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Heart, Users, Star, UserCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import CharacterAvatar from './CharacterAvatar';

export default function RelationshipPanel({ relationships, npcs, onClose, onViewProfile }) {
  const getRelationshipState = (relationship) => {
    const stage = relationship?.stage || 'stranger';
    const stageInfo = {
      stranger: { label: 'Stranger', color: 'text-slate-500', bg: 'bg-slate-700' },
      acquaintance: { label: 'Acquaintance', color: 'text-blue-400', bg: 'bg-blue-500/20' },
      friend: { label: 'Friend', color: 'text-purple-400', bg: 'bg-purple-500/20' },
      close_friend: { label: 'Close Friend', color: 'text-pink-400', bg: 'bg-pink-500/20' },
      mutual_interest: { label: 'Mutual Interest', color: 'text-rose-400', bg: 'bg-rose-500/20' },
      dating: { label: 'Dating', color: 'text-rose-400', bg: 'bg-rose-500/30' },
      serious: { label: 'Serious Relationship', color: 'text-red-400', bg: 'bg-red-500/30' }
    };
    return stageInfo[stage] || stageInfo.stranger;
  };

  const sortedNpcs = [...npcs].sort((a, b) => {
    const levelA = relationships[a.id]?.friendship || relationships[a.id]?.level || 0;
    const levelB = relationships[b.id]?.friendship || relationships[b.id]?.level || 0;
    return levelB - levelA;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-md max-h-[80vh] bg-slate-900 rounded-t-3xl sm:rounded-3xl overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-medium">Relationships</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Relationships List */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {sortedNpcs.map((npc, index) => {
              const rel = relationships[npc.id] || { level: 0, friendship: 0, stage: 'stranger' };
              const state = getRelationshipState(rel);
              const displayLevel = Math.round(rel.friendship || rel.level || 0);

              return (
                <motion.div
                  key={npc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-3 border border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <CharacterAvatar characterId={npc.id} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-purple-100 truncate">{npc.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${state.bg} ${state.color}`}>
                            {state.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${displayLevel}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            />
                          </div>
                          <span className="text-sm text-purple-300 w-8 text-right">{displayLevel}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewProfile?.(npc.id);
                          }}
                          className="h-7 text-xs bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-200"
                        >
                          <UserCircle className="w-3 h-3 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-purple-300/60 mb-2">Relationship Levels:</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">0-29: Stranger</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">30-49: Acquaintance</span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">50-79: Friend</span>
              <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">80+: Close Friend</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}