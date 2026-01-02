import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Upload, Heart } from 'lucide-react';

export default function TitleScreen({ onNewGame, onLoadGame, hasSave }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -20,
              opacity: 0 
            }}
            animate={{ 
              y: window.innerHeight + 20,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-8 -right-8"
          >
            <Heart className="w-8 h-8 text-purple-400 fill-purple-500/20" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-purple-100 mb-2">
            古見さんは
          </h1>
          <h2 className="text-3xl md:text-5xl font-extralight text-purple-200 mb-4">
            コミュ症です
          </h2>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-4" />
          <p className="text-lg md:text-xl text-purple-300 font-light tracking-widest">
            ITAN HIGH LIFE SIM
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <Button
          onClick={onNewGame}
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          <span className="text-lg font-light tracking-wide">New Game</span>
        </Button>

        {hasSave && (
          <Button
            onClick={onLoadGame}
            variant="outline"
            className="w-full h-14 border-2 border-purple-500 text-purple-300 hover:bg-purple-950/50 rounded-full transition-all duration-300 hover:scale-105"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span className="text-lg font-light tracking-wide">Continue</span>
          </Button>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-sm text-purple-400/60 font-light"
      >
        A BitLife-style social simulation
      </motion.p>
    </div>
  );
}