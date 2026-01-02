import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { NPC_CHARACTERS } from './gameData';

function getNPCData(npcId, gameState) {
  const npc = NPC_CHARACTERS.find(n => n.id === npcId);
  if (!npc) return null;

  const relationship = gameState.relationships[npcId];
  return {
    ...npc,
    relationshipLevel: relationship?.level || 0,
    relationshipState: relationship?.state || 'stranger'
  };
}

function analyzeIntent(input, npcData, gameState) {
  const lowerInput = input.toLowerCase();

  // Determine type
  let type = 'social';
  if (lowerInput.match(/(love|date|kiss|confess|romantic|feelings for)/)) type = 'romantic';
  if (lowerInput.match(/(study|homework|learn|teach)/)) type = 'academic';
  if (lowerInput.match(/(gift|buy|give|present)/)) type = 'gift';
  if (lowerInput.match(/(note|write|letter|message)/)) type = 'written';

  // Determine target
  let target = npcData ? 'specific' : 'general';
  if (lowerInput.match(/(everyone|public|class|crowd)/)) target = 'public';

  // Determine tone
  let tone = 'neutral';
  if (lowerInput.match(/(nervous|awkward|shy|hesitant)/)) tone = 'awkward';
  if (lowerInput.match(/(confident|bold|assertive)/)) tone = 'confident';
  if (lowerInput.match(/(kind|gentle|sweet|caring|thoughtful)/)) tone = 'caring';
  if (lowerInput.match(/(reckless|crazy|wild|dramatic)/)) tone = 'reckless';

  // Determine risk
  let risk = 'low';
  if (target === 'public' || type === 'romantic') risk = 'high';
  if (tone === 'reckless') risk = 'very_high';
  if (tone === 'caring' && type === 'written') risk = 'low';

  return { type, target, tone, risk };
}

function getFallbackOutcome(intent, npcData) {
  const outcomes = {
    romantic: {
      effects: { anxiety: 20, comfort: -10, energy: -10 },
      relationshipChanges: { friendship: -5, romanticInterest: 5 },
      outcome: 'Your romantic gesture was bold, but the outcome is uncertain...',
      memory: 'They tried something romantic'
    },
    gift: {
      effects: { comfort: 10, energy: -5, money: -100 },
      relationshipChanges: { friendship: 8, trust: 5 },
      outcome: 'Your thoughtful gift was well received.',
      memory: 'They gave me a gift'
    },
    written: {
      effects: { anxiety: -5, comfort: 15, energy: -3 },
      relationshipChanges: { friendship: 10, trust: 8, comfort: 10 },
      outcome: 'Your written message conveyed your feelings perfectly.',
      memory: 'They wrote me a thoughtful note'
    },
    social: {
      effects: { comfort: 8, energy: -8 },
      relationshipChanges: { friendship: 5 },
      outcome: 'You spent some time together. It was nice.',
      memory: 'We hung out together'
    }
  };

  return outcomes[intent.type] || outcomes.social;
}

export default function CustomActionDialog({ 
  event, 
  gameState, 
  onComplete, 
  onClose 
}) {
  const [customInput, setCustomInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!customInput.trim() || processing) return;

    setProcessing(true);

    // Check if there's an NPC involved
    const npcInvolved = event.choices?.[0]?.relationTarget;
    const npcData = npcInvolved ? getNPCData(npcInvolved, gameState) : null;

    // Analyze action intent
    const intent = analyzeIntent(customInput, npcData, gameState);

    try {
      // Use LLM to analyze the custom action and generate NPC response
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are simulating a social interaction in a high school life sim game based on "Komi Can't Communicate". 

    Current situation: ${event.description}

    ${npcData ? `NPC Character: ${npcData.name} - ${npcData.description}
    Personality: ${npcData.traits.join(', ')}
    Current relationship with player:
    - Friendship: ${npcData.relationshipLevel}/100
    - Stage: ${npcData.relationshipState}
    - Romance status: ${gameState.romanceTarget === npcInvolved ? 'Dating' : 'Not dating'}
    - Recent memories: ${gameState.relationships[npcInvolved]?.memories?.slice(-2).map(m => m.text).join('; ') || 'None'}

    IMPORTANT FOR KOMI:
    ${npcInvolved === 'komi' ? `- Komi has severe communication disorder and rarely speaks
    - She communicates primarily through writing, gestures, and expressions
    - Gentle, patient actions are highly valued by her
    - Rushing or pushing her causes high anxiety
    - Writing notes to her is extremely effective
    - Public declarations make her very anxious` : ''}` : ''}

    Player stats:
    - Anxiety: ${gameState.stats.anxiety}
    - Comfort: ${gameState.stats.comfort}
    - Energy: ${gameState.stats.energy}
    - Popularity: ${gameState.stats.popularity}
    - Academic: ${gameState.stats.academic}
    - Money: $${gameState.money}

    Action Intent Analysis:
    - Type: ${intent.type}
    - Target: ${intent.target}
    - Tone: ${intent.tone}
    - Risk Level: ${intent.risk}

    The player says/does: "${customInput}"

    CRITICAL: Generate a UNIQUE, CONTEXT-AWARE outcome. NOT a generic fallback!

    ${npcData ? `Generate ${npcData.name}'s response based on:
    1. Their personality traits
    2. Current relationship level
    3. Recent memories together
    4. The specific action the player took
    5. For Komi: Show communication through writing/gestures if she can't speak` : ''}

    Determine:
    1. Stat changes (anxiety, comfort, energy, popularity, academic, money) - values from -30 to +30 based on action significance
    2. Relationship dimension changes (friendship, trust, comfort, romanticInterest) - values from -25 to +25
    3. ${npcData ? `${npcData.name}'s realistic, in-character response (2-4 sentences)` : 'A detailed outcome description (2-3 sentences)'}
    4. Whether this action progresses time
    5. A memory to record about this interaction
    6. Story flags if applicable
    7. If romance-related: romantic interest change and whether to start dating

    IMPORTANT: 
    - Different actions MUST produce different outcomes
    - Consider relationship history and personality
    - Confessions require high relationship levels to succeed
    - Public vs private matters
    - Thoughtful actions > generic actions

    Respond ONLY with valid JSON matching the schema provided.`,
        response_json_schema: {
          type: 'object',
          properties: {
            stat_changes: {
              type: 'object',
              properties: {
                anxiety: { type: 'number' },
                comfort: { type: 'number' },
                energy: { type: 'number' },
                popularity: { type: 'number' },
                academic: { type: 'number' },
                money: { type: 'number' }
              }
            },
            relationship_changes: {
              type: 'object',
              properties: {
                friendship: { type: 'number' },
                trust: { type: 'number' },
                comfort: { type: 'number' },
                romanticInterest: { type: 'number' }
              }
            },
            npc_response: { type: 'string' },
            outcome: { type: 'string' },
            memory: { type: 'string' },
            progresses_time: { type: 'boolean' },
            add_flags: {
              type: 'array',
              items: { type: 'string' }
            },
            start_dating: { type: 'boolean' }
          },
          required: ['stat_changes', 'outcome', 'progresses_time', 'memory']
        }
      });

      onComplete({
        effects: result.stat_changes,
        relationshipChanges: result.relationship_changes || { friendship: result.relationship_change || 0 },
        outcome: result.outcome,
        memory: result.memory,
        progressTime: result.progresses_time,
        customAction: customInput,
        npcResponse: result.npc_response,
        addFlags: result.add_flags || [],
        startDating: result.start_dating || false,
        npcInvolved: npcInvolved
      });
    } catch (error) {
      console.error('Failed to process custom action:', error);
      // Better fallback based on intent
      const fallbackOutcome = getFallbackOutcome(intent, npcData);
      onComplete({
        effects: fallbackOutcome.effects,
        relationshipChanges: fallbackOutcome.relationshipChanges,
        outcome: fallbackOutcome.outcome,
        memory: fallbackOutcome.memory,
        progressTime: true,
        customAction: customInput
      });
    } finally {
      setProcessing(false);
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
        className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-100">Custom Action</h3>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-purple-300/80 mb-4">
          What do you do or say?
        </p>

        <Textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Type your action or response..."
          className="bg-slate-900/50 border-slate-600 text-purple-100 min-h-[100px] mb-4"
          disabled={processing}
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={processing}
            className="flex-1 border-slate-600 text-purple-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!customInput.trim() || processing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}