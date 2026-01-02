// NPC Characters
export const NPC_CHARACTERS = [
  { id: 'komi', name: 'Komi Shouko', avatar: '👸', baseAffinity: 30 },
  { id: 'tadano', name: 'Tadano Hitohito', avatar: '🧑', baseAffinity: 50 },
  { id: 'najimi', name: 'Najimi Osana', avatar: '😜', baseAffinity: 70 },
  { id: 'yamai', name: 'Yamai Ren', avatar: '💕', baseAffinity: 40 },
  { id: 'nakanaka', name: 'Nakanaka Omoharu', avatar: '🔮', baseAffinity: 35 },
  { id: 'katai', name: 'Katai Makoto', avatar: '💪', baseAffinity: 45 },
  { id: 'onemine', name: 'Onemine Nene', avatar: '🌸', baseAffinity: 60 },
  { id: 'otori', name: 'Otori Kaede', avatar: '🐢', baseAffinity: 55 },
  { id: 'agari', name: 'Agari Himiko', avatar: '🍖', baseAffinity: 40 },
  { id: 'ase', name: 'Ase Shibuki', avatar: '💧', baseAffinity: 45 }
];

// Locations with availability
export const LOCATIONS = [
  { 
    id: 'home', 
    name: 'Home', 
    icon: '🏠', 
    description: 'Rest and recover your energy',
    availableAt: ['morning', 'evening']
  },
  { 
    id: 'classroom', 
    name: 'Classroom', 
    icon: '📚', 
    description: 'Study and interact with classmates',
    availableAt: ['morning', 'class', 'afterschool']
  },
  { 
    id: 'cafeteria', 
    name: 'Cafeteria', 
    icon: '🍱', 
    description: 'Eat lunch and make friends',
    availableAt: ['morning', 'lunch', 'afterschool']
  },
  { 
    id: 'hallway', 
    name: 'Hallway', 
    icon: '🚶', 
    description: 'Random encounters await',
    availableAt: ['morning', 'class', 'lunch', 'afterschool', 'evening']
  },
  { 
    id: 'rooftop', 
    name: 'Rooftop', 
    icon: '🌤️', 
    description: 'Peaceful place for deep conversations',
    availableAt: ['lunch', 'afterschool']
  },
  { 
    id: 'library', 
    name: 'Library', 
    icon: '📖', 
    description: 'Study or find someone reading alone',
    availableAt: ['morning', 'lunch', 'afterschool', 'evening']
  },
  {
    id: 'club_room',
    name: 'Club Room',
    icon: '🎭',
    description: 'Attend your club activities',
    availableAt: ['afterschool'],
    requiresClub: true
  }
];

// Time slots
export const TIME_SLOTS = [
  { id: 'morning', name: 'Morning', icon: '🌅' },
  { id: 'class', name: 'Class Time', icon: '📝' },
  { id: 'lunch', name: 'Lunch', icon: '🍱' },
  { id: 'afterschool', name: 'After School', icon: '🌆' },
  { id: 'evening', name: 'Evening', icon: '🌙' }
];

// Events by location and time
export const EVENTS = {
  classroom: {
    morning: [
      {
        id: 'classroom_morning_1',
        title: 'Desk Neighbor',
        description: 'Someone sits next to you and glances over nervously.',
        choices: [
          { text: 'Say good morning', effects: { anxiety: 5, comfort: -5, popularity: 3 }, relationTarget: 'random', relationChange: 5 },
          { text: 'Nod silently', effects: { anxiety: -5, comfort: 5, popularity: 1 }, relationTarget: 'random', relationChange: 2 },
          { text: 'Pretend to be asleep', effects: { anxiety: -10, comfort: 10 } }
        ]
      },
      {
        id: 'classroom_morning_2',
        title: 'Early Bird',
        description: 'You arrived early. The classroom is almost empty.',
        choices: [
          { text: 'Study quietly', effects: { academic: 5, comfort: 5 } },
          { text: 'Look out the window', effects: { comfort: 10, energy: 5 } },
          { text: 'Review notes nervously', effects: { academic: 3, anxiety: 5 } }
        ]
      }
    ],
    class: [
      {
        id: 'classroom_class_1',
        title: 'Called On',
        description: 'The teacher calls your name to answer a question!',
        choices: [
          { text: 'Answer confidently', effects: { anxiety: 10, academic: 5, popularity: 5 }, requireStat: { academic: 60 } },
          { text: 'Mumble an answer', effects: { anxiety: 5, academic: 2 } },
          { text: 'Freeze up completely', effects: { anxiety: 15, popularity: -3 } }
        ]
      },
      {
        id: 'classroom_class_2',
        title: 'Group Project',
        description: 'Time to form groups for a project.',
        choices: [
          { text: 'Ask someone to join', effects: { anxiety: 15, popularity: 5 }, relationTarget: 'random', relationChange: 10 },
          { text: 'Wait to be asked', effects: { anxiety: 5 } },
          { text: 'Work alone', effects: { anxiety: -5, comfort: 5, academic: 3 } }
        ]
      }
    ],
    lunch: [
      {
        id: 'classroom_lunch_1',
        title: 'Lunch Alone',
        description: 'You eat at your desk. Someone approaches...',
        choices: [
          { text: 'Invite them to join', effects: { anxiety: 10, popularity: 5 }, relationTarget: 'random', relationChange: 8 },
          { text: 'Continue eating quietly', effects: { comfort: 5, energy: 10 } },
          { text: 'Quickly finish and leave', effects: { anxiety: -5, energy: 5 } }
        ]
      }
    ],
    afterschool: [
      {
        id: 'classroom_after_1',
        title: 'Cleaning Duty',
        description: 'It\'s your turn for cleaning duty.',
        choices: [
          { text: 'Chat while cleaning', effects: { anxiety: 5, popularity: 3 }, relationTarget: 'random', relationChange: 5 },
          { text: 'Clean efficiently', effects: { academic: 2, energy: -5 } },
          { text: 'Slack off a bit', effects: { comfort: 5, energy: 10 } }
        ]
      }
    ],
    evening: [
      {
        id: 'classroom_evening_1',
        title: 'Late Study',
        description: 'The classroom is empty. Perfect for studying.',
        choices: [
          { text: 'Study hard', effects: { academic: 10, energy: -15 } },
          { text: 'Daydream', effects: { comfort: 10, anxiety: -5 } },
          { text: 'Head home', effects: { energy: 5 } }
        ]
      }
    ]
  },
  cafeteria: {
    morning: [
      {
        id: 'cafeteria_morning_1',
        title: 'Early Breakfast',
        description: 'The cafeteria is serving breakfast.',
        choices: [
          { text: 'Eat with others', effects: { anxiety: 5, energy: 15, popularity: 2 } },
          { text: 'Grab something quick', effects: { energy: 10 } },
          { text: 'Skip breakfast', effects: { energy: -5, anxiety: -5 } }
        ]
      }
    ],
    class: [],
    lunch: [
      {
        id: 'cafeteria_lunch_1',
        title: 'Crowded Table',
        description: 'The only empty seat is at a table full of students.',
        choices: [
          { text: 'Ask to sit', effects: { anxiety: 15, popularity: 8 }, relationTarget: 'random', relationChange: 10 },
          { text: 'Find a corner', effects: { comfort: 5, anxiety: -5 } },
          { text: 'Eat standing up', effects: { energy: 5, anxiety: 5 } }
        ]
      },
      {
        id: 'cafeteria_lunch_2',
        title: 'Food Recommendation',
        description: 'Someone asks what you\'re eating.',
        choices: [
          { text: 'Explain enthusiastically', effects: { anxiety: 10, popularity: 5 }, relationTarget: 'random', relationChange: 5 },
          { text: 'Show them wordlessly', effects: { anxiety: 5, comfort: 5 }, relationTarget: 'random', relationChange: 3 },
          { text: 'Mumble "nothing special"', effects: { anxiety: 5 } }
        ]
      }
    ],
    afterschool: [
      {
        id: 'cafeteria_after_1',
        title: 'Snack Time',
        description: 'Some students are hanging out in the cafeteria.',
        choices: [
          { text: 'Join them', effects: { anxiety: 10, popularity: 5, energy: 5 }, relationTarget: 'random', relationChange: 8 },
          { text: 'Get a snack alone', effects: { energy: 10, comfort: 5 } },
          { text: 'Watch from afar', effects: { anxiety: 5 } }
        ]
      }
    ],
    evening: []
  },
  hallway: {
    morning: [
      {
        id: 'hallway_morning_1',
        title: 'Morning Rush',
        description: 'Students hurry past. Someone bumps into you.',
        choices: [
          { text: 'Accept their apology', effects: { comfort: 5 }, relationTarget: 'random', relationChange: 3 },
          { text: 'Help pick up their things', effects: { anxiety: 5, popularity: 5 }, relationTarget: 'random', relationChange: 8 },
          { text: 'Walk away quickly', effects: { anxiety: -5 } }
        ]
      }
    ],
    class: [
      {
        id: 'hallway_class_1',
        title: 'Bathroom Break',
        description: 'You sneak out for a bathroom break and see someone crying.',
        choices: [
          { text: 'Ask if they\'re okay', effects: { anxiety: 15, comfort: -5 }, relationTarget: 'random', relationChange: 15 },
          { text: 'Pretend not to see', effects: { anxiety: 5, comfort: 5 } },
          { text: 'Leave quietly', effects: { anxiety: -5 } }
        ]
      }
    ],
    lunch: [
      {
        id: 'hallway_lunch_1',
        title: 'Hallway Encounter',
        description: 'You see Komi walking alone, looking nervous.',
        choices: [
          { text: 'Wave at her', effects: { anxiety: 10 }, relationTarget: 'komi', relationChange: 5 },
          { text: 'Walk alongside silently', effects: { comfort: 5 }, relationTarget: 'komi', relationChange: 8 },
          { text: 'Give her space', effects: { comfort: 5 } }
        ],
        specificNpc: 'komi'
      }
    ],
    afterschool: [
      {
        id: 'hallway_after_1',
        title: 'Locker Time',
        description: 'Students chat by the lockers.',
        choices: [
          { text: 'Join a conversation', effects: { anxiety: 15, popularity: 8 }, relationTarget: 'random', relationChange: 5 },
          { text: 'Quickly get your things', effects: { energy: 5 } },
          { text: 'Listen from nearby', effects: { anxiety: 5 } }
        ]
      }
    ],
    evening: [
      {
        id: 'hallway_evening_1',
        title: 'Empty Halls',
        description: 'The hallway is quiet and peaceful.',
        choices: [
          { text: 'Enjoy the silence', effects: { comfort: 15, anxiety: -10 } },
          { text: 'Walk around exploring', effects: { energy: -5, comfort: 5 } }
        ]
      }
    ]
  },
  rooftop: {
    morning: [],
    class: [],
    lunch: [
      {
        id: 'rooftop_lunch_1',
        title: 'Secret Spot',
        description: 'The rooftop is quiet. Someone else is here.',
        choices: [
          { text: 'Sit near them', effects: { anxiety: 5 }, relationTarget: 'random', relationChange: 10 },
          { text: 'Find your own spot', effects: { comfort: 15, anxiety: -10 } },
          { text: 'Share your lunch', effects: { anxiety: 10, energy: -5 }, relationTarget: 'random', relationChange: 15 }
        ]
      },
      {
        id: 'rooftop_lunch_2',
        title: 'Peaceful View',
        description: 'You find Tadano eating alone, looking at the sky.',
        choices: [
          { text: 'Join him', effects: { anxiety: 5, comfort: 5 }, relationTarget: 'tadano', relationChange: 10 },
          { text: 'Comment on the view', effects: { anxiety: 10 }, relationTarget: 'tadano', relationChange: 5 },
          { text: 'Eat separately', effects: { comfort: 10 } }
        ],
        specificNpc: 'tadano'
      }
    ],
    afterschool: [
      {
        id: 'rooftop_after_1',
        title: 'Sunset Confession?',
        description: 'The sunset is beautiful. You hear voices nearby...',
        choices: [
          { text: 'Listen curiously', effects: { anxiety: 5 } },
          { text: 'Leave them alone', effects: { comfort: 5 } },
          { text: 'Watch the sunset', effects: { comfort: 15, anxiety: -10 } }
        ]
      }
    ],
    evening: [
      {
        id: 'rooftop_evening_1',
        title: 'Night Sky',
        description: 'Stars are visible from here.',
        choices: [
          { text: 'Stargaze peacefully', effects: { comfort: 20, anxiety: -15, energy: -10 } },
          { text: 'Head home', effects: { energy: 5 } }
        ]
      }
    ]
  },
  library: {
    morning: [
      {
        id: 'library_morning_1',
        title: 'Early Reader',
        description: 'The library is quiet. Perfect for studying.',
        choices: [
          { text: 'Study diligently', effects: { academic: 10, energy: -5 } },
          { text: 'Read a novel', effects: { comfort: 10, energy: 5 } },
          { text: 'Doze off', effects: { energy: 15, anxiety: -5 } }
        ]
      }
    ],
    class: [],
    lunch: [
      {
        id: 'library_lunch_1',
        title: 'Study Companion',
        description: 'Someone is struggling with homework.',
        choices: [
          { text: 'Offer to help', effects: { anxiety: 10, academic: 3 }, relationTarget: 'random', relationChange: 12 },
          { text: 'Study nearby', effects: { academic: 5, comfort: 5 } },
          { text: 'Focus on your work', effects: { academic: 8 } }
        ]
      }
    ],
    afterschool: [
      {
        id: 'library_after_1',
        title: 'Book Club',
        description: 'A small group is discussing a book.',
        choices: [
          { text: 'Join the discussion', effects: { anxiety: 15, popularity: 5, academic: 5 }, relationTarget: 'random', relationChange: 8 },
          { text: 'Listen quietly', effects: { academic: 3, comfort: 5 } },
          { text: 'Find a different section', effects: { comfort: 5 } }
        ]
      }
    ],
    evening: [
      {
        id: 'library_evening_1',
        title: 'Closing Time',
        description: 'The librarian is about to close up.',
        choices: [
          { text: 'Borrow a book', effects: { academic: 5 } },
          { text: 'Help shelve books', effects: { popularity: 3, academic: 2 } },
          { text: 'Leave quickly', effects: { energy: 5 } }
        ]
      }
    ]
  },
  home: {
    morning: [
      {
        id: 'home_morning_1',
        title: 'Morning Routine',
        description: 'Time to start the day.',
        choices: [
          { text: 'Exercise briefly', effects: { energy: 15, anxiety: -5 } },
          { text: 'Eat a good breakfast', effects: { energy: 20, comfort: 5 } },
          { text: 'Rush out', effects: { anxiety: 10, energy: -5 } }
        ]
      }
    ],
    class: [],
    lunch: [],
    afterschool: [
      {
        id: 'home_after_1',
        title: 'After School',
        description: 'You\'re back home.',
        choices: [
          { text: 'Do homework', effects: { academic: 10, energy: -10 } },
          { text: 'Relax and watch TV', effects: { comfort: 15, energy: 10 } },
          { text: 'Take a nap', effects: { energy: 25, comfort: 10 } }
        ]
      }
    ],
    evening: [
      {
        id: 'home_evening_1',
        title: 'Evening Time',
        description: 'The day is winding down.',
        choices: [
          { text: 'Study more', effects: { academic: 8, energy: -15 } },
          { text: 'Chat online', effects: { popularity: 3, anxiety: 5 }, relationTarget: 'najimi', relationChange: 5 },
          { text: 'Go to bed early', effects: { energy: 30, comfort: 10, anxiety: -10 } }
        ]
      }
    ]
  }
};

// Special Events (triggered by conditions)
export const SPECIAL_EVENTS = [
  {
    id: 'komi_note',
    title: 'A Written Message',
    description: 'Komi holds up a notebook. It says "Would you... like to be friends?"',
    trigger: { relationship: { target: 'komi', min: 50 } },
    choices: [
      { text: 'Write back "Yes!"', effects: { anxiety: 20, comfort: 20, popularity: 10 }, relationTarget: 'komi', relationChange: 25, addFlag: 'komi_friend' },
      { text: 'Nod enthusiastically', effects: { anxiety: 15, comfort: 15 }, relationTarget: 'komi', relationChange: 20, addFlag: 'komi_friend' },
      { text: 'Freeze in shock', effects: { anxiety: 25 }, relationTarget: 'komi', relationChange: 5 }
    ]
  },
  {
    id: 'najimi_chaos',
    title: 'Najimi\'s Scheme',
    description: 'Najimi appears out of nowhere with a mischievous grin. "Hey! Let\'s do something fun~"',
    trigger: { relationship: { target: 'najimi', min: 40 } },
    choices: [
      { text: 'Go along with it', effects: { anxiety: 15, popularity: 10, energy: -10 }, relationTarget: 'najimi', relationChange: 15, addFlag: 'najimi_adventure' },
      { text: 'Ask what they\'re planning', effects: { anxiety: 5 }, relationTarget: 'najimi', relationChange: 5 },
      { text: 'Run away', effects: { anxiety: -10, energy: -5 } }
    ]
  },
  {
    id: 'festival_prep',
    title: 'School Festival!',
    description: 'The annual school festival is coming! Your class needs to decide on a booth.',
    trigger: { day: { min: 15 } },
    once: true,
    choices: [
      { text: 'Suggest a maid café', effects: { anxiety: 20, popularity: 15 }, addFlag: 'festival_maid' },
      { text: 'Suggest a quiet exhibit', effects: { anxiety: 5, comfort: 10 }, addFlag: 'festival_exhibit' },
      { text: 'Stay silent', effects: { anxiety: -5 } }
    ]
  },
  {
    id: 'exam_week',
    title: 'Exam Week Approaches',
    description: 'Finals are next week! Everyone seems stressed.',
    trigger: { day: { min: 25 } },
    once: true,
    choices: [
      { text: 'Form a study group', effects: { anxiety: 15, academic: 10 }, relationTarget: 'random', relationChange: 10, addFlag: 'study_group' },
      { text: 'Study alone intensely', effects: { academic: 15, energy: -20, anxiety: 10 } },
      { text: 'Wing it', effects: { comfort: 10, anxiety: 5 } }
    ]
  },
  {
    id: 'confession_received',
    title: 'Love Letter?!',
    description: 'You find a letter in your locker... It\'s a confession!',
    trigger: { stat: { popularity: { min: 60 } }, day: { min: 20 } },
    once: true,
    choices: [
      { text: 'Meet them after school', effects: { anxiety: 25, popularity: 5 }, addFlag: 'confession_met' },
      { text: 'Politely decline', effects: { anxiety: 15, comfort: 5 } },
      { text: 'Panic and hide', effects: { anxiety: 30 } }
    ]
  }
];

// Random dialogue snippets
export const RANDOM_DIALOGUE = {
  komi: [
    '*nods*',
    '*writes in notebook* "Good morning"',
    '*waves shyly*',
    '*trembles nervously*',
    '*small smile*'
  ],
  tadano: [
    '"Oh, hey there."',
    '"Need any help?"',
    '"I noticed you seemed...',
    '"Want to walk together?"',
    '"That was a tough class, huh?"'
  ],
  najimi: [
    '"Hey hey hey~!"',
    '"I know someone who knows someone!"',
    '"Let\'s go do something fun!"',
    '"You look bored! Perfect!"',
    '"I\'ve got an idea~"'
  ],
  yamai: [
    '"Have you seen Komi-san?!"',
    '"Stay away from my goddess!"',
    '*glares intensely*',
    '"Komi-san is so beautiful today..."',
    '"I would die for Komi-san..."'
  ],
  nakanaka: [
    '"The darkness within me stirs..."',
    '"You dare approach me, mortal?"',
    '"My sealed power is restless today..."',
    '*dramatic pose*',
    '"Few can withstand my aura..."'
  ]
};

// Endings
export const ENDINGS = {
  quiet_happy: {
    title: 'Quiet but Happy',
    description: 'You found peace in small moments and genuine connections.',
    requirement: { friendCount: { min: 3 }, anxiety: { max: 40 }, comfort: { min: 60 } }
  },
  popular: {
    title: 'Popular Student',
    description: 'You became one of the most well-known students at Itan High!',
    requirement: { popularity: { min: 80 }, friendCount: { min: 10 } }
  },
  komi_friend: {
    title: 'Komi\'s Precious Friend',
    description: 'You became one of Komi\'s closest friends. She can speak to you without her notebook.',
    requirement: { flag: 'komi_friend', relationship: { target: 'komi', min: 80 } }
  },
  romantic: {
    title: 'Love Blooms',
    description: 'Your feelings have blossomed into something beautiful.',
    requirement: { romanceLevel: { min: 80 } }
  },
  chaotic: {
    title: 'Najimi\'s Partner in Crime',
    description: 'You and Najimi have become an unstoppable duo of chaos.',
    requirement: { flag: 'najimi_adventure', relationship: { target: 'najimi', min: 80 } }
  },
  academic: {
    title: 'Top of the Class',
    description: 'Your dedication paid off. You\'re now among the top students.',
    requirement: { academic: { min: 90 } }
  },
  loner: {
    title: 'Peaceful Solitude',
    description: 'You found comfort in your own company.',
    requirement: { friendCount: { max: 2 }, comfort: { min: 70 } }
  },
  default: {
    title: 'School Days',
    description: 'An ordinary but memorable year at Itan Private High School.',
    requirement: {}
  }
};