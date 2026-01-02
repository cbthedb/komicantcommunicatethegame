import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, User, Heart, Zap, BookOpen } from 'lucide-react';

const APPEARANCE_OPTIONS = {
  hairStyle: ['Short', 'Long', 'Medium', 'Spiky', 'Wavy', 'Straight'],
  hairColor: ['Black', 'Brown', 'Blonde', 'Red', 'Blue', 'Purple', 'Pink', 'White'],
  eyeColor: ['Brown', 'Blue', 'Green', 'Gray', 'Amber', 'Hazel'],
  height: ['Short', 'Average', 'Tall'],
  build: ['Slim', 'Average', 'Athletic', 'Stocky']
};

const PERSONALITY_TRAITS = [
  'Shy', 'Confident', 'Awkward', 'Friendly', 
  'Mysterious', 'Energetic', 'Calm', 'Creative',
  'Serious', 'Playful', 'Kind', 'Sarcastic'
];

const BACKGROUND_OPTIONS = [
  { id: 'transfer', label: 'Transfer Student', bonus: { popularity: -10, anxiety: 20 } },
  { id: 'local', label: 'Local Student', bonus: { popularity: 10, comfort: 10 } },
  { id: 'returnee', label: 'Returnee (Studied Abroad)', bonus: { academic: 10, anxiety: 10 } }
];

export default function CustomCharacterCreator({ onComplete, onBack }) {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    name: '',
    gender: 'neutral',
    appearance: {
      hairStyle: 'Medium',
      hairColor: 'Black',
      eyeColor: 'Brown',
      height: 'Average',
      build: 'Average'
    },
    personality: [],
    background: 'local',
    stats: {
      socialDifficulty: 50
    }
  });

  const handleComplete = () => {
    const anxietyBase = character.stats.socialDifficulty;
    const bg = BACKGROUND_OPTIONS.find(b => b.id === character.background);

    onComplete({
      id: 'custom',
      name: character.name,
      japanese: '',
      appearance: character.appearance,
      description: `A ${character.background} student at Itan Private High School with ${character.appearance.hairColor.toLowerCase()} ${character.appearance.hairStyle.toLowerCase()} hair.`,
      traits: character.personality.length > 0 ? character.personality : ['New Student'],
      statModifiers: {
        anxiety: Math.min(100, anxietyBase + (bg?.bonus.anxiety || 0)),
        comfort: Math.max(0, 100 - anxietyBase + (bg?.bonus.comfort || 0)),
        popularity: 20 + (bg?.bonus.popularity || 0),
        academic: 50 + (bg?.bonus.academic || 0)
      },
      color: 'from-emerald-400 to-teal-400',
      isCustom: true,
      gender: character.gender,
      background: character.background
    });
  };

  const toggleTrait = (trait) => {
    setCharacter(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : prev.personality.length < 4 ? [...prev.personality, trait] : prev.personality
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Card className="p-6 bg-slate-800/70 backdrop-blur-sm border-slate-700">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                    s <= step ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-purple-300 text-center">
              Step {step} of 4
            </p>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-100 mb-2">Basic Information</h2>
                <p className="text-sm text-purple-300/70">Tell us about yourself</p>
              </div>

              <div>
                <Label className="text-purple-200 mb-2 block">Full Name</Label>
                <Input
                  placeholder="Enter your name..."
                  value={character.name}
                  onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-900/50 border-slate-600 text-purple-100"
                />
              </div>

              <div>
                <Label className="text-purple-200 mb-3 block">Gender</Label>
                <RadioGroup
                  value={character.gender}
                  onValueChange={(v) => setCharacter(prev => ({ ...prev, gender: v }))}
                  className="flex gap-4"
                >
                  {['male', 'female', 'neutral'].map(g => (
                    <div key={g} className="flex items-center space-x-2">
                      <RadioGroupItem value={g} id={g} />
                      <Label htmlFor={g} className="capitalize text-purple-200">{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-purple-200 mb-3 block">Background</Label>
                <div className="space-y-2">
                  {BACKGROUND_OPTIONS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setCharacter(prev => ({ ...prev, background: bg.id }))}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        character.background === bg.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-600 bg-slate-900/30 hover:border-purple-500/50'
                      }`}
                    >
                      <p className="font-medium text-purple-100">{bg.label}</p>
                      <p className="text-xs text-purple-300/60 mt-1">
                        {Object.entries(bg.bonus).map(([stat, val]) => 
                          `${val > 0 ? '+' : ''}${val} ${stat}`
                        ).join(', ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Appearance */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Palette className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-100 mb-2">Appearance</h2>
                <p className="text-sm text-purple-300/70">Customize your look</p>
              </div>

              {Object.entries(APPEARANCE_OPTIONS).map(([key, options]) => (
                <div key={key}>
                  <Label className="text-purple-200 mb-2 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                      <button
                        key={option}
                        onClick={() => setCharacter(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, [key]: option }
                        }))}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          character.appearance[key] === option
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-purple-300 hover:bg-slate-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Personality */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-100 mb-2">Personality</h2>
                <p className="text-sm text-purple-300/70">Choose up to 4 traits</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TRAITS.map(trait => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      character.personality.includes(trait)
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : 'bg-slate-700 text-purple-300 hover:bg-slate-600'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-purple-200 mb-2">Selected Traits:</p>
                <div className="flex flex-wrap gap-2">
                  {character.personality.length > 0 ? (
                    character.personality.map(trait => (
                      <span key={trait} className="text-xs px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full">
                        {trait}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-purple-400/60">No traits selected yet</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Stats */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Zap className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-100 mb-2">Social Skills</h2>
                <p className="text-sm text-purple-300/70">How comfortable are you socially?</p>
              </div>

              <div>
                <Label className="text-purple-200 mb-3 block">
                  Social Difficulty: {character.stats.socialDifficulty}%
                </Label>
                <Slider
                  value={[character.stats.socialDifficulty]}
                  onValueChange={([v]) => setCharacter(prev => ({
                    ...prev,
                    stats: { ...prev.stats, socialDifficulty: v }
                  }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400/60 mt-2">
                  <span>Social Butterfly</span>
                  <span>Extreme Anxiety</span>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-purple-200 mb-3">Resulting Stats:</h3>
                <StatPreview label="Starting Anxiety" value={character.stats.socialDifficulty} />
                <StatPreview label="Starting Comfort" value={100 - character.stats.socialDifficulty} />
                <StatPreview label="Popularity" value={20} />
                <StatPreview label="Academic" value={50} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => step === 1 ? onBack() : setStep(step - 1)}
              className="border-slate-600 text-purple-300 hover:bg-slate-700"
            >
              Back
            </Button>
            <Button
              onClick={() => step === 4 ? handleComplete() : setStep(step + 1)}
              disabled={step === 1 && !character.name.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {step === 4 ? 'Create Character' : 'Next'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function StatPreview({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-purple-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm text-purple-100 w-8">{value}</span>
      </div>
    </div>
  );
}