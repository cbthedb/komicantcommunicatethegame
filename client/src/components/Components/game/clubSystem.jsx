// CLUB SYSTEM

export const CLUBS = {
  literature: {
    id: 'literature',
    name: 'Literature Club',
    description: 'Read and discuss books, write poetry, and enjoy the quiet world of literature.',
    meetingTimes: ['afterschool'],
    memberBenefit: { academic: 2, comfort: 5 },
    requirements: { academic: 30 },
    president: 'komi',
    activities: [
      {
        id: 'book_discussion',
        name: 'Book Discussion',
        description: 'Discuss this week\'s reading selection.',
        effects: { academic: 5, anxiety: 10, comfort: 5 },
        relationBonus: ['komi', 'tadano']
      },
      {
        id: 'poetry_writing',
        name: 'Poetry Writing',
        description: 'Express yourself through written words.',
        effects: { academic: 3, comfort: 10, anxiety: -5 },
        relationBonus: ['komi']
      }
    ]
  },

  drama: {
    id: 'drama',
    name: 'Drama Club',
    description: 'Act, perform, and bring stories to life on stage. Perfect for overcoming stage fright!',
    meetingTimes: ['afterschool'],
    memberBenefit: { anxiety: -3, popularity: 5 },
    requirements: { popularity: 20 },
    president: 'nakanaka',
    activities: [
      {
        id: 'rehearsal',
        name: 'Play Rehearsal',
        description: 'Practice your lines and blocking for the upcoming performance.',
        effects: { anxiety: 15, popularity: 8, comfort: -5 },
        relationBonus: ['nakanaka', 'yamai']
      },
      {
        id: 'improv',
        name: 'Improv Session',
        description: 'Think on your feet and create spontaneous scenes.',
        effects: { anxiety: 20, popularity: 10 },
        relationBonus: ['najimi', 'nakanaka']
      }
    ]
  },

  cooking: {
    id: 'cooking',
    name: 'Cooking Club',
    description: 'Learn to cook delicious meals and treats. Great for making friends over food!',
    meetingTimes: ['afterschool'],
    memberBenefit: { comfort: 5, energy: 5 },
    requirements: {},
    president: 'onemine',
    activities: [
      {
        id: 'baking',
        name: 'Baking Session',
        description: 'Make delicious sweets and pastries.',
        effects: { energy: 10, comfort: 10, popularity: 5 },
        relationBonus: ['onemine', 'agari']
      },
      {
        id: 'cooking_competition',
        name: 'Cooking Competition',
        description: 'Compete to make the best dish!',
        effects: { anxiety: 15, energy: -10, popularity: 10 },
        relationBonus: ['onemine', 'najimi']
      }
    ]
  },

  sports: {
    id: 'sports',
    name: 'Sports Club',
    description: 'Stay active and build teamwork through various sports and activities.',
    meetingTimes: ['afterschool'],
    memberBenefit: { energy: 10, anxiety: -5 },
    requirements: { energy: 40 },
    president: 'katai',
    activities: [
      {
        id: 'practice',
        name: 'Team Practice',
        description: 'Train with your teammates.',
        effects: { energy: -15, comfort: 10, popularity: 5 },
        relationBonus: ['katai', 'tadano']
      },
      {
        id: 'friendly_match',
        name: 'Friendly Match',
        description: 'Play a casual game against another team.',
        effects: { energy: -20, anxiety: 10, popularity: 10 },
        relationBonus: ['katai', 'najimi']
      }
    ]
  },

  art: {
    id: 'art',
    name: 'Art Club',
    description: 'Express creativity through painting, drawing, and various art forms.',
    meetingTimes: ['afterschool'],
    memberBenefit: { comfort: 8, anxiety: -5 },
    requirements: { comfort: 30 },
    president: 'otori',
    activities: [
      {
        id: 'free_draw',
        name: 'Free Drawing',
        description: 'Draw whatever inspires you today.',
        effects: { comfort: 15, anxiety: -10 },
        relationBonus: ['otori', 'komi']
      },
      {
        id: 'group_project',
        name: 'Collaborative Mural',
        description: 'Work together on a large art piece.',
        effects: { comfort: 10, anxiety: 5, popularity: 8 },
        relationBonus: ['otori', 'nakanaka']
      }
    ]
  },

  music: {
    id: 'music',
    name: 'Music Club',
    description: 'Play instruments, sing, and create harmonious melodies together.',
    meetingTimes: ['afterschool'],
    memberBenefit: { comfort: 10, popularity: 3 },
    requirements: { popularity: 25 },
    president: 'ase',
    activities: [
      {
        id: 'band_practice',
        name: 'Band Practice',
        description: 'Jam with the band and perfect your sound.',
        effects: { anxiety: 10, comfort: 10, popularity: 5 },
        relationBonus: ['ase', 'najimi']
      },
      {
        id: 'solo_performance',
        name: 'Solo Performance',
        description: 'Perform a piece by yourself for the club.',
        effects: { anxiety: 25, popularity: 15, comfort: -10 },
        relationBonus: ['ase']
      }
    ]
  },

  student_council: {
    id: 'student_council',
    name: 'Student Council',
    description: 'Help organize school events and represent the student body.',
    meetingTimes: ['afterschool'],
    memberBenefit: { popularity: 8, academic: 5 },
    requirements: { popularity: 50, academic: 60 },
    president: 'onemine',
    activities: [
      {
        id: 'planning_meeting',
        name: 'Event Planning',
        description: 'Plan upcoming school events and festivals.',
        effects: { academic: 5, popularity: 10, energy: -10 },
        relationBonus: ['onemine', 'tadano']
      },
      {
        id: 'student_concerns',
        name: 'Address Student Concerns',
        description: 'Listen to and help solve student problems.',
        effects: { anxiety: 15, popularity: 15 },
        relationBonus: ['onemine']
      }
    ]
  }
};

export const CLUB_EVENTS = {
  club_fair: {
    id: 'club_fair',
    name: 'Club Recruitment Fair',
    description: 'All clubs are recruiting new members! Visit booths and learn what each club offers.',
    trigger: { day: { min: 5, max: 6 } },
    once: true,
    location: 'hallway',
    timeSlot: 'lunch'
  },

  club_showcase: {
    id: 'club_showcase',
    name: 'Club Showcase Event',
    description: 'Each club presents their best work to the school.',
    trigger: { day: { min: 20, max: 22 }, hasClub: true },
    once: true,
    location: 'classroom',
    timeSlot: 'afterschool'
  },

  inter_club_competition: {
    id: 'inter_club',
    name: 'Inter-Club Competition',
    description: 'Clubs compete in various challenges for glory and prizes!',
    trigger: { day: { min: 25, max: 27 }, hasClub: true },
    once: true,
    location: 'cafeteria',
    timeSlot: 'afterschool'
  }
};