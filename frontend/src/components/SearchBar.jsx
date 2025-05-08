// File: src/components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ filter, setFilter }) {
  return (
    <div style={{ margin: '10px 0', display: 'flex', gap: '10px' }}>
      <input
        type="text"
        placeholder="Buscar..."
        value={filter.query}
        onChange={e => setFilter({ ...filter, query: e.target.value })}
        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
      />
      <select
        value={filter.type}
        onChange={e => setFilter({ ...filter, type: e.target.value })}
        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
      >
        <option value="">Todos</option>
        <option value="option1">Filtro 1</option>
        <option value="option2">Filtro 2</option>
      </select>
    </div>
  );
}
