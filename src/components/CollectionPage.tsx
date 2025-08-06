import React, { useState, useEffect } from 'react';
import { getCollection, getCollectionStats, getAchievements, CollectedSequence, Achievement } from '../utils/collection';

interface CollectionPageProps {
  onBack: () => void;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ onBack }) => {
  const [collection, setCollection] = useState<{ [code: string]: CollectedSequence }>({});
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'sequences' | 'achievements'>('sequences');

  useEffect(() => {
    setCollection(getCollection());
    setAchievements(getAchievements());
  }, []);

  const stats = getCollectionStats();
  const sequences = Object.values(collection).sort((a, b) => {
    // Sort by rarity first, then by first seen date
    const rarityOrder = { 'Legendary': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 };
    if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    }
    return new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime();
  });

  const getRarityColor = (rarity: CollectedSequence['rarity']) => {
    switch (rarity) {
      case 'Legendary': return 'text-pixel-yellow border-pixel-yellow bg-pixel-bg';
      case 'Epic': return 'text-pixel-cyan border-pixel-cyan bg-pixel-bg';
      case 'Rare': return 'text-pixel-pink border-pixel-pink bg-pixel-bg';
      case 'Common': return 'text-pixel-muted border-pixel-muted bg-pixel-surface';
    }
  };

  const getRarityIcon = (rarity: CollectedSequence['rarity']) => {
    switch (rarity) {
      case 'Legendary': return '👑';
      case 'Epic': return '⚡';
      case 'Rare': return '💎';
      case 'Common': return '⭐';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-pixel-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-pixel font-bold text-pixel-text">SEQUENCE COLLECTION</h1>
            <p className="font-pixel text-pixel-muted">GOTTA CATCH 'EM ALL!</p>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 border-2 border-pixel-text text-sm font-pixel font-bold rounded-pixel shadow-pixel text-pixel-text bg-pixel-primary hover:bg-pixel-secondary hover:shadow-pixel-inset focus:outline-none transition-all duration-150"
          >
            {'<< BACK'}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-pixel-surface border-2 border-pixel-text rounded-pixel p-4 shadow-pixel">
            <div className="text-2xl font-pixel font-bold text-pixel-green">{stats.total}</div>
            <div className="text-sm font-pixel text-pixel-muted">UNIQUE FOUND</div>
          </div>
          <div className="bg-pixel-surface border-2 border-pixel-text rounded-pixel p-4 shadow-pixel">
            <div className="text-2xl font-pixel font-bold text-pixel-accent">{stats.totalSeen}</div>
            <div className="text-sm font-pixel text-pixel-muted">TOTAL SEEN</div>
          </div>
          <div className="bg-pixel-surface border-2 border-pixel-text rounded-pixel p-4 shadow-pixel">
            <div className="text-2xl font-pixel font-bold text-pixel-cyan">{stats.totalGenerated}</div>
            <div className="text-sm font-pixel text-pixel-muted">TOTAL GENERATED</div>
          </div>
          <div className="bg-pixel-surface border-2 border-pixel-text rounded-pixel p-4 shadow-pixel">
            <div className="text-2xl font-pixel font-bold text-pixel-yellow">{stats.byRarity.Legendary}</div>
            <div className="text-sm font-pixel text-pixel-muted">LEGENDARY</div>
          </div>
          <div className="bg-pixel-surface border-2 border-pixel-text rounded-pixel p-4 shadow-pixel">
            <div className="text-2xl font-pixel font-bold text-pixel-purple">{stats.byRarity.Epic}</div>
            <div className="text-sm font-pixel text-pixel-muted">EPIC</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b-2 border-pixel-text">
            <nav className="-mb-px flex space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab('sequences')}
                className={`py-2 px-3 border-b-2 font-pixel font-bold text-sm rounded-pixel ${
                  activeTab === 'sequences'
                    ? 'border-pixel-accent text-pixel-accent bg-pixel-bg'
                    : 'border-transparent text-pixel-muted hover:text-pixel-text hover:bg-pixel-primary'
                }`}
              >
                SEQUENCES ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('achievements')}
                className={`py-2 px-3 border-b-2 font-pixel font-bold text-sm rounded-pixel ${
                  activeTab === 'achievements'
                    ? 'border-pixel-accent text-pixel-accent bg-pixel-bg'
                    : 'border-transparent text-pixel-muted hover:text-pixel-text hover:bg-pixel-primary'
                }`}
              >
                ACHIEVEMENTS ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Sequences Tab */}
        {activeTab === 'sequences' && (
          <div className="space-y-4">
            {sequences.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-pixel font-bold text-pixel-text mb-2">NO SEQUENCES COLLECTED YET</h3>
                <p className="font-pixel text-pixel-muted">Start using your 2FA codes to discover special sequences!</p>
              </div>
            ) : (
              sequences.map((sequence) => (
                <div
                  key={sequence.code}
                  className={`bg-pixel-surface border-2 rounded-pixel p-6 shadow-pixel-lg ${getRarityColor(sequence.rarity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getRarityIcon(sequence.rarity)}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-pixel font-bold">{sequence.code}</span>
                          <span className={`px-2 py-1 text-xs font-pixel font-bold rounded-pixel border ${getRarityColor(sequence.rarity)}`}>
                            {sequence.rarity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-pixel text-pixel-muted">{sequence.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-pixel font-bold text-pixel-text">×{sequence.count}</div>
                      <div className="text-xs font-pixel text-pixel-muted">
                        First seen: {formatDate(sequence.firstSeen)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-pixel-surface border-2 border-pixel-text rounded-pixel p-6 shadow-pixel ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-pixel font-bold text-pixel-text">{achievement.name}</h3>
                      {achievement.unlocked && (
                        <span className="px-2 py-1 text-xs font-pixel font-bold rounded-pixel border-2 border-pixel-green text-pixel-green bg-pixel-bg">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-pixel text-pixel-muted">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs font-pixel text-pixel-accent mt-1">
                        Unlocked: {formatDate(achievement.unlockedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;