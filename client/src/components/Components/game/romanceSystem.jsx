// ROMANCE SYSTEM

export const ROMANCE_STAGES = {
  none: { label: 'Not Dating', min: 0, max: 49 },
  interested: { label: 'Mutual Interest', min: 50, max: 69 },
  dating: { label: 'Dating', min: 70, max: 89 },
  committed: { label: 'In a Relationship', min: 90, max: 100 }
};

export const ROMANCE_EVENTS = {
  // Confession Events
  player_confess: {
    id: 'player_confess',
    name: 'Confession',
    type: 'romance_milestone',
    description: 'You\'ve decided to confess your feelings...',
    requirements: { relationshipLevel: 60, romancePoints: 30 },
    outcomes: [
      {
        condition: { relationshipLevel: 80 },
        result: 'accepted',
        response: 'Their face turns red. After a moment of silence, they smile and nod. "I... feel the same way."',
        effects: { romanceLevel: 20, anxiety: -10, comfort: 30 }
      },
      {
        condition: { relationshipLevel: 60 },
        result: 'need_time',
        response: 'They look surprised. "I need some time to think about this..."',
        effects: { romanceLevel: 5, anxiety: 15 }
      },
      {
        condition: { relationshipLevel: 40 },
        result: 'rejected',
        response: 'They look apologetic. "I\'m sorry... I don\'t feel that way about you."',
        effects: { romanceLevel: -10, anxiety: 30, comfort: -20 }
      }
    ]
  },

  npc_confess: {
    id: 'npc_confess',
    name: 'Confession Received',
    type: 'romance_milestone',
    description: 'They asked to meet you after school. They have something important to say...',
    requirements: { relationshipLevel: 75, romancePoints: 40, day: 20 },
    choices: [
      {
        text: 'Accept their confession',
        effects: { romanceLevel: 25, anxiety: 20, comfort: 25 },
        outcome: 'start_dating',
        response: 'You tell them you feel the same. You\'re dating now!'
      },
      {
        text: 'Ask for time to think',
        effects: { romanceLevel: 5, anxiety: 15 },
        outcome: 'postpone',
        response: 'They understand and will wait for your answer.'
      },
      {
        text: 'Politely decline',
        effects: { romanceLevel: -15, anxiety: 20, comfort: -10 },
        outcome: 'reject',
        response: 'You let them down gently. Things might be awkward for a while.'
      }
    ]
  },

  first_date: {
    id: 'first_date',
    name: 'First Date',
    type: 'romance_event',
    description: 'Your partner asks you on your first official date!',
    requirements: { romanceStatus: 'dating', romanceLevel: 70 },
    locations: ['cafeteria', 'library', 'rooftop'],
    choices: [
      {
        text: 'Suggest going to a café',
        effects: { romanceLevel: 10, comfort: 15, energy: -10 },
        response: 'You spend a wonderful afternoon at a cozy café together.'
      },
      {
        text: 'Go to the library together',
        effects: { romanceLevel: 8, comfort: 10, academic: 5 },
        response: 'You study together, occasionally stealing glances at each other.'
      },
      {
        text: 'Walk around town',
        effects: { romanceLevel: 12, energy: -15, comfort: 20 },
        response: 'You walk and talk for hours, learning more about each other.'
      }
    ]
  },

  // Dating Scenarios
  lunch_together: {
    id: 'lunch_together',
    name: 'Lunch Date',
    description: 'Your partner invites you to eat lunch together.',
    requirements: { romanceStatus: 'dating', timeSlot: 'lunch' },
    effects: { romanceLevel: 3, comfort: 10, energy: 5 }
  },

  walk_home_romance: {
    id: 'walk_home_romance',
    name: 'Walking Home Together',
    description: 'Your partner is waiting to walk home with you.',
    requirements: { romanceStatus: 'dating', timeSlot: 'afterschool' },
    choices: [
      {
        text: 'Walk home together',
        effects: { romanceLevel: 5, comfort: 15, energy: -5 },
        response: 'You walk home together, enjoying each other\'s company.'
      },
      {
        text: 'Hold hands',
        effects: { romanceLevel: 8, anxiety: 10, comfort: 20 },
        response: 'You reach for their hand. They smile and intertwine their fingers with yours.'
      },
      {
        text: 'Stop at a park',
        effects: { romanceLevel: 10, energy: -10, comfort: 25 },
        response: 'You stop at a nearby park and spend extra time together.'
      }
    ]
  },

  study_date: {
    id: 'study_date',
    name: 'Study Date',
    description: 'Your partner suggests studying together.',
    requirements: { romanceStatus: 'dating', location: 'library' },
    effects: { romanceLevel: 4, academic: 8, comfort: 10 }
  },

  romantic_rooftop: {
    id: 'romantic_rooftop',
    name: 'Rooftop Moment',
    description: 'Just you and your partner on the peaceful rooftop.',
    requirements: { romanceStatus: 'dating', location: 'rooftop' },
    choices: [
      {
        text: 'Enjoy the view together',
        effects: { romanceLevel: 6, comfort: 15, anxiety: -10 },
        response: 'You stand side by side, appreciating the moment.'
      },
      {
        text: 'Share your feelings',
        effects: { romanceLevel: 10, anxiety: 15, comfort: 20 },
        response: 'You open up about how much they mean to you.'
      },
      {
        text: 'Attempt a kiss',
        effects: { romanceLevel: 15, anxiety: 25, comfort: 25 },
        requiresStat: { romanceLevel: 85 },
        response: 'The moment feels perfect. You lean in...'
      }
    ]
  },

  gift_giving: {
    id: 'gift_giving',
    name: 'Gift Exchange',
    description: 'You want to give your partner something special.',
    requirements: { romanceStatus: 'dating' },
    choices: [
      {
        text: 'Give a book',
        effects: { romanceLevel: 5, comfort: 10 },
        response: 'They appreciate the thoughtful gift.'
      },
      {
        text: 'Give homemade food',
        effects: { romanceLevel: 8, comfort: 15 },
        response: 'They\'re touched by the effort you put in.'
      },
      {
        text: 'Give a handwritten letter',
        effects: { romanceLevel: 12, anxiety: 10, comfort: 20 },
        response: 'They read your heartfelt words and tear up a little.'
      }
    ]
  },

  // Relationship Milestones
  first_argument: {
    id: 'first_argument',
    name: 'First Disagreement',
    description: 'You and your partner have a small disagreement...',
    requirements: { romanceStatus: 'dating', romanceLevel: 75, day: 25 },
    choices: [
      {
        text: 'Apologize sincerely',
        effects: { romanceLevel: 5, anxiety: -5 },
        response: 'You talk it out and your relationship grows stronger.'
      },
      {
        text: 'Give them space',
        effects: { romanceLevel: -3, comfort: 5 },
        response: 'Sometimes space is needed. You\'ll reconcile soon.'
      },
      {
        text: 'Stand your ground',
        effects: { romanceLevel: -8, anxiety: 10 },
        response: 'The tension remains. This might need more attention.'
      }
    ]
  },

  relationship_deepening: {
    id: 'relationship_deepening',
    name: 'Growing Closer',
    description: 'Your relationship has reached a new level of intimacy.',
    requirements: { romanceStatus: 'dating', romanceLevel: 90 },
    effects: { romanceLevel: 10, comfort: 30, anxiety: -15 },
    response: 'You both feel more connected than ever before.'
  }
};

// Get available romance events based on current state
export function getAvailableRomanceEvents(gameState) {
  const { romanceTarget, romanceLevel, relationships, timeSlot, day } = gameState;

  if (!romanceTarget) return [];

  const available = [];
  const targetRelationship = relationships[romanceTarget]?.level || 0;

  for (const [id, event] of Object.entries(ROMANCE_EVENTS)) {
    const req = event.requirements;

    // Check all requirements
    let meetsRequirements = true;

    if (req.relationshipLevel && targetRelationship < req.relationshipLevel) {
      meetsRequirements = false;
    }

    if (req.romanceLevel && romanceLevel < req.romanceLevel) {
      meetsRequirements = false;
    }

    if (req.timeSlot && timeSlot !== req.timeSlot) {
      meetsRequirements = false;
    }

    if (req.day && day < req.day) {
      meetsRequirements = false;
    }

    if (meetsRequirements) {
      available.push(event);
    }
  }

  return available;
}