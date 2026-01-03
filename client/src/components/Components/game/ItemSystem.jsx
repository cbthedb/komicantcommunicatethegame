export const ITEM_CATEGORIES = {
  GIFT: 'gift',
  CONSUMABLE: 'consumable',
  COLLECTIBLE: 'collectible',
  BOOK: 'book',
  ACCESSORY: 'accessory'
};

export const ITEMS = [
  // Gifts
  {
    id: 'chocolate',
    name: 'Chocolate',
    category: ITEM_CATEGORIES.GIFT,
    price: 300,
    description: 'Sweet chocolate. Good for any occasion.',
    effects: { friendship: 4, romanticInterest: 2 },
    npcPreferences: {
      agari: 10, // Agari loves food
      otori: 8,
      komi: 5
    }
  },
  {
    id: 'fancy_chocolate',
    name: 'Fancy Chocolate Box',
    category: ITEM_CATEGORIES.GIFT,
    price: 850,
    description: 'Expensive artisan chocolates. Very impressive!',
    effects: { friendship: 8, romanticInterest: 6, trust: 4 },
    npcPreferences: {
      komi: 12,
      yamai: 10,
      onemine: 8
    }
  },
  {
    id: 'notebook',
    name: 'Cute Notebook',
    category: ITEM_CATEGORIES.GIFT,
    price: 450,
    description: 'A notebook with cute designs. Perfect for writing.',
    effects: { friendship: 5, comfort: 4 },
    npcPreferences: {
      komi: 15, // Komi loves notebooks for communication
      nakanaka: 8,
      tadano: 6
    }
  },
  {
    id: 'manga',
    name: 'Popular Manga Volume',
    category: ITEM_CATEGORIES.GIFT,
    price: 400,
    description: 'Latest volume of a popular manga series.',
    effects: { friendship: 12, comfort: 10 },
    npcPreferences: {
      nakanaka: 20,
      agari: 15,
      otori: 12
    }
  },
  {
    id: 'cat_keychain',
    name: 'Cat Keychain',
    category: ITEM_CATEGORIES.GIFT,
    price: 300,
    description: 'An adorable cat-themed keychain.',
    effects: { friendship: 10, comfort: 12 },
    npcPreferences: {
      komi: 22, // Komi loves cats
      katai: 18,
      otori: 15
    }
  },
  {
    id: 'flowers',
    name: 'Beautiful Flowers',
    category: ITEM_CATEGORIES.GIFT,
    price: 350,
    description: 'A lovely bouquet of fresh flowers.',
    effects: { friendship: 12, romanticInterest: 15, comfort: 8 },
    npcPreferences: {
      yamai: 10,
      onemine: 18,
      ase: 15
    }
  },

  // Consumables
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    category: ITEM_CATEGORIES.CONSUMABLE,
    price: 150,
    description: 'Restores 30 energy immediately.',
    effects: { energy: 30, anxiety: 5 }
  },
  {
    id: 'snack_pack',
    name: 'Snack Pack',
    category: ITEM_CATEGORIES.CONSUMABLE,
    price: 100,
    description: 'Tasty snacks that restore energy and comfort.',
    effects: { energy: 20, comfort: 10 }
  },
  {
    id: 'study_guide',
    name: 'Study Guide',
    category: ITEM_CATEGORIES.CONSUMABLE,
    price: 300,
    description: 'Helps you study more effectively.',
    effects: { academic: 15, energy: -10 }
  },
  {
    id: 'relaxation_tea',
    name: 'Relaxation Tea',
    category: ITEM_CATEGORIES.CONSUMABLE,
    price: 200,
    description: 'Calming herbal tea that reduces anxiety.',
    effects: { anxiety: -15, comfort: 15, energy: 10 }
  },

  // Books
  {
    id: 'social_skills_book',
    name: 'How to Make Friends',
    category: ITEM_CATEGORIES.BOOK,
    price: 800,
    description: 'A helpful guide to social interactions.',
    effects: { popularity: 10, anxiety: -10 },
    permanent: true
  },
  {
    id: 'confidence_book',
    name: 'Building Confidence',
    category: ITEM_CATEGORIES.BOOK,
    price: 900,
    description: 'Learn to be more confident in yourself.',
    effects: { anxiety: -15, comfort: 15 },
    permanent: true
  },

  // Accessories
  {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    category: ITEM_CATEGORIES.ACCESSORY,
    price: 600,
    description: 'A charm that brings good fortune.',
    effects: { popularity: 8, comfort: 8 },
    equipped: false
  },
  {
    id: 'stylish_bag',
    name: 'Stylish School Bag',
    category: ITEM_CATEGORIES.ACCESSORY,
    price: 1200,
    description: 'A fashionable bag that boosts popularity.',
    effects: { popularity: 15, comfort: 5 },
    equipped: false
  },

  // Collectibles
  {
    id: 'photo_komi',
    name: 'Photo with Komi',
    category: ITEM_CATEGORIES.COLLECTIBLE,
    price: 0,
    description: 'A precious memory captured forever.',
    specialItem: true
  },
  {
    id: 'friendship_bracelet',
    name: 'Friendship Bracelet',
    category: ITEM_CATEGORIES.COLLECTIBLE,
    price: 0,
    description: 'A handmade gift from a close friend.',
    specialItem: true
  }
];

export const SHOPS = [
  {
    id: 'school_store',
    name: 'School Store',
    description: 'Basic supplies and snacks',
    availableItems: ['snack_pack', 'energy_drink', 'notebook', 'study_guide'],
    location: 'classroom',
    availableAt: ['class', 'lunch', 'afterschool']
  },
  {
    id: 'convenience_store',
    name: 'Convenience Store',
    description: 'Everything you need after school',
    availableItems: ['chocolate', 'energy_drink', 'snack_pack', 'relaxation_tea', 'manga'],
    location: 'town',
    availableAt: ['afterschool', 'evening']
  },
  {
    id: 'gift_shop',
    name: 'Gift Shop',
    description: 'Perfect presents for special people',
    availableItems: ['fancy_chocolate', 'flowers', 'cat_keychain', 'notebook', 'manga', 'stylish_bag'],
    location: 'town',
    availableAt: ['afterschool', 'evening']
  },
  {
    id: 'bookstore',
    name: 'Bookstore',
    description: 'Books to improve yourself',
    availableItems: ['manga', 'social_skills_book', 'confidence_book', 'study_guide'],
    location: 'town',
    availableAt: ['afterschool', 'evening']
  }
];

export function getItemById(itemId) {
  return ITEMS.find(item => item.id === itemId);
}

export function getShopItems(shopId) {
  const shop = SHOPS.find(s => s.id === shopId);
  if (!shop) return [];
  return shop.availableItems.map(itemId => getItemById(itemId)).filter(Boolean);
}

export function calculateGiftEffect(item, npcId) {
  if (!item || item.category !== ITEM_CATEGORIES.GIFT) return item.effects;

  const baseEffects = { ...item.effects };
  const preference = item.npcPreferences?.[npcId] || 0;

  // Apply preference bonus
  if (preference > 0) {
    Object.keys(baseEffects).forEach(key => {
      baseEffects[key] = Math.round(baseEffects[key] * (1 + preference / 100));
    });
  }

  return baseEffects;
}