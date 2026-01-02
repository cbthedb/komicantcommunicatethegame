import { NPC_CHARACTERS } from './gameData';

export class DynamicEventGenerator {
  constructor(gameState) {
    this.gameState = gameState;
  }

  // Generate weather-based events
  generateWeatherEvent() {
    const weathers = ['rain', 'sunny', 'cloudy', 'windy'];
    const weather = weathers[Math.floor(Math.random() * weathers.length)];

    const weatherEvents = {
      rain: {
        id: `rain_${Date.now()}`,
        title: 'Sudden Rain',
        description: 'It started raining! You forgot your umbrella...',
        choices: [
          {
            text: 'Share umbrella with someone',
            effects: { comfort: 20, anxiety: 10 },
            relationTarget: 'random',
            relationChange: 20
          },
          {
            text: 'Run through the rain',
            effects: { energy: -15, comfort: 10, anxiety: 5 }
          },
          {
            text: 'Wait it out',
            effects: { energy: 5, anxiety: -10 }
          }
        ]
      },
      sunny: {
        id: `sunny_${Date.now()}`,
        title: 'Beautiful Day',
        description: 'The weather is perfect! Everyone seems happier today.',
        choices: [
          {
            text: 'Suggest outdoor activity',
            effects: { comfort: 15, popularity: 10, energy: -10 },
            relationTarget: 'random',
            relationChange: 15
          },
          {
            text: 'Enjoy the sunshine',
            effects: { comfort: 20, energy: 10, anxiety: -10 }
          },
          {
            text: 'Stay indoors anyway',
            effects: { comfort: 5, academic: 10 }
          }
        ]
      },
      windy: {
        id: `windy_${Date.now()}`,
        title: 'Strong Wind',
        description: 'A gust of wind blows papers everywhere!',
        choices: [
          {
            text: 'Help gather papers',
            effects: { popularity: 8, energy: -8 },
            relationTarget: 'random',
            relationChange: 12
          },
          {
            text: 'Secure your own things',
            effects: { comfort: 5, anxiety: -5 }
          },
          {
            text: 'Chase your hat!',
            effects: { energy: -15, comfort: 8, popularity: 5 }
          }
        ]
      }
    };

    return weatherEvents[weather];
  }

  // Generate NPC-personality driven events
  generatePersonalityEvent() {
    const { relationships } = this.gameState;
    const friendNpcs = Object.entries(relationships)
      .filter(([_, rel]) => (rel.friendship || rel.level || 0) >= 30)
      .map(([id]) => id);

    if (friendNpcs.length === 0) return null;

    const npcId = friendNpcs[Math.floor(Math.random() * friendNpcs.length)];
    const npc = NPC_CHARACTERS.find(n => n.id === npcId);
    if (!npc) return null;

    const personalityEvents = {
      komi: {
        id: `komi_note_${Date.now()}`,
        title: 'A Note from Komi',
        description: 'Komi shyly hands you a note. Her hands are trembling slightly.',
        choices: [
          {
            text: 'Read it carefully',
            effects: { comfort: 20, anxiety: 5 },
            relationTarget: npcId,
            relationChange: 18
          },
          {
            text: 'Write a note back',
            effects: { comfort: 25, anxiety: 10 },
            relationTarget: npcId,
            relationChange: 25
          },
          {
            text: 'Smile warmly',
            effects: { comfort: 15 },
            relationTarget: npcId,
            relationChange: 15
          }
        ]
      },
      najimi: {
        id: `najimi_scheme_${Date.now()}`,
        title: 'Najimi\'s Latest Scheme',
        description: 'Najimi appears with a mischievous grin. "I have an AMAZING idea!"',
        choices: [
          {
            text: 'Go along with it',
            effects: { comfort: 20, popularity: 15, anxiety: 15, energy: -15 },
            relationTarget: npcId,
            relationChange: 20
          },
          {
            text: 'Suggest something safer',
            effects: { comfort: 12, popularity: 8 },
            relationTarget: npcId,
            relationChange: 12
          },
          {
            text: 'Politely decline',
            effects: { anxiety: -10, comfort: 5 },
            relationTarget: npcId,
            relationChange: 5
          }
        ]
      },
      yamai: {
        id: `yamai_obsession_${Date.now()}`,
        title: 'Yamai\'s Photos',
        description: 'Yamai shows you her latest photos... they\'re all of someone.',
        choices: [
          {
            text: 'Compliment the photos',
            effects: { comfort: 10, anxiety: 5 },
            relationTarget: npcId,
            relationChange: 15
          },
          {
            text: 'Suggest other hobbies',
            effects: { anxiety: 10, popularity: 5 },
            relationTarget: npcId,
            relationChange: 5
          },
          {
            text: 'Change the subject',
            effects: { comfort: 5 },
            relationTarget: npcId,
            relationChange: 8
          }
        ]
      },
      nakanaka: {
        id: `nakanaka_roleplay_${Date.now()}`,
        title: 'Dark Powers Awakening',
        description: 'Nakanaka dramatically declares her "sealed power" is awakening.',
        choices: [
          {
            text: 'Play along enthusiastically',
            effects: { comfort: 25, popularity: -5 },
            relationTarget: npcId,
            relationChange: 25
          },
          {
            text: 'Ask about her "powers"',
            effects: { comfort: 15, academic: 5 },
            relationTarget: npcId,
            relationChange: 15
          },
          {
            text: 'Be supportive but realistic',
            effects: { comfort: 10 },
            relationTarget: npcId,
            relationChange: 10
          }
        ]
      }
    };

    return personalityEvents[npcId] || null;
  }

  // Generate random encounter events
  generateRandomEncounter() {
    const encounters = [
      {
        id: `lost_item_${Date.now()}`,
        title: 'Lost and Found',
        description: 'You find a lost wallet in the hallway.',
        choices: [
          {
            text: 'Turn it in to office',
            effects: { popularity: 15, comfort: 10, academic: 5 }
          },
          {
            text: 'Find the owner yourself',
            effects: { popularity: 20, energy: -15 },
            relationTarget: 'random',
            relationChange: 25
          },
          {
            text: 'Leave it where it is',
            effects: { anxiety: 5 }
          }
        ]
      },
      {
        id: `vending_machine_${Date.now()}`,
        title: 'Vending Machine Luck',
        description: 'The vending machine dispensed two drinks instead of one!',
        choices: [
          {
            text: 'Share the extra drink',
            effects: { comfort: 15, popularity: 10 },
            relationTarget: 'random',
            relationChange: 12
          },
          {
            text: 'Save it for later',
            effects: { energy: 10, comfort: 5 }
          },
          {
            text: 'Tell someone about it',
            effects: { popularity: 8, comfort: 10 }
          }
        ]
      },
      {
        id: `club_recruit_${Date.now()}`,
        title: 'Club Recruitment',
        description: 'A club member is desperately trying to recruit new members.',
        choices: [
          {
            text: 'Hear them out',
            effects: { popularity: 8, energy: -5 },
            relationTarget: 'random',
            relationChange: 10
          },
          {
            text: 'Politely decline',
            effects: { anxiety: -5 }
          },
          {
            text: 'Help them recruit others',
            effects: { popularity: 15, energy: -10 },
            relationTarget: 'random',
            relationChange: 15
          }
        ]
      },
      {
        id: `talent_show_${Date.now()}`,
        title: 'Talent Show Announcement',
        description: 'The school is organizing a talent show. Will you participate?',
        choices: [
          {
            text: 'Sign up solo',
            effects: { popularity: 20, anxiety: 30, energy: -15 }
          },
          {
            text: 'Form a group',
            effects: { popularity: 25, anxiety: 20, energy: -20 },
            relationTarget: 'random',
            relationChange: 20
          },
          {
            text: 'Just watch',
            effects: { comfort: 10, anxiety: -10 }
          }
        ]
      }
    ];

    return encounters[Math.floor(Math.random() * encounters.length)];
  }

  // Generate crisis events that require immediate decisions
  generateCrisisEvent() {
    const crises = [
      {
        id: `exam_panic_${Date.now()}`,
        title: 'Exam Tomorrow!',
        description: 'You forgot about the big exam tomorrow! What do you do?',
        choices: [
          {
            text: 'All-nighter study session',
            effects: { academic: 25, energy: -40, anxiety: 20 }
          },
          {
            text: 'Group study',
            effects: { academic: 20, energy: -25, anxiety: 15 },
            relationTarget: 'random',
            relationChange: 15
          },
          {
            text: 'Get good sleep and hope',
            effects: { academic: 5, energy: 20, anxiety: 10 }
          }
        ]
      },
      {
        id: `friendship_conflict_${Date.now()}`,
        title: 'Friend Conflict',
        description: 'Two of your friends are arguing and both want your support.',
        choices: [
          {
            text: 'Try to mediate',
            effects: { anxiety: 20, popularity: 15, energy: -15 },
            relationChange: 10
          },
          {
            text: 'Support one side',
            effects: { anxiety: 15, popularity: -10 },
            relationTarget: 'random',
            relationChange: 20
          },
          {
            text: 'Stay out of it',
            effects: { anxiety: 10, popularity: -5 }
          }
        ]
      }
    ];

    return crises[Math.floor(Math.random() * crises.length)];
  }

  // Main method to select best dynamic event
  selectDynamicEvent() {
    const { day, stats } = this.gameState;

    // Higher chance for personality events with friends
    if (Math.random() < 0.4) {
      const personalityEvent = this.generatePersonalityEvent();
      if (personalityEvent) return personalityEvent;
    }

    // Weather events (20% chance)
    if (Math.random() < 0.2) {
      return this.generateWeatherEvent();
    }

    // Crisis events for dramatic moments (10% chance if stressed)
    if (stats.anxiety > 60 && Math.random() < 0.1) {
      return this.generateCrisisEvent();
    }

    // Random encounters (default)
    return this.generateRandomEncounter();
  }
}