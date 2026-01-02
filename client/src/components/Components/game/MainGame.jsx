import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, Sparkles, Zap, Star, BookOpen, 
  Save, Menu, MapPin, Clock, Users, ChevronRight,
  MessageCircle, X, UserCircle, DollarSign, Coffee, Target, Package
} from 'lucide-react';
import { LOCATIONS, TIME_SLOTS, EVENTS, SPECIAL_EVENTS, NPC_CHARACTERS, RANDOM_DIALOGUE, ENDINGS } from './gameData';
import EventCard from './EventCard';
import RelationshipPanel from './RelationshipPanel';
import CharacterProfile from './CharacterProfile';
import CharacterAvatar from './CharacterAvatar';
import ContextualActions from './ContextualActions';
import NPCInteractionPanel from './NPCInteractionPanel';
import CustomActionDialog from './CustomActionDialog';
import GoalsPanel from './GoalsPanel';
import FriendSelector from './FriendSelector';
import MusicPlayer from './MusicPlayer';
import { CLUBS } from './clubSystem';
import { ScenarioBank } from './scenarioBank';
import { EnhancedRelationship } from './enhancedRomanceSystem';
import RomanticActionsPanel from './RomanticActionsPanel';
import ShopDialog from './ShopDialog';
import InventoryPanel from './InventoryPanel';
import { SHOPS, getItemById, calculateGiftEffect } from './ItemSystem';
import { DynamicEventGenerator } from './DynamicEventGenerator';

export default function MainGame({ gameState, updateGameState, triggerEnding, saveGame }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const [showCharacterProfile, setShowCharacterProfile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('classroom');
  const [showClubMenu, setShowClubMenu] = useState(false);
  const [showNPCInteraction, setShowNPCInteraction] = useState(false);
  const [showCustomAction, setShowCustomAction] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showRomanticActions, setShowRomanticActions] = useState(false);
  const [romanticTarget, setRomanticTarget] = useState(null);
  const [showShop, setShowShop] = useState(null);
  const [showInventory, setShowInventory] = useState(false);

  const { player, day, timeSlot, stats, relationships, storyFlags, friendCount, romanceTarget, romanceLevel, romanceStatus, currentClub, clubMemberships, money = 1000, inventory = {} } = gameState;

  // Get available NPCs (exclude player character if they selected a canon character)
  const availableNpcs = useMemo(() => {
    return NPC_CHARACTERS.filter(npc => npc.id !== player?.id);
  }, [player]);

  // Initialize enhanced relationships if needed
  useEffect(() => {
    if (Object.keys(relationships).length === 0 && availableNpcs.length > 0) {
      const initialRelationships = {};
      availableNpcs.forEach(npc => {
        const enhanced = new EnhancedRelationship(npc.id, {
          friendship: npc.baseAffinity || 0,
          trust: 20,
          comfort: 20,
          romanticInterest: 0
        });
        enhanced.updateStage();
        initialRelationships[npc.id] = enhanced.toJSON();
      });
      updateGameState({ relationships: initialRelationships });
    } else if (Object.keys(relationships).length > 0) {
      // Migrate old relationships to enhanced format
      const needsMigration = Object.values(relationships).some(rel => rel.friendship === undefined);
      if (needsMigration) {
        const migratedRelationships = {};
        Object.entries(relationships).forEach(([npcId, rel]) => {
          if (rel.friendship === undefined) {
            // Old format - migrate
            const enhanced = new EnhancedRelationship(npcId, {
              friendship: rel.level || 0,
              trust: Math.max(20, (rel.level || 0) * 0.8),
              comfort: Math.max(20, (rel.level || 0) * 0.7),
              romanticInterest: 0
            });
            enhanced.updateStage();
            migratedRelationships[npcId] = enhanced.toJSON();
          } else {
            // Already enhanced format
            migratedRelationships[npcId] = rel;
          }
        });
        updateGameState({ relationships: migratedRelationships });
      }
    }
  }, [availableNpcs, relationships, updateGameState]);

  // Get relationship-triggered events
  const getRelationshipEvent = () => {
    const highRelationships = Object.entries(relationships)
      .filter(([id, rel]) => rel.level >= 60)
      .sort((a, b) => b[1].level - a[1].level);

    if (highRelationships.length === 0) return null;

    const [npcId, rel] = highRelationships[Math.floor(Math.random() * highRelationships.length)];
    const npc = availableNpcs.find(n => n.id === npcId);
    if (!npc) return null;

    const events = [
      {
        id: `invite_dinner_${npcId}`,
        title: `${npc.name}'s Invitation`,
        description: `${npc.name} approaches you nervously. "Would you like to have dinner together after school?"`,
        choices: [
          {
            text: 'Accept happily',
            effects: { comfort: 20, anxiety: 10, energy: -10, money: -200 },
            relationTarget: npcId,
            relationChange: 15
          },
          {
            text: 'Suggest somewhere cheaper',
            effects: { comfort: 15, anxiety: 5, money: -100 },
            relationTarget: npcId,
            relationChange: 12
          },
          {
            text: 'Politely decline',
            effects: { anxiety: 5 },
            relationTarget: npcId,
            relationChange: -5
          }
        ]
      },
      {
        id: `weekend_hangout_${npcId}`,
        title: `Weekend Plans`,
        description: `${npc.name} texts you: "Are you free this weekend? Let's do something fun!"`,
        choices: [
          {
            text: 'Plan a shopping trip',
            effects: { comfort: 18, popularity: 8, money: -300 },
            relationTarget: npcId,
            relationChange: 18
          },
          {
            text: 'Movie date',
            effects: { comfort: 20, energy: 5, money: -250 },
            relationTarget: npcId,
            relationChange: 20
          },
          {
            text: 'Say you\'re busy',
            effects: { comfort: 5 },
            relationTarget: npcId,
            relationChange: -8
          }
        ]
      },
      {
        id: `heart_to_heart_${npcId}`,
        title: `Heart to Heart`,
        description: `${npc.name} looks serious. "Can we talk? There's something I want to tell you..."`,
        choices: [
          {
            text: 'Listen carefully',
            effects: { comfort: 15, anxiety: 10 },
            relationTarget: npcId,
            relationChange: 20
          },
          {
            text: 'Share your feelings too',
            effects: { comfort: 20, anxiety: 15 },
            relationTarget: npcId,
            relationChange: 25
          },
          {
            text: 'Change the subject',
            effects: { anxiety: -5, comfort: -10 },
            relationTarget: npcId,
            relationChange: -10
          }
        ]
      }
    ];

    // Romance-specific events for dating couples
    if (romanceTarget === npcId && romanceStatus === 'dating') {
      events.push({
        id: `date_night_${npcId}`,
        title: `Date Night`,
        description: `${npc.name} smiles warmly. "Want to go on a proper date tonight?"`,
        choices: [
          {
            text: 'Fancy restaurant',
            effects: { comfort: 30, anxiety: 15, energy: -15, money: -500 },
            relationTarget: npcId,
            relationChange: 25,
            romanceLevelChange: 10
          },
          {
            text: 'Casual café date',
            effects: { comfort: 25, anxiety: 5, energy: -10, money: -250 },
            relationTarget: npcId,
            relationChange: 20,
            romanceLevelChange: 8
          },
          {
            text: 'Walk in the park (free)',
            effects: { comfort: 20, anxiety: -5, energy: -5 },
            relationTarget: npcId,
            relationChange: 18,
            romanceLevelChange: 6
          }
        ]
      });
    }

    return events[Math.floor(Math.random() * events.length)];
  };

  // Check for special events
  const checkSpecialEvents = () => {
    for (const event of SPECIAL_EVENTS) {
      // Skip if already triggered and is once-only
      if (event.once && storyFlags.includes(`triggered_${event.id}`)) continue;

      let triggered = true;

      // Check day trigger
      if (event.trigger.day) {
        if (event.trigger.day.min && day < event.trigger.day.min) triggered = false;
        if (event.trigger.day.max && day > event.trigger.day.max) triggered = false;
      }

      // Check relationship trigger
      if (event.trigger.relationship) {
        const rel = relationships[event.trigger.relationship.target];
        if (!rel || rel.level < event.trigger.relationship.min) triggered = false;
      }

      // Check stat trigger
      if (event.trigger.stat) {
        for (const [stat, condition] of Object.entries(event.trigger.stat)) {
          if (condition.min && stats[stat] < condition.min) triggered = false;
          if (condition.max && stats[stat] > condition.max) triggered = false;
        }
      }

      // Check flag trigger
      if (event.trigger.flag && !storyFlags.includes(event.trigger.flag)) {
        triggered = false;
      }

      if (triggered && Math.random() < 0.3) {
        return event;
      }
    }
    return null;
  };

  // Get random event for current location/time
  const getLocationEvent = () => {
    const locationEvents = EVENTS[selectedLocation]?.[timeSlot] || [];
    if (locationEvents.length === 0) return null;

    // Filter events by specific NPC if player is that NPC
    const filteredEvents = locationEvents.filter(e => 
      !e.specificNpc || e.specificNpc !== player?.id
    );

    if (filteredEvents.length === 0) return null;
    return filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
  };

  // Handle time progression
  const progressTime = () => {
    const timeOrder = ['morning', 'class', 'lunch', 'afterschool', 'evening'];
    const currentIndex = timeOrder.indexOf(timeSlot);

    if (currentIndex === timeOrder.length - 1) {
      // End of day - check for ending conditions
      if (day >= 30) {
        checkEnding();
        return;
      }

      // New day
      updateGameState({
        day: day + 1,
        timeSlot: 'morning',
        stats: {
          ...stats,
          energy: Math.min(100, stats.energy + 30),
          anxiety: Math.max(0, stats.anxiety - 5)
        }
      });
      showNotification('A new day begins...');
    } else {
      updateGameState({ timeSlot: timeOrder[currentIndex + 1] });
    }

    setCurrentEvent(null);
  };

  // Check ending conditions
  const checkEnding = () => {
    const counted = Object.values(relationships).filter(r => r.level >= 50).length;

    for (const [id, ending] of Object.entries(ENDINGS)) {
      if (id === 'default') continue;

      let matches = true;
      const req = ending.requirement;

      if (req.friendCount) {
        if (req.friendCount.min && counted < req.friendCount.min) matches = false;
        if (req.friendCount.max && counted > req.friendCount.max) matches = false;
      }

      if (req.flag && !storyFlags.includes(req.flag)) matches = false;

      if (req.relationship) {
        const rel = relationships[req.relationship.target];
        if (!rel || rel.level < req.relationship.min) matches = false;
      }

      if (req.romanceLevel) {
        if (req.romanceLevel.min && romanceLevel < req.romanceLevel.min) matches = false;
      }

      // Check stat requirements
      for (const stat of ['anxiety', 'comfort', 'popularity', 'academic']) {
        if (req[stat]) {
          if (req[stat].min && stats[stat] < req[stat].min) matches = false;
          if (req[stat].max && stats[stat] > req[stat].max) matches = false;
        }
      }

      if (matches) {
        triggerEnding(id);
        return;
      }
    }

    triggerEnding('default');
  };

  // Handle choice selection
  const handleChoice = (choice) => {
    const newStats = { ...stats };
    const newRelationships = { ...relationships };
    const newFlags = [...storyFlags];
    let newFriendCount = friendCount;
    let newRomanceTarget = romanceTarget;
    let newRomanceLevel = romanceLevel;
    let newRomanceStatus = romanceStatus;
    let newMoney = money;

    // Apply stat effects
    if (choice.effects) {
      for (const [stat, change] of Object.entries(choice.effects)) {
        if (stat === 'money') {
          newMoney = Math.max(0, newMoney + change);
        } else if (newStats[stat] !== undefined) {
          newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + change));
        }
      }
    }

    // Apply relationship changes
    if (choice.relationTarget) {
      let targetId = choice.relationTarget;

      if (targetId === 'random') {
        const available = availableNpcs.filter(n => n.id !== player?.id);
        targetId = available[Math.floor(Math.random() * available.length)]?.id;
      }

      if (targetId && newRelationships[targetId]) {
        const oldLevel = newRelationships[targetId].level;
        newRelationships[targetId] = {
          ...newRelationships[targetId],
          level: Math.max(0, Math.min(100, oldLevel + (choice.relationChange || 0)))
        };

        // Update relationship state
        const newLevel = newRelationships[targetId].level;
        if (newLevel >= 80) {
          newRelationships[targetId].state = 'close_friend';
          if (oldLevel < 80) newFriendCount++;
        } else if (newLevel >= 50) {
          newRelationships[targetId].state = 'friend';
          if (oldLevel < 50) newFriendCount++;
        } else if (newLevel >= 30) {
          newRelationships[targetId].state = 'acquaintance';
        }

        const npc = availableNpcs.find(n => n.id === targetId);
        if (npc && choice.relationChange > 0) {
          showNotification(`${npc.name} likes you more! (+${choice.relationChange})`);
        }
      }
    }

    // Add story flags
    if (choice.addFlag) {
      if (!newFlags.includes(choice.addFlag)) {
        newFlags.push(choice.addFlag);
      }
    }

    // Handle romance progression
    if (choice.romanceLevelChange && choice.relationTarget) {
      if (!newRomanceTarget) {
        newRomanceTarget = choice.relationTarget;
        newRomanceLevel = 50;
      }
      if (newRomanceTarget === choice.relationTarget) {
        newRomanceLevel = Math.max(0, Math.min(100, newRomanceLevel + choice.romanceLevelChange));

        // Auto progress to dating at high romance
        if (newRomanceLevel >= 80 && newRomanceStatus === 'none') {
          newRomanceStatus = 'dating';
          showNotification(`You're now dating ${availableNpcs.find(n => n.id === choice.relationTarget)?.name}! ❤️`);
        }
      }
    }

    // Mark special event as triggered
    if (currentEvent?.id && SPECIAL_EVENTS.find(e => e.id === currentEvent.id)) {
      if (!newFlags.includes(`triggered_${currentEvent.id}`)) {
        newFlags.push(`triggered_${currentEvent.id}`);
      }
    }

    updateGameState({
      stats: newStats,
      relationships: newRelationships,
      storyFlags: newFlags,
      friendCount: newFriendCount,
      romanceTarget: newRomanceTarget,
      romanceLevel: newRomanceLevel,
      romanceStatus: newRomanceStatus,
      money: newMoney
    });

    progressTime();
  };

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Select location and trigger event
  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
    setShowLocationMenu(false);

    // Check for special event first
    const specialEvent = checkSpecialEvents();
    if (specialEvent) {
      setCurrentEvent(specialEvent);
      return;
    }

    // Check for relationship-triggered events (30% chance)
    if (Math.random() < 0.3) {
      const relationshipEvent = getRelationshipEvent();
      if (relationshipEvent) {
        setCurrentEvent(relationshipEvent);
        return;
      }
    }

    // Check scenario bank for contextual events
    const scenarioBank = new ScenarioBank(gameState);
    const contextualScenario = scenarioBank.selectBestScenario();
    if (contextualScenario && Math.random() < 0.4) {
      setCurrentEvent(contextualScenario);
      return;
    }

    // Check dynamic events (20% chance)
    if (Math.random() < 0.2) {
      const dynamicGenerator = new DynamicEventGenerator(gameState);
      const dynamicEvent = dynamicGenerator.selectDynamicEvent();
      if (dynamicEvent) {
        setCurrentEvent(dynamicEvent);
        return;
      }
    }

    // Get regular event
    setTimeout(() => {
      const event = getLocationEvent();
      if (event) {
        setCurrentEvent(event);
      } else {
        // No event, just pass time
        showNotification('Nothing special happened...');
        progressTime();
      }
    }, 500);
  };

  // Handle NPC interaction
  const handleNPCSelect = (npcId) => {
    setShowNPCInteraction(false);
    setShowCharacterProfile(npcId);
  };

  const handleProfileInteract = (npcId, actionId) => {
    const npc = availableNpcs.find(n => n.id === npcId);
    if (!npc) return;

    const rel = relationships[npcId];
    
    if (actionId === 'give_gift') {
      setShowCharacterProfile(null);
      setShowFriendSelector({
        type: 'gift',
        targetNpc: npcId,
        onSelect: (itemId) => {
          handleUseItem(itemId, npcId);
          setShowFriendSelector(false);
        }
      });
      return;
    }

    // Handle other interactions (chat, hang out, deep talk)
    const interactionEvents = {
      chat: {
        id: `chat_${npcId}_${Date.now()}`,
        title: `Chatting with ${npc.name}`,
        description: `You strike up a casual conversation with ${npc.name}.`,
        choices: [
          {
            text: 'Talk about school',
            effects: { energy: -5, academic: 2 },
            relationTarget: npcId,
            relationChange: 5
          },
          {
            text: 'Share a joke',
            effects: { energy: -5, comfort: 5 },
            relationTarget: npcId,
            relationChange: 7
          }
        ]
      },
      hang_out: {
        id: `hangout_${npcId}_${Date.now()}`,
        title: `Hanging out with ${npc.name}`,
        description: `You spend some quality time with ${npc.name}.`,
        choices: [
          {
            text: 'Go for a walk',
            effects: { energy: -15, comfort: 10 },
            relationTarget: npcId,
            relationChange: 12
          }
        ]
      },
      deep_talk: {
        id: `deeptalk_${npcId}_${Date.now()}`,
        title: `Deep talk with ${npc.name}`,
        description: `You and ${npc.name} share some personal thoughts and feelings.`,
        choices: [
          {
            text: 'Listen intently',
            effects: { energy: -20, trust: 15 },
            relationTarget: npcId,
            relationChange: 15
          }
        ]
      }
    };

    const event = interactionEvents[actionId];
    if (event) {
      setShowCharacterProfile(null);
      setCurrentEvent(event);
    }
  };

  // Handle item usage (gifts or consumables)
  const handleUseItem = (itemId, targetNpcId = null) => {
    const item = getItemById(itemId);
    if (!item || !inventory[itemId] || inventory[itemId] <= 0) return;

    const newInventory = { ...inventory };
    newInventory[itemId]--;
    if (newInventory[itemId] <= 0) delete newInventory[itemId];

    const updates = { inventory: newInventory };

    if (item.category === 'gift' && targetNpcId) {
      const effect = calculateGiftEffect(item, targetNpcId);
      const newRelationships = { ...relationships };
      const enhanced = EnhancedRelationship.fromJSON(newRelationships[targetNpcId]);
      
      // Apply gift effects
      if (effect.friendship) enhanced.friendship = Math.min(100, enhanced.friendship + effect.friendship);
      if (effect.trust) enhanced.trust = Math.min(100, enhanced.trust + effect.trust);
      if (effect.romanticInterest) enhanced.romanticInterest = Math.min(100, enhanced.romanticInterest + effect.romanticInterest);
      if (effect.comfort) enhanced.comfort = Math.min(100, enhanced.comfort + effect.comfort);
      
      enhanced.addMemory(`I gave them a ${item.name}.`);
      enhanced.updateStage();
      newRelationships[targetNpcId] = enhanced.toJSON();
      updates.relationships = newRelationships;
      
      showNotification(`Gave ${item.name} to ${availableNpcs.find(n => n.id === targetNpcId)?.name}!`);
    } else if (item.category === 'consumable') {
      const newStats = { ...stats };
      if (item.effects.energy) newStats.energy = Math.min(100, newStats.energy + item.effects.energy);
      if (item.effects.anxiety) newStats.anxiety = Math.max(0, newStats.anxiety + item.effects.anxiety);
      if (item.effects.comfort) newStats.comfort = Math.min(100, newStats.comfort + item.effects.comfort);
      if (item.effects.academic) newStats.academic = Math.min(100, newStats.academic + item.effects.academic);
      updates.stats = newStats;
      showNotification(`Used ${item.name}!`);
    }

    updateGameState(updates);
  };

  // Handle custom action completion
  const handleCustomActionComplete = (result) => {
    setShowCustomAction(false);

    const newStats = { ...stats };
    const newRelationships = { ...relationships };
    const newFlags = [...storyFlags];
    let newRomanceTarget = romanceTarget;
    let newRomanceLevel = romanceLevel;
    let newRomanceStatus = romanceStatus;
    let newMoney = money;

    // Apply effects
    if (result.effects) {
      for (const [stat, change] of Object.entries(result.effects)) {
        if (stat === 'money') {
          newMoney = Math.max(0, newMoney + change);
        } else if (newStats[stat] !== undefined) {
          newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + change));
        }
      }
    }

    // Apply enhanced relationship changes
    if (result.relationshipChanges && result.npcInvolved) {
      const targetId = result.npcInvolved;
      if (newRelationships[targetId]) {
        const enhanced = EnhancedRelationship.fromJSON(newRelationships[targetId]);

        // Apply changes
        for (const [dimension, change] of Object.entries(result.relationshipChanges)) {
          if (enhanced[dimension] !== undefined) {
            enhanced[dimension] = Math.max(0, Math.min(100, enhanced[dimension] + change));
          }
        }

        // Add memory
        if (result.memory) {
          enhanced.addMemory(result.memory);
        }

        enhanced.updateStage();
        newRelationships[targetId] = enhanced.toJSON();
      }
    }

    // Start dating if AI determined it
    if (result.startDating && result.npcInvolved) {
      const enhanced = EnhancedRelationship.fromJSON(newRelationships[result.npcInvolved]);
      enhanced.stage = 'dating';
      newRelationships[result.npcInvolved] = enhanced.toJSON();
      showNotification(`You're now dating ${availableNpcs.find(n => n.id === result.npcInvolved)?.name}! ❤️`);
    }

    // Add story flags
    if (result.addFlags && result.addFlags.length > 0) {
      result.addFlags.forEach(flag => {
        if (!newFlags.includes(flag)) {
          newFlags.push(flag);
        }
      });
    }

    updateGameState({
      stats: newStats,
      relationships: newRelationships,
      storyFlags: newFlags,
      romanceTarget: newRomanceTarget,
      romanceLevel: newRomanceLevel,
      romanceStatus: newRomanceStatus,
      money: newMoney
    });

    // Show NPC response if available
    if (result.npcResponse) {
      const npc = availableNpcs.find(n => n.id === result.npcInvolved);
      setTimeout(() => {
        showNotification(`${npc?.name}: "${result.npcResponse}"`);
      }, 500);
    }

    showNotification(result.outcome);

    if (result.progressTime) {
      progressTime();
    } else {
      setCurrentEvent(null);
    }
  };

  // Energy restoration actions
  const restoreEnergy = (amount, cost = 0) => {
    if (money >= cost) {
      updateGameState({
        stats: {
          ...stats,
          energy: Math.min(100, stats.energy + amount)
        },
        money: money - cost
      });
      showNotification(`Restored ${amount} energy!`);
    } else {
      showNotification('Not enough money!');
    }
  };

  // Handle item purchase
  const handleBuyItem = (item) => {
    if (money >= item.price) {
      const newInventory = { ...inventory };
      newInventory[item.id] = (newInventory[item.id] || 0) + 1;

      updateGameState({
        money: money - item.price,
        inventory: newInventory
      });

      showNotification(`Bought ${item.name}!`);
    }
  };

  // Handle item use
  const handleUseItem = (itemId) => {
    const item = getItemById(itemId);
    if (!item || !inventory[itemId]) return;

    const newInventory = { ...inventory };
    newInventory[itemId]--;
    if (newInventory[itemId] === 0) delete newInventory[itemId];

    const newStats = { ...stats };
    if (item.effects) {
      Object.entries(item.effects).forEach(([stat, change]) => {
        if (newStats[stat] !== undefined) {
          newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + change));
        }
      });
    }

    updateGameState({
      inventory: newInventory,
      stats: newStats
    });

    showNotification(`Used ${item.name}!`);
  };

  // Handle gifting item
  const handleGiveItem = (itemId, npcId) => {
    const item = getItemById(itemId);
    if (!item || !inventory[itemId]) return;

    const newInventory = { ...inventory };
    newInventory[itemId]--;
    if (newInventory[itemId] === 0) delete newInventory[itemId];

    const effects = calculateGiftEffect(item, npcId);
    const newRelationships = { ...relationships };

    if (newRelationships[npcId]) {
      const enhanced = EnhancedRelationship.fromJSON(newRelationships[npcId]);
      Object.entries(effects).forEach(([dimension, change]) => {
        if (enhanced[dimension] !== undefined) {
          enhanced[dimension] = Math.max(0, Math.min(100, enhanced[dimension] + change));
        }
      });
      enhanced.addMemory(`They gave me ${item.name} - so thoughtful!`);
      enhanced.updateStage();
      newRelationships[npcId] = enhanced.toJSON();
    }

    updateGameState({
      inventory: newInventory,
      relationships: newRelationships
    });

    const npc = availableNpcs.find(n => n.id === npcId);
    showNotification(`${npc?.name} loved the ${item.name}!`);
  };

  // Handle romantic action
  const handleRomanticAction = (action, targetId) => {
    const newStats = { ...stats };
    const newRelationships = { ...relationships };
    let newMoney = money;

    // Apply stat effects
    if (action.energy) newStats.energy = Math.max(0, Math.min(100, newStats.energy + action.energy));
    if (action.money) newMoney = Math.max(0, newMoney + action.money);

    // Apply relationship effects
    const enhanced = EnhancedRelationship.fromJSON(newRelationships[targetId]);

    if (action.id === 'ask_out') {
      // Process ask out
      const result = enhanced.processAskOut(day);
      const npc = availableNpcs.find(n => n.id === targetId);

      const outcomes = {
        enthusiastic_yes: {
          message: `${npc.name} lights up! "Yes! I'd love to!"`,
          memory: `They asked me out! I said yes immediately!`
        },
        hesitant_yes: {
          message: `${npc.name} blushes deeply. "I... yes, I think so..."`,
          memory: `They asked me out. I was nervous but said yes.`
        },
        not_yet: {
          message: `${npc.name} looks apologetic. "I like you, but I need more time..."`,
          memory: `They asked me out but I need more time.`
        },
        rejection: {
          message: `${npc.name} looks down. "I'm sorry... I don't feel that way about you."`,
          memory: `They asked me out but I had to say no.`
        }
      };

      showNotification(outcomes[result].message);
      newRelationships[targetId] = enhanced.toJSON();

      setShowRomanticActions(false);
      setRomanticTarget(null);
    } else {
      // Regular romantic action
      if (action.effects) {
        for (const [dimension, change] of Object.entries(action.effects)) {
          if (enhanced[dimension] !== undefined) {
            enhanced[dimension] = Math.max(0, Math.min(100, enhanced[dimension] + change));
          }
        }
      }

      // Add memory
      enhanced.addMemory(`${action.label} - it was nice`);
      enhanced.updateStage();
      newRelationships[targetId] = enhanced.toJSON();

      showNotification(`${action.label} with ${availableNpcs.find(n => n.id === targetId)?.name}!`);
    }

    updateGameState({
      stats: newStats,
      relationships: newRelationships,
      money: newMoney
    });

    if (action.id !== 'ask_out') {
      progressTime();
    }
  };

  // Handle friend selection for contextual action
  const handleFriendSelect = (action) => {
    setPendingAction(action);
    setShowFriendSelector(true);
  };

  const handleFriendSelected = (npcId) => {
    setShowFriendSelector(false);
    if (pendingAction) {
      const actionWithTarget = {
        ...pendingAction,
        relationTarget: npcId,
        selectedFriend: npcId
      };
      handleContextualAction(actionWithTarget);
    }
    setPendingAction(null);
  };

  // Handle contextual action - generates follow-up scenario
  const handleContextualAction = (action) => {
    const newStats = { ...stats };
    const newRelationships = { ...relationships };
    let newMoney = money;

    // Apply effects
    if (action.effects) {
      for (const [stat, change] of Object.entries(action.effects)) {
        if (stat === 'money') {
          newMoney = Math.max(0, newMoney + change);
        } else if (newStats[stat] !== undefined) {
          newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + change));
        }
      }
    }

    // Apply relationship changes
    if (action.relationTarget && newRelationships[action.relationTarget]) {
      newRelationships[action.relationTarget] = {
        ...newRelationships[action.relationTarget],
        level: Math.min(100, newRelationships[action.relationTarget].level + (action.relationChange || 0))
      };
    }

    updateGameState({
      stats: newStats,
      relationships: newRelationships,
      money: newMoney
    });

    // Generate follow-up scenario based on the action
    const followUpScenario = generateActionScenario(action, newStats, newRelationships);
    if (followUpScenario) {
      setCurrentEvent(followUpScenario);
    } else {
      if (action.selectedFriend) {
        const friendName = availableNpcs.find(n => n.id === action.selectedFriend)?.name;
        showNotification(`${action.label} with ${friendName}!`);
      } else {
        showNotification(action.description);
      }
      progressTime();
    }
  };

  // Generate a contextual scenario based on the action taken
  const generateActionScenario = (action, currentStats, currentRelationships) => {
    const targetId = action.selectedFriend || action.relationTarget;
    const targetNpc = availableNpcs.find(n => n.id === targetId);

    const scenarios = {
      walk_home_together: {
        id: `walk_home_${Date.now()}`,
        title: 'Walking Home',
        description: `You and ${targetNpc?.name} walk home together. The evening air is pleasant.`,
        choices: [
          {
            text: 'Talk about school',
            effects: { comfort: 10, academic: 3 },
            relationTarget: targetId,
            relationChange: 5
          },
          {
            text: 'Share personal stories',
            effects: { comfort: 15, anxiety: 5 },
            relationTarget: targetId,
            relationChange: 10
          },
          {
            text: 'Walk in comfortable silence',
            effects: { comfort: 12, anxiety: -5 },
            relationTarget: targetId,
            relationChange: 7
          }
        ]
      },
      invite_hangout: {
        id: `hangout_${Date.now()}`,
        title: 'Hanging Out',
        description: 'You invite a friend to hang out. Where should you go?',
        choices: [
          {
            text: 'Go to arcade',
            effects: { energy: -15, comfort: 20, popularity: 5 },
            relationTarget: 'random',
            relationChange: 15
          },
          {
            text: 'Visit a café',
            effects: { energy: 10, comfort: 18 },
            relationTarget: 'random',
            relationChange: 12
          },
          {
            text: 'Walk around town',
            effects: { energy: -10, comfort: 15 },
            relationTarget: 'random',
            relationChange: 10
          }
        ]
      },
      go_to_cafe: {
        id: `cafe_${Date.now()}`,
        title: 'At the Café',
        description: 'You relax at a cozy café. Someone you know walks in...',
        choices: [
          {
            text: 'Invite them to join',
            effects: { comfort: 15, popularity: 5 },
            relationTarget: 'random',
            relationChange: 12
          },
          {
            text: 'Wave but stay alone',
            effects: { comfort: 20, anxiety: -10 },
            relationTarget: 'random',
            relationChange: 3
          },
          {
            text: 'Leave to avoid awkwardness',
            effects: { anxiety: 5, energy: -5 },
            relationTarget: 'random',
            relationChange: -2
          }
        ]
      },
      share_lunch: {
        id: `share_lunch_${Date.now()}`,
        title: 'Sharing Lunch',
        description: `You offer to share your lunch with ${targetNpc?.name}. They smile appreciatively.`,
        choices: [
          {
            text: 'Chat while eating',
            effects: { comfort: 12, popularity: 3 },
            relationTarget: targetId,
            relationChange: 8
          },
          {
            text: 'Compliment their lunch too',
            effects: { comfort: 10, popularity: 5 },
            relationTarget: targetId,
            relationChange: 10
          },
          {
            text: 'Eat quietly together',
            effects: { comfort: 15, anxiety: -5 },
            relationTarget: targetId,
            relationChange: 6
          }
        ]
      },
      pass_note: {
        id: `pass_note_${Date.now()}`,
        title: 'Secret Note',
        description: 'You pass a note during class. What did you write?',
        choices: [
          {
            text: 'Something funny',
            effects: { anxiety: 5, comfort: 10, popularity: 5 },
            relationTarget: 'random',
            relationChange: 8
          },
          {
            text: 'Help with classwork',
            effects: { academic: 5, anxiety: 3 },
            relationTarget: 'random',
            relationChange: 10
          },
          {
            text: 'Just a friendly hello',
            effects: { comfort: 8 },
            relationTarget: 'random',
            relationChange: 5
          }
        ]
      },
      buy_snacks: {
        id: `buy_snacks_${Date.now()}`,
        title: 'School Store',
        description: 'You\'re buying snacks at the school store. The line is long.',
        choices: [
          {
            text: 'Buy extra to share',
            effects: { energy: 10, popularity: 8 },
            relationTarget: 'random',
            relationChange: 12
          },
          {
            text: 'Just get what you need',
            effects: { energy: 15, comfort: 5 }
          },
          {
            text: 'Let someone cut in line',
            effects: { energy: 12, popularity: 5 },
            relationTarget: 'random',
            relationChange: 8
          }
        ]
      },
      study_late: {
        id: `study_late_${Date.now()}`,
        title: 'Late Night Study',
        description: 'You\'re studying late. A teacher walks by.',
        choices: [
          {
            text: 'Ask for help',
            effects: { academic: 12, anxiety: 5 },
            relationTarget: 'onemine',
            relationChange: 10
          },
          {
            text: 'Keep studying independently',
            effects: { academic: 15, comfort: 5 }
          },
          {
            text: 'Take a short break',
            effects: { academic: 8, energy: 10, anxiety: -5 }
          }
        ]
      }
    };

    return scenarios[action.id] || null;
  };

  const currentTimeSlot = TIME_SLOTS.find(t => t.id === timeSlot);

  // Filter locations by time availability
  const availableLocations = useMemo(() => {
    return LOCATIONS.filter(location => {
      // Check time availability
      if (!location.availableAt.includes(timeSlot)) return false;

      // Check club requirement
      if (location.requiresClub && !currentClub) return false;

      return true;
    });
  }, [timeSlot, currentClub]);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100"
          >
            <p className="text-slate-700 text-sm">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <CharacterAvatar characterId={player?.id || 'custom'} size="md" />
              <div>
                <p className="font-medium text-purple-100 text-sm">{player?.name}</p>
                <p className="text-xs text-purple-300/60">Day {day} • {currentTimeSlot?.icon} {currentTimeSlot?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGoals(true)}
                className="h-9 w-9 hover:bg-purple-500/20"
              >
                <Target className="w-5 h-5 text-purple-300" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRelationships(true)}
                className="h-9 w-9 hover:bg-purple-500/20"
              >
                <Users className="w-5 h-5 text-purple-300" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={saveGame}
                className="h-9 w-9 hover:bg-purple-500/20"
              >
                <Save className="w-5 h-5 text-purple-300" />
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-6 gap-2">
            <StatMini label="ANX" value={stats.anxiety} color="rose" icon={<Heart className="w-3 h-3" />} />
            <StatMini label="CMF" value={stats.comfort} color="emerald" icon={<Sparkles className="w-3 h-3" />} />
            <StatMini label="NRG" value={stats.energy} color="amber" icon={<Zap className="w-3 h-3" />} />
            <StatMini label="POP" value={stats.popularity} color="purple" icon={<Star className="w-3 h-3" />} />
            <StatMini label="ACA" value={stats.academic} color="blue" icon={<BookOpen className="w-3 h-3" />} />
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-1">
                <DollarSign className="w-3 h-3" />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">${money}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {currentEvent ? (
            <EventCard
              key={currentEvent.id}
              event={currentEvent}
              onChoice={handleChoice}
              stats={stats}
              player={player}
              onCustomAction={() => setShowCustomAction(true)}
            />
          ) : (
            <motion.div
              key="location-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Contextual Actions */}
              <ContextualActions 
                gameState={gameState}
                onAction={handleContextualAction}
                onFriendSelect={handleFriendSelect}
                availableNpcs={availableNpcs}
              />

              {/* Quick Actions */}
              <div className="mb-4 flex gap-2 flex-wrap">
                <Button
                  onClick={() => setShowInventory(true)}
                  variant="outline"
                  size="sm"
                  className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Inventory ({Object.values(inventory).reduce((a, b) => a + b, 0)})
                </Button>
                <Button
                  onClick={() => setShowNPCInteraction(true)}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Talk to Someone
                </Button>
                {Object.values(relationships).some(rel => rel.stage === 'mutual_interest' || rel.stage === 'dating' || rel.stage === 'serious') && (
                  <Button
                    onClick={() => setShowRomanticActions(true)}
                    variant="outline"
                    size="sm"
                    className="border-rose-500/50 text-rose-300 hover:bg-rose-500/20"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Romance
                  </Button>
                )}
                {stats.energy < 50 && (
                  <Button
                    onClick={() => restoreEnergy(20, 50)}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Buy Coffee ($50)
                  </Button>
                )}
                {timeSlot === 'lunch' && (
                  <Button
                    onClick={() => restoreEnergy(30, 100)}
                    variant="outline"
                    size="sm"
                    className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                  >
                    Eat Lunch ($100)
                  </Button>
                )}
              </div>

              <h2 className="text-xl font-light text-purple-100 mb-4 text-center">
                Where would you like to go?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {availableLocations.map((location) => (
                  <motion.button
                    key={location.id}
                    onClick={() => handleLocationSelect(location.id)}
                    className={`p-4 rounded-2xl bg-slate-800/50 border-2 transition-all text-left ${
                      selectedLocation === location.id
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'border-slate-700 hover:border-purple-500/50 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl mb-2 block">{location.icon}</span>
                    <p className="font-medium text-purple-100">{location.name}</p>
                    <p className="text-xs text-purple-300/60 mt-1">{location.description}</p>
                  </motion.button>
                ))}
              </div>

              {/* Available Shops */}
              {SHOPS.filter(shop => shop.availableAt.includes(timeSlot)).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-light text-purple-200 mb-3">🛍️ Available Shops</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {SHOPS.filter(shop => shop.availableAt.includes(timeSlot)).map(shop => (
                      <Button
                        key={shop.id}
                        onClick={() => setShowShop(shop)}
                        variant="outline"
                        className="h-auto py-3 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20"
                      >
                        <div className="text-center">
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-xs opacity-70">{shop.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Relationship Panel */}
      <AnimatePresence>
        {showRelationships && (
          <RelationshipPanel
            relationships={relationships}
            npcs={availableNpcs}
            onClose={() => setShowRelationships(false)}
            onViewProfile={(npcId) => {
              setShowRelationships(false);
              setShowCharacterProfile(npcId);
            }}
          />
        )}
      </AnimatePresence>

      {/* Character Profile */}
      <AnimatePresence>
        {showCharacterProfile && (
          <CharacterProfile
            npcId={showCharacterProfile}
            relationship={relationships[showCharacterProfile]}
            onClose={() => setShowCharacterProfile(null)}
            onInteract={(actionId) => handleProfileInteract(showCharacterProfile, actionId)}
          />
        )}
      </AnimatePresence>

      {/* NPC Interaction Panel */}
      <AnimatePresence>
        {showNPCInteraction && (
          <NPCInteractionPanel
            location={selectedLocation}
            timeSlot={timeSlot}
            availableNpcs={availableNpcs}
            relationships={relationships}
            onClose={() => setShowNPCInteraction(false)}
            onSelectNPC={handleNPCSelect}
          />
        )}
      </AnimatePresence>

      {/* Custom Action Dialog */}
      <AnimatePresence>
        {showCustomAction && currentEvent && (
          <CustomActionDialog
            event={currentEvent}
            gameState={gameState}
            onComplete={handleCustomActionComplete}
            onClose={() => setShowCustomAction(false)}
          />
        )}
      </AnimatePresence>

      {/* Goals Panel */}
      <AnimatePresence>
        {showGoals && (
          <GoalsPanel
            gameState={gameState}
            onClose={() => setShowGoals(false)}
          />
        )}
      </AnimatePresence>

      {/* Friend Selector */}
      <AnimatePresence>
        {showFriendSelector && (
          <FriendSelector
            availableNpcs={availableNpcs}
            relationships={relationships}
            onSelect={handleFriendSelected}
            onClose={() => {
              setShowFriendSelector(false);
              setPendingAction(null);
            }}
            title={pendingAction?.label || "Choose a friend"}
          />
        )}
      </AnimatePresence>

      {/* Music Player */}
      <MusicPlayer timeSlot={timeSlot} />

      {/* Romantic Actions Selection */}
      <AnimatePresence>
        {showRomanticActions && !romanticTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRomanticActions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full max-h-[70vh] overflow-y-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-100">Choose Someone</h3>
                <button onClick={() => setShowRomanticActions(false)} className="text-purple-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {availableNpcs.filter(npc => {
                  const rel = relationships[npc.id];
                  return rel && (rel.stage === 'mutual_interest' || rel.stage === 'dating' || rel.stage === 'serious');
                }).map(npc => {
                  const rel = relationships[npc.id];
                  return (
                    <button
                      key={npc.id}
                      onClick={() => {
                        setRomanticTarget(npc.id);
                      }}
                      className="w-full p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-xl border border-slate-600 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterAvatar characterId={npc.id} size="sm" />
                        <div className="flex-1">
                          <p className="text-purple-100 font-medium">{npc.name}</p>
                          <p className="text-xs text-purple-300/70">{rel.stage.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romantic Actions Panel */}
      <AnimatePresence>
        {showRomanticActions && romanticTarget && (
          <RomanticActionsPanel
            relationship={EnhancedRelationship.fromJSON(relationships[romanticTarget])}
            npc={availableNpcs.find(n => n.id === romanticTarget)}
            gameState={gameState}
            onAction={(action) => handleRomanticAction(action, romanticTarget)}
            onClose={() => {
              setShowRomanticActions(false);
              setRomanticTarget(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Shop Dialog */}
      <AnimatePresence>
        {showShop && (
          <ShopDialog
            shop={showShop}
            money={money}
            inventory={inventory}
            onBuy={handleBuyItem}
            onClose={() => setShowShop(null)}
          />
        )}
      </AnimatePresence>

      {/* Inventory Panel */}
      <AnimatePresence>
        {showInventory && (
          <InventoryPanel
            inventory={inventory}
            onUse={handleUseItem}
            onGive={handleGiveItem}
            onClose={() => setShowInventory(false)}
            availableNpcs={availableNpcs}
            relationships={relationships}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatMini({ label, value, color, icon }) {
  const colorClasses = {
    rose: 'bg-rose-100 text-rose-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  const progressColors = {
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    purple: 'bg-purple-400',
    blue: 'bg-blue-400'
  };

  return (
    <div className="text-center">
      <div className={`w-6 h-6 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-1`}>
        {icon}
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColors[color]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-500 mt-0.5">{value}</p>
    </div>
  );
}