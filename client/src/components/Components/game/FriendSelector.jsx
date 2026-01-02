import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharacterAvatar from './CharacterAvatar';

export default function FriendSelector({ 
  availableNpcs, 
  relationships, 
  onSelect, 
  onClose, 
  title = "Choose someone to hang out with" 
}) {
  // Filter to only show NPCs with decent relationship
  const friends = availableNpcs
    .filter(npc => relationships[npc.id]?.level >= 30)
    .sort((a, b) => (relationships[b.id]?.level || 0) - (relationships[a.id]?.level || 0));

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
        className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[70vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-100">{title}</h3>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {friends.length === 0 ? (
          <p className="text-purple-300/60 text-center py-8">
            You need to make some friends first!
          </p>
        ) : (
          <div className="space-y-2">
            {friends.map((npc) => (
              <button
                key={npc.id}
                onClick={() => onSelect(npc.id)}
                className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-purple-500 transition-all flex items-center gap-3 text-left"
              >
                <CharacterAvatar characterId={npc.id} size="sm" />
                <div className="flex-1">
                  <p className="text-purple-100 font-medium">{npc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 bg-slate-700 rounded-full flex-1">
                      <div
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${relationships[npc.id]?.level || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-300/60">
                      {relationships[npc.id]?.level || 0}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}