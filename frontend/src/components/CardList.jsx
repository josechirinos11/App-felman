// File: src/components/CardList.jsx
import React, { useEffect, useState } from 'react';

export default function CardList({ filter, onCardClick }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const endpoint = filter.type ? filter.type : 'items';
      const res = await fetch(`/api/${endpoint}?q=${filter.query}`, { credentials: 'include' });
      const data = await res.json();
      setItems(data);
    }
    fetchData();
  }, [filter]);

  return (
    <div className="card-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '20px' }}>
      {items.map(item => (
        <div key={item.id} className="card" onClick={() => onCardClick(item)} style={{
          padding: '20px',
          borderRadius: '12px',
          background: '#ebf0f5',
          boxShadow: '5px 5px 10px #bec8d2, -5px -5px 10px #ffffff',
          cursor: 'pointer'
        }}>
          <h3>{item.name}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}