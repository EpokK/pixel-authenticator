export interface CollectedSequence {
  code: string;
  firstSeen: Date;
  count: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  icon: string;
}

const COLLECTION_STORAGE_KEY = 'totp-special-sequences';
const ACHIEVEMENTS_STORAGE_KEY = 'totp-achievements';

export const getSpecialSequenceInfo = (code: string): { rarity: CollectedSequence['rarity'], description: string } => {
  const patterns = [
    // Legendary (very rare patterns)
    { pattern: /^123456$/, rarity: 'Legendary' as const, description: 'The Ultimate Sequence' },
    { pattern: /^654321$/, rarity: 'Legendary' as const, description: 'Reverse Engineering' },
    { pattern: /^000000$/, rarity: 'Legendary' as const, description: 'The Void' },
    { pattern: /^999999$/, rarity: 'Legendary' as const, description: 'Maximum Overdrive' },
    
    // Epic (rare patterns)
    { pattern: /^111111$/, rarity: 'Epic' as const, description: 'All Ones Club' },
    { pattern: /^222222$/, rarity: 'Epic' as const, description: 'Double Trouble' },
    { pattern: /^333333$/, rarity: 'Epic' as const, description: 'Triple Threat' },
    { pattern: /^444444$/, rarity: 'Epic' as const, description: 'Quad Squad' },
    { pattern: /^555555$/, rarity: 'Epic' as const, description: 'High Five' },
    { pattern: /^666666$/, rarity: 'Epic' as const, description: 'Devil\'s Number' },
    { pattern: /^777777$/, rarity: 'Epic' as const, description: 'Lucky Sevens' },
    { pattern: /^888888$/, rarity: 'Epic' as const, description: 'Infinity Loop' },
    { pattern: /^012345$/, rarity: 'Epic' as const, description: 'Count Up' },
    { pattern: /^543210$/, rarity: 'Epic' as const, description: 'Count Down' },
    
    // Rare (uncommon patterns)
    { pattern: /^123123$/, rarity: 'Rare' as const, description: 'Echo Pattern' },
    { pattern: /^321321$/, rarity: 'Rare' as const, description: 'Reverse Echo' },
    { pattern: /^112233$/, rarity: 'Rare' as const, description: 'Double Pairs' },
    { pattern: /^332211$/, rarity: 'Rare' as const, description: 'Reverse Pairs' },
    { pattern: /^121212$/, rarity: 'Rare' as const, description: 'Alternating Beat' },
    { pattern: /^212121$/, rarity: 'Rare' as const, description: 'Reverse Beat' },
    
    // Common (starts/ends with patterns)
    { pattern: /^123/, rarity: 'Common' as const, description: 'Started Strong' },
    { pattern: /^321/, rarity: 'Common' as const, description: 'Reverse Start' },
    { pattern: /^111/, rarity: 'Common' as const, description: 'Triple One Start' },
    { pattern: /^222/, rarity: 'Common' as const, description: 'Triple Two Start' },
    { pattern: /^333/, rarity: 'Common' as const, description: 'Triple Three Start' },
    { pattern: /123$/, rarity: 'Common' as const, description: 'Strong Finish' },
    { pattern: /321$/, rarity: 'Common' as const, description: 'Reverse Finish' },
    { pattern: /111$/, rarity: 'Common' as const, description: 'Triple One Finish' },
  ];

  for (const { pattern, rarity, description } of patterns) {
    if (pattern.test(code)) {
      return { rarity, description };
    }
  }

  return { rarity: 'Common', description: 'Special Pattern' };
};

export const addToCollection = (code: string): CollectedSequence => {
  const collection = getCollection();
  const { rarity, description } = getSpecialSequenceInfo(code);
  
  if (collection[code]) {
    collection[code].count++;
  } else {
    collection[code] = {
      code,
      firstSeen: new Date(),
      count: 1,
      rarity,
      description
    };
  }
  
  localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
  checkAchievements();
  return collection[code];
};

export const getCollection = (): { [code: string]: CollectedSequence } => {
  try {
    const stored = localStorage.getItem(COLLECTION_STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    Object.values(parsed).forEach((sequence: any) => {
      sequence.firstSeen = new Date(sequence.firstSeen);
    });
    
    return parsed;
  } catch {
    return {};
  }
};

export const getCollectionStats = () => {
  const collection = getCollection();
  const sequences = Object.values(collection);
  
  const stats = {
    total: sequences.length,
    totalSeen: sequences.reduce((sum, seq) => sum + seq.count, 0),
    byRarity: {
      Common: sequences.filter(s => s.rarity === 'Common').length,
      Rare: sequences.filter(s => s.rarity === 'Rare').length,
      Epic: sequences.filter(s => s.rarity === 'Epic').length,
      Legendary: sequences.filter(s => s.rarity === 'Legendary').length,
    }
  };
  
  return stats;
};

export const getAchievements = (): Achievement[] => {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!stored) return getInitialAchievements();
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    parsed.forEach((achievement: any) => {
      if (achievement.unlockedAt) {
        achievement.unlockedAt = new Date(achievement.unlockedAt);
      }
    });
    
    return parsed;
  } catch {
    return getInitialAchievements();
  }
};

const getInitialAchievements = (): Achievement[] => [
  {
    id: 'first-special',
    name: 'First Contact',
    description: 'Collect your first special sequence',
    unlocked: false,
    icon: '🎯'
  },
  {
    id: 'collector-5',
    name: 'Pattern Hunter',
    description: 'Collect 5 different special sequences',
    unlocked: false,
    icon: '🏹'
  },
  {
    id: 'collector-10',
    name: 'Sequence Master',
    description: 'Collect 10 different special sequences',
    unlocked: false,
    icon: '🏆'
  },
  {
    id: 'rare-finder',
    name: 'Rare Spotter',
    description: 'Find your first rare sequence',
    unlocked: false,
    icon: '💎'
  },
  {
    id: 'epic-finder',
    name: 'Epic Hunter',
    description: 'Find your first epic sequence',
    unlocked: false,
    icon: '⚡'
  },
  {
    id: 'legendary-finder',
    name: 'Legend Seeker',
    description: 'Find your first legendary sequence',
    unlocked: false,
    icon: '👑'
  },
  {
    id: 'lucky-seven',
    name: 'Lucky Number',
    description: 'Collect the 777777 sequence',
    unlocked: false,
    icon: '🍀'
  },
  {
    id: 'ultimate-sequence',
    name: 'The Ultimate',
    description: 'Collect the legendary 123456 sequence',
    unlocked: false,
    icon: '🌟'
  }
];

const checkAchievements = () => {
  const achievements = getAchievements();
  const collection = getCollection();
  const stats = getCollectionStats();
  let hasNewAchievement = false;

  // Check first special sequence
  if (!achievements.find(a => a.id === 'first-special')?.unlocked && stats.total >= 1) {
    unlockAchievement('first-special');
    hasNewAchievement = true;
  }

  // Check collector achievements
  if (!achievements.find(a => a.id === 'collector-5')?.unlocked && stats.total >= 5) {
    unlockAchievement('collector-5');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'collector-10')?.unlocked && stats.total >= 10) {
    unlockAchievement('collector-10');
    hasNewAchievement = true;
  }

  // Check rarity achievements
  if (!achievements.find(a => a.id === 'rare-finder')?.unlocked && stats.byRarity.Rare > 0) {
    unlockAchievement('rare-finder');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'epic-finder')?.unlocked && stats.byRarity.Epic > 0) {
    unlockAchievement('epic-finder');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'legendary-finder')?.unlocked && stats.byRarity.Legendary > 0) {
    unlockAchievement('legendary-finder');
    hasNewAchievement = true;
  }

  // Check specific sequence achievements
  if (!achievements.find(a => a.id === 'lucky-seven')?.unlocked && collection['777777']) {
    unlockAchievement('lucky-seven');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'ultimate-sequence')?.unlocked && collection['123456']) {
    unlockAchievement('ultimate-sequence');
    hasNewAchievement = true;
  }

  return hasNewAchievement;
};

const unlockAchievement = (achievementId: string) => {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  }
};

export const clearCollection = () => {
  localStorage.removeItem(COLLECTION_STORAGE_KEY);
  localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
};