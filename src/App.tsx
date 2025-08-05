import React, { useState, useEffect } from 'react';
import { TOTPEntry } from './utils/totp';
import { loadEntries } from './utils/storage';
import RegistrationPage from './components/RegistrationPage';
import TokenListPage from './components/TokenListPage';
import CollectionPage from './components/CollectionPage';

function App() {
  const [entries, setEntries] = useState<TOTPEntry[]>([]);
  const [currentPage, setCurrentPage] = useState<'list' | 'register' | 'collection'>('list');

  useEffect(() => {
    const savedEntries = loadEntries();
    setEntries(savedEntries);
  }, []);

  const handleEntryAdded = (entry: TOTPEntry) => {
    setEntries(prev => [...prev, entry]);
  };

  const handleEntriesChange = (newEntries: TOTPEntry[]) => {
    setEntries(newEntries);
  };

  const showRegistration = () => {
    setCurrentPage('register');
  };

  const showTokenList = () => {
    setCurrentPage('list');
  };

  const showCollection = () => {
    setCurrentPage('collection');
  };

  return (
    <div className="App">
      {currentPage === 'register' ? (
        <RegistrationPage
          onEntryAdded={handleEntryAdded}
          onBack={showTokenList}
        />
      ) : currentPage === 'collection' ? (
        <CollectionPage onBack={showTokenList} />
      ) : (
        <TokenListPage
          entries={entries}
          onEntriesChange={handleEntriesChange}
          onAddNew={showRegistration}
          onShowCollection={showCollection}
        />
      )}
    </div>
  );
}

export default App;
