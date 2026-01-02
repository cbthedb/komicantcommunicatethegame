import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Heart, BookOpen, Coffee, Star } from 'lucide-react';

const LOADING_STEPS = [
  { label: 'Loading characters...', icon: Users, duration: 3000 },
  { label: 'Preparing school locations...', icon: BookOpen, duration: 4000 },
  { label: 'Generating events...', icon: Sparkles, duration: 5000 },
  { label: 'Initializing relationships...', icon: Heart, duration: 4000 },
  { label: 'Setting up shops...', icon: Coffee, duration: 3000 },
  { label: 'Polishing memories...', icon: Star, duration: 4000 },
  { label: 'Almost ready...', icon: Sparkles, duration: 7000 }
];

export default function LoadingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 30000;
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    let stepTimer;
    const scheduleNextStep = (stepIndex) => {
      if (stepIndex < LOADING_STEPS.length) {
        stepTimer = setTimeout(() => {
          setCurrentStep(stepIndex);
          scheduleNextStep(stepIndex + 1);
        }, LOADING_STEPS[stepIndex].duration);
      }
    };

    scheduleNextStep(0);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimer);
    };
  }, [onComplete]);

  const CurrentIcon = LOADING_STEPS[currentStep]?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 mb-4">
          Komi Can't Communicate
        </h1>
        <p className="text-purple-300/70 text-xl font-light">Itan High</p>
      </motion.div>

      <div className="w-full max-w-md z-10">
        {/* Loading Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <CurrentIcon className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="relative mb-6">
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-400 shadow-lg shadow-pink-400/50"
            style={{ left: `${progress}%` }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-purple-200/90 font-light"
          >
            {LOADING_STEPS[currentStep]?.label}
          </motion.p>
        </AnimatePresence>

        <p className="text-center text-purple-300/50 text-sm mt-4">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center z-10"
      >
        <p className="text-purple-400/40 text-xs">
          A life simulation game inspired by Komi Can't Communicate
        </p>
      </motion.div>
    </div>
  );
}