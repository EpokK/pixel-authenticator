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
    // Legendary (very rare patterns) - Pop Culture Icons
    { pattern: /^123456$/, rarity: 'Legendary' as const, description: 'Konami Code Master' },
    { pattern: /^654321$/, rarity: 'Legendary' as const, description: 'Thanos Snap' },
    { pattern: /^000000$/, rarity: 'Legendary' as const, description: 'Agent Smith' },
    { pattern: /^999999$/, rarity: 'Legendary' as const, description: 'Over 9000!' },
    { pattern: /^424242$/, rarity: 'Legendary' as const, description: 'Hitchhiker\'s Guide' },
    { pattern: /^101010$/, rarity: 'Legendary' as const, description: 'Binary Buddha' },
    { pattern: /^131313$/, rarity: 'Legendary' as const, description: 'Friday the 13th' },
    { pattern: /^271828$/, rarity: 'Legendary' as const, description: 'Euler\'s Number' },
    
    // Epic (rare patterns) - Games & Movies
    { pattern: /^111111$/, rarity: 'Epic' as const, description: 'Neo\'s Choice' },
    { pattern: /^222222$/, rarity: 'Epic' as const, description: 'Catch-22' },
    { pattern: /^333333$/, rarity: 'Epic' as const, description: 'Half-Life 3' },
    { pattern: /^444444$/, rarity: 'Epic' as const, description: 'Fantastic Four' },
    { pattern: /^555555$/, rarity: 'Epic' as const, description: 'Mambo No. 5' },
    { pattern: /^666666$/, rarity: 'Epic' as const, description: 'The Omen' },
    { pattern: /^777777$/, rarity: 'Epic' as const, description: 'Casino Royale' },
    { pattern: /^888888$/, rarity: 'Epic' as const, description: 'Crazy 88s' },
    { pattern: /^012345$/, rarity: 'Epic' as const, description: 'Launch Sequence' },
    { pattern: /^543210$/, rarity: 'Epic' as const, description: 'Self Destruct' },
    { pattern: /^135246$/, rarity: 'Epic' as const, description: 'Da Vinci Code' },
    { pattern: /^987654$/, rarity: 'Epic' as const, description: 'Countdown' },
    { pattern: /^314159$/, rarity: 'Epic' as const, description: 'Pi Day' },
    { pattern: /^161803$/, rarity: 'Epic' as const, description: 'Golden Ratio' },
    { pattern: /^808080$/, rarity: 'Epic' as const, description: 'TR-808' },
    { pattern: /^696969$/, rarity: 'Epic' as const, description: 'Nice Nice Nice' },
    
    // Rare (uncommon patterns) - Pop Culture References
    { pattern: /^123123$/, rarity: 'Rare' as const, description: 'Groundhog Day' },
    { pattern: /^321321$/, rarity: 'Rare' as const, description: 'Rewind' },
    { pattern: /^112233$/, rarity: 'Rare' as const, description: 'Double Dragon' },
    { pattern: /^332211$/, rarity: 'Rare' as const, description: 'Mirror Mirror' },
    { pattern: /^121212$/, rarity: 'Rare' as const, description: 'Battlestar Galactica' },
    { pattern: /^212121$/, rarity: 'Rare' as const, description: 'Back to Future' },
    { pattern: /^131415$/, rarity: 'Rare' as const, description: 'Pi Hunter' },
    { pattern: /^246810$/, rarity: 'Rare' as const, description: 'Even Steven' },
    { pattern: /^135791$/, rarity: 'Rare' as const, description: 'Odd Job' },
    { pattern: /^102030$/, rarity: 'Rare' as const, description: 'Apollo 11' },
    { pattern: /^123321$/, rarity: 'Rare' as const, description: 'Palindrome Pro' },
    { pattern: /^456654$/, rarity: 'Rare' as const, description: 'Mirror Force' },
    { pattern: /^789987$/, rarity: 'Rare' as const, description: 'Boomerang' },
    { pattern: /^147147$/, rarity: 'Rare' as const, description: 'Boeing 747' },
    { pattern: /^258258$/, rarity: 'Rare' as const, description: 'Fibonacci Echo' },
    { pattern: /^369369$/, rarity: 'Rare' as const, description: 'Tesla\'s Secret' },
    { pattern: /^101101$/, rarity: 'Rare' as const, description: 'Binary Twin' },
    { pattern: /^202020$/, rarity: 'Rare' as const, description: 'Vision 2020' },
    { pattern: /^303030$/, rarity: 'Rare' as const, description: '.30-06 Springfield' },
    { pattern: /^404040$/, rarity: 'Rare' as const, description: 'Not Found' },
    { pattern: /^505050$/, rarity: 'Rare' as const, description: '50/50 Chance' },
    { pattern: /^707070$/, rarity: 'Rare' as const, description: 'Boeing 707' },
    { pattern: /^909090$/, rarity: 'Rare' as const, description: 'Roland TR-909' },
    
    // Common (starts/ends with patterns) - Gaming References
    { pattern: /^123/, rarity: 'Common' as const, description: 'Player 1 Ready' },
    { pattern: /^321/, rarity: 'Common' as const, description: 'Rocket Launch' },
    { pattern: /^111/, rarity: 'Common' as const, description: 'Triple Kill' },
    { pattern: /^222/, rarity: 'Common' as const, description: 'Double Tap' },
    { pattern: /^333/, rarity: 'Common' as const, description: 'Hat Trick' },
    { pattern: /^420/, rarity: 'Common' as const, description: 'Blaze It' },
    { pattern: /^666/, rarity: 'Common' as const, description: 'Doom Eternal' },
    { pattern: /^777/, rarity: 'Common' as const, description: 'Jackpot' },
    { pattern: /^888/, rarity: 'Common' as const, description: 'Lucky 8' },
    { pattern: /^007/, rarity: 'Common' as const, description: 'Bond, James Bond' },
    { pattern: /^069/, rarity: 'Common' as const, description: 'Agent 69' },
    { pattern: /123$/, rarity: 'Common' as const, description: 'Level Complete' },
    { pattern: /321$/, rarity: 'Common' as const, description: 'Blast Off' },
    { pattern: /111$/, rarity: 'Common' as const, description: 'Ace Finish' },
    { pattern: /777$/, rarity: 'Common' as const, description: 'Lucky Ending' },
    { pattern: /420$/, rarity: 'Common' as const, description: 'Snoop Approved' },
    { pattern: /666$/, rarity: 'Common' as const, description: 'Metal Ending' },
    { pattern: /007$/, rarity: 'Common' as const, description: 'Mission Complete' },
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
    id: 'collector-25',
    name: 'Pop Culture Legend',
    description: 'Collect 25 different special sequences',
    unlocked: false,
    icon: '⭐'
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
    name: 'Casino Royale',
    description: 'Collect the 777777 sequence',
    unlocked: false,
    icon: '🎰'
  },
  {
    id: 'ultimate-sequence',
    name: 'Konami Code Master',
    description: 'Collect the legendary 123456 sequence',
    unlocked: false,
    icon: '🎮'
  },
  {
    id: 'thanos-snap',
    name: 'Infinity War',
    description: 'Collect the 654321 sequence',
    unlocked: false,
    icon: '♾️'
  },
  {
    id: 'hitchhiker',
    name: 'Don\'t Panic!',
    description: 'Collect the answer to everything: 424242',
    unlocked: false,
    icon: '🐋'
  },
  {
    id: 'agent-smith',
    name: 'There Is No Spoon',
    description: 'Enter the void with 000000',
    unlocked: false,
    icon: '🕶️'
  },
  {
    id: 'over-9000',
    name: 'Power Level Maximum',
    description: 'IT\'S OVER 9000! Collect 999999',
    unlocked: false,
    icon: '💥'
  },
  {
    id: 'james-bond',
    name: 'License to Kill',
    description: 'Find any sequence containing 007',
    unlocked: false,
    icon: '🔫'
  },
  {
    id: 'pi-day',
    name: 'Math Genius',
    description: 'Collect the Pi sequence: 314159',
    unlocked: false,
    icon: '🥧'
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

  if (!achievements.find(a => a.id === 'collector-25')?.unlocked && stats.total >= 25) {
    unlockAchievement('collector-25');
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

  if (!achievements.find(a => a.id === 'thanos-snap')?.unlocked && collection['654321']) {
    unlockAchievement('thanos-snap');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'hitchhiker')?.unlocked && collection['424242']) {
    unlockAchievement('hitchhiker');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'agent-smith')?.unlocked && collection['000000']) {
    unlockAchievement('agent-smith');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'over-9000')?.unlocked && collection['999999']) {
    unlockAchievement('over-9000');
    hasNewAchievement = true;
  }

  if (!achievements.find(a => a.id === 'pi-day')?.unlocked && collection['314159']) {
    unlockAchievement('pi-day');
    hasNewAchievement = true;
  }

  // Check for sequences containing 007
  if (!achievements.find(a => a.id === 'james-bond')?.unlocked) {
    const has007 = Object.keys(collection).some(code => code.includes('007'));
    if (has007) {
      unlockAchievement('james-bond');
      hasNewAchievement = true;
    }
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