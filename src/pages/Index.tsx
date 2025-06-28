import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import GemCard from '@/components/GemCard';
import GemListItem from '@/components/GemListItem';
import GemDetailsModal from '@/components/GemDetailsModal';
import ViewToggle from '@/components/ViewToggle';
import { getDocumentsPaginated, getDocumentsCount, getPlatforms,updateDocument } from '../services/firestoreService';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

interface Game {
  id: string;
  titulo: string;
  platform_id: string;
  platform?: {
    id: string;
    name: string;
  };
  name?: string;
  type?: string;
  rarity?: string;
  link?: string;
  description?: string;
  version?: string;
  size?: string;
  releaseDate?: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [lastDocs, setLastDocs] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>(['Todas']);
  const [selectedGem, setSelectedGem] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Carregar plataformas para as tags
  const loadPlatforms = async () => {
    try {
      const platforms = await getPlatforms();
      const platformTags = ['Todas', ...platforms.map(platform => platform.name || platform.id)];
      setTags(platformTags);
    } catch (error) {
      console.error('Erro ao carregar plataformas:', error);
      setTags(['Todas', 'Xbox', 'PSP', 'PS2']); // Fallback para tags fixas
    }
  };

  // Função para carregar jogos
  const loadGames = async (page: number = 1, reset: boolean = false) => {
    setLoading(true);
    try {
      // Determinar o lastDoc baseado na página
      let lastDoc = null;
      if (page > 1 && lastDocs[page - 2]) {
        lastDoc = lastDocs[page - 2];
      }

      const result = await getDocumentsPaginated(
        'games',
        itemsPerPage,
        lastDoc,
        searchTerm,
        selectedTag
      );
      console.log(result);

      // Mapear dados para manter compatibilidade com componentes existentes
      const mappedGames = result.documents.map(game => ({
        ...game,
        name: game.titulo,
        type: game.platform?.name || game.platform_id || 'Desconhecido',
        rarity: 'Comum',
        description: `Jogo clássico de ${game.platform?.name || 'plataforma desconhecida'} com jogabilidade única.`,
        version: '1.0',
        size: '2.5 GB',
        releaseDate: '2005'
      }));

      console.log('Jogos mapeados com plataformas:', mappedGames);
      setGames(mappedGames);

      // Atualizar array de lastDocs
      if (reset) {
        setLastDocs([result.lastDoc]);
      } else {
        const newLastDocs = [...lastDocs];
        newLastDocs[page - 1] = result.lastDoc;
        setLastDocs(newLastDocs);
      }

    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar contagem total
  const loadTotalCount = async () => {
    try {
      const count = await getDocumentsCount('games', selectedTag);
      setTotalCount(count);
    } catch (error) {
      console.error('Erro ao carregar contagem:', error);
      setTotalCount(0);
    }
  };

  // Carregar plataformas na inicialização
  useEffect(() => {
    loadPlatforms();
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadTotalCount();
    loadGames(1, true);
    setCurrentPage(1);
    setLastDocs([]);
  }, [selectedTag]); // Recarregar quando o filtro de plataforma mudar

  // Recarregar quando o termo de busca mudar (com debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadGames(1, true);
      setCurrentPage(1);
      setLastDocs([]);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadGames(page);
  };

  const handleGemClick = (gem: Game) => {
    setSelectedGem(gem);
    buscarJogoPorNomeEPlataforma(gem)
    setIsModalOpen(true);
  };



  async function buscarJogoPorNomeEPlataforma(gem) {
    if (!gem?.platform_id || !gem?.name) {
      console.warn('Dados incompletos para busca:', gem);
      return;
    }

    const urlBusca = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(gem.name)}&platforms=${gem.platform_id}&page_size=1`;

    try {
      const response = await fetch(urlBusca);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log('Jogo não encontrado.');
        return;
      }

      const jogoBase = data.results[0];

      // Requisição de detalhes
      const urlDetalhes = `https://api.rawg.io/api/games/${jogoBase.id}?key=${API_KEY}`;
      const responseDetalhes = await fetch(urlDetalhes);
      const detalhes = await responseDetalhes.json();

      const resultado = {
        titulo: jogoBase.name,
        lancamento: jogoBase.released,
        imagem: jogoBase.background_image,
        plataformas: jogoBase.platforms?.map(p => p.platform.name) || [],
        descricao: detalhes.description_raw,
        score: detalhes.metacritic
      };

      console.log('Dados obtidos da API:', resultado);

      // Update Firebase record with the fetched data
      try {
        const updateData = {
          // Keep existing data and add new fields from RAWG API
          rawg_data: {
            name: resultado.titulo,
            released: resultado.lancamento,
            background_image: resultado.imagem,
            platforms: resultado.plataformas,
            description: resultado.descricao,
            metacritic_score: resultado.score,
            updated_at: new Date().toISOString()
          },
          // Update description if it was generic
          description: resultado.descricao || gem.description,
          // Add release date if available
          releaseDate: resultado.lancamento || gem.releaseDate,
          // Mark as enriched with RAWG data
          enriched_with_rawg: true,
          last_rawg_update: new Date().toISOString()
        };

        await updateDocument('games', gem.id, updateData);
        console.log('Registro atualizado no Firebase com sucesso');

        // Update the local state to reflect the changes
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gem.id
              ? {
                ...game,
                ...updateData,
                description: updateData.description,
                releaseDate: updateData.releaseDate
              }
              : game
          )
        );

        // Update selectedGem if it's the same game
        if (selectedGem?.id === gem.id) {
          setSelectedGem(prev => prev ? {
            ...prev,
            ...updateData,
            description: updateData.description,
            releaseDate: updateData.releaseDate
          } : null);
        }

      } catch (firebaseError) {
        console.error('Erro ao atualizar registro no Firebase:', firebaseError);
      }

    } catch (error) {
      console.error('Erro na requisição da API:', error.message);
    }
  }


  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-blue to-neon-green bg-clip-text text-transparent mb-4">
            Game Market
          </h1>
          <p className="text-gray-400 text-xl">Descubra os jogos mais raros para suas plataformas</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Platform Filter */}
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
            {loading ? 'Carregando...' : `${games.length} jogo${games.length !== 1 ? 's' : ''} encontrado${games.length !== 1 ? 's' : ''}`}
          </p>
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando jogos...</p>
          </div>
        )}

        {/* Game Display */}
        {!loading && games.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {games.map((game, index) => (
                  <GemCard
                    key={`${game.id}-${index}`}
                    name={game.name || game.titulo}
                    type={game.type || game.platform_id}
                    rarity={game.rarity || 'Comum'}
                    link={game.link || '#'}
                    onClick={() => handleGemClick(game)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {games.map((game, index) => (
                  <GemListItem
                    key={`${game.id}-${index}`}
                    name={game.name || game.titulo}
                    type={game.type || game.platform_id}
                    rarity={game.rarity || 'Comum'}
                    link={game.link || '#'}
                    onClick={() => handleGemClick(game)}
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
                        className={`${currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-neon-purple/20 text-white border-neon-purple/40'
                          }`}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                            className={`${currentPage === page
                                ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white'
                                : 'text-white border-neon-purple/40 hover:bg-neon-purple/20'
                              }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={`${currentPage === totalPages
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
        ) : !loading && (
          /* No Results */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <span className="text-3xl">🎮</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-400">Tente ajustar seus filtros de busca</p>
          </div>
        )}
      </div>

      {/* Modal de detalhes */}
      {selectedGem && (
        <GemDetailsModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          gem={{
            name: selectedGem.name || selectedGem.titulo,
            type: selectedGem.type || selectedGem.platform_id,
            rarity: selectedGem.rarity || 'Comum',
            link: selectedGem.link || '#',
            description: selectedGem.description,
            version: selectedGem.version,
            size: selectedGem.size,
            releaseDate: selectedGem.releaseDate
          }}
        />
      )}
    </div>
  );
};

export default Index;