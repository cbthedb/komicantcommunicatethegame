// ADVANCED SCENARIO SYSTEM - 50+ Events with Branching Paths

export const ADVANCEMENT_SCENARIOS = {
  // ==================== FRIENDSHIP MILESTONE EVENTS ====================

  komi_first_words: {
    id: 'komi_first_words',
    name: 'First Words',
    type: 'friendship_milestone',
    location: 'library',
    timeSlot: 'afterschool',
    npcsInvolved: ['komi'],
    trigger: { relationship: { target: 'komi', min: 60 }, flag: 'komi_friend' },
    once: true,
    rarity: 'rare',
    description: 'Komi is sitting alone in the library, practicing speaking quietly. She notices you.',
    choices: [
      {
        text: 'Sit nearby and wait patiently',
        effects: { anxiety: -5, comfort: 10 },
        relationTarget: 'komi',
        relationChange: 15,
        addFlag: 'komi_spoke',
        outcome: 'Komi whispers "Thank you... for being here." Her first words to you.'
      },
      {
        text: 'Write a note saying "Take your time"',
        effects: { anxiety: 5, comfort: 15 },
        relationTarget: 'komi',
        relationChange: 20,
        addFlag: 'komi_spoke',
        unlockMinigame: 'notebook_exchange',
        outcome: 'Komi smiles and writes back. You start a notebook conversation.'
      },
      {
        text: 'Just smile and read your own book',
        effects: { comfort: 10 },
        relationTarget: 'komi',
        relationChange: 10,
        outcome: 'You both enjoy the peaceful silence together.'
      }
    ]
  },

  tadano_heart_to_heart: {
    id: 'tadano_heart_to_heart',
    name: 'Understanding Each Other',
    type: 'friendship_milestone',
    location: 'rooftop',
    timeSlot: 'lunch',
    npcsInvolved: ['tadano'],
    trigger: { relationship: { target: 'tadano', min: 70 } },
    once: true,
    description: 'Tadano seems troubled. He\'s staring at the sky, lost in thought.',
    choices: [
      {
        text: 'Ask what\'s on his mind',
        effects: { anxiety: 10, comfort: 5 },
        relationTarget: 'tadano',
        relationChange: 15,
        addFlag: 'tadano_confidant',
        outcome: 'Tadano opens up about the pressure of understanding everyone. You become his confidant.'
      },
      {
        text: 'Sit silently and offer your lunch',
        effects: { energy: -5, comfort: 10 },
        relationTarget: 'tadano',
        relationChange: 18,
        addFlag: 'tadano_confidant',
        outcome: 'He appreciates your quiet support. Sometimes presence is enough.'
      },
      {
        text: 'Make a joke to lighten the mood',
        effects: { anxiety: 5, popularity: 5 },
        relationTarget: 'tadano',
        relationChange: 10,
        outcome: 'He chuckles. The moment passes, but you helped.'
      }
    ]
  },

  najimi_secret_revealed: {
    id: 'najimi_secret_revealed',
    name: 'Najimi\'s Secret',
    type: 'character_story',
    location: 'hallway',
    timeSlot: 'evening',
    npcsInvolved: ['najimi'],
    trigger: { relationship: { target: 'najimi', min: 75 }, day: { min: 20 } },
    once: true,
    rarity: 'epic',
    description: 'For once, Najimi is alone and quiet. They seem... different.',
    choices: [
      {
        text: 'Ask if everything is okay',
        effects: { anxiety: 15, comfort: -5 },
        relationTarget: 'najimi',
        relationChange: 25,
        addFlag: 'najimi_true_friend',
        unlockEvent: 'najimi_backstory',
        outcome: 'Najimi reveals they sometimes feel lonely despite knowing everyone. You\'re a true friend now.'
      },
      {
        text: 'Offer to walk home together',
        effects: { energy: -10, comfort: 10 },
        relationTarget: 'najimi',
        relationChange: 20,
        addFlag: 'najimi_true_friend',
        outcome: 'On the walk, Najimi thanks you for seeing them as a person, not just a social butterfly.'
      },
      {
        text: 'Give them space',
        effects: { comfort: 5 },
        relationTarget: 'najimi',
        relationChange: 5,
        outcome: 'Sometimes people need to be alone.'
      }
    ]
  },

  // ==================== SCHOOL EVENT SCENARIOS ====================

  sports_festival: {
    id: 'sports_festival',
    name: 'Sports Festival',
    type: 'school_event',
    location: 'classroom',
    timeSlot: 'morning',
    trigger: { day: { min: 10, max: 12 } },
    once: true,
    description: 'The Sports Festival is today! Your class needs participants for the relay race.',
    choices: [
      {
        text: 'Volunteer immediately',
        effects: { anxiety: 25, energy: -20, popularity: 20 },
        relationTarget: 'random',
        relationChange: 15,
        addFlag: 'sports_hero',
        unlockMinigame: 'relay_race',
        outcome: 'You race and give it your all! Win or lose, everyone respects your courage.'
      },
      {
        text: 'Volunteer to cheer instead',
        effects: { anxiety: 10, popularity: 10, comfort: 5 },
        relationTarget: 'random',
        relationChange: 10,
        outcome: 'Your enthusiastic cheering boosts team morale!'
      },
      {
        text: 'Help with event logistics',
        effects: { academic: 5, popularity: 5 },
        relationTarget: 'onemine',
        relationChange: 15,
        outcome: 'Onemine appreciates your organizational help.'
      },
      {
        text: 'Try to hide',
        effects: { anxiety: -10, comfort: 10, popularity: -5 },
        outcome: 'You successfully avoid participation, but feel guilty.'
      }
    ]
  },

  cultural_festival_prep: {
    id: 'cultural_festival_prep',
    name: 'Cultural Festival Planning',
    type: 'school_event',
    location: 'classroom',
    timeSlot: 'afterschool',
    trigger: { day: { min: 18, max: 20 } },
    once: true,
    description: 'Your class is voting on what to do for the Cultural Festival.',
    choices: [
      {
        text: 'Suggest a Maid/Butler Café',
        effects: { anxiety: 20, popularity: 15 },
        addFlag: 'festival_cafe',
        outcome: 'The class loves the idea! Now you need to help set it up...'
      },
      {
        text: 'Suggest a Haunted House',
        effects: { anxiety: 15, creativity: 10 },
        addFlag: 'festival_haunted',
        unlockMinigame: 'haunted_house_design',
        outcome: 'The class votes yes! Time to create scares.'
      },
      {
        text: 'Suggest a Drama Performance',
        effects: { anxiety: 25, academic: 10 },
        addFlag: 'festival_drama',
        relationTarget: 'nakanaka',
        relationChange: 20,
        outcome: 'Nakanaka is ecstatic! She wants to direct.'
      },
      {
        text: 'Stay quiet and let others decide',
        effects: { anxiety: -5, comfort: 5 },
        outcome: 'The class decides on their own. You\'ll help with whatever they choose.'
      }
    ]
  },

  // ==================== RANDOM ENCOUNTER SCENARIOS ====================

  rainy_day_encounter: {
    id: 'rainy_day_encounter',
    name: 'Sudden Rain',
    type: 'random_encounter',
    location: 'hallway',
    timeSlot: 'afterschool',
    trigger: { random: 0.15 },
    description: 'It\'s pouring rain outside. Someone forgot their umbrella.',
    choices: [
      {
        text: 'Share your umbrella',
        effects: { anxiety: 15, comfort: 10, energy: -5 },
        relationTarget: 'random',
        relationChange: 20,
        addFlag: 'shared_umbrella',
        outcome: 'Walking together under one umbrella creates a special memory.'
      },
      {
        text: 'Lend them your umbrella',
        effects: { anxiety: 5, energy: -10, popularity: 10 },
        relationTarget: 'random',
        relationChange: 15,
        outcome: 'They\'re grateful. You get soaked running home, but it was worth it.'
      },
      {
        text: 'Wait for the rain to stop together',
        effects: { comfort: 15, energy: -5 },
        relationTarget: 'random',
        relationChange: 12,
        outcome: 'You talk and get to know each other better.'
      }
    ]
  },

  library_study_buddy: {
    id: 'library_study_buddy',
    name: 'Study Partner Found',
    type: 'random_encounter',
    location: 'library',
    timeSlot: ['afterschool', 'evening'],
    trigger: { random: 0.2, stat: { academic: { min: 40 } } },
    description: 'You notice someone struggling with the same subject you\'re good at.',
    choices: [
      {
        text: 'Offer to tutor them',
        effects: { anxiety: 10, academic: 5 },
        relationTarget: 'random',
        relationChange: 18,
        addFlag: 'tutor_helper',
        outcome: 'Teaching helps you understand better too. They\'re very grateful.'
      },
      {
        text: 'Suggest studying together',
        effects: { anxiety: 5, academic: 8 },
        relationTarget: 'random',
        relationChange: 15,
        addFlag: 'study_partner',
        outcome: 'You form a study group. Learning is easier together.'
      },
      {
        text: 'Leave study notes for them',
        effects: { academic: 3 },
        relationTarget: 'random',
        relationChange: 10,
        outcome: 'Anonymous help is help nonetheless.'
      }
    ]
  },

  cafeteria_food_incident: {
    id: 'cafeteria_food_incident',
    name: 'Lunch Mishap',
    type: 'random_encounter',
    location: 'cafeteria',
    timeSlot: 'lunch',
    trigger: { random: 0.18 },
    description: 'Someone accidentally spills their lunch tray near you!',
    choices: [
      {
        text: 'Help clean up immediately',
        effects: { anxiety: 5, popularity: 10 },
        relationTarget: 'random',
        relationChange: 15,
        outcome: 'They\'re embarrassed but grateful. You made a friend.'
      },
      {
        text: 'Share your lunch with them',
        effects: { anxiety: 10, energy: -10, comfort: 5 },
        relationTarget: 'random',
        relationChange: 20,
        outcome: 'An act of kindness they won\'t forget.'
      },
      {
        text: 'Take the blame yourself',
        effects: { anxiety: 20, popularity: -5, comfort: -10 },
        relationTarget: 'random',
        relationChange: 25,
        addFlag: 'selfless_act',
        outcome: 'You save them from embarrassment. They owe you big time.'
      },
      {
        text: 'Pretend not to notice',
        effects: { anxiety: -5, comfort: 5, popularity: -3 },
        outcome: 'You avoid the awkwardness but feel a bit guilty.'
      }
    ]
  },

  // ==================== SOCIAL CHALLENGES ====================

  public_speaking_terror: {
    id: 'public_speaking_terror',
    name: 'Presentation Day',
    type: 'challenge',
    location: 'classroom',
    timeSlot: 'class',
    trigger: { random: 0.12, stat: { anxiety: { min: 50 } } },
    description: 'You have to present in front of the class. Your anxiety is spiking.',
    choices: [
      {
        text: 'Push through with confidence',
        requireStat: { comfort: 60 },
        effects: { anxiety: 30, academic: 15, popularity: 15 },
        addFlag: 'overcame_fear',
        outcome: 'You did it! Your voice shook, but you finished. Everyone claps.'
      },
      {
        text: 'Ask Tadano for moral support',
        requireStat: { relationship: { target: 'tadano', min: 50 } },
        effects: { anxiety: 15, academic: 10 },
        relationTarget: 'tadano',
        relationChange: 10,
        outcome: 'Tadano gives you an encouraging nod. It helps more than you expected.'
      },
      {
        text: 'Use visual aids to deflect attention',
        effects: { anxiety: 20, academic: 12 },
        outcome: 'Smart! The slideshow carries most of the presentation.'
      },
      {
        text: 'Freeze and ask to go last',
        effects: { anxiety: 10, academic: -5, energy: -15 },
        outcome: 'You delay the inevitable, but the dread builds all day.'
      }
    ]
  },

  group_project_conflict: {
    id: 'group_project_conflict',
    name: 'Team Tensions',
    type: 'challenge',
    location: 'library',
    timeSlot: 'afterschool',
    trigger: { random: 0.15, flag: 'study_group' },
    description: 'Your group project is falling apart. Two members are arguing.',
    choices: [
      {
        text: 'Mediate the conflict',
        effects: { anxiety: 20, popularity: 10, academic: 5 },
        relationTarget: 'random',
        relationChange: 12,
        outcome: 'You help them see each other\'s perspectives. The project continues.'
      },
      {
        text: 'Do extra work to compensate',
        effects: { anxiety: 10, academic: 15, energy: -20 },
        outcome: 'You carry the team. Exhausting, but the grade will be good.'
      },
      {
        text: 'Suggest splitting the group',
        effects: { anxiety: 15, academic: 5 },
        relationTarget: 'random',
        relationChange: -5,
        outcome: 'Sometimes groups don\'t work. You find a new partner.'
      },
      {
        text: 'Report the issue to the teacher',
        effects: { anxiety: 10, popularity: -10, academic: 5 },
        outcome: 'The teacher intervenes. Your groupmates resent you a bit.'
      }
    ]
  },

  confession_misunderstanding: {
    id: 'confession_misunderstanding',
    name: 'Mixed Signals',
    type: 'challenge',
    location: 'rooftop',
    timeSlot: 'afterschool',
    trigger: { stat: { popularity: { min: 60 } }, random: 0.1 },
    description: 'Someone asks you to the rooftop. Is this... a confession?!',
    choices: [
      {
        text: 'Go and face whatever happens',
        effects: { anxiety: 30, comfort: -10 },
        addFlag: 'confession_handled',
        outcome: 'It WAS a confession. How you respond is up to you...'
      },
      {
        text: 'Bring a friend for support',
        effects: { anxiety: 20, popularity: 5 },
        relationTarget: 'najimi',
        relationChange: 10,
        outcome: 'Najimi helps defuse the situation with their charm.'
      },
      {
        text: 'Go but prepare a kind rejection',
        effects: { anxiety: 25, comfort: 5 },
        outcome: 'You let them down gently. It\'s awkward but respectful.'
      },
      {
        text: 'Don\'t show up',
        effects: { anxiety: -5, popularity: -15, comfort: -10 },
        outcome: 'You avoid the situation, but rumors spread. You feel terrible.'
      }
    ]
  },

  // ==================== MINI-GAME TRIGGER EVENTS ====================

  arcade_challenge: {
    id: 'arcade_challenge',
    name: 'After School Arcade',
    type: 'minigame_trigger',
    location: 'hallway',
    timeSlot: 'afterschool',
    trigger: { random: 0.12, relationship: { target: 'najimi', min: 40 } },
    description: 'Najimi invites you to the arcade! "Let\'s see if you can beat my high score~"',
    choices: [
      {
        text: 'Accept the challenge',
        effects: { energy: -10, anxiety: 5 },
        relationTarget: 'najimi',
        relationChange: 15,
        unlockMinigame: 'arcade_rhythm',
        outcome: 'Time to test your reflexes!'
      },
      {
        text: 'Suggest a co-op game instead',
        effects: { energy: -10, comfort: 10 },
        relationTarget: 'najimi',
        relationChange: 12,
        unlockMinigame: 'arcade_coop',
        outcome: 'Working together is more fun anyway!'
      },
      {
        text: 'Politely decline',
        effects: { energy: 5, comfort: 5 },
        relationTarget: 'najimi',
        relationChange: -3,
        outcome: 'Najimi is disappointed but understands.'
      }
    ]
  },

  cooking_club_invitation: {
    id: 'cooking_club',
    name: 'Join the Cooking Club',
    type: 'club_event',
    location: 'cafeteria',
    timeSlot: 'afterschool',
    trigger: { day: { min: 8 }, random: 0.1 },
    description: 'The Cooking Club is recruiting! They\'re making traditional Japanese sweets today.',
    choices: [
      {
        text: 'Join and try cooking',
        effects: { anxiety: 15, energy: -10 },
        relationTarget: 'random',
        relationChange: 15,
        addFlag: 'cooking_club_member',
        unlockMinigame: 'cooking_game',
        outcome: 'You discover a hidden talent for making sweets!'
      },
      {
        text: 'Just taste-test',
        effects: { energy: 10, comfort: 10 },
        relationTarget: 'random',
        relationChange: 8,
        outcome: 'You provide valuable feedback as a judge.'
      },
      {
        text: 'Not interested',
        effects: { comfort: 5 },
        outcome: 'Cooking isn\'t for everyone.'
      }
    ]
  },

  // ==================== CHARACTER-SPECIFIC DEEP DIVES ====================

  yamai_obsession_intervention: {
    id: 'yamai_intervention',
    name: 'Yamai\'s Obsession',
    type: 'character_story',
    location: 'classroom',
    timeSlot: 'lunch',
    npcsInvolved: ['yamai', 'komi'],
    trigger: { relationship: { target: 'komi', min: 60 }, relationship: { target: 'yamai', min: 30 } },
    once: true,
    rarity: 'rare',
    description: 'Yamai is being... particularly intense about Komi today. Komi looks uncomfortable.',
    choices: [
      {
        text: 'Gently distract Yamai',
        effects: { anxiety: 15, popularity: 5 },
        relationTarget: 'komi',
        relationChange: 15,
        relationTarget2: 'yamai',
        relationChange2: -5,
        outcome: 'Komi mouths "thank you." Yamai glares at you but backs off.'
      },
      {
        text: 'Invite Komi elsewhere',
        effects: { anxiety: 10, comfort: 5 },
        relationTarget: 'komi',
        relationChange: 20,
        relationTarget2: 'yamai',
        relationChange2: -10,
        addFlag: 'yamai_rival',
        outcome: 'You rescue Komi. Yamai now sees you as competition.'
      },
      {
        text: 'Try to befriend Yamai instead',
        effects: { anxiety: 20, comfort: -5 },
        relationTarget: 'yamai',
        relationChange: 15,
        outcome: 'Understanding Yamai\'s loneliness helps calm her obsession.'
      },
      {
        text: 'Do nothing',
        effects: { anxiety: -5 },
        relationTarget: 'komi',
        relationChange: -5,
        outcome: 'Sometimes interfering makes things worse... right?'
      }
    ]
  },

  nakanaka_chuuni_crisis: {
    id: 'nakanaka_crisis',
    name: 'The Sealed Power Awakens',
    type: 'character_story',
    location: 'rooftop',
    timeSlot: 'lunch',
    npcsInvolved: ['nakanaka'],
    trigger: { relationship: { target: 'nakanaka', min: 50 } },
    once: true,
    description: 'Nakanaka is alone, not in character. She looks... sad.',
    choices: [
      {
        text: 'Play along with her character',
        effects: { anxiety: 10, creativity: 5 },
        relationTarget: 'nakanaka',
        relationChange: 20,
        addFlag: 'nakanaka_ally',
        outcome: '"You understand my power!" She\'s genuinely happy someone plays along.'
      },
      {
        text: 'Ask about her real feelings',
        effects: { anxiety: 15, comfort: 10 },
        relationTarget: 'nakanaka',
        relationChange: 25,
        addFlag: 'nakanaka_real_friend',
        outcome: 'She opens up about feeling lonely. Her character is armor.'
      },
      {
        text: 'Share your own "sealed power"',
        effects: { anxiety: 20, creativity: 10 },
        relationTarget: 'nakanaka',
        relationChange: 30,
        addFlag: 'chuuni_duo',
        unlockEvent: 'chuuni_adventure',
        outcome: 'You create elaborate backstories together. It\'s surprisingly fun!'
      }
    ]
  },

  // ==================== EXAM AND ACADEMIC SCENARIOS ====================

  midterm_crisis: {
    id: 'midterm_crisis',
    name: 'Midterm Panic',
    type: 'academic_challenge',
    location: 'library',
    timeSlot: 'evening',
    trigger: { day: { min: 15, max: 17 } },
    once: true,
    description: 'Midterms are tomorrow. You\'re not ready. The library is full of stressed students.',
    choices: [
      {
        text: 'All-night cram session',
        effects: { anxiety: 25, academic: 20, energy: -40 },
        addFlag: 'exam_prepared',
        outcome: 'You studied until dawn. Exhausted but ready.'
      },
      {
        text: 'Join a study group',
        effects: { anxiety: 15, academic: 15, energy: -20 },
        relationTarget: 'random',
        relationChange: 10,
        addFlag: 'group_study',
        outcome: 'Studying together relieves stress and improves retention.'
      },
      {
        text: 'Ask Komi for help',
        requireStat: { relationship: { target: 'komi', min: 60 } },
        effects: { anxiety: 10, academic: 18, energy: -15 },
        relationTarget: 'komi',
        relationChange: 15,
        outcome: 'Komi is an excellent tutor through written notes.'
      },
      {
        text: 'Accept your fate and rest',
        effects: { anxiety: -10, energy: 30, academic: -5 },
        outcome: 'Sometimes health > grades. You\'ll do your best tomorrow.'
      }
    ]
  },

  // ==================== SEASONAL & WEATHER EVENTS ====================

  first_snow: {
    id: 'first_snow',
    name: 'First Snow',
    type: 'seasonal_event',
    location: 'rooftop',
    timeSlot: ['lunch', 'afterschool'],
    trigger: { day: { min: 25 }, random: 0.2 },
    once: true,
    description: 'Snow is falling for the first time this year. The rooftop has a magical atmosphere.',
    choices: [
      {
        text: 'Catch snowflakes',
        effects: { comfort: 20, anxiety: -10, energy: 5 },
        outcome: 'The simple joy of snow brings peace.'
      },
      {
        text: 'Invite someone to watch',
        effects: { anxiety: 15, comfort: 10 },
        relationTarget: 'random',
        relationChange: 20,
        addFlag: 'snow_memory',
        outcome: 'Sharing the first snow creates a cherished memory.'
      },
      {
        text: 'Make a wish',
        effects: { comfort: 15, anxiety: -5 },
        addFlag: 'winter_wish',
        outcome: 'You make a secret wish on the first snowfall.'
      }
    ]
  },

  cherry_blossom_viewing: {
    id: 'cherry_blossom',
    name: 'Hanami Party',
    type: 'seasonal_event',
    location: 'rooftop',
    timeSlot: 'lunch',
    trigger: { day: { min: 5, max: 7 } },
    once: true,
    description: 'The cherry blossoms are in full bloom! Some classmates want to have lunch under them.',
    choices: [
      {
        text: 'Organize the hanami party',
        effects: { anxiety: 20, popularity: 20, energy: -15 },
        relationTarget: 'random',
        relationChange: 15,
        addFlag: 'party_organizer',
        outcome: 'Everyone has a wonderful time. You made this happen!'
      },
      {
        text: 'Bring homemade food',
        effects: { anxiety: 10, popularity: 10 },
        relationTarget: 'random',
        relationChange: 12,
        outcome: 'Your cooking is a hit! People want to know the recipe.'
      },
      {
        text: 'Just enjoy peacefully',
        effects: { comfort: 20, anxiety: -10 },
        outcome: 'The beauty of cherry blossoms brings tranquility.'
      }
    ]
  },

  // ==================== LATE-GAME SCENARIOS ====================

  graduation_approach: {
    id: 'graduation_approach',
    name: 'Looking Toward Graduation',
    type: 'story_milestone',
    location: 'rooftop',
    timeSlot: 'afterschool',
    trigger: { day: { min: 28 } },
    once: true,
    rarity: 'epic',
    description: 'The school year is almost over. You reflect on everything that happened.',
    choices: [
      {
        text: 'Write letters to friends',
        effects: { anxiety: 15, comfort: 20 },
        relationTarget: 'all',
        relationChange: 10,
        addFlag: 'wrote_letters',
        outcome: 'Expressing gratitude brings closure and strengthens bonds.'
      },
      {
        text: 'Take photos with everyone',
        effects: { anxiety: 10, popularity: 10 },
        relationTarget: 'all',
        relationChange: 8,
        addFlag: 'photo_memories',
        outcome: 'These photos will be treasures forever.'
      },
      {
        text: 'Spend time with closest friend',
        effects: { anxiety: 5, comfort: 25 },
        relationTarget: 'highest',
        relationChange: 25,
        addFlag: 'deepest_bond',
        outcome: 'Quality time with your best friend is priceless.'
      },
      {
        text: 'Reflect alone',
        effects: { comfort: 15, anxiety: -10 },
        outcome: 'You\'ve grown so much. You\'re ready for what comes next.'
      }
    ]
  },

  confession_finale: {
    id: 'confession_finale',
    name: 'A Heartfelt Confession',
    type: 'romance_milestone',
    location: 'rooftop',
    timeSlot: 'afterschool',
    trigger: { day: { min: 28 }, relationship: { target: 'any', min: 90 } },
    once: true,
    rarity: 'legendary',
    description: 'Someone you\'re close to asks to meet you. They have something important to say...',
    choices: [
      {
        text: 'Accept their feelings',
        effects: { anxiety: 30, comfort: 30, popularity: 10 },
        relationTarget: 'highest',
        relationChange: 50,
        addFlag: 'true_love_ending',
        outcome: 'Your hearts connect. This is the beginning of something beautiful.'
      },
      {
        text: 'Stay as precious friends',
        effects: { anxiety: 20, comfort: 10 },
        relationTarget: 'highest',
        relationChange: 20,
        addFlag: 'eternal_friendship',
        outcome: 'Some bonds are stronger as friendship. They understand.'
      },
      {
        text: 'Need time to think',
        effects: { anxiety: 25, comfort: -5 },
        relationTarget: 'highest',
        relationChange: 10,
        outcome: 'Big decisions need time. They\'ll wait for your answer.'
      }
    ]
  }
};

// Time-based location availability
export const LOCATION_AVAILABILITY = {
  home: ['morning', 'evening'],
  classroom: ['morning', 'class', 'afterschool'],
  cafeteria: ['morning', 'lunch', 'afterschool'],
  library: ['morning', 'lunch', 'afterschool', 'evening'],
  hallway: ['morning', 'class', 'lunch', 'afterschool', 'evening'],
  rooftop: ['lunch', 'afterschool']
};

// Mini-game definitions
export const MINIGAMES = {
  notebook_exchange: {
    name: 'Notebook Conversation',
    description: 'Communicate with Komi through written notes',
    difficulty: 'easy'
  },
  relay_race: {
    name: 'Sports Festival Relay',
    description: 'Time your baton pass perfectly!',
    difficulty: 'medium'
  },
  haunted_house_design: {
    name: 'Haunted House Planner',
    description: 'Design the scariest route',
    difficulty: 'medium'
  },
  arcade_rhythm: {
    name: 'Rhythm Game',
    description: 'Hit the notes in time!',
    difficulty: 'hard'
  },
  arcade_coop: {
    name: 'Co-op Fighter',
    description: 'Team up to beat the boss',
    difficulty: 'medium'
  },
  cooking_game: {
    name: 'Japanese Sweets Making',
    description: 'Follow the recipe perfectly',
    difficulty: 'medium'
  }
};

// Rarity system for events
export const EVENT_RARITY = {
  common: { weight: 1.0, color: 'slate' },
  uncommon: { weight: 0.6, color: 'blue' },
  rare: { weight: 0.3, color: 'purple' },
  epic: { weight: 0.15, color: 'pink' },
  legendary: { weight: 0.05, color: 'amber' }
};