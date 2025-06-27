
import React, { useState, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import GemCard from '@/components/GemCard';
import GemListItem from '@/components/GemListItem';
import ViewToggle from '@/components/ViewToggle';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    { name: 'Esmeralda do Vale', type: 'Esmeralda Premium', price: 'R$ 1.450', rarity: 'Épico' },
    { name: 'Safira Estelar', type: 'Safira Premium', price: 'R$ 1.150', rarity: 'Raro' },
    { name: 'Ametista Real', type: 'Ametista Especial', price: 'R$ 890', rarity: 'Raro' },
    { name: 'Quartzo Dourado', type: 'Quartzo Raro', price: 'R$ 520', rarity: 'Comum' },
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

  const totalPages = Math.ceil(filteredGems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGems = filteredGems.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        <div className="mb-8">
          <TagFilter 
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        </div>

        {/* View Controls and Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-neon-blue text-lg">
            {filteredGems.length} gema{filteredGems.length !== 1 ? 's' : ''} encontrada{filteredGems.length !== 1 ? 's' : ''}
          </p>
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Gem Display */}
        {currentGems.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentGems.map((gem, index) => (
                  <GemCard
                    key={`${gem.name}-${index}`}
                    name={gem.name}
                    type={gem.type}
                    price={gem.price}
                    rarity={gem.rarity}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {currentGems.map((gem, index) => (
                  <GemListItem
                    key={`${gem.name}-${index}`}
                    name={gem.name}
                    type={gem.type}
                    price={gem.price}
                    rarity={gem.rarity}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={`${
                          currentPage === 1 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-neon-purple/20 text-white border-neon-purple/40'
                        }`}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                          className={`${
                            currentPage === page
                              ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white'
                              : 'text-white border-neon-purple/40 hover:bg-neon-purple/20'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={`${
                          currentPage === totalPages 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-neon-purple/20 text-white border-neon-purple/40'
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          /* No Results */
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
