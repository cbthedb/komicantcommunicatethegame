import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, MessageCircle, Gift, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CharacterAvatar from './CharacterAvatar';
import { NPC_CHARACTERS } from './gameData';

export default function CharacterProfile({ npcId, relationship, onClose, onInteract }) {
  const npc = NPC_CHARACTERS.find(n => n.id === npcId);
  const rel = relationship || { level: 0, friendship: 0, state: 'stranger', stage: 'stranger' };
  const displayLevel = Math.round(rel.friendship || rel.level || 0);

  if (!npc) return null;

  const relationshipStages = [
    { min: 0, max: 29, label: 'Stranger', color: 'slate', description: 'You barely know each other.' },
    { min: 30, max: 49, label: 'Acquaintance', color: 'blue', description: 'You\'ve talked a few times.' },
    { min: 50, max: 79, label: 'Friend', color: 'purple', description: 'You enjoy spending time together.' },
    { min: 80, max: 100, label: 'Close Friend', color: 'pink', description: 'You share a deep bond.' }
  ];

  const currentStage = relationshipStages.find(s => displayLevel >= s.min && displayLevel <= s.max) || relationshipStages[0];
  const nextStage = relationshipStages.find(s => s.min > displayLevel);

  const bio = characterBios[npcId] || characterBios.tadano;

  const interactionOptions = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, unlockLevel: 0 },
    { id: 'hang_out', label: 'Hang Out', icon: Heart, unlockLevel: 20 },
    { id: 'give_gift', label: 'Give Gift', icon: Gift, unlockLevel: 10 },
    { id: 'deep_talk', label: 'Deep Conversation', icon: TrendingUp, unlockLevel: 50 },
    { id: 'ask_out', label: 'Ask Out', icon: Heart, unlockLevel: 100 }
  ];

  const characterBios = {
    komi: {
      fullName: 'Komi Shouko',
      age: 16,
      bio: 'The school\'s most beautiful student who suffers from extreme social anxiety. She dreams of making 100 friends but struggles to speak. She communicates mainly through writing in her notebook.',
      likes: ['Cats', 'Quiet places', 'Reading', 'Friends who understand her'],
      dislikes: ['Loud noises', 'Being the center of attention', 'Phone calls'],
      personality: 'Gentle, kind, observant, and deeply caring despite her communication difficulties.'
    },
    tadano: {
      fullName: 'Tadano Hitohito',
      age: 16,
      bio: 'A completely average student with one exceptional skill: reading the atmosphere. He was Komi\'s first friend and often acts as her interpreter.',
      likes: ['Helping others', 'Peace and quiet', 'Simple pleasures'],
      dislikes: ['Standing out', 'Unnecessary drama'],
      personality: 'Empathetic, humble, perceptive, and selfless.'
    },
    najimi: {
      fullName: 'Najimi Osana',
      age: 16,
      bio: 'The ultimate social butterfly who claims to be everyone\'s childhood friend. Their gender is unknown and they prefer to keep it that way. They know literally everyone in the school.',
      likes: ['Making friends', 'Parties', 'Gossip', 'Fun adventures'],
      dislikes: ['Boredom', 'Being alone'],
      personality: 'Chaotic, energetic, mischievous, and surprisingly insightful.'
    },
    yamai: {
      fullName: 'Yamai Ren',
      age: 16,
      bio: 'Obsessed with Komi to an extreme degree, viewing her as a goddess. She can be intense and even dangerous when it comes to protecting Komi.',
      likes: ['Komi', 'Komi-related items', 'Photographing Komi'],
      dislikes: ['Anyone getting too close to Komi', 'Being away from Komi'],
      personality: 'Passionate, dramatic, possessive, but capable of genuine friendship.'
    },
    nakanaka: {
      fullName: 'Nakanaka Omoharu',
      age: 16,
      bio: 'A chuunibyou who believes she has sealed dark powers. She speaks dramatically about curses and shadows, but deep down she\'s lonely and wants genuine friends.',
      likes: ['Anime', 'Fantasy', 'Dark aesthetics', 'Roleplaying'],
      dislikes: ['Being made fun of', 'Reality checks', 'Feeling excluded'],
      personality: 'Imaginative, dramatic, lonely, and secretly vulnerable.'
    },
    katai: {
      fullName: 'Katai Makoto',
      age: 16,
      bio: 'A large, intimidating-looking student who is actually very gentle and shy. He struggles with the same communication issues as Komi.',
      likes: ['Cute things', 'Friends', 'Being understood'],
      dislikes: ['Being feared', 'Misunderstandings'],
      personality: 'Gentle, shy, loyal, and surprisingly sensitive.'
    },
    onemine: {
      fullName: 'Onemine Nene',
      age: 17,
      bio: 'A mature, responsible upperclassman who acts as a big sister to many students. She\'s reliable and has a calming presence.',
      likes: ['Taking care of others', 'Organization', 'Responsible people'],
      dislikes: ['Irresponsibility', 'Chaos'],
      personality: 'Mature, caring, reliable, and motherly.'
    },
    otori: {
      fullName: 'Otori Kaede',
      age: 16,
      bio: 'An airheaded but incredibly kind student who moves at her own slow pace. She\'s always smiling and positive.',
      likes: ['Slow activities', 'Nature', 'Making people happy'],
      dislikes: ['Rushing', 'Stress'],
      personality: 'Airheaded, gentle, optimistic, and carefree.'
    },
    agari: {
      fullName: 'Agari Himiko',
      age: 16,
      bio: 'An extremely anxious student who has declared Najimi as her master. She\'s nervous and easily flustered but loyal.',
      likes: ['Following Najimi', 'Food', 'Feeling safe'],
      dislikes: ['Public speaking', 'Being alone', 'Unexpected situations'],
      personality: 'Anxious, loyal, submissive, but hardworking.'
    },
    ase: {
      fullName: 'Ase Shibuki',
      age: 16,
      bio: 'A student who sweats profusely when nervous. She\'s self-conscious about it but tries her best to be social.',
      likes: ['Making friends despite anxiety', 'Exercise', 'Understanding people'],
      dislikes: ['Embarrassment', 'Hot weather', 'Being stared at'],
      personality: 'Nervous, earnest, self-conscious, but determined.'
    }
  };

  const bio = characterBios[npcId] || characterBios.tadano;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${currentStage.color === 'slate' ? 'from-slate-700 to-slate-600' : currentStage.color === 'blue' ? 'from-blue-600 to-blue-500' : currentStage.color === 'purple' ? 'from-purple-600 to-purple-500' : 'from-pink-600 to-pink-500'} p-6 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <CharacterAvatar characterId={npcId} size="xl" showBorder />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{npc.name}</h2>
              <p className="text-white/80 text-sm mb-3">{bio.fullName} • Age {bio.age}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {currentStage.label}
                </span>
                <span className="text-xs text-white/60">Level {displayLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Relationship Progress */}
          <Card className="p-4 mb-4 bg-slate-800/50 border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-purple-300">Relationship Progress</span>
              <span className="text-xs text-purple-400">{displayLevel}/100</span>
            </div>
            <Progress value={displayLevel} className="h-2 mb-2" />
            <p className="text-xs text-slate-400">{currentStage.description}</p>
            {nextStage && (
              <p className="text-xs text-purple-400 mt-1">
                Next: {nextStage.label} at {nextStage.min}
              </p>
            )}
          </Card>

          {/* Bio */}
          <Card className="p-4 mb-4 bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-purple-100 mb-2">About</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{bio.bio}</p>
          </Card>

          {/* Personality */}
          <Card className="p-4 mb-4 bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-purple-100 mb-2">Personality</h3>
            <p className="text-sm text-slate-300">{bio.personality}</p>
          </Card>

          {/* Likes/Dislikes */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <h4 className="text-sm font-semibold text-emerald-300 mb-2">Likes</h4>
              <ul className="space-y-1">
                {bio.likes.map((like, i) => (
                  <li key={i} className="text-xs text-slate-300">• {like}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <h4 className="text-sm font-semibold text-rose-300 mb-2">Dislikes</h4>
              <ul className="space-y-1">
                {bio.dislikes.map((dislike, i) => (
                  <li key={i} className="text-xs text-slate-300">• {dislike}</li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Interaction Options */}
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-purple-100 mb-3">Interactions</h3>
            <div className="grid grid-cols-2 gap-3">
              {interactionOptions.map(option => {
                const Icon = option.icon;
                const unlocked = displayLevel >= option.unlockLevel;

                return (
                  <Button
                    key={option.id}
                    onClick={() => unlocked && onInteract?.(option.id)}
                    disabled={!unlocked}
                    className={`h-auto py-3 ${
                      unlocked 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{option.label}</span>
                      {!unlocked && (
                        <span className="text-[10px] text-slate-400">Lv {option.unlockLevel}</span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}