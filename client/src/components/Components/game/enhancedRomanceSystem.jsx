// ENHANCED MULTI-DIMENSIONAL ROMANCE SYSTEM

export const RELATIONSHIP_STAGES = {
  stranger: { id: 'stranger', label: 'Stranger', friendshipMin: 0, color: 'gray' },
  acquaintance: { id: 'acquaintance', label: 'Acquaintance', friendshipMin: 20, color: 'blue' },
  friend: { id: 'friend', label: 'Friend', friendshipMin: 50, color: 'green' },
  close_friend: { id: 'close_friend', label: 'Close Friend', friendshipMin: 70, color: 'emerald' },
  mutual_interest: { id: 'mutual_interest', label: 'Mutual Interest', friendshipMin: 70, trustMin: 60, romanticMin: 40, color: 'pink' },
  dating: { id: 'dating', label: 'Dating', friendshipMin: 75, trustMin: 70, romanticMin: 60, color: 'rose' },
  serious: { id: 'serious', label: 'Serious Relationship', friendshipMin: 85, trustMin: 85, romanticMin: 80, color: 'red' }
};

export class EnhancedRelationship {
  constructor(npcId, initialData = {}) {
    this.npcId = npcId;
    this.friendship = initialData.friendship || 0;
    this.trust = initialData.trust || 0;
    this.comfort = initialData.comfort || 0;
    this.romanticInterest = initialData.romanticInterest || 0;
    this.stage = initialData.stage || 'stranger';
    this.memories = initialData.memories || [];
    this.lastInteraction = initialData.lastInteraction || null;
    this.rejectionCount = initialData.rejectionCount || 0;
    this.daysAsked = initialData.daysAsked || [];
  }

  // Calculate current relationship stage
  calculateStage() {
    // Check for romantic stages first
    if (this.friendship >= 85 && this.trust >= 85 && this.romanticInterest >= 80) {
      return 'serious';
    }
    if (this.friendship >= 75 && this.trust >= 70 && this.romanticInterest >= 60) {
      return 'dating';
    }
    if (this.friendship >= 70 && this.trust >= 60 && this.romanticInterest >= 40) {
      return 'mutual_interest';
    }

    // Non-romantic stages
    if (this.friendship >= 70) return 'close_friend';
    if (this.friendship >= 50) return 'friend';
    if (this.friendship >= 20) return 'acquaintance';
    return 'stranger';
  }

  // Update stage
  updateStage() {
    this.stage = this.calculateStage();
  }

  // Add memory
  addMemory(memory) {
    this.memories.push({
      text: memory,
      day: Date.now(),
      sentiment: this.analyzeSentiment(memory)
    });
    // Keep only last 10 memories
    if (this.memories.length > 10) {
      this.memories.shift();
    }
  }

  analyzeSentiment(memory) {
    const positive = ['thoughtful', 'kind', 'sweet', 'wonderful', 'helped', 'supported', 'gift'];
    const negative = ['forgot', 'awkward', 'rejected', 'ignored', 'upset', 'hurt'];

    const lowerMemory = memory.toLowerCase();
    const hasPositive = positive.some(word => lowerMemory.includes(word));
    const hasNegative = negative.some(word => lowerMemory.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  // Get recent sentiment score
  getRecentSentiment() {
    if (this.memories.length === 0) return 0;

    const recentMemories = this.memories.slice(-3);
    let score = 0;
    recentMemories.forEach(mem => {
      if (mem.sentiment === 'positive') score += 1;
      if (mem.sentiment === 'negative') score -= 1;
    });
    return score;
  }

  // Check if can ask out
  canAskOut() {
    if (this.stage === 'dating' || this.stage === 'serious') return false;
    if (this.friendship < 60) return false;
    if (this.trust < 50) return false;
    if (this.romanticInterest < 30) return false;

    // Recent rejection penalty
    if (this.rejectionCount > 0 && this.daysAsked.length > 0) {
      const lastAsked = this.daysAsked[this.daysAsked.length - 1];
      const daysSince = Date.now() - lastAsked;
      if (daysSince < 3) return false; // Wait at least 3 turns
    }

    return true;
  }

  // Calculate ask out success chance
  getAskOutChance() {
    let baseChance = 0;

    // Stage bonuses
    if (this.stage === 'mutual_interest') baseChance = 70;
    else if (this.stage === 'close_friend') baseChance = 40;
    else if (this.stage === 'friend') baseChance = 20;
    else baseChance = 5;

    // Trust bonus
    baseChance += (this.trust - 50) * 0.5;

    // Romantic interest bonus
    baseChance += (this.romanticInterest - 30) * 0.8;

    // Recent sentiment
    const sentiment = this.getRecentSentiment();
    baseChance += sentiment * 10;

    // Rejection penalty
    baseChance -= this.rejectionCount * 15;

    // If friendship is 100, we should be much more likely to succeed
    if (this.friendship >= 95) baseChance += 40;
    else if (this.friendship >= 80) baseChance += 20;

    return Math.max(5, Math.min(100, baseChance));
  }

  // Process ask out
  processAskOut(currentDay) {
    this.daysAsked.push(currentDay);

    const chance = this.getAskOutChance();
    const roll = Math.random() * 100;

    // If affinity is 100, and they aren't totally untrusting, it should be an automatic yes
    if (this.friendship >= 95 && this.trust >= 50 && this.romanticInterest >= 40) {
      this.romanticInterest = Math.min(100, this.romanticInterest + 20);
      this.trust = Math.min(100, this.trust + 10);
      this.friendship = Math.min(100, this.friendship + 15);
      this.addMemory('They asked me out! I said yes immediately!');
      this.updateStage();
      return 'enthusiastic_yes';
    }

    if (roll < chance * 0.4) {
      // Enthusiastic yes
      this.romanticInterest = Math.min(100, this.romanticInterest + 20);
      this.trust = Math.min(100, this.trust + 10);
      this.friendship = Math.min(100, this.friendship + 15);
      this.addMemory('They asked me out! I said yes immediately!');
      this.updateStage();
      return 'enthusiastic_yes';
    } else if (roll < chance) {
      // Hesitant yes
      this.romanticInterest = Math.min(100, this.romanticInterest + 15);
      this.trust = Math.min(100, this.trust + 5);
      this.friendship = Math.min(100, this.friendship + 10);
      this.addMemory('They asked me out. I was nervous but said yes.');
      this.updateStage();
      return 'hesitant_yes';
    } else if (roll < chance + 15) {
      // Not yet
      this.romanticInterest = Math.max(0, this.romanticInterest + 5);
      this.friendship = Math.max(0, this.friendship - 5);
      this.addMemory('They asked me out but I need more time.');
      return 'not_yet';
    } else {
      // Rejection
      this.rejectionCount++;
      this.romanticInterest = Math.max(0, this.romanticInterest - 10);
      this.friendship = Math.max(0, this.friendship - 15);
      this.trust = Math.max(0, this.trust - 10);
      this.addMemory('They asked me out but I had to say no.');
      return 'rejection';
    }
  }

  // Serialize for storage
  toJSON() {
    return {
      npcId: this.npcId,
      friendship: this.friendship,
      trust: this.trust,
      comfort: this.comfort,
      romanticInterest: this.romanticInterest,
      stage: this.stage,
      memories: this.memories,
      lastInteraction: this.lastInteraction,
      rejectionCount: this.rejectionCount,
      daysAsked: this.daysAsked
    };
  }

  // Load from data
  static fromJSON(data) {
    return new EnhancedRelationship(data.npcId, data);
  }
}

// Get romantic action availability
export function getAvailableRomanticActions(relationship, gameState) {
  const actions = [];
  const stage = relationship.stage;

  // Early romance (mutual interest)
  if (stage === 'mutual_interest' || stage === 'dating' || stage === 'serious') {
    actions.push(
      { id: 'compliment', label: 'Give a Compliment', effects: { romanticInterest: 3, comfort: 5 }, energy: -5 },
      { id: 'spend_time', label: 'Spend Time Together', effects: { friendship: 5, comfort: 8, romanticInterest: 2 }, energy: -10 },
      { id: 'walk_home', label: 'Walk Home Together', effects: { friendship: 4, romanticInterest: 5, comfort: 10 }, energy: -8 },
      { id: 'exchange_messages', label: 'Text/Message Them', effects: { friendship: 3, romanticInterest: 2, comfort: 5 }, energy: -3 }
    );

    if (gameState.money >= 200) {
      actions.push({ id: 'small_gift', label: 'Give a Small Gift', effects: { trust: 5, romanticInterest: 8, friendship: 5 }, energy: -5, money: -200 });
    }
  }

  // Dating stage
  if (stage === 'dating' || stage === 'serious') {
    if (gameState.money >= 300) {
      actions.push(
        { id: 'cafe_date', label: 'Café Date', effects: { romanticInterest: 10, comfort: 15, friendship: 8 }, energy: -15, money: -300 },
        { id: 'movie_date', label: 'Movie Date', effects: { romanticInterest: 12, comfort: 18, friendship: 10 }, energy: -20, money: -400 }
      );
    }

    actions.push(
      { id: 'study_together', label: 'Study Date', effects: { friendship: 8, romanticInterest: 5, comfort: 10 }, energy: -12 },
      { id: 'hold_hands', label: 'Hold Hands', effects: { romanticInterest: 8, comfort: 12 }, energy: -5 },
      { id: 'deep_talk', label: 'Talk About Feelings', effects: { trust: 10, romanticInterest: 8, comfort: 15 }, energy: -10 }
    );

    if (gameState.money >= 500) {
      actions.push({ id: 'nice_gift', label: 'Buy a Nice Gift', effects: { trust: 10, romanticInterest: 15, friendship: 10 }, energy: -8, money: -500 });
    }
  }

  // Serious relationship
  if (stage === 'serious') {
    actions.push(
      { id: 'meet_parents', label: 'Meet Their Family', effects: { trust: 20, romanticInterest: 15, friendship: 15 }, energy: -25, requiresTrust: 80 },
      { id: 'plan_future', label: 'Plan Future Together', effects: { trust: 15, romanticInterest: 20, comfort: 20 }, energy: -15, requiresTrust: 85 },
      { id: 'resolve_conflict', label: 'Work Through Issues', effects: { trust: 12, comfort: 10 }, energy: -20 }
    );
  }

  // Ask out action (if not dating yet)
  if (relationship.canAskOut()) {
    actions.push({ 
      id: 'ask_out', 
      label: 'Ask Them Out', 
      special: true,
      effects: {}, 
      energy: -15,
      successChance: relationship.getAskOutChance()
    });
  }

  return actions;
}