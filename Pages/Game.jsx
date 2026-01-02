import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterSelect from '@/components/game/CharacterSelect';
import MainGame from '@/components/game/MainGame';
import TitleScreen from '@/components/game/TitleScreen';
import EndingScreen from '@/components/game/EndingScreen';
import SaveManager, { SAVE_PREFIX } from '@/components/game/SaveManager';
import LoadingScreen from '@/components/game/LoadingScreen';

const initialGameState = {
player: null,
day: 1,
timeSlot: 'morning',
stats: {
  anxiety: 50,
  comfort: 50,
  energy: 100,
  popularity: 10,
  academic: 50
},
money: 1000,
inventory: {},
relationships: {},
storyFlags: [],
friendCount: 0,
romanceTarget: null,
romanceLevel: 0,
romanceStatus: 'none',
currentClub: null,
clubMemberships: []
};

export default function Game() {
  const [screen, setScreen] = useState('loading');
  const [gameState, setGameState] = useState(initialGameState);
  const [hasSave, setHasSave] = useState(false);
  const [currentSaveSlot, setCurrentSaveSlot] = useState(0);
  const [showSaveManager, setShowSaveManager] = useState(false);

  useEffect(() => {
    // Check if any save exists
    let foundSave = false;
    for (let i = 0; i < 3; i++) {
      if (localStorage.getItem(`${SAVE_PREFIX}${i}`)) {
        foundSave = true;
        break;
      }
    }
    setHasSave(foundSave);
  }, []);

  const saveGame = useCallback((state, slot = currentSaveSlot) => {
    localStorage.setItem(`${SAVE_PREFIX}${slot}`, JSON.stringify({
      ...state,
      savedAt: new Date().toISOString()
    }));
    setCurrentSaveSlot(slot);
  }, [currentSaveSlot]);

  const loadGame = useCallback(() => {
    setShowSaveManager(true);
  }, []);

  const handleLoadSave = useCallback((slot) => {
    const saved = localStorage.getItem(`${SAVE_PREFIX}${slot}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setGameState(parsed);
      setCurrentSaveSlot(slot);
      setScreen('game');
      setShowSaveManager(false);
    }
  }, []);

  const newGame = () => {
    setGameState(initialGameState);
    setScreen('character-select');
  };

  const startGame = (player, slot = 0) => {
    const newState = {
      ...initialGameState,
      player,
      stats: {
        ...initialGameState.stats,
        ...player.statModifiers
      }
    };
    setGameState(newState);
    setCurrentSaveSlot(slot);
    saveGame(newState, slot);
    setScreen('game');
  };

  const updateGameState = (updates) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      saveGame(newState);
      return newState;
    });
  };

  const triggerEnding = (endingType) => {
    setGameState(prev => ({ ...prev, ending: endingType }));
    setScreen('ending');
  };

  const returnToTitle = () => {
    setScreen('title');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <AnimatePresence mode="wait">
        {screen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen onComplete={() => setScreen('title')} />
          </motion.div>
        )}

        {screen === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TitleScreen 
              onNewGame={newGame} 
              onLoadGame={loadGame}
              hasSave={hasSave}
            />
          </motion.div>
        )}

        {screen === 'character-select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <CharacterSelect onSelect={startGame} onBack={() => setScreen('title')} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MainGame 
              gameState={gameState}
              updateGameState={updateGameState}
              triggerEnding={triggerEnding}
              saveGame={() => saveGame(gameState, currentSaveSlot)}
            />
          </motion.div>
        )}

        {screen === 'ending' && (
          <motion.div
            key="ending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <EndingScreen 
              gameState={gameState}
              onReturnToTitle={returnToTitle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Manager */}
      <AnimatePresence>
        {showSaveManager && (
          <SaveManager 
            onLoadSave={handleLoadSave}
            onClose={() => setShowSaveManager(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}