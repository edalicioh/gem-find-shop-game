
import React, { useState, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import GemCard from '@/components/GemCard';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todas');

  const tags = ['Todas', 'Diamante', 'Rubi', 'Esmeralda', 'Safira', 'Ametista', 'Quartzo'];

  const gems = [
    { name: 'Diamante Celestial', type: 'Diamante Premium', price: 'R$ 2.500', rarity: 'Lendário' },
    { name: 'Rubi do Fogo', type: 'Rubi Especial', price: 'R$ 1.800', rarity: 'Épico' },
    { name: 'Esmeralda Mística', type: 'Esmeralda Rara', price: 'R$ 1.200', rarity: 'Raro' },
    { name: 'Safira dos Oceanos', type: 'Safira Azul', price: 'R$ 950', rarity: 'Raro' },
    { name: 'Ametista Sombria', type: 'Ametista Premium', price: 'R$ 750', rarity: 'Épico' },
    { name: 'Quartzo Rosa', type: 'Quartzo Natural', price: 'R$ 320', rarity: 'Comum' },
    { name: 'Diamante Negro', type: 'Diamante Raro', price: 'R$ 3.200', rarity: 'Lendário' },
    { name: 'Rubi Sangue', type: 'Rubi Imperial', price: 'R$ 2.100', rarity: 'Épico' },
  ];

  const filteredGems = useMemo(() => {
    return gems.filter(gem => {
      const matchesSearch = gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gem.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === 'Todas' || 
                        gem.type.toLowerCase().includes(selectedTag.toLowerCase());
      
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-blue to-neon-green bg-clip-text text-transparent mb-4">
            Crystal Market
          </h1>
          <p className="text-gray-400 text-xl">Descubra as gemas mais raras do universo gaming</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Tag Filter */}
        <div className="mb-12">
          <TagFilter 
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-neon-blue text-lg">
            {filteredGems.length} gema{filteredGems.length !== 1 ? 's' : ''} encontrada{filteredGems.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Gem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGems.map((gem, index) => (
            <GemCard
              key={index}
              name={gem.name}
              type={gem.type}
              price={gem.price}
              rarity={gem.rarity}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredGems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma gema encontrada</h3>
            <p className="text-gray-400">Tente ajustar seus filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
