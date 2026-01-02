// SCENARIO BANK SYSTEM - Dynamic scenario generation based on context

export class ScenarioBank {
  constructor(gameState) {
    this.gameState = gameState;
  }

  // Get contextual scenarios based on current game state
  getContextualScenarios() {
    const scenarios = [];
    const { 
      romanceTarget, 
      romanceLevel, 
      romanceStatus,
      relationships, 
      timeSlot, 
      location,
      currentClub,
      stats,
      storyFlags,
      day 
    } = this.gameState;

    // ROMANCE-BASED SCENARIOS
    if (romanceTarget && romanceStatus === 'dating') {
      scenarios.push(...this.getRomanceScenarios());
    }

    // FRIENDSHIP-BASED SCENARIOS
    scenarios.push(...this.getFriendshipScenarios());

    // TIME-BASED SCENARIOS
    scenarios.push(...this.getTimeBasedScenarios());

    // STAT-BASED SCENARIOS
    scenarios.push(...this.getStatBasedScenarios());

    // CLUB-BASED SCENARIOS
    if (currentClub) {
      scenarios.push(...this.getClubScenarios());
    }

    return scenarios;
  }

  getRomanceScenarios() {
    const { romanceTarget, timeSlot, location, romanceLevel, romanceStatus } = this.gameState;
    const scenarios = [];

    // Morning romance scenarios
    if (timeSlot === 'morning' && romanceStatus === 'dating') {
      scenarios.push({
        id: 'romance_morning_text',
        name: 'Good Morning Text',
        type: 'romance_contextual',
        npc: romanceTarget,
        description: `You receive a good morning text from ${this.getNPCName(romanceTarget)}. ❤️`,
        priority: 8,
        choices: [
          {
            text: 'Reply with hearts',
            effects: { romanceLevel: 4, comfort: 10, anxiety: -5 },
            outcome: 'They send back even more hearts!'
          },
          {
            text: 'Send a cute selfie',
            effects: { romanceLevel: 6, anxiety: 10, comfort: 12 },
            outcome: 'They say you look adorable!'
          }
        ]
      });
    }

    // Class time romance
    if (timeSlot === 'class' && romanceStatus === 'dating' && romanceLevel >= 80) {
      scenarios.push({
        id: 'romance_class_glances',
        name: 'Stolen Glances',
        type: 'romance_contextual',
        npc: romanceTarget,
        description: `During class, you catch ${this.getNPCName(romanceTarget)} looking at you. They quickly look away, blushing.`,
        priority: 7,
        choices: [
          {
            text: 'Smile back',
            effects: { romanceLevel: 3, comfort: 8 },
            outcome: 'They smile shyly and look away again.'
          },
          {
            text: 'Pass a love note',
            effects: { romanceLevel: 7, anxiety: 8, comfort: 15 },
            outcome: 'They read it and their face turns red.'
          },
          {
            text: 'Focus on class',
            effects: { academic: 5 },
            outcome: 'You resist the distraction and study.'
          }
        ]
      });
    }

    if (timeSlot === 'afterschool') {
      scenarios.push({
        id: 'romance_walk_home_request',
        name: 'Walk Home Together?',
        type: 'romance_contextual',
        npc: romanceTarget,
        description: `${this.getNPCName(romanceTarget)} approaches you with a shy smile. "Want to walk home together?"`,
        priority: 10,
        choices: [
          {
            text: 'Of course!',
            effects: { romanceLevel: 5, comfort: 15, energy: -5 },
            outcome: 'You walk home together, talking about your day.'
          },
          {
            text: 'Hold their hand',
            effects: { romanceLevel: 10, anxiety: 10, comfort: 20 },
            outcome: 'You reach for their hand as you walk. They blush but don\'t pull away.'
          },
          {
            text: 'Not today, sorry',
            effects: { romanceLevel: -3, anxiety: 5 },
            outcome: 'They look disappointed but understand.'
          }
        ]
      });
    }

    if (timeSlot === 'lunch' && (location === 'cafeteria' || location === 'rooftop')) {
      scenarios.push({
        id: 'romance_lunch_together',
        name: 'Lunch Date',
        type: 'romance_contextual',
        npc: romanceTarget,
        description: `${this.getNPCName(romanceTarget)} sits next to you. "Mind if I join you?"`,
        priority: 9,
        choices: [
          {
            text: 'I\'d love that',
            effects: { romanceLevel: 4, comfort: 12 },
            outcome: 'You enjoy a pleasant lunch together.'
          },
          {
            text: 'Share your lunch',
            effects: { romanceLevel: 7, comfort: 15, energy: -3 },
            outcome: 'You offer some of your food. They smile warmly.'
          }
        ]
      });
    }

    if (location === 'library' && romanceLevel >= 75) {
      scenarios.push({
        id: 'romance_library_study',
        name: 'Study Together',
        type: 'romance_contextual',
        npc: romanceTarget,
        description: `${this.getNPCName(romanceTarget)} is studying alone. They wave you over.`,
        priority: 7,
        choices: [
          {
            text: 'Study together',
            effects: { romanceLevel: 5, academic: 10, comfort: 10 },
            outcome: 'You study side by side, occasionally helping each other.'
          },
          {
            text: 'Just chat quietly',
            effects: { romanceLevel: 6, comfort: 15, academic: -3 },
            outcome: 'You end up talking more than studying, but it\'s nice.'
          }
        ]
      });
    }

    if (timeSlot === 'evening' && romanceLevel >= 85) {
      scenarios.push({
        id: 'romance_goodnight_text',
        name: 'Goodnight Message',
        type: 'romance_contextual',
        npc: romanceTarget,
        description: `You receive a text from ${this.getNPCName(romanceTarget)}: "Goodnight! Sweet dreams ❤️"`,
        priority: 6,
        choices: [
          {
            text: 'Send a sweet reply',
            effects: { romanceLevel: 3, comfort: 10, anxiety: -5 },
            outcome: 'You send a heartfelt message back.'
          },
          {
            text: 'Call them instead',
            effects: { romanceLevel: 8, anxiety: 10, comfort: 20, energy: -15 },
            outcome: 'You talk on the phone until late. It was worth the sleep loss.'
          }
        ]
      });
    }

    // Romantic confession scenario
    if (romanceLevel >= 60 && romanceLevel < 70 && !romanceStatus) {
      scenarios.push({
        id: 'romance_confession_opportunity',
        name: 'Perfect Moment',
        type: 'romance_milestone',
        npc: romanceTarget,
        description: `You're alone with ${this.getNPCName(romanceTarget)}. The atmosphere feels... different.`,
        priority: 12,
        choices: [
          {
            text: 'Confess your feelings',
            effects: { anxiety: 30, romanceLevel: 15 },
            outcome: 'Your heart races as you speak...',
            addFlag: 'confessed_feelings'
          },
          {
            text: 'Not yet...',
            effects: { anxiety: -5 },
            outcome: 'Maybe another time.'
          }
        ]
      });
    }

    // Anniversary or special date
    if (romanceStatus === 'dating' && romanceLevel >= 90) {
      scenarios.push({
        id: 'romance_special_date',
        name: 'Special Date',
        type: 'romance_event',
        npc: romanceTarget,
        description: `${this.getNPCName(romanceTarget)} planned something special for you two!`,
        priority: 11,
        choices: [
          {
            text: 'Go on the date',
            effects: { romanceLevel: 10, comfort: 25, energy: -20 },
            outcome: 'You have the best time together.'
          },
          {
            text: 'Suggest staying in',
            effects: { romanceLevel: 8, comfort: 30, anxiety: -10 },
            outcome: 'You enjoy a cozy evening together.'
          }
        ]
      });
    }

    return scenarios;
  }

  getFriendshipScenarios() {
    const { relationships, timeSlot, location } = this.gameState;
    const scenarios = [];

    const closeFriends = Object.entries(relationships)
      .filter(([_, rel]) => rel.level >= 60 && rel.level < 80)
      .map(([id]) => id);

    if (closeFriends.length > 0 && timeSlot === 'lunch') {
      const friendId = closeFriends[Math.floor(Math.random() * closeFriends.length)];
      scenarios.push({
        id: 'friendship_lunch_invite',
        name: 'Lunch Invitation',
        type: 'friendship_contextual',
        npc: friendId,
        description: `${this.getNPCName(friendId)} waves you over to their table.`,
        priority: 5,
        choices: [
          {
            text: 'Join them',
            effects: { comfort: 10, popularity: 3 },
            relationTarget: friendId,
            relationChange: 5,
            outcome: 'You have a fun lunch together.'
          },
          {
            text: 'Eat together but stay quiet',
            effects: { comfort: 8, anxiety: -5 },
            relationTarget: friendId,
            relationChange: 3,
            outcome: 'Comfortable silence with a good friend.'
          }
        ]
      });
    }

    return scenarios;
  }

  getTimeBasedScenarios() {
    const { timeSlot, stats, day } = this.gameState;
    const scenarios = [];

    if (timeSlot === 'morning' && stats.energy < 30) {
      scenarios.push({
        id: 'tired_morning',
        name: 'Exhausted Morning',
        type: 'stat_contextual',
        description: 'You can barely keep your eyes open...',
        priority: 8,
        choices: [
          {
            text: 'Buy energy drink',
            effects: { energy: 20, anxiety: 5 },
            outcome: 'The caffeine helps you wake up.'
          },
          {
            text: 'Power nap in classroom',
            effects: { energy: 15, popularity: -3 },
            outcome: 'You sneak a quick nap before class.'
          }
        ]
      });
    }

    if (timeSlot === 'class' && stats.anxiety > 70) {
      scenarios.push({
        id: 'panic_in_class',
        name: 'Anxiety Spike',
        type: 'stat_contextual',
        description: 'The classroom feels suffocating. Your heart is racing.',
        priority: 9,
        choices: [
          {
            text: 'Ask to use restroom',
            effects: { anxiety: -15, comfort: 10 },
            outcome: 'You splash water on your face and calm down.'
          },
          {
            text: 'Focus on breathing',
            effects: { anxiety: -10, academic: -5 },
            outcome: 'You manage to center yourself.'
          },
          {
            text: 'Text a friend for support',
            effects: { anxiety: -12, comfort: 8 },
            outcome: 'Their encouraging message helps.'
          }
        ]
      });
    }

    return scenarios;
  }

  getStatBasedScenarios() {
    const { stats, relationships, day } = this.gameState;
    const scenarios = [];

    // Low energy scenarios
    if (stats.energy < 30) {
      scenarios.push({
        id: 'exhausted_collapse',
        name: 'Too Tired',
        type: 'stat_contextual',
        description: 'You feel like you might collapse...',
        priority: 10,
        choices: [
          {
            text: 'Find somewhere to rest',
            effects: { energy: 25, academic: -5 },
            outcome: 'You take a power nap and feel better.'
          },
          {
            text: 'Push through it',
            effects: { energy: -5, anxiety: 10 },
            outcome: 'You force yourself to stay awake.'
          }
        ]
      });
    }

    // High comfort scenarios
    if (stats.comfort >= 80) {
      scenarios.push({
        id: 'confident_moment',
        name: 'Feeling Confident',
        type: 'stat_contextual',
        description: 'You feel really good about yourself today!',
        priority: 6,
        choices: [
          {
            text: 'Approach someone new',
            effects: { popularity: 10, anxiety: 5 },
            relationTarget: 'random',
            relationChange: 15,
            outcome: 'Your confidence helps you make a great first impression!'
          },
          {
            text: 'Help someone in need',
            effects: { popularity: 8, comfort: 5 },
            relationTarget: 'random',
            relationChange: 12,
            outcome: 'You offer assistance and they appreciate it.'
          }
        ]
      });
    }

    // Anxiety crisis
    if (stats.anxiety >= 85) {
      scenarios.push({
        id: 'anxiety_crisis',
        name: 'Overwhelming Anxiety',
        type: 'stat_contextual',
        description: 'Everything feels too much right now...',
        priority: 11,
        choices: [
          {
            text: 'Call a friend for support',
            effects: { anxiety: -20, comfort: 15 },
            outcome: 'Talking it out really helps.'
          },
          {
            text: 'Take deep breaths',
            effects: { anxiety: -15, energy: -10 },
            outcome: 'You manage to calm yourself down.'
          },
          {
            text: 'Hide in the bathroom',
            effects: { anxiety: -10, comfort: -5 },
            outcome: 'The solitude helps a little.'
          }
        ]
      });
    }

    if (stats.popularity >= 70) {
      scenarios.push({
        id: 'popular_attention',
        name: 'Center of Attention',
        type: 'stat_contextual',
        description: 'A group of students approaches you, wanting to hang out.',
        priority: 6,
        choices: [
          {
            text: 'Hang out with them',
            effects: { popularity: 5, energy: -10, comfort: 10 },
            outcome: 'You have a good time with your peers.'
          },
          {
            text: 'Politely excuse yourself',
            effects: { popularity: -2, comfort: 5 },
            outcome: 'Sometimes you need alone time.'
          }
        ]
      });
    }

    if (stats.academic >= 80) {
      scenarios.push({
        id: 'tutor_request',
        name: 'Tutoring Request',
        type: 'stat_contextual',
        description: 'A struggling student asks if you could help tutor them.',
        priority: 5,
        choices: [
          {
            text: 'Agree to help',
            effects: { academic: 5, popularity: 8, energy: -10 },
            relationTarget: 'random',
            relationChange: 15,
            outcome: 'You help them understand the material.'
          },
          {
            text: 'Too busy right now',
            effects: { comfort: 5 },
            outcome: 'You have to focus on yourself.'
          }
        ]
      });
    }

    // Random money scenarios
    if (Math.random() < 0.3) {
      scenarios.push({
        id: 'found_money',
        name: 'Lucky Find',
        type: 'random_event',
        description: 'You find some money on the ground!',
        priority: 4,
        choices: [
          {
            text: 'Keep it',
            effects: { money: 200, anxiety: 5 },
            outcome: 'You pocket the cash. Lucky day!'
          },
          {
            text: 'Turn it in',
            effects: { popularity: 10, comfort: 15 },
            outcome: 'You turn it in to the office. Doing the right thing feels good.'
          }
        ]
      });
    }

    // Social opportunities
    if (day >= 10 && stats.popularity >= 50) {
      scenarios.push({
        id: 'party_invite',
        name: 'Party Invitation',
        type: 'social_event',
        description: 'Someone invites you to a weekend party!',
        priority: 7,
        choices: [
          {
            text: 'Accept the invitation',
            effects: { popularity: 15, anxiety: 20, energy: -25 },
            outcome: 'You have a great time at the party!'
          },
          {
            text: 'Politely decline',
            effects: { comfort: 10, anxiety: -5 },
            outcome: 'You prefer a quiet weekend.'
          }
        ]
      });
    }

    return scenarios;
  }

  getClubScenarios() {
    const { currentClub, timeSlot } = this.gameState;
    const scenarios = [];

    if (timeSlot === 'afterschool') {
      scenarios.push({
        id: 'club_activity',
        name: 'Club Meeting',
        type: 'club_contextual',
        description: `It's time for ${currentClub.name} activities!`,
        priority: 7,
        choices: [
          {
            text: 'Participate actively',
            effects: { energy: -10, popularity: 5 },
            outcome: 'You have a productive club meeting.'
          },
          {
            text: 'Take it easy today',
            effects: { energy: -5, comfort: 5 },
            outcome: 'You enjoy a relaxed club session.'
          }
        ]
      });
    }

    return scenarios;
  }

  getNPCName(npcId) {
    const NPC_NAMES = {
      komi: 'Komi',
      tadano: 'Tadano',
      najimi: 'Najimi',
      yamai: 'Yamai',
      nakanaka: 'Nakanaka',
      katai: 'Katai',
      onemine: 'Onemine',
      otori: 'Otori',
      agari: 'Agari',
      ase: 'Ase'
    };
    return NPC_NAMES[npcId] || 'Someone';
  }

  // Select best scenario based on priority and relevance
  selectBestScenario() {
    const scenarios = this.getContextualScenarios();

    if (scenarios.length === 0) return null;

    // Sort by priority
    scenarios.sort((a, b) => b.priority - a.priority);

    // Add some randomness - pick from top 3
    const topScenarios = scenarios.slice(0, Math.min(3, scenarios.length));
    return topScenarios[Math.floor(Math.random() * topScenarios.length)];
  }
}