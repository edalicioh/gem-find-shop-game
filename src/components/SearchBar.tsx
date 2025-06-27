
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-purple h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar gemas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-dark-800 border-neon-purple/40 text-white placeholder-gray-400 rounded-lg focus:border-neon-blue focus:ring-2 focus:ring-neon-purple/20 text-lg cyber-border"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 rounded-lg pointer-events-none" />
    </div>
  );
};

export default SearchBar;
