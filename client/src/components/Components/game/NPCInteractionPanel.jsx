import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Coffee, BookOpen, Gift } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import { getNPCsAtLocation } from './npcSchedules';

export default function NPCInteractionPanel({ 
  location, 
  timeSlot, 
  availableNpcs, 
  relationships,
  onClose, 
  onSelectNPC 
}) {
  const presentNPCs = getNPCsAtLocation(location, timeSlot);
  const displayNPCs = availableNpcs.filter(npc => presentNPCs.includes(npc.id));

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-100">Who do you want to talk to?</h2>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {displayNPCs.length === 0 ? (
          <p className="text-purple-300/60 text-center py-8">No one is here right now...</p>
        ) : (
          <div className="space-y-3">
            {displayNPCs.map(npc => {
              const relationship = relationships[npc.id];
              return (
                <button
                  key={npc.id}
                  onClick={() => onSelectNPC(npc.id)}
                  className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-purple-500 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <CharacterAvatar characterId={npc.id} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-100 group-hover:text-purple-300">
                        {npc.name}
                      </p>
                      <p className="text-xs text-purple-400/60">{npc.japanese}</p>
                      {relationship && (
                        <div className="mt-1">
                          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${relationship.level}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <MessageCircle className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}