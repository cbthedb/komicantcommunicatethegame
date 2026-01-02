// NPC SCHEDULE SYSTEM - Where NPCs are at different times

export const NPC_SCHEDULES = {
  komi: {
    morning: ['classroom', 'library'],
    class: ['classroom'],
    lunch: ['rooftop', 'library', 'classroom'],
    afterschool: ['library', 'classroom'],
    evening: ['library']
  },
  tadano: {
    morning: ['classroom', 'hallway'],
    class: ['classroom'],
    lunch: ['cafeteria', 'rooftop'],
    afterschool: ['classroom', 'hallway'],
    evening: ['hallway']
  },
  najimi: {
    morning: ['hallway', 'cafeteria', 'classroom'],
    class: ['classroom'],
    lunch: ['cafeteria', 'hallway', 'rooftop'],
    afterschool: ['hallway', 'cafeteria'],
    evening: ['hallway']
  },
  yamai: {
    morning: ['classroom', 'hallway'],
    class: ['classroom'],
    lunch: ['rooftop', 'classroom'],
    afterschool: ['library', 'classroom'],
    evening: []
  },
  nakanaka: {
    morning: ['classroom', 'rooftop'],
    class: ['classroom'],
    lunch: ['rooftop', 'library'],
    afterschool: ['club_room', 'rooftop'],
    evening: []
  },
  katai: {
    morning: ['hallway', 'classroom'],
    class: ['classroom'],
    lunch: ['cafeteria', 'rooftop'],
    afterschool: ['club_room', 'hallway'],
    evening: []
  },
  onemine: {
    morning: ['classroom', 'hallway'],
    class: ['classroom'],
    lunch: ['cafeteria', 'classroom'],
    afterschool: ['club_room', 'classroom'],
    evening: ['classroom']
  },
  otori: {
    morning: ['classroom', 'hallway'],
    class: ['classroom'],
    lunch: ['cafeteria', 'rooftop'],
    afterschool: ['club_room', 'library'],
    evening: []
  },
  agari: {
    morning: ['classroom', 'cafeteria'],
    class: ['classroom'],
    lunch: ['cafeteria'],
    afterschool: ['cafeteria', 'hallway'],
    evening: []
  },
  ase: {
    morning: ['classroom', 'hallway'],
    class: ['classroom'],
    lunch: ['cafeteria', 'classroom'],
    afterschool: ['club_room', 'classroom'],
    evening: []
  }
};

// Get NPCs present at a location during a time slot
export function getNPCsAtLocation(location, timeSlot) {
  const presentNPCs = [];

  for (const [npcId, schedule] of Object.entries(NPC_SCHEDULES)) {
    if (schedule[timeSlot]?.includes(location)) {
      presentNPCs.push(npcId);
    }
  }

  return presentNPCs;
}

// Check if NPC is available at current time/location
export function isNPCAvailable(npcId, location, timeSlot) {
  const schedule = NPC_SCHEDULES[npcId];
  if (!schedule) return false;
  return schedule[timeSlot]?.includes(location) || false;
}