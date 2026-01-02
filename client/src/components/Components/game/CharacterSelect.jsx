import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Users, Sparkles, Heart, BookOpen } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import CustomCharacterCreator from './CustomCharacterCreator';

const CANON_CHARACTERS = [
  {
    id: 'komi',
    name: 'Komi Shouko',
    japanese: '古見硝子',
    description: 'The beautiful, elegant girl who has severe communication disorder. Dreams of making 100 friends.',
    traits: ['Silent', 'Elegant', 'Kind', 'Anxious'],
    statModifiers: { anxiety: 80, comfort: 20, popularity: 90, academic: 85 },
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'tadano',
    name: 'Tadano Hitohito',
    japanese: '只野仁人',
    description: 'The most average guy who can read the room perfectly. Komi\'s first friend and translator.',
    traits: ['Average', 'Perceptive', 'Kind', 'Supportive'],
    statModifiers: { anxiety: 40, comfort: 60, popularity: 30, academic: 50 },
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'najimi',
    name: 'Najimi Osana',
    japanese: '長名なじみ',
    description: 'Everyone\'s childhood friend. Gender is a mystery. Knows literally everyone.',
    traits: ['Social Butterfly', 'Mischievous', 'Friendly', 'Chaotic'],
    statModifiers: { anxiety: 10, comfort: 90, popularity: 100, academic: 35 },
    color: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'yamai',
    name: 'Yamai Ren',
    japanese: '山井恋',
    description: 'Obsessed with Komi to a concerning degree. Would do anything for her goddess.',
    traits: ['Obsessive', 'Dramatic', 'Passionate', 'Yandere'],
    statModifiers: { anxiety: 60, comfort: 40, popularity: 45, academic: 55 },
    color: 'from-red-400 to-pink-400'
  },
  {
    id: 'nakanaka',
    name: 'Nakanaka Omoharu',
    japanese: '中々思春',
    description: 'Chuunibyou who believes she has dark powers sealed within. Actually quite lonely.',
    traits: ['Chuunibyou', 'Dramatic', 'Lonely', 'Imaginative'],
    statModifiers: { anxiety: 55, comfort: 45, popularity: 25, academic: 40 },
    color: 'from-indigo-400 to-purple-400'
  }
];

export default function CharacterSelect({ onSelect, onBack }) {
  const [mode, setMode] = useState('select');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleSelectCanon = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirmCanon = () => {
    if (selectedCharacter) {
      onSelect({
        ...selectedCharacter,
        isCustom: false
      });
    }
  };



  return (
    <div className="min-h-screen p-6 pb-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-light">Back</span>
      </motion.button>

      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-light text-center text-purple-100 mb-2"
          >
          Choose Your Character
          </motion.h1>
          <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-purple-300/80 font-light mb-8"
          >
          Who will you be at Itan Private High School?
          </motion.p>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={mode === 'select' ? 'default' : 'outline'}
            onClick={() => setMode('select')}
            className={`rounded-full px-6 ${mode === 'select' ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Canon Characters
          </Button>
          <Button
            variant={mode === 'custom' ? 'default' : 'outline'}
            onClick={() => setMode('custom')}
            className={`rounded-full px-6 ${mode === 'custom' ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Custom
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'select' ? (
            <motion.div
              key="canon"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {CANON_CHARACTERS.map((char, index) => (
                  <motion.div
                    key={char.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg bg-slate-800/50 border-slate-700 ${
                        selectedCharacter?.id === char.id
                          ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]'
                          : 'hover:scale-[1.01] hover:border-purple-500/50'
                      }`}
                      onClick={() => handleSelectCanon(char)}
                    >
                      <div className="mb-3 mx-auto flex justify-center">
                        <CharacterAvatar characterId={char.id} size="lg" showBorder={selectedCharacter?.id === char.id} />
                      </div>
                      <h3 className="text-lg font-medium text-center text-purple-100">{char.name}</h3>
                      <p className="text-sm text-center text-purple-300/60 mb-2">{char.japanese}</p>
                      <p className="text-sm text-purple-200/70 text-center mb-3 line-clamp-2">{char.description}</p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {char.traits.map(trait => (
                          <span
                            key={trait}
                            className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {selectedCharacter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-700 max-w-md mx-auto"
                >
                  <h3 className="text-xl font-medium text-purple-100 mb-4 text-center">
                    {selectedCharacter.name}'s Stats
                  </h3>
                  <div className="space-y-3 mb-6">
                    <StatPreview label="Anxiety" value={selectedCharacter.statModifiers.anxiety} icon={<Heart />} color="rose" />
                    <StatPreview label="Comfort" value={selectedCharacter.statModifiers.comfort} icon={<Sparkles />} color="emerald" />
                    <StatPreview label="Popularity" value={selectedCharacter.statModifiers.popularity} icon={<Users />} color="purple" />
                    <StatPreview label="Academic" value={selectedCharacter.statModifiers.academic} icon={<BookOpen />} color="blue" />
                  </div>
                  <Button
                    onClick={handleConfirmCanon}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white"
                  >
                    Start as {selectedCharacter.name}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <CustomCharacterCreator
              key="custom"
              onComplete={onSelect}
              onBack={() => setMode('select')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatPreview({ label, value, icon, color }) {
  const colorClasses = {
    rose: 'bg-rose-100 text-rose-500',
    emerald: 'bg-emerald-100 text-emerald-500',
    purple: 'bg-purple-100 text-purple-500',
    blue: 'bg-blue-100 text-blue-500'
  };

  const barColors = {
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    purple: 'bg-purple-400',
    blue: 'bg-blue-400'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-purple-300">{label}</span>
          <span className="text-purple-100 font-medium">{value}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColors[color]} rounded-full transition-all`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}