// Página plantilla base: src/pages/PageTemplate.jsx
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CardList from '../components/CardList';
import CardModal from '../components/CardModal';

export default function PageTemplate({ title }) {
  const [filter, setFilter] = useState({ type: '', query: '' });
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <SearchBar filter={filter} setFilter={setFilter} />
      <CardList filter={filter} onCardClick={setSelectedItem} />
      {selectedItem && <CardModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

