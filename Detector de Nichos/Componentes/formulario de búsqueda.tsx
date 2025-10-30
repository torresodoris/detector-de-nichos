import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchFormProps {
  onSearch: (niche: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [niche, setNiche] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(niche);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-full shadow-lg overflow-hidden p-2">
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="Ej: 'Dueños de perros primerizos', 'Fotografía de drones', 'Cocina vegana'..."
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none px-4 py-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center bg-brand-secondary hover:bg-brand-primary disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-full p-3 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          <SearchIcon />
          <span className="sr-only">Analizar Nicho</span>
        </button>
      </div>
    </form>
  );
};