import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Save, Trash2, Calendar, User } from 'lucide-react';

const SAVE_SLOTS = 3;
const SAVE_PREFIX = 'komi_save_slot_';

export default function SaveManager({ onLoadSave, onClose }) {
  const [saves, setSaves] = useState([]);

  useEffect(() => {
    loadAllSaves();
  }, []);

  const loadAllSaves = () => {
    const loadedSaves = [];
    for (let i = 0; i < SAVE_SLOTS; i++) {
      const saveData = localStorage.getItem(`${SAVE_PREFIX}${i}`);
      if (saveData) {
        try {
          loadedSaves.push({ slot: i, data: JSON.parse(saveData) });
        } catch (e) {
          loadedSaves.push({ slot: i, data: null });
        }
      } else {
        loadedSaves.push({ slot: i, data: null });
      }
    }
    setSaves(loadedSaves);
  };

  const handleLoad = (slot) => {
    onLoadSave(slot);
  };

  const handleDelete = (slot) => {
    if (confirm('Are you sure you want to delete this save?')) {
      localStorage.removeItem(`${SAVE_PREFIX}${slot}`);
      loadAllSaves();
    }
  };

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
          <h2 className="text-2xl font-bold text-purple-100">Load Game</h2>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {saves.map((save) => (
            <Card
              key={save.slot}
              className={`p-4 ${
                save.data
                  ? 'bg-slate-900/50 border-slate-700 hover:border-purple-500'
                  : 'bg-slate-900/30 border-slate-700/50'
              } transition-all`}
            >
              {save.data ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-100">{save.data.player?.name}</p>
                        <p className="text-xs text-purple-400/60">
                          Slot {save.slot + 1}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(save.slot)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-purple-300/70 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Day {save.data.day}
                    </span>
                    <span>Friends: {Object.values(save.data.relationships || {}).filter(r => r.level >= 50).length}</span>
                  </div>

                  <Button
                    onClick={() => handleLoad(save.slot)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Load Save
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Save className="w-8 h-8 text-purple-400/30 mx-auto mb-2" />
                  <p className="text-purple-400/50 text-sm">Empty Slot {save.slot + 1}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export { SAVE_PREFIX, SAVE_SLOTS };